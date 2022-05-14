import type { Request } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useMachine } from "@xstate/react";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import { assign, spawn } from "xstate";
import { Todo } from "~/components/todo";
import { createTodoMachine } from "~/machines/todo/createTodoMachine";
import type { Todo as TodoType } from "~/machines/todos/todosMachine";
import { todosMachine } from "~/machines/todos/todosMachine";

export async function loader({ request }: { request: Request }) {
  const cookieHeader = request.headers.get("Cookie");

  console.log({ cookieHeader: cookieHeader?.split("=")[1] });

  // const persistedTodosCookie =
  //   cookieHeader
  //     ?.split("; ")
  //     .map((n) => n.split("="))
  //     .find((n) => n[0] === "todos-xstate") || [];

  // const persistedTodos = persistedTodosCookie[1] ?? [];

  //   return json({ persistedTodos: decodeURI(persistedTodos) });

  return json({
    persistedTodos: cookieHeader ? JSON.parse(cookieHeader.split("=")[1]) : [],
  });
}

export default function Todos() {
  const { persistedTodos } = useLoaderData();

  console.log("loader data:", persistedTodos);

  const [
    {
      context: { filter, inputValue, todos },
    },
    send,
  ] = useMachine(todosMachine, {
    actions: {
      "clear input": assign({
        inputValue: "",
      }),
      "update input": assign({
        inputValue: (ctx, evt) => evt.inputText,
      }),
      "add new todo to context": assign({
        todos: (ctx) => {
          const newTodo = createTodo(inputValue);

          return ctx.todos.concat({
            ...newTodo,
            ref: spawn(createTodoMachine(newTodo), { sync: true }),
          });
        },
      }),
      "apply filter": assign({
        filter: (_, evt) => evt.filter,
      }),
      "rehydrate persisted todos": assign({
        todos: () => {
          return persistedTodos.map((todo: TodoType) => ({
            ...todo,
            ref: spawn(
              createTodoMachine({
                id: todo.id,
                status: todo.status,
                title: todo.title,
              })
            ),
          }));
        },
      }),
      "copy todo from child to parent": assign({
        todos: (ctx, evt) =>
          ctx.todos.map((todo) => {
            return todo.id === evt.todo.id
              ? { ...todo, ...evt.todo, ref: todo.ref }
              : todo;
          }),
      }),
      "remove todo from context": assign({
        todos: (ctx, evt) => {
          return ctx.todos.filter((todo) => todo.id !== evt.todo.id);
        },
      }),
      "update context to remove todos with `Completed` status": assign({
        todos: (ctx) => ctx.todos.filter((todo) => todo.status !== "Completed"),
      }),
      "save to localstorage": (ctx) => {
        try {
          document.cookie = `todos-xstate=${JSON.stringify(ctx.todos)}`;
        } catch (e) {
          console.error(e);
        }
      },
    },
    devTools: process.env.NODE_ENV !== "production",
  });

  const activeTodosCount = todos.filter(
    (todo) => todo.status === "Active"
  ).length;

  const onInputChange = useCallback(
    (e) => {
      send({ type: "Type in input", inputText: e.currentTarget.value });
    },
    [send]
  );

  const createTodo = (title: string): TodoType => {
    return {
      id: nanoid(),
      title,
      status: "Active",
    };
  };

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              send({ type: "Save todo" });
            }
          }}
        />
      </header>
      <section className="main">
        <input id="toggle-all" className="toggle-all" type="checkbox" />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {todos
            .filter((n) => {
              if (filter === "All") {
                return n;
              } else {
                return n.status === filter;
              }
            })
            .map((todo) => (
              <Todo key={todo.id} todoRef={todo.ref as any} />
            ))}
        </ul>
      </section>
      {todos && (
        <footer className="footer">
          <span className="todo-count">
            <strong>{activeTodosCount}</strong> item
            {activeTodosCount === 1 ? null : "s"} left
          </span>
          <ul className="filters">
            <li>
              <a
                className="selected"
                href="#/"
                onClick={(e) => {
                  e.preventDefault();
                  send({ type: "Select filter", filter: "All" });
                }}
              >
                All
              </a>
            </li>
            <li>
              <a
                href="#/active"
                onClick={(e) => {
                  e.preventDefault();
                  send({ type: "Select filter", filter: "Active" });
                }}
              >
                Active
              </a>
            </li>
            <li>
              <a
                href="#/completed"
                onClick={(e) => {
                  e.preventDefault();
                  send({ type: "Select filter", filter: "Completed" });
                }}
              >
                Completed
              </a>
            </li>
          </ul>
          {activeTodosCount < todos.length && (
            <button
              className="clear-completed"
              onClick={() => {
                send({ type: "Clear Completed Todos" });
              }}
            >
              Clear completed
            </button>
          )}
        </footer>
      )}
    </section>
  );
}
