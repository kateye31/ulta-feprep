// 🌟 REDO: Summer '26 · I-A Q1 (Dynamic Memory) · you got 2/10
// A practice version rebuilt from your journal notes. (The real wording may differ a little.)
//
// Your notes said: "Sentinel means very end. malloc fails if what is to the left equals NULL.
//                   Read the question carefully."
//
// TASK: Write oddStarPlanets. Given route[0..routeLen-1] (planet ids), return a NEW dynamically
// allocated int array holding getStarsOnPlanet(route[i]) for every planet with an ODD star count,
// in order, followed by a sentinel value of -1 at the very end.
// Store how many odd values you found (NOT counting the sentinel) in *outSize.
// If malloc fails, return NULL.
//
// 📋 Before you type: How big must the array be in the WORST case? (Every planet odd + the sentinel!)

#include <stdio.h>
#include <stdlib.h>

// Given to you (pretend you don't know how it works):
int getStarsOnPlanet(int planet) {
    return (planet * 7 + 3) % 10;
}

int *oddStarPlanets(int *route, int routeLen, int *outSize) {
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
    int route[] = {1, 2, 3, 4, 5};   // stars: 0, 7, 4, 1, 8
    int size = -99;
    int *a = oddStarPlanets(route, 5, &size);
    check("returns a real array (not NULL)", a != NULL);
    if (a != NULL) {
        check("*outSize == 2", size == 2);
        check("a[0] == 7 and a[1] == 1", a[0] == 7 && a[1] == 1);
        check("sentinel: a[2] == -1", a[2] == -1);
        free(a);
    }

    int route2[] = {1, 3, 5};        // stars: 0, 4, 8 → nothing odd
    size = -99;
    int *b = oddStarPlanets(route2, 3, &size);
    check("no odd planets: still returns an array", b != NULL);
    if (b != NULL) {
        check("no odd planets: *outSize == 0 and b[0] == -1", size == 0 && b[0] == -1);
        free(b);
    }

    int route3[] = {2, 4, 12, 14};   // stars: 7, 1, 7, 1 → ALL odd (worst case!)
    size = -99;
    int *c = oddStarPlanets(route3, 4, &size);
    if (c != NULL) {
        check("all odd: size 4 and the sentinel still fits", size == 4 && c[4] == -1);
        free(c);
    } else {
        check("all odd: returns an array", 0);
    }

    printf("\n%d / %d passed %s\n", passed, total, passed == total ? "🎉 that's a 10/10 answer now!" : "🌱 keep going");
    return 0;
}
