import type { Artwork } from "@/lib/types";

/**
 * Public-domain artwork. Files live in /public/art and are fetched, with their credits,
 * by `npm run art` (scripts/fetch-art.mjs), which writes content/art.generated.json.
 * `story` is our own short note on each piece.
 */
import generated from "./art.generated.json";

const gen = generated as Record<
  string,
  { file: string; title: string; artist: string; date: string; source: string; license: string }
>;

type Curated = { id: string; stage?: string; story: string };

export const curated: Curated[] = [
  {
    id: "good-shepherd",
    stage: "egypt",
    story:
      "A fifth-century mosaic in a small chapel in Ravenna, Italy. Christ sits among His sheep, unhurried, one hand on a golden cross. It is one of the oldest ways Christians ever pictured Him: not a judge keeping score, but a shepherd keeping His own. Blessed are the pure in heart, for they shall see Him.",
  },
  {
    id: "egypt-poynter",
    stage: "egypt",
    story:
      "Edward Poynter's Israel in Egypt (1867) shows slaves harnessed to a colossal stone sphinx while overseers drive them on. He studied Egyptian monuments for months to get the setting right. Look at the faces and the rope. Bondage is never abstract. It is a weight someone is hauling, day after day.",
  },
  {
    id: "prodigal-son",
    stage: "egypt",
    story:
      "Rembrandt painted The Return of the Prodigal Son near the end of his life, after losing most of what he loved. The son kneels in rags with a shaved head. The father does not interrogate him. He holds him. Notice the father's two hands: one strong and one soft. This is how God receives people who stop hiding.",
  },
  {
    id: "dura-red-sea",
    stage: "red-sea",
    story:
      "A fresco from the synagogue at Dura-Europos, in what is now Syria, painted around AD 245. The whole building was covered in scenes from Scripture, then buried under a city wall during a siege and rediscovered in 1932. Here Israel crosses the sea. Even then, people knew this story was theirs to walk, not just to read.",
  },
  {
    id: "dore-red-sea",
    stage: "red-sea",
    story:
      "Gustave Dore engraved over two hundred Bible scenes for his 1866 illustrated Bible. This one catches the moment the walls of water fall on Pharaoh's army. The chains that looked unbreakable behind you are not simply left behind. God deals with them.",
  },
  {
    id: "joseph-potiphar",
    stage: "red-sea",
    story:
      "From the workshop of Rembrandt, 1655. Potiphar's wife points at the cloak Joseph left in her hands when he ran. Joseph fled, and it cost him his reputation and his freedom for years. Yet Genesis keeps saying the Lord was with him. Fleeing is never wasted.",
  },
  {
    id: "poussin-manna",
    stage: "wilderness",
    story:
      "Nicolas Poussin painted The Israelites Gathering Manna in the late 1630s. The people are hungry, amazed, and kneeling, picking up bread they did not bake. The lesson of the wilderness is daily: not a lifetime supply, but enough for today, every morning, from a faithful hand.",
  },
  {
    id: "dore-sinai",
    stage: "sinai",
    story:
      "Dore shows Moses coming down the mountain with his face shining after speaking with God (Exodus 34). People who spend time in the presence of God start to carry it in their faces. That is what a clean life looks like from the outside: not stiff, but radiant.",
  },
  {
    id: "rembrandt-moses",
    stage: "sinai",
    story:
      "Rembrandt, 1659. Moses lifts the tablets to dash them to pieces after seeing the golden calf. Israel had been rescued, fed and given the Law, and still reached for an idol. A reminder that rescue is not the same as renewal, and why we keep building new habits after the chains are gone.",
  },
  {
    id: "noah-drunk",
    stage: "sinai",
    story:
      "Michelangelo's fresco from the Sistine Chapel ceiling (c. 1509). Noah survived the flood, planted a vineyard, and was undone by the wine (Genesis 9:20-21). The greatest rescue in the Bible was followed within a chapter by a man stumbling in his tent. No one is too righteous for the warning of Proverbs 20:1.",
  },
  {
    id: "cole-youth",
    stage: "jordan",
    story:
      "Thomas Cole's The Voyage of Life: Youth (1842). A young man steers a gilded boat down a bright river, eyes fixed on a castle in the clouds, while his guardian angel watches from the bank. Cole painted the series to show that life is a river we do not travel alone. The best journeys are made with someone watching your back.",
  },
  {
    id: "eliezer-rebecca",
    stage: "promised-land",
    story:
      "Nicolas Poussin, 1648. Abraham's servant, sent to find a wife for Isaac, meets Rebekah at a well, and she offers water not only to him but to his camels (Genesis 24). Her character was revealed by a small kindness long before anyone said a word about love. Courtship begins with watching what people do when they think it is small.",
  },
  {
    id: "poussin-ruth",
    stage: "promised-land",
    story:
      "Summer, from Poussin's cycle of the four seasons (1660-64). Ruth kneels before Boaz in the harvest field. Their story is a whole book of the Bible about a young woman and an older man whose love is built on honor, provision and patience, and whose courtship happens in the open, with the whole town watching.",
  },
  {
    id: "jewish-bride",
    stage: "promised-land",
    story:
      "Rembrandt painted this couple around 1665 in the guise of an Old Testament pair, perhaps Isaac and Rebekah. Look at their hands. Nothing here is grabbing. It is gentleness with strength in it, which is the opposite of everything the world teaches about desire, and the picture of what marriage can be.",
  },
  {
    id: "tissot-promised-land",
    stage: "zion",
    story:
      "James Tissot, around 1900. Moses stands on Mount Nebo and sees the whole land he is not permitted to enter. Grace and consequence live side by side in Scripture, and the story did not end there: Joshua took the people in. Your story, too, continues past your failures.",
  },
];

