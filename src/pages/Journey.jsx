import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LOCATIONS } from '../data/fellowship';

export default function Journey() {
    const [reached, setReached] = useState(0);

    const last = LOCATIONS.length - 1;
    const percent = Math.round((reached / last) * 100);

    return (
        <section className="page" id="page-journey">
            <div className="page-header">
                <div>
                    <p className="eyebrow">There and back again</p>
                    <h1>The Road Goes Ever On</h1>
                    <p className="lead">
                        Currently at <strong id="current-location">{LOCATIONS[reached].name}</strong>
                    </p>
                </div>
                <button type="button" className="btn ghost" id="reset-journey-btn" onClick={() => setReached(0)} disabled={!reached}>
                    Return to Bag End
                </button>
            </div>

            <div className="progress" id="journey-progress" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-fill" style={{ width: `${percent}%` }} />
                <span className="progress-label">{percent}% of the way to Mount Doom</span>
            </div>

            <ol className="route">
                {LOCATIONS.map((location, index) => {
                    const state = index < reached ? 'visited' : index === reached ? 'current' : index === reached + 1 ? 'next' : 'ahead';
                    return (
                        <li key={location.id} className={`stop ${state}`} id={`stop-${location.id}`}>
                            <span className="stop-emoji" aria-hidden="true">
                                {location.emoji}
                            </span>
                            <div className="stop-body">
                                <h3>{location.name}</h3>
                                <p className="tag">{location.region}</p>
                                <p className="muted">{location.description}</p>
                            </div>
                            {state === 'next' && (
                                <button type="button" className="btn primary" id={`travel-${location.id}`} onClick={() => setReached(index)}>
                                    Travel
                                </button>
                            )}
                            {state === 'visited' && <span className="badge">Visited</span>}
                            {state === 'current' && <span className="badge gold">You are here</span>}
                        </li>
                    );
                })}
            </ol>

            {reached === last && (
                <div className="card callout" id="journey-complete">
                    <h2>You stand at the Crack of Doom.</h2>
                    <p>One thing left to do.</p>
                    <Link className="btn primary" id="to-the-ring-link" to="/ring">
                        Face the Ring
                    </Link>
                </div>
            )}
        </section>
    );
}
