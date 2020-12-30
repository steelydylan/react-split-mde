import markdownHTML, { enablePreview } from "zenn-markdown-html";

enablePreview();

export const parser = (value: string): Promise<string> => {
  return new Promise((resolve) => {
    return resolve(markdownHTML(value));
  });
};
