import type { Metadata } from "next";
import FlashcardDeck from "@/components/FlashcardDeck";
import { Pip } from "@/components/characters";
import { TOPICS } from "@/content";

export const metadata: Metadata = { title: "🃏 Flashcards", description: "Quick-fire flashcards for every Foundation Exam topic." };

export default function FlashcardsPage() {
  const cards = TOPICS.flatMap((t) => t.flashcards.map((c) => ({ ...c, topic: t.short, emoji: t.emoji, section: t.section })));
  return (
    <div className="wrap" style={{ padding: "40px 0 80px" }}>
      <div className="center" style={{ marginBottom: 24 }}>
        <Pip size={90} className="bob" />
        <span className="eyebrow">quick sips of knowledge</span>
        <h1 style={{ margin: 0 }}>🃏 Flashcards</h1>
        <p className="muted">{cards.length} cards from all 18 topics. Flip, then be honest with yourself. &ldquo;Again&rdquo; is not a failure! 🌱</p>
      </div>
      <FlashcardDeck cards={cards} />
    </div>
  );
}
