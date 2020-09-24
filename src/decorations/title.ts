export const title = (text: string) => {
  return text.replace(/(\#+) (.*)?/g, `<span class="sharp">$1 </span><span class="title">$2</span> `)
}