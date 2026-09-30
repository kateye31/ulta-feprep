import type { Topic } from "@/lib/types";
import { Callout, EmojiRow, Hi } from "@/components/ui";
import Code from "@/components/Code";

export const binaryTrees: Topic = {
  slug: "binary-trees",
  title: "Binary Trees & BSTs",
  short: "Binary Trees",
  emoji: "🌳",
  section: "IB",
  mascot: "tofu",
  tagline: "A BST is a game of 'higher or lower'. Every step, you throw away half the tree. Hoot hoot!",
  minutes: 25,
  tldr: [
    <>A <b>binary tree</b>: each node has at most <b>2 children</b> (left and right). The top node is the <b>root</b>, and nodes with no children are <b>leaves</b>.</>,
    <>A <b>Binary Search Tree (BST)</b> adds a rule: <Hi>everything in the left subtree is smaller, everything in the right subtree is bigger</Hi>.</>,
    <>Search, insert and delete take <b>O(h)</b> where h = height. Balanced → O(log n) 🐇. A lopsided &ldquo;stick&rdquo; → O(n) 🐢.</>,
    <>Four traversals: <b>pre</b>-order (root first), <b>in</b>-order (root middle = <b>sorted output!</b>), <b>post</b>-order (root last), level-order.</>,
    <>Tree code is almost always <b>recursive</b>: handle NULL, then trust the recursion on the left and right.</>,
  ],
  picture: {
    title: "A family tree that plays 'higher or lower'",
    scene: (
      <svg viewBox="0 0 260 170" aria-label="small BST">
        {[[130, 25, 70, 80], [130, 25, 190, 80], [70, 80, 35, 140], [70, 80, 105, 140], [190, 80, 225, 140]].map(([a, b, c, d], i) => (
          <line key={i} x1={a} y1={b} x2={c} y2={d} stroke="#6c5a86" strokeWidth="3" />
        ))}
        {[[130, 25, "50"], [70, 80, "30"], [190, 80, "70"], [35, 140, "20"], [105, 140, "40"], [225, 140, "80"]].map(([x, y, t]) => (
          <g key={t as string}>
            <circle cx={x as number} cy={y as number} r="20" fill="#dcebd3" stroke="#3d2b52" strokeWidth="2.5" />
            <text x={x as number} y={(y as number) + 5} textAnchor="middle" fontWeight="800" fontSize="14" fill="#3d2b52">{t}</text>
          </g>
        ))}
      </svg>
    ),
    caption: "left = smaller, right = bigger",
    body: (
      <>
        <p>Remember the game where a friend thinks of a number from 1 to 100 and you guess, and they say &ldquo;higher&rdquo; or &ldquo;lower&rdquo;? If you always guess the middle, you win in about <b>7 guesses</b>. That&apos;s a BST search!</p>
        <p>At each node: <b>smaller → go left, bigger → go right</b>. Each step throws away a whole half of the tree 🌳✂️.</p>
        <p>Tree words are <b>family-tree</b> words: parent, child, sibling, ancestor, descendant. <b>Leaves</b> are at the bottom (yes, the tree is upside-down. Computer scientists don&apos;t go outside much 🙃).</p>
      </>
    ),
  },
  levels: [
    {
      title: "Tree vocabulary",
      body: (
        <>
          <EmojiRow items={[["👑", "root"], ["👨‍👧", "parent/child"], ["🍃", "leaf"], ["📏", "height"]]} />
          <ul style={{ marginTop: 12 }}>
            <li><b>Root</b>: the top node (no parent).</li>
            <li><b>Leaf</b>: a node with 0 children.</li>
            <li><b>Depth of a node</b>: number of edges from the root down to it (root depth = 0).</li>
            <li><b>Height of a tree</b>: the longest root-to-leaf path in edges (a single node has height 0; an empty tree is −1 by convention).</li>
            <li><b>Full</b>: every node has 0 or 2 children. <b>Complete</b>: every level is full except maybe the last, which fills left to right (heaps are complete!). <b>Perfect</b>: all levels completely full.</li>
          </ul>
        </>
      ),
    },
    {
      title: "Traversals (walking the tree)",
      body: (
        <>
          <p>The name tells you <b>when you visit the root</b>:</p>
          <ul>
            <li>👑 <b>Pre</b>-order: <b>Root</b>, Left, Right</li>
            <li>📏 <b>In</b>-order: Left, <b>Root</b>, Right → in a BST, this prints the values <Hi c="matcha">in sorted order</Hi></li>
            <li>🍂 <b>Post</b>-order: Left, Right, <b>Root</b> → used when freeing a tree (kids before parent!)</li>
          </ul>
          <Code
            title="traversals are 3 lines each"
            src={`
void inorder(node *root) {
    if (root == NULL) return;
    inorder(root->left);
    printf("%d ", root->data);     // move this line up → preorder,
    inorder(root->right);          // down → postorder!
}`}
          />
          <p>For the tree pictured: pre = 50 30 20 40 70 80 · in = 20 30 40 50 70 80 · post = 20 40 30 80 70 50.</p>
        </>
      ),
    },
    {
      title: "BST insert, search, delete",
      body: (
        <>
          <Code
            title="insert (returns root, like linked lists)"
            src={`
node* insert(node *root, int val) {
    if (root == NULL) {                  // found the empty spot
        node *n = malloc(sizeof(node));
        n->data = val;
        n->left = n->right = NULL;
        return n;
    }
    if (val < root->data) root->left  = insert(root->left, val);
    else                  root->right = insert(root->right, val);
    return root;
}`}
          />
          <p><b>Deletion has 3 cases</b> 🍂🌿🌳:</p>
          <ol>
            <li><b>Leaf</b>: just remove it.</li>
            <li><b>One child</b>: the child moves up and takes its place.</li>
            <li><b>Two children</b>: replace the value with the <b>max of the left subtree</b> (or the <b>min of the right subtree</b>), then delete that node from down there. It has at most one child, so it&apos;s an easy case!</li>
          </ol>
          <Callout kind="info" title="Which replacement?">
            Both are valid BST deletions. Check the exam question wording, since it usually tells you which one to use.
          </Callout>
        </>
      ),
    },
    {
      title: "FE level: recursive tree functions",
      body: (
        <>
          <p>The FE loves &ldquo;write a recursive function on a binary tree&rdquo;. The recipe is always the same:</p>
          <ol>
            <li>What do I return for an <b>empty</b> tree (NULL)?</li>
            <li>Assume the recursive calls on <code>left</code> and <code>right</code> already give correct answers (<b>trust the fairy</b> 🧚).</li>
            <li>Combine them with the current node.</li>
          </ol>
          <Code
            title="three classics"
            src={`
int countNodes(node *r) {
    if (r == NULL) return 0;
    return 1 + countNodes(r->left) + countNodes(r->right);
}

int height(node *r) {
    if (r == NULL) return -1;
    int L = height(r->left), R = height(r->right);
    return 1 + (L > R ? L : R);
}

int countLeaves(node *r) {
    if (r == NULL) return 0;
    if (r->left == NULL && r->right == NULL) return 1;
    return countLeaves(r->left) + countLeaves(r->right);
}`}
          />
        </>
      ),
    },
  ],
  widgets: ["bst"],
  drills: [["Write your own BST","professor-drills/2-bst.c"]],
  mnemonics: [
    { hook: "PRE = Parent fiRst, POST = Parent laST 👑", body: <p>The prefix tells you when the parent (root) gets visited. IN = parent IN the middle.</p> },
    { hook: "In-order = In order (sorted!) 📏", body: <p>For a BST, in-order traversal literally gives you the values in order. The name is the hint.</p> },
    { hook: "Post-order = Pack up the kids first 🧳", body: <p>To free a tree, free the children before the parent. That&apos;s post-order, like cleaning a house room by room before selling it.</p> },
    { hook: "Trust the fairy 🧚", body: <p>In recursion, assume the call on the smaller subtree magically works. Just handle the current node plus the NULL case.</p> },
  ],
  missing: [
    {
      title: "Why log n? (the number-guessing math)",
      body: <p>A perfectly balanced tree with n nodes has about <b>log₂ n</b> levels, because each level doubles the number of nodes (1, 2, 4, 8…). 1,000,000 nodes → only ~20 levels! That&apos;s why balanced trees are so fast. log₂ n = &ldquo;how many times can I cut n in half before I reach 1?&rdquo;</p>,
    },
    {
      title: "Worst case: the sad stick tree",
      body: <p>Insert 1, 2, 3, 4, 5 in order into a BST and you get a stick where every node only has a right child. That&apos;s basically a linked list → O(n) search. <b>AVL trees</b> fix this by auto-balancing (next topic!).</p>,
    },
    {
      title: "Rebuilding a tree from traversals",
      body: <p>Given <b>preorder + inorder</b>, you can rebuild the unique tree: the first preorder item is the root, and finding it in the inorder list splits the rest into left and right. For a BST, the preorder alone is enough, since inorder is just the sorted list!</p>,
    },
    {
      title: "Level-order uses a queue",
      body: <p>To print row by row: put the root in a queue. Repeatedly dequeue a node, print it, and enqueue its children. Stacks and queues show up inside trees too!</p>,
    },
  ],
  traps: [
    <>Forgetting the <code>NULL</code> base case → segfault on the first leaf&apos;s children.</>,
    <>Insert functions must <b>return the root</b> and reassign children: <code>root-&gt;left = insert(root-&gt;left, v)</code>.</>,
    <>Height convention: this course uses <b>height(NULL) = −1</b> and height(leaf) = 0. Read the question&apos;s definition!</>,
    <>Two-child delete: the replacement is the max of the <b>left</b> subtree (rightmost node there), NOT just the left child.</>,
    <>Traversal questions: write the output carefully, one node at a time. Most errors are just skipping a node.</>,
  ],
  example: {
    title: "Worked problem: insert and traverse",
    prompt: <p><b>FE-style:</b> Insert 40, 25, 60, 10, 30, 50, 70, 35 into an empty BST. Give the preorder and postorder traversals. Then delete 25 (replace with max of left subtree).</p>,
    steps: [
      <p>40 is the root. 25 &lt; 40 → left. 60 → right. 10 → left of 25. 30 → right of 25. 50 → left of 60. 70 → right of 60. 35 → 35 &lt; 40 → left (25); 35 &gt; 25 → right (30); 35 &gt; 30 → <b>right of 30</b>.</p>,
      <p><b>Preorder</b> (root, L, R): 40 25 10 30 35 60 50 70</p>,
      <p><b>Postorder</b> (L, R, root): 10 35 30 25 50 70 60 40</p>,
      <p>Delete 25: it has two kids (10 and 30). The max of its left subtree is <b>10</b> (the left subtree is just 10).</p>,
      <p>Replace 25 with 10 and remove the old 10 leaf. Now 10 is the left child of 40, with only a right child: 30 (which still has 35). ✅ Try it in the BST Garden to check!</p>,
    ],
  },
  quiz: [
    {
      q: <>Which traversal of a BST prints the values in sorted order?</>,
      choices: ["Preorder", "Inorder", "Postorder", "Level order"],
      answer: 1,
      why: <>Left (smaller stuff), root, right (bigger stuff) → sorted.</>,
    },
    {
      q: <>Worst-case search time in an (unbalanced) BST with n nodes?</>,
      choices: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      answer: 2,
      why: <>If you insert sorted data, the tree becomes a stick (height n−1).</>,
    },
    {
      q: <>Preorder is <code>8 3 1 6 10 14</code> for a BST. What&apos;s the root&apos;s right child?</>,
      choices: ["3", "6", "10", "14"],
      answer: 2,
      why: <>Root = 8. Everything &gt; 8 (10, 14) is in the right subtree, and the first of those in preorder (10) is its root.</>,
    },
    {
      q: <>To free every node in a tree, which traversal order is safe?</>,
      choices: ["Preorder", "Inorder", "Postorder", "Any order"],
      answer: 2,
      why: <>Free the children first, then the parent. Freeing the parent first loses the pointers to the children.</>,
    },
  ],
  flashcards: [
    { front: "BST property", back: "Left subtree values < node < right subtree values." },
    { front: "Preorder / Inorder / Postorder", back: "Root-L-R / L-Root-R / L-R-Root" },
    { front: "Height of an empty tree (COP3502 convention)?", back: "-1 (a single node has height 0)." },
    { front: "BST delete, node with 2 children?", back: "Replace with max of left subtree (or min of right), then delete that node." },
    { front: "Search time in a balanced BST?", back: "O(log n)" },
    { front: "Max nodes in a binary tree of height h?", back: "2^(h+1) − 1" },
  ],
  resources: [
    { label: "USFCA: BST animation", url: "https://www.cs.usfca.edu/~galles/visualization/BST.html", kind: "visual", note: "Insert, delete and find, with every comparison animated." },
    { label: "VisuAlgo: BST", url: "https://visualgo.net/en/bst", kind: "visual", note: "Also shows traversals and has an AVL mode." },
    { label: "Programiz: Tree traversals", url: "https://www.programiz.com/dsa/tree-traversal", kind: "read" },
    { label: "Programiz: Binary search tree", url: "https://www.programiz.com/dsa/binary-search-tree", kind: "read" },
    { label: "Binary tree traversals (video)", url: "https://www.youtube.com/results?search_query=binary+tree+traversal+preorder+inorder+postorder", kind: "video", note: "Try the 'flag trick' videos: draw a flag on each node's left/bottom/right side." },
    { label: "Binary tree practice problems (COP3502)", url: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/lec/BinaryTrees-PracticeProblems.pdf", kind: "practice" },
  ],
  notes: [
    { label: "Binary Trees", file: "BinaryTrees-1.pdf" },
    { label: "BST Insertion", file: "BinaryTrees-2.pdf" },
    { label: "BST Deletion", file: "BinaryTrees-3.pdf" },
    { label: "Sample: bintree.c", file: "https://www.cs.ucf.edu/courses/cop3502/fall2025/material/sampleprogs/bintree.c" },
  ],
};
