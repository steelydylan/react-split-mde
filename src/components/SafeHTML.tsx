import * as React from 'react'
import xss from 'xss'

type Props = {
  ref?: React.MutableRefObject<HTMLElement>
  html: string
  tagName: string
  className?: string
  options?: xss.Option
}

export const SafeHTML= React.forwardRef(({ tagName, html, className, options }: Props, ref) => {
  return React.createElement(tagName, {
    className,
    ref,
    dangerouslySetInnerHTML: { __html: xss(html, options) }
  })
})
