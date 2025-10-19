import React from 'react';
import './Sustainability.css';

const SustainabilityComponent = () => {
  return (
    <div className="sustainability-page">
      {/* <a href="#main" style={{position: 'absolute', left: '-999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden'}}>
        Skip to content
      </a>

      <header aria-label="Site header">
        <div className="container">
          <div className="brand">Capsule</div>
        </div> 
      </header>*/}

      <main id="main" className="sust" role="main">
        {/* Hero */}
        <section className="sust-hero" aria-labelledby="sust-title">
          <div className="sust-hero__wrap">
            <h1 id="sust-title" className="sust-title">Sustainability at Capsule</h1>
            <p className="sust-subtitle">
              We help people buy less and wear more. Share, rent, and resell to keep great clothes in circulation—and out of landfills.
            </p>

            <div className="sust-stats" aria-label="Key stats">
              <div className="sust-stat" role="group" aria-label="More wears per item">
                <div className="sust-stat__value">3×</div>
                <div className="sust-stat__label">More wears per item</div>
              </div>
              <div className="sust-stat" role="group" aria-label="Wardrobe emissions">
                <div className="sust-stat__value">–45%</div>
                <div className="sust-stat__label">Wardrobe CO₂e (est.)</div>
              </div>
              <div className="sust-stat" role="group" aria-label="Recirculated garments">
                <div className="sust-stat__value">+60%</div>
                <div className="sust-stat__label">Garments re-circulated</div>
              </div>
              <div className="sust-stat" role="group" aria-label="Fast-fashion sourcing">
                <div className="sust-stat__value">0%</div>
                <div className="sust-stat__label">Fast-fashion sourcing</div>
              </div>
            </div>

            <a className="sust-cta" href="/how-it-works">See how Capsule works</a>
          </div>
          <div className="sust-hero__bg" aria-hidden="true"></div>
        </section>

        {/* Rest of your component remains the same */}
        {/* Pillars */}
        <section className="sust-section container" aria-labelledby="pillars">
          <h2 id="pillars" className="sust-h2">Our sustainability pillars</h2>
          <div className="sust-grid">
            <article className="sust-card">
              <div className="sust-card__icon" aria-hidden="true">🌿</div>
              <div>
                <h3 className="sust-card__title">Circular first</h3>
                <p className="sust-card__body">Design for reuse, repair, and resale. Every listing extends the life of a garment.</p>
              </div>
            </article>

            <article className="sust-card">
              <div className="sust-card__icon" aria-hidden="true">💧</div>
              <div>
                <h3 className="sust-card__title">Lower footprint</h3>
                <p className="sust-card__body">Promote low-impact care: cold wash, line dry, mend—then relist.</p>
              </div>
            </article>

            <article className="sust-card">
              <div className="sust-card__icon" aria-hidden="true">🤝</div>
              <div>
                <h3 className="sust-card__title">Fair participation</h3>
                <p className="sust-card__body">Clear rules, verified users, and dispute resolution protect people and clothes.</p>
              </div>
            </article>

            <article className="sust-card">
              <div className="sust-card__icon" aria-hidden="true">📦</div>
              <div>
                <h3 className="sust-card__title">Responsible logistics</h3>
                <p className="sust-card__body">Right-sized packaging, reusable mailers where possible, and grouped deliveries.</p>
              </div>
            </article>
          </div>
        </section>

        {/* Impact / KPIs */}
        <section className="sust-section container" aria-labelledby="impact">
          <h2 id="impact" className="sust-h2">Impact we track</h2>
          <ul className="sust-kpis">
            <li><strong>Wears extended per item</strong> (target: ≥ 20)</li>
            <li><strong>CO₂e avoided</strong> vs. new purchases (kg)</li>
            <li><strong>Items diverted from landfill</strong> (count & %)</li>
            <li><strong>Repair events</strong> completed (tailors / DIY)</li>
            <li><strong>Reusable mailer return rate</strong> (%)</li>
          </ul>
          <p className="sust-note">We publish quarterly summaries with methodology and assumptions. Last update:
            <time dateTime="2025-09-30">30 Sep 2025</time>.
          </p>
        </section>

        {/* How Capsule reduces impact */}
        <section className="sust-section container" aria-labelledby="how">
          <h2 id="how" className="sust-h2">How Capsule reduces fashion waste</h2>
          <ol className="sust-steps">
            <li>
              <span className="sust-step-num">1</span>
              <div>
                <h3>List smarter</h3>
                <p>Clear photos, materials, and care info help each piece find more wears.</p>
              </div>
            </li>
            <li>
              <span className="sust-step-num">2</span>
              <div>
                <h3>Match by fit & use</h3>
                <p>Filters and size guidance reduce returns and unnecessary shipping.</p>
              </div>
            </li>
            <li>
              <span className="sust-step-num">3</span>
              <div>
                <h3>Repair before replace</h3>
                <p>We nudge repairs and offer partner discounts for mending.</p>
              </div>
            </li>
            <li>
              <span className="sust-step-num">4</span>
              <div>
                <h3>Relist with one tap</h3>
                <p>Keep garments circulating. The longer they live, the lower the footprint.</p>
              </div>
            </li>
          </ol>
        </section>

        {/* Commitments */}
        <section className="sust-section container" aria-labelledby="commitments">
          <h2 id="commitments" className="sust-h2">Our 2025–2026 commitments</h2>
          <div className="sust-grid sust-grid--3">
            <div className="sust-commit"><span className="sust-commit__tick" aria-hidden="true">✓</span><span>Quarterly impact reports with third-party review</span></div>
            <div className="sust-commit"><span className="sust-commit__tick" aria-hidden="true">✓</span><span>Reusable mailers pilot in 3 cities</span></div>
            <div className="sust-commit"><span className="sust-commit__tick" aria-hidden="true">✓</span><span>In-app repair finder & how-to guides</span></div>
            <div className="sust-commit"><span className="sust-commit__tick" aria-hidden="true">✓</span><span>Seller education on durable materials</span></div>
            <div className="sust-commit"><span className="sust-commit__tick" aria-hidden="true">✓</span><span>Scope 1–3 baseline and reduction plan</span></div>
            <div className="sust-commit"><span className="sust-commit__tick" aria-hidden="true">✓</span><span>Community swaps & take-back events</span></div>
          </div>
        </section>

        {/* Materials guidance */}
        <section className="sust-section container" aria-labelledby="materials">
          <h2 id="materials" className="sust-h2">Materials we recommend</h2>
          <div className="sust-materials">
            <div className="sust-material"><strong>Organic cotton</strong><span>Choose heavier knits; avoid tumble drying.</span></div>
            <div className="sust-material"><strong>Wool</strong><span>Air between wears; hand-wash cold; depill, don't discard.</span></div>
            <div className="sust-material"><strong>Linen</strong><span>Strong, cool, lasts long; expect natural creasing.</span></div>
            <div className="sust-material"><strong>Recycled polyester</strong><span>Use micro-fiber catchers when washing.</span></div>
            <div className="sust-material"><strong>Tencel / Lyocell</strong><span>Breathable and durable with gentle care.</span></div>
          </div>
        </section>

        {/* FAQs */}
        <section className="sust-section container" aria-labelledby="faqs">
          <h2 id="faqs" className="sust-h2">FAQs</h2>
          <details className="sust-faq">
            <summary>How do you calculate "CO₂e avoided"?</summary>
            <p>We compare the estimated impact of additional wears via Capsule against buying a similar new item, using published LCA ranges and our own usage data. We'll publish our method in each report.</p>
          </details>
          <details className="sust-faq">
            <summary>Is shipping sustainable?</summary>
            <p>Shipping has a footprint. We reduce it with local matches, grouped deliveries, and reusable mailers. When possible, we encourage local pick-ups.</p>
          </details>
          <details className="sust-faq">
            <summary>Can I list fast-fashion items?</summary>
            <p>Yes, if they're in good condition. Extending the life of any garment is better than sending it to landfill.</p>
          </details>
        </section>

        {/* CTA */}
        <section className="sust-cta__block">
          <h2 className="sust-h2" style={{color: '#eafff6', marginBottom: '6px'}}>Join the circular wardrobe</h2>
          <p>List an item, rent something you love, or get a repair. Small actions, big impact.</p>
          <div className="sust-cta__row">
            <a className="sust-cta sust-cta--solid" href="/sell">List an item</a>
            <a className="sust-cta sust-cta--ghost" href="/rent">Browse rentals</a>
          </div>
        </section>

        <footer className="sust-footer" aria-label="Sustainability footer">
          <p>Questions or ideas? <a href="/contact">Contact our sustainability team</a>.</p>
        </footer>
      </main>
    </div>
  );
};

export default SustainabilityComponent;