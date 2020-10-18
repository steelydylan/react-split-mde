import highlight from "highlight.js/lib/core";
import md from "./markdown";
import * as transforms from "./transforms";

highlight.registerLanguage("markdown", md);

export const decorationCode = (code: string) => {
  let text = code;
  if (text.endsWith("\n")) {
    text = `${text} `;
  }
  const { value: result } = highlight.highlight("markdown", text);
  return result.replace(
    /(<\s*span[^>]*>)(([\n\r\t]|.)*?)(<\s*\/\s*span>)/g,
    (_match, p1, p2, _p3, p4) => {
      let value = p2;
      const [_, className] = p1.match(/class="(.*)?"/);
      Object.keys(transforms).forEach((key) => {
        value = transforms[key](value, className);
      });
      return `${p1}${value}${p4}`;
    }
  );
};
