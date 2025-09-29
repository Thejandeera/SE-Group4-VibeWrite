import React, { useState } from "react";
import LexicalTheme from "./themes/LexicalTheme.jsx";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./plugins/ToolbarPlugin.jsx";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin.jsx";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin.jsx";
import LexicalAutoLinkPlugin from "./plugins/AutoLinkPlugin.jsx";
import RewriteSuggestionsPlugin from "./plugins/RewriteSuggestionsPlugin.jsx";

import "./styles/lexical.css";

function Placeholder() {
  return <div className="editor-placeholder">Start writing here...</div>;
}

// Plugin to track content changes and character count
function OnChangePlugin({ onChange, onEditorStateChange }) {
  const [editor] = useLexicalComposerContext();
  
  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = editor.getRootElement();
        const textContent = root ? root.textContent || "" : "";
        onChange(textContent);
        onEditorStateChange(editorState);
      });
    });
  }, [editor, onChange, onEditorStateChange]);
  
  return null;
}

const editorConfig = {
  // The editor theme
  theme: LexicalTheme,
  // Handling of errors during update
  onError(error) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode
  ]
};

export default function LexicalEditor() {
  const [plainText, setPlainText] = useState('');
  const [editorState, setEditorState] = useState(null);
  const [draftId, setDraftId] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleContentChange = (textContent) => {
    setPlainText(textContent);
  };

  const handleEditorStateChange = (state) => {
    setEditorState(state);
  };

  const handleSave = async () => {
    if (!editorState) return;

    // Serialize Lexical editor state (JSON string). Backend stores as string.
    const content = JSON.stringify(editorState);

    // Derive username from session (if logged in); fallback to 'anonymous'
    let username = 'anonymous';
    try {
      const savedUserData = sessionStorage.getItem('userData');
      if (savedUserData) {
        const u = JSON.parse(savedUserData);
        username = u.username || (u.email ? u.email.split('@')[0] : 'anonymous');
      }
    } catch (_) {}

    try {
      const url = draftId
        ? `${backendUrl}/api/drafts/${draftId}`
        : `${backendUrl}/api/drafts`;
      const method = draftId ? 'PUT' : 'POST';
      const body = draftId ? { content } : { content, username };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Save failed: ${res.status} ${text}`);
      }

      const saved = await res.json();
      if (!draftId && saved?.id) {
        setDraftId(saved.id);
      }

      alert('Draft saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save draft. Please try again.');
    }
  };

  return (
    <div className="w-full">
      <LexicalComposer initialConfig={editorConfig}>
        <div className="editor-container">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <ToolbarPlugin />
          </div>
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={<Placeholder />}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={handleContentChange} onEditorStateChange={handleEditorStateChange} />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <LinkPlugin />
            <LexicalAutoLinkPlugin />
            {/* Rewrite suggestions tooltip on selection */}
            {/**/}
            {/* eslint-disable-next-line react/jsx-no-undef */}
            {/* The plugin is imported below */}
            <RewriteSuggestionsPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          </div>
        </div>
      </LexicalComposer>
      
      <div className="mt-2 text-xs text-gray-500">Spelling mistakes are underlined by your browser.</div>
      
      <div className="mt-4 text-sm text-gray-600">
        <span className="font-medium">Character count:</span> {plainText.length}
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={!editorState || plainText.trim().length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Save Draft
        </button>
      </div>
    </div>
  );
}