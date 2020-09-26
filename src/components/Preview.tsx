import * as React from "react"
import morphdom from "morphdom"
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
    "hljs-code": "code",
    "hljs-bullet": "li",
  }
  const tagName = map[target.elementType]
  return tagName
}

export const Preview: React.FC<Props> = ({ value, className, parser, target }) => {
  const ref = React.useRef<HTMLDivElement>(null)

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

  React.useEffect(() => {
    try {
      const html = parser ? parser(value) : defaultParser(value)
      morphdom(ref.current, `<div class="${className}">${html}</div>`)
      // return parser ? parser(value) : defaultParser(value)
    } catch (e) {
      console.log(e)
    } 
  }, [value]);

  return (<div ref={ref} className={className} />)
}
