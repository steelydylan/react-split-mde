# Zenn MDE 

![](https://github.com/steelydylan/react-split-mde/workflows/Node%20CI/badge.svg)
[![npm version](https://badge.fury.io/js/react-split-mde.svg)](https://badge.fury.io/js/react-split-mde)
[![npm download](http://img.shields.io/npm/dm/react-split-mde.svg)](https://www.npmjs.com/package/react-split-mde)
[![GitHub license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://raw.githubusercontent.com/steelydylan/react-split-mde/master/LICENSE)
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Awesome%20Markdown%20Editor%20JavaScript%20%Editor&url=https://github.com/steelydylan/react-split-mde&via=zenn_dev&hashtags=zenn)


ZennMDE is a Markdown Editor which enables you to write contents smoothly even with a large amount of content.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari | 
| --------- | --------- | --------- | --------- | 

## ScreenShot

Not Yet

## Features

*   Fully customizable
*   Synced scroll position across the contents and the preview
*   No stress writing even with a large amount of content

## Install

```sh
$ npm install react-split-mde --save
```

## Usage

```js
import React, { useCallback, useState } from 'react';
import { render } from 'react-dom';
import { Editor, useProvider } from 'react-split-mde';
import markdownToHtml from "zenn-markdown-html";
import 'react-split-mde/css/editor.css';

const MDE = () => {
  const [markdown, setMarkdown] = useState('')
  const handleValueChange = useCallback((newValue: string) => {
    setMarkdown(newValue);
  }, []);

  return (
    <Provider>
      <Editor
        previewClassName="znc"
        value={markdown}
        onChange={handleValueChange}
        parser={markdownToHtml}
      />
    </Provider>
  )
}

render(<MDE />, document.getElementById("app"));
```

## Try it on CodeSandbox

Not yet...

## Props

| Props            | Description                                             | Type                                        | Default |
|------------------|---------------------------------------------------------|---------------------------------------------|---------|
| commands         | key binds                                               | Record&lt; string,  Command&gt;;               |         |
| previewClassName | class name to be applied to preview area                |                                             | "znc"   |
| previewCallback  | morphdom callbacks to be applied to preview area        | Record&lt;string, Function&gt;                    | {}      |
| parser           | markdown parser function                                | ( text :  string )  =&gt;   Promise &lt;string&gt; |         |
| value            | markdown                                                | string                                      | ""      |
| onChange         | callback when markdown changed                          | ( value :  string )  =&gt;   void              |         |
| psudoMode        | highlight markdown area with highlight.js               | boolean                                     | false   |
| debounceTime     | debounced time to apply markdown result to preview area | number                                      | 3000    |

## Download
[Download ZIP](https://github.com/steelydylan/react-split-mde/archive/master.zip)

## Github
[https://github.com/steelydylan/react-split-mde](https://github.com/steelydylan/react-split-mde)

## Contributor
[@steelydylan](https://github.com/steelydylan)

## License
Code and documentation copyright 2020 by steelydylan, Inc. Code released under the [MIT License](https://github.com/steelydylan/react-split-mde/blob/master/LICENSE).