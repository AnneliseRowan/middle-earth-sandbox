import { Link } from 'react-router-dom';

export default function NotFound() {
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
