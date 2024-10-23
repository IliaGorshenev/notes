import {
  Editor,
  Node,
  NodeViewProps,
  mergeAttributes,
  nodeInputRule,
} from "@tiptap/core";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import { BubbleMenu, EditorContent, FloatingMenu, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

// Define CustomParagraph Node

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
      "p",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      isCheckbox
        ? ["input", { type: "checkbox", checked: node.attrs.checked }]
        : "",
      `Date: ${node.attrs.creationDate}`,
      isCheckbox ? node.textContent.slice(3) : node.textContent,
      0,
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
// React Node View Component
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
      {isCheckbox && (
        <input
          type="checkbox"
          checked={checked}
          onChange={handleCheckboxChange}
          style={{ marginRight: "8px" }}
        />
      )}
      <p>{isCheckbox ? node.textContent.slice(3) : node.textContent}</p>
      <input
        type="date"
        value={date}
        onChange={handleDateChange}
        style={{ marginLeft: "8px" }}
      />
    </div>
  );
};
// Initialize Editor

const Tiptap = () => {
  const editor = new Editor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      CustomParagraph,
      // other extensions
    ],
  });
  // editor.commands.toggleBold();

  // // Toggle italic
  // editor.commands.toggleItalic();
  return (
    <>
      <EditorContent editor={editor} />
      <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
    </>
  );
};

export default Tiptap;
