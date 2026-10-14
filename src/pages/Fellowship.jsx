import { useState } from 'react';
import CharacterSpotlight from '../components/CharacterSpotlight';
import { MEMBERS } from '../data/fellowship';

const RACES = ['All', ...new Set(MEMBERS.map((member) => member.race))];

export default function Fellowship() {
    const [race, setRace] = useState('All');
    const [recruited, setRecruited] = useState(() => new Set());

    const visible = race === 'All' ? MEMBERS : MEMBERS.filter((member) => member.race === race);
    const complete = recruited.size === MEMBERS.length;

    const toggle = (id) =>
        setRecruited((current) => {
            const next = new Set(current);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

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
                    <select id="race-filter" value={race} onChange={(e) => setRace(e.target.value)}>
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
