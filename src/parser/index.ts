import markdownHTML, { enablePreview } from "zenn-markdown-html";

enablePreview();

export const parser = (value: string) => {
  return markdownHTML(value);
};
