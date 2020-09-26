import { CommandOption, EnterKey, TabKey } from "../types";
import { insertTextAtCursor, insertTextAtCursorFirstLine, removeTextAtFirstLine } from "../utils";

const generateSpace = (count: number) => {
  let i = 0;
  let text = ''
  while(i < count) {
    text += ' '
    i++
  }
  return text
}

export const orderedList = (target: HTMLTextAreaElement, option: CommandOption) => {
  const { line } = option
  const lineWithoutSpace = line.replace(/^(\s*)/g, '');
  const spaces = line.match(/^(\s*)/)
  let spaceLength = 0
  if (spaces.length) {
    const [_, space] = spaces
    if (space) {
      spaceLength = space.length
    }
  }
  if (!/^(\d+)/.test(lineWithoutSpace)) {
    return
  }
  if (option.code === EnterKey && !option.composing) {
    const [_, number] = lineWithoutSpace.match(/^(\d+)/)
    if (lineWithoutSpace.length - number.length <= 2) {
      return false
    }
    const text = `\n${generateSpace(spaceLength)}${parseInt(number, 10) + 1}. `
    insertTextAtCursor(target, text);
    target.setSelectionRange(option.start + text.length, option.start + text.length);
    return true
  } else if (option.code === TabKey && option.shiftKey) {
    removeTextAtFirstLine(target, 2)
    return true
  } else if (option.code === TabKey) {
    const text = '  '
    insertTextAtCursorFirstLine(target, text);
    target.setSelectionRange(option.start + text.length, option.start + text.length);
    return true
  }
  return false
}
