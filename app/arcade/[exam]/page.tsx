import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Game from "@/components/arcade/Game";
import { ARCADE_EXAMS, getExam } from "@/content/arcade";

export function generateStaticParams() {
  return ARCADE_EXAMS.map((e) => ({ exam: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ exam: string }> }): Promise<Metadata> {
  const e = getExam((await params).exam);
  return { title: e ? `${e.term} · Night Shift` : "Night Shift" };
}

export default async function ExamGamePage({ params }: { params: Promise<{ exam: string }> }) {
  const { exam } = await params;
  if (!getExam(exam)) notFound();
  return (
    <Suspense>
      <Game examId={exam} />
    </Suspense>
  );
}
