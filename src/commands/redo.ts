import { Command, CommandOption } from "../types";

export const redo: Command = (
  _,
  { code, metaKey, ctrlKey, shiftKey, emit }
) => {
  if (code === "z" && (metaKey || ctrlKey) && shiftKey) {
    emit({ type: "redo" });
    return { stop: true, change: false };
  }
};
