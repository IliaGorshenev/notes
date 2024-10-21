import React from "react";
import styled from "styled-components";

const ToolbarContainer = styled.div`
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 5px;
  display: flex;
  gap: 5px;
`;

const ToolbarButton = styled.button`
  cursor: pointer;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 5px;
  &:hover {
    background-color: #e0e0e0;
  }
`;

interface ToolbarProps {
  onBoldClick: () => void;
  onItalicClick: () => void;
  onStrikeThroughClick: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onBoldClick,
  onItalicClick,
  onStrikeThroughClick,
}) => {
  return (
    <ToolbarContainer>
      <ToolbarButton onClick={onBoldClick}>B</ToolbarButton>
      <ToolbarButton onClick={onItalicClick}>I</ToolbarButton>
      <ToolbarButton onClick={onStrikeThroughClick}>S</ToolbarButton>
    </ToolbarContainer>
  );
};

export default Toolbar;
