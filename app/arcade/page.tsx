import type { Metadata } from "next";
import Lobby from "@/components/arcade/Lobby";

export const metadata: Metadata = { title: "Night Shift · Exam Arcade", description: "Real past Foundation Exams turned into a cozy step-by-step game." };

export default function ArcadePage() {
  return <Lobby />;
}
