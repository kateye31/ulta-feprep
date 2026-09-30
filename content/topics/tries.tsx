import type { Topic } from "@/lib/types";
import { Callout, EmojiRow, Hi } from "@/components/ui";
import Code from "@/components/Code";

export const tries: Topic = {
  slug: "tries",
  title: "Tries",
  short: "Tries",
  emoji: "🌸",
  section: "IB",
  mascot: "pip",
  tagline: "A trie is a tree of letters! Words that start the same share the same branch, like a family of spellings.",
  minutes: 15,
  tldr: [
    <>A <b>trie</b> (say &ldquo;try&rdquo;, from re<b>trie</b>val) stores words letter by letter down a tree.</>,
    <>Each node has up to <b>26 children</b> (one per letter a–z) plus a <b>flag</b> meaning &ldquo;a word ends here&rdquo;.</>,
    <>Words with a shared prefix share the same path: <code>car</code>, <code>cart</code> and <code>cat</code> all start down <code>c → a</code>.</>,
    <>Insert/search take <Hi>O(length of the word)</Hi>, no matter how many words are stored!</>,
    <>Perfect for autocomplete, spell-check, and &ldquo;how many words start with ___?&rdquo; questions.</>,
  ],
  picture: {
    title: "Phone autocomplete",
    scene: <div style={{ fontSize: "1.5rem", lineHeight: 1.6 }}>⌨️ c → a → <b>t</b>🐱<br />↘ r🚗 → t🛒</div>,
    caption: "each keystroke = one step down",
    body: (
      <>
        <p>When you type <b>&ldquo;ca&rdquo;</b> on your phone, it suggests <b>cat, car, cart, cake</b>. Your phone walked down the trie: <code>c</code> → <code>a</code>. Every word below that node is a suggestion!</p>
        <p>Or think of a <b>choose-your-own-adventure book</b> 📖: at each page (node) you pick the next letter, and some pages say &ldquo;THE END ⭐&rdquo; (the word flag). A page can say THE END <i>and</i> still let you continue. <code>car</code> ends there, but <code>cart</code> keeps going!</p>
      </>
    ),
  },
  levels: [
    {
      title: "Letters on the edges",
      body: (
        <>
          <p>The root is empty. Each step down picks a letter. A node doesn&apos;t store its letter; the letter is <b>which child slot</b> you took (0 = a, 1 = b, …, 25 = z).</p>
          <EmojiRow items={[["🌱", "root"], ["c", "child[2]"], ["a", "child[0]"], ["t⭐", "flag = 1"]]} />
        </>
      ),
    },
    {
      title: "The node & insert",
      body: (
        <>
          <Code
            title="trie node + insert"
            src={`
typedef struct trie {
    int isWord;                  // does a word end here?
    struct trie *next[26];       // one slot per letter
} trie;

trie* makeNode() {
    trie *t = malloc(sizeof(trie));
    t->isWord = 0;
    for (int i = 0; i < 26; i++) t->next[i] = NULL;
    return t;
}

void insert(trie *root, char *word) {
    trie *cur = root;
    for (int i = 0; word[i] != '\\0'; i++) {
        int c = word[i] - 'a';                 // 'a'→0, 'b'→1, ...
        if (cur->next[c] == NULL)
            cur->next[c] = makeNode();         // make the path if missing
        cur = cur->next[c];
    }
    cur->isWord = 1;                           // mark the end
}`}
          />
          <p><code>word[i] - &apos;a&apos;</code> works because characters are numbers in C (ASCII): <code>&apos;c&apos; - &apos;a&apos; = 2</code>.</p>
        </>
      ),
    },
    {
      title: "Search vs prefix, and recursive trie questions",
      body: (
        <>
          <p><b>Search &ldquo;car&rdquo;:</b> follow c → a → r. If you fall off (NULL), it&apos;s not there. If you arrive, check <code>isWord</code>.</p>
          <p><b>Prefix &ldquo;ca&rdquo;:</b> same walk, but you only need the path to exist.</p>
          <Callout kind="tip" title="FE loves recursive trie functions">
            &ldquo;Count all words in the trie&rdquo; is the classic: <code>count(node) = node-&gt;isWord + sum of count(child) over all 26 children</code>.
          </Callout>
          <Code
            title="count words (recursive)"
            src={`
int countWords(trie *t) {
    if (t == NULL) return 0;
    int total = t->isWord;
    for (int i = 0; i < 26; i++)
        total += countWords(t->next[i]);
    return total;
}`}
          />
        </>
      ),
    },
  ],
  widgets: ["trie"],
  mnemonics: [
    { hook: "reTRIEval tree 🌸", body: <p>That&apos;s where the name comes from. Tries are for retrieving words fast.</p> },
    { hook: "c − 'a' = which drawer 🗄", body: <p>Subtracting <code>&apos;a&apos;</code> turns a letter into drawer number 0–25.</p> },
    { hook: "⭐ = THE END (but maybe a sequel)", body: <p>The flag marks a word ending, but children can continue into longer words.</p> },
  ],
  missing: [
    {
      title: "Why not just a hash table or BST of words?",
      body: <p>A BST search compares <i>whole strings</i> O(log n) times. A hash table can&apos;t answer &ldquo;which words start with ca?&rdquo;. A trie walks just the letters, in O(L) where L = word length, and prefix questions are free.</p>,
    },
    {
      title: "The memory cost",
      body: <p>Each node has 26 pointers (208 bytes on 64-bit!) and most are NULL. Tries trade memory for speed. Fancy versions (compressed tries / radix trees) squash single-child chains.</p>,
    },
    {
      title: "Extra fields make trie problems easy",
      body: <p>Store <code>int count</code> in each node = how many words pass through it. Then &ldquo;how many words start with this prefix?&rdquo; is just: walk the prefix and read <code>count</code>. COP3502&apos;s sample programs do exactly this (countprefixes.c).</p>,
    },
  ],
  traps: [
    <>Forgetting to set <code>isWord = 1</code> at the end, or confusing &ldquo;path exists&rdquo; with &ldquo;word exists&rdquo;.</>,
    <>Not initializing all 26 children to NULL. malloc gives garbage!</>,
    <>Off-by-one in <code>word[i] - &apos;a&apos;</code>. Uppercase letters need <code>- &apos;A&apos;</code>.</>,
    <>Recursive functions: forgetting to loop over <b>all 26</b> children, not just 2 like a binary tree.</>,
    <>Freeing a trie: free all 26 subtrees first, then the node (post-order!).</>,
  ],
  example: {
    title: "Worked problem: how many nodes?",
    prompt: <p><b>FE-style:</b> Insert <code>to, tea, ted, ten, i, in, inn</code> into an empty trie. How many nodes are there (including the root)? How many have isWord = 1?</p>,
    steps: [
      <p>Root: <b>1</b> node.</p>,
      <p><code>to</code>: t, o → <b>+2</b> (3 total). <code>tea</code>: t exists, then e, a → <b>+2</b> (5).</p>,
      <p><code>ted</code>: t, e exist → d → <b>+1</b> (6). <code>ten</code>: n → <b>+1</b> (7).</p>,
      <p><code>i</code>: <b>+1</b> (8). <code>in</code>: <b>+1</b> (9). <code>inn</code>: <b>+1</b> (10).</p>,
      <p><b>10 nodes</b> total. Flags are on at the ends of all 7 words → <b>7 nodes</b> with isWord = 1. (Note that &ldquo;te&rdquo; is NOT a word here!)</p>,
    ],
  },
  quiz: [
    {
      q: <>Searching for a word of length L in a trie holding n words takes…</>,
      choices: ["O(n)", "O(log n)", "O(L)", "O(n·L)"],
      answer: 2,
      why: <>One step per letter, no matter how many words are stored.</>,
    },
    {
      q: <>The trie has &ldquo;cart&rdquo; but not &ldquo;car&rdquo;. Searching &ldquo;car&rdquo; ends at a node where…</>,
      choices: ["The node doesn't exist", "The node exists but isWord = 0", "isWord = 1", "The root"],
      answer: 1,
      why: <>The path c-a-r exists (it&apos;s part of cart), but no word ends there.</>,
    },
  ],
  flashcards: [
    { front: "What does each trie node store?", back: "An isWord flag + 26 child pointers (one per letter)." },
    { front: "Trie insert/search runtime", back: "O(L), where L = length of the word." },
    { front: "How to convert a lowercase char to 0–25?", back: "c - 'a'" },
    { front: "Word vs prefix in a trie?", back: "Prefix: the path exists. Word: the path exists AND the last node's isWord = 1." },
  ],
  resources: [
    { label: "USFCA: Trie animation", url: "https://www.cs.usfca.edu/~galles/visualization/Trie.html", kind: "visual" },
    { label: "Trie (Wikipedia)", url: "https://en.wikipedia.org/wiki/Trie", kind: "read", note: "Nice diagram of a small trie." },
    { label: "Tries explained", url: "https://www.youtube.com/results?search_query=trie+data+structure+explained", kind: "video" },
    { label: "CS50 Lecture 5 notes (tries section)", url: "https://cs50.harvard.edu/x/2024/notes/5/", kind: "read" },
  ],
  notes: [
    { label: "Trie Notes", file: "TrieNotes.pdf" },
    { label: "Trie sample problems (PDF)", file: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/Tries/TrieSampleProgs.pdf" },
    { label: "Sample: mytrie.c", file: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/mytrie.c" },
  ],
};
