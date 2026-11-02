/** Display names and matching public-domain art tags per topic (safe to use on server or client). */
const TOPIC_NAMES: Record<string, string> = {
  "dynamic-memory": "Dynamic memory", "linked-lists": "Linked lists", stacks: "Stacks", queues: "Queues", "binary-trees": "Binary trees",
  "avl-trees": "AVL trees", heaps: "Heaps", "hash-tables": "Hash tables", tries: "Tries", "big-o": "Big-O", "timing-problems": "Timing",
  summations: "Summations", recurrences: "Recurrences", recursion: "Recursion", sorting: "Sorting", bitwise: "Bitwise",
  backtracking: "Backtracking", "base-conversion": "Base conversion",
};
export const topicName = (t: string) => TOPIC_NAMES[t] ?? t;

/** which public-domain prints suit each topic (tags from public/art/pd/credits.json) */
const ART_TAGS: Record<string, string[]> = {
  heaps: ["owl", "bird", "cranes"], "binary-trees": ["garden", "pine", "magnolia"], "avl-trees": ["garden", "iris", "wisteria"],
  "linked-lists": ["train", "travel", "swallow"], "dynamic-memory": ["cat", "interior"], "big-o": ["moon", "night", "rain"],
  "timing-problems": ["moon", "night"], recursion: ["goldfish", "water", "fish"], sorting: ["butterfly", "flowers"],
  stacks: ["tea", "still-life"], queues: ["lantern", "shop", "people"], bitwise: ["parrot", "kingfisher"], tries: ["pine", "owl"],
};
export const artTags = (topic: string) => ART_TAGS[topic] ?? ["cat", "owl", "tea", "books", "fox"];
