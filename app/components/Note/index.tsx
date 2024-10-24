// "use client";
// import {
//   Block,
//   BlockNoteSchema,
//   defaultInlineContentSpecs,
// } from "@blocknote/core";
// import {
//   createReactInlineContentSpec,
//   DefaultReactSuggestionItem,
//   useCreateBlockNote,
// } from "@blocknote/react";
// import { forwardRef, useEffect } from "react";
// import styled from "styled-components";
// const getMentionMenuItems = (
//   editor: typeof schema.BlockNoteEditor
// ): DefaultReactSuggestionItem[] => {
//   const mentions = [
//     {
//       type: "mention",
//       props: { user: "Steve", date: "", link: "" },
//       label: "Steve",
//     },
//     {
//       type: "mention",
//       props: { user: "Bob", date: "", link: "" },
//       label: "Bob",
//     },
//     {
//       type: "mention",
//       props: { user: "Joe", date: "", link: "" },
//       label: "Joe",
//     },
//     {
//       type: "mention",
//       props: { user: "Mike", date: "", link: "" },
//       label: "Mike",
//     },
//     {
//       type: "mention",
//       props: { user: "", date: "2023-10-17", link: "" },
//       label: "October 17, 2023",
//     },
//     {
//       type: "mention",
//       props: { user: "", date: "2023-12-25", link: "" },
//       label: "December 25, 2023",
//     },
//     {
//       type: "mention",
//       props: { user: "", date: "", link: "https://example.com" },
//       label: "Example Link",
//     },
//     {
//       type: "mention",
//       props: { user: "", date: "", link: "https://anotherlink.com" },
//       label: "Another Link",
//     },
//   ];

//   return mentions.map((mention) => ({
//     title: mention.label,
//     onItemClick: () => {
//       editor.insertInlineContent([
//         { type: mention.type, props: mention.props },
//         " ", // add a space after the mention
//       ]);
//     },
//   }));
// };

// const Mention = createReactInlineContentSpec(
//   {
//     type: "mention",
//     propSchema: {
//       user: { default: "" },
//       date: { default: "" },
//       link: { default: "" },
//     },
//     content: "none",
//   },
//   {
//     render: (props) => {
//       const { user, date, link } = props.inlineContent.props;
//       return (
//         <span style={{ backgroundColor: "#c1e7da" }}>
//           @{user || date || link}
//         </span>
//       );
//     },
//   }
// );

// // Our schema with inline content specs, which contain the configs and
// // implementations for inline content that we want our editor to use.

// const schema = BlockNoteSchema.create({
//   inlineContentSpecs: {
//     ...defaultInlineContentSpecs,
//     mention: Mention,
//   },
// });

// const NoteContainer = styled.div`
//   margin: 0;
//   display: grid;
//   grid-template-columns: 1fr;
//   border-radius: 4px;
//   column-gap: 10px;
//   position: relative;
//   max-width: 100%;
//   white-space: nowrap;
//   text-overflow: ellipsis;
// `;

// const DateText = styled.span`
//   color: #000000;
//   font-size: 12px;
//   line-height: 16px;
//   margin-top: 3px;
//   white-space: nowrap;
//   position: absolute;
//   top: 5px;
//   left: 5px;
//   z-index: 10;
// `;

// const formatDate = (date: string) => {
//   const options = { day: "numeric", month: "short" } as const;
//   const dateObj = new Date(date);
//   return dateObj.toLocaleDateString("en-US", options);
// };

// interface NoteProps {
//   date: string;
//   content: Block[];
//   onContentChange: (content: Block) => void;
//   onDeleteNote: (index: number) => void;
//   index: number;
// }

// const Note = forwardRef<HTMLDivElement, NoteProps>(
//   ({ date, content, onContentChange, onDeleteNote, index }, ref) => {
//     const editor = useCreateBlockNote({
//       initialContent: content || { type: "paragraph", content: "" },
//       // onChange: ({ document }) => onContentChange(document.blocks),
//       schema: schema,
//       trailingBlock: false,
//       animations: false,
//       defaultStyles: true,
//     });
//     // @typescript-eslint/no-explicit-any
//     useEffect(() => {
//       const handleKeyDown = (event) => {
//         if (event.key === "Enter") {
//           event.preventDefault();
//           alert(event);
//         }
//         if (event.key === "Backspace") {
//           const textCursorPosition = editor.getTextCursorPosition();
//           if (
//             !textCursorPosition?.prevBlock &&
//             !(textCursorPosition?.block?.content?.length > 0)
//           ) {
//             onDeleteNote(index);
//           }
//         }
//       };

//       document.addEventListener("keydown", handleKeyDown);
//       return () => {
//         document.removeEventListener("keydown", handleKeyDown);
//       };
//     }, []);
//     return (
//       <NoteContainer>
//         <DateText>{formatDate(date)}</DateText>
//         //tiptap
//       </NoteContainer>
//     );
//   }
// );

// Note.displayName = "Note";
// export default Note;
