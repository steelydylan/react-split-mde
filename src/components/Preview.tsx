import * as React from "react"
import { SafeHTML } from "./SafeHTML";
import { parser as defaultParser } from "../parser";
import { Target } from "../types";

type Props = {
  value: string
  className?: string
  parser: (text: string) => string
  target: Target | null
}

const convertTargetToTagName = (target: Target) => {
  const map = {
    "title-1": "h1",
    "title-2": "h2",
    "title-3": "h3",
    "title-4": "h4",
    "title-5": "h5",
    "title-6": "h6",
    "code-start": "pre",
    "hljs-bullet": "li",
  }
  const tagName = map[target.elementType]
  return tagName
}

export const Preview: React.FC<Props> = ({ value, className, parser, target }) => {
  const ref = React.useMemo(() => React.createRef<HTMLPreElement>(), [])

  React.useEffect(() => {
    if (!target) {
      return
    }
    const tagName = convertTargetToTagName(target)
    if (!tagName) {
      return
    }
    const children = ref.current.querySelectorAll(`${tagName}`)
    const child = children[target.index] as HTMLElement
    if (!child) {
      return
    }
    const parent = ref.current.parentNode as HTMLElement
    parent.scrollTo(0, child.offsetTop - parent.offsetHeight + 50)
  }, [target])

  return (<SafeHTML ref={ref} className={className} tagName="div" html={parser ? parser(value) : defaultParser(value)} />)
}
