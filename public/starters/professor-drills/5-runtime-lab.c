// ⏱ PROFESSOR'S DRILL #5: runtime lab
//
// Each mystery function COUNTS how many times its innermost line runs.
// We run it with n and with 2n and look at the ratio:
//
//    steps barely change (+1)   → O(log n)
//    ratio ≈ 2                  → O(n)
//    ratio a bit over 2 (~2.2)  → O(n log n)
//    ratio ≈ 4                  → O(n^2)
//    ratio ≈ 8                  → O(n^3)
//
// 1. Read each mystery. 2. Write your guess in PREDICT (like "n", "n^2", "log n", "n log n", "n^3").
// 3. `run` and see if the measured growth agrees with you!

#include <stdio.h>
#include <string.h>
#include <ctype.h>

const char *PREDICT[8] = {
    "?",   // mystery1
    "?",   // mystery2
    "?",   // mystery3
    "?",   // mystery4
    "?",   // mystery5
    "?",   // mystery6
    "?",   // mystery7
    "?",   // mystery8
};

long long mystery1(int n) {
    long long c = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            c++;
    return c;
}

long long mystery2(int n) {
    long long c = 0;
    for (int i = 1; i < n; i *= 2)
        c++;
    return c;
}

long long mystery3(int n) {
    long long c = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < i; j++)
            c++;
    return c;
}

long long mystery4(int n) {
    long long c = 0;
    for (int i = 0; i < n; i++)
        for (int j = 1; j < n; j *= 2)
            c++;
    return c;
}

long long mystery5(int n) {        // looks nested... is it?
    long long c = 0;
    int j = 0;
    for (int i = 0; i < n; i++) {
        while (j < i) {
            j++;
            c++;
        }
        c++;
    }
    return c;
}

long long mystery6(int n) {        // the inner loop shrinks each time
    long long c = 0;
    for (int i = n; i > 0; i /= 2)
        for (int j = 0; j < i; j++)
            c++;
    return c;
}

long long mystery7(int n) {
    long long c = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            for (int k = 0; k < n; k++)
                c++;
    return c;
}

long long mystery8(int n) {
    long long c = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < 100; j++)
            c++;
    return c;
}


// ─────────────── the lab (no need to edit) ───────────────
void norm(const char *in, char *out) {
    int k = 0;
    for (; *in; in++)
        if (!isspace((unsigned char)*in) && *in != '(' && *in != ')' && *in != 'O' && *in != '^')
            out[k++] = (char)tolower((unsigned char)*in);
    out[k] = '\0';
}

const char *classify(long long a, long long b) {
    double r = (double)b / (double)a;
    if (b - a <= 2) return "log n";
    if (r < 2.1) return "n";
    if (r < 3.0) return "n log n";
    if (r < 5.0) return "n^2";
    return "n^3";
}

int main(void) {
    long long (*f[8])(int) = {mystery1, mystery2, mystery3, mystery4, mystery5, mystery6, mystery7, mystery8};
    int base[8] = {1024, 1024, 1024, 1024, 1024, 1024, 64, 1024};
    int right = 0;

    printf("%-10s %14s %14s %8s  %-9s %s\n", "mystery", "steps(n)", "steps(2n)", "ratio", "measured", "your guess");
    for (int i = 0; i < 8; i++) {
        long long a = f[i](base[i]), b = f[i](2 * base[i]);
        const char *m = classify(a, b);
        char g[32], want[32];
        norm(PREDICT[i], g);
        norm(m, want);
        int ok = strcmp(g, want) == 0 || (strcmp(want, "n2") == 0 && strcmp(g, "n²") == 0);
        right += ok;
        printf("mystery%-3d %14lld %14lld %8.2f  O(%-6s) %s %s\n", i + 1, a, b, (double)b / a, m, ok ? "✅" : "❌", PREDICT[i]);
    }
    printf("\n%d / 8 predicted right %s\n", right, right == 8 ? "🎉 you can SEE runtime now!" : "🌱 look at the ❌ ones again: count the innermost line");
    return 0;
}
