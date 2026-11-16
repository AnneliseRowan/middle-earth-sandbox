import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const LINKS = [
    { id: 'nav-shire', to: '/', label: 'The Shire', end: true },
    { id: 'nav-fellowship', to: '/fellowship', label: 'Fellowship' },
    { id: 'nav-journey', to: '/journey', label: 'Journey' },
    { id: 'nav-council', to: '/council', label: 'Council' },
    { id: 'nav-ring', to: '/ring', label: 'The Ring' }
];

function ThemeToggle() {
    const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
    const toggle = () => {
        const next = !dark;
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('mes-theme', next ? 'dark' : 'light');
        setDark(next);
    };
    return (
        <button type="button" id="nav-theme-toggle" className="theme-toggle" onClick={toggle} aria-pressed={dark}>
            {dark ? '☀️ Light' : '🌙 Dark'}
        </button>
    );
}

export default function NavBar() {
    return (
        <header className="navbar" id="main-nav">
            <NavLink to="/" className="brand" id="nav-brand">
                <span aria-hidden="true">💍</span> Middle-earth Sandbox
            </NavLink>
            <nav aria-label="Main">
                <ul className="nav-links">
                    {LINKS.map(({ id, to, label, end }) => (
                        <li key={id}>
                            <NavLink id={id} to={to} end={end} className={({ isActive }) => (isActive ? 'active' : '')}>
                                {label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <ThemeToggle />
        </header>
    );
}
