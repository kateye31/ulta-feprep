"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { inline } from "@/components/arcade/Rich";
import type { Recipe } from "@/lib/recipes";
import { ChapterChips } from "@/components/BookRead";
import { RECIPE_BOOK } from "@/lib/standish";

/** One recipe: how to spot it, the numbered steps, and the trap. Collapsible so it never crowds the page. */
export function RecipeCard({ recipe, open = true, link = true, id, remember }: { recipe: Recipe; open?: boolean; link?: boolean; id?: string; remember?: string }) {
  const el = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const d = el.current;
    if (!d) return;
    // opened by a link like /recipes#tree-code
    const fromHash = () => {
      if (!id || location.hash !== `#${id}`) return false;
      d.open = true;
      requestAnimationFrame(() => d.scrollIntoView({ block: "start" }));
      return true;
    };
    if (id) window.addEventListener("hashchange", fromHash);
    if (fromHash()) return () => window.removeEventListener("hashchange", fromHash);
    // remember whether this spot keeps its card folded (a per-viewer convenience)
    if (remember) {
      try {
        const v = localStorage.getItem(remember);
        if (v) d.open = v === "open";
      } catch {}
    }
    return () => window.removeEventListener("hashchange", fromHash);
  }, [id, remember]);
  return (
    <details
      ref={el}
      className="rcard"
      open={open}
      id={id}
      onToggle={(e) => {
        if (!remember) return;
        try {
          localStorage.setItem(remember, (e.currentTarget as HTMLDetailsElement).open ? "open" : "closed");
        } catch {}
      }}
    >
      <summary>
        <span className="rcard-tag">🧾 Recipe</span>
        <span className="rcard-name">
          {recipe.emoji} {recipe.name}
        </span>
      </summary>
      <p className="rcard-spot">
        <b>Spot it:</b> {inline(recipe.spot)}
      </p>
      <ol className="rcard-steps">
        {recipe.steps.map((s, i) => (
          <li key={i}>
            <span className="rcard-e" aria-hidden>
              {s.e}
            </span>
            <div>
              <span className="rcard-n">{i + 1}.</span> {inline(s.t)}
              {s.ex && <pre className="rcard-ex">{s.ex}</pre>}
            </div>
          </li>
        ))}
      </ol>
      <p className="rcard-trap">
        <b>⚠️ Trap:</b> {inline(recipe.trap)}
      </p>
      {!!RECIPE_BOOK[recipe.id]?.length && (
        <p className="rcard-book">
          <b>📕 Textbook:</b> <ChapterChips ids={RECIPE_BOOK[recipe.id]} small />
        </p>
      )}
      {link && (
        <p className="rcard-more">
          <Link href={`/recipes#${recipe.id}`}>All recipes →</Link>
        </p>
      )}
    </details>
  );
}
