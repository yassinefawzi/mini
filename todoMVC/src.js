import { defineRoutes, navigateTo } from "../framework/route.js";
import { createElement, init, render } from "../framework/dom.js";
import { useState } from "../framework/state.js";

// Define state management for the todo app
let [input, setInput] = useState("todoInput", "");
let [todos, setTodos] = useState("todos", []);

function handleKeyDown(e) {
  if (e.key === "Enter" && input.trim()) {
    setTodos([...todos, { text: input, completed: false }]);
    setInput("");
  }
}

// Define routes
defineRoutes({
  "/": renderTodo,
});

// Main component
function renderTodo() {
  return {
    tag: "section",
    attrs: {
      class: "todoapp",
      id: "root"
    },
    children: [
      {
        tag: "header",
        attrs: {
          class: "header",
          "data-testid": "header"
        },
        children: [
          { tag: "h1", children: ["todos"] },
          {
            tag: "div",
            attrs: { class: "input-container" },
            children: [
              {
                tag: "input",
                attrs: {
                  class: "new-todo",
                  id: "todo-input",
                  type: "text",
                  value: input,
                  placeholder: "What needs to be done?",
                  "data-testid": "text-input",
                  oninput: (e) => setInput(e.target.value),
                  onkeydown: handleKeyDown,
                }
              },
              {
                tag: "label",
                attrs: {
                  class: "visually-hidden",
                  for: "todo-input"
                },
                children: ["New Todo Input"]
              }
            ]
          }
        ]
      },
      // Todo list section
      {
        tag: "section",
        attrs: { class: "main" },
        children: [
          {
            tag: "ul",
            attrs: { class: "todo-list" },
            children: todos.map((todo, index) => ({
              tag: "li",
              attrs: { class: todo.completed ? "completed" : "" },
              children: [
                {
                  tag: "div",
                  attrs: { class: "view" },
                  children: [
                    {
                      tag: "input",
                      attrs: {
                        class: "toggle",
                        type: "checkbox",
                        checked: todo.completed,
                        onchange: () => toggleTodo(index)
                      }
                    },
                    { tag: "label", children: [todo.text] },
                    {
                      tag: "button",
                      attrs: {
                        class: "destroy",
                        onclick: () => removeTodo(index)
                      }
                    }
                  ]
                }
              ]
            }))
          }
        ]
      }
    ]
  };
}

function toggleTodo(index) {
  const updatedTodos = [...todos];
  updatedTodos[index].completed = !updatedTodos[index].completed;
  setTodos(updatedTodos);
}

function removeTodo(index) {
  setTodos(todos.filter((_, i) => i !== index));
}

// Initialize the app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app");
  init(renderTodo, appContainer);
});