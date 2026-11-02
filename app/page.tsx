import type { Metadata } from "next";
import Today from "@/components/today/Today";

export const metadata: Metadata = { title: "Today", description: "Today's problem, a focus session, your streak and the countdown to the Foundation Exam." };

export default function TodayPage() {
  return <Today />;
}
