import { useEffect, useState } from 'react';
import CharacterSpotlight from '../components/CharacterSpotlight';
import { MEMBERS } from '../data/fellowship';

const RACES = ['All', ...new Set(MEMBERS.map((member) => member.race))];

const membersOfRace = (race) => (race === 'All' ? MEMBERS : MEMBERS.filter((member) => member.race === race));

// Kept outside the component so fellowship_completed is sent once per page load: dismissing and re-recruiting
// the last companion (or leaving and rebuilding the roster) doesn't report the same milestone again.
let completionTracked = false;

export default function Fellowship() {
    const [race, setRace] = useState('All');
    const [recruited, setRecruited] = useState(() => new Set());

    const visible = membersOfRace(race);
    const complete = recruited.size === MEMBERS.length;

    // An effect rather than the setRecruited updater, which StrictMode calls twice.
    useEffect(() => {
        if (!complete || completionTracked) return;
        completionTracked = true;
        // A Set keeps insertion order, so this is the order the companions were recruited in.
        const order = Array.from(recruited);
        window.pendo?.track('fellowship_completed', {
            member_count: MEMBERS.length,
            recruitment_order: order.join(','),
            last_recruited_member_id: order[order.length - 1],
            race_filter: race
        });
    }, [complete]);

    const toggle = (id) =>
        setRecruited((current) => {
            const next = new Set(current);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    // The click on #race-filter doesn't say which option was chosen, so send it with the number of companions it shows.
    const applyRaceFilter = (e) => {
        const value = e.target.value;
        window.pendo?.track('fellowship_race_filter_applied', {
            race: value,
            previous_race: race,
            results_count: membersOfRace(value).length,
            recruited_count: recruited.size
        });
        setRace(value);
    };

    return (
        <section className="page" id="page-fellowship">
            <div className="page-header">
                <div>
                    <p className="eyebrow">Rivendell</p>
                    <h1>Assemble the Fellowship</h1>
                    <p className="lead" id="recruit-count">
                        {complete ? 'The Fellowship is complete. Nine walkers, one quest.' : `${recruited.size} of ${MEMBERS.length} companions recruited`}
                    </p>
                </div>
                <div className="filter">
                    <label htmlFor="race-filter">Filter by race</label>
                    <select id="race-filter" value={race} onChange={applyRaceFilter}>
                        {RACES.map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <CharacterSpotlight />

            <div className="grid cards">
                {visible.map((member) => {
                    const isRecruited = recruited.has(member.id);
                    return (
                        <article key={member.id} className={`card member ${isRecruited ? 'recruited' : ''}`} id={`member-${member.id}`}>
                            <div className="member-emoji" aria-hidden="true">
                                {member.emoji}
                            </div>
                            <h3>{member.name}</h3>
                            <p className="tag">
                                {member.race} · {member.role}
                            </p>
                            <p className="muted">{member.blurb}</p>
                            <button
                                type="button"
                                className={`btn ${isRecruited ? 'ghost' : 'primary'}`}
                                id={`recruit-${member.id}`}
                                aria-pressed={isRecruited}
                                onClick={() => toggle(member.id)}
                            >
                                {isRecruited ? 'Dismiss' : 'Recruit'}
                            </button>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
