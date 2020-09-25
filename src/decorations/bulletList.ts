export const bulletList = (text: string) => {
  return text.replace(/\n\- /g, `\n<span class="bullet-item">-</span> `)
}