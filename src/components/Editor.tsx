import React from "react";
import { Preview } from "./Preview";
import { Textarea } from "./Textarea";
import * as defaultCommands from "../commands";
import * as defaultDecorations from "../decorations";
import { Command, Decoration } from "../types";
import { scrollMapping as defaultScrollMapping } from "../utils";

type Props = {
  commands?: Command[];
  decorations?: Decoration[];
  previewClassName?: string;
  previewCallback?: Record<string, (node: any) => any>;
  parser?: (text: string) => string;
  value: string;
  onChange?: (value: string) => void;
  scrollMapping?: Record<string, string>;
};

const getCommands = (commands: Command[]) => {
  return (
    commands ||
    Object.keys(defaultCommands).map(
      (key: keyof typeof defaultCommands) => defaultCommands[key]
    )
  );
};

const getDecorations = (decorations: Decoration[]) => {
  return (
    decorations ||
    Object.keys(defaultDecorations).map(
      (key: keyof typeof defaultDecorations) => defaultDecorations[key]
    )
  );
};

export const Editor: React.FC<Props> = ({
  commands,
  decorations,
  previewClassName,
  previewCallback = {},
  parser,
  value,
  onChange,
  scrollMapping,
}) => {
  const handleTextareaChange = React.useCallback((text: string) => {
    onChange(text);
  }, []);

  return (
    <div className="zenn-mde-wrap">
      <div className="zenn-mde zenn-mde-box">
        <Textarea
          scrollMapping={scrollMapping || defaultScrollMapping}
          onChange={handleTextareaChange}
          commands={getCommands(commands)}
          decorations={getDecorations(decorations)}
          value={value}
        />
      </div>
      <div className="zenn-mde-box">
        <Preview
          value={value}
          className={previewClassName}
          callback={previewCallback}
          parser={parser}
          scrollMapping={scrollMapping || defaultScrollMapping}
        />
      </div>
    </div>
  );
};
