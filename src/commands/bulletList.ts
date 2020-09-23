import { CommandOption, EnterKey } from "../types";
import { insertTextAtCursor } from "../utils";

export const bulletList = (target: HTMLTextAreaElement, option: CommandOption) => {
  if (option.code === EnterKey && option.line.startsWith('-') && option.line.length > 2 && !option.composing) {
    const text = '\n- '
    insertTextAtCursor(target, text);
    target.setSelectionRange(option.start + text.length, option.start + text.length);
    return true
  }
  return false
}
