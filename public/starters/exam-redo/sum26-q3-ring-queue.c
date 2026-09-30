// 🕐 REDO: Summer '26 · I-A Q3 (Queue) · you got 0/5
// A practice version rebuilt from your journal notes.
//
// Your notes said: "A ring, not a line. An efficient array queue never shifts its elements.
//   It just wraps around, like a clock face with 10 positions.
//   dequeue → read index front, then front = (front + 1) % 10
//   enqueue → write index (front + size) % 10, then size++"
//
// TASK: write enqueue and dequeue for this circular array queue.

#include <stdio.h>

#define CAP 10

typedef struct {
    int items[CAP];
    int front;   // index of the first item
    int size;    // how many items are in the queue
} Queue;

void initQueue(Queue *q) {
    q->front = 0;
    q->size = 0;
}

// Add x at the back. Return 1 if it worked, 0 if the queue is full.
int enqueue(Queue *q, int x) {
    // TODO
    return 0;
}

// Remove and return the front item. Return -1 if the queue is empty.
int dequeue(Queue *q) {
    // TODO
    return -1;
}


// ─────────────── tests ───────────────
int passed = 0, total = 0;

void check(const char *name, int ok) {
    total++;
    if (ok) passed++;
    printf("%s %s\n", ok ? "✅" : "❌", name);
}

int main(void) {
    Queue q;
    initQueue(&q);

    check("dequeue on empty → -1", dequeue(&q) == -1);

    for (int i = 1; i <= 10; i++) enqueue(&q, i * 10);   // 10, 20, ..., 100
    check("10 enqueues fill it up (size == 10)", q.size == 10);
    check("enqueue on a FULL queue → 0", enqueue(&q, 999) == 0);

    check("dequeue → 10 (first in, first out)", dequeue(&q) == 10);
    check("dequeue → 20", dequeue(&q) == 20);
    check("front moved to index 2", q.front == 2);

    check("enqueue 110 works now", enqueue(&q, 110) == 1);
    check("…and it WRAPPED to index 0", q.items[0] == 110);
    enqueue(&q, 120);
    check("120 wrapped to index 1", q.items[1] == 120);

    int ok = 1;
    int want[] = {30, 40, 50, 60, 70, 80, 90, 100, 110, 120};
    for (int i = 0; i < 10; i++)
        if (dequeue(&q) != want[i]) ok = 0;
    check("everything comes out in order 30…120", ok);
    check("empty again: size == 0", q.size == 0);

    printf("\n%d / %d passed %s\n", passed, total, passed == total ? "🎉 ring master!" : "🌱 keep going");
    return 0;
}
