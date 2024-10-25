"use client";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextStyle from "@tiptap/extension-text-style";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { atom, useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import "./components/styles.scss";
import suggestion from "./components/suggestions";
const initialUsersNotes = [
  {
    userId: "user1",
    notes: [
      {
        date: "2024-10-10",
        content: "<p>Это первая заметка пользователя 1.</p>",
      },
      {
        date: "2024-08-10",
        content:
          "<p>Это вторая заметка пользователя 1. Добавим немного деталей.</p>",
      },
      {
        date: "2024-06-20",
        content:
          "<p>Третья заметка пользователя 1 с дополнительной информацией.</p>",
      },
      {
        date: "2024-05-15",
        content:
          "<ul><li>Заметка 4. Пункт 1</li><li>Заметка 4. Пункт 2</li></ul>",
      },
    ],
  },
  {
    userId: "user2",
    notes: [
      {
        date: "2024-09-10",
        content:
          "<p>Много текст Много текст Много текст Много текст Много текст Много текст Много текст Много текст Много текст Много текст Много текст Много текст Много текст Много текст Много текст Много текст Много текст Много текст Много текст Много текст Много текст Много текст Много текст Много текст Много текст Много текст Много текст </p>",
      },
      {
        date: "2024-07-10",
        content: "<p>Это вторая заметка пользователя 2.</p>",
      },
      {
        date: "2024-06-18",
        content: "<ul><li>Пункт 1</li><li>Пункт 2</li><li>Пункт 3</li></ul>",
      },
      {
        date: "2024-05-22",
        content:
          "<p>Четвертая заметка пользователя 2 с рандомными мыслями.</p>",
      },
    ],
  },
  {
    userId: "user3",
    notes: [
      {
        date: "2024-11-01",
        content:
          "<p>Первая заметка пользователя 3. Очень интересный текст.</p>",
      },
      {
        date: "2024-10-20",
        content: "<p>Вторая заметка пользователя 3 с различными идеями.</p>",
      },
      {
        date: "2024-09-05",
        content:
          "<p>Очень длинная и подробная заметка пользователя 3, заполненная множеством инсайтов, мыслей и анализов различных тем. Эта заметка продолжается и продолжается, предоставляя огромное количество информации и ценных данных для всех, кто ее прочитает. Поистине впечатляющая работа.</p>",
      },
      {
        date: "2024-08-25",
        content: "<p>Еще одна заметка пользователя 3 с размышлениями.</p>",
      },
    ],
  },
  {
    userId: "user4",
    notes: [
      {
        date: "2024-04-01",
        content: "<p>Еще какая-то заметка.</p>",
      },
      {
        date: "2024-09-15",
        content:
          "<p>Вторая заметка пользователя 4 с несколькими интересными пунктами.</p>",
      },
      {
        date: "2024-10-20",
        content:
          "<ul><li>Новая наверное заметка</li><li>Много важных тем</li><li>Много информации</li></ul>",
      },
      {
        date: "2024-09-20",
        content:
          "<p>Последняя заметка пользователя 4 с заключительными мыслями.</p>",
      },
    ],
  },
];

const usersNotesAtom = atom<{
  users: { userId: string; notes: { date: string; content: string }[] }[];
  activeUserId: string | null;
}>({
  users: initialUsersNotes,
  activeUserId: null,
});

interface NotesWindowProps {
  $isActive: boolean | null;
}

const NotesWindow = styled.div<NotesWindowProps>`
  display: flex;
  flex-direction: column;
  row-gap: 3px;
  position: relative;
  border: none;
  background-color: ${({ $isActive }) => ($isActive ? "#f5f5f5" : "#fff")};
  border-radius: 4px;
  padding: 18px;
  width: 450px;
  margin: 0 auto;
  border: 1px solid #e6e6e6;
  box-sizing: content-box;
  max-height: ${({ $isActive }) => ($isActive ? "none" : "30px")};
  overflow: ${({ $isActive }) => ($isActive ? "visible" : "hidden")};
  transition: max-height 0.5s ease-in-out;

  > :not(:first-child) {
    display: ${({ $isActive }) => ($isActive ? "block" : "none")};
  }

  > :first-child {
    max-height: ${({ $isActive }) => ($isActive ? "none" : "24px")};
    overflow: ${({ $isActive }) => ($isActive ? "visible" : "hidden")};
  }
`;

const Button = styled.button`
  border: none;
  background-color: transparent;
  color: #73b9a1;
  cursor: pointer;
  margin: auto;
  padding: 10px 30px;
  display: flex;
  column-gap: 10px;
  font-size: 16px;
  line-height: 26px;
  align-items: center;
  transition: color 0.2s ease-in-out;
  &:hover {
    color: #42846d;
    transition: color 0.2s ease-in-out;
  }
`;

const NoteContainer = styled.div`
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  border-radius: 4px;
  column-gap: 10px;
  position: relative;
  max-width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-left: 42px;
`;

const DateText = styled.span`
  color: #000000;
  font-size: 12px;
  line-height: 16px;
  margin-top: 3px;
  white-space: nowrap;
  position: absolute;
  top: 2px;
  left: 0;
  z-index: 10;
`;

// const findLatestNote = (notes: { date: string; content: string }[]) => {
//   return notes.reduce((latest, note) => {
//     return new Date(note.date) > new Date(latest.date) ? note : latest;
//   }, notes[0]);
// };
const App = () => {
  const [{ users, activeUserId }, setUsersNotes] = useAtom(usersNotesAtom);
  // const findLatestNote = (notes) => {
  //   return notes.reduce((latest, note) => {
  //     return new Date(note.date) > new Date(latest.date) ? note : latest;
  //   }, notes[0]);
  // };
  const handleContentChange = (
    userId: string,
    index: number,
    newContent: string
  ) => {
    const updatedUsersNotes = users.map((user) =>
      user.userId === userId
        ? {
            ...user,
            notes: user.notes.map((note, i) =>
              i === index
                ? {
                    ...note,
                    content: newContent,
                    date: new Date().toISOString().split("T")[0],
                  }
                : note
            ),
          }
        : user
    );
    setUsersNotes({ users: updatedUsersNotes, activeUserId });
  };
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (target && !target.closest(".notes-window")) {
      setUsersNotes((prev) => ({ ...prev, activeUserId: null }));
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleNewNote = (userId: string) => {
    const newNote = {
      date: new Date().toISOString().split("T")[0],
      content: "",
    };
    const updatedUsersNotes = users.map((user) =>
      user.userId === userId
        ? { ...user, notes: [...user.notes, newNote] }
        : user
    );
    setUsersNotes({ users: updatedUsersNotes, activeUserId });
  };

  const handleDeleteNote = (userId: string, index: number) => {
    const updatedUsersNotes = users.map((user) =>
      user.userId === userId
        ? { ...user, notes: user.notes.filter((_, i) => i !== index) }
        : user
    );
    setUsersNotes({ users: updatedUsersNotes, activeUserId });
  };

  const handleSetActiveUser = (userId: string) => {
    setUsersNotes((prev) => ({ ...prev, activeUserId: userId }));
  };

  return (
    <>
      {users.map(({ userId, notes }) => {
        // const latestNote = findLatestNote(notes);
        const displayedNotes = notes;
        const allNotes = notes;
        return (
          <NoteWindow
            key={userId}
            userId={userId}
            allNotes={allNotes}
            activeUserId={activeUserId}
            notes={displayedNotes}
            onContentChange={handleContentChange}
            onNewNote={handleNewNote}
            onDeleteNote={handleDeleteNote}
            setActiveUser={handleSetActiveUser}
          />
        );
      })}
    </>
  );
};

interface NoteWindowProps {
  userId: string;
  notes: { date: string; content: string }[];
  onContentChange: (userId: string, index: number, newContent: string) => void;
  onNewNote: (userId: string) => void;
  onDeleteNote: (userId: string, index: number) => void;
  setActiveUser: (userId: string) => void;
  activeUserId: string | null;
  allNotes: { date: string; content: string }[];
}
interface NoteEditorRef {
  editor: {
    commands: {
      focus: () => void;
      setTextSelection: (position: number) => void;
    };
    state: {
      doc: {
        content: {
          size: number;
        };
      };
    };
    isEmpty: boolean;
  };
}
const NoteWindow = ({
  userId,
  notes,
  onContentChange,
  onNewNote,
  onDeleteNote,
  setActiveUser,
  allNotes,
  activeUserId,
}: NoteWindowProps) => {
  const notesRef = useRef<NoteEditorRef[]>([]);

  const handleSetActiveUser = (userId: string) => {
    setActiveUser(userId);
    if (!isActive) {
      setTimeout(() => {
        console.log(allNotes);
        const latestNoteIndex = allNotes.findIndex(
          (note) =>
            new Date(note.date) >=
            new Date(
              Math.max.apply(
                null,
                notes.map((n) => new Date(n.date).getTime())
              )
            )
        );

        if (latestNoteIndex !== -1 && notesRef.current[latestNoteIndex]) {
          notesRef.current[latestNoteIndex].editor.commands.focus();
          notesRef.current[latestNoteIndex].editor.commands.setTextSelection(
            notesRef.current[latestNoteIndex].editor.state.doc.content.size - 1
          );
        }
      }, 0);
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent) => {
    if (event.key === "Backspace" && notesRef.current[index]?.editor?.isEmpty) {
      onDeleteNote(userId, index);

      if (index > 0) {
        setTimeout(() => {
          if (notesRef.current[index - 1]) {
            notesRef.current[index - 1]?.editor.commands.focus();
            notesRef.current[index - 1]?.editor.commands.setTextSelection(
              notesRef.current[index - 1]?.editor.state.doc.content.size - 1
            );
          }
        }, 0);
      }
    }
  };
  const handleDeleting = (index: number) => {
    onDeleteNote(userId, index);
    if (index > 0) {
      setTimeout(() => {
        if (notesRef.current[index - 1]) {
          notesRef.current[index - 1]?.editor.commands.focus();
          notesRef.current[index - 1]?.editor.commands.setTextSelection(
            notesRef.current[index - 1]?.editor.state.doc.content.size - 1
          );
        }
      }, 0);
    }
  };

  const isActive = activeUserId === userId;
  console.log("this is note", notes);
  return (
    <>
      <NotesWindow
        onClick={() => handleSetActiveUser(userId)}
        $isActive={isActive}
        className="notes-window"
      >
        {notes.map((note, index) => (
          <Note
            key={index}
            index={index}
            date={note.date}
            content={note.content}
            onContentChange={(newContent: string) =>
              onContentChange(userId, index, newContent)
            }
            onDeleteNote={() => handleDeleting(index)}
            onKeyDown={(event: KeyboardEvent) => handleKeyDown(index, event)}
            setNoteRef={(el: NoteEditorRef) => (notesRef.current[index] = el)}
          ></Note>
        ))}
        <Button onClick={() => onNewNote(userId)}>Добавить заметку</Button>
      </NotesWindow>
    </>
  );
};

interface NoteProps {
  index: number;
  content: string;
  onContentChange: (content: string) => void;
  date: string;
  onDeleteNote: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
  setNoteRef: (el: NoteEditorRef) => void;
}

const Note = ({
  content,
  onContentChange,
  date,
  onDeleteNote,
  setNoteRef,
}: NoteProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      TaskList,
      TaskItem,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),

      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion,
        // renderText({ options, node }) {
        //   return `${options.suggestion.char}${
        //     node.attrs.label ?? node.attrs.id
        //   }`;
        // },
        // suggestion: {
        //   items: ({ query }) => {
        //     return [
        //       { id: "Steve", label: "Steve" },
        //       { id: "Bob", label: "Bob" },
        //       { id: "Joe", label: "Joe" },
        //       { id: "Mike", label: "Mike" },
        //     ].filter((item) =>
        //       item.label.toLowerCase().includes(query.toLowerCase())
        //     );
        //   },
        //   render: () => {
        //     const div = document.createElement("div");
        //     div.classList.add("suggestion");

        //     return {
        //       onStart: (props) => {
        //         div.innerHTML = props.items
        //           .map(
        //             (item) => `<div class='suggestion-item'>${item.label}</div>`
        //           )
        //           .join("");

        //         props.popup.setContent(div);
        //       },
        //       onUpdate(props) {
        //         div.innerHTML = props.items
        //           .map(
        //             (item) => `<div class='suggestion-item'>${item.label}</div>`
        //           )
        //           .join("");
        //       },
        //       onKeyDown(props) {
        //         if (props.event.key === "Escape") {
        //           props.close();
        //           return true;
        //         }
        //         return false;
        //       },
        //     };
        //   },
        // },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Backspace" && editor?.isEmpty) {
        event.preventDefault();
        onDeleteNote();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor, onDeleteNote]);

  useEffect(() => {
    if (editor && setNoteRef) {
      setNoteRef({
        editor: {
          commands: editor.commands,
          state: editor.state,
          isEmpty: editor.isEmpty,
        },
      });
    }
  }, [editor, setNoteRef]);

  // useEffect(() => {
  //   const handleKeyDown = (event) => {
  //     if (event.key === "Backspace" && editor.isEmpty) {
  //       onDeleteNote();
  //     }
  //   };

  //   document.addEventListener("keydown", handleKeyDown);
  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [editor, onDeleteNote]);
  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  if (!editor) {
    return null;
  }
  return (
    <>
      <NoteContainer>
        <DateText>{formatDate(date)}</DateText>
        {/* <Note
          date={date}
          content={content}
          onContentChange={(newContent) =>
            onContentChange(index, newContent)
          }
          onDeleteNote={() => handleDeleteNote(index)}
        /> */}

        {editor && (
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div className="bubble-menu">
              <button
                onClick={setLink}
                className={editor.isActive("link") ? "is-active" : ""}
              >
                Set link
              </button>
              {editor.isActive("link") && (
                <button
                  onClick={() => editor.chain().focus().unsetLink().run()}
                >
                  Unset link
                </button>
              )}
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "is-active" : ""}
              >
                Bold
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "is-active" : ""}
              >
                Italic
              </button>
              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive("strike") ? "is-active" : ""}
              >
                Strike
              </button>

              <button
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                className={editor.isActive("taskList") ? "is-active" : ""}
              >
                Task List
              </button>
            </div>
          </BubbleMenu>
        )}
        <EditorContent editor={editor} />
      </NoteContainer>
    </>
  );
};

export default App;

const formatDate = (date: string) => {
  const options = { day: "numeric", month: "short" } as const;
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", options);
};
