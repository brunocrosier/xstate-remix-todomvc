// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    "toggle status locally": "Status Checkbox Change";
    "update parent": "Status Checkbox Change" | "Save";
    "delete todo": "Click Delete Button";
    "update input": "Type in input";
    "restore todo to previous value": "Cancel";
  };
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: "Reading" | "Editing";
  tags: never;
}
