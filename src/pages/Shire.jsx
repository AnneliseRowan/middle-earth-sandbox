import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookPicker from '../components/BookPicker';
import { MEALS } from '../data/fellowship';

export default function Shire() {
    const navigate = useNavigate();
    const [meals, setMeals] = useState(0);

    const nextMeal = MEALS[meals % MEALS.length];

    return (
        <section className="page" id="page-shire">
            <div className="hero">
                <p className="eyebrow">Hobbiton · The Shire</p>
                <h1>Welcome to the Shire</h1>
                <p className="lead">
                    Green hills, round doors, and seven meals a day. Somewhere in a drawer at Bag End, a plain gold ring
                    is waiting.
                </p>
                <div className="hero-actions">
                    <button type="button" className="btn primary" id="begin-journey-btn" onClick={() => navigate('/journey')}>
                        Begin your journey
                    </button>
                    <button type="button" className="btn" id="meet-fellowship-btn" onClick={() => navigate('/fellowship')}>
                        Meet the Fellowship
                    </button>
                </div>
            </div>

            <div className="grid two">
                <article className="card" id="second-breakfast-card">
                    <h2>Second Breakfast Tracker</h2>
                    <p className="big-number" id="meal-count">
                        {meals}
                    </p>
                    <p className="muted">
                        meals eaten today · next up: <strong id="next-meal">{nextMeal}</strong>
                    </p>
                    <div className="row">
                        <button type="button" className="btn primary" id="eat-meal-btn" onClick={() => setMeals((m) => m + 1)}>
                            Eat {nextMeal}
                        </button>
                        <button type="button" className="btn ghost" id="reset-meals-btn" onClick={() => setMeals(0)} disabled={!meals}>
                            Fast like an Elf
                        </button>
                    </div>
                </article>
                <BookPicker />
            </div>
            <div>
                <p>Hobbits keep seven meals a day.</p>
                <p>The Party Tree stands in the Party Field.</p>
                <p>Pipe-weed is harvested in late autumn.</p>
            </div>
        </section>
    );
}
