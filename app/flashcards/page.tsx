import type { Metadata } from "next";
import { RisoArt } from "@/components/RisoArt";
import FlashcardDeck from "@/components/FlashcardDeck";
import { TOPICS } from "@/content";

export const metadata: Metadata = { title: "🃏 Flashcards", description: "Quick-fire flashcards for every Foundation Exam topic." };

export default function FlashcardsPage() {
  const cards = TOPICS.flatMap((t) => t.flashcards.map((c) => ({ ...c, topic: t.short, emoji: t.emoji, section: t.section })));
  return (
    <div className="wrap" style={{ padding: "40px 0 80px" }}>
      <div className="center" style={{ marginBottom: 24 }}>
        <RisoArt tags={["bird", "butterfly"]} seed="flashcards" ink="cherry" className="page-print" credit={false} />
        <h1 style={{ margin: 0 }}>🃏 Flashcards</h1>
        <p className="muted">{cards.length} cards from all 18 topics. Flip, then be honest with yourself. &ldquo;Again&rdquo; is not a failure! 🌱</p>
      </div>
      <FlashcardDeck cards={cards} />
    </div>
  );
}
