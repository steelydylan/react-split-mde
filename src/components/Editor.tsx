import React, { useRef } from "react";
import { Preview } from "./Preview";
import { Textarea } from "./Textarea";
import * as defaultCommands from "../commands";
import { Command } from "../types";
import { useDebounce } from "../hooks/debounce";

type Props = {
  commands?: Record<string, Command>;
  previewClassName?: string;
  textareaClassName?: string;
  previewCallback?: Record<string, (node: any) => any>;
  parser: (text: string) => Promise<string>;
  value: string;
  onChange?: (value: string) => void;
  psudoMode?: boolean;
  debounceTime?: number;
  scrollSync?: boolean;
  placeholder?: string;
};

const getCommands = (commands: Record<string, Command>) => {
  return Object.keys(commands || defaultCommands).map(
    (key: keyof typeof defaultCommands) => defaultCommands[key]
  );
};

export const Editor: React.FC<Props> = ({
  commands,
  textareaClassName,
  previewClassName,
  previewCallback = {},
  parser,
  value,
  onChange,
  psudoMode = false,
  debounceTime = 300,
  scrollSync = true,
  placeholder = "",
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const handleTextareaChange = React.useCallback((text: string) => {
    onChange(text);
  }, []);

  const debouncedValue = useDebounce(value, debounceTime);

  return (
    <div className="zenn-mde-wrap">
      <div className="zenn-mde zenn-mde-box">
        <Textarea
          ref={ref}
          placeholder={placeholder}
          scrollSync={scrollSync}
          className={textareaClassName}
          psudoMode={psudoMode}
          onChange={handleTextareaChange}
          commands={getCommands(commands)}
          value={value}
        />
      </div>
      <div className="zenn-mde-box">
        <Preview
          value={debouncedValue}
          className={previewClassName}
          callback={previewCallback}
          parser={parser}
        />
      </div>
    </div>
  );
};
