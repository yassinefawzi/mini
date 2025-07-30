import { render } from "./dom.js";

export let globalState = {};
let listeners = {};

export function useState(key, initialValue) {
  if (!(key in globalState)) {
    globalState[key] = initialValue;
  }

  function getState() {
    return globalState[key]; // always fresh
  }

  function setState(newValue) {
    globalState[key] = newValue;
    render(); // trigger re-render
  }


  return [getState, setState]; // 👈 return a getter function
}
