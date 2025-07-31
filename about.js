import { navigateTo } from "./route.js";

export default function About() {
  return {
    tag: "div",
    children: [
      { tag: "h1", children: ["About Page"] },
      { tag: "p", children: ["This is a simple about page using your mini-framework."] },
      {
        tag: "button",
        attrs: {
          onclick: () => navigateTo("/"),
        },
        children: ["Back to Home"],
      },
    ],
  };
}
