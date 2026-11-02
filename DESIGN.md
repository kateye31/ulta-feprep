---
name: FE Café
description: A riso-printed study zine where each day of Foundation Exam prep is dealt as collectible cards.
colors:
  cherry-spot-ink: "#9e1f24"
  cherry-deep: "#7a161b"
  tangerine: "#f3a35a"
  sunflower: "#f9d36f"
  pink: "#f4b9c8"
  mint: "#a9d3c9"
  cornflower-stock: "#79a6e0"
  cream-card-stock: "#fdf3dc"
  milk-paper: "#fffaf0"
  plum-ink: "#2b1a24"
  plum-soft: "#3a2c3f"
  plum-faint: "#6a5e74"
  sunflower-wash: "#fdf0c8"
  pink-wash: "#fbe4ea"
  mint-wash: "#e2f1ec"
  cornflower-print-ink: "#3b6cb8"
  leaf-print-ink: "#3f762a"
typography:
  display:
    fontFamily: "Gluten, Trebuchet MS, sans-serif"
    fontSize: "clamp(4.4rem, 8.6vw, 8.4rem)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Gluten, Trebuchet MS, sans-serif"
    fontSize: "clamp(2.4rem, 6vw, 4.4rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Gluten, Trebuchet MS, sans-serif"
    fontSize: "clamp(1.6rem, 3.4vw, 2.4rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  card-title:
    fontFamily: "Gluten, Trebuchet MS, sans-serif"
    fontSize: "clamp(1.35rem, 2vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.12
  button:
    fontFamily: "Gluten, Trebuchet MS, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Patrick Hand SC, Trebuchet MS, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.2
  hand:
    fontFamily: "Gaegu, Comic Sans MS, cursive"
    fontSize: "1.45em"
    fontWeight: 400
    lineHeight: 1.2
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, Consolas, monospace"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "\"liga\" 0, \"calt\" 0"
rounded:
  xs: "12px"
  sm: "14px"
  md: "16px"
  lg: "18px"
  xl: "22px"
  card: "26px"
  panel: "28px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "18px"
  lg: "26px"
  xl: "56px"
  gutter: "20px"
  container: "1240px"
