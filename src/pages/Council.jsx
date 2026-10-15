import { useState } from 'react';

const RACES = ['Hobbit', 'Elf', 'Dwarf', 'Man', 'Wizard', 'Ent'];
const GIFTS = ['My sword', 'My bow', 'My axe', 'My staff', 'A frying pan', 'Second breakfast'];

const EMPTY = { name: '', race: '', gift: '', oath: false };

export default function Council() {
    const [form, setForm] = useState(EMPTY);
    const [error, setError] = useState('');
    const [sworn, setSworn] = useState(null);

    const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

    // A rejected submit looks the same as a successful one in click data, so record which rule blocked it.
    // Only whether a name was entered is sent, never the free-text name itself.
    const reject = (errorType, message) => {
        window.pendo?.track('council_oath_validation_failed', {
            error_type: errorType,
            error_message: message,
            has_name: Boolean(form.name.trim()),
            race: form.race || 'none',
            gift: form.gift || 'none',
            oath: form.oath
        });
        setError(message);
    };

    const submit = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.race) {
            reject('missing_name_or_race', 'The Council requires your name and your people.');
            return;
        }
        if (!form.oath) {
            reject('oath_not_sworn', 'You must swear the oath to join the quest.');
            return;
        }
        setError('');
        // Pendo can't read native <select> values from the click, so send them here (but not the free-text name).
        window.pendo?.track('council_oath_sworn', { race: form.race, gift: form.gift || 'none', has_gift: Boolean(form.gift) });
        setSworn(form);
    };

    const reset = () => {
        setForm(EMPTY);
        setSworn(null);
    };

    if (sworn) {
        return (
            <section className="page" id="page-council">
                <div className="card callout" id="council-confirmation">
                    <p className="eyebrow">The Council has spoken</p>
                    <h1>{sworn.name.trim()} of the {sworn.race}s</h1>
                    <p className="lead">
                        You have sworn to carry {sworn.gift ? sworn.gift.toLowerCase() : 'your courage'} into the dark. May it serve you well.
                    </p>
                    <button type="button" className="btn" id="council-reset-btn" onClick={reset}>
                        Swear in another
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="page" id="page-council">
            <p className="eyebrow">Rivendell</p>
            <h1>The Council of Elrond</h1>
            <p className="lead">Strangers from distant lands, friends of old. Will you join the quest?</p>

            <form className="card form" id="council-form" onSubmit={submit} noValidate>
                <label htmlFor="council-name">Your name</label>
                <input id="council-name" type="text" placeholder="e.g. Samwise" value={form.name} onChange={update('name')} />

                <label htmlFor="council-race">Your people</label>
                <select id="council-race" value={form.race} onChange={update('race')}>
                    <option value="">Choose…</option>
                    {RACES.map((race) => (
                        <option key={race} value={race}>
                            {race}
                        </option>
                    ))}
                </select>

                <label htmlFor="council-gift">What do you offer?</label>
                <select id="council-gift" value={form.gift} onChange={update('gift')}>
                    <option value="">Choose…</option>
                    {GIFTS.map((gift) => (
                        <option key={gift} value={gift}>
                            {gift}
                        </option>
                    ))}
                </select>

                <label className="checkbox" htmlFor="council-oath">
                    <input id="council-oath" type="checkbox" checked={form.oath} onChange={update('oath')} />I will take the Ring to Mordor, though I do not know the way.
                </label>

                {error && (
                    <p className="error" id="council-error" role="alert">
                        {error}
                    </p>
                )}

                <button type="submit" className="btn primary" id="council-submit">
                    Swear the oath
                </button>
            </form>
        </section>
    );
}
