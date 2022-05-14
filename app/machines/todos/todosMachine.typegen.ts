// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    "remove todo from context": "Delete Todo";
    "save to localstorage":
      | "Delete Todo"
      | "Update todo"
      | "Clear Completed Todos"
      | "Save todo";
    "copy todo from child to parent": "Update todo";
    "update context to remove todos with `Completed` status": "Clear Completed Todos";
    "update input": "Type in input";
    "clear input": "Save todo";
    "add new todo to context": "Save todo";
    "apply filter": "Select filter";
    "rehydrate persisted todos": "xstate.init";
  };
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions:
      | "remove todo from context"
      | "save to localstorage"
      | "copy todo from child to parent"
      | "update context to remove todos with `Completed` status"
      | "update input"
      | "clear input"
      | "add new todo to context"
      | "apply filter"
      | "rehydrate persisted todos";
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: "Loading" | "Ready";
  tags: never;
}
