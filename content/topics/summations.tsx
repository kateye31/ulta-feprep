import type { Topic } from "@/lib/types";
import { Callout, Hi } from "@/components/ui";
import Code from "@/components/Code";

export const summations: Topic = {
  slug: "summations",
  title: "Summations",
  short: "Summations",
  emoji: "🧱",
  section: "IIA",
  mascot: "pip",
  tagline: "Σ is just a fancy 'for loop' for math! It says: add up this thing for every i from here to there.",
  minutes: 18,
  tldr: [
    <><b>Σ (sigma)</b> means &ldquo;add up&rdquo;. <code>Σᵢ₌₁ⁿ i</code> = 1 + 2 + … + n. It&apos;s literally a <b>for loop</b> that adds.</>,
    <>The big three: <Hi>Σ c = c·(number of terms)</Hi>, <Hi>Σ i = n(n+1)/2</Hi>, <Hi>Σ i² = n(n+1)(2n+1)/6</Hi>.</>,
    <>Geometric: <b>1 + 2 + 4 + … + 2ⁿ = 2ⁿ⁺¹ − 1</b>.</>,
    <>You can <b>split</b> sums over + and −, and <b>pull constants out</b>.</>,
    <>Bounds not starting at 1? Use <b>Σₐᵇ = Σ₁ᵇ − Σ₁ᵃ⁻¹</b>. Number of terms = <b>b − a + 1</b>.</>,
  ],
  picture: {
    title: "Σ is a for loop wearing a costume",
    scene: <div style={{ fontSize: "1.3rem", lineHeight: 1.5 }}><div style={{ fontSize: "2.6rem" }}>Σ<sub style={{ fontSize: "1rem" }}>i=1</sub><sup style={{ fontSize: "1rem" }}>n</sup> i</div>= for i in 1..n: total += i</div>,
    caption: "same thing, different outfit",
    body: (
      <>
        <p>Every time you see Σ, translate it into code in your head:</p>
        <Code src={`int total = 0;
for (int i = 1; i <= n; i++)   // bottom number to top number
    total += i;                // the thing after the Σ`} />
        <p>And every loop you analyze can be turned into a Σ. That&apos;s why summations are on the algorithms part of the exam: they&apos;re how we <b>count loop work exactly</b>.</p>
      </>
    ),
  },
  levels: [
    {
      title: "Reading the notation",
      body: (
        <>
          <ul>
            <li>Bottom: where i starts. Top: where i stops (inclusive!).</li>
            <li><b>Σᵢ₌₁⁵ 3</b> = 3 + 3 + 3 + 3 + 3 = 15. (The i doesn&apos;t even appear; you just add 3 five times.)</li>
            <li><b>Σᵢ₌₁⁴ i²</b> = 1 + 4 + 9 + 16 = 30.</li>
            <li>Number of terms from a to b = <b>b − a + 1</b> (the classic fencepost 🪵: from 3 to 7 is 5 numbers, not 4).</li>
          </ul>
        </>
      ),
    },
    {
      title: "The formula sheet",
      body: (
        <>
          <div className="table-scroll">
            <table className="cozy">
              <tbody>
                <tr><td className="mono">Σᵢ₌₁ⁿ c</td><td className="mono">c·n</td></tr>
                <tr><td className="mono">Σᵢ₌₁ⁿ i</td><td className="mono">n(n+1)/2</td></tr>
                <tr><td className="mono">Σᵢ₌₁ⁿ i²</td><td className="mono">n(n+1)(2n+1)/6</td></tr>
                <tr><td className="mono">Σᵢ₌₁ⁿ i³</td><td className="mono">[n(n+1)/2]²</td></tr>
                <tr><td className="mono">Σᵢ₌₀ⁿ 2ⁱ</td><td className="mono">2ⁿ⁺¹ − 1</td></tr>
                <tr><td className="mono">Σᵢ₌₀ⁿ rⁱ</td><td className="mono">(rⁿ⁺¹ − 1)/(r − 1)</td></tr>
              </tbody>
            </table>
          </div>
          <p>Rules: <b>Σ(aᵢ + bᵢ) = Σaᵢ + Σbᵢ</b> and <b>Σ c·aᵢ = c·Σaᵢ</b>. But careful: Σ(aᵢ·bᵢ) ≠ (Σaᵢ)(Σbᵢ)!</p>
        </>
      ),
    },
    {
      title: "Weird bounds & splitting",
      body: (
        <>
          <p><b>Example:</b> Σᵢ₌₁₁³⁰ i = (1 + … + 30) − (1 + … + 10) = 465 − 55 = <b>410</b>.</p>
          <p><b>Example with n:</b> Σᵢ₌ₙ²ⁿ i = Σ₁²ⁿ i − Σ₁ⁿ⁻¹ i = 2n(2n+1)/2 − (n−1)n/2 = (4n² + 2n − n² + n)/2 = <b>(3n² + 3n)/2</b>.</p>
          <Callout kind="tip" title="Sanity check with a tiny n!">
            Plug n = 1 into both the original sum and your answer. Σᵢ₌₁² i = 1 + 2 = 3, and (3 + 3)/2 = 3 ✅. This catches most algebra mistakes.
          </Callout>
        </>
      ),
    },
    {
      title: "From code to sums (FE level)",
      body: (
        <>
          <Code
            title="count exactly how many times x++ runs"
            src={`
for (int i = 1; i <= n; i++)
    for (int j = i; j <= n; j++)
        x++;`}
          />
          <p>For each i, the inner loop runs (n − i + 1) times. So the total = Σᵢ₌₁ⁿ (n − i + 1) = n + (n−1) + … + 1 = <b>n(n+1)/2</b> → O(n²).</p>
          <p>Another way: substitute k = n − i + 1. As i goes 1 → n, k goes n → 1. Same sum, backwards!</p>
        </>
      ),
    },
  ],
  widgets: ["summation"],
  mnemonics: [
    { hook: "Gauss's rainbow 🌈", body: <p>Pair the first and last: 1 + 100, 2 + 99, 3 + 98… Every pair sums to 101, and there are 50 pairs → 5050. That&apos;s n(n+1)/2!</p> },
    { hook: "Fenceposts: b − a + 1 🪵", body: <p>Posts from 3 to 7? That&apos;s 5 posts. Always add 1.</p> },
    { hook: "Powers of 2 sum to 'next one minus 1' 🍕", body: <p>1 + 2 + 4 + 8 = 15 = 16 − 1. The sum is always one less than the next power.</p> },
    { hook: "Σ = S for Sum", body: <p>Sigma is the Greek letter S. Sum! That&apos;s all it means.</p> },
  ],
  missing: [
    {
      title: "Where does n(n+1)/2 come from?",
      body: <p>Write the sum forwards AND backwards, then add the two rows: each column is (n+1), and there are n columns, so twice the sum = n(n+1). Or see it in the staircase widget: two staircases make an n × (n+1) rectangle!</p>,
    },
    {
      title: "Why this matters for Big-O",
      body: <p>The leading term tells you the complexity: n(n+1)/2 = n²/2 + n/2 → O(n²). Σ i² ≈ n³/3 → O(n³). Geometric sums are dominated by their biggest term.</p>,
    },
    {
      title: "The infinite geometric series",
      body: <p>½ + ¼ + ⅛ + … = 1 (the pizza you never finish 🍕). In general, Σ rⁱ from 0 to ∞ = 1/(1 − r) when r &lt; 1. That&apos;s why n + n/2 + n/4 + … = 2n → O(n).</p>,
    },
  ],
  traps: [
    <>Using n(n+1)/2 when the sum starts at 0 or some other number. Adjust the bounds first!</>,
    <>Off-by-one counting terms: from a to b there are b − a + 1 terms.</>,
    <>Forgetting that Σᵢ₌₁ⁿ c = c·n, not c.</>,
    <>Algebra slips when simplifying. Expand carefully, and check with n = 1 or n = 2.</>,
    <>Pulling out something that depends on i. Only constants can move outside Σ.</>,
  ],
  example: {
    title: "Worked problem: closed form",
    prompt: <p><b>FE-style:</b> Find a closed form for <span className="mono">Σᵢ₌₁ⁿ (4i − 3)</span>.</p>,
    steps: [
      <p>Split it: Σ 4i − Σ 3.</p>,
      <p>Pull out the constant: 4·Σi − Σ3 = 4 · n(n+1)/2 − 3n.</p>,
      <p>Simplify: 2n(n+1) − 3n = 2n² + 2n − 3n = <b>2n² − n</b>.</p>,
      <p>Check with n = 2: the original is (4−3) + (8−3) = 1 + 5 = 6. The formula gives 2·4 − 2 = 6 ✅</p>,
    ],
  },
  quiz: [
    {
      q: <>Σᵢ₌₁¹⁰ i = ?</>,
      choices: ["45", "55", "100", "110"],
      answer: 1,
      why: <>10·11/2 = 55.</>,
    },
    {
      q: <>How many terms are in Σᵢ₌₅²⁰ (anything)?</>,
      choices: ["15", "16", "20", "25"],
      answer: 1,
      why: <>20 − 5 + 1 = 16.</>,
    },
    {
      q: <>1 + 2 + 4 + 8 + … + 2¹⁰ = ?</>,
      choices: ["2¹⁰", "2¹¹", "2¹¹ − 1", "2¹⁰ − 1"],
      answer: 2,
      why: <>Σᵢ₌₀ᵏ 2ⁱ = 2ᵏ⁺¹ − 1 with k = 10.</>,
    },
  ],
  flashcards: [
    { front: "Σᵢ₌₁ⁿ i", back: "n(n+1)/2" },
    { front: "Σᵢ₌₁ⁿ i²", back: "n(n+1)(2n+1)/6" },
    { front: "Σᵢ₌₀ⁿ 2ⁱ", back: "2ⁿ⁺¹ − 1" },
    { front: "Number of terms from i = a to i = b", back: "b − a + 1" },
    { front: "Σᵢ₌ₐᵇ f(i) using sums from 1", back: "Σᵢ₌₁ᵇ f(i) − Σᵢ₌₁ᵃ⁻¹ f(i)" },
  ],
  resources: [
    { label: "Paul's Online Notes: Summation notation", url: "https://tutorial.math.lamar.edu/Classes/CalcI/SummationNotation.aspx", kind: "read", note: "Clear rules and formulas with worked examples." },
    { label: "Math is Fun: Sigma notation", url: "https://www.mathsisfun.com/algebra/sigma-notation.html", kind: "read", note: "Super beginner-friendly, and it has a calculator." },
    { label: "Gauss's trick, visualized", url: "https://www.youtube.com/results?search_query=gauss+sum+1+to+100+visual+proof", kind: "video" },
    { label: "Summation practice (COP3502 notes)", url: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/lec/Summations.pdf", kind: "practice" },
  ],
  notes: [{ label: "Summations", file: "Summations.pdf" }],
};
