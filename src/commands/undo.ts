import { Command } from "../types";

export const undo: Command = (
  _,
  { code, metaKey, ctrlKey, shiftKey, emit }
) => {
  if (code === "z" && (metaKey || ctrlKey) && !shiftKey) {
    emit({ type: "undo" });
    return { stop: true, change: false };
  }
};
