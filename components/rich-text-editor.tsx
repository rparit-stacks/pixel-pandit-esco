"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Heading2, Heading3 } from "lucide-react"
import { useCallback } from "react"

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = "Write your description here..." }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // Required for SSR to avoid hydration mismatches
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none min-h-[140px] max-h-[260px] overflow-y-auto px-3 py-2 text-sm focus:outline-none",
      },
    },
  })

  const setBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run()
  }, [editor])

  const setItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run()
  }, [editor])

  const setUnderline = useCallback(() => {
    editor?.chain().focus().toggleUnderline().run()
  }, [editor])

  const setBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run()
  }, [editor])

  const setOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run()
  }, [editor])

  const setHeading = useCallback((level: 2 | 3) => {
    editor?.chain().focus().toggleHeading({ level }).run()
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="rounded-lg border border-border/80 bg-muted/40">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-border/60 px-2 py-1.5 flex-wrap">
        <span className="text-[11px] text-muted-foreground mr-2">Format</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-7 w-7 ${editor.isActive("bold") ? "bg-primary/10 text-primary" : ""}`}
          onClick={setBold}
        >
          <Bold className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-7 w-7 ${editor.isActive("italic") ? "bg-primary/10 text-primary" : ""}`}
          onClick={setItalic}
        >
          <Italic className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-7 w-7 ${editor.isActive("underline") ? "bg-primary/10 text-primary" : ""}`}
          onClick={setUnderline}
        >
          <UnderlineIcon className="h-3.5 w-3.5" />
        </Button>
        <div className="h-6 w-px bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-7 w-7 ${editor.isActive("heading", { level: 2 }) ? "bg-primary/10 text-primary" : ""}`}
          onClick={() => setHeading(2)}
        >
          <Heading2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-7 w-7 ${editor.isActive("heading", { level: 3 }) ? "bg-primary/10 text-primary" : ""}`}
          onClick={() => setHeading(3)}
        >
          <Heading3 className="h-3.5 w-3.5" />
        </Button>
        <div className="h-6 w-px bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-7 w-7 ${editor.isActive("bulletList") ? "bg-primary/10 text-primary" : ""}`}
          onClick={setBulletList}
        >
          <List className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-7 w-7 ${editor.isActive("orderedList") ? "bg-primary/10 text-primary" : ""}`}
          onClick={setOrderedList}
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </Button>
      </div>
      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}

