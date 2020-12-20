import { Command, EnterKey, TabKey } from "../types";
import {
  insertTextAtCursor,
  insertTextAtCursorFirstLine,
  removeTextAtFirstLine,
} from "../utils";

const generateSpace = (count: number) => {
  let i = 0;
  let text = "";
  while (i < count) {
    text += " ";
    i += 1;
  }
  return text;
};

export const orderedList: Command = (target, option) => {
  const { line } = option;
  const lineWithoutSpace = line.replace(/^(\s*)/g, "");
  const spaces = line.match(/^(\s*)/);
  let spaceLength = 0;
  if (option.composing) {
    return { stop: false, change: false };
  }
  if (spaces.length) {
    const [_, space] = spaces;
    if (space) {
      spaceLength = space.length;
    }
  }
  if (!/^(\d+)\./.test(lineWithoutSpace)) {
    return { stop: false, change: false };
  }
  if (option.code === EnterKey) {
    if (option.ctrlKey || option.metaKey) {
      return { stop: true, change: false };
    }
    const [_, number] = lineWithoutSpace.match(/^(\d+)/);
    if (lineWithoutSpace.length - number.length <= 2) {
      removeTextAtFirstLine(target, line.length);
      insertTextAtCursor(target, "\n");
      return { stop: false, change: true };
    }
    const text = `\n${generateSpace(spaceLength)}${parseInt(number, 10) + 1}. `;
    insertTextAtCursor(target, text);
    target.setSelectionRange(
      option.start + text.length,
      option.start + text.length
    );
    return { stop: true, change: true };
  }
  if (option.code === EnterKey && lineWithoutSpace.length === 2) {
    removeTextAtFirstLine(target, line.length);
    insertTextAtCursor(target, "\n");
  }
  if (option.code === TabKey && option.shiftKey) {
    removeTextAtFirstLine(target, 2);
    return { stop: true, change: true };
  }
  if (option.code === TabKey) {
    const text = "  ";
    insertTextAtCursorFirstLine(target, text);
    target.setSelectionRange(
      option.start + text.length,
      option.start + text.length
    );
    return { stop: true, change: true };
  }
  return { stop: false, change: false };
};
