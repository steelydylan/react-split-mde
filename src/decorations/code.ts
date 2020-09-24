export const code = (text: string) => {
  return text.replace(/```/g, `<span class="code">\`\`\`</span>`)
}