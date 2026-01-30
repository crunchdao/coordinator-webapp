import { cn } from "@crunch-ui/utils";
import { Button, Textarea } from "@crunch-ui/core";
import { useMdEditor } from "./useMdEditor";
import { markdownToHtml } from "./utils";

interface MdEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const MdPreview: React.FC<{ value: string; className?: string }> = ({
  value,
  className,
}) => {
  const html = markdownToHtml(value);
  return (
    <div
      className={cn(
        "text-sm [&_code]:bg-secondary [&_code]:inline-flex [&_code]:rounded-sm [&_code]:px-1 [&_code]:py-0.5 [&_code]:label-xs",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default function MdEditor({ value, onChange }: MdEditorProps) {
  const { ref, previewMode, surround, insertHeading, togglePreviewMode, handleChange } =
    useMdEditor({ value, onChange });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          className="font-departure"
          variant="secondary"
          size="sm"
          onClick={() => insertHeading(1)}
          type="button"
        >
          H1
        </Button>
        <Button
          className="font-departure"
          variant="secondary"
          size="sm"
          onClick={() => insertHeading(2)}
          type="button"
        >
          H2
        </Button>
        <Button
          className="font-departure"
          variant="secondary"
          size="sm"
          onClick={() => insertHeading(3)}
          type="button"
        >
          H3
        </Button>
        <Button
          className="font-departure"
          variant="secondary"
          size="sm"
          onClick={() => surround("**")}
          type="button"
        >
          <b>B</b>
        </Button>
        <Button
          className="font-departure"
          variant="secondary"
          size="sm"
          onClick={() => surround("*")}
          type="button"
        >
          <em>I</em>
        </Button>
        <Button
          className="font-departure"
          variant="secondary"
          size="sm"
          onClick={() => surround("<u>")}
          type="button"
        >
          <u>U</u>
        </Button>
        <Button
          className="font-departure"
          variant="secondary"
          size="sm"
          onClick={() => surround("`")}
          type="button"
        >
          {"<>"}
        </Button>
        <Button
          onClick={togglePreviewMode}
          variant={previewMode ? "secondary" : "ghost"}
          size="sm"
          className="ml-auto"
          type="button"
        >
          {previewMode ? "Edit" : "Preview"}
        </Button>
      </div>
      <div className="relative">
        <Textarea
          name="md-editor"
          ref={ref}
          value={value}
          onChange={handleChange}
          rows={5}
          disabled={previewMode}
        />
        {previewMode && (
          <MdPreview
            value={value}
            className="absolute top-0 left-0 w-full h-full overflow-auto border rounded-md py-2 px-3 bg-card"
          />
        )}
      </div>
    </div>
  );
}
