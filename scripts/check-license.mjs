// Helper: print license and author for Commons file titles.
// Usage: node scripts/check-license.mjs "Some file.jpg" "Another file.jpg"
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (const t of process.argv.slice(2)) {
  await sleep(2500);
  const u =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata&titles=" +
    encodeURIComponent("File:" + t);
  const r = await fetch(u, { headers: { "User-Agent": "JourneyToPurity/0.1" } });
  const j = await r.json();
  const p = Object.values(j.query.pages)[0];
  const m = p.imageinfo?.[0]?.extmetadata ?? {};
  console.log(`${t} | ${m.LicenseShortName?.value} | ${(m.Artist?.value ?? "").replace(/<[^>]*>/g, "").slice(0, 80)}`);
}
