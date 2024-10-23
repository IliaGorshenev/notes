// Toolbar.tsx
import React from "react";

interface ToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onColorChange: (color: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onBold,
  onItalic,
  onColorChange,
}) => (
  <div>
    <button onClick={onBold}>Bold</button>
    <button onClick={onItalic}>Italic</button>
    <input type="color" onChange={(e) => onColorChange(e.target.value)} />
  </div>
);

export default Toolbar;
