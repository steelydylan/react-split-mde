// plugis
import mdContainer from "markdown-it-container";
import prism from "markdown-it-prism";
import footnote from "markdown-it-footnote";
import lazyLoading from "markdown-it-image-lazy-loading";
import taskLists from "markdown-it-task-lists";
import anchor from "markdown-it-anchor";
import linkAttribute from "markdown-it-link-attributes";
import customBlock from "markdown-it-custom-block";
import textMatch from "markdown-it-texmath";
import katex from "katex";
import { md } from "./md-base";

// options
import { mdContainerDetails, mdContainerMessage } from "./option-md-container";
import { optionCustomBlock } from "./option-md-custom-block";

md.use(prism)
  .use(footnote)
  .use(lazyLoading)
  // .use("markdown-it-imsize", { autofill: true })
  .use(taskLists, { enabled: true })
  .use(anchor, { level: [1, 2, 3] })
  .use(linkAttribute, {
    attrs: {
      rel: "nofollow",
    },
  })
  .use(customBlock, optionCustomBlock)
  .use(mdContainer, "details", mdContainerDetails)
  .use(mdContainer, "message", mdContainerMessage)
  .use(textMatch, {
    engine: katex,
    delimiters: "dollars",
    katexOptions: { macros: { "\\RR": "\\mathbb{R}" } },
  });

// custom footnote
md.renderer.rules.footnote_block_open = () =>
  '<section class="footnotes">\n' +
  '<div class="footnotes-title"><img src="https://twemoji.maxcdn.com/2/svg/1f58b.svg" class="emoji footnotes-twemoji" loading="lazy" width="20" height="20">脚注</div>\n' +
  '<ol class="footnotes-list">\n';

export default md;
