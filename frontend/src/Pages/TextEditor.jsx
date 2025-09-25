import React, { useRef } from 'react';
import { $createParagraphNode, $getRoot, $getSelection } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';



function Placeholder() {
  return (
    <div className="editor-placeholder">
      Enter some rich text...
    </div>
  );
}

function MyOnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();
  
  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);
  
  return null;
}

function prepopulatedRichText() {
  const root = $getRoot();
  if (root.getFirstChild() === null) {
    const paragraph = $createParagraphNode();
    root.append(paragraph);
    const selection = $getSelection();
    if (selection !== null) {
      paragraph.select();
    }
  }
}

function PlaygroundEditor() {
  const scrollerElemRef = useRef(null);
  
  const initialConfig = {
    namespace: 'Playground',
    nodes: [...PlaygroundNodes],
    onError: (error) => {
      console.error(error);
    },
    theme: PlaygroundTheme,
    editorState: prepopulatedRichText,
  };

  const [floatingAnchorElem, setFloatingAnchorElem] = React.useState(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] = React.useState(false);

  const onRef = (_floatingAnchorElem) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  React.useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport = window.matchMedia('(max-width: 1025px)').matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener('resize', updateViewPortWidth);

    return () => {
      window.removeEventListener('resize', updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  return (
    <div className="p-6 w-full">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              Rich Text Editor
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Lexical Playground
            </span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            A feature-rich text editor with comprehensive formatting options.
          </p>
        </div>
        
        <LexicalComposer initialConfig={initialConfig}>
          <div className="editor-container">
            <ToolbarPlugin />
            <div className="editor-inner">
              <RichTextPlugin
                contentEditable={
                  <div className="editor-scroller">
                    <div className="editor" ref={onRef}>
                      <ContentEditable className="editor-input" />
                    </div>
                  </div>
                }
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <AutoFocusPlugin />
              <ListPlugin />
              <LinkPlugin />
              <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
              {floatingAnchorElem && !isSmallWidthViewport && (
                <>
                  <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
                </>
              )}
            </div>
          </div>
        </LexicalComposer>
      </div>
    </div>
  );
}

export default PlaygroundEditor;

