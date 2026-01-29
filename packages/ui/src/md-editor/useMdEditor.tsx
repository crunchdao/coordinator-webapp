import { useRef, useState, useCallback, type ChangeEvent } from "react";

interface UseMdEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function useMdEditor({ value, onChange }: UseMdEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const surround = useCallback(
    (tag: string) => {
      const textarea = ref.current;
      if (!textarea || previewMode) return;
      const { selectionStart, selectionEnd } = textarea;
      const before = value.slice(0, selectionStart);
      const selected = value.slice(selectionStart, selectionEnd);
      const after = value.slice(selectionEnd);

      const isHtmlTag = tag.startsWith("<") && tag.endsWith(">");
      const openTag = tag;
      const closeTag =
        isHtmlTag && /^<\w+>$/.test(tag)
          ? tag.replace(/^<([\w]+)>$/, "</$1>")
          : tag;
      if (selectionStart === selectionEnd) {
        const newValue = `${before}${openTag}${closeTag}${after}`;
        onChange(newValue);
        setTimeout(() => {
          const pos = selectionStart + openTag.length;
          textarea.focus();
          textarea.setSelectionRange(pos, pos);
        });
      } else {
        onChange(`${before}${openTag}${selected}${closeTag}${after}`);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(
            selectionStart + openTag.length,
            selectionEnd + openTag.length
          );
        });
      }
    },
    [value, onChange, previewMode]
  );

  const insertHeading = useCallback(
    (level: number) => {
      const textarea = ref.current;
      if (!textarea || previewMode) return;
      const { selectionStart, selectionEnd } = textarea;
      const before = value.slice(0, selectionStart);
      const selected = value.slice(selectionStart, selectionEnd);
      const after = value.slice(selectionEnd);
      
      const prefix = "#".repeat(level) + " ";
      
      const lastNewline = before.lastIndexOf("\n");
      const isStartOfLine = lastNewline === -1 ? selectionStart === 0 : selectionStart === lastNewline + 1;
      
      let newValue;
      if (isStartOfLine) {
        newValue = `${before}${prefix}${selected}${after}`;
      } else {
        newValue = `${before}\n${prefix}${selected}${after}`;
      }
      
      onChange(newValue);
      setTimeout(() => {
        const pos = selectionStart + (isStartOfLine ? prefix.length : prefix.length + 1);
        textarea.focus();
        textarea.setSelectionRange(pos, pos + selected.length);
      });
    },
    [value, onChange, previewMode]
  );

  const togglePreviewMode = useCallback(() => {
    setPreviewMode((prev) => !prev);
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return {
    ref,
    previewMode,
    surround,
    insertHeading,
    togglePreviewMode,
    handleChange,
  };
}
