import React from "react";
import morphdom from "morphdom";
import { parser as defaultParser } from "../parser";
import { useSubscriber } from "../hooks";

type Props = {
  value: string;
  className?: string;
  parser: (text: string) => Promise<string>;
  callback: Record<string, (node: any) => any>;
  scrollMapping: Record<string, string>;
};

export const Preview: React.FC<Props> = ({
  value,
  className,
  parser,
  callback,
  scrollMapping,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  useSubscriber((event) => {
    if (event.type !== "scroll") {
      return;
    }
    if (!event.target) {
      return;
    }
    const ratio = ref.current.scrollHeight / event.scrollHeight;
    const parent = ref.current.parentNode as HTMLElement;
    if (event.scrollTop < 50) {
      parent.scrollTo(0, ratio * event.scrollTop);
      return;
    }
    const bottomOffset =
      event.scrollHeight - event.scrollTop - event.offsetHeight;
    if (bottomOffset < 50) {
      parent.scrollTo(
        0,
        parent.scrollHeight - parent.offsetHeight - bottomOffset * ratio
      );
      return;
    }
    const selector = scrollMapping[event.target.selector];
    if (!selector) {
      return;
    }
    const children = ref.current.querySelectorAll(`${selector}`);
    const child = children[event.target.index] as HTMLElement;
    if (!child) {
      return;
    }
    parent.scrollTo(
      0,
      parent.scrollTop +
        child.getBoundingClientRect().top -
        parent.getBoundingClientRect().top -
        ratio * event.target.top
    );
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
        console.log(e);
      }
    })();
  }, [value]);

  return <div ref={ref} className={className} />;
};
