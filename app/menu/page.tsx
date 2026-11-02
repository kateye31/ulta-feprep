import type { Metadata } from "next";
import Link from "next/link";
import { topicsBySection } from "@/content";
import { SECTIONS } from "@/lib/sections";
import { MenuCheck } from "@/components/Stamp";
import { RisoArt } from "@/components/RisoArt";

export const metadata: Metadata = { title: "Topics", description: "Every Foundation Exam topic, as the zine's contents page." };

/** each exam section prints on its own paper stock */
const STOCK: Record<string, { bg: string; ink: "cherry" | "plum" | "cornflower" | "leaf"; tags: string[] }> = {
  IA: { bg: "var(--sunflower)", ink: "cherry", tags: ["train", "cat"] },
  IB: { bg: "var(--mint)", ink: "leaf", tags: ["garden", "owl"] },
  IIA: { bg: "var(--pink)", ink: "plum", tags: ["moon", "night"] },
  IIB: { bg: "var(--stock-cream)", ink: "cornflower", tags: ["goldfish", "water"] },
};

export default function MenuPage() {
  const groups = topicsBySection();
  let n = 0;
  return (
    <div className="wrap contents">
      <header className="contents-head">
        <h1>Topics</h1>
        <p>18 topics in the four exam sections. Each one has the TL;DR, the way Guha teaches it, a playground, exam traps and practice cards. A paw stamp means you finished it.</p>
      </header>

      <div className="contents-grid">
        {groups.map((g, gi) => {
          const s = SECTIONS[g.id];
          const st = STOCK[g.id] ?? STOCK.IIB;
          return (
            <section key={g.id} className="contents-sec" style={{ background: st.bg, rotate: `${gi % 2 ? 0.6 : -0.6}deg` }} aria-labelledby={`sec-${g.id}`}>
              <div className="contents-sec-head">
                <div>
                  <h2 id={`sec-${g.id}`}>{s.part.replace(/^Part [AB]:\s*/, "")}</h2>
                  <p className="contents-sec-sub">
                    {s.name} · {g.topics.length} topics
                  </p>
                </div>
                <RisoArt tags={st.tags} seed={g.id} ink={st.ink} className="contents-print" credit={false} />
              </div>
              <ol className="contents-list">
                {g.topics.map((t) => {
                  n++;
                  return (
                    <li key={t.slug}>
                      <Link href={`/topics/${t.slug}`} className="contents-item">
                        <span className="contents-n">{String(n).padStart(2, "0")}</span>
                        <span className="contents-text">
                          <span className="name">{t.title}</span>
                          <span className="desc">{t.picture.title}</span>
                        </span>
                        <span className="contents-dots" aria-hidden />
                        <span className="contents-min">{t.minutes} min</span>
                        <MenuCheck slug={t.slug} />
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
