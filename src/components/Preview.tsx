import * as React from "react"
import { SafeHTML } from "./SafeHTML";
import { parser as defaultParser } from "../parser";

type Props = {
  value: string
  className?: string
  parser: (text: string) => string
}

export const Preview: React.FC<Props> = ({ value, className, parser }) => {
  return (<SafeHTML className={className} tagName="div" html={parser ? parser(value) : defaultParser(value)} />)
}
