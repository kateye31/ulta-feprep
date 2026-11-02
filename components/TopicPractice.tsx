"use client";

import { useMemo, useState } from "react";
import { POTD_BANK } from "@/content/potd";
import { logStore, patchDay, ymd } from "@/lib/studylog";
import { Solve } from "./today/Solve";
import "./today/today.css";

/** A short deck of bank problems for one topic, one card at a time. */
export function TopicPractice({ topic }: { topic: string }) {
  const deck = useMemo(() => POTD_BANK.filter((p) => p.topic === topic).sort((a, b) => a.level - b.level), [topic]);
  const [i, setI] = useState(0);
  if (!deck.length) return null;
  const p = deck[i % deck.length];
  return (
    <div className="topic-practice">
      <p className="topic-practice-count">
        Card {(i % deck.length) + 1} of {deck.length}
      </p>
      <div className="panel">
        <Solve
          problem={p}
          isToday={false}
          onResult={(r) => {
            if (!r.ok) return;
            const d = ymd();
            patchDay(d, { extra: (logStore.read().days[d]?.extra ?? 0) + 1 });
          }}
          onFocus={() => {}}
          onAnother={() => setI(i + 1)}
        />
      </div>
    </div>
  );
}
