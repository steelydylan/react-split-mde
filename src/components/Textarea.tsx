import React, {
  createRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Command } from "../types";
import { getCurrentLine, insertTextAtCursor } from "../utils";
import { SafeHTML } from "./SafeHTML";
import { useEmitter, useSubscriber } from "../hooks";
import { UndoRedo } from "../utils/undo-redo";
import { decorationCode } from "../decoration";
import { useDebounceCallback } from "../hooks/debounce";

type Props = {
  onChange: (value: string) => void;
  className?: string;
  commands: Command[];
  value: string;
  psudoMode: boolean;
  scrollSync: boolean;
  placeholder?: string;
};

const xssAllowOption = {
  whiteList: {
    span: ["class"],
  },
};

const buildLineHeightMap = (
  markdown: string,
  textarea: HTMLTextAreaElement
) => {
  const div = document.createElement("div");
  div.classList.add("zenn-mde-psudo");
  div.style.position = "absolute";
  div.style.visibility = "hidden";
  div.style.height = "auto";
  const computedStyle = window.getComputedStyle(textarea);
  const lineHeightMap: number[] = [];
  let acc = 0;
  textarea.parentElement.appendChild(div);
  const lh = parseFloat(computedStyle.lineHeight);
  markdown.split("\n").forEach((str) => {
    lineHeightMap.push(acc);
    if (str.length === 0) {
      acc += 1;
      return;
    }
    div.innerText = str;
    const h = div.offsetHeight;
    acc += Math.round(h / lh);
  });
  textarea.parentElement.removeChild(div);
  lineHeightMap.push(acc);
  return lineHeightMap;
};

export const Textarea = React.forwardRef(
  (
    {
      onChange,
      commands,
      value: markdown,
      className,
      psudoMode = false,
      scrollSync = true,
      placeholder = "",
    }: Props,
    ref
  ) => {
    const [lineHeightMap, setLineHeightMap] = useState<number[]>([]);
    const [composing, setComposing] = useState(false);
    const htmlRef = useRef<HTMLTextAreaElement>();
    const oldScrollRef = useRef<number>(0);
    const historyManager = useRef(
      new UndoRedo({
        markdown,
        selectionStart: 0,
        selectionEnd: 0,
      })
    );
    const psudoRef = useMemo(() => createRef<HTMLPreElement>(), []);
    const emit = useEmitter();
    const handleTextareaScroll = useCallback(() => {
      const { offsetHeight, scrollHeight, scrollTop } = htmlRef.current;
      const computedStyle = window.getComputedStyle(htmlRef.current);
      const lineHeight = parseFloat(computedStyle.lineHeight);
      const lineNo = Math.floor(scrollTop / lineHeight);
      oldScrollRef.current = scrollTop;
      if (psudoRef.current) {
        psudoRef.current.scrollTo(0, scrollTop);
      }
      emit({
        type: "scroll",
        lineNo,
        lineHeightMap,
        remaining: scrollHeight - offsetHeight - scrollTop,
      });
    }, [lineHeightMap]);

    const handleTextChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.scrollTo(0, oldScrollRef.current);
        onChange(e.target.value);
      },
      []
    );

    const handleCompositionStart = useCallback(() => {
      setComposing(true);
    }, []);

    const handleCompositionEnd = useCallback(() => {
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

    const handleKeyDown = useCallback(
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

    useImperativeHandle(ref, () => htmlRef.current);

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

    useEffect(() => {
      historyManager.current.push({
        markdown,
        selectionStart: htmlRef.current.selectionStart,
        selectionEnd: htmlRef.current.selectionStart,
      });
    }, [markdown]);

    useDebounceCallback(
      markdown,
      (newValue) => {
        requestAnimationFrame(() => {
          if (!scrollSync) {
            return;
          }
          const newLineHeightMap = buildLineHeightMap(
            newValue,
            htmlRef.current
          );
          setLineHeightMap(newLineHeightMap);
        });
      },
      300
    );

    return (
      <div className="zenn-mde-textarea-wrap">
        {psudoMode && (
          <SafeHTML
            options={xssAllowOption}
            ref={psudoRef}
            className="zenn-mde-psudo"
            tagName="pre"
            html={decorationCode(markdown)}
          />
        )}
        <textarea
          ref={htmlRef}
          className={
            psudoMode
              ? `zenn-mde-textarea zenn-mde-textarea-with-psudo ${className}`
              : `zenn-mde-textarea ${className}`
          }
          placeholder={placeholder}
          spellCheck={false}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          defaultValue={markdown}
          onChange={handleTextChange}
          {...(scrollSync ? { onScroll: handleTextareaScroll } : {})}
        />
      </div>
    );
  }
);
