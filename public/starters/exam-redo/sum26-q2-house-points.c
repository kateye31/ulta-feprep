// 🏠 REDO: Summer '26 · I-A Q2 (Linked List) · you got 2/10, then 6/10
// A practice version rebuilt from your journal notes.
//
// Your notes said: "Read carefully, make sure to have the correct return type. It wants an INT,
//                   not a head. strcmp returns 0 if equal."
//
// TASK: Each node is one student with a house name and some points.
// Write housePoints: return the TOTAL points of every student whose house matches houseName.
//
// 📋 Checklist before you type:
//    - What's the return type?  (circle it!)
//    - What do you return for an empty list?
//    - strcmp(a, b) == 0 means "the same".

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct student {
    char name[20];
    char house[20];
    int points;
    struct student *next;
} student;

int housePoints(student *head, char *houseName) {
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

student *add(student *head, const char *name, const char *house, int pts) {
    student *s = malloc(sizeof(student));
    strcpy(s->name, name);
    strcpy(s->house, house);
    s->points = pts;
    s->next = head;
    return s;
}

int main(void) {
    student *list = NULL;
    list = add(list, "Mochi", "Lavender", 10);
    list = add(list, "Pip", "Matcha", 4);
    list = add(list, "Tofu", "Lavender", 7);
    list = add(list, "Bun", "Peach", 3);
    list = add(list, "Yuzu", "Lavender", 5);

    check("Lavender == 22", housePoints(list, "Lavender") == 22);
    check("Matcha == 4", housePoints(list, "Matcha") == 4);
    check("house nobody is in == 0", housePoints(list, "Mint") == 0);
    check("empty list == 0", housePoints(NULL, "Lavender") == 0);

    while (list) {
        student *nx = list->next;
        free(list);
        list = nx;
    }
    printf("\n%d / %d passed %s\n", passed, total, passed == total ? "🎉 full points!" : "🌱 keep going");
    return 0;
}