components:
  button-primary:
    backgroundColor: "{colors.cherry-spot-ink}"
    textColor: "{colors.cream-card-stock}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "10px 22px 11px"
  button-primary-big:
    backgroundColor: "{colors.cherry-spot-ink}"
    textColor: "{colors.cream-card-stock}"
    rounded: "{rounded.pill}"
    padding: "13px 34px 15px"
  button-secondary:
    backgroundColor: "{colors.cream-card-stock}"
    textColor: "{colors.plum-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "10px 22px 11px"
  button-selected:
    backgroundColor: "{colors.plum-ink}"
    textColor: "{colors.cream-card-stock}"
    rounded: "{rounded.pill}"
  button-small:
    rounded: "{rounded.pill}"
    padding: "6px 14px 7px"
  nav-tab:
    backgroundColor: "{colors.cream-card-stock}"
    textColor: "{colors.plum-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "5px 15px 6px"
  nav-tab-hover:
    backgroundColor: "{colors.sunflower}"
  nav-tab-active:
    backgroundColor: "{colors.plum-ink}"
    textColor: "{colors.cream-card-stock}"
  chip:
    backgroundColor: "{colors.cream-card-stock}"
    textColor: "{colors.plum-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 14px 3px"
  chip-highlight:
    backgroundColor: "{colors.sunflower}"
    textColor: "{colors.plum-ink}"
  card-pill:
    backgroundColor: "{colors.plum-ink}"
    textColor: "{colors.cream-card-stock}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 16px 5px"
  card-main:
    backgroundColor: "{colors.cream-card-stock}"
    textColor: "{colors.plum-ink}"
    rounded: "{rounded.card}"
    padding: "18px 18px 20px"
  card-side:
    backgroundColor: "{colors.tangerine}"
    textColor: "{colors.plum-ink}"
    rounded: "{rounded.card}"
    padding: "18px 18px 20px"
  card-bonus:
    backgroundColor: "{colors.cherry-spot-ink}"
    textColor: "{colors.cream-card-stock}"
    rounded: "{rounded.card}"
    padding: "18px 18px 20px"
  panel:
    backgroundColor: "{colors.cream-card-stock}"
    textColor: "{colors.plum-ink}"
    rounded: "{rounded.panel}"
    padding: "22px 34px 30px"
  tab-card:
    backgroundColor: "{colors.cream-card-stock}"
    textColor: "{colors.plum-ink}"
    rounded: "{rounded.lg}"
    padding: "10px 16px 12px"
  section-stock:
    backgroundColor: "{colors.sunflower}"
    textColor: "{colors.plum-ink}"
    rounded: "{rounded.card}"
    padding: "22px 22px 16px"
  input:
    backgroundColor: "{colors.milk-paper}"
    textColor: "{colors.plum-ink}"
    typography: "{typography.mono}"
    rounded: "{rounded.sm}"
    padding: "11px 14px"
  choice:
    backgroundColor: "{colors.milk-paper}"
    textColor: "{colors.plum-ink}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  choice-hover:
    backgroundColor: "{colors.sunflower}"
  choice-right:
    backgroundColor: "{colors.mint}"
  choice-wrong:
    backgroundColor: "{colors.pink-wash}"
  month-day:
    backgroundColor: "{colors.cream-card-stock}"
    textColor: "{colors.plum-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
  month-day-today:
    backgroundColor: "{colors.sunflower}"
  month-day-exam:
    backgroundColor: "{colors.cherry-spot-ink}"
    textColor: "{colors.cream-card-stock}"
  countdown-tag:
    backgroundColor: "{colors.cream-card-stock}"
    textColor: "{colors.plum-ink}"
    rounded: "{rounded.lg}"
    padding: "8px 20px 10px"
  code-block:
    backgroundColor: "{colors.plum-ink}"
    textColor: "{colors.cream-card-stock}"
    typography: "{typography.mono}"
    rounded: "{rounded.sm}"
    padding: "14px 18px"
---

# Design System: FE Café

## Overview

**Creative North Star: "The Riso Card Zine"**

Every page of FE Café is one page of a riso-printed study zine: printed on Cornflower Stock with a visible printer's grain, inked in a warm plum-black, and spot-printed in a deep cherry. The day's work is not a dashboard; it is dealt as collectible cards, thick-outlined, tilted, stacked into a fanned hand with the one thing to do next face-up on top. The world was steered by the student ("Cherry on Cornflower"), and its colors were measured from their own reference board.

The density is deliberately low. The student has ADHD, so each view carries one focal object (the MAIN card, the open panel, the current month) and everything else is tucked behind it, slimmed to a strip, or pushed below the fold. Personality comes from material, not quantity: hand-lettered display type, misregistered cherry shadows, rubber-stamp marks, and public-domain engravings duotoned into one spot ink so prints from different centuries sit on the same page.

Confirmed rejections: dark or gloomy interfaces, template-looking rows of equal cards and stat tiles, AI-made illustration, and too much on screen at once.

**Key Characteristics:**
- Cornflower paper stock with a two-screen dot grain; cream card stock for content.
- Plum Ink for every outline, offset shadow, text and icon. Never black, never gray.
- Cherry as the commanding spot ink; Tangerine, Sunflower, Pink and Mint as secondary stocks.
- Thick ink borders (2.5 to 3.5px), hard down-right offset shadows, pill-shaped controls.
- Cards tilt; reading surfaces stay nearly straight.
- Public-domain art only, printed through a duotone riso filter, always credited.
- Authored SVG icon set, one 2.2px round stroke on a 24px grid.

## Colors

A cool paper stock carrying warm inks: cornflower blue underneath, cream cards on top, plum for every line, cherry for whatever matters most.

