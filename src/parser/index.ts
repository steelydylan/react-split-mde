import md from "./md";

export const parser = (text: string): string => {
  if (!(text && text.length)) return text;
  return md.render(text);
};
