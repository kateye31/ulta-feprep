// 📂 REDO: FE · I-A · #289 Dynamic team creation from a file · you got 0/10
//
// Three small steps, easiest first. Do them in order and press Run after each one.
//   🥚 Warm-up 1: read ONE line (a word and a number) from a file.
//   🍳 Warm-up 2: read a count, malloc an array that big, and fill it.
//   🍰 The real one: createTeam, from the exam.
//
// The 4 rules:
//   1. Reading a file is fscanf(fp, "...", ...). printf only writes to the screen.
//   2. Each value gets its own % code: %s = word, %d = int. No + between them.
//   3. & goes on ints. NO & on char arrays: they're already addresses.
//   4. res is a pointer, so res->field. res->players[i] is a whole struct, so .field.
//
// (The tests make the files for you with tmpfile(), so you just get an open fp.)

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Player {
    char pname[50];    // player's name
    char country[50];  // player's country
    int age;
} Player;

typedef struct Team {
    char tname[50];    // team's name
    Player *players;   // all players on the team
    int numPlayers;    // number of players on the team
} Team;

// ── 🥚 Warm-up 1 ──
// The file holds one line like:  NewKnights 5
// Copy the word into name and RETURN the number.
int readHeader(FILE *fp, char *name) {
    int count = 0;

    // TODO: one fscanf line. (name is already an address. count is not.)

    return count;
}

// ── 🍳 Warm-up 2 ──
// The file looks like:  4  90 85 70 100
// Read the count into *n, malloc an int array that big, fill it, return it.
int *readScores(FILE *fp, int *n) {
    // TODO

    return NULL;
}

// ── 🍰 The real one (10 pts) ──
// First line: team name and number of players. Then one player per line: name country age.
Team *createTeam(FILE *fp) {
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

FILE *fileWith(const char *text) {
    FILE *fp = tmpfile();
    fputs(text, fp);
    rewind(fp);
    return fp;
}

int main(void) {
    printf("── 🥚 Warm-up 1 ──\n");
    FILE *a = fileWith("NewKnights 5\n");
    char name[50] = "";
    int c = readHeader(a, name);
    check("returns 5", c == 5);
    check("name is NewKnights", strcmp(name, "NewKnights") == 0);
    fclose(a);

    printf("\n── 🍳 Warm-up 2 ──\n");
    FILE *b = fileWith("4\n90 85 70 100\n");
    int n = 0;
    int *scores = readScores(b, &n);
    check("n is 4", n == 4);
    check("returns an array (not NULL)", scores != NULL);
    check("holds 90 85 70 100", scores && n == 4 && scores[0] == 90 && scores[1] == 85 && scores[2] == 70 && scores[3] == 100);
    free(scores);
    fclose(b);

    printf("\n── 🍰 createTeam ──\n");
    FILE *f = fileWith("NewKnights 5\nHannan USA 22\nMabel India 21\nSamarina Bangladesh 21\nTamsen USA 21\nSusan Mexico 22\n");
    Team *t = createTeam(f);
    check("returns a Team (not NULL)", t != NULL);
    if (t) {
        check("team name is NewKnights", strcmp(t->tname, "NewKnights") == 0);
        check("numPlayers is 5", t->numPlayers == 5);
        check("players array was allocated", t->players != NULL);
        if (t->players && t->numPlayers == 5) {
            check("player 0: Hannan USA 22", strcmp(t->players[0].pname, "Hannan") == 0 && strcmp(t->players[0].country, "USA") == 0 && t->players[0].age == 22);
            check("player 2: Samarina Bangladesh 21", strcmp(t->players[2].pname, "Samarina") == 0 && strcmp(t->players[2].country, "Bangladesh") == 0 && t->players[2].age == 21);
            check("player 4 (the last): Susan Mexico 22", strcmp(t->players[4].pname, "Susan") == 0 && strcmp(t->players[4].country, "Mexico") == 0 && t->players[4].age == 22);
        }
        free(t->players);
        free(t);
    }
    fclose(f);

    FILE *g = fileWith("Solo 1\nKay USA 20\n");
    Team *one = createTeam(g);
    check("a 1-player team works too", one && one->numPlayers == 1 && one->players && strcmp(one->players[0].pname, "Kay") == 0 && one->players[0].age == 20);
    if (one) { free(one->players); free(one); }
    fclose(g);

    printf("\n%d / %d passed %s\n", passed, total, passed == total ? "🎉 file wizard!" : "🌱 keep going");
    return 0;
}
