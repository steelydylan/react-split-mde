import * as React from "react";
import { render } from "react-dom";
import { Editor } from "./src"
import 'zenn-content-css';
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

  return (<Provider>
    <button onClick={handleYouTubeClick}>YouTube挿入</button>
    <button onClick={handleTwitterClick}>Twitter挿入</button>
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
            const extraTweets = znc.querySelectorAll('.twitter-tweet + .twitter-tweet')
            extraTweets.forEach(tweet => tweet.remove())
          });
        }
      },
    }}
    value={markdown} 
  /></Provider>)
}

render(<Main />, document.getElementById("main"))

