import { assign, createMachine } from "xstate";
import { sendParent } from "xstate/lib/actions";
import type { FilterOptions } from "../todos/todosMachine";

export const createTodoMachine = ({
  id,
  title,
  status,
}: {
  id: string;
  title: string;
  status: Exclude<FilterOptions, "All">;
}) =>
  /** @xstate-layout N4IgpgJg5mDOIC5QBUD2FUDoBKYCGEAlgHZQDEAYqgMYCu8SIADqrIQC6GrGKgAeiALQBGAKwBOTAGYADMIDsUgGwAOACzyVK0WoBMAGhABPRHsy6VutWrmjdoh8N0BfZ4bQZMAUSKdSZAGkwI1h2ACdUAGswXmZWDi4eRgEEFWFzeStNJRyZTTUpQxMEQTMZKTUlZTUVCplRFXklV3d0LB8E-wAhABtaMNiWNk5uWJTBXXElTGE1cRVxepklBo15IsRdJsxxa3slSd0jqVEWkA923xJyAGE8YmowHsH4kaT+IROpTBkVJT1tOItmpRIoNggxNNVFsrAd5mkpmcLmQAMrsPDsegAAhuAAswNRIgAjVB8HG4+4wF7DRJjITWSQguxSXQKGriBzrYxCVlqH6iZbyCS7UTCRryJFtMg3HqEQlYgAiTzA7DAWK6tHY7FGjCGCR1HxKs2moiUmQkrNkApq4ImQswINqShkWzy8jkrjcIGI6DgsQuOHwRFI1P17xA4xW0zmaR0MIKaXB4m+ihkiwWWhs4g5ks8HT8UFDbzpqXMk2Ei0mOVZs2E4OEFcwlnsdgOTVqINzqCLtOSQlUMgd8zEekyCbr3KNYh+FQOWikQqkUmEzU9QA */
  createMachine(
    {
      context: { id, initialTitle: title, title, status },
      tsTypes: {} as import("./createTodoMachine.typegen").Typegen0,
      schema: {
        context: {} as {
          id: string;
          initialTitle: string;
          title: string;
          status: Exclude<FilterOptions, "All">;
        },
        events: {} as
          | { type: "Status Checkbox Change" }
          | { type: "Click Delete Button" }
          | { type: "Save" }
          | { type: "Cancel" }
          | { type: "Type in input"; inputText: string }
          | { type: "Focus" }
          | { type: "Blur" },
      },
      preserveActionOrder: true,
      id: "Todo",
      initial: "Reading",
      states: {
        Reading: {
          on: {
            Focus: {
              target: "Editing",
            },
          },
        },
        Editing: {
          on: {
            "Type in input": {
              actions: "update input",
            },
            Blur: {
              target: "Reading",
            },
            Cancel: {
              actions: "restore todo to previous value",
              target: "Reading",
            },
            Save: {
              actions: "update parent",
              target: "Reading",
            },
          },
        },
      },
      on: {
        "Status Checkbox Change": {
          actions: ["toggle status locally", "update parent"],
        },
        "Click Delete Button": {
          actions: "delete todo",
        },
      },
    },
    {
      actions: {
        "toggle status locally": assign({
          status: (ctx) => (ctx.status === "Active" ? "Completed" : "Active"),
        }),
        "update parent": sendParent((ctx) => ({
          type: "Update todo",
          todo: {
            id: ctx.id,
            initialTitle: ctx.title,
            title: ctx.title,
            status: ctx.status,
          },
        })),
        "restore todo to previous value": assign({
          title: (ctx) => ctx.initialTitle,
        }),
        "update input": assign({
          title: (ctx, evt) => evt.inputText,
        }),
        "delete todo": sendParent((ctx) => ({
          type: "Delete Todo",
          todo: {
            id: ctx.id,
            initialTitle: ctx.title,
            title: ctx.title,
            status: ctx.status,
          },
        })),
      },
    }
  );
