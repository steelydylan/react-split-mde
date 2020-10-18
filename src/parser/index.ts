import MarkdownIt from "markdown-it";
import { lineNumber } from "./line-number";

const md = new MarkdownIt();
lineNumber(md);

export const parser = (value: string) => {
  return md.render(value);
};
