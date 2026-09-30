// 📍 REDO: Summer 2019 · I-A (Dynamic Memory) · you got 2/10
//
// Your notes said: "malloc the correct things (LHS and RHS). The question has your answers!
//   It says dynamically allocate an array of numPoints CartPoint structs, so it's CartPoint *a,
//   NOT int *a, and malloc(numPoints * sizeof(CartPoint)), NOT sizeof(int).
//   A random int from 0 to b-1 is rand() % b. Use dot, not ->."
//
// TASK: Dynamically allocate an array of numPoints CartPoint structs. Give every point a random
// x and y from 0 to maxVal-1 (inclusive). Return the array (or NULL if malloc fails).
//
// 📋 Checklist: what TYPE is the pointer? What goes inside sizeof? a[i] is a struct → dot or arrow?

#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int x;
    int y;
} CartPoint;

CartPoint *makeRandomPoints(int numPoints, int maxVal) {
    // TODO
    return NULL;
}


// ─────────────── tests ───────────────
int passed = 0, total = 0;

void check(const char *name, int ok) {
    total++;
    if (ok) passed++;
    printf("%s %s\n", ok ? "✅" : "❌", name);
}

int main(void) {
    srand(42);
    int n = 50, maxVal = 7;
    CartPoint *pts = makeRandomPoints(n, maxVal);
    check("returns an array (not NULL)", pts != NULL);
    if (pts != NULL) {
        int inRange = 1, seen[7] = {0};
        for (int i = 0; i < n; i++) {
            if (pts[i].x < 0 || pts[i].x >= maxVal || pts[i].y < 0 || pts[i].y >= maxVal) inRange = 0;
            else seen[pts[i].x] = 1;
        }
        int variety = 0;
        for (int v = 0; v < maxVal; v++) variety += seen[v];
        check("every x and y is between 0 and maxVal-1", inRange);
        check("values look random (lots of different x's)", variety >= 5);
        check("the LAST point is readable (you allocated enough room)", pts[n - 1].x >= 0);
        free(pts);
    }
    printf("\n%d / %d passed %s\n", passed, total, passed == total ? "🎉 nailed it!" : "🌱 keep going");
    return 0;
}
