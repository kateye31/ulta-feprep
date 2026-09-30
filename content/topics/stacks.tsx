import type { Topic } from "@/lib/types";
import { Callout, EmojiRow, Hi } from "@/components/ui";
import Code from "@/components/Code";

export const stacks: Topic = {
  slug: "stacks",
  title: "Stacks & Postfix",
  short: "Stacks",
  emoji: "🥞",
  section: "IA",
  mascot: "mochi",
  tagline: "Stacks are pancakes! You only ever touch the top one. Last one on is the first one eaten.",
  minutes: 22,
  tldr: [
    <>A <b>stack</b> is <Hi>LIFO</Hi>: Last In, First Out. You can only touch the <b>top</b>.</>,
    <>Operations: <code>push</code> (add to top), <code>pop</code> (remove from top), <code>peek/top</code> (look), <code>isEmpty</code>. All <b>O(1)</b>.</>,
    <>Build it with an <b>array + top index</b>, or a <b>linked list</b> where the head is the top.</>,
    <>The FE&apos;s favorite use: converting <b>infix</b> (<code>A + B * C</code>) to <b>postfix</b> (<code>A B C * +</code>) and <b>evaluating postfix</b>.</>,
    <>Stacks are everywhere: undo buttons, browser back, matching parentheses, and <b>recursion itself</b> (the call stack!).</>,
  ],
  picture: {
    title: "A plate of pancakes (or a Pringles can)",
    scene: <EmojiRow items={[["🥞", "push"], ["🍽", "the stack"], ["😋", "pop"]]} />,
    caption: "only the top is reachable",
    body: (
      <>
        <p>You stack pancakes one at a time. The one you added <i>last</i> sits on top, and it&apos;s the one you eat <i>first</i>. To reach the bottom pancake, you have to eat everything above it.</p>
        <p>Other stacks in your life: 🍽 the plate dispenser at a buffet, the ⤺ <b>Ctrl+Z</b> undo history, the <b>back</b> button in your browser, and a Pringles can 🥫.</p>
      </>
    ),
  },
  levels: [
    {
      title: "The 4 moves",
      body: (
        <>
          <ul>
            <li><b>push(x)</b>: put x on top 🥞⬆</li>
            <li><b>pop()</b>: remove and return the top 🥞⬇</li>
            <li><b>peek()</b>: look at the top without removing 👀</li>
            <li><b>isEmpty()</b>: are we out of pancakes? 🫙</li>
          </ul>
          <p>Push 1, push 2, push 3, then pop three times → you get <b>3, 2, 1</b>. Stacks <b>reverse</b> things!</p>
        </>
      ),
    },
    {
      title: "Building one (array or linked list)",
      body: (
        <>
          <Code
            title="array stack"
            src={`
#define SIZE 100
typedef struct {
    int items[SIZE];
    int top;               // index of top item, -1 = empty
} Stack;

void init(Stack *s)      { s->top = -1; }
int  isEmpty(Stack *s)   { return s->top == -1; }
int  isFull(Stack *s)    { return s->top == SIZE - 1; }

int push(Stack *s, int x) {
    if (isFull(s)) return 0;     // overflow
    s->items[++(s->top)] = x;    // move top up, THEN store
    return 1;
}

int pop(Stack *s) {
    if (isEmpty(s)) return -1;   // underflow (sentinel value)
    return s->items[(s->top)--]; // read, THEN move top down
}`}
          />
          <p>Linked-list version: <b>push = insert at front</b>, <b>pop = delete from front</b>. Both O(1), and no size limit.</p>
        </>
      ),
    },
    {
      title: "Infix → Postfix (the FE classic)",
      body: (
        <>
          <p><b>Infix</b> is how humans write math: <code>A + B * C</code>. <b>Postfix</b> puts the operator <i>after</i> its operands: <code>A B C * +</code>. Postfix never needs parentheses or precedence rules. Computers love it.</p>
          <p><b>The algorithm</b> (read left to right):</p>
          <ol>
            <li>🍓 <b>Operand</b> (letter/number)? → straight to output.</li>
            <li>🫧 <b>(</b> → push it.</li>
            <li>🫧 <b>)</b> → pop to output until you hit <code>(</code>. Throw both parens away.</li>
            <li>👑 <b>Operator</b> → first pop (to output) every operator on top with <b>higher or equal</b> precedence, stopping at <code>(</code>. Then push this one.</li>
            <li>🏁 End of input → pop everything left to output.</li>
          </ol>
          <Callout kind="tip" title="Precedence">
            <code>* / %</code> beat <code>+ -</code>. Equal precedence pops because we evaluate left-to-right. (Exponent <code>^</code> is the exception: it&apos;s right-associative, so an equal <code>^</code> doesn&apos;t pop.)
          </Callout>
        </>
      ),
    },
    {
      title: "Evaluating postfix",
      body: (
        <>
          <p>Read left to right with a stack of <b>numbers</b>:</p>
          <ul>
            <li>Number → push it.</li>
            <li>Operator → pop <b>twice</b>. The <b>first pop is the RIGHT operand</b>, the second pop is the LEFT. Compute, push the result.</li>
            <li>At the end, the single value on the stack is the answer.</li>
          </ul>
          <p>Example <code>7 3 4 + 2 * -</code>: push 7, 3, 4 → <code>+</code>: 3+4 = 7 → stack [7, 7] → push 2 → <code>*</code>: 7·2 = 14 → stack [7, 14] → <code>-</code>: <b>7 − 14 = −7</b>.</p>
          <Callout kind="warn" title="Order matters for − and /">
            For <code>8 2 /</code>: pop 2 (right), pop 8 (left), so it&apos;s 8 / 2 = 4, not 2 / 8.
          </Callout>
        </>
      ),
    },
  ],
  widgets: ["stack", "postfix"],
  mnemonics: [
    { hook: "LIFO = Last In, First Out(of the pan) 🥞", body: <p>The freshest pancake gets eaten first.</p> },
    { hook: "Stronger-or-equal on top? Kick 'em out 👑", body: <p>An incoming operator kicks <b>out</b> anyone on the stack who is <b>as strong or stronger</b> (≥ precedence), then sits on top. Parentheses are walls ( 🧱 ) nobody can push past.</p> },
    { hook: "Right pops first ➡️", body: <p>In postfix eval, the <b>first</b> thing you pop is the <b>right</b> side. &ldquo;First out, right side&rdquo;, like the last pancake being on the right of your plate.</p> },
    { hook: "++top to push, top-- to pop", body: <p>Push: move up, then place. Pop: take, then move down. Like climbing a ladder with groceries.</p> },
  ],
  missing: [
    {
      title: "Why postfix exists at all",
      body: <p>Infix needs precedence rules and parentheses, which are messy for machines. Postfix (a.k.a. <b>Reverse Polish Notation</b>, invented by a Polish logician) can be evaluated in one left-to-right pass with a stack. Old HP calculators used it! This conversion is called the <b>Shunting-yard algorithm</b>, named after train yards.</p>,
    },
    {
      title: "The call stack = recursion's secret",
      body: <p>Every time a function is called, its local variables get pushed onto the <b>call stack</b>. When it returns, they&apos;re popped. Infinite recursion = infinite pushes = <b>stack overflow</b> (yes, that&apos;s where the website name comes from 😄).</p>,
    },
    {
      title: "Balanced parentheses check",
      body: <p>Another classic stack use: read <code>{"{[()]}"}</code>. Push every opener. On a closer, pop and check that it matches. At the end the stack must be empty. Your code editor does this to color your brackets!</p>,
    },
  ],
  traps: [
    <>Popping the operands in the wrong order for <code>-</code> and <code>/</code>. The first pop is the <b>right</b> operand.</>,
    <>In conversion: popping only <b>higher</b> precedence and forgetting <b>equal</b>. <code>A - B + C</code> should be <code>A B - C +</code>, not <code>A B C + -</code>.</>,
    <>Forgetting to pop the remaining operators at the end.</>,
    <>Putting parentheses in the postfix output. They should <b>never</b> appear there.</>,
    <>FE asks you to show the stack contents at certain points (like &ldquo;after reading the 2nd *&rdquo;). Write the stack <b>bottom → top</b> and label it!</>,
    <>Array stack: <code>top</code> starts at <b>-1</b>, not 0 (in the usual COP3502 implementation).</>,
  ],
  example: {
    title: "Worked problem: convert to postfix",
    prompt: <p><b>FE-style:</b> Convert <code>A * (B + C) - D / E</code> to postfix. Show the stack at each step.</p>,
    steps: [
      <p><code>A</code> → output. <b>Out:</b> A · <b>Stack:</b> (empty)</p>,
      <p><code>*</code> → stack is empty, push. <b>Out:</b> A · <b>Stack:</b> *</p>,
      <p><code>(</code> → always push. <b>Stack:</b> * (</p>,
      <p><code>B</code> → output. <code>+</code> → the top is <code>(</code>, a wall, so just push. <code>C</code> → output. <b>Out:</b> A B C · <b>Stack:</b> * ( +</p>,
      <p><code>)</code> → pop until <code>(</code>: output <code>+</code>, discard <code>(</code>. <b>Out:</b> A B C + · <b>Stack:</b> *</p>,
      <p><code>-</code> → top is <code>*</code>, which is higher precedence, so pop it. Stack empty, so push <code>-</code>. <b>Out:</b> A B C + * · <b>Stack:</b> -</p>,
      <p><code>D</code> → output. <code>/</code> → top is <code>-</code> (lower), so just push. <code>E</code> → output. <b>Out:</b> A B C + * D E · <b>Stack:</b> - /</p>,
      <p>End → pop everything: <code>/</code> then <code>-</code>. <b>Answer: A B C + * D E / -</b> 🎉</p>,
    ],
  },
  quiz: [
    {
      q: <>Push 4, push 9, pop, push 2, push 7, pop, pop. What&apos;s left?</>,
      choices: ["[4]", "[9]", "[4, 2]", "[2]"],
      answer: 0,
      why: <>[4] → [4,9] → pop 9 → [4] → [4,2] → [4,2,7] → pop 7 → pop 2 → [4].</>,
    },
    {
      q: <>Evaluate the postfix <code>6 2 3 + -</code></>,
      choices: ["1", "-1", "7", "11"],
      answer: 0,
      why: <>2 + 3 = 5, then 6 − 5 = 1. (Pop 5 as the right side, 6 as the left.)</>,
    },
    {
      q: <>Postfix of <code>A + B * C</code>?</>,
      choices: [<code key="a">A B + C *</code>, <code key="b">A B C * +</code>, <code key="c">A B C + *</code>, <code key="d">+ A * B C</code>],
      answer: 1,
      why: <><code>*</code> binds tighter, so <code>B C *</code> happens first, then <code>+</code>. (The last choice is <i>prefix</i>.)</>,
    },
  ],
  flashcards: [
    { front: "LIFO stands for…", back: "Last In, First Out (stack)." },
    { front: "Infix → postfix: what do you do with an operand?", back: "Send it straight to the output." },
    { front: "Infix → postfix: incoming operator?", back: "Pop operators with ≥ precedence (stop at '('), then push the new one." },
    { front: "Postfix eval: when you see an operator…", back: "Pop right operand, pop left operand, compute left OP right, push result." },
    { front: "Empty array-stack's top index?", back: "-1" },
    { front: "Stack via linked list: push/pop happen where?", back: "At the head (front) → O(1)." },
  ],
  resources: [
    { label: "USFCA: Stack (array) animation", url: "https://www.cs.usfca.edu/~galles/visualization/StackArray.html", kind: "visual" },
    { label: "USFCA: Stack (linked list) animation", url: "https://www.cs.usfca.edu/~galles/visualization/StackLL.html", kind: "visual" },
    { label: "Shunting-yard algorithm (Wikipedia)", url: "https://en.wikipedia.org/wiki/Shunting_yard_algorithm", kind: "read", note: "Has a great step-by-step table and a train-yard picture 🚂" },
    { label: "Programiz: Stack", url: "https://www.programiz.com/dsa/stack", kind: "read" },
    { label: "Infix to postfix with a stack", url: "https://www.youtube.com/results?search_query=infix+to+postfix+using+stack", kind: "video", note: "Look for mycodeschool or Abdul Bari's versions." },
    { label: "FE past exams: Section I-A", url: "https://www.cs.ucf.edu/registration/exm/", kind: "practice", note: "Infix→postfix or postfix eval shows up constantly." },
  ],
  notes: [
    { label: "Stacks", file: "Stacks.pdf" },
    { label: "Stack Implementation", file: "StackImplementation.pdf" },
    { label: "Sample: evalpostfix.c", file: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/evalpostfix.c" },
    { label: "Sample: stackll.c", file: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/stackll.c" },
  ],
};
