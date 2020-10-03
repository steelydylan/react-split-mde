export function getCurrentLine(target: HTMLTextAreaElement) {
  const starVal = target.value.substr(0, target.selectionStart);
  const valArr = starVal.split("\n");
  const currentLineStr = valArr[valArr.length - 1];
  return currentLineStr;
}

export function insertTextAtCursor(target: HTMLTextAreaElement, text: string) {
  target.setRangeText(text);
}

export function putCaretAtFirstLine(target) {
  const currentLineStr = getCurrentLine(target);
  target.setSelectionRange(
    target.selectionStart - currentLineStr.length,
    target.selectionStart - currentLineStr.length
  );
}

export function insertTextAtCursorFirstLine(
  target: HTMLTextAreaElement,
  text: string
) {
  putCaretAtFirstLine(target);
  insertTextAtCursor(target, text);
}

export function removeTextAtFirstLine(
  target: HTMLTextAreaElement,
  count: number
) {
  const savedSelection = target.selectionStart - count;
  const starVal = target.value.substr(0, target.selectionStart);
  const valArr = starVal.split("\n");
  let currentLine = valArr[valArr.length - 1];
  currentLine = currentLine.substr(count);
  const lines = target.value.split("\n");
  lines[valArr.length - 1] = currentLine;
  const final = lines.join("\n");
  // eslint-disable-next-line
  target.value = final;
  target.setSelectionRange(savedSelection, savedSelection);
}

export const scrollMapping = {
  ".title-1": "h1",
  ".title-2": "h2",
  ".title-3": "h3",
  ".title-4": "h4",
  ".title-5": "h5",
  ".title-6": "h6",
  ".hljs-bullet": "li",
  ".youtube": ".embed-youtube",
  ".tweet": ".embed-tweet",
  ".image": "img",
};
