import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

export const parser = (value: string) => {
  return md.render(value);
};
