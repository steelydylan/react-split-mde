import markdownHTML from "zenn-markdown-html";

const ctx: Worker = self as any;

// Respond to message from parent thread
ctx.addEventListener("message", (event) => {
  const result = markdownHTML(event.data);
  ctx.postMessage(result);
});
