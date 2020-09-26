import * as React from "react";
import { render } from "react-dom";
import { Editor } from "./src"
import 'zenn-content-css';
import './css/editor.css';
import markdown from './markdown.txt'
import { loadScript, loadStylesheet } from "zenn-init-embed/lib/utils/load-external-source";

loadScript({
  src: "https://platform.twitter.com/widgets.js",
  id: "embed-tweet",
  refreshIfExist: true,
});

loadStylesheet({
  id: "katex-css",
  href: "https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css",
});

render(<Editor previewClassName="znc" value={markdown} />, document.getElementById("main"))

