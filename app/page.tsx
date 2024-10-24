"use client";
// import "@blocknote/core/fonts/inter.css";
// import "@blocknote/mantine/style.css";
import { useEffect, useState } from "react";
import styled from "styled-components";
// import Note from "./components/Note";
import Tiptap from "./components/custom";

const NotesWindow = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 3px;
  position: relative;
  border: none;
  background-color: #fff;
  border-radius: 4px;
  padding: 24px;
  width: 450px;
  margin: 0 auto;
  margin-top: 70px;
  box-sizing: border-box;
`;

// type Note = {
//   date: string;
//   content: Block[];
// };

// type Link = {
//   type: "link";
//   content: StyledText[];
//   href: string;
// };
// type Styles = {
//   bold: boolean;
//   italic: boolean;
//   underline: boolean;
//   strikethrough: boolean;
//   textColor: string;
//   backgroundColor: string;
// };

// type StyledText = {
//   type: "text";
//   text: string;
//   styles: Styles;
// };

// type InlineContent = Link | StyledText;
// type TableContent = {
//   type: "tableContent";
//   rows: {
//     cells: InlineContent[][];
//   }[];
// };
// type Block = {
//   id: string;
//   type: string;
//   props: Record<string, boolean | number | string>;
//   content: InlineContent[] | TableContent | undefined;
//   children: Block[];
// };

const App = () => {
  // const [notes, setNotes] = useState<Note[]>([
  //   {
  //     date: "2023-10-18",
  //     content: [
  //       {
  //         id: "df0ef63a-6139-48dd-9075-8bfad7ec8ca6",
  //         type: "paragraph",
  //         props: {
  //           textColor: "default",
  //           backgroundColor: "default",
  //           textAlignment: "left",
  //         },
  //         content: [
  //           {
  //             type: "text",
  //             text: "Сохраненная заметка",

  //             // @ts-expect-error @typescript-eslint/ban-ts-comment
  //             styles: {},
  //           },
  //         ],
  //         children: [],
  //       },
  //     ],
  //   },
  //   {
  //     date: "2023-10-18",
  //     content: [
  //       {
  //         id: "eac65698-34b0-44de-9887-2d1962d2ccbf",
  //         type: "heading",
  //         props: {
  //           textColor: "default",
  //           backgroundColor: "default",
  //           textAlignment: "left",
  //           level: 3,
  //         },
  //         content: [
  //           {
  //             type: "text",
  //             text: "Tasker",
  //             // @ts-expect-error @typescript-eslint/ban-ts-comment
  //             styles: {},
  //           },
  //         ],
  //         children: [],
  //       },
  //       {
  //         id: "b7a2e9d9-89e2-4351-90a1-b0b30c307db5",
  //         type: "checkListItem",
  //         props: {
  //           textColor: "default",
  //           backgroundColor: "default",
  //           textAlignment: "left",
  //           checked: false,
  //         },
  //         content: [
  //           {
  //             type: "text",
  //             text: "First",
  //             // @ts-expect-error @typescript-eslint/ban-ts-comment
  //             styles: {},
  //           },
  //         ],
  //         children: [],
  //       },
  //       {
  //         id: "a28384ae-46f0-43d3-a476-5332f86a9bb2",
  //         type: "checkListItem",
  //         props: {
  //           textColor: "default",
  //           backgroundColor: "default",
  //           textAlignment: "left",
  //           checked: false,
  //         },
  //         content: [
  //           {
  //             type: "text",
  //             text: "Second",
  //             // @ts-expect-error @typescript-eslint/ban-ts-comment
  //             styles: {},
  //           },
  //         ],
  //         children: [],
  //       },
  //     ],
  //   },
  // ]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server
  }
  return (
    <div>
      <NotesWindow>
        {/* {notes.map((note, index) => (
          <div key={index}>
            <Note
              key={index} // Ensure unique key for each note
              ref={(el) => {
                if (el) notesRef.current[index] = el;
              }}
              date={note.date}
              // @ts-expect-error @typescript-eslint/ban-ts-comment
              content={note.content}
              onContentChange={(newContent) =>
                // @ts-expect-error @typescript-eslint/ban-ts-comment

                handleContentChange(index, newContent)
              }
              onDeleteNote={() => handleDeleteNote(index)}
            />
          </div>
        ))} */}
        {/* <Button onClick={handleNewNote}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 10H17"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10 17V3"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Добавить заметку
        </Button> */}
        <Tiptap></Tiptap>
      </NotesWindow>
    </div>
  );
};

export default App;
