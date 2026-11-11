// 🥞 REDO: FE · I-A Q3 (Stacks) · you got 0/10
//
// TASK: write isPalindrome. Return 1 if str reads the same backward, else 0.
// You HAVE to use the stack: the exam gives credit for using it, not just for a right answer.
//
// The big idea: a stack flips order. Push a b c, pop gives c b a.
//   1. Push the FIRST half of the word.
//   2. Walk the SECOND half. Each pop should equal the letter you're on.
//   3. A mismatch? return 0 right away. Got through it all? return 1.
//
// Every stack function takes the stack's ADDRESS: push(&s, c), pop(&s), isEmpty(&s).
// Try an odd word (racecar) and an even one (hannah) on paper first.

#include <stdio.h>
#include <string.h>

// ── given (like the exam): you don't write these ──
typedef struct stack {
    char items[1000];
    int size;
} stack;

int pushes = 0, pops = 0;   // the tests use these to see that you used the stack

void initialize(stack* s) { s->size = 0; }
int isEmpty(stack* s) { return s->size == 0; }
int push(stack* s, char value) {
    s->items[s->size++] = value;
    pushes++;
    return 1;
}
char pop(stack* s) {        // returns 'I' if the stack is empty
    if (isEmpty(s)) return 'I';
    pops++;
    return s->items[--s->size];
}
char peek(stack* s) { return isEmpty(s) ? 'I' : s->items[s->size - 1]; }

// ── your turn ──
int isPalindrome(char *str) {
    struct stack s;
    initialize(&s);
    int len = strlen(str);

    // TODO

    return 0;
}


// ─────────────── tests ───────────────
int passed = 0, total = 0;

void check(const char *name, int ok) {
    total++;
    if (ok) passed++;
    printf("%s %s\n", ok ? "✅" : "❌", name);
}

int main(void) {
    check("racecar → 1 (odd length)", isPalindrome("racecar") == 1);
    check("hannah → 1 (even length)", isPalindrome("hannah") == 1);
    check("level → 1", isPalindrome("level") == 1);
    check("yay → 1", isPalindrome("yay") == 1);
    check("test → 0", isPalindrome("test") == 0);
    check("abca → 0", isPalindrome("abca") == 0);
    check("ab → 0", isPalindrome("ab") == 0);
    check("a → 1 (one letter)", isPalindrome("a") == 1);

    pushes = pops = 0;
    isPalindrome("racecar");
    check("racecar pushes the first half (3, or 4 with the middle)", pushes == 3 || pushes == 4);
    check("…and pops to compare", pops >= 3);

    pushes = pops = 0;
    isPalindrome("abcdef");
    check("abcdef stops at the first mismatch (1 pop)", pops == 1);

    printf("\n%d / %d passed %s\n", passed, total, passed == total ? "🎉 stack star!" : "🌱 keep going");
    return 0;
}
