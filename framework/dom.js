import { handleRoute } from "./route.js";
import { setInitialized } from "./state.js";

let currentVDOM = null;
let rootComponent = null;
export let rootContainer = null;

export function getCurrentVDOM() {
  return currentVDOM;
}

export function setCurrentVDOM(vdom) {
  currentVDOM = vdom;
}

//init function to set up the root component and container
export function init(componentFunc, container) {
  rootComponent = componentFunc;
  rootContainer = container;
  currentVDOM = rootComponent();
  rootContainer.appendChild(createElement(currentVDOM));

  window.onhashchange = handleRoute;
  window.onload = handleRoute;

  setInitialized();
}

// render function to update the current VDOM
export function render() {
  const nextVDOM = rootComponent();
  updateElement(rootContainer, nextVDOM, currentVDOM);
  currentVDOM = nextVDOM;
}

// createElement function to convert VDOM to actual DOM elements
export function createElement(vnode) {
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }

  const element = document.createElement(vnode.tag);

  if (vnode.attrs) {
    for (const [key, value] of Object.entries(vnode.attrs)) {
      if (key.startsWith("on") && typeof value === "function") {
        element[key.toLowerCase()] = value;
      } else if (key === "value") {
        element.value = value;
      } else if (key === "checked") {
        element.checked = value;
      } else {
        element.setAttribute(key, value);
      }
    }
  }

  if (vnode.children) {
    vnode.children.forEach((child) => {
      element.appendChild(createElement(child));
    });
  }

  return element;
}

function isDifferent(node1, node2) {
  return (
    typeof node1 !== typeof node2 ||
    (typeof node1 === "string" && node1 !== node2) ||
    node1.tag !== node2.tag
  );
}

// Function to update attributes of a DOM element
function updateAttributes(domElement, newAttrs, oldAttrs) {
  for (const [key, value] of Object.entries(newAttrs)) {
    if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.toLowerCase();
      if (oldAttrs[key] !== value) {
        domElement[eventName] = value;
      }
    } else {
      if (key === "value") {
        if (domElement.value !== value) {
          domElement.value = value;
        }
      } else if (key === "checked") {
        domElement.checked = value;
      } else if (oldAttrs[key] !== value) {
        domElement.setAttribute(key, value);
      }
    }
  }

  for (const key of Object.keys(oldAttrs)) {
    if (!(key in newAttrs)) {
      if (key.startsWith("on") && typeof oldAttrs[key] === "function") {
        const eventName = key.toLowerCase();
        domElement[eventName] = null;
      } else if (key === "checked") {
        domElement.checked = false;
      } else {
        domElement.removeAttribute(key);
      }
    }
  }
}

// Function to update the DOM element based on the new and old VDOM
export function updateElement(parent, newVNode, oldVNode, index = 0) {
  const existing = parent.childNodes[index];

  if (!oldVNode) {
    if (!existing) {
      parent.appendChild(createElement(newVNode));
    } else {
      parent.replaceChild(createElement(newVNode), existing);
    }
  } else if (!newVNode) {
    if (existing) parent.removeChild(existing);
  } else if (isDifferent(newVNode, oldVNode)) {
    parent.replaceChild(createElement(newVNode), existing);
  } else if (newVNode.tag) {
    updateAttributes(existing, newVNode.attrs || {}, oldVNode.attrs || {});

    const newChildren = newVNode.children || [];
    const oldChildren = oldVNode.children || [];
    const max = Math.max(newChildren.length, oldChildren.length);

    for (let i = max - 1; i >= 0; i--) {
      updateElement(existing, newChildren[i], oldChildren[i], i);
    }
  }
}
