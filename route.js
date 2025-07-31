import { updateElement, rootContainer, getCurrentVDOM, setCurrentVDOM } from "./dom.js";

let routes = {};

export function defineRoutes(routeMap) {
  routes = routeMap;
}

export function handleRoute() {
  const path = window.location.hash.slice(1) || "/";
  const component = routes[path];

  if (component) {
    const newVDOM = component();

    setCurrentVDOM(null);

    updateElement(rootContainer, newVDOM, null);
    setCurrentVDOM(newVDOM);
  } else {
    console.warn("Route not found:", path);
  }
}



export function navigateTo(path) {
  window.location.hash = path;
}