/** Clean, human-checked titles and dates (the Commons metadata is often noisy). */
const meta: Record<string, { title: string; artist: string; date: string }> = {
  "good-shepherd": { title: "The Good Shepherd, Mausoleum of Galla Placidia", artist: "Early Christian mosaicists, Ravenna", date: "c. AD 425-450" },
  "egypt-poynter": { title: "Israel in Egypt", artist: "Edward Poynter", date: "1867" },
  "prodigal-son": { title: "The Return of the Prodigal Son", artist: "Rembrandt van Rijn", date: "c. 1668" },
  "dura-red-sea": { title: "The Crossing of the Red Sea, Dura-Europos synagogue", artist: "Unknown artists of Dura-Europos", date: "c. AD 244-256" },
  "dore-red-sea": { title: "The Egyptians Drown in the Sea", artist: "Gustave Dor\u00e9", date: "1866" },
  "joseph-potiphar": { title: "Joseph Accused by Potiphar's Wife", artist: "Rembrandt Workshop", date: "1655" },
  "poussin-manna": { title: "The Israelites Gathering Manna in the Desert", artist: "Nicolas Poussin", date: "1637\u20131639" },
  "dore-sinai": { title: "Moses Comes Down from Mount Sinai", artist: "Gustave Dor\u00e9", date: "1866" },
  "rembrandt-moses": { title: "Moses with the Ten Commandments", artist: "Rembrandt van Rijn", date: "1659" },
  "noah-drunk": { title: "The Drunkenness of Noah", artist: "Michelangelo", date: "c. 1509" },
  "cole-youth": { title: "The Voyage of Life: Youth", artist: "Thomas Cole", date: "1842" },
  "eliezer-rebecca": { title: "Eliezer and Rebecca", artist: "Nicolas Poussin", date: "1648" },
  "poussin-ruth": { title: "Summer (Ruth and Boaz)", artist: "Nicolas Poussin", date: "1660\u20131664" },
  "jewish-bride": { title: "The Jewish Bride", artist: "Rembrandt van Rijn", date: "c. 1665\u20131669" },
  "tissot-promised-land": { title: "Moses Sees the Promised Land from Afar", artist: "James Tissot", date: "c. 1896\u20131902" },
};

export const artworks: Artwork[] = curated
  .filter((c) => gen[c.id])
  .map((c) => ({ id: c.id, stage: c.stage, story: c.story, ...gen[c.id], ...meta[c.id] }));

export const artById = (id: string) => artworks.find((a) => a.id === id);
