export const title = (text: string) => {
  return text.replace(/\n(\#+) (.*)?/g, (match, p1, p2) => {
    return `\n<span class="sharp">${p1} </span><span class="title-${p1.length}">${p2 ? p2 : ''}</span> `
  })
}