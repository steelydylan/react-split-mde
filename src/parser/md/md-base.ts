import MarkdownIt from "markdown-it";

export const md = MarkdownIt({
  breaks: true,
  linkify: true,
});
export const { escapeHtml } = md.utils;
