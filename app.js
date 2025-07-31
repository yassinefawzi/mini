import { init } from "./dom.js";
import { useState } from "./state.js";

function App() {
  const [count, setCount] = useState("count", 0);

   const [count1, setCount1] = useState("count1", 0);

  return {
    tag: "div",
    attrs: { class: "main" },
    children: [
      { tag: "h2", children: ["Welcome"] },
      { tag: "p", children: [`This is test #${count}`] },
      {
        tag: "button",
        attrs: {
          id: "updateBtn",
          onclick: () => setCount(count + 1),
        },
        children: ["Update Count"],
      },
      { tag: "h2", children: ["Welcome"] },
      { tag: "p", children: [`This is test #${count1}`] },
      {
        tag: "button",
        attrs: {
          id: "updateBtn1",
          onclick: () => setCount1(count1 - 1),
        },
        children: ["Decrease Count1"],
      },
    ],
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("app");
  init(App, root);
});
