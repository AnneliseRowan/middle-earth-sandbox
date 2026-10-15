import { useEffect, useRef, useState } from 'react';

export default function Ring() {
    const [worn, setWorn] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [destroyed, setDestroyed] = useState(false);
    const confirmRef = useRef(null);

    useEffect(() => {
        document.body.classList.toggle('ring-worn', worn);
        return () => document.body.classList.remove('ring-worn');
    }, [worn]);

    useEffect(() => {
        if (!confirming) return;
        confirmRef.current?.focus();
        const onKey = (e) => e.key === 'Escape' && setConfirming(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [confirming]);

    const castIt = () => {
        // The confirmed "Let it go". Recorded before the state resets so it can say whether the Ring was being worn.
        window.pendo?.track('ring_destroyed', { ring_was_worn: worn });
        setConfirming(false);
        setWorn(false);
        setDestroyed(true);
    };

    if (destroyed) {
        return (
            <section className="page" id="page-ring">
                <div className="card callout" id="ring-destroyed">
                    <p className="eyebrow">Mount Doom</p>
                    <h1>The Ring is unmade.</h1>
                    <p className="lead">The tower falls, the Eye goes dark, and the eagles are on their way.</p>
                    <button type="button" className="btn" id="forge-again-btn" onClick={() => setDestroyed(false)}>
                        Forge it again (for science)
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="page" id="page-ring">
            <p className="eyebrow">Ash nazg durbatulûk</p>
            <h1>The One Ring</h1>
            <p className="lead">{worn ? 'The world fades to grey. Something is looking for you.' : 'Plain, gold, and heavier than it looks.'}</p>

            <div className={`ring-stage ${worn ? 'worn' : ''}`} id="ring-stage">
                <div className="ring" aria-hidden="true" />
                {worn && (
                    <p className="whisper" id="eye-whisper">
                        👁️ The Eye sees you.
                    </p>
                )}
            </div>

            <div className="row center">
                <button type="button" className="btn" id="wear-ring-toggle" aria-pressed={worn} onClick={() => setWorn((w) => !w)}>
                    {worn ? 'Take off the Ring' : 'Put on the Ring'}
                </button>
                <button type="button" className="btn danger" id="cast-ring-btn" onClick={() => setConfirming(true)}>
                    Cast it into Mount Doom
                </button>
            </div>

            {confirming && (
                <div className="modal-backdrop" onClick={() => setConfirming(false)}>
                    <div
                        className="modal"
                        id="mount-doom-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="mount-doom-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 id="mount-doom-title">Destroy it?</h2>
                        <p>The fires are right there. All you have to do is let go.</p>
                        <div className="row">
                            <button type="button" className="btn danger" id="confirm-cast-btn" ref={confirmRef} onClick={castIt}>
                                Let it go
                            </button>
                            <button type="button" className="btn ghost" id="keep-ring-btn" onClick={() => setConfirming(false)}>
                                No, it’s mine. My precious.
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
