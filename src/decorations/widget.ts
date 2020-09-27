export const twitter = (text: string, className: string) => {
  if (className !== "hljs-string") {
    return text;
  }
  return text.replace(/^tweet/g, (match) => {
    return `<span class="tweet">${match}</span>`
  })
}

export const youtube = (text: string, className: string) => {
  if (className !== "hljs-string") {
    return text;
  }
  return text.replace(/^youtube/g, (match) => {
    return `<span class="youtube">${match}</span>`
  })
}