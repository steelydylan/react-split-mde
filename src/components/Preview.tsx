import React from "react";
import morphdom from "morphdom";
import { parser as defaultParser } from "../parser";
import { useSubscriber } from "../hooks";

type Props = {
  value: string;
  className?: string;
  parser: (text: string) => string;
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
      return
    }
    const parent = ref.current.parentNode as HTMLElement;
    const selector = scrollMapping[event.target.selector];
    if (!selector) {
      return;
    }
    const children = ref.current.querySelectorAll(`${selector}`);
    const child = children[event.target.index] as HTMLElement;
    if (!child) {
      return;
    }
    parent.scrollTo(0, parent.scrollTop + child.getBoundingClientRect().top - parent.getBoundingClientRect().top - event.target.top);
  });

  React.useEffect(() => {
    try {
      const html = parser ? parser(value) : defaultParser(value);
      morphdom(
        ref.current,
        `<div class="${className}">${html}</div>`,
        callback
      );
    } catch (e) {
      console.log(e);
    }
  }, [value]);

  return <div ref={ref} className={className} />;
};
