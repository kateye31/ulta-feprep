import CopyButton from "./CopyButton";

const KW = new Set("if else for while do return break continue switch case default sizeof struct typedef static const void NULL true false goto enum union".split(" "));
const TYPES = new Set("int char float double long short unsigned signed bool node FILE size_t".split(" "));
const RE = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(^[ \t]*#\w+[^\n]*)|(\b0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)(?=\s*\()|([A-Za-z_]\w*)/gm;

function highlight(src: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  RE.lastIndex = 0;
  while ((m = RE.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const [tok, com, str, pre, num, fn, word] = m;
    let cls = "";
    if (com) cls = "tk-com";
    else if (str) cls = "tk-str";
    else if (pre) cls = "tk-pre";
    else if (num) cls = "tk-num";
    else if (fn) cls = KW.has(fn) ? "tk-kw" : "tk-fn";
    else if (word) cls = KW.has(word) ? "tk-kw" : TYPES.has(word) ? "tk-type" : "";
    out.push(
      cls ? (
        <span key={k++} className={cls}>
          {tok}
        </span>
      ) : (
        tok
      ),
    );
    last = m.index + tok.length;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

export default function Code({ src, title = "C" }: { src: string; title?: string }) {
  const clean = src.replace(/^\n+|\s+$/g, "");
  return (
    <div className="code">
      <div className="code-head">
        <span className="code-dots" aria-hidden>
          <i style={{ background: "#ec9f9f" }} />
          <i style={{ background: "#f2c95f" }} />
          <i style={{ background: "#7fae74" }} />
        </span>
        <span>{title}</span>
        <CopyButton text={clean} />
      </div>
      <pre>
        <code style={{ background: "none", border: "none", padding: 0, fontSize: "inherit", color: "inherit" }}>{highlight(clean)}</code>
      </pre>
    </div>
  );
}
