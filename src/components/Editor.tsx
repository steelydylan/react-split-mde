import * as React from "react"
import { useEmitter } from 'use-eventmit'
import { Preview } from "./Preview";
import { Textarea } from "./Textarea";
import * as defaultCommands from '../commands';
import * as defaultDecorations from '../decorations';
import { Command, Decoration, Target } from "../types";

type Props = {
  commands?: Command[]
  decorations?: Decoration[]
  previewClassName?: string
  parser?: (text: string) => string
  value: string
}

const getCommands = (commands: Command[]) => {
  return commands ? commands : Object.keys(defaultCommands).map((key: keyof typeof defaultCommands) => defaultCommands[key])
}

const getDecorations = (decorations: Decoration[]) => {
  return decorations ? decorations : Object.keys(defaultDecorations).map((key: keyof typeof defaultDecorations) => defaultDecorations[key])
}

export const Editor: React.FC<Props> = ({ commands, decorations, previewClassName, parser, value: defaultValue }) => {
  const [value, setValue] = React.useState(defaultValue);
  const [target, setTarget] = React.useState<Target | null>(null)
  const handleTextareaChange = React.useCallback((text: string) => {
    setValue(text);
  }, [])

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue])

  const handleTargetChange = React.useCallback((target) => {
    setTarget(target)
  }, [])

  return (<div className="zenn-mde-wrap">
    <div className="zenn-mde zenn-mde-box">
      <Textarea 
        onChange={handleTextareaChange} 
        onTargetChange={handleTargetChange}
        commands={getCommands(commands)}
        decorations={getDecorations(decorations)}
        value={value}
      />
    </div>
    <div className="zenn-mde-box">
      <Preview value={value} className={previewClassName} parser={parser} target={target} />
    </div>
  </div>)
}
