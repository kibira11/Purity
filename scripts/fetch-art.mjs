// Downloads public-domain artwork from Wikimedia Commons into /public/art and records credits.
// Usage: npm run art
// Add a piece by adding { id, title } below (title = the Commons file name), then describe it in content/art.ts.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "art");
const credits = join(root, "content", "art.generated.json");
mkdirSync(outDir, { recursive: true });

const list = [
  { id: "egypt-poynter", title: "1867 Edward Poynter - Israel in Egypt.jpg" },
  { id: "prodigal-son", title: "Rembrandt Harmensz van Rijn - Return of the Prodigal Son - Google Art Project.jpg" },
  { id: "dura-red-sea", title: "Dura Europos fresco Jews cross Red Sea.jpg" },
  { id: "dore-red-sea", title: "037.The Egyptians Drown in the Sea.jpg" },
  { id: "poussin-manna", title: "Poussin, Nicolas - The Jews Gathering the Manna in the Desert -1637 - 1639.jpg" },
  { id: "rembrandt-moses", title: "Rembrandt - Moses with the Ten Commandments - Google Art Project.jpg" },
  { id: "dore-sinai", title: "039.Moses Comes Down from Mount Sinai.jpg" },
  { id: "noah-drunk", title: "Michelangelo drunken Noah.jpg" },
  { id: "joseph-potiphar", title: "Rembrandt Workshop, Joseph Accused by Potiphar's Wife, 1655, NGA 86.jpg" },
  { id: "good-shepherd", title: "Good Shepherd Galla Placidia in Ravenna.jpg" },
  { id: "cole-youth", title: "Thomas Cole - The Voyage of Life Youth, 1842 (National Gallery of Art).jpg" },
  { id: "poussin-ruth", title: "Nicolas Poussin - Summer (Ruth and Boaz) - WGA18342.jpg" },
  { id: "eliezer-rebecca", title: "Eliézer et Rébecca - Nicolas Poussin - Musée du Louvre Peintures INV 7270 ; MR 2315.jpg" },
  { id: "jewish-bride", title: "Rembrandt - The Jewish Bride - WGA19158.jpg" },
  { id: "tissot-promised-land", title: "Tissot Moses Sees the Promised Land from Afar.jpg" },
];

const extraFile = join(root, "scripts", "art-extra.json");
if (existsSync(extraFile)) list.push(...JSON.parse(readFileSync(extraFile, "utf8")));

const UA = { "User-Agent": "JourneyToPurity/0.1 (personal devotional project; contact via repo owner)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const strip = (html = "") =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

async function getJson(url) {
  for (let i = 0; i < 6; i++) {
    const res = await fetch(url, { headers: UA });
    const text = await res.text();
    if (res.status === 429 || text.startsWith("You are making too many")) {
      console.log("  rate limited, waiting 30s...");
      await sleep(30000);
      continue;
    }
    return JSON.parse(text);
  }
  throw new Error("rate limited too long");
}

async function download(url, file) {
  for (let i = 0; i < 6; i++) {
    const res = await fetch(url, { headers: UA });
    if (res.status === 429) {
      console.log("  download rate limited, waiting 30s...");
      await sleep(30000);
      continue;
    }
    if (!res.ok) throw new Error(`download ${res.status}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    return;
  }
  throw new Error("download rate limited too long");
}

const out = existsSync(credits) ? JSON.parse(readFileSync(credits, "utf8")) : {};
const failures = [];

for (const { id, title } of list) {
  const file = `${id}.jpg`;
  if (out[id] && existsSync(join(outDir, file))) {
    console.log(`have ${id}`);
    continue;
  }
  try {
    await sleep(2500);
    const api =
      "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo" +
      "&iiprop=url%7Cextmetadata&iiurlwidth=1400&titles=" +
      encodeURIComponent("File:" + title);
    const json = await getJson(api);
    const page = Object.values(json.query.pages)[0];
    const info = page.imageinfo?.[0];
    if (!info) throw new Error("not found on Commons");
    const meta = info.extmetadata ?? {};
    const license = strip(meta.LicenseShortName?.value) || "Unknown";
    const artist = strip(meta.Artist?.value) || "Unknown";
    const date = strip(meta.DateTimeOriginal?.value || meta.DateTime?.value || "");
    const name = strip(meta.ObjectName?.value) || title.replace(/\.[a-z]+$/i, "");
    await sleep(1500);
    await download(info.thumburl || info.url, join(outDir, file));
    out[id] = { file, title: name, artist, date, source: info.descriptionurl, license };
    writeFileSync(credits, JSON.stringify(out, null, 2) + "\n");
    console.log(`ok   ${id}  [${license}]  ${artist}`);
    if (!/public domain|pd|cc0|cc-zero/i.test(license)) console.log(`  CHECK LICENSE for ${id}: ${license}`);
  } catch (e) {
    console.log(`FAIL ${id}: ${e.message}`);
    failures.push(id);
  }
}

if (failures.length) {
  console.log(`\nFailed: ${failures.join(", ")}`);
  process.exitCode = 1;
}
