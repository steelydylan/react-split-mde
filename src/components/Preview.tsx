import React from "react";
import morphdom from "morphdom";
import { parser as defaultParser } from "../parser";
import { useSubscriber } from "../hooks";

type Props = {
  value: string;
  className?: string;
  parser: (text: string) => Promise<string>;
  callback: Record<string, (node: any) => any>;
};

const buildScrollMap = (lineHeightMap: number[], target: HTMLElement) => {
  const nonEmptyList: number[] = [];
  const linesCount = lineHeightMap[lineHeightMap.length - 1];
  const scrollMap: number[] = [];
  for (let i = 0; i < linesCount; i += 1) {
    scrollMap.push(-1);
  }
  nonEmptyList.push(0);
  scrollMap[0] = 0;
  const lines = target.querySelectorAll(".line");
  const offset = target.scrollTop - target.offsetTop;
  Array.from(lines).forEach((l: HTMLElement) => {
    const { line } = l.dataset;
    if (!line) {
      return;
    }
    const index = lineHeightMap[parseInt(line, 10)];
    if (index !== 0) {
      nonEmptyList.push(index);
    }
    scrollMap[index] = Math.round(l.offsetTop + offset);
  });
  nonEmptyList.push(linesCount);
  scrollMap[linesCount] = target.scrollHeight;
  let pos = 0;
  for (let i = 1; i < linesCount; i += 1) {
    if (scrollMap[i] !== -1) {
      pos += 1;
      // eslint-disable-next-line no-continue
      continue;
    }

    const a = nonEmptyList[pos];
    const b = nonEmptyList[pos + 1];
    scrollMap[i] = Math.round(
      (scrollMap[b] * (i - a) + scrollMap[a] * (b - i)) / (b - a)
    );
  }
  return scrollMap;
};

export const Preview: React.FC<Props> = ({
  value,
  className,
  parser,
  callback,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  useSubscriber((event) => {
    if (event.type !== "scroll") {
      return;
    }
    const parent = ref.current.parentNode as HTMLElement;
    if (event.remaining < 50) {
      parent.scrollTo(
        0,
        parent.scrollHeight - parent.offsetHeight - event.remaining
      );
      return;
    }
    const scrollMap = buildScrollMap(event.lineHeightMap, ref.current);
    const posTo = scrollMap[event.lineNo];
    parent.scrollTo(0, posTo);
  });

  React.useEffect(() => {
    (async () => {
      try {
        const html = parser ? await parser(value) : await defaultParser(value);
        morphdom(
          ref.current,
          `<div class="${className}">${html}</div>`,
          callback
        );
      } catch (e) {
        console.error(e);
      }
    })();
  }, [value]);

  return <div ref={ref} className={className} />;
};
