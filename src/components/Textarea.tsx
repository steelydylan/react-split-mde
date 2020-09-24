import * as React from "react";
import { Command } from "../types";
import { getCurrentLine } from "../utils";
import { SafeHTML } from "./SafeHTML";

type Props = {
  onChange: (value: string) => void
  commands: Command[]
  value: string
}

const psudoRef = React.createRef<HTMLTextAreaElement>()

export const Textarea: React.FC<Props> = ({ onChange, commands, value: markdown }) => {
  // const [markdown, setMarkdown] = React.useState(value);
  const [composing, setComposing] = React.useState(false);
  const htmlRef = React.useRef<HTMLTextAreaElement>();

  const handleTextareaScroll = React.useCallback(() => {
    const scrollPos = htmlRef.current.scrollTop
    psudoRef.current.scrollTo(0, scrollPos)
  }, [])
  const handleTextChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // setMarkdown(e.target.value);
    onChange(e.target.value)
  }, []);

  const handleCompositionStart = React.useCallback(() => {
    setComposing(true)
  }, [])

  const handleCompositionEnd = React.useCallback(() => {
    setComposing(false)
  }, [])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = (e.target as HTMLTextAreaElement);
    const line = getCurrentLine(textarea)
    const value = (textarea).value
    const code = e.key
    const start = textarea.selectionStart!;
    const end = textarea.selectionEnd!;
    commands.forEach(command => { 
      const stop = command(textarea, { line, value, code, start, end, composing })
      if (stop) {
        e.preventDefault()
        // setMarkdown(textarea.value)
        onChange(textarea.value)
      }
    })
  }, [composing])

  const convertMarkdown = (md: string) => {
    if (md.endsWith("\n")) {
      return `${md} `
    }
    return md;
  }

  return (<div className="zenn-mde-textarea-wrap">
    <SafeHTML ref={psudoRef} className="zenn-mde-psudo" tagName="pre" html={convertMarkdown(markdown)} />
    <textarea 
      ref={htmlRef} 
      className="zenn-mde-textarea" 
      spellCheck={false} 
      onChange={handleTextChange} 
      onKeyDown={handleKeyDown}
      onScroll={handleTextareaScroll}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      value={markdown}
    ></textarea>
  </div>)
}
