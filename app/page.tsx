"use client";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import Note from "./components/Note";
import styles from "./page.module.css";

const NotesWindow = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 3px;
  position: relative;
  border: none;
  background-color: #fff;
  border-radius: 4px;
  padding: 24px;
  width: 100%;
`;

const MasterButton = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  position: absolute;
  bottom: 2px;
  right: 40px;
`;

const App: React.FC = () => {
  const [notes, setNotes] = useState([
    {
      date: "2023-10-17",
      text: "Первая заметка",
      isStriked: false,
      showCheckbox: false,
    },
  ]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number | null>(null);
  const notesRef = useRef<HTMLTextAreaElement[]>([]);
  const handleButtonClick = () => {
    if (currentNoteIndex !== null) {
      setNotes((prevNotes) =>
        prevNotes.map((note, index) =>
          index === currentNoteIndex
            ? { ...note, showCheckbox: !note.showCheckbox, isStriked: false }
            : note
        )
      );

      setTimeout(() => {
        if (notesRef.current[currentNoteIndex]) {
          notesRef.current[currentNoteIndex].focus();
        }
      }, 0);
    }
  };

  const handleTransformToTask = (index: number) => {
    const updatedNotes = notes.map((note, i) => {
      if (i === index) {
        return {
          ...note,
          text: note.text.replace("[]", ""),
          showCheckbox: !note.showCheckbox,
          isStriked: false,
        };
      }
      return note;
    });

    setNotes(updatedNotes);
  };

  const handleTextChange = (
    index: number,
    newText: string,
    selectionStart: number
  ) => {
    if (newText.includes("\n")) {
      const textBeforeCursor = newText.substring(0, selectionStart);
      const textAfterCursor = newText
        .substring(selectionStart)
        .replace("\n", "");
      const newNotes = [
        ...notes.slice(0, index),
        { ...notes[index], text: textBeforeCursor },
        {
          date: new Date().toISOString().split("T")[0],
          text: textAfterCursor,
          isStriked: notes[index].isStriked,
          showCheckbox: notes[index].showCheckbox,
        },
        ...notes.slice(index + 1),
      ];
      setNotes(newNotes);
      setTimeout(() => {
        if (notesRef.current.length) {
          notesRef.current[index + 1].focus();
        }
      }, 0);
    } else {
      setNotes(
        notes.map((note, i) =>
          i === index ? { ...note, text: newText } : note
        )
      );
    }
  };

  const handleCheckboxChange = (index: number) => {
    setNotes(
      notes.map((note, i) =>
        i === index ? { ...note, isStriked: !note.isStriked } : note
      )
    );
  };

  const handleEnterPress = (position: number) => {
    if (currentNoteIndex !== null) {
      const currentNote = notes[currentNoteIndex];
      const textBefore = currentNote?.text?.slice(0, position) || "";
      const textAfter = currentNote?.text?.slice(position) || "";
      console.log(position, textBefore, textAfter, currentNote);

      const newNote = {
        date: new Date().toISOString().split("T")[0],
        text: textAfter,
        isStriked: false,
        showCheckbox: currentNote?.showCheckbox || false,
      };

      setNotes((prevNotes) => [
        ...prevNotes.slice(0, currentNoteIndex + 1),
        newNote,
        ...prevNotes.slice(currentNoteIndex + 1),
      ]);

      setTimeout(() => {
        if (notesRef.current[currentNoteIndex + 1]) {
          notesRef.current[currentNoteIndex + 1].focus();
          notesRef.current[currentNoteIndex + 1].setSelectionRange(0, 0);
          setCurrentNoteIndex(currentNoteIndex + 1);
        }
      }, 0);

      setNotes((prevNotes) =>
        prevNotes.map((note, index) =>
          index === currentNoteIndex ? { ...note, text: textBefore } : note
        )
      );
    }
  };

  const handleRemoveCheckbox = (index: number) => {
    setNotes(
      notes.map((note, i) =>
        i === index ? { ...note, showCheckbox: false } : note
      )
    );
  };

  const handleMergeWithPrevious = (index: number) => {
    const prevNoteText = notes[index > 0 ? index - 1 : 0].text.length;

    if (index > 0) {
      const newText = notes[index - 1].text + notes[index].text;
      const newNotes = notes
        .map((note, i) => {
          if (i === index - 1) {
            return { ...note, text: newText };
          }
          return note;
        })
        .filter((_, i) => i !== index);
      setNotes(newNotes);
      setTimeout(() => {
        if (notesRef.current[index - 1]) {
          notesRef.current[index - 1].focus();
          notesRef.current[index - 1].setSelectionRange(
            prevNoteText,
            prevNoteText
          );
          setCurrentNoteIndex(index - 1)
        }
      }, 0);
    }
  };

  const handleDelete = (index: number) => {
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);

    const prevIndex = index > 0 ? index - 1 : 0;
    setTimeout(() => {
      setCurrentNoteIndex(prevIndex);
      if (notesRef.current[prevIndex]) {
        notesRef.current[prevIndex].focus();
      }
    }, 0);
  };

  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <NotesWindow>
          {notes.map((note, index) => (
            <div key={index} onMouseDown={() => setCurrentNoteIndex(index)}>
              <Note
                ref={(el) => {
                  if (el) notesRef.current[index] = el;
                }}
                date={note.date}
                text={note.text}
                isStriked={note.isStriked}
                showCheckbox={note.showCheckbox}
                onTextChange={(text, selectionStart) =>
                  handleTextChange(index, text, selectionStart)
                }
                onCheckboxChange={() => handleCheckboxChange(index)}
                onEnterPress={(position) => handleEnterPress(position)}
                onTransformToTask={() => handleTransformToTask(index)}
                onDelete={() => handleDelete(index)}
                onRemoveCheckbox={() => handleRemoveCheckbox(index)}
                onMergeWithPrevious={() => handleMergeWithPrevious(index)}
              />
            </div>
          ))}
          <MasterButton onClick={handleButtonClick}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="13"
                height="13"
                rx="2.5"
                stroke="#B5B5BA"
              />
              <path
                d="M4 7.21429L6.1375 9.25L11.125 4.5"
                stroke="#B5B5BA"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MasterButton>
        </NotesWindow>
      </div>
    </div>
  );
};

export default App;
