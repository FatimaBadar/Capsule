import React from "react";
// import "./style.css";
// import logo from "./logo.png";
// import preview from "./A_2D_digital_screenshot_of_Capsule's_homepage_illu.png";

export default function HomePage() {
  return (
    <div className="new-homepage">

      <section className="new-hero">
        <div className="new-hero-text">
          <h2>Your Wardrobe. Smarter. Greener. Easier.</h2>
          <p>
            Capsule helps you organise your clothes, create AI outfit ideas, and
            join a sustainable fashion marketplace — all in one place.
          </p>
          <div className="hero-buttons">
            <button className="new-cta-btn">Get Started</button>
            <button
              className="new-cta-btn"
              style={{ background: "transparent", border: "1px solid #fff" }}
            >
              Learn More
            </button>
          </div>
        </div>
        <img src={'/home-bg.png'} alt="Capsule Preview" className="new-hero-img" />
      </section>

      <section className="new-features">
        <div className="new-feature">
          <h3>👕 Upload & Organize</h3>
          <p>
            Digitize your wardrobe by uploading clothes and sorting them by
            category, color, or occasion.
          </p>
        </div>
        <div className="new-feature">
          <h3>🧠 AI Outfit Generator</h3>
          <p>
            Get personalized outfit ideas using the clothes you already own.
          </p>
        </div>
        <div className="new-feature">
          <h3>♻️ Sustainability Insights</h3>
          <p>
            Track your fashion footprint and rewear rate to make eco-conscious
            choices.
          </p>
        </div>
        <div className="new-feature">
          <h3>🛍️ Marketplace</h3>
          <p>
            Buy, sell, or rent clothes directly within the Capsule community.
          </p>
        </div>
      </section>

      <section className="new-market-preview">
        <h2>Explore the Marketplace</h2>
        <div className="new-market-grid">
          <div className="new-market-item">
            <img
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=500&q=80"
              alt="Black Tee"
            />
            <h4>Black Tee</h4>
            <p>$9 • Pre-loved</p>
          </div>
          <div className="new-market-item">
            <img
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80"
              alt="Denim Jacket"
            />
            <h4>Denim Jacket</h4>
            <p>Rent for $4/day</p>
          </div>
          <div className="new-market-item">
            <img
              src="https://images.unsplash.com/photo-1542406775-ade58c52d2e4?auto=format&fit=crop&w=500&q=80"
              alt="Grey Hoodie"
            />
            <h4>Grey Hoodie</h4>
            <p>$12 • Gently Used</p>
          </div>
        </div>
        <br />
        <button className="new-cta-btn">Browse More</button>
      </section>

      <section className="new-cta">
        <h2>Ready to Capsule your wardrobe?</h2>
        <button className="new-cta-btn">Start for Free</button>
      </section>

      <footer>Capsule © 2025 • Smart Fashion for a Sustainable Future</footer>
    </div>
  );
}
