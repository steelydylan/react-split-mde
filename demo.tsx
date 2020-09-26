import * as React from "react";
import { render } from "react-dom";
import { Editor } from "./src"
import 'zenn-content-css';
import './css/editor.css';
import markdown from './markdown.txt'

render(<Editor previewClassName="znc" value={markdown} />, document.getElementById("main"))

