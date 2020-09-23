import { CommandOption, EnterKey } from "../types";
import { insertTextAtCursor } from "../utils";

export const orderedList = (target: HTMLTextAreaElement, option: CommandOption) => {
  if (option.code === EnterKey && /^(\d+)/.test(option.line) && !option.composing) {
    const [_, number] = option.line.match(/^(\d+)/)
    if (option.line.length - number.length <= 2) {
      return false
    }
    const text = `\n${parseInt(number, 10) + 1}. `
    insertTextAtCursor(target, text);
    target.setSelectionRange(option.start + text.length, option.start + text.length);
    return true
  }
  return false
}
