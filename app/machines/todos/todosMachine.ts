import type { ActorRefWithDeprecatedState } from "xstate";
import { createMachine } from "xstate";

export type TodoStatus = "Active" | "Completed";
export type FilterOptions = TodoStatus | "All";
export type Todo = {
  id: string;
  title: string;
  status: TodoStatus;
  ref?: ActorRefWithDeprecatedState<
    {
      id: string;
      title: string;
      status: TodoStatus;
    },
    any,
    any,
    any
  >;
};

export const todosMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBUD2FWwHQBlUEMIBLAOygGJFQAHTIgFyNRKpAA9EAmAdk604BsADk4AWAJwBWAIzTu0od0kAaEAE9Ek0QGYso0ZO0AGI7LPbJAX0uq0GbACUwhNeWRrqYAASkfJagCu9Ky0sAxMLEjsiKJGfOLaAtLi3KICnHGKAqoaCAbiWEZCsRkyipzaQtrWtuiYWE4u5ADK+ABu3vR1IXSMzKwcCIlCWJJCQoZa0oYJ3DmI2jqFxUYWkpxy3ELiAjUgdvWNEK7NYAA2YADG9F4AZkRn9GAATj1hfZGgg6LSRnqcVXERiUQgEAm0c3UXEkAmWsQUol4Ex4ewOsHIABFzmAnl4Dm9wv0ooM5LDkuDwUYtCttNp5ggZFghEZ9AJxDwITpUXV0QBVagQfC4roYAkfAYxbiwzjiaQ-SRFaSLbTiemM5ms9ncTnGTjWGwgEjoOCsNG4AjEMhiiISvKQ3LrMkGbRKkymUzibn2BrOY7WolfGIVLBA2VAqUJOKcNWMooq9baCqmCZezD+z7RBAVekKXRFWIlKSI4r6yxAA */
  createMachine({
    context: {
      inputValue: "",
      filter: "All",
      todos: [],
    },
    tsTypes: {} as import("./todosMachine.typegen").Typegen0,
    schema: {
      context: {} as {
        inputValue: string;
        filter: FilterOptions;
        todos: Todo[];
      },
      events: {} as
        | { type: "Type in input"; inputText: string }
        | { type: "Save todo" }
        | { type: "Select filter"; filter: FilterOptions }
        | { type: "Update todo"; todo: Todo }
        | { type: "Delete Todo"; todo: Todo }
        | { type: "Clear Completed Todos" },
    },
    preserveActionOrder: true,
    id: "Todos",
    initial: "Loading",
    states: {
      Loading: {
        entry: "rehydrate persisted todos",
        always: {
          target: "Ready",
        },
      },
      Ready: {
        on: {
          "Type in input": {
            actions: "update input",
          },
          "Save todo": {
            actions: [
              "clear input",
              "add new todo to context",
              "save to localstorage",
            ],
          },
          "Select filter": {
            actions: "apply filter",
          },
        },
      },
    },
    on: {
      "Delete Todo": {
        actions: ["remove todo from context", "save to localstorage"],
      },
      "Update todo": {
        actions: ["copy todo from child to parent", "save to localstorage"],
      },
      "Clear Completed Todos": {
        actions: [
          "update context to remove todos with `Completed` status",
          "save to localstorage",
        ],
      },
    },
  });
