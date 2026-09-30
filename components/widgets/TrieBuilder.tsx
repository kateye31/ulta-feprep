"use client";

import { useState } from "react";
import TreeSvg, { type TEdge, type TNode } from "./TreeSvg";

type T = { kids: Record<string, T>; word: boolean; count: number };
const mk = (): T => ({ kids: {}, word: false, count: 0 });

function build(words: string[]) {
  const root = mk();
  for (const w of words) {
    let c = root;
    c.count++;
    for (const ch of w) {
      c.kids[ch] ??= mk();
      c = c.kids[ch];
      c.count++;
    }
    c.word = true;
  }
  return root;
}

export default function TrieBuilder() {
  const [words, setWords] = useState(["cat", "car", "cart", "dog", "do"]);
  const [val, setVal] = useState("");
  const [hlPath, setHlPath] = useState<string[]>([]);
  const [msg, setMsg] = useState("🌸 Each edge is one letter. A purple node means a word ENDS here (the isWord flag). Try searching \"ca\" vs \"car\".");

  const root = build(words);
  const nodes: TNode[] = [];
  const edges: TEdge[] = [];
  let leaf = 0;
  const walk = (n: T, id: string, d: number): number => {
    const keys = Object.keys(n.kids).sort();
    let x: number;
    if (!keys.length) x = leaf++;
    else {
      const xs = keys.map((k) => {
        edges.push({ from: id, to: id + k, label: k });
        return walk(n.kids[k], id + k, d + 1);
      });
      x = (xs[0] + xs[xs.length - 1]) / 2;
    }
    nodes.push({ id, label: id === "^" ? "root" : n.word ? "★" : "", x, y: d, tone: hlPath.includes(id) ? "hl" : n.word ? "flag" : undefined });
    return x;
  };
  walk(root, "^", 0);
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");

  const add = () => {
    const w = clean(val);
    if (!w) return setMsg("🙈 Letters a–z only, please!");
    if (words.includes(w)) return setMsg(`"${w}" is already in the trie.`);
    const shared = words.reduce((best, x) => {
      let i = 0;
      while (i < x.length && i < w.length && x[i] === w[i]) i++;
      return Math.max(best, i);
    }, 0);
    setWords([...words, w]);
    setHlPath(["^", ...Array.from(w, (_, i) => "^" + w.slice(0, i + 1))]);
    setMsg(`🌱 Added "${w}". It reused ${shared} existing letter-node${shared === 1 ? "" : "s"} and made ${w.length - shared} new one${w.length - shared === 1 ? "" : "s"}. That's the whole point of a trie: shared prefixes are stored once!`);
    setVal("");
  };

  const search = () => {
    const w = clean(val);
    if (!w) return;
    let c: T | undefined = root;
    const path = ["^"];
    for (let i = 0; i < w.length && c; i++) {
      c = c.kids[w[i]];
      if (c) path.push("^" + w.slice(0, i + 1));
    }
    setHlPath(path);
    if (!c) setMsg(`❌ Fell off the trie at letter ${path.length} ("${w[path.length - 1]}"). "${w}" isn't a word OR a prefix here.`);
    else if (c.word) setMsg(`✅ "${w}" is a WORD (flag is on)! ${c.count} word(s) start with it.`);
    else setMsg(`🟡 "${w}" is only a PREFIX (the path exists, but the flag is off). ${c.count} word(s) start with it.`);
  };

  return (
    <div className="widget">
      <div className="widget-title">🌸 Trie Flower Tree</div>
      <div className="widget-sub">Words that start the same share the same branch, like a family tree of spellings.</div>
      <div className="controls">
        <input className="input" style={{ width: 140 }} placeholder="word" value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} aria-label="Word" />
        <button className="btn small" onClick={add}>🌱 Insert</button>
        <button className="btn small secondary" onClick={search}>🔍 Search</button>
        <button className="btn small secondary" onClick={() => { setWords([]); setHlPath([]); setMsg("🧹 Empty trie: just a root node."); }}>🧹 Clear</button>
      </div>
      <div className="muted" style={{ fontSize: "0.9rem" }}>Words: {words.join(", ") || "none"}</div>
      <div className="stage" style={{ marginTop: 8 }}>
        <TreeSvg nodes={nodes} edges={edges} slotW={48} levelH={60} r={16} />
      </div>
      <div className="log" aria-live="polite">{msg}</div>
    </div>
  );
}
