import type { Topic } from "@/lib/types";
import { Callout, EmojiRow, Hi } from "@/components/ui";

export const timingProblems: Topic = {
  slug: "timing-problems",
  title: "Timing Problems",
  short: "Timing",
  emoji: "⏱",
  section: "IIA",
  mascot: "mochi",
  tagline: "If one cake takes 10 minutes, how long do 4 cakes take? Timing problems are just recipes that scale!",
  minutes: 12,
  tldr: [
    <>The setup: &ldquo;An O(f(n)) algorithm takes <b>T₁</b> seconds for input <b>n₁</b>. How long for <b>n₂</b>?&rdquo;</>,
    <>Model it as <Hi>T(n) = c · f(n)</Hi>, where c is an unknown constant (how fast the computer is).</>,
    <>Step 1: solve for <b>c</b> using T₁ and n₁. Step 2: plug in n₂. Done!</>,
    <>Shortcut: <b>T₂ / T₁ = f(n₂) / f(n₁)</b>. For O(n²), tripling n means 3² = <b>9×</b> the time.</>,
    <>Reverse version: &ldquo;How big can n be in time T?&rdquo; Same equation, but solve for n instead.</>,
  ],
  picture: {
    title: "Baking at scale",
    scene: <EmojiRow items={[["🍪", "1 batch: 10 min"], ["🍪🍪🍪", "3 batches: 30 min"], ["🧑‍🍳", "O(n) recipe"]]} />,
    caption: "the recipe's shape decides the scaling",
    body: (
      <>
        <p><b>O(n):</b> baking cookies 🍪. Triple the batches → triple the time.</p>
        <p><b>O(n²):</b> every guest at the party taste-tests every other guest&apos;s dish 🍲. Triple the guests → <b>9×</b> the tasting.</p>
        <p><b>O(log n):</b> finding a word in a dictionary 📖. <b>Square</b> the dictionary size (1,000 → 1,000,000 words) and it only takes <b>twice</b> as long (log goes 10 → 20).</p>
        <p>The constant <b>c</b> is how fast <i>your</i> kitchen is. We never know it, but it cancels out!</p>
      </>
    ),
  },
  levels: [
    {
      title: "The 2-step recipe",
      body: (
        <>
          <p><b>Example:</b> An O(n²) algorithm takes 4 seconds for n = 1,000. How long for n = 3,000?</p>
          <ol>
            <li>4 = c · 1000² → c = 4 / 1,000,000 = 4×10⁻⁶</li>
            <li>T(3000) = 4×10⁻⁶ · 3000² = 4×10⁻⁶ · 9,000,000 = <b>36 seconds</b></li>
          </ol>
          <p>Shortcut: n tripled, so the time is multiplied by 3² = 9 → 4 · 9 = 36 ✅</p>
        </>
      ),
    },
    {
      title: "Logs & n log n (use powers of 2!)",
      body: (
        <>
          <p>The FE picks numbers like 2¹⁰ and 2²⁰ so the logs are clean: log₂(2¹⁰) = 10.</p>
          <p><b>Example:</b> An O(n log n) algorithm takes 10 ms for n = 2¹⁰. How long for n = 2²⁰?</p>
          <p className="mono">T₂/T₁ = (2²⁰ · 20) / (2¹⁰ · 10) = 2¹⁰ · 2 = 2048</p>
          <p>T₂ = 10 · 2048 = <b>20,480 ms</b> (about 20.5 seconds).</p>
          <Callout kind="tip" title="Log laws you need">
            log₂(2ᵏ) = k · log(ab) = log a + log b · log(aᵏ) = k·log a
          </Callout>
        </>
      ),
    },
    {
      title: "The reverse question: how big can n be?",
      body: (
        <>
          <p><b>Example:</b> An O(n³) algorithm handles n = 200 in 1 second. What&apos;s the biggest n it can handle in 1000 seconds?</p>
          <ol>
            <li>1 = c · 200³ → c = 1 / 8,000,000</li>
            <li>1000 = n³ / 8,000,000 → n³ = 8,000,000,000 → n = <b>2,000</b></li>
          </ol>
          <p>Ratio thinking: 1000× more time, so n³ can be 1000× bigger, so n grows by ∛1000 = <b>10×</b>.</p>
        </>
      ),
    },
  ],
  widgets: ["timing"],
  mnemonics: [
    { hook: "Find c, then plug in 🔌", body: <p>Every timing problem is those two steps. c is the kitchen speed. It&apos;s the same for both runs.</p> },
    { hook: "Grow n by k → time grows by f(k) 🌱", body: <p>(For polynomial f.) Double n in O(n³)? 2³ = 8× the time.</p> },
    { hook: "Power of 2 → log is the exponent", body: <p>log₂(2³⁰) = 30. The FE almost always uses powers of 2 for log problems.</p> },
  ],
  missing: [
    {
      title: "Why does this even work?",
      body: <p>Big-O ignores constants, but in real life a fixed algorithm on a fixed computer really does behave like c·f(n) for large n. The ratio trick works because <b>c cancels</b>: T₂/T₁ = c·f(n₂) / c·f(n₁).</p>,
    },
    {
      title: "Units: keep them consistent",
      body: <p>If T₁ is in milliseconds, T₂ comes out in milliseconds. Convert at the very end if the question asks for seconds. (1 s = 1000 ms, 1 min = 60 s.)</p>,
    },
    {
      title: "Exponentials behave differently",
      body: <p>For O(2ⁿ), adding 1 to n doubles the time. Going from n = 10 to n = 20 multiplies the time by 2¹⁰ = 1024, not by 2!</p>,
    },
  ],
  traps: [
    <>For O(n log n), you can&apos;t just scale by the ratio of n&apos;s. You must include the log part too.</>,
    <>Forgetting to square (or cube) the ratio for O(n²) (or O(n³)).</>,
    <>Arithmetic slips with big numbers. Write numbers as powers (2¹⁰, 10³) and cancel before multiplying.</>,
    <>Answering with the wrong unit, or forgetting the unit entirely.</>,
  ],
  example: {
    title: "Worked problem: log time",
    prompt: <p><b>FE-style:</b> An O(log n) algorithm (base 2) takes 6 microseconds for n = 64. How long for n = 4096?</p>,
    steps: [
      <p>log₂ 64 = 6 (since 2⁶ = 64). So 6 = c · 6 → <b>c = 1</b> µs per step.</p>,
      <p>log₂ 4096 = 12 (since 2¹² = 4096).</p>,
      <p>T = 1 · 12 = <b>12 microseconds</b> ✅ The input grew 64×, but the time only doubled. That&apos;s the magic of logs 🪄</p>,
    ],
  },
  quiz: [
    {
      q: <>An O(n) algorithm takes 3 s for n = 500. Time for n = 2000?</>,
      choices: ["6 s", "12 s", "48 s", "3 s"],
      answer: 1,
      why: <>n grew 4×, and linear → 4× the time → 12 s.</>,
    },
    {
      q: <>An O(n²) algorithm takes 2 ms for n = 100. Time for n = 1000?</>,
      choices: ["20 ms", "200 ms", "2000 ms", "2 ms"],
      answer: 1,
      why: <>n grew 10× → time grows 10² = 100× → 200 ms.</>,
    },
    {
      q: <>An O(2ⁿ) algorithm takes 1 s for n = 30. Time for n = 33?</>,
      choices: ["1.1 s", "3 s", "8 s", "33 s"],
      answer: 2,
      why: <>2³³ / 2³⁰ = 2³ = 8 → 8 seconds.</>,
    },
  ],
  flashcards: [
    { front: "Timing-problem model", back: "T(n) = c · f(n). Solve for c with the known run, then plug in the new n." },
    { front: "Ratio shortcut", back: "T₂ / T₁ = f(n₂) / f(n₁)" },
    { front: "O(n³), n doubles → time ×?", back: "2³ = 8" },
    { front: "O(log n): n goes 2¹⁰ → 2²⁰. Time ×?", back: "20/10 = 2" },
  ],
  resources: [
    { label: "Math is Fun: Logarithms", url: "https://www.mathsisfun.com/algebra/logarithms.html", kind: "read", note: "If logs feel rusty, start here. Short, friendly and full of pictures." },
    { label: "Timing questions in past FEs", url: "https://www.cs.ucf.edu/registration/exm/", kind: "practice", note: "Look at Section II-A in almost any recent exam." },
    { label: "feprep.net practice", url: "https://feprep.net/dashboard", kind: "practice" },
    { label: "Algorithm runtime & scaling", url: "https://www.youtube.com/results?search_query=algorithm+runtime+scaling+big+o+example+problems", kind: "video" },
  ],
  notes: [
    { label: "Algorithm Analysis 2", file: "AlgorithmAnalysis-2.pdf" },
    { label: "Algorithm Analysis 3", file: "AlgorithmAnalysis-3.pdf" },
  ],
};
