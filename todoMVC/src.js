import { defineRoutes, navigateTo } from "../framework/route.js";
import { createElement, init, render } from "../framework/dom.js";
import { useState } from "../framework/state.js";

// Define state management for the todo app
const [getInput, setInput] = useState("todoInput", "");
const [getTodos, setTodos] = useState("todos", []);

function handleKeyDown(e) {
  console.log("current input:", getInput());
  if (e.key === "Enter" && getInput().trim()) {
    setTodos([...getTodos(), { text: getInput(), completed: false }]);
    setInput("");
  }
}

function handleInputChange(e) {
  console.log("Setting input to:", e.target.value);
  setInput(e.target.value);
}

// Define routes
defineRoutes({
  "/": renderTodo,
});

// Main component
function renderTodo() {
  const currentTodos = getTodos(); // Get current todos array
  const currentInput = getInput(); // Get current input value

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
                  value: currentInput,
                  placeholder: "What needs to be done?",
                  "data-testid": "text-input",
                  oninput: handleInputChange,
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
            children: currentTodos.map((todo, index) => ({
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
                        // checked: todo.completed,
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
      },
      {
        tag: "footer",
        attrs: {
          class: "footer",
          "data-testid": "footer",
          children: [
            {
              tag: "span",
              attrs: {
                class: "todo-count",
              },
              children: [
                `${currentTodos.filter(t => !t.completed).length} items left!`,
              ],
            },
            {
              tag: "ul",
              attrs: {
                class: "filters",
                "data-testid": "footer-navigation"
              },
              children: [
                {
                  tag: "li",
                  children: [
                    {
                      tag: "a",
                      attrs: {
                        class: selectedFilter === "All" ? "selected" : "", href: "/" 
                      },
                    }
                  ],
                },
              ],
            },
          ],
        },
      }
    ]
  };
}

function toggleTodo(index) {
  const currentTodos = getTodos();
  const updatedTodos = [...currentTodos];
  updatedTodos[index].completed = !updatedTodos[index].completed;
  setTodos(updatedTodos);
}

function removeTodo(index) {
  const currentTodos = getTodos();
  setTodos(currentTodos.filter((_, i) => i !== index));
}

// Initialize the app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app");
  init(renderTodo, appContainer);
});