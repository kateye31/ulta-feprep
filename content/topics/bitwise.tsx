import type { Topic } from "@/lib/types";
import { Callout, EmojiRow, Hi } from "@/components/ui";
import Code from "@/components/Code";

export const bitwise: Topic = {
  slug: "bitwise",
  title: "Bitwise Operators",
  short: "Bitwise",
  emoji: "💡",
  section: "IIB",
  mascot: "pip",
  tagline: "Every number is a row of tiny light switches! Bitwise operators flip, check and combine the switches.",
  minutes: 18,
  tldr: [
    <>Integers are stored in <b>binary</b>: a row of bits (0/1), each worth a power of 2: …, 16, 8, 4, 2, 1.</>,
    <><code>&amp;</code> AND (both 1), <code>|</code> OR (either 1), <code>^</code> XOR (different), <code>~</code> NOT (flip all).</>,
    <><code>x &lt;&lt; k</code> = x × 2ᵏ, and <code>x &gt;&gt; k</code> = x ÷ 2ᵏ (integer division, for non-negative x).</>,
    <>The recipes: check bit i <code>(x &gt;&gt; i) &amp; 1</code>, set <code>x | (1 &lt;&lt; i)</code>, clear <code>x &amp; ~(1 &lt;&lt; i)</code>, flip <code>x ^ (1 &lt;&lt; i)</code>.</>,
    <>Bitmasks can represent <Hi>subsets</Hi>: bit i = 1 means &ldquo;item i is included&rdquo;. Loop from 0 to 2ⁿ − 1 to get every subset!</>,
  ],
  picture: {
    title: "A row of light switches",
    scene: <div style={{ fontSize: "1.8rem", letterSpacing: 4 }}>💡🌑💡💡🌑💡🌑🌑<div style={{ fontSize: "0.9rem", letterSpacing: 0 }}>1 0 1 1 0 1 0 0 = 180</div></div>,
    caption: "each switch is a power of 2",
    body: (
      <>
        <p>Imagine 8 light switches labeled <b>128, 64, 32, 16, 8, 4, 2, 1</b>. The number is the total of the labels of every switch that&apos;s ON. 💡 at 128, 32, 16 and 4 → 180.</p>
        <ul>
          <li><b>AND &amp;</b>: a door with <b>two locks</b> 🔐🔐. It only opens if both keys turn.</li>
          <li><b>OR |</b>: a room with <b>two light switches</b> for one lamp. Either one turns it on.</li>
          <li><b>XOR ^</b>: a <b>hallway light</b> with switches at both ends. Flip either one and the light toggles.</li>
          <li><b>Shift &lt;&lt;</b>: everyone slides one seat left, and every seat is worth double → ×2.</li>
        </ul>
      </>
    ),
  },
  levels: [
    {
      title: "Binary, fast",
      body: (
        <>
          <p>To convert 45 to binary, find which powers of 2 add up to it: 45 = 32 + 8 + 4 + 1 → <code>101101</code>.</p>
          <EmojiRow items={[["32", "1"], ["16", "0"], ["8", "1"], ["4", "1"], ["2", "0"], ["1", "1"]]} />
          <p style={{ marginTop: 10 }}>Going back: add up the place values that have a 1.</p>
        </>
      ),
    },
    {
      title: "The operators, bit by bit",
      body: (
        <>
          <div className="table-scroll">
            <table className="cozy mono">
              <thead><tr><th>a</th><th>b</th><th>a &amp; b</th><th>a | b</th><th>a ^ b</th></tr></thead>
              <tbody>
                <tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
                <tr><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
                <tr><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td></tr>
                <tr><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td></tr>
              </tbody>
            </table>
          </div>
          <p>Line the two numbers up in binary and apply the rule to <b>each column separately</b>. No carrying like in addition!</p>
          <Callout kind="warn" title="& is not &&">
            <code>&amp;&amp;</code> is logical (true/false). <code>&amp;</code> works bit by bit: <code>6 &amp;&amp; 1</code> is 1 (true), but <code>6 &amp; 1</code> is 0 (110 &amp; 001 = 000).
          </Callout>
        </>
      ),
    },
    {
      title: "Masks & the 4 recipes",
      body: (
        <>
          <Code
            title="bit recipes"
            src={`
int isOn   = (x >> i) & 1;     // slide bit i to the end, keep only it
x = x |  (1 << i);             // SET bit i   (turn on)
x = x & ~(1 << i);             // CLEAR bit i (turn off)
x = x ^  (1 << i);             // TOGGLE bit i
int isPow2 = x > 0 && (x & (x - 1)) == 0;   // only one bit on?
int isOdd  = x & 1;            // last bit tells odd/even`}
          />
          <p><code>1 &lt;&lt; i</code> is a <b>mask</b> with only bit i on. Masks are like stencils: they pick which switches you touch.</p>
        </>
      ),
    },
    {
      title: "Subsets with bitmasks (FE favorite)",
      body: (
        <>
          <p>With n items, every number from 0 to 2ⁿ − 1 is a different subset: bit i on means item i is in it.</p>
          <Code
            title="print every subset"
            src={`
void allSubsets(int *items, int n) {
    for (int mask = 0; mask < (1 << n); mask++) {   // 2^n subsets
        printf("{ ");
        for (int i = 0; i < n; i++)
            if (mask & (1 << i))                    // is item i in?
                printf("%d ", items[i]);
        printf("}\\n");
    }
}`}
          />
          <p>For n = 3: mask 5 = <code>101</code> → items 0 and 2. mask 7 = <code>111</code> → all three. That&apos;s O(2ⁿ · n).</p>
        </>
      ),
    },
  ],
  widgets: ["bitwise"],
  drills: [["Bitwise drill (predict first!)","professor-drills/3-bitwise.c"]],
  mnemonics: [
    { hook: "AND is picky, OR is easygoing 😤😌", body: <p>AND wants BOTH. OR is happy with EITHER.</p> },
    { hook: "XOR = eXclusive: 'one or the other, not both' 💔", body: <p>Different → 1. Same → 0. And x ^ x = 0, since everything cancels itself.</p> },
    { hook: "Shift left = double, shift right = halve ✌️", body: <p>Just like adding or removing a zero at the end of a decimal number multiplies or divides by 10.</p> },
    { hook: "OR sets, AND-NOT clears, XOR flips 🎛", body: <p>The three verbs for changing one switch.</p> },
  ],
  missing: [
    {
      title: "Negative numbers: two's complement",
      body: <p>Computers store −x as <code>~x + 1</code>. So −1 is all 1s (<code>11111111…</code>). That&apos;s why <code>~0 == -1</code> and why <code>~5 == -6</code>. The top bit acts as the &ldquo;negative&rdquo; sign.</p>,
    },
    {
      title: "Why programmers love bits",
      body: <p>Bits are the fastest operations a CPU has. They&apos;re used for file permissions (<code>chmod 755</code> is literally bits!), colors (#FF8800 is three bytes), game flags (&ldquo;has key&rdquo;, &ldquo;has sword&rdquo;), and network addresses.</p>,
    },
    {
      title: "Hex is binary in groups of 4",
      body: <p>Each hex digit = exactly 4 bits: <code>0xA5</code> = <code>1010 0101</code>. That&apos;s why programmers use hex. It&apos;s a compact way to write bits.</p>,
    },
    {
      title: "Operator precedence gotcha",
      body: <p>In C, <code>&amp;</code>, <code>^</code> and <code>|</code> have <b>lower</b> precedence than <code>==</code>! So <code>x &amp; 1 == 0</code> means <code>x &amp; (1 == 0)</code>. Always use parentheses around bitwise expressions.</p>,
    },
  ],
  traps: [
    <>Mixing up <code>&amp;</code> with <code>&amp;&amp;</code>, or <code>|</code> with <code>||</code>.</>,
    <>Forgetting parentheses: <code>(x &amp; mask) == 0</code>, not <code>x &amp; mask == 0</code>.</>,
    <><code>~x</code> flips <b>all 32 bits</b>, including the leading zeros, so ~5 is −6, not 2.</>,
    <>Shifting by ≥ 32 (the width of an int) is undefined behavior in C.</>,
    <>Binary conversion slips. Write the place values (128 64 32 16 8 4 2 1) above your bits every time!</>,
  ],
  example: {
    title: "Worked problem: evaluate expressions",
    prompt: <p><b>FE-style:</b> Evaluate <code>45 &amp; 27</code>, <code>45 | 27</code>, <code>45 ^ 27</code>, and <code>45 &gt;&gt; 2</code>.</p>,
    steps: [
      <p>Convert: 45 = 32+8+4+1 = <code>101101</code>. 27 = 16+8+2+1 = <code>011011</code>.</p>,
      <p><b>&amp;</b>: <code>101101 &amp; 011011 = 001001</code> = 8 + 1 = <b>9</b></p>,
      <p><b>|</b>: <code>101101 | 011011 = 111111</code> = <b>63</b></p>,
      <p><b>^</b>: <code>101101 ^ 011011 = 110110</code> = 32+16+4+2 = <b>54</b></p>,
      <p><b>&gt;&gt; 2</b>: <code>101101 → 1011</code> = 8+2+1 = <b>11</b> (and 45 / 4 = 11 ✅)</p>,
    ],
  },
  quiz: [
    { q: <>What is <code>12 &amp; 10</code>?</>, choices: ["8", "14", "6", "2"], answer: 0, why: <>1100 &amp; 1010 = 1000 = 8.</> },
    { q: <>What is <code>12 ^ 10</code>?</>, choices: ["8", "14", "6", "2"], answer: 2, why: <>1100 ^ 1010 = 0110 = 6.</> },
    { q: <>What is <code>3 &lt;&lt; 4</code>?</>, choices: ["7", "12", "48", "81"], answer: 2, why: <>3 × 2⁴ = 48.</> },
    { q: <>With n = 4 items, how many subsets does the bitmask loop visit?</>, choices: ["4", "8", "16", "24"], answer: 2, why: <>2⁴ = 16 (including the empty set).</> },
  ],
  flashcards: [
    { front: "Check if bit i of x is on", back: "(x >> i) & 1   (or: x & (1 << i) != 0)" },
    { front: "Set bit i", back: "x | (1 << i)" },
    { front: "Clear bit i", back: "x & ~(1 << i)" },
    { front: "Toggle bit i", back: "x ^ (1 << i)" },
    { front: "x << k equals…", back: "x × 2ᵏ" },
    { front: "Is x a power of 2?", back: "x > 0 && (x & (x − 1)) == 0" },
  ],
  resources: [
    { label: "Programiz: C bitwise operators", url: "https://www.programiz.com/c-programming/bitwise-operators", kind: "read" },
    { label: "VisuAlgo: Bitmask", url: "https://visualgo.net/en/bitmask", kind: "visual", note: "Set, check and toggle bits with animations." },
    { label: "Cornell: Two's complement", url: "https://www.cs.cornell.edu/~tomf/notes/cps104/twoscomp.html", kind: "read", note: "Short and clear explanation of negative numbers." },
    { label: "Bitwise operators explained", url: "https://www.youtube.com/results?search_query=bitwise+operators+explained+c", kind: "video" },
    { label: "Two's complement (Wikipedia)", url: "https://en.wikipedia.org/wiki/Two%27s_complement", kind: "read" },
  ],
  notes: [
    { label: "Bitwise Operators", file: "BitwiseOperators.pdf" },
    { label: "Sample: bitwise.c", file: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/bitwise.c" },
  ],
};
