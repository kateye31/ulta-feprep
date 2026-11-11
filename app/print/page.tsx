import type { Metadata } from "next";
import PaperPractice from "@/components/PaperPractice";

export const metadata: Metadata = { title: "🖨 Paper Practice", description: "Print FE questions you've never seen, do them by hand on a timer, and log the score." };

export default function PrintPage() {
  return (
    <div className="wrap" style={{ padding: "40px 0 80px" }}>
      <div className="pp-intro">
        <h1 style={{ margin: 0 }}>🖨 Paper Practice</h1>
        <p className="muted" style={{ margin: 0 }}>
          The real FE is pencil and paper, with no hints and no compiler. Practice that way: print questions you&apos;ve never seen, do them on a timer, grade them with
          the rubric, and log the score.
        </p>
      </div>
      <PaperPractice />
    </div>
  );
}
