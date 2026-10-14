import { useCallback, useEffect, useState } from 'react';
import { getQuotes } from '../services/oneApi';
import { FALLBACK_QUOTES } from '../data/fellowship';

const ROTATE_MS = 15000;

const pickRandom = (list, current) => {
    if (list.length < 2) return list[0];
    let next = current;
    while (next === current) {
        next = list[Math.floor(Math.random() * list.length)];
    }
    return next;
};

export default function QuoteBanner() {
    const [quotes, setQuotes] = useState(FALLBACK_QUOTES);
    const [source, setSource] = useState('archives');
    const [quote, setQuote] = useState(() => pickRandom(FALLBACK_QUOTES));
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        let active = true;
        getQuotes()
            .then((loaded) => {
                if (!active || !loaded.length) return;
                setQuotes(loaded);
                setSource('api');
                setQuote(pickRandom(loaded));
            })
            .catch((error) => console.warn('[middle-earth-sandbox] falling back to archived quotes:', error.message));
        return () => {
            active = false;
        };
    }, []);

    const nextQuote = useCallback(() => setQuote((current) => pickRandom(quotes, current)), [quotes]);

    useEffect(() => {
        if (paused) return;
        const timer = setInterval(nextQuote, ROTATE_MS);
        return () => clearInterval(timer);
    }, [nextQuote, paused]);

    return (
        <aside className="quote-banner" id="quote-banner">
            <blockquote aria-live="polite" id="quote-text">
                “{quote.text}”<cite id="quote-speaker">— {quote.speaker}</cite>
            </blockquote>
            <div className="quote-actions">
                <span className={`source-badge ${source}`} id="quote-source">
                    {source === 'api' ? 'Live from The One API' : 'From the archives'}
                </span>
                <button type="button" className="btn ghost small" id="quote-pause-btn" onClick={() => setPaused((p) => !p)}>
                    {paused ? 'Resume' : 'Pause'}
                </button>
                <button type="button" className="btn ghost small" id="quote-next-btn" onClick={nextQuote}>
                    Another quote
                </button>
            </div>
        </aside>
    );
}
