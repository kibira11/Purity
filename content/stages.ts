import type { Stage } from "@/lib/types";

/**
 * The eight stages of the journey follow Israel from slavery in Egypt to worship on Zion.
 * `sky` runs from deep night to golden dawn so the whole map brightens as you advance.
 */
export const stages: Stage[] = [
  {
    id: "egypt",
    number: 1,
    name: "Egypt",
    place: "The land of chains",
    subtitle: "Seeing the Chains",
    story: "A people crushed by slavery cry out, and God hears.",
    storyRef: "Exodus 2:23-25",
    blurb:
      "Before there is freedom there is honesty. Here you learn what purity really is, name what has held you, and cry out to the One who hears.",
    sky: ["#12152b", "#2b3060"],
    accent: "#8b8da3",
  },
  {
    id: "passover",
    number: 2,
    name: "Passover",
    place: "The night of the lamb",
    subtitle: "Bought Free",
    story: "The blood of a lamb on the doorposts, and judgment passes over.",
    storyRef: "Exodus 12:1-13",
    blurb:
      "Freedom begins with a gift, not a performance. You were bought. This stage settles who you are before it asks what you will do.",
    sky: ["#1b1f3b", "#3b3568"],
    accent: "#c9826b",
  },
  {
    id: "red-sea",
    number: 3,
    name: "Red Sea",
    place: "The waters that split",
    subtitle: "Flee and Break Free",
    story: "Pharaoh's army behind, the sea in front, and a road through the water.",
    storyRef: "Exodus 14:13-22",
    blurb:
      "The hardest, most honest stage. Pornography, masturbation and fornication faced plainly, with real tools to flee, and real grace when you fall.",
    sky: ["#2b3060", "#5a4a7c"],
    accent: "#6f93b5",
  },
  {
    id: "wilderness",
    number: 4,
    name: "Wilderness",
    place: "The long, honest road",
    subtitle: "Renewing the Mind",
    story: "Forty years of daily bread, daily trust, and slowly new hearts.",
    storyRef: "Exodus 16:1-18",
    blurb:
      "Freedom from Egypt is quick. Freedom of the mind is learned. Habits, the brain and the hormones, and how God renews us as we cooperate.",
    sky: ["#5a4a7c", "#a76d7a"],
    accent: "#d19a5f",
  },
  {
    id: "sinai",
    number: 5,
    name: "Sinai",
    place: "The mountain of fire",
    subtitle: "The Temple of the Body",
    story: "God meets His people on the mountain and builds a dwelling place among them.",
    storyRef: "Exodus 19:16-20",
    blurb:
      "Alcohol, weed and drugs, and the body God gave you: sleep, sun, food, movement, rest. Your body is not the enemy. It is a temple.",
    sky: ["#a76d7a", "#d98f6d"],
    accent: "#e07a4c",
  },
  {
    id: "jordan",
    number: 6,
    name: "Jordan",
    place: "The crossing together",
    subtitle: "Walking Together",
    story: "The priests step into the river first, and the whole people crosses with stones to remember.",
    storyRef: "Joshua 3:14-17",
    blurb:
      "No one crosses alone. Accountability, confession, and honest friendship between a young man and a young woman who want to walk in purity.",
    sky: ["#d98f6d", "#eab27a"],
    accent: "#4f8fa3",
  },
  {
    id: "promised-land",
    number: 7,
    name: "Promised Land",
    place: "The land of milk and honey",
    subtitle: "Love, Courtship, Marriage",
    story: "A land they did not build, with vines they did not plant.",
    storyRef: "Joshua 21:43-45",
    blurb:
      "What does the Bible say about a young man and a young woman? How does a man find a wife, a woman a husband? Courtship, boundaries, and the beautiful design of marriage.",
    sky: ["#eab27a", "#f4d596"],
    accent: "#7d8f69",
  },
  {
    id: "zion",
    number: 8,
    name: "Zion",
    place: "The city on the hill",
    subtitle: "Living Free, Lifting Others",
    story: "A free people at worship, and a light for the nations.",
    storyRef: "Psalm 126:1-3",
    blurb:
      "Walking in the Spirit for a lifetime, rising after a fall, and turning back to strengthen others. Your story becomes someone else's way out.",
    sky: ["#f4d596", "#fbeccb"],
    accent: "#e8b86d",
  },
];

export const stageById = (id: string) => stages.find((s) => s.id === id);