### Primary
- **Cherry Spot Ink** (#9e1f24): The commanding ink. Fills the primary pill ("Solve it", "Start", "Continue" cards), the BONUS card and resume card, the misprint shadow behind page titles, rubber stamps, studied-day stars, the countdown and timer numerals, the exam day on the calendar, the text caret and the focus ring. Cream on Cherry reads at about 7:1.
- **Cherry Deep** (#7a161b): A darker cherry for small cherry type where the main ink would feel loud: contents numbers, calendar tallies, choice marks.

### Secondary
- **Tangerine** (#f3a35a): The second spot color. Fills the SIDE card in the dealt hand. Always carries Plum text.

### Tertiary
- **Sunflower** (#f9d36f): The highlighter. Hover fill for nav tabs, choices and dock buttons; today's square on the month; text selection; table headers; the "kind" chip; the Guha TL;DR strip; one exam-section stock.
- **Pink** (#f4b9c8): A section stock (Topics contents page) and a wrong-answer tint family.
- **Mint** (#a9d3c9): A section stock and the right-answer fill.

### Neutral
- **Cornflower Stock** (#79a6e0): The page itself. Body, masthead and scrollbar track, always with the printer's grain on top. Plum on Cornflower reads at about 6.5:1.
- **Cream Card Stock** (#fdf3dc): Every card, panel, nav tab, chip, month square and art window. The default content surface.
- **Milk Paper** (#fffaf0): A brighter writing surface inside cream panels: answer inputs, multiple-choice options, calendar log items.
- **Plum Ink** (#2b1a24): All outlines, offset shadows, body text, icons, the active nav tab and selected pills, and the ground of code blocks.
- **Plum Soft** (#3a2c3f): Secondary text (descriptions, muted notes). Safe on Cornflower and Cream.
- **Plum Faint** (#6a5e74): Tertiary meta text on Cream or Milk Paper only.
- **Sunflower Wash** (#fdf0c8), **Pink Wash** (#fbe4ea), **Mint Wash** (#e2f1ec): Feedback tints inside panels: hints and "what you tend to miss" notes on Sunflower Wash; wrong answers and error messages on Pink Wash; success messages on Mint Wash.

### Riso print inks
- **Cherry**, **Plum**, **Cornflower Print Ink** (#3b6cb8) and **Leaf Print Ink** (#3f762a) are the four duotone inks the art filter maps an engraving's darks into, with Cream Card Stock as the paper. They exist only inside printed art.

### Named Rules
**The Plum Line Rule.** Every outline, offset shadow, icon stroke and body text is Plum Ink. No #000, no neutral grays, no white (#fff) surfaces.

**The Cherry Commands Rule.** Cherry marks the single next action. One primary cherry pill per view; cherry fills elsewhere are cards or stamps, never a second competing button.

**The Paper Stock Rule.** Pages print on Cornflower; content sits on Cream or on a colored stock (Tangerine, Sunflower, Pink, Mint). Surfaces are never dark. The only plum-ground surfaces are code blocks, and the Code Studio editor and terminal are an intentional dark exception for code readability.

**The Faint-On-Cream Rule.** Plum Faint text only appears on Cream or Milk Paper (it drops to about 2.4:1 on Cornflower). Cherry text on Cornflower is for display sizes only (about 3.1:1).

## Typography

**Display Font:** Gluten (with Trebuchet MS)
**Body Font:** Atkinson Hyperlegible Next (with system-ui)
**Label Font:** Patrick Hand SC (with Trebuchet MS)
**Hand Font:** Gaegu (with Comic Sans MS), for speech bubbles and mnemonic hooks
**Mono Font:** JetBrains Mono (with ui-monospace, Consolas), ligatures off

**Character:** Chunky hand-lettered Gluten does the shouting; rounded hand-drawn small caps (Patrick Hand SC) do the labeling; Atkinson Hyperlegible Next does all the reading, because legibility for an ADHD reader is a product commitment, not a style choice.

### Hierarchy
- **Display** (Gluten 800, clamp(4.4rem, 8.6vw, 8.4rem), line-height 0.86): The date on Today, with a cherry misprint copy offset behind it. One per site.
- **Headline** (Gluten 800, clamp(2.4rem, 6vw, 4.4rem), 1.08): Page titles (h1), always with the cherry misprint shadow.
- **Title** (Gluten 800, clamp(1.6rem, 3.4vw, 2.4rem), 1.08): Section headings (h2), contents-section names, card corner names (MAIN, SIDE, BONUS at clamp(1.6rem, 2.4vw, 2.2rem), line-height 1).
- **Card Title** (Gluten 700, clamp(1.35rem, 2vw, 1.75rem), 1.12, balanced): The problem name on a dealt card; tab-card and resume-card names use the same family at 1.25 to 2.4rem.
- **Button** (Gluten 700, 1.2rem, 1.1): Pill buttons; 1.75rem on the big primary pill, 1rem on small pills.
- **Body** (Atkinson Hyperlegible Next 400 / 700, 17px, 1.65): All reading text. Prompts cap at 62ch, explanations at 72ch.
- **Label** (Patrick Hand SC 400, 1.05 to 1.4rem, 1.2): Nav tabs, chips, card pills, field labels, month heads, issue line, minutes, art credits. Natural small caps, never forced uppercase.
- **Hand** (Gaegu, 1.45em, 1.2): Speech bubbles and mnemonic hooks on topic pages.
- **Mono** (JetBrains Mono, 0.86em inline / 0.92 to 0.95rem blocks, 1.6): Code, answer inputs. Ligatures disabled so `->` and `!=` read as typed.

### Named Rules
**The Misprint Rule.** Headlines carry a hard cherry copy offset down-right, like a riso layer printed off register: 4px 4px on page titles, 6px on the Today date, 2px on the masthead name. No blur.

**The Hand-Caps Label Rule.** Small text that labels or counts is set in Patrick Hand SC at 1rem or larger. Labels are never tiny tracked uppercase mono, and never sit above a heading as a kicker.

**The Tabular Count Rule.** Countdowns, timers and dock times use tabular numerals so digits do not jitter as they change.

## Layout

One shared container, min(1240px, 100% - 40px), so the page's left edge sits under the masthead name. Today is a two-page spread: a left column of 300 to 460px (date, countdown tag, stamped month) and a flexible right column holding the dealt hand (600 to 700px tall, cards absolutely positioned and overlapping), with a column gap of clamp(28px, 4vw, 56px). Below the fold, a "pick up" row pairs one dealt card (1.7fr) with two tucked tab cards (1fr), never a row of equal cards.

Content pages follow the same spread logic: the Topics contents page is a two-up grid of section cards (min 460px), the calendar opens one month large beside a sticky day panel (340px) with the other months collapsed to slim dot strips.

At 980px and below, the masthead collapses to a menu button, spreads stack into one column, the fanned hand becomes a 2-column grid with MAIN spanning both and tilts removed, and the primary pill moves directly under MAIN. At 520px card corner names and pills step down. Spacing rhythm runs in roughly 6 / 10 / 18 / 26 / 56px steps: tight inside controls, 18px inside cards, 26 to 30px between cards, 56px between page sections.

## Elevation & Depth

Depth is printed, not lit. Every raised object casts a hard, unblurred Plum offset down and to the right (the misregistered second layer), paired with a soft warm ambient lift so the card also feels physically above the stock. Interactive objects respond by lifting further on hover and collapsing their offset on press, as if pushed flat into the paper. Overlap (cards stacked in a hand, stamps over squares) and tilt are the other two depth cues. Offset ink shadows are native to this world.

### Shadow Vocabulary
- **Printed small** (`box-shadow: 3px 4px 0 #2b1a24, 0 8px 18px rgba(43, 26, 36, 0.14)`): Tags, tab cards, small form cards, art prints, popovers, the countdown tag.
- **Printed large** (`box-shadow: 5px 6px 0 #2b1a24, 0 16px 30px rgba(43, 26, 36, 0.18)`): Dealt cards, the open panel, contents-section cards, the resume card, dock panels.
- **Pill rest / hover / press** (`3px 4px 0` / `4px 6px 0` / `1px 1px 0`, Plum, no blur): Pill buttons; big pills rest at `4px 6px 0`, small pills at `2px 3px 0`.
- **Square offset** (`box-shadow: 3px 3px 0 #2b1a24`): Today's square on the month grid.

### Named Rules
**The Printed Offset Rule.** Shadows are a hard Plum offset down-right, optionally with one soft warm lift. Never a blur-only shadow, never a colored glow, never an inset well.

**The Tilt Rule.** Dealt cards tilt boldly (-8deg, -2deg, +5deg); tucked tabs and side panels tilt 1 to 1.5deg; section cards about 0.6deg; reading blocks at most 0.4deg; an opened panel is straight. The more text a surface holds, the straighter it sits.

## Shapes

Everything is soft-cornered and outlined, like die-cut card stock. Interactive controls are full pills (999px). Corners scale with the object: 12px for month squares, 14px for inputs and code, 16px for choices and art windows, 18px for tags and tab cards, 22px for standard cards, 26px for dealt and section cards, 28px for an opened panel. Borders are Plum and thick: 2 to 2.5px on small controls and chips, 3px on standard surfaces, 3.5px on dealt cards and panels. Dashed borders mean "not yet" (future days) or a printed fold (the dashed divider above explanations). Stamps are drawn with an uneven rubber-stamp edge (an SVG displacement filter) and set slightly rotated.

## Components

### Buttons
Tactile, inked and pressable, like punched card tokens.
- **Shape:** Full pill (999px) with a 3px Plum border and a hard Plum offset shadow.
- **Primary:** Cherry fill, Cream Gluten label (10px 22px 11px; big variant 13px 34px 15px at 1.75rem). One per view. An authored arrow or play icon may follow the label.
- **Hover / Focus:** Lifts 2px and the offset grows to 4px 6px; press translates 2px 3px and the offset shrinks to 1px 1px. Focus is a 3px Cherry outline at 3px offset. Disabled drops to 45% opacity.
- **Secondary:** Cream fill, Plum label. **Selected:** Plum fill, Cream label (segmented choices like 25 / 50 min, stream presets). **Small:** 6px 14px 7px at 1rem.
- **Text link button:** Underlined Plum text; the "Back to today" link uses a wavy Cherry underline.

### Chips
- **Style:** Cream fill, 2 to 2.5px Plum border, Patrick Hand SC, full pill. The card pill variant is a solid Plum pill with Cream text (inverted to Cream on the BONUS card).
- **State:** The highlighted kind chip is Sunflower. Art credits use the same pill as a small caption pinned bottom-right inside the print.

### Cards / Containers
- **Corner Style:** 26px for dealt cards; 22px for standard cards; 18px for tab cards; 28px for the opened panel.
- **Background:** Cream by default; Tangerine (SIDE), Cherry (BONUS, resume); Sunflower, Mint, Pink or Cream for section stocks.
- **Shadow Strategy:** Printed large for dealt and section cards; printed small for tab cards (see Elevation & Depth).
- **Border:** 3 to 3.5px Plum.
- **Internal Padding:** 18px on dealt cards, 22px on section cards, 22px to 34px on panels.
- **Motion:** Cards deal in with GSAP (from below-right, rotated, staggered 0.08 to 0.1s, 0.7 to 0.8s, expo-out); a tapped card grows into the full panel with a FLIP transform. All motion is skipped under reduced motion.

### Inputs / Fields
- **Style:** Milk Paper fill, 3px Plum border, 14px radius, JetBrains Mono at 1.05rem, 11px 14px padding, Cherry caret. Field labels are Patrick Hand SC above the field.
- **Focus:** A 4px soft Cherry ring (rgba(158, 31, 36, 0.22)); no outline glow.
- **Error / Success:** Wrong answers turn the border Cherry; correct answers fill Mint. Feedback appears below in a Pink Wash or Mint Wash note with a 2px Plum border.
- **Choices:** Milk Paper option rows with a round lettered key; hover slides 4px right on Sunflower; right fills Mint; wrong fills Pink Wash with a Cherry border, a Cherry key and a rough-stamped "not this one" mark.

### Navigation
- **Style:** A sticky masthead on grained Cornflower with a 3px Plum rule beneath, 72px tall. The name "FE Café" in Gluten with a 2px Cherry misprint at left; sections as Cream pill tabs in Patrick Hand SC at right; overflow pages in a "More" dropdown card.
- **States:** Hover fills Sunflower, lifts 2px and tilts -1.5deg; the current page is a solid Plum tab with Cream text.
- **Study tools:** The timer, rain and focus-mode toggles live in a Cream pill toolbar inside the masthead (never floating over content); pressed tools turn solid Plum.
- **Mobile:** Below 980px a round menu button opens the tabs as a full-width stacked list under the masthead.

### Dealt Hand (signature)
Today's three cards fanned on the right page: BONUS (Cherry, streak, -8deg) behind left, SIDE (Tangerine, focus timer, +5deg) behind right, MAIN (Cream, largest, -2deg) on top with the problem's art window, topic pill, star difficulty and title. A solved MAIN card gets a rough Cherry rubber stamp ("+100") hanging off its right edge. The cherry "Solve it" pill sits beneath MAIN.

### Riso Print (signature)
Public-domain museum artworks shown in a framed window (3px Plum border, 16px radius, Cream ground) and passed through a duotone SVG filter that maps the darks into one spot ink (Cherry, Plum, Cornflower or Leaf) over Cream, with a fine Plum dot screen multiplied on top. The same seed always draws the same print. A Patrick Hand SC credit pill links to the source; credits live in `public/art/pd/credits.json`.

### Stamped Month (signature)
A 7-column planner grid of Cream squares (2.5px Plum border, 12px radius, date in Patrick Hand SC top-left). Studied days carry a Cherry star stamp at a per-day tilt, multiplied into the paper. Today is Sunflower with a square offset shadow; future days are dashed and transparent; exam day is solid Cherry marked "FE".

## Do's and Don'ts

### Do:
- **Do** outline every surface in Plum Ink (3px standard, 3.5px for dealt cards and panels) and give raised objects the hard down-right Plum offset.
- **Do** keep one focal object per view and one Cherry primary pill; tuck everything else behind it, slim it to a strip, or move it below the fold.
- **Do** print every illustration from public-domain or CC0 sources through the riso duotone filter, with a visible credit.
- **Do** use the authored SVG icon set (2.2px round stroke, 24px grid, currentColor) for every icon.
- **Do** use Sunflower for hover, selection and "today", and Mint / Pink Wash for right / wrong feedback.
- **Do** tilt cards, but keep reading surfaces at 0.4deg or less and the opened panel straight.
- **Do** honor prefers-reduced-motion: no dealing, no FLIP, no transitions.

### Don't:
- **Don't** build dark or gloomy screens; the only dark surfaces are code blocks and the Code Studio editor.
- **Don't** lay out rows of equal cards or stat-tile dashboards; deal unequal cards with one clearly on top.
- **Don't** ship AI-made illustration, or the user's moodboard references, anywhere on the site.
- **Don't** use emoji or text glyphs as icons on buttons or headers (emoji in copy is welcome).
- **Don't** put kicker or eyebrow labels above headings, or use tiny tracked uppercase mono labels.
- **Don't** use pure black, neutral gray, or pure white surfaces, or blur-only shadows and glows.
- **Don't** put Plum Faint text on Cornflower, or small Cherry text on Cornflower.
- **Don't** show everything at full size at once; collapse what is not the focus (slim strips, tucked tabs, the More menu) instead.
