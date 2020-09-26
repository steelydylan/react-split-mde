export const bulletList = (text: string) => {
  return text.replace(/(^|\n)\- /g, `$1<span class="bullet-item">-</span> `)
}