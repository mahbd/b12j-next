// import ReactQuill from "react-quill";
import "./quill.css";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const modules = {
  toolbar: {
    container: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code"],
      ["link", "image"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ script: "sub" }, { script: "super" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
    ],
    handlers: {
      image: function (this: any) {
        const editor = this.quill;
        const range = editor.getSelection();
        const value = prompt("Please paste the image url here.");
        if (value) {
          editor.insertEmbed(range.index, "image", value);
        }
      },
    },
  },
};

interface Props {
  name: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value?: string;
  error?: string;
}

const TextEditor = ({ name, placeholder, onChange, value, error }: Props) => {
  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        margin: "0.2rem",
        background: "white",
        color: "black",
      }}
    >
      <ReactQuill
        id={name}
        defaultValue={value}
        onChange={onChange}
        theme="snow"
        modules={modules}
        placeholder={placeholder}
      />
      {error && <div className="alert-danger">{error}</div>}
      <br />
    </div>
  );
};

export default TextEditor;
