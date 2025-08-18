import { defineRoutes, navigateTo } from "../framework/route.js";
import { createElement, init, render } from "../framework/dom.js";
import { useState } from "../framework/state.js";

// Define state management for the todo app
const [getInput, setInput] = useState("todoInput", "");
const [getTodos, setTodos] = useState("todos", []);
const [getEditingID, setEditingID] = useState("editingID", null);
const [getEditingText, setEditingText] = useState("editingText", "");
const [getSelectedFilter, setSelectedFilter] = useState("filter", "All");

function handleKeyDown(e) {
  if (e.key === "Enter" && getInput().trim()) {
    if (getInput().trim().length <= 1) return;

    const newTodo = {
      text: getInput().trim(),
      id: Date.now(),
      completed: false,
    };
    setTodos([...getTodos(), newTodo]);
    setInput("");
  }
}

function handleInputChange(e) {
  setInput(e.target.value);
}

function toggleTodo(id) {
  const updatedTodos = getTodos().map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  setTodos(updatedTodos);
}

function removeTodo(id) {
  setTodos(getTodos().filter(todo => todo.id !== id));
}

function clearCompleted() {
  setTodos(getTodos().filter(todo => !todo.completed));
}

function handleAllToggle() {
  const allCompleted = getTodos().every(todo => todo.completed);
  const updatedTodos = getTodos().map(todo => ({
    ...todo,
    completed: !allCompleted,
  }));
  setTodos(updatedTodos);
}

function startEditing(todo) {
  setEditingID(todo.id);
  setEditingText(todo.text);
}

function saveEditedTask(id) {
  const updatedTodos = getTodos().map(todo => {
    if (todo.id === id) {
      return {
        ...todo,
        text: getEditingText().trim() || todo.text, // Fallback to original if empty
      };
    }
    return todo;
  });

  setTodos(updatedTodos);
  setEditingID(null);
  setEditingText("");
}

function handleEditKeyDown(e, id) {
  if (e.key === "Enter") {
    saveEditedTask(id);
  }
}

function filterTodos(todos, filter) {
  console.log("todos : ", todos);
  console.log("filter : ", filter);
  
  switch (filter) {
    case "Active": return todos.filter(todo => !todo.completed);
    case "Completed": return todos.filter(todo => todo.completed);
    default: return todos;
  }
}

// Main component
function renderTodo() {
  const currentTodos = getTodos();
  const currentInput = getInput();
  const selectedFilter = getSelectedFilter();
  const filteredTasks = filterTodos(currentTodos, selectedFilter);
  const editingID = getEditingID();
  const allCompleted = currentTodos.length > 0 && currentTodos.every(t => t.completed);

  console.log("filtered : ", filteredTasks);
  

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
      {
        tag: "section",
        attrs: {
          class: "main",
          "data-testid": "main"
        },
        children: [
          ...(filteredTasks.length ? [{
            tag: "div",
            attrs: { class: "toggle-all-container" },
            children: [
              {
                tag: "input",
                attrs: {
                  class: "toggle-all",
                  type: "checkbox",
                  id: "toggle-all",
                  "data-testid": "toggle-all",
                  onclick: handleAllToggle,
                  checked: allCompleted
                }
              },
              {
                tag: "label",
                attrs: {
                  class: "toggle-all-label",
                  for: "toggle-all"
                }
              }
            ]
          }] : []),
          {
            tag: "ul",
            attrs: {
              class: "todo-list",
              "data-testid": "todo-list"
            },
            children: filteredTasks.map(todo => ({
              tag: "li",
              attrs: {
                class: `${todo.completed ? "completed" : ""} ${editingID === todo.id ? "editing" : ""}`,
                "data-testid": "todo-item"
              },
              children: [
                editingID === todo.id ? {
                  tag: "input",
                  attrs: {
                    class: "edit",
                    type: "text",
                    value: getEditingText(),
                    oninput: (e) => setEditingText(e.target.value),
                    onkeydown: (e) => handleEditKeyDown(e, todo.id),
                    onblur: () => saveEditedTask(todo.id),
                    autofocus: true
                  }
                } : {
                  tag: "div",
                  attrs: { class: "view" },
                  children: [
                    {
                      tag: "input",
                      attrs: {
                        class: "toggle",
                        type: "checkbox",
                        checked: todo.completed,
                        onchange: () => toggleTodo(todo.id),
                        "data-testid": "todo-item-toggle"
                      }
                    },
                    {
                      tag: "label",
                      attrs: {
                        ondblclick: () => startEditing(todo),
                        "data-testid": "todo-item-label"
                      },
                      children: [todo.text]
                    },
                    {
                      tag: "button",
                      attrs: {
                        class: "destroy",
                        onclick: () => removeTodo(todo.id),
                        "data-testid": "todo-item-button"
                      }
                    }
                  ]
                }
              ]
            }))
          }
        ]
      },
      ...(currentTodos.length > 0 ? [{
        tag: "footer",
        attrs: {
          class: "footer",
          "data-testid": "footer"
        },
        children: [
          {
            tag: "span",
            attrs: { class: "todo-count" },
            children: [`${currentTodos.filter(t => !t.completed).length} items left!`]
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
                children: [{
                  tag: "a",
                  attrs: {
                    class: selectedFilter === "All" ? "selected" : "",
                    href: "#/",
                    onclick: (e) => {
                      e.preventDefault();
                      navigateTo("/");
                    }
                  },
                  children: ["All"]
                }]
              },
              {
                tag: "li",
                children: [{
                  tag: "a",
                  attrs: {
                    class: selectedFilter === "Active" ? "selected" : "",
                    href: "#/active",
                    onclick: (e) => {
                      e.preventDefault();
                      navigateTo("/active");
                    }
                  },
                  children: ["Active"]
                }]
              },
              {
                tag: "li",
                children: [{
                  tag: "a",
                  attrs: {
                    class: selectedFilter === "Completed" ? "selected" : "",
                    href: "#/completed",
                    onclick: (e) => {
                      e.preventDefault();
                      navigateTo("/completed");
                    }
                  },
                  children: ["Completed"]
                }]
              }
            ]
          },
          {
            tag: "button",
            attrs: {
              class: "clear-completed",
              onclick: clearCompleted
            },
            children: ["Clear completed"]
          }
        ]
      }] : [])
    ]
  };
}

const appContainer = document.getElementById("app");

// Then initialize the app
init(renderTodo, appContainer);

// First define routes
defineRoutes({
  "/": () => {
    setSelectedFilter("All");
    return renderTodo();
  },
  "/active": () => {
    setSelectedFilter("Active");
    return renderTodo();
  },
  "/completed": () => {
    setSelectedFilter("Completed");
    return renderTodo();
  },
});

// Handle initial route
if (!window.location.hash) {
  navigateTo("/");
}