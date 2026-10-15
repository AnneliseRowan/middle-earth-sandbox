import { useEffect, useState } from 'react';
import { getBooks, getChapters } from '../services/oneApi';

export default function BookPicker() {
    const [books, setBooks] = useState([]);
    const [bookId, setBookId] = useState('');
    const [chapters, setChapters] = useState([]);
    const [chapter, setChapter] = useState(null);
    const [status, setStatus] = useState('loading');

    const bookName = (id) => books.find((book) => book._id === id)?.name;

    useEffect(() => {
        let active = true;
        getBooks()
            .then((loaded) => {
                setBooks(loaded);
                setStatus('ready');
            })
            .catch((error) => {
                setStatus('error');
                // error.message carries the HTTP status (an outage vs. 429 rate limiting). Only the live mount reports,
                // so StrictMode's double mount in development doesn't count one failure twice.
                if (active) window.pendo?.track('red_book_load_failed', { resource: 'books', error_message: error.message });
            });
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!bookId) return;
        setChapters([]);
        setChapter(null);
        getChapters(bookId)
            .then((loaded) => {
                setChapters(loaded);
                // Uses this effect's own bookId, so each event matches the response it came from.
                window.pendo?.track('red_book_volume_selected', {
                    book_id: bookId,
                    book_name: bookName(bookId),
                    chapter_count: loaded.length
                });
            })
            .catch((error) => {
                setStatus('error');
                window.pendo?.track('red_book_load_failed', { resource: 'chapters', book_id: bookId, error_message: error.message });
            });
    }, [bookId]);

    const randomChapter = () => {
        const picked = chapters[Math.floor(Math.random() * chapters.length)];
        setChapter(picked);
        window.pendo?.track('red_book_random_chapter_opened', {
            book_id: bookId,
            book_name: bookName(bookId),
            chapter_id: picked._id,
            chapter_name: picked.chapterName,
            chapter_count: chapters.length
        });
    };

    return (
        <article className="card" id="book-picker-card">
            <h2>The Red Book</h2>
            <p className="muted">Pick a volume and open it to a random chapter.</p>
            {status === 'error' && <p className="error">The palantír is clouded. Couldn’t reach The One API.</p>}
            <label htmlFor="book-select">Volume</label>
            <select id="book-select" value={bookId} onChange={(e) => setBookId(e.target.value)} disabled={!books.length}>
                <option value="">{status === 'loading' ? 'Unrolling scrolls…' : 'Choose a book'}</option>
                {books.map((book) => (
                    <option key={book._id} value={book._id}>
                        {book.name}
                    </option>
                ))}
            </select>
            {bookId && (
                <p className="muted" id="chapter-count">
                    {chapters.length ? `${chapters.length} chapters` : 'Turning pages…'}
                </p>
            )}
            <button type="button" className="btn" id="random-chapter-btn" onClick={randomChapter} disabled={!chapters.length}>
                Open to a random chapter
            </button>
            {chapter && (
                <p className="chapter-name" id="random-chapter-name">
                    📖 {chapter.chapterName}
                </p>
            )}
        </article>
    );
}
