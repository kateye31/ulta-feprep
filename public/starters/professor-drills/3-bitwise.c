// 💡 PROFESSOR'S DRILL #3: bitwise operators
//
// Part 1: PREDICT. Work these out on PAPER first (write both numbers in binary!),
//         then type your answers below. Don't run until you've guessed all of them.
// Part 2: WRITE the bit functions yourself.
//
// Place values for 8 bits:  128  64  32  16  8  4  2  1

#include <stdio.h>

// ── Part 1: predictions (replace each -1 with your answer) ──
int predict_and    = -1;   // 45 & 27
int predict_or     = -1;   // 45 | 27
int predict_xor    = -1;   // 45 ^ 27
int predict_left   = -1;   // 13 << 3
int predict_right  = -1;   // 100 >> 2
int predict_mask   = -1;   // 0xF0 & 0x3C   (hex! F0 = 1111 0000)

// ── Part 2: write these ──

// Return 1 if bit i of x is on, else 0.  (bit 0 = the 1s place)
int getBit(int x, int i) {
    // TODO
    return 0;
}

// Return x with bit i turned ON.
int setBit(int x, int i) {
    // TODO
    return x;
}

// Return x with bit i turned OFF.
int clearBit(int x, int i) {
    // TODO
    return x;
}

// Return x with bit i FLIPPED.
int toggleBit(int x, int i) {
    // TODO
    return x;
}

// How many bits are 1? (Loop over the bits using >> and &.)
int countOnes(unsigned int x) {
    // TODO
    return 0;
}

// 1 if x is a power of two (1, 2, 4, 8, ...), else 0. Bonus: do it with NO loop.
int isPowerOfTwo(int x) {
    // TODO
    return 0;
}

// Write the lowest `bits` bits of x into out as '0'/'1' chars, most significant first,
// then end it with '\0'.   toBinary(45, 8, out) → "00101101"
void toBinary(int x, int bits, char *out) {
    // TODO
    out[0] = '\0';
}

// FE classic: how many SUBSETS of a[0..n-1] add up to exactly target?
// Loop mask from 0 to (1 << n) - 1; bit i of mask on = "a[i] is in the subset".
int countSubsetsWithSum(int *a, int n, int target) {
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

int sameStr(const char *a, const char *b) {
    while (*a && *a == *b) { a++; b++; }
    return *a == *b;
}

int main(void) {
    printf("── Part 1: your predictions ──\n");
    check("45 & 27", predict_and == (45 & 27));
    check("45 | 27", predict_or == (45 | 27));
    check("45 ^ 27", predict_xor == (45 ^ 27));
    check("13 << 3", predict_left == (13 << 3));
    check("100 >> 2", predict_right == (100 >> 2));
    check("0xF0 & 0x3C", predict_mask == (0xF0 & 0x3C));

    printf("\n── Part 2: your functions ──\n");
    check("getBit(45, 0) == 1", getBit(45, 0) == 1);
    check("getBit(45, 1) == 0", getBit(45, 1) == 0);
    check("getBit(45, 5) == 1", getBit(45, 5) == 1);
    check("setBit(45, 1) == 47", setBit(45, 1) == 47);
    check("clearBit(45, 0) == 44", clearBit(45, 0) == 44);
    check("toggleBit(45, 5) == 13", toggleBit(45, 5) == 13);
    check("toggleBit(13, 5) == 45", toggleBit(13, 5) == 45);
    check("countOnes(45) == 4", countOnes(45) == 4);
    check("countOnes(0) == 0", countOnes(0) == 0);
    check("isPowerOfTwo(64) == 1", isPowerOfTwo(64) == 1);
    check("isPowerOfTwo(48) == 0", isPowerOfTwo(48) == 0);
    check("isPowerOfTwo(0) == 0", isPowerOfTwo(0) == 0);

    char buf[40];
    toBinary(45, 8, buf);
    check("toBinary(45, 8) == \"00101101\"", sameStr(buf, "00101101"));
    toBinary(5, 3, buf);
    check("toBinary(5, 3) == \"101\"", sameStr(buf, "101"));

    int a[] = {3, 5, 2, 8};
    check("subsets of {3,5,2,8} summing to 10 → 2", countSubsetsWithSum(a, 4, 10) == 2);
    check("subsets of {3,5,2,8} summing to 0 → 1 (the empty set!)", countSubsetsWithSum(a, 4, 0) == 1);

    printf("\n%d / %d passed %s\n", passed, total, passed == total ? "🎉 Stamp it!" : "🌱 keep going, you've got this");
    return 0;
}
