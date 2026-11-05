import { useCallback, useEffect, useState } from 'react';
import { getCharacters } from '../services/oneApi';
import { MEMBERS } from '../data/fellowship';

const FALLBACK = MEMBERS.map(({ id, name, race, role }) => ({
    id,
    name,
    race,
    realm: role,
    birth: 'Unknown',
    death: 'Unknown',
    wikiUrl: `https://lotr.fandom.com/wiki/Special:Search?query=${encodeURIComponent(name)}`
}));

const random = (list) => list[Math.floor(Math.random() * list.length)];

export default function CharacterSpotlight() {
    const [characters, setCharacters] = useState(FALLBACK);
    const [character, setCharacter] = useState(() => random(FALLBACK));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCharacters()
            .then((loaded) => {
                setCharacters(loaded);
                setCharacter(random(loaded));
            })
            .catch((error) => console.warn('[middle-earth-sandbox] character spotlight offline:', error.message))
            .finally(() => setLoading(false));
    }, []);

    const summon = useCallback(() => setCharacter(random(characters)), [characters]);

    return (
        <article className="card spotlight" id="character-spotlight">
            <p className="eyebrow">Character spotlight</p>
            <h2 id="spotlight-name">{loading ? 'Consulting the archives…' : character.name}</h2>
            <dl className="facts">
                <dt>Race</dt>
                <dd id="spotlight-race">{character.race}</dd>
                <dt>Realm</dt>
                <dd id="spotlight-realm">{character.realm}</dd>
                <dt>Born</dt>
                <dd id="spotlight-birth">{character.birth}</dd>
                <dt>Died</dt>
                <dd id="spotlight-death">{character.death}</dd>
            </dl>
            <div className="row">
                <button type="button" className="btn primary" id="summon-character-btn" onClick={summon} disabled={loading}>
                    Summon another
                </button>
                {character.wikiUrl && (
                    <a className="btn ghost" id="character-wiki-link" href={character.wikiUrl} target="_blank" rel="noreferrer">
                        Read the lore ↗
                    </a>
                )}
            </div>
        </article>
    );
}
