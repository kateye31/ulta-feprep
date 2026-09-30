// 🚂 PROFESSOR'S DRILL #1: write your OWN linked list
//
// Rules: no notes, no AI, no peeking at the topic page.
// Fill in every TODO, then type `run` in the terminal (or press Ctrl+Enter).
// Each test prints ✅ or ❌. Memory check is ON, so leaks show up too!
//
// Stuck? Draw boxes and arrows on paper first. Then write the code.

#include <stdio.h>
#include <stdlib.h>

typedef struct node {
    int data;
    struct node *next;
} node;

// Make a new node holding val (its next should be NULL). Return it.
node *makeNode(int val) {
    // TODO
    return NULL;
}

// Insert val at the FRONT of the list. Return the new head.
node *insertFront(node *head, int val) {
    // TODO
    return head;
}

// Insert val at the BACK. Return the head (careful: it changes if the list was empty!).
node *insertBack(node *head, int val) {
    // TODO
    return head;
}

// Insert val so the list stays sorted, smallest first. Return the head.
node *insertSorted(node *head, int val) {
    // TODO
    return head;
}

// Return how many nodes are in the list. Challenge: do it RECURSIVELY.
int length(node *head) {
    // TODO
    return 0;
}

// Return the sum of every value in the list.
int sum(node *head) {
    // TODO
    return 0;
}

// Delete the FIRST node holding val (if there is one). free() it! Return the head.
node *deleteVal(node *head, int val) {
    // TODO
    return head;
}

// Free every node. (Save next BEFORE you free!)
void freeList(node *head) {
    // TODO
}


// ─────────────── tests: don't edit below (unless you want to add more!) ───────────────
int passed = 0, total = 0;

void check(const char *name, int ok) {
    total++;
    if (ok) passed++;
    printf("%s %s\n", ok ? "✅" : "❌", name);
}

int same(node *h, const int *want, int n) {
    for (int i = 0; i < n; i++, h = h->next)
        if (h == NULL || h->data != want[i]) return 0;
    return h == NULL;
}

int main(void) {
    node *one = makeNode(5);
    check("makeNode(5) holds 5 and next == NULL", one != NULL && one->data == 5 && one->next == NULL);
    free(one);

    node *list = NULL;
    list = insertFront(list, 3);
    list = insertFront(list, 1);
    check("insertFront: 1 -> 3", same(list, (int[]){1, 3}, 2));

    list = insertBack(list, 7);
    check("insertBack: 1 -> 3 -> 7", same(list, (int[]){1, 3, 7}, 3));

    list = insertSorted(list, 5);
    list = insertSorted(list, 0);
    list = insertSorted(list, 9);
    check("insertSorted: 0 1 3 5 7 9", same(list, (int[]){0, 1, 3, 5, 7, 9}, 6));

    check("length == 6", length(list) == 6);
    check("length(NULL) == 0", length(NULL) == 0);
    check("sum == 25", sum(list) == 25);

    list = deleteVal(list, 0);   // the head
    list = deleteVal(list, 5);   // the middle
    list = deleteVal(list, 9);   // the tail
    list = deleteVal(list, 42);  // not in the list
    check("deleteVal (head, middle, tail, missing): 1 3 7", same(list, (int[]){1, 3, 7}, 3));

    node *empty = insertBack(NULL, 4);
    check("insertBack on an EMPTY list", same(empty, (int[]){4}, 1));
    freeList(empty);

    freeList(list);
    printf("\n%d / %d passed %s\n", passed, total, passed == total ? "🎉 Stamp it!" : "🌱 keep going, you've got this");
    return 0;
}
