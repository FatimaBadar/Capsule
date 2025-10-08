import React, { useState, useEffect } from 'react';
import './AboutUs.css';

const AboutUsComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-wrapper">

    {/* <div className="aboutus-page"> */}
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>About Us</h1>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-header">
              <h2>Capsule: Your Wardrobe, Made Smarter</h2>
              <h3>Bringing style and sustainability together, powered by AI.</h3>
            </div>

            <div className="mission-content">
              <h3>Our Mission</h3>
              <div className="info-card">
                <h5>For the eco-conscious and style-savvy individual who struggles to organize their wardrobe and put together fresh outfits.</h5>
                <p>
                  Capsule: Your Wardrobe, Made Smarter is an AI-powered digital wardrobe website. 
                  That makes styling effortless by automatically generating outfits from your existing clothing. 
                  Unlike generic styling apps, our product emphasizes sustainability by helping users fully utilize 
                  their current wardrobe, reducing unnecessary purchases, and promoting a more mindful approach to fashion.
                </p>
              </div>
            </div>
          </div>

          <div className="who-we-are">
            <h2>Who We Are</h2>
            <div className="team-info">
              <h3>Our Team: Fatima, Lunaria, Shifali, Bondee, Abid, Rithish, and Josh</h3>
              <p>
                We are Group 3 from the University of Auckland's 731 course — a diverse team of seven passionate 
                students from around the world, united by a shared goal: to build a smarter, more sustainable future 
                for fashion. Though we come from different cultures and backgrounds, we've combined our unique perspectives 
                and skills to create a product that's inclusive, intelligent, and impactful.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Capsule Section */}
      <section className="why-section">
        <div className="why-overlay">
          <div className="why-content">
            <h2>Why Capsule?</h2>
            <p>
              We saw a common problem: too many clothes, yet "nothing to wear." This leads to wasted time, 
              repeated purchases, and unnecessary waste. Capsule was born to change that. By using AI to 
              maximize your existing wardrobe, we help you dress with confidence and purpose — while supporting 
              a circular fashion economy.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>Our Values</h2>
          <div className="values-content">
            <h4>
              <strong>
                Sustainability First – We promote reuse, reduce clutter, and encourage mindful consumption.<br />
                Smart & Simple – AI that helps without overwhelming.<br />
                Inclusivity & Collaboration – Fashion should be for everyone, and great ideas come from everywhere.
              </strong>
            </h4>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-overlay">
          <div className="contact-content">
            <h6>Explore</h6>
            <h2>Get in Touch</h2>
            <p>
              We're always open to feedback, ideas, or just a friendly chat about fashion, tech, or sustainability.
              Reach out to us at:<br />
              Fatima: nqur453@aucklanduni.ac.nz<br />
              Lunaria: ajhz851@aucklanduni.ac.nz<br />
              Shifali: stha696@aucklanduni.ac.nz<br />
              Bondee: jzhi212@aucklanduni.ac.nz<br />
              Abid: asam915@aucklanduni.ac.nz<br />
              Rithish: rkar483@aucklanduni.ac.nz<br />
              Josh: jsan292@aucklanduni.ac.nz
            </p>
            <button className="shop-button">Shop Now</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <p>
            Copyright © 2025 Clothing Store | Powered by Astra WordPress Theme
          </p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {/* // {showScrollTop && (
      //   <button 
      //     className="scroll-top"
      //     onClick={scrollToTop}
      //     aria-label="Scroll to top"
      //   >
      //     ↑
      //   </button>
      // )} */}
    </div>
  );
};

export default AboutUsComponent;