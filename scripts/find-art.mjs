// Helper: search Wikimedia Commons for artwork file titles.
// Usage: node scripts/find-art.mjs "Poynter Israel in Egypt" "Rembrandt Prodigal Son"
const API = "https://commons.wikimedia.org/w/api.php";
const queries = process.argv.slice(2);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (const q of queries) {
  await sleep(2500);
  const url = `${API}?action=query&list=search&srsearch=${encodeURIComponent(q)}&srnamespace=6&srlimit=6&format=json&origin=*`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "JourneyToPurity/0.1 (personal project)" } });
    const json = await res.json();
    console.log(`\n# ${q}`);
    for (const r of json.query.search) console.log("  " + r.title);
  } catch (e) {
    console.log(`\n# ${q}\n  ERROR ${e.message}`);
  }
}
