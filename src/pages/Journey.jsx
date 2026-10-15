import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LOCATIONS } from '../data/fellowship';

export default function Journey() {
    const [reached, setReached] = useState(0);

    const last = LOCATIONS.length - 1;
    const percent = Math.round((reached / last) * 100);

    const travel = (index) => {
        setReached(index);
        // Reaching Mount Doom is the journey's single outcome event; the travel-* clicks only show the steps.
        if (index === last) {
            const destination = LOCATIONS[index];
            window.pendo?.track('journey_completed', {
                final_location_id: destination.id,
                final_location_name: destination.name,
                final_region: destination.region,
                stops_visited: LOCATIONS.length
            });
        }
    };

    // Recorded before progress goes back to 0: how far the traveller got, and whether it was a replay or giving up partway.
    const reset = () => {
        window.pendo?.track('journey_reset', {
            from_location_id: LOCATIONS[reached].id,
            from_location_name: LOCATIONS[reached].name,
            stops_reached: reached,
            progress_percent: percent,
            was_completed: reached === last
        });
        setReached(0);
    };

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
                <button type="button" className="btn ghost" id="reset-journey-btn" onClick={reset} disabled={!reached}>
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
                                <button type="button" className="btn primary" id={`travel-${location.id}`} onClick={() => travel(index)}>
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
