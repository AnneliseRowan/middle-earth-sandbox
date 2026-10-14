import { mkdir, writeFile } from 'node:fs/promises';

const API_KEY = process.env.ONE_API_KEY;
const OUTPUT = new URL('../public/lore.json', import.meta.url);

if (!API_KEY) {
    console.warn('[fetch-lore] ONE_API_KEY not set; skipping lore.json (site will use built-in quotes).');
    process.exit(0);
}

async function request(path) {
    const response = await fetch(`https://the-one-api.dev/v2${path}`, {
        headers: { Authorization: `Bearer ${API_KEY}` }
    });
    if (!response.ok) {
        throw new Error(`The One API responded ${response.status} for ${path}`);
    }
    const { docs } = await response.json();
    return docs;
}

const known = (value) => (value && value !== 'NaN' ? value : 'Unknown');

const [characterDocs, quoteDocs] = await Promise.all([request('/character?limit=1000'), request('/quote?limit=2500')]);

const names = new Map(characterDocs.map(({ _id, name }) => [_id, name]));

const characters = characterDocs
    .map(({ _id, name, race, realm, birth, death, wikiUrl }) => ({
        id: _id,
        name,
        race: known(race),
        realm: known(realm),
        birth: known(birth),
        death: known(death),
        wikiUrl
    }))
    .filter(({ race, wikiUrl }) => race !== 'Unknown' && wikiUrl);

const quotes = quoteDocs
    .map((quote) => ({
        text: quote.dialog.replace(/\s+/g, ' ').trim(),
        speaker: names.get(quote.character) ?? 'Unknown'
    }))
    .filter(({ text }) => text.length >= 30 && text.length <= 180);

await mkdir(new URL('.', OUTPUT), { recursive: true });
await writeFile(OUTPUT, JSON.stringify({ characters, quotes }));
console.log(`[fetch-lore] wrote ${characters.length} characters and ${quotes.length} quotes to public/lore.json`);
