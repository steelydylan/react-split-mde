export function getCurrentLine(target: HTMLTextAreaElement) {
  const starVal = target.value.substr(0, target.selectionStart);
  const valArr = starVal.split('\n');
  const currentLineStr = valArr[valArr.length - 1];
  return currentLineStr
}

export function insertTextAtCursor(target: HTMLTextAreaElement, text: string) {
  if (target.setRangeText) {
    target.setRangeText(text)
  } else {
    target.focus()
    document.execCommand('insertText', false /*no UI*/, text);
  }
}