import React, { useState, useEffect } from "react";
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
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $insertNodes } from 'lexical';
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

// Plugin to load initial HTML content
function LoadInitialContentPlugin({ initialHtml }) {
  const [editor] = useLexicalComposerContext();
  const [hasLoaded, setHasLoaded] = React.useState(false);

  React.useEffect(() => {
    if (initialHtml && !hasLoaded) {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialHtml, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        
        // Clear existing content
        const root = $getRoot();
        root.clear();
        
        // Insert new nodes
        $insertNodes(nodes);
      });
      setHasLoaded(true);
    }
  }, [editor, initialHtml, hasLoaded]);

  return null;
}

// Plugin to get HTML content
function GetHtmlPlugin({ onHtmlChange }) {
  const [editor] = useLexicalComposerContext();
  
  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const htmlString = $generateHtmlFromNodes(editor);
        onHtmlChange(htmlString);
      });
    });
  }, [editor, onHtmlChange]);
  
  return null;
}

export default function LexicalEditor({ initialContent, onContentChange }) {
  const [plainText, setPlainText] = useState('');
  const [editorState, setEditorState] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');

  const handleContentChange = (textContent) => {
    setPlainText(textContent);
  };

  const handleEditorStateChange = (state) => {
    setEditorState(state);
  };

  const handleHtmlChange = (html) => {
    setHtmlContent(html);
    if (onContentChange) {
      onContentChange(html);
    }
  };

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
            <GetHtmlPlugin onHtmlChange={handleHtmlChange} />
            {initialContent && <LoadInitialContentPlugin initialHtml={initialContent} />}
            <HistoryPlugin />
            <AutoFocusPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <LinkPlugin />
            <LexicalAutoLinkPlugin />
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
    </div>
  );
}