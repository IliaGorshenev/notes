"use client";
import { useAtom } from "jotai";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import { currentNoteIndexAtom, notesAtom } from "./atom";
import Note from "./components/Note";
import styles from "./page.module.css";

const resizeTextArea = (element: HTMLTextAreaElement) => {
  element.style.height = "auto";
  if (element.scrollHeight > element.clientHeight) {
    element.style.height = `${element.scrollHeight}px`;
  }
};

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
  box-sizing: border-box;
  overflow: hidden;
`;

const Checkbox = styled.button<{
  isSingleNote: boolean;
  isNoteFocused: boolean;
}>`
  border: none;
  background-color: transparent;
  cursor: pointer;
  position: absolute;
  bottom: ${(props) =>
    props.isSingleNote && !props.isNoteFocused ? "20px" : "2px"};
  right: 40px;
  transition: bottom 0.3s ease-in-out;
`;

const Button = styled.button`
  border: none;
  background-color: #fff;
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
const sortNotesByDate = (updatedNotes: any) => {
  return updatedNotes.sort(
    (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

const App: React.FC = () => {
  const [notes, setNotes] = useAtom(notesAtom);
  const [currentNoteIndex, setCurrentNoteIndex] = useAtom(currentNoteIndexAtom);
  const [isNoteFocused, setIsNoteFocused] = useState(false);

  const notesRef = useRef<HTMLTextAreaElement[]>([]);
  const dateNow = new Date().toISOString();

  const handleButtonClick = () => {
    if (currentNoteIndex !== null) {
      const updatedNotes = notes.map((note, index) =>
        index === currentNoteIndex
          ? { ...note, showCheckbox: !note.showCheckbox, isStriked: false }
          : note
      );
      setNotes(sortNotesByDate(updatedNotes));
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
    setNotes(sortNotesByDate(updatedNotes));
  };

  const handleTextChange = (
    index: number,
    newText: string,
    selectionStart: number
  ) => {
    const cursorPlace = selectionStart;
    const updatedNotes = notes.map((note, i) =>
      i === index ? { ...note, date: dateNow, text: newText } : note
    );

    setNotes(sortNotesByDate(updatedNotes));
    setTimeout(() => {
      setCurrentNoteIndex(notes.length - 1);
      if (notesRef.current[notes.length - 1]) {
        console.log(notes.length);

        notesRef.current[notes.length - 1].focus();
        notesRef.current[notes.length - 1].setSelectionRange(
          cursorPlace,
          cursorPlace
        );
      }
    }, 0);
  };

  const handleCheckboxChange = (index: number) => {
    const updatedNotes = notes.map((note, i) =>
      i === index ? { ...note, isStriked: !note.isStriked } : note
    );
    setNotes(sortNotesByDate(updatedNotes));
  };

  const handleNewNote = () => {
    const newNote = {
      date: new Date().toISOString(),
      text: "",
      isStriked: false,
      showCheckbox: false,
    };
    const updatedNotes = [...notes, newNote];
    setNotes(sortNotesByDate(updatedNotes));
    setTimeout(() => {
      if (notesRef.current[notes.length]) {
        notesRef.current[notes.length].focus();
      }
    }, 0);
  };

  const handleEnterPress = (position: number) => {
    if (currentNoteIndex !== null && currentNoteIndex < notes.length) {
      const currentNote = notes[currentNoteIndex];
      const textBefore = currentNote?.text?.slice(0, position) || "";
      const textAfter = currentNote?.text?.slice(position) || "";
      const emptyTaskChecker =
        position === 0 &&
        currentNote.showCheckbox === true &&
        !(currentNote.text.length > 0);
      if (emptyTaskChecker) {
        const updatedNotes = notes.map((note, index) =>
          index === currentNoteIndex
            ? { ...note, date: dateNow, showCheckbox: false }
            : note
        );
        setNotes(sortNotesByDate(updatedNotes));
      } else {
        const newNote = {
          date: dateNow,
          text: textAfter,
          isStriked: false,
          showCheckbox: currentNote?.showCheckbox || false,
        };
        const updatedNotes = [
          ...notes.slice(0, currentNoteIndex + 1),
          newNote,
          ...notes.slice(currentNoteIndex + 1),
        ].map((note, index) =>
          index === currentNoteIndex ? { ...note, text: textBefore } : note
        );
        setNotes(sortNotesByDate(updatedNotes));
        setTimeout(() => {
          if (notesRef.current[notes.length]) {
            notesRef.current[notes.length].focus();
            notesRef.current[notes.length].setSelectionRange(0, 0);
            setCurrentNoteIndex(notes.length);
            resizeTextArea(notesRef.current[notes.length]);
          }
        }, 0);
        setTimeout(() => {
          if (notesRef.current[currentNoteIndex]) {
            resizeTextArea(notesRef.current[currentNoteIndex]);
          }
        }, 0);
      }
    }
  };
  const handleRemoveCheckbox = (index: number) => {
    const newNotes = notes.map((note, i) =>
      i === index ? { ...note, showCheckbox: false } : note
    );

    setNotes(sortNotesByDate(newNotes));
  };

  const handleMergeWithPrevious = (index: number) => {
    const prevNoteText = notes[index > 0 ? index - 1 : 0].text.length;
    if (index > 0) {
      const newText = notes[index - 1].text + notes[index].text;
      const newNotes = notes
        .map((note, i) => {
          if (i === index - 1) {
            return {
              ...note,
              date: new Date().toISOString().split("T")[0],
              text: newText,
            };
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
          setCurrentNoteIndex(index - 1);
        }
      }, 0);
    }
  };

  const handleDelete = (index: number) => {
    const prevNoteText = notes[index > 0 ? index - 1 : 0].text.length;
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(sortNotesByDate(newNotes));
    const prevIndex = index > 0 ? index - 1 : 0;
    setTimeout(() => {
      setCurrentNoteIndex(prevIndex);
      if (notesRef.current[prevIndex]) {
        notesRef.current[prevIndex].focus();
        notesRef.current[prevIndex].setSelectionRange(
          prevNoteText,
          prevNoteText
        );
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
                onFocus={() => setIsNoteFocused(true)}
                isNoteFocused={isNoteFocused}
                onBlur={() => setIsNoteFocused(false)}
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
          {notes.length === 0 && (
            <Button onClick={handleNewNote}>
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
            </Button>
          )}
          <Checkbox
            isSingleNote={notes.length === 1}
            isNoteFocused={isNoteFocused}
            onClick={handleButtonClick}
          >
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
          </Checkbox>
        </NotesWindow>
      </div>
    </div>
  );
};

export default App;
