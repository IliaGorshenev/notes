import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import React from 'react';

const RichTextEditorBlockNote = ({ text, onTextChange }) => {
  const editor = useCreateBlockNote({
    content: text,
    onChange: ({ html }) => onTextChange(html),
  });

  return <BlockNoteView editor={editor} />;
};

export default RichTextEditorBlockNote;
