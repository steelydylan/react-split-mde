export const image = (text: string) => {
  return text.replace(
    /!\[(.*)?\]\((.*)?\)/g,
    "<span class='image'>![$1]($2)</span>"
  );
};
