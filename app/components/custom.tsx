import {
  Editor,
  Node,
  NodeViewProps,
  mergeAttributes,
  nodeInputRule,
} from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { useEffect, useState } from "react";

export const CustomParagraph = Node.create({
  name: "customParagraph",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      creationDate: {
        default: new Date().toISOString(),
      },
      checked: {
        default: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "p",
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const isCheckbox = node.textContent.startsWith("[]");
    return [
      "div",
      { style: "display: flex; align-items: center;" },
      [
        "input",
        {
          type: "date",
          value: node.attrs.creationDate,
          style: "margin-right: 8px;",
        },
      ],
      isCheckbox
        ? [
            "input",
            {
              type: "checkbox",
              checked: node.attrs.checked,
              style: "margin-right: 8px;",
            },
          ]
        : "",
      [
        "p",
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        isCheckbox ? node.textContent.slice(3) : node.textContent,
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomParagraphComponent);
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /\n$/,
        type: this.type,
        getAttributes: () => ({
          creationDate: new Date().toISOString(),
        }),
      }),
    ];
  },
});

const CustomParagraphComponent = (props: NodeViewProps) => {
  const { node, updateAttributes } = props;
  const [date, setDate] = useState(node.attrs.creationDate);
  const isCheckbox = node.textContent.startsWith("[]");
  const [checked, setChecked] = useState(node.attrs.checked);

  useEffect(() => {
    const newDate = new Date().toISOString();
    setDate(newDate);
    updateAttributes({ creationDate: newDate });
  }, [node.textContent]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
    updateAttributes({ creationDate: event.target.value });
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    updateAttributes({ checked: event.target.checked });
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ marginRight: "8px" }}>{`Date: ${date}`}</span>
      <input
        type="date"
        value={date}
        onChange={handleDateChange}
        style={{ marginRight: "8px" }}
      />
      {isCheckbox && (
        <input
          type="checkbox"
          checked={checked}
          onChange={handleCheckboxChange}
          style={{ marginRight: "8px" }}
        />
      )}
      <p>{isCheckbox ? node.textContent.slice(3) : node.textContent}</p>
    </div>
  );
};

// Initialize Editor
import Bold from "@tiptap/extension-bold";
import Heading from "@tiptap/extension-heading";
import Italic from "@tiptap/extension-italic";
import { BubbleMenu, EditorContent, FloatingMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const Tiptap = () => {
  const editor = new Editor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Heading,
      CustomParagraph,
      // other extensions
    ],
  });

  return (
    <>
      <EditorContent editor={editor} />
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          disabled={
            !editor.can().chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          disabled={
            !editor.can().chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          disabled={
            !editor.can().chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </button>
      </BubbleMenu>
      <FloatingMenu editor={editor}>
        <button onClick={() => editor.commands.toggleBold()}>Bold</button>
        <button onClick={() => editor.commands.toggleItalic()}>Italic</button>
      </FloatingMenu>
    </>
  );
};

export default Tiptap;
