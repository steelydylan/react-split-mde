import { Command, CommandOption, EnterKey, TabKey } from "../types";
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

export const bulletList: Command = (target, option) => {
  const { lineAll } = option;
  const lineWithoutSpace = lineAll.replace(/^(\s*)/g, "");
  const spaces = lineAll.match(/^(\s*)/);
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
  const startWithHyphen = lineWithoutSpace.startsWith("-");
  const startWithAsterisk = lineWithoutSpace.startsWith("*");
  if (!startWithHyphen && !startWithAsterisk) {
    return { stop: false, change: false };
  }
  if (option.code === EnterKey) {
    if (option.metaKey || option.ctrlKey) {
      return { stop: true, change: false };
    }
    if (lineWithoutSpace.length > 2) {
      const text = startWithHyphen
        ? `\n${generateSpace(spaceLength)}- `
        : `\n${generateSpace(spaceLength)}* `;
      insertTextAtCursor(target, text);
      target.setSelectionRange(
        option.start + text.length,
        option.start + text.length
      );
      return { stop: true, change: true };
    }
    if (lineWithoutSpace.length === 2) {
      removeTextAtFirstLine(target, lineAll.length);
      insertTextAtCursor(target, "\n");
      return { stop: false, change: true };
    }
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
