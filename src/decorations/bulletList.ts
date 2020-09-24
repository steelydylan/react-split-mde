export const bulletList = (text: string) => {
  return text.replace(/\- /g, `<span class="bullet-item">-</span> `)
}