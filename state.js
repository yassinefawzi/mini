import { render } from "./dom.js";

export let globalState = {};
let listeners = {};

export function useState(key, initialValue) {
  if (!(key in globalState)) {
    globalState[key] = initialValue;
  }

  function getState() {
    return globalState[key];
  }

  function setState(newValue) {
    globalState[key] = newValue;
    render();
  }


  return [getState, setState]; // 👈 return a getter function
}
