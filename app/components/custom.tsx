import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";

const CustomParagraph = Paragraph.extend({
  // onUpdate({ name }) {
  //   // attributes.date = new Date().toISOString().split("T");
  //   console.log(name);
  // },
  // onUpdate({ node, HTMLAttributes }) {
  //   console.log(node);

  //   if (node && node.attrs) {
  //     // Ensure node and node.attrs exist
  //     const currentDate = new Date().toISOString().split("T")[0];
  //     node.attrs.date = currentDate;
  //     HTMLAttributes["data-date"] = currentDate;
  //     console.log(`Updated date: ${currentDate}`);
  //   } else {
  //     console.error("Node or its attributes are undefined");
  //   }
  // },
  addAttributes() {
    // Return an object with attribute configuration
    return {
      date: {
        default: new Date().toISOString().split("T"),
        renderHTML: (attributes) => {
          return {
            "data-date": new Date().toISOString().split("T"),
            "data-date-from-scope": attributes.date,
            style: `color: #1100ff`,
          };
        },
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      {
        ...HTMLAttributes,
        "data-type": "custom-paragraph",
      },
      ["span", `${node.attrs.date}`],
      ["div", 0],
    ];
  },

  // addNodeView() {
  //   return () => {
  //     const container = document.createElement("div");

  //     container.addEventListener("click", (event) => {
  //       alert("clicked on the container");
  //     });

  //     const content = document.createElement("div");
  //     container.append(content);

  //     return {
  //       dom: container,
  //       contentDOM: content,
  //     };
  //   };
  // },
});

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      // configure({
      //   HTMLAttributes: {
      //     date: new Date().toISOString(),
      //   },
      // }),
      // Paragraph.configure({
      //   HTMLAttributes: {
      //     date: update,
      //   },
      // }),
      // Text.configure({
      //   HTMLAttributes: {
      //     date: update,
      //   },
      // }),
      CustomParagraph,
    ],

    content: `
        <p>Text</p>
        
      `,
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      <EditorContent editor={editor} />
    </>
  );
};

export default Tiptap;
