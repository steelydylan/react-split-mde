const ctx: Worker = self as any;
ctx.Prism = {}
ctx.Prism.disableWorkerMessageHandler = true;

// you have to disable prism worker handle option first
import markdownHTML from "zenn-markdown-html";

// Respond to message from parent thread
ctx.addEventListener("message", (event) => {
  const result = markdownHTML(event.data);
  ctx.postMessage(result);
});
