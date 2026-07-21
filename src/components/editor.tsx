"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

export default function Editor({ value, onChange }: EditorProps) {
  return <ReactQuill theme="snow" value={value} onChange={onChange} />;
}
