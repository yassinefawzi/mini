
let currentVDOM = null;
let rootComponent = null;
let rootContainer = null;

export function init(componentFunc, container) {
  rootComponent = componentFunc;
  rootContainer = container;
  currentVDOM = rootComponent();
  rootContainer.appendChild(createElement(currentVDOM));
}

export function render() {
  const nextVDOM = rootComponent();
  updateElement(rootContainer, nextVDOM, currentVDOM);
  currentVDOM = nextVDOM;
}

export function createElement(vnode) {
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }

  const element = document.createElement(vnode.tag);

  if (vnode.attrs) {
    for (const [key, value] of Object.entries(vnode.attrs)) {
      if (key.startsWith("on") && typeof value === "function") {
        element.addEventListener(key.slice(2).toLowerCase(), value);
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

function updateAttributes(domElement, newAttrs, oldAttrs) {
  for (const [key, value] of Object.entries(newAttrs)) {
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.slice(2).toLowerCase();
      if (oldAttrs[key] && oldAttrs[key] !== value) {
        domElement.removeEventListener(eventType, oldAttrs[key]);
      }
      domElement.addEventListener(eventType, value);
    } else {
      if (oldAttrs[key] !== value) {
        domElement.setAttribute(key, value);
      }
    }
  }
  for (const key of Object.keys(oldAttrs)) {
    if (!(key in newAttrs)) {
      if (key.startsWith("on") && typeof oldAttrs[key] === "function") {
        domElement.removeEventListener(key.slice(2).toLowerCase(), oldAttrs[key]);
      } else {
        domElement.removeAttribute(key);
      }
    }
  }
}


function updateElement(parent, newVNode, oldVNode, index = 0) {
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

    for (let i = 0; i < max; i++) {
      updateElement(existing, newChildren[i], oldChildren[i], i);
    }
  }
}
