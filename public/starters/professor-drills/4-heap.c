// 🍡 PROFESSOR'S DRILL #4: write your OWN min-heap
//
// The heap lives in an ARRAY, 1-indexed (a[0] is unused):
//   parent of i = i / 2      left kid = 2 * i      right kid = 2 * i + 1
//
// Draw the tree next to the array on paper while you code. Then `run`.

#include <stdio.h>

#define CAP 100

typedef struct {
    int a[CAP + 1];   // a[1..size] hold the heap
    int size;
} Heap;

void initHeap(Heap *h) {
    h->size = 0;
}

void swap(int *x, int *y) {
    int t = *x;
    *x = *y;
    *y = t;
}

// Move a[i] UP while it's smaller than its parent.
void percolateUp(Heap *h, int i) {
    // TODO
}

// Move a[i] DOWN while it's bigger than its SMALLER child.
// (Careful: the right child might not exist!)
void percolateDown(Heap *h, int i) {
    // TODO
}

// Add val at the end, then percolate it up.
void insert(Heap *h, int val) {
    // TODO
}

// Remove and return the smallest value.
// Steps: save a[1], move the LAST element to a[1], shrink size, percolate down.
int deleteMin(Heap *h) {
    // TODO
    return -1;
}

// Build a heap from n unsorted values in O(n):
// copy them in, then percolate DOWN from index n/2 back to 1.
void heapify(Heap *h, int *vals, int n) {
    // TODO
}


// ─────────────── tests ───────────────
int passed = 0, total = 0;

void check(const char *name, int ok) {
    total++;
    if (ok) passed++;
    printf("%s %s\n", ok ? "✅" : "❌", name);
}

int heapIs(Heap *h, const int *want, int n) {
    if (h->size != n) return 0;
    for (int i = 0; i < n; i++)
        if (h->a[i + 1] != want[i]) return 0;
    return 1;
}

int validHeap(Heap *h) {
    for (int i = 2; i <= h->size; i++)
        if (h->a[i / 2] > h->a[i]) return 0;
    return 1;
}

void show(Heap *h) {
    printf("   your array: [");
    for (int i = 1; i <= h->size; i++) printf("%d%s", h->a[i], i < h->size ? ", " : "");
    printf("]\n");
}

int main(void) {
    Heap h;
    initHeap(&h);
    int ins[] = {10, 4, 15, 20, 0, 8};
    for (int i = 0; i < 6; i++) insert(&h, ins[i]);
    check("insert 10 4 15 20 0 8 → [0, 4, 8, 20, 10, 15]", heapIs(&h, (int[]){0, 4, 8, 20, 10, 15}, 6));
    show(&h);

    check("deleteMin() == 0", deleteMin(&h) == 0);
    check("after deleteMin → [4, 10, 8, 20, 15]", heapIs(&h, (int[]){4, 10, 8, 20, 15}, 5));
    show(&h);

    int ok = 1, prev = -1;
    while (h.size > 0) {
        int x = deleteMin(&h);
        if (x < prev) ok = 0;
        prev = x;
    }
    check("deleteMin keeps coming out sorted (heapsort!)", ok && prev == 20);

    int raw[] = {9, 5, 7, 1, 3, 8, 2};
    heapify(&h, raw, 7);
    check("heapify makes a valid heap of 7", h.size == 7 && validHeap(&h));
    check("heapify: min is on top", h.a[1] == 1);
    show(&h);

    printf("\n%d / %d passed %s\n", passed, total, passed == total ? "🎉 Stamp it!" : "🌱 keep going, you've got this");
    return 0;
}
