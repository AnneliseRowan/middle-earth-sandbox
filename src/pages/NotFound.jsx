import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NotFound() {
    const { pathname } = useLocation();

    // Any unmatched path lands here, so there's no URL rule to tag: report the bad path and its referrer, capped so an
    // unusually long URL can't push the event past Pendo's 512-byte property limit.
    useEffect(() => {
        // Deferred so cleanup cancels the extra run from StrictMode's double mount in development.
        const timer = setTimeout(() => {
            window.pendo?.track('page_not_found', { path: pathname.slice(0, 200), referrer: document.referrer.slice(0, 200) });
        });
        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <section className="page" id="page-not-found">
            <div className="card callout">
                <p className="eyebrow">404</p>
                <h1>One does not simply walk into this page.</h1>
                <p className="lead">This path leads nowhere. Even the Rangers don’t come here.</p>
                <Link className="btn primary" id="back-to-shire-link" to="/">
                    Back to the Shire
                </Link>
            </div>
        </section>
    );
}
