// 👋 Welcome to your Code Studio!
//
// Everything you type here SAVES automatically in this browser.
// Try it:
//   1. Open the "📥 Input" tab under the editor and type a number, like 7
//   2. Press ▶ Run (or Ctrl+Enter)
//
// Terminal commands you can type:  help · ls · cd · cat · touch · mkdir · rm · mv · run · clear

#include <stdio.h>

int main(void) {
    int n;
    printf("How many cups of tea today? ");
    if (scanf("%d", &n) != 1) n = 1;
    printf("\n");
    for (int i = 0; i < n; i++) printf("🍵");
    printf("\nYou got this! ✨\n");
    return 0;
}
