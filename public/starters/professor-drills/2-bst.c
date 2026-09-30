// 🌳 PROFESSOR'S DRILL #2: write your OWN binary search tree
//
// Every function here is RECURSIVE. The recipe is always:
//   1. What do I return for an empty tree (NULL)?
//   2. Trust the recursive calls on root->left and root->right.
//   3. Combine them with the current node.
//
// Fill in the TODOs, then `run`. Memory check is on: freeTree must free everything!

#include <stdio.h>
#include <stdlib.h>

typedef struct bstnode {
    int data;
    struct bstnode *left, *right;
} bstnode;

// Insert val (no duplicates in our tests). Return the root.
bstnode *insert(bstnode *root, int val) {
    // TODO
    return root;
}

// 1 if val is in the tree, 0 if not. Use the BST property: only go ONE way!
int contains(bstnode *root, int val) {
    // TODO
    return 0;
}

// How many nodes?
int countNodes(bstnode *root) {
    // TODO
    return 0;
}

// Height: NULL has height -1, a single node has height 0.
int height(bstnode *root) {
    // TODO
    return 0;
}

// How many leaves (nodes with no children)?
int countLeaves(bstnode *root) {
    // TODO
    return 0;
}

// Sum of every value.
int sumTree(bstnode *root) {
    // TODO
    return 0;
}

// Smallest value (assume the tree is not empty).
int findMin(bstnode *root) {
    // TODO
    return 0;
}

// Write the values IN-ORDER into out[], using *k as the next free index.
// (Call it like: int k = 0; inorder(root, out, &k);)
void inorder(bstnode *root, int *out, int *k) {
    // TODO
}

// Same, but PRE-order (root, left, right).
void preorder(bstnode *root, int *out, int *k) {
    // TODO
}

// Delete val and return the new root. Remember the 3 cases:
//   leaf → just free it · one child → child moves up
//   two children → copy in the MAX of the LEFT subtree, then delete that value from the left subtree
bstnode *deleteNode(bstnode *root, int val) {
    // TODO
    return root;
}

// Free the whole tree. Which traversal order is safe? 🍂
void freeTree(bstnode *root) {
    // TODO
}


// ─────────────── tests ───────────────
int passed = 0, total = 0;

void check(const char *name, int ok) {
    total++;
    if (ok) passed++;
    printf("%s %s\n", ok ? "✅" : "❌", name);
}

int sameArr(const int *got, int gotN, const int *want, int n) {
    if (gotN != n) return 0;
    for (int i = 0; i < n; i++)
        if (got[i] != want[i]) return 0;
    return 1;
}

int main(void) {
    int vals[] = {50, 30, 70, 20, 40, 60, 80, 35};
    bstnode *root = NULL;
    for (int i = 0; i < 8; i++) root = insert(root, vals[i]);

    int out[20], k;

    k = 0; inorder(root, out, &k);
    check("inorder is sorted: 20 30 35 40 50 60 70 80", sameArr(out, k, (int[]){20, 30, 35, 40, 50, 60, 70, 80}, 8));
    k = 0; preorder(root, out, &k);
    check("preorder: 50 30 20 40 35 70 60 80", sameArr(out, k, (int[]){50, 30, 20, 40, 35, 70, 60, 80}, 8));

    check("contains(35) == 1", contains(root, 35) == 1);
    check("contains(36) == 0", contains(root, 36) == 0);
    check("countNodes == 8", countNodes(root) == 8);
    check("height == 3", height(root) == 3);
    check("height(NULL) == -1", height(NULL) == -1);
    check("countLeaves == 4 (20, 35, 60, 80)", countLeaves(root) == 4);
    check("sumTree == 385", sumTree(root) == 385);
    check("findMin == 20", findMin(root) == 20);

    root = deleteNode(root, 30);   // two children → replaced by 20
    k = 0; preorder(root, out, &k);
    check("delete 30 → preorder 50 20 40 35 70 60 80", sameArr(out, k, (int[]){50, 20, 40, 35, 70, 60, 80}, 7));

    root = deleteNode(root, 50);   // the root! replaced by 40
    k = 0; preorder(root, out, &k);
    check("delete 50 → preorder 40 20 35 70 60 80", sameArr(out, k, (int[]){40, 20, 35, 70, 60, 80}, 6));

    root = deleteNode(root, 80);   // a leaf
    k = 0; inorder(root, out, &k);
    check("delete 80 (leaf) → inorder 20 35 40 60 70", sameArr(out, k, (int[]){20, 35, 40, 60, 70}, 5));

    freeTree(root);
    printf("\n%d / %d passed %s\n", passed, total, passed == total ? "🎉 Stamp it!" : "🌱 keep going, you've got this");
    return 0;
}
