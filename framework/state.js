import { render } from "./dom.js";

export let globalState = {};
let listeners = {};
let initialized = false;

export function useState(key, initialValue) {
  if (!(key in globalState)) {    
    globalState[key] = initialValue;
  }

  function getState() {
    return globalState[key];
  }
  
  function setState(newValue) {
    globalState[key] = newValue;
    if (initialized) {
      render();
    }
  }

  return [getState, setState];
}

export function setInitialized() {
  initialized = true;
}