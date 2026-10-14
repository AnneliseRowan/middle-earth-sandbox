const BASE_URL = 'https://the-one-api.dev/v2';

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

async function request(path) {
    const response = await fetch(`${BASE_URL}${path}`);
    if (!response.ok) {
        throw new Error(`The One API responded ${response.status}`);
    }
    const { docs } = await response.json();
    return docs;
}

let lorePromise;

function loadLore() {
    lorePromise ??= fetch(`${import.meta.env.BASE_URL}lore.json`).then((response) => {
        if (!response.ok) {
            throw new Error('lore.json missing (build ran without ONE_API_KEY)');
        }
        return response.json();
    });
    return lorePromise;
}

export async function getCharacters() {
    const { characters } = await loadLore();
    return characters;
}

export async function getQuotes() {
    const { quotes } = await loadLore();
    return quotes;
}

export function getBooks() {
    return cached('one-api:books', () => request('/book'));
}

export function getChapters(bookId) {
    return cached(`one-api:chapters:${bookId}`, () => request(`/book/${bookId}/chapter`));
}
