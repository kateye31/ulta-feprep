import { ARCADE_EXAMS } from "@/content/arcade";
import { examStats, type ArcadeSave } from "./store";

/**
 * Things you can buy for your café with coffee beans.
 * `art` = a hand-drawn Open Doodles figure; `draw` = one of the inked props in components/arcade/decor.
 * x / y = where it lands the first time (percent of the room; y is where it touches the floor/wall).
 */
export type Decor = { id: string; name: string; blurb: string; price: number; w: number; x: number; y: number; art?: string; draw?: string };

export const SHOP: Decor[] = [
  { id: "candles", name: "Candle trio", blurb: "Three little flames for late-night studying.", price: 15, w: 7, x: 70, y: 74, draw: "candles" },
  { id: "frame", name: "“I ♥ ->” frame", blurb: "A framed reminder: arrows are for pointers.", price: 20, w: 8, x: 24, y: 50, draw: "frame" },
  { id: "rug", name: "Round rug", blurb: "Lavender wool, very soft.", price: 25, w: 34, x: 50, y: 96, draw: "rug" },
  { id: "mug", name: "Steaming mug", blurb: "Hot cocoa. Refills are free.", price: 12, w: 5, x: 44, y: 76, draw: "mug" },
  { id: "lamp", name: "Floor lamp", blurb: "Warm amber light in the corner.", price: 30, w: 8, x: 12, y: 90, draw: "lamp" },
  { id: "lights", name: "String lights", blurb: "Twinkly bulbs along the ceiling.", price: 40, w: 70, x: 50, y: 18, draw: "lights" },
  { id: "clock", name: "Wall clock", blurb: "Always says it's study o'clock.", price: 22, w: 8, x: 84, y: 36, draw: "clock" },
  { id: "cat", name: "Sleepy cat", blurb: "Naps on the rug. Will not move.", price: 45, w: 10, x: 58, y: 93, draw: "cat" },
  { id: "chalk", name: "Chalkboard menu", blurb: "Today's special: heaps.", price: 50, w: 13, x: 86, y: 90, draw: "chalk" },
  { id: "record", name: "Record player", blurb: "Lo-fi beats on vinyl.", price: 55, w: 13, x: 30, y: 78, draw: "record" },
  { id: "shelf", name: "Bookshelf", blurb: "Full of algorithm books (and one comic).", price: 60, w: 15, x: 22, y: 88, draw: "shelf" },
  { id: "plant", name: "Big plant buddy", blurb: "Someone hugging their monstera.", price: 70, w: 16, x: 92, y: 98, art: "doodle-plant" },
  { id: "coffee", name: "Coffee friend", blurb: "A regular. Always orders a latte.", price: 90, w: 14, x: 40, y: 97, art: "doodle-coffee" },
  { id: "reader", name: "Reading friend", blurb: "Lost in a good book about tries.", price: 110, w: 18, x: 66, y: 98, art: "doodle-sittingreading" },
  { id: "chill", name: "Chilling friend", blurb: "Taking a well-earned break.", price: 120, w: 20, x: 30, y: 99, art: "doodle-chilling" },
  { id: "dog", name: "Dog & friend", blurb: "Good dog. Very good dog.", price: 140, w: 18, x: 78, y: 99, art: "doodle-petting" },
  { id: "float", name: "Deep-focus friend", blurb: "So focused they're floating.", price: 160, w: 14, x: 52, y: 62, art: "doodle-levitate" },
];

export const priceOf = (id: string) => SHOP.find((d) => d.id === id)?.price ?? 0;

/** beans earned across every exam (plus kept beans from redone questions) minus what you've spent */
export function beanBalance(save: ArcadeSave) {
  let earned = save.bonus ?? 0;
  for (const e of ARCADE_EXAMS) earned += examStats(e, save.steps).beans;
  const spent = save.owned.reduce((t, id) => t + priceOf(id), 0);
  return Math.max(0, earned - spent);
}
