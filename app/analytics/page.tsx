import type { Metadata } from "next";
import Analytics from "@/components/Analytics";
import { RisoArt } from "@/components/RisoArt";

export const metadata: Metadata = { title: "📊 Analytics", description: "Sections and topics you've covered, and the ones you tend to miss." };

export default function AnalyticsPage() {
  return (
    <div className="wrap" style={{ padding: "40px 0 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
        <RisoArt tags={["still-life"]} seed="analytics" ink="cherry" className="page-print" credit={false} />
        <div style={{ flex: 1, minWidth: 240 }}>
          <h1 style={{ margin: 0 }}>📊 Analytics</h1>
          <p className="muted" style={{ margin: 0 }}>
            Built from every Night Shift step you finish, real exams and FE 100 alike. Check the 🚩 list before you pick today&apos;s topic.
          </p>
        </div>
      </div>
      <Analytics />
    </div>
  );
}
