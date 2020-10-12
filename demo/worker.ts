const ctx: Worker = self as any;
ctx.Prism = {}
ctx.Prism.disableWorkerMessageHandler = true;

// you have to disable prism worker handle option first
import markdownHTML, { enablePreview } from "zenn-markdown-html";

enablePreview();
// Respond to message from parent thread
ctx.addEventListener("message", (event) => {
  const result = markdownHTML(event.data);
  ctx.postMessage(result);
});
