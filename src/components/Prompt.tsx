import React, { useState } from "react";

interface PromptProps {
  title: string;
  label: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

function Prompt({
  title,
  label,
  onConfirm,
  onCancel,
}: PromptProps): React.JSX.Element {
  const [inputValue, setInputValue] = useState("");

  const handleConfirm = () => {
    if (inputValue.trim() !== "") {
      onConfirm(inputValue.trim());
      setInputValue(""); // Clear input
    }
  };

  return (
    <div className="con-prompt">
      <div className="form">
        <h2>{title}</h2>
        <label>
          {label}:
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </label>

        <div className="buttons">
          <button onClick={onCancel}>Отмена</button>
          <button onClick={handleConfirm}>Добавить</button>
        </div>
      </div>
    </div>
  );
}

type Prompt = [
  React.JSX.Element | null,
  (title: string, label?: string) => void,
  string | undefined
];

export default function usePrompt(): Prompt {
  const [title, setTitle] = useState<string>();
  const [label, setLabel] = useState<string>("");
  const [result, setResult] = useState<string>();

  function setOpen(title: string, label?: string) {
    setTitle(title);
    label && setLabel(label);
  }

  function onConfirm(value: string) {
    setResult(value);
    setTitle(undefined);
  }

  function onCancel() {
    setTitle(undefined);
  }

  return [
    title ? (
      <Prompt
        title={title}
        label={label}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    ) : null,
    setOpen,
    result,
  ];
}
