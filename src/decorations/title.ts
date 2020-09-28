export const title = (text: string, className: string) => {
  if (className === "hljs-code") {
    return text;
  }
  return text.replace(/^(\#+) (.*)?/g, (match, p1, p2) => {
    return `<span class="sharp">${p1} </span><span class="title-${p1.length}">${
      p2 || ""
    }</span> `;
  });
};
