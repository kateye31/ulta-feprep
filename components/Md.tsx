import { Fragment, type ReactNode } from "react";
import { inline } from "./arcade/Rich";

/**
 * Small markdown for walkthroughs: paragraphs, numbered and bulleted lists, pipe tables,
 * fenced code, plus `code`, **bold** and *italic* inline.
 */
export function Md({ text, className }: { text: string; className?: string }) {
  const blocks: ReactNode[] = [];
  const lines = text.replace(/\r/g, "").split("\n");
  let i = 0;
  let k = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.trim().startsWith("```")) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) body.push(lines[i++]);
      i++;
      blocks.push(<pre key={k++} className="md-code"><code>{body.join("\n")}</code></pre>);
      continue;
    }
    if (/^\s*\|/.test(line)) {
      const rows: string[][] = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        const cells = lines[i].trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells);
        i++;
      }
      const [head, ...body] = rows;
      blocks.push(
        <div key={k++} className="md-table-wrap">
          <table className="md-table">
            <thead>
              <tr>{head.map((c, j) => <th key={j}>{inline(c)}</th>)}</tr>
            </thead>
            <tbody>
              {body.map((r, ri) => (
                <tr key={ri}>{r.map((c, j) => <td key={j}>{inline(c)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }
    if (/^\s*(\d+\.|[-*•])\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      while (i < lines.length && /^\s*(\d+\.|[-*•])\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*(\d+\.|[-*•])\s+/, ""));
      const L = ordered ? "ol" : "ul";
      blocks.push(
        <L key={k++} className="md-list">
          {items.map((it, j) => <li key={j}>{inline(it)}</li>)}
        </L>,
      );
      continue;
    }
    if (/^#{1,4}\s/.test(line)) {
      blocks.push(<h4 key={k++} className="md-h">{inline(line.replace(/^#+\s*/, ""))}</h4>);
      i++;
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^\s*(\||```|\d+\.\s|[-*•]\s|#{1,4}\s)/.test(lines[i])) para.push(lines[i++]);
    blocks.push(
      <p key={k++}>
        {para.map((l, j) => (
          <Fragment key={j}>
            {j > 0 && <br />}
            {inline(l)}
          </Fragment>
        ))}
      </p>,
    );
  }
  return <div className={className}>{blocks}</div>;
}
