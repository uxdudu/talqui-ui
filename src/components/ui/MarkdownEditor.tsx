import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Mention from "@tiptap/extension-mention";
import { markdownToHtml, htmlToMarkdown } from "../../lib/markdown-utils";
import { Icons } from "../icons";
import { useEffect, useMemo } from "react";

export interface MentionItem {
  id: string;
  label: string;
}

/** Estado global para o dropdown de menções (acessível pelo plugin) */
let mentionState: {
  items: MentionItem[];
  command: (item: MentionItem) => void;
  clientRect: (() => DOMRect | null) | null;
  highlightedIndex: number;
} | null = null;

const editorClasses =
  "min-h-[200px] w-full rounded-(--talqui-radius-sm) border border-(--talqui-border-weak) bg-(--talqui-bg-base) px-4 py-3 text-sm leading-5 text-(--talqui-text-strong) focus:outline-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-(--talqui-text-weak) [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_h1]:text-xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h2]:text-lg [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h3]:text-base [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-(--talqui-text-primary) [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-(--talqui-text-medium) [&_.ProseMirror_pre]:rounded-(--talqui-radius-lg) [&_.ProseMirror_pre]:bg-(--talqui-bg-weaker) [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:bg-(--talqui-bg-weaker) [&_.ProseMirror_code]:px-1.5 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:text-(--talqui-text-primary)";

function MenuButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-(--talqui-radius-lg-inset-4) text-(--talqui-text-medium) transition-colors duration-200 hover:bg-(--talqui-bg-weaker) hover:text-(--talqui-text-strong) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--talqui-text-primary) ${
        active ? "bg-(--talqui-bg-weaker) text-(--talqui-text-primary)" : ""
      }`}
    >
      {children}
    </button>
  );
}

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  layout?: "split" | "stacked";
  minHeight?: string;
  readOnly?: boolean;
  /** Itens para menção com @ (ex: habilidades do procedimento) */
  mentionItems?: MentionItem[];
}

function createMentionExtension(mentionItems: MentionItem[]) {
  let highlightedIndex = 0;
  let listEl: HTMLDivElement | null = null;

  const createList = () => {
    if (listEl) return listEl;
    listEl = document.createElement("div");
    listEl.className =
      "fixed z-[100] max-h-[200px] min-w-[200px] overflow-auto rounded-[var(--talqui-radius-lg)] border border-[var(--talqui-border-weak)] bg-white py-1 shadow-lg";
    listEl.style.cssText = "position:fixed;";
    listEl.role = "listbox";
    document.body.appendChild(listEl);
    return listEl;
  };

  const removeList = () => {
    listEl?.remove();
    listEl = null;
    mentionState = null;
  };

  const renderList = () => {
    const state = mentionState;
    if (!state || !listEl) return;
    const rect = state.clientRect?.();
    if (!rect) return;
    listEl.style.left = `${rect.left}px`;
    listEl.style.top = `${rect.bottom + 4}px`;
    listEl.innerHTML = "";
    state.items.forEach((item, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.role = "option";
      btn.className =
        i === highlightedIndex
          ? "flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm bg-[var(--talqui-bg-weaker)] text-[var(--talqui-text-primary)]"
          : "flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-[var(--talqui-text-strong)] hover:bg-[var(--talqui-bg-weaker)]/50";
      btn.textContent = `@${item.label}`;
      btn.onclick = () => {
        state.command(item);
        removeList();
      };
      btn.onmouseenter = () => {
        highlightedIndex = i;
        renderList();
      };
      listEl?.appendChild(btn);
    });
  };

  return Mention.configure({
    HTMLAttributes: {
      class: "rounded bg-(--talqui-primary-a10) px-1 font-medium text-(--talqui-text-primary)",
    },
    renderText({ node }) {
      return `@${node.attrs.label ?? node.attrs.id}`;
    },
    suggestion: {
      char: "@",
      items: ({ query }) => {
        const q = query.toLowerCase();
        return mentionItems.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.id.toLowerCase().includes(q)
        );
      },
      command: ({ editor, range, props }) => {
        editor
          .chain()
          .focus()
          .insertContentAt(range, [
            {
              type: "mention",
              attrs: {
                id: props.id,
                label: props.label,
                mentionSuggestionChar: "@",
              },
            },
            { type: "text", text: " " },
          ])
          .run();
      },
      render: () => ({
        onStart: (props) => {
          mentionState = {
            items: props.items,
            command: props.command,
            clientRect: props.clientRect ?? null,
            highlightedIndex: 0,
          };
          highlightedIndex = 0;
          createList();
          renderList();
        },
        onUpdate: (props) => {
          if (mentionState) {
            mentionState = {
              items: props.items,
              command: props.command,
              clientRect: props.clientRect ?? null,
              highlightedIndex,
            };
            renderList();
          }
        },
        onExit: removeList,
        onKeyDown: ({ event }) => {
          if (!mentionState || mentionState.items.length === 0) return false;
          if (event.key === "ArrowDown") {
            event.preventDefault();
            highlightedIndex = Math.min(
              highlightedIndex + 1,
              mentionState.items.length - 1
            );
            renderList();
            return true;
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            highlightedIndex = Math.max(highlightedIndex - 1, 0);
            renderList();
            return true;
          }
          if (event.key === "Enter") {
            event.preventDefault();
            const item = mentionState.items[highlightedIndex];
            if (item) mentionState.command(item);
            removeList();
            return true;
          }
          return false;
        },
      }),
    },
  });
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Digite / para inserir blocos...",
  layout: _layout = "split",
  minHeight = "min-h-[400px]",
  readOnly = false,
  mentionItems = [],
}: MarkdownEditorProps) {
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({ placeholder }),
      ...(mentionItems.length > 0
        ? [createMentionExtension(mentionItems)]
        : []),
    ],
    [mentionItems]
  );

  const editor = useEditor({
    extensions,
    content: markdownToHtml(value),
    editable: !readOnly,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(htmlToMarkdown(html));
    },
  });

  useEffect(() => {
    if (!editor) return;
    const targetHtml = markdownToHtml(value);
    if (editor.getHTML() !== targetHtml) {
      editor.commands.setContent(targetHtml, { emitUpdate: false });
    }
  }, [value, editor]);

  if (readOnly) {
    return (
      <div
        className={`overflow-auto rounded-(--talqui-radius-sm) border border-(--talqui-border-weak) bg-[var(--talqui-bg-weaker)] p-4 ${minHeight} [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-bold [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--talqui-text-primary)] [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:rounded-[var(--talqui-radius-lg)] [&_pre]:bg-[var(--talqui-bg-weaker)] [&_pre]:p-4 [&_code]:rounded [&_code]:bg-[var(--talqui-bg-weaker)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[var(--talqui-text-primary)]`}
        dangerouslySetInnerHTML={{ __html: markdownToHtml(value || "<p></p>") }}
      />
    );
  }

  if (!editor) return null;

  return (
    <div className={`notion-like-editor ${minHeight}`}>
      <BubbleMenu
        editor={editor}
        className="flex items-center gap-0.5 rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-white p-1 shadow-md"
      >
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Negrito"
        >
          <span className="text-sm font-bold">B</span>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Itálico"
        >
          <span className="text-sm italic">I</span>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Tachado"
        >
          <span className="text-sm line-through">S</span>
        </MenuButton>
        <div className="mx-1 h-5 w-px bg-(--talqui-border-weak)" />
        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Código"
        >
          <span className="font-mono text-xs">{`</>`}</span>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Citação"
        >
          <span className="text-sm">"</span>
        </MenuButton>
        <div className="mx-1 h-5 w-px bg-(--talqui-border-weak)" />
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Lista"
        >
          <Icons.ListView size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Lista numerada"
        >
          <span className="text-xs font-medium">1.</span>
        </MenuButton>
      </BubbleMenu>

      <FloatingMenu
        editor={editor}
        className="flex flex-col gap-0.5 rounded-(--talqui-radius-lg) border border-(--talqui-border-weak) bg-white p-1 shadow-md"
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="flex cursor-pointer items-center gap-2 rounded-(--talqui-radius-lg-inset-4) px-3 py-2 text-left text-sm font-bold text-(--talqui-text-strong) transition-colors hover:bg-(--talqui-bg-weaker)"
        >
          <span className="text-lg">H1</span>
          Título 1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="flex cursor-pointer items-center gap-2 rounded-(--talqui-radius-lg-inset-4) px-3 py-2 text-left text-sm font-semibold text-(--talqui-text-strong) transition-colors hover:bg-(--talqui-bg-weaker)"
        >
          <span className="text-base">H2</span>
          Título 2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className="flex cursor-pointer items-center gap-2 rounded-(--talqui-radius-lg-inset-4) px-3 py-2 text-left text-sm font-medium text-(--talqui-text-strong) transition-colors hover:bg-(--talqui-bg-weaker)"
        >
          <span className="text-sm">H3</span>
          Título 3
        </button>
        <div className="my-0.5 h-px bg-(--talqui-border-weak)" />
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className="flex cursor-pointer items-center gap-2 rounded-(--talqui-radius-lg-inset-4) px-3 py-2 text-left text-sm text-(--talqui-text-strong) transition-colors hover:bg-(--talqui-bg-weaker)"
        >
          Texto
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="flex cursor-pointer items-center gap-2 rounded-(--talqui-radius-lg-inset-4) px-3 py-2 text-left text-sm text-(--talqui-text-strong) transition-colors hover:bg-(--talqui-bg-weaker)"
        >
          Lista com marcadores
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="flex cursor-pointer items-center gap-2 rounded-(--talqui-radius-lg-inset-4) px-3 py-2 text-left text-sm text-(--talqui-text-strong) transition-colors hover:bg-(--talqui-bg-weaker)"
        >
          Lista numerada
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className="flex cursor-pointer items-center gap-2 rounded-(--talqui-radius-lg-inset-4) px-3 py-2 text-left text-sm text-(--talqui-text-strong) transition-colors hover:bg-(--talqui-bg-weaker)"
        >
          Bloco de código
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="flex cursor-pointer items-center gap-2 rounded-(--talqui-radius-lg-inset-4) px-3 py-2 text-left text-sm text-(--talqui-text-strong) transition-colors hover:bg-(--talqui-bg-weaker)"
        >
          Citação
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="flex cursor-pointer items-center gap-2 rounded-(--talqui-radius-lg-inset-4) px-3 py-2 text-left text-sm text-(--talqui-text-strong) transition-colors hover:bg-(--talqui-bg-weaker)"
        >
          Linha horizontal
        </button>
      </FloatingMenu>

      <EditorContent editor={editor} className={editorClasses} />
    </div>
  );
}
