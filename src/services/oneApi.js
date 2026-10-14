const BASE_URL = 'https://the-one-api.dev/v2';
const API_KEY = import.meta.env.VITE_ONE_API_KEY;

export const hasApiKey = Boolean(API_KEY);

const inflight = new Map();

function cached(key, load) {
    const hit = sessionStorage.getItem(key);
    if (hit) {
        return Promise.resolve(JSON.parse(hit));
    }
    if (!inflight.has(key)) {
        const promise = load()
            .then((value) => {
                try {
                    sessionStorage.setItem(key, JSON.stringify(value));
                } catch {
                    // sessionStorage full or disabled; serve uncached
                }
                return value;
            })
            .finally(() => inflight.delete(key));
        inflight.set(key, promise);
    }
    return inflight.get(key);
}

async function request(path, { auth = true } = {}) {
    if (auth && !API_KEY) {
        throw new Error('VITE_ONE_API_KEY is not set');
    }
    const response = await fetch(`${BASE_URL}${path}`, {
        headers: auth ? { Authorization: `Bearer ${API_KEY}` } : {}
    });
    if (!response.ok) {
        throw new Error(`The One API responded ${response.status}`);
    }
    const { docs } = await response.json();
    return docs;
}

const known = (value) => (value && value !== 'NaN' ? value : 'Unknown');

function getAllCharacters() {
    return cached('one-api:characters', async () => {
        const docs = await request('/character?limit=1000');
        return docs.map(({ _id, name, race, realm, birth, death, wikiUrl }) => ({
            id: _id,
            name,
            race: known(race),
            realm: known(realm),
            birth: known(birth),
            death: known(death),
            wikiUrl
        }));
    });
}

export async function getCharacters() {
    const characters = await getAllCharacters();
    return characters.filter(({ race, wikiUrl }) => race !== 'Unknown' && wikiUrl);
}

export function getQuotes() {
    return cached('one-api:quotes', async () => {
        const [quotes, characters] = await Promise.all([request('/quote?limit=2500'), getAllCharacters()]);
        const names = new Map(characters.map((character) => [character.id, character.name]));
        return quotes
            .map((quote) => ({
                text: quote.dialog.replace(/\s+/g, ' ').trim(),
                speaker: names.get(quote.character) ?? 'Unknown'
            }))
            .filter(({ text }) => text.length >= 30 && text.length <= 180);
    });
}

export function getBooks() {
    return cached('one-api:books', () => request('/book', { auth: false }));
}

export function getChapters(bookId) {
    return cached(`one-api:chapters:${bookId}`, () => request(`/book/${bookId}/chapter`, { auth: false }));
}
