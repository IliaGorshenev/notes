import styled from "styled-components";
export const NotesWindow = styled.div`
  position: relative;
  border: 1px solid #ccc;
  padding: 10px;
`;

export const MasterButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
`;

export const NoteContainer = styled.div`
  margin: 10px 0;
  border: 1px solid #ccc;
  padding: 5px;
  display: flex;
  align-items: center;
`;

export const DateText = styled.div`
  font-size: 14px;
  color: #888;
  margin-right: 10px;
`;

export const NoteText = styled.textarea<{ isStriked: boolean }>`
  width: 100%;
  height: 50px;
  text-decoration: ${(props) => (props.isStriked ? "line-through" : "none")};
`;

export const TaskCheckbox = styled.input.attrs({ type: "checkbox" })`
  margin-right: 10px;
`;
