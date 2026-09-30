// 📺 REDO: Spring 2020 · I-A (Dynamic Memory) · you got 5/10
//
// Your notes said: "Read carefully, return NULL. Only free fields that are dynamic.
//   char * field  → free(list[i].field)
//   char ** field → free(list[i].field[j]) for each j, THEN free(list[i].field)"
//   Also: "No typedef means write `struct` every time."
//
// TASK: show_list is a dynamically allocated array of `length` tv_shows, and each show_name
// was dynamically allocated too. Free ALL the dynamically allocated memory, then return NULL.
//
// 💧 Memory check is on: if you miss a free, the terminal will show a LEAK with the line number.

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct tv_show {
    char *show_name;
    int number_of_seasons;
};

struct tv_show *delete_show_list(struct tv_show *show_list, int length) {
    // TODO
    return show_list;
}


// ─────────────── tests ───────────────
int main(void) {
    const char *names[] = {"Frieren", "Spy x Family", "Bluey"};
    int n = 3;
    struct tv_show *list = malloc(n * sizeof(struct tv_show));
    for (int i = 0; i < n; i++) {
        list[i].show_name = malloc(strlen(names[i]) + 1);
        strcpy(list[i].show_name, names[i]);
        list[i].number_of_seasons = i + 1;
    }

    list = delete_show_list(list, n);
    printf("%s returned NULL\n", list == NULL ? "✅" : "❌");
    printf("👀 Now check below: no 'memory leak' message = you freed everything! 🎉\n");
    return 0;
}
