import { EmitEvent } from "../hooks";

export type CommandOption = {
  line: string;
  lineAll: string;
  value: string;
  code: string;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  start: number;
  end: number;
  composing: boolean;
  emit: (event: EmitEvent) => void;
};

export const EnterKey = "Enter";

export const TabKey = "Tab";

export type Command = (
  target: HTMLTextAreaElement,
  option: CommandOption
) => { stop: boolean; change: boolean } | void;
