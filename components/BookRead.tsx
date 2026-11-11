import Link from "next/link";
import { inline } from "@/components/arcade/Rich";
import { BOOK, chAnchor, chapter, chLabel, READING, type ChapterId } from "@/lib/standish";

/** "Ch 7 · Stacks and Queues" chips that link to the Library page */
export function ChapterChips({ ids, small }: { ids: ChapterId[]; small?: boolean }) {
  return (
    <span className={`book-chips ${small ? "small" : ""}`}>
      {ids.map((id) => (
        <Link key={String(id)} href={`/library#${chAnchor(id)}`} className="book-chip">
          📕 {chLabel(id)}
          {!small && <> · {chapter(id)?.title}</>}
        </Link>
      ))}
    </span>
  );
}

/** The textbook section on a topic page: where to read, what the reading is really about, what to answer, what to do after. */
export function BookRead({ slug }: { slug: string }) {
  const r = READING[slug];
  if (!r) return null;
  return (
    <div className="book-read">
      <div className="book-read-top">
        <div className="book-spine" aria-hidden>
          <span>{BOOK.short}</span>
        </div>
        <div style={{ minWidth: 0 }}>
          <p className="book-read-title">
            <i>{BOOK.title}</i> · {BOOK.author}
          </p>
          <ChapterChips ids={r.ch} />
          <p className="book-look">
            <b>📍 Where to look:</b> {inline(r.look)}
          </p>
        </div>
      </div>

      <div className="book-lens">
        <h3>🔍 What the reading is really about</h3>
        {r.lens.map((p, i) => (
          <p key={i}>{inline(p)}</p>
        ))}
      </div>

      <div className="book-cols">
        <div className="book-ask">
          <h3>✏️ Read to answer these</h3>
          <p className="book-hint">Write each answer in your notebook, in your own words. If you can&apos;t, reread that part.</p>
          <ol>
            {r.ask.map((q, i) => (
              <li key={i}>{inline(q)}</li>
            ))}
          </ol>
        </div>
        <div className="book-do">
          <h3>📕 Close the book, then…</h3>
          <p>{inline(r.doIt)}</p>
          {r.gap && (
            <p className="book-gap">
              <b>Heads up:</b> {inline(r.gap)}
            </p>
          )}
        </div>
      </div>
      <p className="book-foot">
        <Link href="/library">📚 The whole book, chapter by chapter, and how to get a copy →</Link>
      </p>
    </div>
  );
}
