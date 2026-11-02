import type { Metadata } from "next";
import { RisoArt } from "@/components/RisoArt";
import Journal from "@/components/Journal";

export const metadata: Metadata = { title: "📓 Question Journal", description: "Your FE question log: what you tried, what you got, what you learned." };

export default function JournalPage() {
  return (
    <div className="wrap" style={{ padding: "40px 0 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <RisoArt tags={["books", "reading"]} seed="journal" ink="cherry" className="page-print" credit={false} />
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1 style={{ margin: 0 }}>📓 Question Journal</h1>
          <p className="muted" style={{ margin: 0 }}>
            Every past-exam question you try goes here: your score, and the lesson in <b>your own words</b>. I copied in your 8 entries so far. The 💻 button reopens the question in the Code Studio so you can redo it for real.
          </p>
        </div>
      </div>
      <Journal />
    </div>
  );
}
