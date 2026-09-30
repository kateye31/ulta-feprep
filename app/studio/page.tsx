import type { Metadata } from "next";
import Studio from "@/components/studio/Studio";

export const metadata: Metadata = {
  title: "💻 Code Studio",
  description: "Write and run real C in your browser. No AI, just you and gcc. Files save automatically.",
};

export default function StudioPage() {
  return <Studio />;
}
