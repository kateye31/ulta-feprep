import type { Metadata } from "next";
import { RecipeCard } from "@/components/RecipeCard";
import { RisoArt } from "@/components/RisoArt";
import { RECIPES } from "@/lib/recipes";

export const metadata: Metadata = { title: "🧾 Recipes", description: "The same steps, every time, for every kind of Foundation Exam question." };

const SECTIONS = [
  { id: "A", name: "Section A · Basic data structures" },
  { id: "B", name: "Section B · Advanced data structures" },
  { id: "C", name: "Section C · Algorithm analysis" },
  { id: "D", name: "Section D · Algorithms" },
] as const;

export default function RecipesPage() {
  return (
    <div className="wrap recipe-page" style={{ padding: "40px 0 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
        <RisoArt tags={["tea", "still-life"]} seed="recipes" ink="cherry" className="page-print" credit={false} />
        <div style={{ flex: 1, minWidth: 240 }}>
          <h1 style={{ margin: 0 }}>🧾 Recipes</h1>
          <p className="muted" style={{ margin: 0 }}>
            Same steps, every time. Open the one for today&apos;s topic, read it out loud, then do one Night Shift question. Each question shows its recipe in your inventory too.
          </p>
        </div>
      </div>
      {SECTIONS.map((s) => (
        <section key={s.id} aria-labelledby={`sec-${s.id}`}>
          <h2 id={`sec-${s.id}`}>{s.name}</h2>
          <div className="recipe-page-grid">
            {RECIPES.filter((r) => r.section === s.id).map((r) => (
              <RecipeCard key={r.id} id={r.id} recipe={r} open={false} link={false} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
