import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers,
  FiCpu,
  FiBriefcase,
  FiCalendar,
  FiCreditCard,
  FiBarChart2,
  FiMail,
  FiMapPin,
  FiShare2,
  FiGlobe
} from 'react-icons/fi';
import heroIllustration from '../assets/hero-illustration.png';
import styles from './LandingPage.module.css';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.landingContainer}>
      {/* 1. Sticky Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo} onClick={() => navigate('/')}>
          AlumniConnect
        </div>

        <ul className={styles.navLinks}>
          <li>
            <a href="#home" className={`${styles.navItem} ${styles.activeNavItem}`}>
              Home
            </a>
          </li>
          <li>
            <a href="#about" className={styles.navItem}>
              About
            </a>
          </li>
          <li>
            <a href="#features" className={styles.navItem}>
              Features
            </a>
          </li>
          <li>
            <a href="#contact" className={styles.navItem}>
              Contact
            </a>
          </li>
        </ul>

        <button className={styles.loginBtn} onClick={() => navigate('/login')}>
          Login/Register
        </button>
      </nav>

      {/* 2. Hero Section */}
      <section id="home" className={styles.heroSection}>
        
        <div className={styles.heroLeft}>
          <h1 className={styles.heroTitleMain}>Connecting Alumni.</h1>
          <h1 className={styles.heroTitleSub}>Inspiring Futures.</h1>

          <p className={styles.heroDescription}>
            Connecting students, alumni, and administrators through mentorship, networking, career growth, and events. Join the most prestigious university network today.
          </p>

          <button className={styles.getStartedBtn} onClick={() => navigate('/register')}>
            Get Started
          </button>
        </div>

      <div className={styles.heroRight}>
        {/* Background Decorations (5-10% opacity abstract curved lines, dots, circles) */}
        <svg className={styles.bgDecorations} viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle curved lines */}
          <path d="M 50,400 Q 250,200 450,400" stroke="#1B62D4" strokeWidth="2" strokeDasharray="6,6" opacity="0.6" />
          <path d="M 100,100 Q 250,300 400,100" stroke="#1B62D4" strokeWidth="1.5" opacity="0.4" />
          {/* Soft floating circles */}
          <circle cx="100" cy="180" r="80" stroke="#1B62D4" strokeWidth="1" opacity="0.3" />
          <circle cx="380" cy="320" r="60" stroke="#1B62D4" strokeWidth="1" opacity="0.2" />
          {/* Small blue dots pattern */}
          <circle cx="80" cy="80" r="3" fill="#1B62D4" />
          <circle cx="100" cy="80" r="3" fill="#1B62D4" />
          <circle cx="120" cy="80" r="3" fill="#1B62D4" />
          <circle cx="80" cy="100" r="3" fill="#1B62D4" />
          <circle cx="100" cy="100" r="3" fill="#1B62D4" />
          <circle cx="120" cy="100" r="3" fill="#1B62D4" />
          <circle cx="380" cy="180" r="4" fill="#1B62D4" />
          <circle cx="410" cy="200" r="6" fill="#1B62D4" />
        </svg>

        {/* Floating modern flat vector illustration */}
        <div className={styles.heroIllustrationWrapper}>
          <img
            src={heroIllustration}
            alt="Alumni Connect Illustration"
            className={styles.heroImage}
          />
        </div>
      </div>

      </section>

      {/* Soft Blue Background Wrapper for Stats, Features, Testimonials */}
      <div className={styles.blueSectionWrapper}>
        {/* 3. Statistics Section */}
        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>25k+</div>
            <div className={styles.statLabel}>REGISTERED ALUMNI</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>12k+</div>
            <div className={styles.statLabel}>ACTIVE STUDENTS</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>8k+</div>
            <div className={styles.statLabel}>MENTORSHIPS</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>500+</div>
            <div className={styles.statLabel}>ANNUAL EVENTS</div>
          </div>
        </section>

        {/* 4. Features Section */}
        <section id="features" style={{ marginBottom: '90px' }}>
          <div className={styles.featuresHeader}>
            <h2 className={styles.sectionTitle}>Everything you need to thrive</h2>
            <p className={styles.sectionSubtitle}>
              Our platform provides sophisticated tools designed to bridge the gap between academic learning and professional excellence.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {/* Card 1 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIconBadge}>
                <FiUsers />
              </div>
              <h3 className={styles.featureTitle}>Alumni Management</h3>
              <p className={styles.featureDescription}>
                Seamlessly organize and engage your alumni database with intelligent segmentation and outreach tools.
              </p>
            </div>

            {/* Card 2 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIconBadge}>
                <FiCpu />
              </div>
              <h3 className={styles.featureTitle}>AI Mentor Matching</h3>
              <p className={styles.featureDescription}>
                Connect with the right guides using our proprietary AI that analyzes career paths, skills, and personal goals.
              </p>
            </div>

            {/* Card 3 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIconBadge}>
                <FiBriefcase />
              </div>
              <h3 className={styles.featureTitle}>Career Guidance</h3>
              <p className={styles.featureDescription}>
                Access exclusive job boards, resume workshops, and industry insights curated specifically for your alumni circle.
              </p>
            </div>

            {/* Card 4 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIconBadge}>
                <FiCalendar />
              </div>
              <h3 className={styles.featureTitle}>Events</h3>
              <p className={styles.featureDescription}>
                From local meetups to global webinars, stay connected with a calendar of professional and social gatherings.
              </p>
            </div>

            {/* Card 5 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIconBadge}>
                <FiCreditCard />
              </div>
              <h3 className={styles.featureTitle}>Fundraising</h3>
              <p className={styles.featureDescription}>
                Support your alma mater through transparent, impactful giving campaigns designed for the modern benefactor.
              </p>
            </div>

            {/* Card 6 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIconBadge}>
                <FiBarChart2 />
              </div>
              <h3 className={styles.featureTitle}>Analytics</h3>
              <p className={styles.featureDescription}>
                Data-driven insights to measure engagement, success rates, and the overall health of your community.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Testimonials Section */}
        <section id="about">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 className={styles.sectionTitle}>Voices of Success</h2>
          </div>

          <div className={styles.testimonialsGrid}>
            {/* Card 1 */}
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialHeader}>
                <div className={styles.avatarCircle}>G</div>
                <div>
                  <h4 className={styles.authorName}>Gayathri</h4>
                  <p className={styles.authorRole}>Class of '22, UX @ TechCorp</p>
                </div>
              </div>
              <p className={styles.testimonialQuote}>
                "AlumniConnect didn't just help me find my next job; it connected me with a mentor who changed my entire career trajectory. The network quality is unparalleled."
              </p>
            </div>

            {/* Card 2 */}
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialHeader}>
                <div className={styles.avatarCircle}>C</div>
                <div>
                  <h4 className={styles.authorName}>Charan</h4>
                  <p className={styles.authorRole}>Class of '23, Software Engineer</p>
                </div>
              </div>
              <p className={styles.testimonialQuote}>
                "As a recent graduate, the transition to the professional world was daunting. The guidance I received through the Career Guidance portal made all the difference."
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* 6. Contact Section */}
      <section id="contact" className={styles.contactSection}>
        <div className={styles.contactContainer}>
          <h2 className={styles.contactTitle}>Get in Touch</h2>
          <p className={styles.contactDescription}>
            Interested in bringing Alumni Connect to your institution? Our team is ready to provide a personalized walkthrough and discuss your specific needs.
          </p>

          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <div className={styles.contactIconCircle}>
                <FiMail />
              </div>
              <span className={styles.contactText}>partnerships@alumniconnect.edu</span>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIconCircle}>
                <FiMapPin />
              </div>
              <span className={styles.contactText}>
                Innovation Hub, 170 University Ave, Suite 400
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          {/* Col 1 */}
          <div>
            <div className={styles.footerBrand}>AlumniConnect</div>
            <p className={styles.footerTagline}>
              Empowering lifelong belonging, bridging the gap between graduation and global impact.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className={styles.footerColTitle}>Platform</h4>
            <ul className={styles.footerList}>
              <li><a href="#privacy" className={styles.footerLink}>Privacy Policy</a></li>
              <li><a href="#terms" className={styles.footerLink}>Terms of Service</a></li>
              <li><a href="#cookie" className={styles.footerLink}>Cookie Policy</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className={styles.footerColTitle}>Support</h4>
            <ul className={styles.footerList}>
              <li><a href="#help" className={styles.footerLink}>Help Center</a></li>
              <li><a href="#directory" className={styles.footerLink}>Network Directory</a></li>
              <li><a href="#integration" className={styles.footerLink}>Integration Guide</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className={styles.footerColTitle}>Connect</h4>
            <div className={styles.socialIconsRow}>
              <div className={styles.socialBtn} title="Share">
                <FiShare2 />
              </div>
              <div className={styles.socialBtn} title="Global Network">
                <FiGlobe />
              </div>
            </div>
            <p className={styles.copyright}>© 2026 AlumniConnect.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
