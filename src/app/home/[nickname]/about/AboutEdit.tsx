"use client";

import MDEditor, { commands } from "@uiw/react-md-editor";
import "./AboutEdit.css";

export default function AboutEdit({
  aboutData,
  setAboutData,
}: {
  aboutData: string;
  setAboutData: React.Dispatch<string>;
}) {
  return (
    <MDEditor
      className="post-editor"
      data-color-mode="light"
      value={aboutData ?? ""}
      textareaProps={{
        placeholder: "Write your story",
      }}
      commands={[
        commands.title,
        commands.bold,
        commands.italic,
        commands.strikethrough,
        commands.quote,
        commands.link,
        commands.code,
        commands.fullscreen,
      ]}
      onChange={(value = "") => setAboutData(value)}
    />
  );
}
