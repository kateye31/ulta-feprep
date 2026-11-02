import { noteFor } from "@/content/guha";
import type { TopicSlug } from "@/lib/potd/types";
import Code from "./Code";
import { inline } from "./arcade/Rich";
import { Md } from "./Md";

/** Arup Guha's COP 3502 material for one topic, explained in our own words, with credit. */
export function GuhaNote({ topic }: { topic: string }) {
  const n = noteFor(topic as TopicSlug);
  if (!n) return null;
  return (
    <div className="guha">
      <p className="guha-tldr">{inline(n.tldr)}</p>
      <div className="guha-sections">
        {n.sections.map((s, i) => (
          <section key={i} className="guha-sec">
            <h3>
              <span className="guha-n" aria-hidden>
                {i + 1}
              </span>
              {s.heading}
            </h3>
            <Md text={s.body} className="md" />
            {s.code && <Code src={s.code} />}
          </section>
        ))}
      </div>
      <div className="guha-miss">
        <h3>What you tend to miss</h3>
        <ul>
          {n.misses.map((m, i) => (
            <li key={i}>{inline(m)}</li>
          ))}
        </ul>
      </div>
      <p className="guha-credit">
        Explained in our own words from{" "}
        {n.sources.map((s, i) => (
          <span key={s.url}>
            {i > 0 && (i === n.sources.length - 1 ? " and " : ", ")}
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          </span>
        ))}
        .
      </p>
    </div>
  );
}
