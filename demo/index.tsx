import * as React from "react";
import { render } from "react-dom";
import { useProvider } from "../src/hooks";
import "../css/index.css";
import { parser } from "../src/parser";
import { Editor, defaultCommands, EnterKey } from "../src";
import markdown from "./markdown.txt";

declare global {
  interface Window {
    twttr: any;
  }
}

const Main = () => {
  const [emit, Provider] = useProvider();
  const [value, setValue] = React.useState(markdown);
  const handleValueChange = React.useCallback((newValue: string) => {
    setValue(newValue);
  }, []);
  const handleYouTubeClick = React.useCallback(() => {
    emit({
      type: "insert",
      text: "@[youtube](ApXoWvfEYVU)",
    });
  }, []);
  const handleImageUpload = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const uploadingMsg = "![](now uploading...)";
      emit({
        type: "insert",
        text: uploadingMsg,
      });
      await new Promise((resolve) => {
        setTimeout(() => resolve(), 1000);
      });
      emit({
        type: "replace",
        targetText: uploadingMsg,
        text: "![](https://source.unsplash.com/1600x900/?nature,water)",
      });
    },
    []
  );

  const handleClear = () => {
    emit({ type: "clear" });
  };

  const handleFocus = () => {
    emit({ type: "focus", last: true });
  };

  return (
    <Provider>
      <div className="tool">
        <button type="button" onClick={handleYouTubeClick}>
          YouTube挿入
        </button>
        <input type="file" onChange={handleImageUpload} />
        <button type="button" onClick={handleClear}>
          clear
        </button>
        <button type="button" onClick={handleFocus}>
          focus
        </button>
      </div>
      <div className="demo">
        <Editor
          parser={parser}
          value={value}
          onChange={handleValueChange}
          commands={{ 
            ...defaultCommands,
            save: (textarea, option) => {
              const { composing, code, shiftKey, metaKey, ctrlKey } = option;
              if ((metaKey || ctrlKey) && !shiftKey) {
                // + Enterで送信
                if (!composing && code === EnterKey) {
                  alert('command test')
                  return { stop: true, change: false };
                }
              }
            },
          }}
        />
      </div>
    </Provider>
  );
};

render(<Main />, document.getElementById("main"));
