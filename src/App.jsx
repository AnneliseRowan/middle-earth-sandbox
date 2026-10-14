import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import QuoteBanner from './components/QuoteBanner';
import Shire from './pages/Shire';
import Fellowship from './pages/Fellowship';
import Journey from './pages/Journey';
import Council from './pages/Council';
import Ring from './pages/Ring';
import NotFound from './pages/NotFound';

export default function App() {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <div className="app">
                <NavBar />
                <QuoteBanner />
                <main className="content">
                    <Routes>
                        <Route path="/" element={<Shire />} />
                        <Route path="/fellowship" element={<Fellowship />} />
                        <Route path="/journey" element={<Journey />} />
                        <Route path="/council" element={<Council />} />
                        <Route path="/ring" element={<Ring />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <footer className="footer" id="site-footer">
                    A fan-made sandbox for practicing Pendo tagging. Quotes and characters from{' '}
                    <a id="one-api-link" href="https://the-one-api.dev" target="_blank" rel="noreferrer">
                        The One API
                    </a>
                    .
                </footer>
            </div>
        </BrowserRouter>
    );
}
