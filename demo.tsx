import * as React from "react";
import { render } from "react-dom";
import { Editor } from "./src"
import 'zenn-content-css';
import markdownHTML from 'zenn-markdown-html'
import './css/editor.css';
import markdown from './markdown.txt'
import { loadScript, loadStylesheet } from "zenn-init-embed/lib/utils/load-external-source";
import { useProvider } from "./src/hooks";

loadStylesheet({
  id: "katex-css",
  href: "https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css",
});

const Main = () => {
  const [emit, Provider] = useProvider()
  const [value, setValue] = React.useState(markdown)

  const handleValueChange = React.useCallback((newValue: string) => {
    setValue(newValue)
  }, [])
  const handleYouTubeClick = React.useCallback(() => {
    emit({
      type: 'insert',
      text: '@[youtube](ApXoWvfEYVU)'
    })
  }, [])
  const handleTwitterClick = React.useCallback(() => {
    emit({
      type: 'insert',
      text: '@[tweet](https://twitter.com/catnose99/status/1309382877272879110)'
    })
  }, [])
  const handleImageUpload = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadingMsg = '![](now uploading...)'
    emit({
      type: 'insert',
      text: uploadingMsg
    })
    await new Promise((resolve) => {
      setTimeout(() => resolve(), 1000)
    })
    emit({
      type: 'replace',
      targetText: uploadingMsg,
      text: '![](https://source.unsplash.com/1600x900/?nature,water)'
    })
  }, [])

  return (<Provider>
    <button onClick={handleYouTubeClick}>YouTube挿入</button>
    <button onClick={handleTwitterClick}>Twitter挿入</button>
    <input type="file" onChange={handleImageUpload} />
    <Editor 
      previewClassName="znc" 
      previewCallback={{
      onBeforeNodeDiscarded(node: any) {
        if (node.closest && !node.classList.contains('embed-tweet') && node.closest('.embed-tweet')) {
          if (node.tagName === "IFRAME" || node.classList.contains('twitter-tweet')) {
            return false
          }
        }
        return true
      },
      onNodeAdded(node: any) {
        if (node.classList && node.classList.contains('embed-tweet')) {
          loadScript({
            src: "https://platform.twitter.com/widgets.js",
            id: "embed-tweet",
            refreshIfExist: true,
          }).then(() => {
            const znc = node.closest('.znc')
            if (znc) {
              const extraTweets = znc.querySelectorAll('.twitter-tweet + .twitter-tweet')
              extraTweets.forEach(tweet => tweet.remove())
            }
          });
        }
      },
    }}
    value={value}
    onChange={handleValueChange}
    parser={markdownHTML}
  /></Provider>)
}

render(<Main />, document.getElementById("main"))

