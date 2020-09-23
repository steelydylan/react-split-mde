import * as React from "react"
import { Preview } from "./Preview";
import { Textarea } from "./Textarea";
import * as defaultCommands from '../commands';
import { Command } from "../types";

type Props = {
  commands?: Command[]
  previewClassName?: string
  parser?: (text: string) => string
  value: string
}

const getCommands = (commands: Command[]) => {
  return commands ? commands : Object.keys(defaultCommands).map((key: keyof typeof defaultCommands) => defaultCommands[key])
}

export const Editor: React.FC<Props> = ({ commands, previewClassName, parser, value: defaultValue }) => {
  const [value, setValue] = React.useState(defaultValue);
  const handleTextareaChange = React.useCallback((text: string) => {
    setValue(text);
  }, [])

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue])

  return (<div className="zenn-mde-wrap">
    <div className="zenn-mde zenn-mde-box">
      <Textarea 
        onChange={handleTextareaChange} 
        commands={getCommands(commands)}
        value={value}
      />
    </div>
    <div className="zenn-mde-box">
      <Preview value={value} className={previewClassName} parser={parser} />
    </div>
  </div>)
}