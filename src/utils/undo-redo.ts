export class UndoRedo<T> {
  stacks: T[] = [];
  stackIndex: number = 0;
  stopStack: boolean = false;

  constructor(defaultValue: T) {
    this.stacks.push(defaultValue);
  }

  canRedo() {
    if (this.stackIndex < this.stacks.length - 1) {
      return true;
    }
    return false;
  }

  canUndo() {
    if (this.stackIndex > 0) {
      return true;
    }
    return false;
  }

  redo() {
    if (this.canRedo()) {
      this.stackIndex += 1;
      this.stopStack = true;
    }
  }

  undo() {
    if (this.canUndo()) {
      this.stackIndex -= 1;
      this.stopStack = true;
    }
  }

  push(value: T) {
    if (this.stopStack) {
      this.stopStack = false;
    } else {
      this.stackIndex += 1;
      this.stacks.push(value);
    }
  }

  getValue() {
    return this.stacks[this.stackIndex];
  }
}
