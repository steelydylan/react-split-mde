import * as React from "react";
import { Command, Decoration, Target } from "../types";
import { getCurrentLine } from "../utils";
import { SafeHTML } from "./SafeHTML";

import highlight from 'highlight.js/lib/core'
import md from 'highlight.js/lib/languages/markdown'
highlight.registerLanguage('markdown', md)

type Props = {
  onChange: (value: string) => void
  onTargetChange: (target: Target) => void
  commands: Command[]
  decorations: Decoration[]
  value: string
}

const xssAllowOption = {
  whiteList: {
    span: ['class']
  }
}

export const getBottomElement = (target: HTMLPreElement) => {
  const targetRect = target.getBoundingClientRect()
  const { bottom, top } = targetRect
  const children = target.querySelectorAll('span');
  const result = [].find.call(children, (child: HTMLElement) => {
    const rect = child.getBoundingClientRect()
    if (bottom >= rect.bottom && bottom - 50 <= rect.top && /(title|hljs-bullet|hljs-code)/.test(child.className)) {
      return true
    }
    return false
  }) as (HTMLElement | null)
  if (result) {
    const elements = [].slice.call( target.querySelectorAll(`.${result.className}`));
    return {
      elementType: result.className,
      text: result.textContent,
      index: elements.indexOf(result),
    }
  }
}

export const Textarea: React.FC<Props> = ({ onChange, onTargetChange, commands, decorations, value: markdown }) => {
  // const [markdown, setMarkdown] = React.useState(value);
  const [composing, setComposing] = React.useState(false);
  const htmlRef = React.useRef<HTMLTextAreaElement>();
  const psudoRef = React.useMemo(() => React.createRef<HTMLPreElement>(), [])

  const handleTextareaScroll = React.useCallback(() => {
    const scrollPos = htmlRef.current.scrollTop
    psudoRef.current.scrollTo(0, scrollPos)
    const result = getBottomElement(psudoRef.current)
    if (result) {
      onTargetChange(result)
    }
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
    const { shiftKey } = e
    const start = textarea.selectionStart!;
    const end = textarea.selectionEnd!;
    commands.forEach(command => { 
      const stop = command(textarea, { line, value, code, shiftKey, start, end, composing })
      if (stop) {
        e.preventDefault()
        // setMarkdown(textarea.value)
        onChange(textarea.value)
      }
    })
  }, [composing])

  const convertMarkdown = (md: string) => {
    if (md.endsWith("\n")) {
      md = `${md} `
    }
    const { value } = highlight.highlight('markdown', md)
    return value.replace(/(<\s*span[^>]*>)(.*?)(<\s*\/\s*span>)/g, (match, p1, p2, p3) => {
      let value = p2
      decorations.forEach(decoration => {
        value = decoration(value)
      })
      return `${p1}${value}${p3}`
    })
  }

  return (<div className="zenn-mde-textarea-wrap">
    <SafeHTML options={xssAllowOption} ref={psudoRef} className="zenn-mde-psudo" tagName="pre" html={convertMarkdown(markdown)} />
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
