import React, { useRef } from "react";
import { Preview } from "./Preview";
import { Textarea } from "./Textarea";
import * as defaultCommands from "../commands";
import { Command } from "../types";
import { useDebounce } from "../hooks/debounce";
import { parser as defaultParser } from "../parser";

type Props = {
  commands?: Record<string, Command>;
  previewClassName?: string;
  textareaClassName?: string;
  previewCallback?: Record<string, (node: any) => any>;
  parser?: (text: string) => Promise<string>;
  value: string;
  onChange?: (value: string) => void;
  psudoMode?: boolean;
  debounceTime?: number;
  scrollSync?: boolean;
  placeholder?: string;
};

export const Editor: React.FC<Props> = ({
  commands = defaultCommands,
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
    if (onChange) {
      onChange(text);
    }
  }, []);

  const debouncedValue = useDebounce(value, debounceTime);

  return (
    <div className="react-split-mde-wrap">
      <div className="react-split-mde react-split-mde-box">
        <Textarea
          ref={ref}
          placeholder={placeholder}
          scrollSync={scrollSync}
          className={textareaClassName}
          psudoMode={psudoMode}
          onChange={handleTextareaChange}
          commands={commands}
          value={value}
        />
      </div>
      <div className="react-split-mde-box">
        <Preview
          value={debouncedValue}
          className={previewClassName}
          callback={previewCallback}
          parser={parser ?? defaultParser}
        />
      </div>
    </div>
  );
};
