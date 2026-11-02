import type { Metadata } from "next";
import CalendarView from "@/components/today/CalendarView";

export const metadata: Metadata = { title: "Calendar", description: "Every day you studied since January 1, and the countdown to the Foundation Exam." };

export default function CalendarPage() {
  return <CalendarView />;
}
