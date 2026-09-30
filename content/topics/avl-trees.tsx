import type { Topic } from "@/lib/types";
import { Callout, EmojiRow, Hi } from "@/components/ui";
import Code from "@/components/Code";

export const avlTrees: Topic = {
  slug: "avl-trees",
  title: "AVL Trees",
  short: "AVL Trees",
  emoji: "⚖️",
  section: "IB",
  mascot: "tofu",
  tagline: "An AVL tree is a BST that does yoga. The moment it leans too far, it rotates back into balance.",
  minutes: 22,
  tldr: [
    <>An <b>AVL tree</b> is a BST that stays <b>balanced</b>: at every node, the heights of the left and right subtrees differ by <Hi>at most 1</Hi>.</>,
    <><b>Balance factor</b> = height(left) − height(right). It must be −1, 0, or +1 everywhere.</>,
    <>After an insert, walk back up from the new node. The <b>first</b> node that&apos;s out of balance gets fixed with a <b>rotation</b>.</>,
    <>4 cases: <b>LL</b> and <b>RR</b> (single rotation), <b>LR</b> and <b>RL</b> (double rotation).</>,
    <>Result: height is always O(log n), so search/insert/delete are guaranteed <b>O(log n)</b>. No more sad stick trees.</>,
  ],
  picture: {
    title: "A mobile hanging over a crib",
    scene: <EmojiRow items={[["🪁", "tilted!"], ["🔄", "rotate"], ["⚖️", "balanced"]]} />,
    caption: "rebalance when one side gets heavy",
    body: (
      <>
        <p>Picture a baby mobile ⭐🌙☁️. If you hang too many toys on one side, it tilts. You fix it by <b>moving the hanging point</b> so the middle toy becomes the new center.</p>
        <p>That&apos;s a rotation: the <b>middle value</b> of the three nodes involved gets promoted to be the parent, and the other two become its kids.</p>
        <p>Or think of a seesaw 🛝: a difference of 1 is fine (kids aren&apos;t exactly the same weight), but a difference of 2 is too wobbly!</p>
      </>
    ),
  },
  levels: [
    {
      title: "Heights & balance factors",
      body: (
        <>
          <p>Height of a leaf = 0, height of NULL = −1. For every node, compute <b>bf = h(left) − h(right)</b>.</p>
          <ul>
            <li>bf = +1 → leans left a little (OK ✅)</li>
            <li>bf = 0 → perfectly balanced (OK ✅)</li>
            <li>bf = −1 → leans right a little (OK ✅)</li>
            <li>bf = +2 or −2 → <b>unbalanced</b>! 🚨 Rotate.</li>
          </ul>
          <p>Insert 10, 20, 30 into a plain BST and you get a stick. At node 10: h(left) = −1, h(right) = 1 → bf = −2. Unbalanced!</p>
        </>
      ),
    },
    {
      title: "The 4 cases (follow the path from the unbalanced node)",
      body: (
        <>
          <p>Stand at the unbalanced node. Take <b>two steps</b> toward where the new node was inserted. Those two directions name the case:</p>
          <div className="table-scroll">
            <table className="cozy">
              <thead>
                <tr><th>Path</th><th>Case</th><th>Fix</th></tr>
              </thead>
              <tbody>
                <tr><td>left, left</td><td>LL</td><td>single <b>right</b> rotation</td></tr>
                <tr><td>right, right</td><td>RR</td><td>single <b>left</b> rotation</td></tr>
                <tr><td>left, right</td><td>LR</td><td>double: left-rotate the child, then right-rotate the node</td></tr>
                <tr><td>right, left</td><td>RL</td><td>double: right-rotate the child, then left-rotate the node</td></tr>
              </tbody>
            </table>
          </div>
          <Callout kind="tip" title="Straight line → 1 rotation. Zig-zag → 2 rotations.">
            LL/RR look like a straight diagonal line 📏. LR/RL look like a zig-zag ⚡.
          </Callout>
        </>
      ),
    },
    {
      title: "The 'sort 3 nodes' shortcut (restructuring)",
      body: (
        <>
          <p>Instead of memorizing 4 rotations, use one method for all of them. Take the 3 nodes on the path: the <b>unbalanced node</b>, its <b>child</b>, and its <b>grandchild</b>.</p>
          <ol>
            <li>Name them <b>A &lt; B &lt; C</b> by value.</li>
            <li><b>B</b> becomes the new parent of this subtree, with <b>A</b> as its left child and <b>C</b> as its right.</li>
            <li>The (up to 4) subtrees hanging off them, called T0, T1, T2, T3 from left to right, reattach in the same left-to-right order under A and C.</li>
          </ol>
          <p>Because a BST&apos;s in-order is sorted, keeping everything in left-to-right order guarantees it&apos;s still a valid BST 🎉</p>
          <EmojiRow items={[["A", "smallest"], ["B", "middle → root!"], ["C", "biggest"]]} />
        </>
      ),
    },
    {
      title: "Deletion & code",
      body: (
        <>
          <p><b>Delete</b> like a normal BST, then walk up checking balance. Unlike insertion, a deletion might need <b>several rotations</b> on the way up (each fix can shorten a subtree and unbalance an ancestor).</p>
          <Code
            title="single right rotation (LL case)"
            src={`
node* rotateRight(node *c) {
    node *b = c->left;       // b moves up
    c->left = b->right;      // b's right subtree (T2) moves across
    b->right = c;            // c becomes b's right child
    updateHeight(c);         // c first (it's lower now)
    updateHeight(b);
    return b;                // new root of this subtree
}`}
          />
          <p>On the FE you&apos;re usually asked to <b>draw</b> the tree after a series of inserts, not to write rotation code. Practice drawing!</p>
        </>
      ),
    },
  ],
  widgets: ["avl"],
  mnemonics: [
    { hook: "Straight = single, zig-zag = double ⚡", body: <p>If the path from the unbalanced node goes the same direction twice, do one rotation. If it bends, do two.</p> },
    { hook: "The middle child gets the crown 👑", body: <p>In any rotation, the node with the <b>middle value</b> of the three ends up on top.</p> },
    { hook: "AVL = Always Very Level ⚖️", body: <p>(It&apos;s really named after its inventors, <b>A</b>delson-<b>V</b>elsky and <b>L</b>andis, but this is easier to remember.)</p> },
    { hook: "Rotate AWAY from the heavy side", body: <p>Left-heavy (LL) → rotate <b>right</b>. Right-heavy (RR) → rotate <b>left</b>. Like tipping a seesaw back.</p> },
  ],
  missing: [
    {
      title: "Why bother balancing?",
      body: <p>A BST is only fast if it&apos;s bushy. Real data often arrives sorted (timestamps, IDs), which makes a plain BST degrade into a list. AVL guarantees height ≤ ~1.44·log₂n, so worst case O(log n) for everything.</p>,
    },
    {
      title: "Rotations don't break the BST rule",
      body: <p>A rotation just changes who&apos;s the parent. The in-order (sorted) sequence stays exactly the same. You can verify any rotation you draw by checking that the in-order traversal didn&apos;t change!</p>,
    },
    {
      title: "Cousins: Red-Black trees",
      body: <p>Real libraries (Java&apos;s TreeMap, C++&apos;s std::map) often use <b>red-black trees</b>, a looser kind of balance with fewer rotations. Same idea: keep the tree bushy.</p>,
    },
    {
      title: "Only fix the FIRST unbalanced node (on insert)",
      body: <p>After an insert, walk up from the new node. Fix the lowest unbalanced ancestor, and the whole tree is balanced again. You never need a second rotation for an insert.</p>,
    },
  ],
  traps: [
    <>Using the wrong height convention. Leaf = 0 and NULL = −1 (or leaf = 1 and NULL = 0). Either works as long as you&apos;re consistent, since differences are the same.</>,
    <>Rotating at the wrong node. Fix the <b>lowest</b> unbalanced node on the path from the inserted node up to the root.</>,
    <>Losing a subtree during rotation. The middle node&apos;s old children (T1, T2) must be reattached!</>,
    <>Doing an LR case with a single rotation. It won&apos;t balance. You need two.</>,
    <>Drawing questions: after each insert, re-check the balance before inserting the next value.</>,
  ],
  example: {
    title: "Worked problem: an LR insertion",
    prompt: <p><b>FE-style:</b> Starting with the AVL tree 50 (left: 30 with children 20 and 40; right: 70), insert <b>35</b>. Draw the result.</p>,
    steps: [
      <p>Normal BST insert: 35 &lt; 50 → left; 35 &gt; 30 → right (40); 35 &lt; 40 → <b>left child of 40</b>.</p>,
      <p>Walk up checking bf. 40: h(L) = 0, h(R) = −1 → +1 ✅. 30: h(20) = 0, h(40) = 1 → −1 ✅. <b>50: h(30) = 2, h(70) = 0 → +2 🚨</b></p>,
      <p>Path from 50 toward 35: <b>left</b> (to 30), then <b>right</b> (to 40). Zig-zag → <b>LR case</b>, double rotation.</p>,
      <p>Sort-3 method: A = 30, B = 40, C = 50. <b>40 becomes the root</b> of this subtree, with 30 as its left child and 50 as its right.</p>,
      <p>Reattach the subtrees in order: T0 = 20 (under 30, left), T1 = 35 (under 30, right), T2 = empty (under 50, left), T3 = 70 (under 50, right).</p>,
      <p><b>Result:</b> 40 → (30 → 20, 35) and (50 → —, 70). All bfs are within ±1 ✅. In-order is still 20 30 35 40 50 70.</p>,
    ],
  },
  quiz: [
    {
      q: <>Insert 3, 2, 1 into an empty AVL tree. What&apos;s the root?</>,
      choices: ["3", "2", "1", "It's unbalanced, so no root"],
      answer: 1,
      why: <>LL case at 3 → single right rotation → 2 becomes the root with 1 and 3 as children.</>,
    },
    {
      q: <>A node has a left subtree of height 3 and a right subtree of height 1. Is it AVL-balanced?</>,
      choices: ["Yes", "No, the difference is 2"],
      answer: 1,
      why: <>The difference must be at most 1.</>,
    },
    {
      q: <>The path from the unbalanced node to the new node goes right, then left. Which case is it?</>,
      choices: ["RR, single left rotation", "RL, double rotation", "LR, double rotation", "LL, single right rotation"],
      answer: 1,
      why: <>It&apos;s a zig-zag, so a double rotation: right-rotate the child, then left-rotate the node.</>,
    },
  ],
  flashcards: [
    { front: "AVL balance rule", back: "At every node, |height(left) − height(right)| ≤ 1." },
    { front: "LL case fix?", back: "Single right rotation at the unbalanced node." },
    { front: "RL case fix?", back: "Right-rotate the child, then left-rotate the unbalanced node (double rotation)." },
    { front: "The 'sort 3 nodes' trick", back: "Name the unbalanced node/child/grandchild A<B<C. B becomes the parent; A left, C right; reattach T0–T3 in order." },
    { front: "AVL search/insert/delete Big-O", back: "O(log n) guaranteed." },
  ],
  resources: [
    { label: "USFCA: AVL tree animation", url: "https://www.cs.usfca.edu/~galles/visualization/AVLtree.html", kind: "visual", note: "The best way to check your drawings." },
    { label: "VisuAlgo: BST/AVL", url: "https://visualgo.net/en/bst", kind: "visual", note: "Switch the mode to AVL at the top." },
    { label: "Abdul Bari: AVL rotations", url: "https://www.youtube.com/results?search_query=abdul+bari+avl+tree+rotations", kind: "video", note: "A legendary whiteboard explanation. Calm and clear." },
    { label: "Programiz: AVL tree", url: "https://www.programiz.com/dsa/avl-tree", kind: "read" },
    { label: "AVL tree (Wikipedia)", url: "https://en.wikipedia.org/wiki/AVL_tree", kind: "read", note: "Has animated GIFs of every rotation case." },
  ],
  notes: [
    { label: "AVL Trees: Insertion", file: "AVLTrees-Ins-1.pdf" },
    { label: "AVL Trees: Deletion", file: "AVLTrees-Del-2.pdf" },
    { label: "Sample: avltree.c", file: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/avltree.c" },
  ],
};
