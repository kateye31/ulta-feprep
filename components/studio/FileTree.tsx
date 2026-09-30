"use client";

import { useState } from "react";
import { baseName, listDir, type StudioFS } from "@/lib/studio-fs";

const FOLDER_ICON: Record<string, string> = { "professor-drills": "🎓", "exam-redo": "🔁", scratch: "🧪", "my-code": "💜" };

type Props = {
  fs: StudioFS;
  onOpen: (path: string) => void;
  onNewFile: (dir: string) => void;
  onNewFolder: (dir: string) => void;
  onRename: (path: string) => void;
  onDelete: (path: string) => void;
};

export default function FileTree({ fs, onOpen, onNewFile, onNewFolder, onRename, onDelete }: Props) {
  const [closed, setClosed] = useState<Record<string, boolean>>({});

  const renderDir = (dir: string, depth: number) => {
    const { folders, files } = listDir(fs, dir);
    return (
      <ul className="ft-list" role={depth === 0 ? "tree" : "group"}>
        {folders.map((f) => {
          const isClosed = closed[f];
          return (
            <li key={f} role="treeitem" aria-expanded={!isClosed}>
              <div className="ft-row ft-folder" style={{ paddingLeft: 8 + depth * 14 }}>
                <button className="ft-name" onClick={() => setClosed({ ...closed, [f]: !isClosed })}>
                  <span className="ft-caret" aria-hidden>{isClosed ? "▸" : "▾"}</span>
                  <span aria-hidden>{FOLDER_ICON[f] ?? (isClosed ? "📁" : "📂")}</span> {baseName(f)}
                </button>
                <span className="ft-actions">
                  <button title="New file here" aria-label={`New file in ${f}`} onClick={() => onNewFile(f)}>＋</button>
                  <button title="Rename" aria-label={`Rename ${f}`} onClick={() => onRename(f)}>✎</button>
                  <button title="Delete folder" aria-label={`Delete ${f}`} onClick={() => onDelete(f)}>🗑</button>
                </span>
              </div>
              {!isClosed && renderDir(f, depth + 1)}
            </li>
          );
        })}
        {files.map((p) => (
          <li key={p} role="treeitem" aria-selected={fs.open === p}>
            <div className={`ft-row ${fs.open === p ? "active" : ""}`} style={{ paddingLeft: 22 + depth * 14 }}>
              <button className="ft-name" onClick={() => onOpen(p)}>
                <span aria-hidden>{p.endsWith(".c") || p.endsWith(".h") ? "📄" : "📝"}</span> {baseName(p)}
              </button>
              <span className="ft-actions">
                <button title="Rename" aria-label={`Rename ${p}`} onClick={() => onRename(p)}>✎</button>
                <button title="Delete file" aria-label={`Delete ${p}`} onClick={() => onDelete(p)}>🗑</button>
              </span>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="ft" data-lenis-prevent>
      <div className="ft-head">
        <strong>🗂 Files</strong>
        <span style={{ display: "flex", gap: 4 }}>
          <button className="ft-btn" onClick={() => onNewFile("my-code")} title="New file in my-code">＋ file</button>
          <button className="ft-btn" onClick={() => onNewFolder("")} title="New folder">＋ folder</button>
        </span>
      </div>
      {renderDir("", 0)}
    </div>
  );
}
