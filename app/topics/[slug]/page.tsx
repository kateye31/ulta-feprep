import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TopicView from "@/components/TopicView";
import { TOPICS, getTopic } from "@/content";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTopic(slug);
  return t ? { title: `${t.emoji} ${t.title}`, description: t.tagline } : {};
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = TOPICS.findIndex((t) => t.slug === slug);
  if (i === -1) notFound();
  return <TopicView topic={TOPICS[i]} prev={TOPICS[i - 1]} next={TOPICS[i + 1]} />;
}
