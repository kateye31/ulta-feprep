// 🔧 REDO: Summer 2023 · I-A (Dynamic Memory) · you got 1/5
//
// The question: "Below is a function freeList that is SUPPOSED to free all the memory of a
// linked list, but it doesn't work. Explain why, and propose a fix."
//
// STEP 1: Run it AS-IS first. 👀 Watch what the memory checker says, and on which line!
// STEP 2: In the comment box below, explain the bug in your own words (the exam wants words!).
// STEP 3: Fix the function and run again. No red memory errors = you fixed it.
//
// Your notes said: "Check if front is NULL → just return. Then do the recursive call to free the
//   rest of the list. Then free front LAST." And: "TAKE YOUR TIME."

#include <stdio.h>
#include <stdlib.h>

typedef struct node {
    int data;
    struct node *next;
} node;

/* ✏️ My explanation of the bug:
 *
 *
 */
void freeList(node *front) {
    if (front != NULL)
        free(front);
    if (front->next != NULL)
        freeList(front->next);
}


// ─────────────── tests ───────────────
int main(void) {
    node *list = NULL;
    for (int i = 3; i >= 1; i--) {
        node *n = malloc(sizeof(node));
        n->data = i;
        n->next = list;
        list = n;
    }
    freeList(list);
    freeList(NULL);   // should be safe too!
    printf("✅ freeList finished. If there's no red memory error below, it's fixed! 🎉\n");
    return 0;
}
