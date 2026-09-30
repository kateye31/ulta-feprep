"use client";

import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, drawSelection, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { HighlightStyle, bracketMatching, indentOnInput, indentUnit, syntaxHighlighting } from "@codemirror/language";
import { cpp } from "@codemirror/lang-cpp";
import { lintGutter, setDiagnostics, type Diagnostic as CMDiagnostic } from "@codemirror/lint";
import { tags as t } from "@lezer/highlight";

export type EditorMark = { line: number; severity: "error" | "warning" | "info"; message: string };

const style = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.definitionKeyword, t.modifier, t.operatorKeyword], color: "#ff9ecb", fontWeight: "600" },
  { tag: [t.typeName, t.standard(t.typeName)], color: "#8be0d0" },
  { tag: [t.string, t.character, t.special(t.string)], color: "#c7f0a4" },
  { tag: [t.number, t.bool, t.null], color: "#ffc9a8" },
  { tag: [t.comment, t.lineComment, t.blockComment], color: "#a192c2", fontStyle: "italic" },
  { tag: [t.processingInstruction, t.macroName, t.meta], color: "#caa8ff" },
  { tag: [t.function(t.variableName), t.function(t.definition(t.variableName))], color: "#f7d77f" },
  { tag: [t.propertyName], color: "#b8d8ff" },
  { tag: [t.operator, t.punctuation, t.bracket], color: "#e6dcf5" },
]);

const theme = EditorView.theme(
  {
    "&": { color: "var(--code-ink)", backgroundColor: "var(--code-bg)", height: "100%", fontSize: "14.5px" },
    ".cm-content": { fontFamily: "var(--font-mono)", caretColor: "#ffd6f0", padding: "12px 0" },
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#ffd6f0", borderLeftWidth: "2px" },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": { backgroundColor: "rgba(194,169,242,0.35) !important" },
    ".cm-gutters": { backgroundColor: "var(--code-bg)", color: "#8f7fb0", border: "none" },
    ".cm-activeLine": { backgroundColor: "rgba(255,255,255,0.05)" },
    ".cm-activeLineGutter": { backgroundColor: "rgba(255,255,255,0.08)", color: "#f3eaff" },
    ".cm-scroller": { overflow: "auto", fontFamily: "var(--font-mono)", lineHeight: "1.65" },
    ".cm-matchingBracket": { backgroundColor: "rgba(247,215,127,0.22)", outline: "1px solid rgba(247,215,127,0.55)" },
    "&.cm-focused": { outline: "none" },
    ".cm-lintRange-error": { backgroundImage: "none", textDecoration: "underline wavy #ff7aa8", textUnderlineOffset: "3px" },
    ".cm-lintRange-warning": { backgroundImage: "none", textDecoration: "underline wavy #f7d77f", textUnderlineOffset: "3px" },
    ".cm-tooltip": { backgroundColor: "#3a2c52", color: "#f3eaff", border: "1px solid #5b4780", borderRadius: "10px" },
    ".cm-diagnostic": { fontFamily: "var(--font-body)", fontSize: "13px" },
  },
  { dark: true },
);

type Props = {
  path: string;
  value: string;
  onChange: (text: string) => void;
  onRun: () => void;
  marks: EditorMark[];
  jump: { line: number; n: number } | null;
};

export default function CodeEditor({ path, value, onChange, onRun, marks, jump }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const states = useRef(new Map<string, EditorState>());
  const cur = useRef(path);
  const cbs = useRef({ onChange, onRun });
  cbs.current = { onChange, onRun };

  const make = (doc: string) =>
    EditorState.create({
      doc,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        drawSelection(),
        indentOnInput(),
        bracketMatching(),
        highlightActiveLine(),
        lintGutter(),
        cpp(),
        syntaxHighlighting(style),
        indentUnit.of("    "),
        EditorState.tabSize.of(4),
        theme,
        keymap.of([
          { key: "Mod-Enter", run: () => (cbs.current.onRun(), true) },
          { key: "Mod-s", preventDefault: true, run: () => true },
          indentWithTab,
          ...defaultKeymap,
          ...historyKeymap,
        ]),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) cbs.current.onChange(u.state.doc.toString());
        }),
        EditorView.contentAttributes.of({ spellcheck: "false", autocorrect: "off", autocapitalize: "off", "aria-label": "C code editor" }),
      ],
    });

  useEffect(() => {
    if (!host.current) return;
    const v = new EditorView({ state: make(value), parent: host.current });
    view.current = v;
    return () => v.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switching files: keep each file's own undo history.
  useEffect(() => {
    const v = view.current;
    if (!v || cur.current === path) return;
    states.current.set(cur.current, v.state);
    const saved = states.current.get(path);
    v.setState(saved && saved.doc.toString() === value ? saved : make(value));
    cur.current = path;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  // Outside changes (restore starter, backup import): replace the text.
  useEffect(() => {
    const v = view.current;
    if (!v || cur.current !== path) return;
    const doc = v.state.doc.toString();
    if (doc !== value) v.dispatch({ changes: { from: 0, to: doc.length, insert: value } });
  }, [value, path]);

  useEffect(() => {
    const v = view.current;
    if (!v) return;
    const doc = v.state.doc;
    const diags: CMDiagnostic[] = marks
      .filter((m) => m.line >= 1 && m.line <= doc.lines)
      .map((m) => {
        const L = doc.line(m.line);
        const from = L.from + (L.text.length - L.text.trimStart().length);
        return { from, to: Math.max(from, L.to), severity: m.severity, message: m.message };
      });
    v.dispatch(setDiagnostics(v.state, diags));
  }, [marks, path]);

  useEffect(() => {
    const v = view.current;
    if (!v || !jump) return;
    const doc = v.state.doc;
    const L = doc.line(Math.min(Math.max(1, jump.line), doc.lines));
    v.dispatch({ selection: { anchor: L.from }, effects: EditorView.scrollIntoView(L.from, { y: "center" }) });
    v.focus();
  }, [jump]);

  return <div ref={host} className="studio-editor" data-lenis-prevent />;
}
