import AceEditor from "react-ace";
import dynamic from "next/dynamic";

import "ace-builds/src-min-noconflict/mode-c_cpp.js";
import "ace-builds/src-min-noconflict/mode-python.js";
import "ace-builds/src-min-noconflict/theme-gob.js";
import "ace-builds/src-min-noconflict/theme-chrome.js";
import "ace-builds/src-min-noconflict/ext-language_tools.js";
import "ace-builds/src-min-noconflict/snippets/c_cpp.js";
import "ace-builds/src-min-noconflict/snippets/python.js";

interface Props {
  name: string;
  value: string;
  onChange: (event: any) => void;
}

const CodeEditorImp = ({ name, value, onChange }: Props) => {
  return (
    <AceEditor
      className="prose"
      value={value}
      onChange={onChange}
      name={name}
      width={"100%"}
      enableBasicAutocompletion={true}
      enableLiveAutocompletion={true}
      enableSnippets={true}
      setOptions={{
        useWorker: false,
      }}
    />
  );
};

const CodeEditor = dynamic(() => Promise.resolve(CodeEditorImp), {
  ssr: false,
});
export default CodeEditor;
