import type { Topic } from "@/lib/types";
import { Callout, EmojiRow, Hi } from "@/components/ui";
import Code from "@/components/Code";

export const baseConversion: Topic = {
  slug: "base-conversion",
  title: "Base Conversion",
  short: "Bases",
  emoji: "🔢",
  section: "IIB",
  mascot: "pip",
  tagline: "Base 10 is just counting on 10 fingers! Base 2 is a creature with 2 fingers, and base 16 has 16.",
  minutes: 12,
  tldr: [
    <>In base b, each digit&apos;s place is worth a power of b: …, b², b¹, b⁰.</>,
    <><b>Base b → decimal:</b> multiply each digit by its place value and add. <code>312₇ = 3·49 + 1·7 + 2 = 156</code>.</>,
    <><b>Decimal → base b:</b> repeatedly divide by b and collect remainders, then <Hi>read them bottom-up</Hi>.</>,
    <>Hex (base 16) uses A–F for 10–15. One hex digit = 4 bits exactly.</>,
    <>The recursive version is beautiful: print <code>n / b</code> in base b first, then print the digit <code>n % b</code>.</>,
  ],
  picture: {
    title: "Coins and piggy banks 🐷",
    scene: <EmojiRow items={[["🪙", "1s"], ["💵", "7s"], ["💰", "49s"]]} />,
    caption: "base 7 money",
    body: (
      <>
        <p>Imagine a country where coins come in values <b>1, 7, 49, 343</b>… (powers of 7). To pay 156 with the fewest coins, you use as many 49s as possible (3 → 147), then 7s (1 → 7), then 1s (2). So 156 = <b>312</b> in base 7!</p>
        <p>Our normal numbers work the same way with 1s, 10s, 100s. We just don&apos;t notice because we have 10 fingers 🖐🖐.</p>
      </>
    ),
  },
  levels: [
    {
      title: "Any base → decimal",
      body: (
        <>
          <p><code>1011₂</code> = 1·8 + 0·4 + 1·2 + 1·1 = <b>11</b></p>
          <p><code>2F₁₆</code> = 2·16 + 15·1 = <b>47</b></p>
          <p><b>Horner&apos;s trick</b> (no powers needed): go left to right, and at each digit do <code>total = total·b + digit</code>. For 312₇: 0·7+3 = 3 → 3·7+1 = 22 → 22·7+2 = <b>156</b>.</p>
        </>
      ),
    },
    {
      title: "Decimal → any base",
      body: (
        <>
          <p>Divide by b, write down the remainder, and repeat with the quotient until you reach 0. Then read the remainders <b>from last to first</b>.</p>
          <p>156 → base 2: 156/2 = 78 r<b>0</b>, 78/2 = 39 r<b>0</b>, 39/2 = 19 r<b>1</b>, 19/2 = 9 r<b>1</b>, 9/2 = 4 r<b>1</b>, 4/2 = 2 r<b>0</b>, 2/2 = 1 r<b>0</b>, 1/2 = 0 r<b>1</b> → read up: <b>10011100</b>.</p>
          <Callout kind="tip" title="Why bottom-up?">
            The first remainder is the <b>ones</b> digit (the rightmost). Each later remainder is the next place to the left.
          </Callout>
        </>
      ),
    },
    {
      title: "Recursive printing (FE style)",
      body: (
        <>
          <Code
            title="print n in base b recursively"
            src={`
void printBase(int n, int b) {
    if (n < b) {                          // one digit left
        printf("%c", "0123456789ABCDEF"[n]);
        return;
    }
    printBase(n / b, b);                  // print the higher digits FIRST
    printf("%c", "0123456789ABCDEF"[n % b]);   // then my digit
}`}
          />
          <p>Recursion naturally fixes the &ldquo;bottom-up&rdquo; order: the call for the higher digits finishes printing before the current digit prints.</p>
          <p><b>Binary ↔ hex shortcut:</b> group bits in 4s from the right: <code>1001 1100</code> = <b>9C</b>₁₆. Octal works the same with groups of 3.</p>
        </>
      ),
    },
  ],
  widgets: ["base"],
  mnemonics: [
    { hook: "Divide, remainder, repeat, read UP ⬆️", body: <p>Like climbing back up a ladder: the answer is read from the bottom rung.</p> },
    { hook: "Hex digit = 4 bits = a nibble 🍪", body: <p>Yes, half a byte is really called a nibble.</p> },
    { hook: "Multiply-and-add left to right ➡️", body: <p>Horner&apos;s method: total = total × base + digit.</p> },
  ],
  missing: [
    {
      title: "Why computers use binary",
      body: <p>Electronics are really good at two states: voltage on or off. Two states → base 2. Everything (text, pictures, music) is ultimately stored as long strings of bits.</p>,
    },
    {
      title: "Largest number with k digits in base b",
      body: <p>It&apos;s bᵏ − 1 (like 999 = 10³ − 1). So 8 bits hold 0 to 255 (2⁸ − 1). That&apos;s why colors go from 0 to 255!</p>,
    },
  ],
  traps: [
    <>Reading remainders top-down instead of bottom-up (this reverses your answer).</>,
    <>Forgetting that in hex, A = 10, …, F = 15.</>,
    <>Using a digit ≥ the base (there&apos;s no digit 7 in base 7!).</>,
    <>Recursive version: printing the digit <b>before</b> the recursive call reverses the output.</>,
  ],
  example: {
    title: "Worked problem: convert 200 to base 6",
    prompt: <p><b>FE-style:</b> Convert 200₁₀ to base 6, then check your answer.</p>,
    steps: [
      <p>200 / 6 = 33 remainder <b>2</b></p>,
      <p>33 / 6 = 5 remainder <b>3</b></p>,
      <p>5 / 6 = 0 remainder <b>5</b></p>,
      <p>Read up: <b>532₆</b>. Check: 5·36 + 3·6 + 2 = 180 + 18 + 2 = 200 ✅</p>,
    ],
  },
  quiz: [
    { q: <>What is <code>11010₂</code> in decimal?</>, choices: ["26", "13", "52", "22"], answer: 0, why: <>16 + 8 + 2 = 26.</> },
    { q: <>What is 255 in hex?</>, choices: ["EE", "FF", "F0", "100"], answer: 1, why: <>15·16 + 15 = 255 → FF.</> },
    { q: <>What is 10 in base 3?</>, choices: ["101", "31", "110", "1010"], answer: 0, why: <>10 = 1·9 + 0·3 + 1 → 101₃.</> },
  ],
  flashcards: [
    { front: "Decimal → base b method", back: "Repeatedly divide by b and collect remainders; read them bottom-up." },
    { front: "Base b → decimal", back: "Sum of digit × b^position (or Horner's: total = total·b + digit)." },
    { front: "Hex digit ↔ bits", back: "1 hex digit = 4 bits" },
    { front: "Largest k-digit number in base b", back: "bᵏ − 1" },
  ],
  resources: [
    { label: "Math is Fun: Binary numbers", url: "https://www.mathsisfun.com/binary-number-system.html", kind: "read" },
    { label: "Math is Fun: Hexadecimal", url: "https://www.mathsisfun.com/hexadecimals.html", kind: "read" },
    { label: "Number bases explained", url: "https://www.youtube.com/results?search_query=number+base+conversion+explained", kind: "video" },
  ],
  notes: [
    { label: "Base Conversion", file: "BaseConversion.pdf" },
    { label: "Sample: baseconv2.c", file: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/baseconv2.c" },
  ],
};
