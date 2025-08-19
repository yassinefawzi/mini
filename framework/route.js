import { updateElement, rootContainer, setCurrentVDOM } from "./dom.js";

let routes = {};

// Function to define routes and their corresponding components
export function defineRoutes(routeMap) {
  routes = routeMap;
  handleRoute();
}

// Function to handle route changes based on the current URL hash
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

// function to navigate to a specific path
export function navigateTo(path) {
  window.location.hash = path;
}
