import type { Topic } from "@/lib/types";
import { Callout, EmojiRow, Hi } from "@/components/ui";
import Code from "@/components/Code";

export const hashTables: Topic = {
  slug: "hash-tables",
  title: "Hash Tables",
  short: "Hash Tables",
  emoji: "🧥",
  section: "IB",
  mascot: "pip",
  tagline: "A hash table is a coat check! Give it your coat, get a ticket number, and find your coat instantly later.",
  minutes: 20,
  tldr: [
    <>A <b>hash function</b> turns a key into an array index: <code>h(key) = something % tableSize</code>.</>,
    <>Store the item at that index. To find it later, compute <code>h(key)</code> again and look right there. <Hi>O(1) on average!</Hi></>,
    <>Two keys landing at the same index is a <b>collision</b>. Collisions are normal and unavoidable.</>,
    <>Fixes: <b>linear probing</b> (try the next spot, +1, +2…), <b>quadratic probing</b> (+1², +2², +3²…), or <b>separate chaining</b> (a linked list at each index).</>,
    <><b>Load factor</b> α = items / table size. Keep it low (probing: ≤ ½ is a common rule) and use a <b>prime</b> table size.</>,
  ],
  picture: {
    title: "The coat check (and the library)",
    scene: <EmojiRow items={[["🧥", "your coat (key)"], ["🎟", "ticket = h(key)"], ["🪝", "hook #7"]]} />,
    caption: "compute where it goes, go straight there",
    body: (
      <>
        <p>A <b>coat check</b>: they take your coat, hang it on hook #7, and give you ticket #7. Later, they don&apos;t search every hook. They go <b>straight to #7</b>. That&apos;s O(1).</p>
        <p>The hash function is how they pick the hook. Maybe it&apos;s &ldquo;the last digit of your phone number&rdquo;. Two people with the same last digit? <b>Collision!</b> The attendant has a rule for where to put the second coat, like the next hook over (linear probing) or a hanger clipped to the first coat (chaining).</p>
      </>
    ),
  },
  levels: [
    {
      title: "Keys → indices",
      body: (
        <>
          <p>Table size 10, <code>h(k) = k % 10</code>. Insert 23 → index 3. Insert 58 → index 8. Look up 58: compute 58 % 10 = 8, check index 8. Found it!</p>
          <p>For strings, first turn the letters into a number (for example, add up the characters&apos; values, or better, treat them as digits in base 31), then take <code>% tableSize</code>.</p>
        </>
      ),
    },
    {
      title: "Open addressing: linear & quadratic probing",
      body: (
        <>
          <p>When spot <code>h</code> is taken, try other spots in a fixed pattern (on the i-th retry):</p>
          <ul>
            <li><b>Linear:</b> <code>(h + i) % m</code> → h, h+1, h+2, h+3… 🚶</li>
            <li><b>Quadratic:</b> <code>(h + i²) % m</code> → h, h+1, h+4, h+9… 🦘</li>
          </ul>
          <p>Linear probing causes <b>primary clustering</b>: occupied spots clump together into long runs, and every new key landing in the run makes it longer. Quadratic probing jumps farther, which spreads keys out.</p>
          <Callout kind="warn" title="Quadratic's catch">
            Quadratic probing might not find an empty spot even when one exists! It&apos;s guaranteed to work if the table size is <b>prime</b> and the table is <b>at most half full</b>.
          </Callout>
        </>
      ),
    },
    {
      title: "Separate chaining",
      body: (
        <>
          <p>Each index holds a <b>linked list</b>. Colliding keys just join the list. The table never &ldquo;fills up&rdquo;, but long chains get slow.</p>
          <Code
            title="chaining insert"
            src={`
typedef struct node { int key; struct node *next; } node;
node *table[SIZE];                 // array of list heads (all NULL)

void insert(int key) {
    int idx = key % SIZE;
    node *n = malloc(sizeof(node));
    n->key = key;
    n->next = table[idx];          // insert at front of that chain: O(1)
    table[idx] = n;
}`}
          />
          <p>Average chain length = load factor α. With a decent hash, search is O(1 + α).</p>
        </>
      ),
    },
    {
      title: "Deleting & rehashing",
      body: (
        <>
          <p><b>Deleting with probing is sneaky.</b> If you just empty a spot, later searches may stop there too early and miss keys that probed past it. The fix is to mark it <b>&ldquo;deleted&rdquo;</b> (a tombstone 🪦) instead of &ldquo;empty&rdquo;.</p>
          <p><b>Rehashing:</b> when the table gets too full, make a bigger table (about double, then round up to a prime) and <b>re-insert every key</b>, since <code>% m</code> changed.</p>
        </>
      ),
    },
  ],
  widgets: ["hash"],
  mnemonics: [
    { hook: "Linear = next door, Quadratic = hop-scotch 🦘", body: <p>Linear knocks on the next door (+1). Quadratic hops +1, +4, +9, like hop-scotch squares getting farther apart.</p> },
    { hook: "Prime size, half full, happy table 🌸", body: <p>Prime table size + load factor ≤ ½ means quadratic probing always finds a spot.</p> },
    { hook: "Chaining = charm bracelet 📿", body: <p>Each hook holds a chain of charms (a linked list). Collisions just add another charm.</p> },
    { hook: "Tombstones, not holes 🪦", body: <p>Deleted spots in probing get a tombstone so searches keep going past them.</p> },
  ],
  missing: [
    {
      title: "What makes a hash function good?",
      body: <p>(1) It&apos;s fast. (2) It spreads keys evenly. (3) It&apos;s deterministic (same key → same index, every time). A bad one, like &ldquo;always return 0&rdquo;, turns the table into one giant linked list.</p>,
    },
    {
      title: "Hash tables vs BSTs",
      body: <p>A hash table gives O(1) average lookup but <b>no order</b>: you can&apos;t easily list the keys sorted or find &ldquo;the next bigger key&rdquo;. A balanced BST is O(log n) but keeps order. Pick based on what you need!</p>,
    },
    {
      title: "You use these every day",
      body: <p>Python dictionaries, JavaScript objects, database indexes, caches, password storage (with special crypto hashes), and spell-checkers are all hash tables under the hood.</p>,
    },
    {
      title: "The birthday paradox",
      body: <p>With just 23 people, there&apos;s a 50% chance two share a birthday (365 &ldquo;slots&rdquo;!). That&apos;s why collisions happen way sooner than your gut says, and why collision handling isn&apos;t optional.</p>,
    },
  ],
  traps: [
    <>Quadratic probing: the i-th retry is <code>(h + i²) % m</code> from the <b>original</b> h, not from the previous spot plus i².</>,
    <>Forgetting to wrap around with <code>% m</code> at the end of the table.</>,
    <>Tracing questions: insert in the <b>exact given order</b>. The final table depends on it!</>,
    <>Computing <code>h(k)</code> wrong for negative numbers in C (<code>-3 % 10</code> is <code>-3</code> in C!). Exam keys are usually positive, though.</>,
    <>Saying hash table lookup is O(1) <b>worst case</b>. It&apos;s O(1) <b>average</b>. The worst case is O(n) when everything collides.</>,
  ],
  example: {
    title: "Worked problem: linear vs quadratic",
    prompt: <p><b>FE-style:</b> Table size 10, <code>h(k) = k % 10</code>. Insert 23, 43, 13, 27 with (a) linear probing and (b) quadratic probing. Where does each key end up?</p>,
    steps: [
      <p>23 → h = 3. Empty → <b>index 3</b> (both methods).</p>,
      <p>43 → h = 3 (taken). Linear: try 4 → <b>index 4</b>. Quadratic: 3 + 1² = 4 → <b>index 4</b>. Same so far!</p>,
      <p>13 → h = 3 (taken). <b>Linear:</b> 4 (taken) → 5 → <b>index 5</b>. <b>Quadratic:</b> 3+1 = 4 (taken) → 3+4 = 7 → <b>index 7</b>.</p>,
      <p>27 → h = 7. <b>Linear:</b> 7 is free → <b>index 7</b>. <b>Quadratic:</b> 7 is taken by 13! → 7+1 = <b>index 8</b>.</p>,
      <p><b>Linear:</b> 3:23, 4:43, 5:13, 7:27. <b>Quadratic:</b> 3:23, 4:43, 7:13, 8:27. ✅ Check it in the Coat Check widget!</p>,
    ],
  },
  quiz: [
    {
      q: <>Table size 7, <code>h(k) = k % 7</code>, linear probing. Insert 14, 21, 8. Where does 8 go?</>,
      choices: ["index 1", "index 2", "index 0", "index 3"],
      answer: 1,
      why: <>14 → 0. 21 → 0 is taken → 1. 8 → 8 % 7 = 1 is taken → 2.</>,
    },
    {
      q: <>What&apos;s the main problem with linear probing?</>,
      choices: ["It can't handle collisions", "Primary clustering: long runs of filled slots", "It needs linked lists", "It only works with strings"],
      answer: 1,
      why: <>Filled spots clump together, and any key hashing into a clump makes it longer.</>,
    },
    {
      q: <>Average-case search time in a hash table with a good hash function and low load factor?</>,
      choices: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      answer: 0,
      why: <>That&apos;s the whole point! (The worst case is still O(n).)</>,
    },
  ],
  flashcards: [
    { front: "What is a collision?", back: "Two different keys hash to the same index." },
    { front: "Linear probing formula (i-th try)", back: "(h(k) + i) % m" },
    { front: "Quadratic probing formula (i-th try)", back: "(h(k) + i²) % m" },
    { front: "Separate chaining", back: "Each table slot holds a linked list of all keys that hash there." },
    { front: "Load factor α", back: "(number of items) / (table size)" },
    { front: "When is quadratic probing guaranteed to find a spot?", back: "Table size is prime AND the table is at most half full." },
  ],
  resources: [
    { label: "USFCA: Open addressing (linear/quadratic)", url: "https://www.cs.usfca.edu/~galles/visualization/ClosedHash.html", kind: "visual", note: "Pick linear or quadratic probing and insert your own keys." },
    { label: "USFCA: Separate chaining", url: "https://www.cs.usfca.edu/~galles/visualization/OpenHash.html", kind: "visual" },
    { label: "VisuAlgo: Hash Table", url: "https://visualgo.net/en/hashtable", kind: "visual" },
    { label: "Programiz: Hash table", url: "https://www.programiz.com/dsa/hash-table", kind: "read" },
    { label: "CS50 Lecture 5 notes (hash tables section)", url: "https://cs50.harvard.edu/x/2024/notes/5/", kind: "read" },
    { label: "Hash tables explained", url: "https://www.youtube.com/results?search_query=hash+tables+linear+quadratic+probing+explained", kind: "video" },
  ],
  notes: [
    { label: "Hash Tables", file: "HashTables.pdf" },
    { label: "Sample: htablelinear.c", file: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/htablelinear.c" },
    { label: "Sample: hashquadratic.c", file: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/hashquadratic.c" },
  ],
};
