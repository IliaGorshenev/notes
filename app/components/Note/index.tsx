"use client";
import React, { forwardRef } from "react";
import styled, { keyframes } from "styled-components";

const fadeInOpacity = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const fadeInHeight = keyframes`
  0% {
    max-height: 0;
  }
  100% {
    max-height: 2000px;   
  }
`;

const resizeTextArea = (element: HTMLTextAreaElement) => {
  element.style.height = "auto";
  if (element.scrollHeight > element.clientHeight) {
    element.style.height = `${element.scrollHeight}px`;
  }
};
interface NoteProps {
  date: string;
  text: string;
  isStriked: boolean;
  showCheckbox: boolean;
  onTextChange: (text: string, selectionStart: number) => void;
  onCheckboxChange: () => void;
  onEnterPress: (position: number) => void;
  onTransformToTask: () => void;
  onDelete: () => void;
  onRemoveCheckbox: () => void;
  onMergeWithPrevious: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isNoteFocused: boolean;
}

const NoteContainer = styled.div`
  margin: 0;
  display: flex;
  align-items: flex-start;
  border-radius: 4px;
  position: relative;
  column-gap: 10px;

  animation: ${fadeInOpacity} 0.9s ease-out forwards;
  animation: ${fadeInHeight} 6s ease-out forwards;
`;

const DateText = styled.span`
  color: #000000;
  font-size: 12px;
  line-height: 16px;
  margin-top: 3px;
  white-space: nowrap;
  width: 40px;
  position: absolute;
  top: 8px;
  left: 5px;
`;

const NoteText = styled.textarea<{
  $isStriked: boolean;
  $showCheckbox: boolean;
}>`
  display: block;
  width: 100%;
  overflow: hidden;
  align-items: center;
  padding: 0;
  min-height: 8px;
  font-size: 14px;
  line-height: 20px;
  border: none;
  text-decoration: ${(props) => (props.$isStriked ? "line-through" : "none")};
  resize: none;
  padding: 10px;
  padding-left: ${(props) => (props.$showCheckbox ? "67px" : "48px")};
  transition: background-color 0.3s ease;
  max-height: auto;

  &:active {
    background-color: ${(props) =>
      props.$showCheckbox ? "#ecf3eb" : "#f1f1f1"};
    outline: none;
  }

  &:hover {
    background-color: ${(props) =>
      props.$showCheckbox ? "#ecf3eb" : "#f1f1f1"};
    outline: none;
  }

  &:focus {
    outline: none;
    background-color: ${(props) =>
      props.$showCheckbox ? "#ecf3eb" : "#f1f1f1"};
  }

  &:not(:focus) {
    overflow: hidden;
    max-height: 8px;
    padding-top: 10px;
    scroll-padding-top: 0;
    padding-bottom: 10px;
  }
`;

const TaskCheckbox = styled.input.attrs({ type: "checkbox" })`
  position: absolute;
  top: 10px;
  cursor: pointer;
  left: 46px;
`;

const formatDate = (date: string) => {
  const options = { day: "numeric", month: "short" } as const;
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", options);
};

const Note = forwardRef<HTMLTextAreaElement, NoteProps>(
  (
    {
      date,
      text,
      isStriked,
      showCheckbox,
      onTextChange,
      onCheckboxChange,
      onEnterPress,
      onTransformToTask,
      onDelete,
      onRemoveCheckbox,
      onMergeWithPrevious,
      onFocus,
      onBlur,
      isNoteFocused,
    },
    ref
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const selectionStart = e.currentTarget.selectionStart;

      if (e.key === "Enter") {
        e.preventDefault();
        onEnterPress(selectionStart);
      } else if (e.key === "Backspace") {
        if (text === "" && !showCheckbox) {
          onDelete();
        } else if (selectionStart === 0) {
          if (showCheckbox) {
            onRemoveCheckbox();
          } else {
            onMergeWithPrevious();
          }
        }
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      resizeTextArea(e.currentTarget);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const selectionStart = e.currentTarget.selectionStart;
      const newText = e.target.value;

      if (newText.includes("[] ")) {
        return onTransformToTask();
      }
      onTextChange(newText, selectionStart);
      resizeTextArea(e.target);
    };

    // React.useEffect(() => {
    //   if (ref && (ref as React.RefObject<HTMLTextAreaElement>).current) {
    //     resizeTextArea((ref as React.RefObject<HTMLTextAreaElement>).current!);
    //   }
    // }, [text, ref, isNoteFocused]);
    return (
      <NoteContainer>
        <DateText>{formatDate(date)}</DateText>
        {showCheckbox && (
          <TaskCheckbox onChange={onCheckboxChange} checked={isStriked} />
        )}
        <NoteText
          ref={ref}
          value={text}
          $isStriked={isStriked}
          $showCheckbox={showCheckbox}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={onBlur}
        />
      </NoteContainer>
    );
  }
);

Note.displayName = "Note";
export default Note;
