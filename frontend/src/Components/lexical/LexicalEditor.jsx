import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
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
import { $getRoot, $insertNodes, $createParagraphNode, $createTextNode } from 'lexical';
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

// Plugin to load initial HTML content - COMPLETELY REVISED
function LoadInitialContentPlugin({ initialHtml, onContentLoaded }) {
  const [editor] = useLexicalComposerContext();
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (initialHtml && initialHtml.trim() && !isLoaded) {
      console.log('Attempting to load content into editor...');
      
      // Use setTimeout to ensure editor is fully ready
      const timer = setTimeout(() => {
        editor.update(() => {
          try {
            console.log('Loading HTML content:', initialHtml.substring(0, 200) + '...');
            
            // Clear existing content first
            const root = $getRoot();
            root.clear();
            
            if (initialHtml.trim()) {
              // Create a temporary container to parse HTML
              const container = document.createElement('div');
              container.innerHTML = initialHtml;
              
              // Generate nodes from the parsed HTML
              const nodes = $generateNodesFromDOM(editor, container);
              
              if (nodes && nodes.length > 0) {
                // Insert the generated nodes
                $insertNodes(nodes);
                console.log('Successfully inserted', nodes.length, 'nodes');
              } else {
                // Fallback: create a paragraph with the text content
                console.log('No nodes generated, using fallback');
                const paragraph = $createParagraphNode();
                const textNode = $createTextNode(container.textContent || '');
                paragraph.append(textNode);
                root.append(paragraph);
              }
            } else {
              // Empty content - create empty paragraph
              const paragraph = $createParagraphNode();
              root.append(paragraph);
            }
            
            setIsLoaded(true);
            if (onContentLoaded) {
              onContentLoaded(true);
            }
            
            console.log('Content loaded successfully into editor');
            
          } catch (error) {
            console.error('Error loading content into editor:', error);
            // Fallback: try to set text content directly
            try {
              const root = $getRoot();
              root.clear();
              const paragraph = $createParagraphNode();
              const textNode = $createTextNode(initialHtml.replace(/<[^>]*>/g, ''));
              paragraph.append(textNode);
              root.append(paragraph);
              console.log('Used fallback text loading');
            } catch (fallbackError) {
              console.error('Fallback loading also failed:', fallbackError);
            }
            
            if (onContentLoaded) {
              onContentLoaded(false);
            }
          }
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [editor, initialHtml, isLoaded, onContentLoaded]);

  // Reset loaded state when initialHtml changes
  React.useEffect(() => {
    if (initialHtml) {
      setIsLoaded(false);
    }
  }, [initialHtml]);

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
  const [contentLoaded, setContentLoaded] = useState(false);
  const { t } = useTranslation();

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

  const handleContentLoaded = (success) => {
    setContentLoaded(success);
    console.log('Content loaded callback:', success);
  };

  const editorConfig = {
    // The editor theme
    theme: LexicalTheme,
    // Handling of errors during update
    onError(error) {
      console.error('Lexical Editor Error:', error);
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
    ],
    // Add namespace to avoid conflicts
    namespace: 'ContentEditor'
  };

  return (
    <div className="w-full">
      {contentLoaded && initialContent && (
        <div className="mb-2 text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
          {t('editor.draftLoaded')}
        </div>
      )}
      
      {initialContent && !contentLoaded && (
        <div className="mb-2 text-sm text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
          {t('editor.loadingDraft')}
        </div>
      )}
      
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
            <LoadInitialContentPlugin 
              initialHtml={initialContent} 
              onContentLoaded={handleContentLoaded}
            />
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
      
      <div className="mt-2 text-xs text-gray-500">{t('editor.spellcheckNote')}</div>
      
      <div className="mt-4 text-sm text-gray-600">
        <span className="font-medium">{t('editor.characterCount')}</span> {plainText.length}
      </div>
      
      {/* Debug info */}
      <div className="mt-2 text-xs text-gray-400">
        <div>Initial Content Length: {initialContent?.length || 0}</div>
        <div>Current HTML Length: {htmlContent.length}</div>
        <div>Plain Text Length: {plainText.length}</div>
      </div>
    </div>
  );
}