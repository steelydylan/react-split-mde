import React from "react";
import highlight from "highlight.js/lib/core";
import markdown from "highlight.js/lib/languages/markdown";
import { Command, Decoration, Target } from "../types";
import { getCurrentLine, insertTextAtCursor } from "../utils";
import { SafeHTML } from "./SafeHTML";
import { useEmitter, useSubscriber } from "../hooks";

import { UndoRedo } from "../utils/undo-redo";

highlight.registerLanguage("markdown", markdown);

type Props = {
  onChange: (value: string) => void;
  commands: Command[];
  decorations: Decoration[];
  value: string;
  scrollMapping: Record<string, string>;
};

const xssAllowOption = {
  whiteList: {
    span: ["class"],
  },
};

export const Textarea: React.FC<Props> = ({
  onChange,
  commands,
  decorations,
  value: markdown,
  scrollMapping,
}) => {
  // const [markdown, setMarkdown] = React.useState(value);
  const [composing, setComposing] = React.useState(false);
  const htmlRef = React.useRef<HTMLTextAreaElement>();
  const oldScrollRef = React.useRef<number>(0);
  const historyManager = React.useRef(
    new UndoRedo({
      markdown,
      selectionStart: 0,
      selectionEnd: 0,
    })
  );
  const psudoRef = React.useMemo(() => React.createRef<HTMLPreElement>(), []);
  const emit = useEmitter();
  const observer = React.useRef<IntersectionObserver>()

  React.useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      const parent = psudoRef.current
      const scrollPercent =
      (parent.scrollTop + parent.offsetHeight) / parent.scrollHeight;
      const scrollPos = htmlRef.current.scrollTop;
      const scrollDiff = scrollPos - oldScrollRef.current;
      for (const entry of entries) {
        const { target, boundingClientRect } = entry
        if (boundingClientRect.top < 400) {
          return
        }
        if (scrollMapping[`.${target.className}`]) {
          const elements = [].slice.call(
            psudoRef.current.querySelectorAll(`.${target.className}`)
          );
          const result = {
            selector: `.${target.className}`,
            text: target.textContent,
            index: elements.indexOf(target),
          }
          return emit({ type: "scroll", target: result, scrollDiff, scrollPercent, scrollPos });
        }
      }
    }, {
      root: psudoRef.current,
    })
    return () => {
      observer.current.disconnect()
    }
  }, [])

  React.useEffect(() => {
    const parent = psudoRef.current;
    const children = parent.querySelectorAll(Object.keys(scrollMapping).join(','));
    [].forEach.call(children, (child) => {
      observer.current.observe(child)
    });
  }, [markdown])

  const handleTextareaScroll = React.useCallback(() => {
    const scrollPos = htmlRef.current.scrollTop;
    oldScrollRef.current = scrollPos;
    psudoRef.current.scrollTo(0, scrollPos);
  }, []);

  const handleTextChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      e.target.scrollTo(0, oldScrollRef.current)
      onChange(e.target.value);
    },
    []
  );

  const handleCompositionStart = React.useCallback(() => {
    setComposing(true);
  }, []);

  const handleCompositionEnd = React.useCallback(() => {
    setComposing(false);
  }, []);

  const undo = () => {
    if (!historyManager.current.canUndo()) {
      return;
    }
    historyManager.current.undo();
    const {
      markdown: undoMarkdown,
      selectionStart,
      selectionEnd,
    } = historyManager.current.getValue();
    htmlRef.current.value = undoMarkdown;
    htmlRef.current.setSelectionRange(selectionStart, selectionEnd);
    onChange(undoMarkdown);
  };

  const redo = () => {
    if (!historyManager.current.canRedo()) {
      return;
    }
    historyManager.current.redo();
    const {
      markdown: redoMarkdown,
      selectionStart,
      selectionEnd,
    } = historyManager.current.getValue();
    htmlRef.current.value = redoMarkdown;
    htmlRef.current.setSelectionRange(selectionStart, selectionEnd);
    onChange(redoMarkdown);
  };

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const textarea = e.target as HTMLTextAreaElement;
      const line = getCurrentLine(textarea);
      const { value } = textarea;
      const code = e.key;
      const { shiftKey, metaKey, ctrlKey } = e;
      const start = textarea.selectionStart!;
      const end = textarea.selectionEnd!;
      commands.forEach((command) => {
        const result = command(textarea, {
          line,
          value,
          code,
          shiftKey,
          start,
          end,
          composing,
          metaKey,
          ctrlKey,
          emit,
        });
        if (result?.stop) {
          e.preventDefault();
        }
        if (result?.change) {
          onChange(textarea.value);
        }
      });
    },
    [composing]
  );

  const convertMarkdown = (md: string) => {
    let text = md;
    if (text.endsWith("\n")) {
      text = `${text} `;
    }
    const { value: result } = highlight.highlight("markdown", text);
    return result.replace(
      /(<\s*span[^>]*>)(([\n\r\t]|.)*?)(<\s*\/\s*span>)/g,
      (_match, p1, p2, _p3, p4) => {
        let value = p2;
        const [_, className] = p1.match(/class="(.*)?"/);
        decorations.forEach((decoration) => {
          value = decoration(value, className);
        });
        return `${p1}${value}${p4}`;
      }
    );
  };

  useSubscriber((event) => {
    const target = htmlRef.current;
    if (event.type === "insert") {
      const { text } = event;
      const start = target.selectionStart!;
      insertTextAtCursor(htmlRef.current, text);
      target.setSelectionRange(start + text.length, start + text.length);
      onChange(target.value);
    } else if (event.type === "replace") {
      const { text, targetText } = event;
      const currentSelection = target.selectionStart;
      const offset = targetText.length - text.length;
      target.value = target.value.replace(targetText, text);
      target.setSelectionRange(
        currentSelection + offset,
        currentSelection + offset
      );
      onChange(target.value);
    } else if (event.type === "undo") {
      undo();
    } else if (event.type === "redo") {
      redo();
    }
  });

  React.useEffect(() => {
    historyManager.current.push({
      markdown,
      selectionStart: htmlRef.current.selectionStart,
      selectionEnd: htmlRef.current.selectionStart,
    });
  }, [markdown]);

  return (
    <div className="zenn-mde-textarea-wrap">
      <SafeHTML
        options={xssAllowOption}
        ref={psudoRef}
        className="zenn-mde-psudo"
        tagName="pre"
        html={convertMarkdown(markdown)}
      />
      <textarea
        ref={htmlRef}
        className="zenn-mde-textarea"
        spellCheck={false}
        onScroll={handleTextareaScroll}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        value={markdown}
      />
    </div>
  );
};
