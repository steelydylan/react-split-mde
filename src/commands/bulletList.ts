import { CommandOption, EnterKey, TabKey } from "../types";
import { insertTextAtCursor, insertTextAtCursorFirstLine } from "../utils";

export const bulletList = (target: HTMLTextAreaElement, option: CommandOption) => {
  if (!option.line.startsWith('-') || option.line.length <= 2) {
    return false
  }
  if (option.code === EnterKey && !option.composing) {
    const text = '\n- '
    insertTextAtCursor(target, text);
    target.setSelectionRange(option.start + text.length, option.start + text.length);
    return true
  } else if (option.code === TabKey) {
    const text = '  '
    insertTextAtCursorFirstLine(target, text);
    target.setSelectionRange(option.start + text.length, option.start + text.length);
    return true
  }
  return false
}
