import * as React from "react";
import { Command, Decoration, Target } from "../types";
import { getCurrentLine, insertTextAtCursor } from "../utils";
import { SafeHTML } from "./SafeHTML";
import { useEmitter, useSubscriber } from '../hooks'

import highlight from 'highlight.js/lib/core'
import md from 'highlight.js/lib/languages/markdown'
import { UndoRedo } from "../utils/undo-redo";
highlight.registerLanguage('markdown', md)

type Props = {
  onChange: (value: string) => void
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

export const Textarea: React.FC<Props> = ({ onChange, commands, decorations, value: markdown }) => {
  // const [markdown, setMarkdown] = React.useState(value);
  const [composing, setComposing] = React.useState(false);
  const htmlRef = React.useRef<HTMLTextAreaElement>();
  const historyManager = React.useRef(new UndoRedo({
    markdown,
    selectionStart: 0,
    selectionEnd: 0,
  }))
  const psudoRef = React.useMemo(() => React.createRef<HTMLPreElement>(), [])
  const emit = useEmitter()

  const handleTextareaScroll = React.useCallback(() => {
    const scrollPos = htmlRef.current.scrollTop
    psudoRef.current.scrollTo(0, scrollPos)
    const result = getBottomElement(psudoRef.current)
    if (result) {
      emit({ type: 'scroll', target: result })
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

  const undo = () => {
    if (!historyManager.current.canUndo()) {
      return
    }
    historyManager.current.undo()
    const { markdown, selectionStart, selectionEnd } = historyManager.current.getValue()
    htmlRef.current.value = markdown
    htmlRef.current.setSelectionRange(selectionStart, selectionEnd);
    onChange(markdown)
  }

  const redo = () => {
    if (!historyManager.current.canRedo()) {
      return
    }
    historyManager.current.redo()
    const { markdown, selectionStart, selectionEnd } = historyManager.current.getValue()
    htmlRef.current.value = markdown
    htmlRef.current.setSelectionRange(selectionStart, selectionEnd);
    onChange(markdown)
  }

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = (e.target as HTMLTextAreaElement);
    const line = getCurrentLine(textarea)
    const value = (textarea).value
    const code = e.key
    const { shiftKey, metaKey, ctrlKey } = e
    const start = textarea.selectionStart!;
    const end = textarea.selectionEnd!;

    if (code === 'z' && (metaKey || ctrlKey) && shiftKey) {
      e.preventDefault()
      redo()
      return
    } else if (code === 'z' && (metaKey || ctrlKey)) {
      e.preventDefault()
      undo()
      return
    }
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
    return value.replace(/(<\s*span[^>]*>)(([\n\r\t]|.)*?)(<\s*\/\s*span>)/g, (match, p1, p2, p3, p4) => {
      let value = p2
      const [_,className] = p1.match(/class="(.*)?"/)
      decorations.forEach(decoration => {
        value = decoration(value, className)
      })
      return `${p1}${value}${p4}`
    })
  }

  useSubscriber((event) => {
    const target = htmlRef.current
    if (event.type === 'insert') {
      const { text } = event
      const start = target.selectionStart!;
      insertTextAtCursor(htmlRef.current, text);
      target.setSelectionRange(start + text.length, start + text.length);
    } else if (event.type === 'replace') {
      const { text, targetText } = event
      const currentSelection = target.selectionStart
      const offset = targetText.length - text.length
      target.value = target.value.replace(targetText, text)
      target.setSelectionRange(currentSelection + offset, currentSelection + offset)
    } else if (event.type = 'undo') {
      undo()
    } else if (event.type = 'redo') {
      redo()
    }
    onChange(target.value)
  })

  React.useEffect(() => {
    historyManager.current.push({
      markdown,
      selectionStart: htmlRef.current.selectionStart,
      selectionEnd: htmlRef.current.selectionStart,
    })
  }, [markdown])

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
