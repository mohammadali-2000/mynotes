import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState } from 'react'

interface TiptapEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

export default function TiptapEditor({ initialContent, onChange }: TiptapEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none min-h-[500px]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Avoid SSR hydration mismatches if Next.js was used, but good practice for Vite too
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="w-full">
      {/* Editor Toolbar placeholder */}
      <div className="border-b pb-2 mb-4 flex gap-2 overflow-x-auto">
        <button 
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded text-sm ${editor?.isActive('bold') ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
        >
          Bold
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded text-sm ${editor?.isActive('italic') ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
        >
          Italic
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 rounded text-sm ${editor?.isActive('heading', { level: 1 }) ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
        >
          H1
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded text-sm ${editor?.isActive('heading', { level: 2 }) ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
        >
          H2
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded text-sm ${editor?.isActive('bulletList') ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
        >
          Bullet List
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
