"use client";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface Props {
  name: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value?: string;
  error?: string;
}

const MDEditor = ({ name, error, onChange, placeholder, value }: Props) => {
  return (
    <div className="w-full h-auto">
      <SimpleMDE
        id={`simple-mde-${name}`}
        value={value}
        placeholder={placeholder}
        className="h-auto"
        onChange={onChange}
      />
      {error && <div className="alert-error">{error}</div>}
    </div>
  );
};

export default MDEditor;
