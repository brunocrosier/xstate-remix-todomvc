import { useActor } from "@xstate/react";
import type { ActorRefFrom } from "xstate";
import type { createTodoMachine } from "~/machines/todo/createTodoMachine";
import cn from "classnames";

export const Todo = ({
  todoRef,
}: {
  todoRef: ActorRefFrom<typeof createTodoMachine>;
}) => {
  const [
    {
      context: { status, id, title },
      matches,
    },
    send,
  ] = useActor(todoRef);

  return (
    <li
      className={cn({
        editing: matches("Editing"),
        completed: status === "Completed",
      })}
      data-todo-state={status.toLowerCase()}
      key={id}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          onChange={() => {
            send({ type: "Status Checkbox Change" });
          }}
          value={status}
          checked={status === "Completed"}
        />
        <label
          onDoubleClick={(e) => {
            send({ type: "Focus" });
          }}
        >
          {title}
        </label>{" "}
        <button
          className="destroy"
          onClick={() => {
            send({ type: "Click Delete Button" });
          }}
        />
      </div>
      <input
        className="edit"
        value={title}
        onBlur={() => {
          send({ type: "Blur" });
        }}
        onChange={(e) => {
          send({ type: "Type in input", inputText: e.target.value });
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            send({ type: "Save" });
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            send({ type: "Cancel" });
          }
        }}
        //   ref={inputRef}
      />
    </li>
  );
};
