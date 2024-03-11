import { ChangeEvent, DragEvent, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import Editor, { commands, ICommand } from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import imageUpload from "logics/imageUpload";
import "./OnWrite.css";
import useColorScheme from "logics/useColorScheme";

interface Props {
  isEdit: boolean;
  postContent: PostDetail;
  setPostContent: React.Dispatch<React.SetStateAction<PostDetail>>;
  onPreview: () => void;
}

export default function OnWrite({ isEdit, postContent, setPostContent, onPreview }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const onTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setPostContent((prev) => ({
      ...prev,
      title: value,
    }));
  };

  // drag & drop image
  const onDrag = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const { type } = event;
    switch (type) {
      case "dragenter":
        setIsDragging(true);
        break;
      case "dragleave":
        setIsDragging(false);
        break;
      case "dragover":
        if (event.dataTransfer.files) {
          setIsDragging(true);
        }
        break;
      case "drop":
        const file = event.dataTransfer.files[0];
        if (!file?.type.includes("image/")) {
          setIsDragging(false);
          return;
        }
        onImgUpload(file);
        break;
    }
  };

  const uploadImgCommand: ICommand = {
    name: "image",
    keyCommand: "image",
    buttonProps: { "aria-label": "Insert image" },
    icon: (
      <svg width="12" height="12" viewBox="0 0 520 520">
        <path
          fill="currentColor"
          d="M5,350h340V0H5V350z M25,330v-62.212h300V330H25z M179.509,247.494H60.491L120,171.253L179.509,247.494z M176.443,211.061l33.683-32.323l74.654,69.05h-79.67L176.443,211.061z M325,96.574c-6.384,2.269-13.085,3.426-20,3.426 c-33.084,0-60-26.916-60-60c0-6.911,1.156-13.612,3.422-20H325V96.574z M25,20h202.516C225.845,26.479,225,33.166,225,40 c0,44.112,35.888,80,80,80c6.837,0,13.523-0.846,20-2.518v130.306h-10.767l-104.359-96.526l-45.801,43.951L120,138.748 l-85.109,109.04H25V20z"
        ></path>
      </svg>
    ),
    execute: async () => {
      imageRef.current?.click();
    },
  };

  const onInputImgChange = () => {
    imageRef.current?.files && onImgUpload(imageRef.current.files[0]);
  };

  const onImgUpload = async (image: File) => {
    const textarea = inputRef.current?.querySelector("textarea") as HTMLTextAreaElement;
    if (!textarea) return;
    try {
      const imageLink = await imageUpload(image);
      const currentText = postContent.postDetail;
      const textCursor = textarea.selectionStart;
      setPostContent((prev) => ({
        ...prev,
        postDetail: `${currentText.slice(0, textCursor)}![](${imageLink})${currentText.slice(textCursor)}`,
      }));
    } catch (error) {
      console.log(error);
      window.alert("Image upload failed.");
    } finally {
      if (imageRef.current) imageRef.current.value = "";
      setIsDragging(false);
    }
  };

  const onQuit = () => {
    if (window.confirm("Post data will not be saved when you leave the window.")) router.back();
  };

  return (
    <div className={`on-write-layout ${isDragging ? "post-drag" : ""}`}>
      <div className="post-init-animation">
        <div className="mt-3 col col-sm-10 offset-sm-1 col-lg-8 offset-lg-2 col-xxl-6 offset-xxl-3">
          <section onDragEnter={onDrag} onDragLeave={onDrag} onDragOver={onDrag} onDrop={onDrag}>
            <input hidden type="file" accept="image/*" ref={imageRef} defaultValue={""} onChange={onInputImgChange} />
            <input
              className={`w-100 fs-1 mb-3 ${colorScheme === "dark" ? "text-ccc" : "text-777"} post-input-bar`}
              placeholder="Write post title"
              value={postContent.title}
              onChange={onTitleChange}
              maxLength={50}
              required
            />
            <div ref={inputRef}>
              <Editor
                className="post-editor"
                data-color-mode={colorScheme}
                value={postContent.postDetail}
                visibleDragbar={false}
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
                  uploadImgCommand,
                  commands.code,
                  commands.fullscreen,
                ]}
                previewOptions={{
                  rehypePlugins: [
                    [
                      rehypeSanitize,
                      {
                        ...defaultSchema,
                        attributes: {
                          ...defaultSchema.attributes,
                          span: [
                            // @ts-ignore
                            ...(defaultSchema.attributes.span || []),
                            // List of all allowed tokens:
                            ["className"],
                          ],
                          code: [["className"]],
                        },
                      },
                    ],
                  ],
                }}
                onChange={(value = "") => {
                  setPostContent((prev) => ({
                    ...prev,
                    postDetail: value,
                  }));
                }}
              />
            </div>
            <button className="btn btn-secondary mt-3" onClick={onQuit}>
              Quit
            </button>
            <button className="btn btn-primary float-end mt-3" onClick={onPreview}>
              {isEdit ? "Edit" : "Write up"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
