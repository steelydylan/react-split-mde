export const code = (text: string) => {
  return text.replace(/```(([\n\r\t]|.)*?)```/g, `<span class="code-start">\`\`\`</span>$1<span class="code-end">\`\`\`</span>`)
}