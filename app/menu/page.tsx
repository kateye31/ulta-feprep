import type { Metadata } from "next";
import Link from "next/link";
import { topicsBySection } from "@/content";
import { SECTIONS } from "@/lib/sections";
import { DoneBadge, MenuCheck } from "@/components/Stamp";
import { Mochi } from "@/components/characters";

export const metadata: Metadata = { title: "📜 Menu", description: "Every Foundation Exam topic, served café style." };

export default function MenuPage() {
  const groups = topicsBySection();
  return (
    <div className="wrap" style={{ padding: "40px 0 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 24 }} data-reveal>
        <Mochi size={90} className="bob" />
        <div>
          <span className="eyebrow">what are you craving today?</span>
          <h1 style={{ margin: 0 }}>📜 Today&apos;s Menu</h1>
          <p className="muted" style={{ margin: 0 }}>18 topics, 4 sections. 🐾 = stamped. Go in order, or pick whatever sounds tasty.</p>
        </div>
      </div>

      <div className="menu-board" data-reveal>
        <div className="grid grid-2" style={{ gap: 30 }}>
          {groups.map((g) => {
            const s = SECTIONS[g.id];
            return (
              <div key={g.id}>
                <h2 style={{ marginBottom: 2 }}>{s.emoji} {s.menuName}</h2>
                <div className="chalk" style={{ marginBottom: 8 }}>{s.name}: {s.part}</div>
                <div className="menu-items">
                  {g.topics.map((t) => (
                    <Link key={t.slug} href={`/topics/${t.slug}`} className="menu-item">
                      <span aria-hidden>{t.emoji}</span>
                      <span>
                        <span className="name">{t.title}</span>
                        <span className="desc">{t.minutes} min · {t.picture.title}</span>
                      </span>
                      <span className="dots" />
                      <MenuCheck slug={t.slug} />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {groups.map((g) => {
        const s = SECTIONS[g.id];
        return (
          <section key={g.id} style={{ marginTop: 50 }}>
            <div data-reveal>
              <span className={`chip ${g.id}`}>{s.emoji} {s.name}</span>
              <h2 style={{ marginTop: 8 }}>{s.part}</h2>
            </div>
            <div className="grid grid-3" data-stagger>
              {g.topics.map((t) => (
                <Link key={t.slug} href={`/topics/${t.slug}`} className="topic-card">
                  <DoneBadge slug={t.slug} />
                  <span className="emoji" aria-hidden>{t.emoji}</span>
                  <h3>{t.title}</h3>
                  <p>{t.tagline}</p>
                  <span className="muted" style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                    ⏱ {t.minutes} min{t.widgets?.length ? ` · 🎮 ${t.widgets.length} playground${t.widgets.length > 1 ? "s" : ""}` : ""}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
