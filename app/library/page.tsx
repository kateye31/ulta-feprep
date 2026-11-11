import type { Metadata } from "next";
import Link from "next/link";
import { RisoArt } from "@/components/RisoArt";
import { inline } from "@/components/arcade/Rich";
import { TOPICS } from "@/content";
import { RECIPES } from "@/lib/recipes";
import { BOOK, chAnchor, chapter, chLabel, CHAPTERS, GET_IT, READING_ORDER, RECIPE_BOOK, topicsFor } from "@/lib/standish";

export const metadata: Metadata = { title: "📚 Library", description: "The course textbook, Standish's Data Structures, Algorithms, and Software Principles in C, mapped chapter by chapter to the FE." };

const topicName = (slug: string) => TOPICS.find((t) => t.slug === slug);
const FE_TAG = { core: { label: "FE core", cls: "core" }, useful: { label: "Helps", cls: "useful" }, skip: { label: "Skip for FE", cls: "skip" } } as const;

const HOW = [
  { e: "❓", t: "**Read with a question.** Open the topic page first and copy its \"Read to answer these\" questions into your notebook. Now you're hunting for answers, not just reading words." },
  { e: "🐢", t: "**Read code slowly, with a pencil.** For every code listing, draw the memory picture or trace a small input by hand. If you can't trace it, you haven't read it yet." },
  { e: "🙈", t: "**Close the book and say it back.** After each part, close the book and explain it out loud or on paper. Whatever you can't say back, reread. This is what turns reading into knowing." },
  { e: "✍️", t: "**Write the code from blank.** Do the \"Close the book, then…\" exercise on the topic page. Then run it in the Studio." },
  { e: "🔀", t: "**Change one thing.** Rewrite the book's example for a different struct or rule (a list of books instead of ints, a max-heap instead of a min-heap). If you can only do the exact example, you memorized it." },
  { e: "📏", t: "**Test cold.** At the end of the week, print a cold question on that chapter from Paper Practice. That score tells you whether the reading worked." },
];

export default function LibraryPage() {
  return (
    <div className="wrap library" style={{ padding: "40px 0 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 22 }}>
        <RisoArt tags={["books", "reading"]} seed="library" ink="cherry" className="page-print" credit={false} />
        <div style={{ flex: 1, minWidth: 240 }}>
          <h1 style={{ margin: 0 }}>📚 Library</h1>
          <p className="muted" style={{ margin: 0 }}>
            The textbook goes deep where websites only skim. Every topic page has a 📕 section saying exactly what to read in it, and every recipe names its chapter.
          </p>
        </div>
      </div>

      <section className="lib-hero">
        <div className="lib-cover" aria-hidden>
          <span className="lib-cover-title">Data Structures, Algorithms, and Software Principles in C</span>
          <span className="lib-cover-author">Thomas A. Standish</span>
        </div>
        <div style={{ minWidth: 0 }}>
          <h2 style={{ marginTop: 0 }}>
            <i>{BOOK.title}</i>
          </h2>
          <p className="muted" style={{ marginTop: 0 }}>
            {BOOK.author} · {BOOK.publisher} · {BOOK.year} · {BOOK.pages} pages · ISBN {BOOK.isbn13}
          </p>
          <p>
            Why this one: it teaches data structures <b>in C</b>, the language the FE is written in. It builds every structure from pointers and <code>malloc</code>, explains why
            each design works, and counts what each operation costs. That&apos;s the &ldquo;why&rdquo; that makes recipes stick.
          </p>
          <h3>Where to get a copy</h3>
          <ul className="lib-get">
            {GET_IT.map((g) => (
              <li key={g.label}>
                <a href={g.url} target="_blank" rel="noreferrer">
                  {g.label} ↗
                </a>{" "}
                <span className="muted">{g.note}</span>
              </li>
            ))}
          </ul>
          <p className="lib-note">
            The Internet Archive has a scan, but it&apos;s only open to readers with a print disability, so it isn&apos;t a normal borrow. Chapter titles here come from the
            book&apos;s published listing. Section and page numbers aren&apos;t listed because they couldn&apos;t be checked against a copy. Once you have the book, the table of
            contents can be added here.
          </p>
        </div>
      </section>

      <section>
        <h2>🧠 How to read it so it sticks (not memorized)</h2>
        <ol className="lib-how">
          {HOW.map((h, i) => (
            <li key={i}>
              <span aria-hidden>{h.e}</span>
              <div>{inline(h.t)}</div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2>🗓 Reading order</h2>
        <p className="muted">Matched to your plan: C and memory first, then the structures, then analysis. About 30 minutes of reading a day, plus the topic page.</p>
        <div className="lib-order">
          {READING_ORDER.map((w) => (
            <div key={w.week} className="lib-week">
              <b>{w.week}</b>
              <div className="lib-week-ch">
                {w.ch.map((id) => (
                  <a key={String(id)} href={`#${chAnchor(id)}`} className="book-chip">
                    📕 {chLabel(id)} · {chapter(id)?.title}
                  </a>
                ))}
              </div>
              <div className="lib-week-topics">
                {w.topics.map((s) => {
                  const t = topicName(s);
                  return t ? (
                    <Link key={s} href={`/topics/${s}#book`} className="chip" style={{ textDecoration: "none" }}>
                      {t.emoji} {t.short}
                    </Link>
                  ) : null;
                })}
              </div>
              <p className="muted">{w.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>📖 Every chapter, mapped to the FE</h2>
        <div className="lib-chapters">
          {CHAPTERS.map((c) => {
            const topics = topicsFor(c.id);
            const recipes = RECIPES.filter((r) => RECIPE_BOOK[r.id]?.includes(c.id));
            const tag = FE_TAG[c.fe];
            return (
              <article key={String(c.id)} id={chAnchor(c.id)} className={`lib-ch ${tag.cls}`}>
                <header>
                  <span className="lib-ch-n">{chLabel(c.id)}</span>
                  <h3>{c.title}</h3>
                  <span className={`lib-tag ${tag.cls}`}>{tag.label}</span>
                </header>
                <p>{c.why}</p>
                {topics.length > 0 && (
                  <p className="lib-links">
                    <b>Topic pages:</b>{" "}
                    {topics.map((s) => {
                      const t = topicName(s);
                      return t ? (
                        <Link key={s} href={`/topics/${s}#book`}>
                          {t.emoji} {t.short}
                        </Link>
                      ) : null;
                    })}
                  </p>
                )}
                {recipes.length > 0 && (
                  <p className="lib-links">
                    <b>Recipes:</b>{" "}
                    {recipes.map((r) => (
                      <Link key={r.id} href={`/recipes#${r.id}`}>
                        {r.emoji} {r.name}
                      </Link>
                    ))}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section>
        <h2>🌐 The online extras</h2>
        <p className="muted">
          Use these <b>after</b> the chapter, not instead of it: Python Tutor to watch your code run, the USFCA and VisuAlgo animations to watch a structure change, CS50 and
          Beej&apos;s for C basics. Each topic page lists its own under 📚 Go deeper.
        </p>
      </section>
    </div>
  );
}
