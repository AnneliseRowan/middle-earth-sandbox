import { useEffect, useState } from 'react';
import { getBooks, getChapters } from '../services/oneApi';

export default function BookPicker() {
    const [books, setBooks] = useState([]);
    const [bookId, setBookId] = useState('');
    const [chapters, setChapters] = useState([]);
    const [chapter, setChapter] = useState(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        getBooks()
            .then((loaded) => {
                setBooks(loaded);
                setStatus('ready');
            })
            .catch(() => setStatus('error'));
    }, []);

    useEffect(() => {
        if (!bookId) return;
        setChapters([]);
        setChapter(null);
        getChapters(bookId)
            .then(setChapters)
            .catch(() => setStatus('error'));
    }, [bookId]);

    const randomChapter = () => setChapter(chapters[Math.floor(Math.random() * chapters.length)]);

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
