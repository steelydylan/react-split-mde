export const title = (text: string) => {
  return text.replace(/\# (.*)?/g, `<span class="sharp"># </span><span class="title">$1</span> `)
}