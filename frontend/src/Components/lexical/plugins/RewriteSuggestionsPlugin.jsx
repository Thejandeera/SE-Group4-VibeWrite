import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";

function getSelectionRect() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  if (!rect || (rect.x === 0 && rect.y === 0 && rect.width === 0 && rect.height === 0)) {
    return null;
  }
  return rect;
}

function rewriteText(text, mode) {
  const simpleSynonyms = {
    utilize: "use",
    commence: "start",
    terminate: "end",
    purchase: "buy",
    numerous: "many",
    assist: "help",
    demonstrate: "show",
    obtain: "get",
  };

  const replaceSynonyms = (str) =>
    str
      .split(/(\b)/)
      .map((t) => {
        const low = t.toLowerCase();
        return simpleSynonyms[low] ? (t[0] === t[0]?.toUpperCase() ? simpleSynonyms[low][0].toUpperCase() + simpleSynonyms[low].slice(1) : simpleSynonyms[low]) : t;
      })
      .join("");

  switch (mode) {
    case "concise": {
      const compact = text.replace(/\s+/g, " ").trim();
      return compact.length > 140 ? compact.slice(0, 140) + "…" : compact;
    }
    case "formal": {
      return replaceSynonyms(text)
        .replace(/\bcan't\b/gi, "cannot")
        .replace(/\bwon't\b/gi, "will not")
        .replace(/\bI'm\b/gi, "I am")
        .replace(/\bit's\b/gi, "it is");
    }
    case "casual": {
      return text
        .replace(/\bit is\b/gi, "it's")
        .replace(/\bdo not\b/gi, "don't")
        .replace(/\bcannot\b/gi, "can't");
    }
    case "expand": {
      if (text.trim().length === 0) return text;
      return text.replace(/([.!?])?\s*$/, ". Additionally, here are more details.");
    }
    case "simplify": {
      return replaceSynonyms(text);
    }
    default:
      return text;
  }
}

function Tooltip({ position, onRewrite }) {
  if (!position) return null;
  return createPortal(
    (
      <div
        className="lexical-rewrite-tooltip"
        style={{
          top: Math.round(position.bottom + window.scrollY + 8),
          left: Math.round(position.left + window.scrollX),
        }}
      >
        <div className="lexical-rewrite-row">
          <button onClick={() => onRewrite("concise")}>Concise</button>
          <button onClick={() => onRewrite("formal")}>Formal</button>
          <button onClick={() => onRewrite("casual")}>Casual</button>
        </div>
        <div className="lexical-rewrite-row">
          <button onClick={() => onRewrite("expand")}>Expand</button>
          <button onClick={() => onRewrite("simplify")}>Simplify</button>
        </div>
      </div>
    ),
    document.body
  );
}

export default function RewriteSuggestionsPlugin() {
  const [editor] = useLexicalComposerContext();
  const [rect, setRect] = useState(null);
  const selectedTextRef = useRef("");

  const updateFromSelection = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) && !selection.isCollapsed()) {
        const domRect = getSelectionRect();
        if (domRect) {
          setRect(domRect);
          selectedTextRef.current = selection.getTextContent();
          return;
        }
      }
      setRect(null);
      selectedTextRef.current = "";
    });
  }, [editor]);

  useEffect(() => {
    const removeUpdate = editor.registerUpdateListener(() => {
      updateFromSelection();
    });
    const onScrollOrResize = () => updateFromSelection();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize, true);
    return () => {
      removeUpdate();
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize, true);
    };
  }, [editor, updateFromSelection]);

  const handleRewrite = useCallback(
    (mode) => {
      const original = selectedTextRef.current;
      if (!original) return;
      const rewritten = rewriteText(original, mode);
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) && !selection.isCollapsed()) {
          selection.insertText(rewritten);
        }
      });
      setRect(null);
    },
    [editor]
  );

  return <Tooltip position={rect} onRewrite={handleRewrite} />;
}


