import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[120px] text-sm text-gray-700 dark:text-gray-200 p-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Watch for external changes (like AI Drafts) and update editor
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) {
        return null;
    }

    const MenuButton = ({ onClick, isActive, children, title }: any) => (
        <button
            onClick={onClick}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${isActive ? 'bg-gray-200 dark:bg-white/20 text-edluar-moss' : 'text-gray-500 dark:text-gray-400'}`}
            type="button"
            title={title}
        >
            {children}
        </button>
    );

    return (
        <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-black/20 focus-within:ring-2 focus-within:ring-edluar-moss/20 transition-all">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </MenuButton>
                <div className="w-px h-4 bg-gray-300 dark:bg-white/10 mx-1" />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Ordered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </MenuButton>
            </div>

            {/* Editor Area */}
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                <EditorContent editor={editor} placeholder={placeholder} />
            </div>
        </div>
    );
};
