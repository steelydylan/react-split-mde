import * as React from "react";
import { render } from "react-dom";
import { Editor } from "./src"
import 'zenn-content-css';
// import zennMarkdownHtml from 'zenn-markdown-html';

const value = `# hello zenn

- test1
- test2
- test3

\`\`\`js
const a = 'b';
\`\`\`
`

render(<Editor previewClassName="znc" value={value} />, document.getElementById("main"))
