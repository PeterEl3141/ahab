import React from 'react';
import './About.css';

const About = () => {
  return (
    <section className="about-tractatus">
      <h1 className="about-title">Tractatus Ahab..us(?) Solimn...ius(?!)</h1>

      <ul className="tractatus-list">
        {/* 1 */}
        <li className="section-head">
          <span className="idx"><em>1.</em></span>
          <span>Ahab’s Dream is the case.</span>
        </li>
        <li className="point">1.1 It is a place for raptures, ramblings, and groovy reviews.</li>
        <li className="point">1.2 What can be loved must be written; what cannot be written must be played.</li>
        <li className="point">1.3 The objects of our passion are <strong>books</strong> and <strong>music</strong>.</li>
        <li className="point">1.31 The world of Ahab’s Dream is the totality of such enthusiasms.</li>

        {/* 2 */}
        <li className="section-head">
          <span className="idx"><em>2.</em></span>
          <span>What is published may be published.</span>
        </li>
        <li className="point">2.1 We publish: reviews, essays, interviews, annotated playlists, deep dives.</li>
        <li className="point">2.11 Length is a tool, not a virtue (≈ 800–1,500 words is often enough).</li>
        <li className="point">2.12 Voice is permitted; pomposity is not.</li>
        <li className="point">2.13 Nerdiness is a form of clarity.</li>
        <li className="point">2.2 We do not publish: hate, plagiarism, AI sludge, or joyless summaries.</li>
        <li className="point">2.21 Sources are cited; images are credited; quotes are linked.</li>
        <li className="point">2.22 The point is illumination, not obliteration.</li>

        {/* 3 */}
        <li className="section-head">
          <span className="idx"><em>3.</em></span>
          <span>The form of a pitch determines its acceptance.</span>
        </li>
        <li className="point">
          3.1 Send pitches to <a href="mailto:submissions@ahabsdream.com">submissions@ahabsdream.com</a>.
        </li>
        <li className="point">3.11 Include: (a) a 3–5 line sketch, (b) one sample paragraph, (c) relevant links.</li>
        <li className="point">3.12 Optional but helpful: a proposed headline that doesn’t hate itself.</li>
        <li className="point">3.2 We reply within seven days, unless we are listening to something long.</li>
        <li className="point">3.21 Accepted pieces are edited with care; authors keep the byline and the dignity.</li>
        <li className="point">3.22 Fees, rights, and schedules are clarified before publication; vagueness is not a style.</li>

        {/* 4 */}
        <li className="section-head">
          <span className="idx"><em>4.</em></span>
          <span>Community is what remains after the hot take cools.</span>
        </li>
        <li className="point">4.1 Be kind, specific, and curious.</li>
        <li className="point">4.11 Disagreement is allowed; discourtesy is deleted.</li>
        <li className="point">4.2 Moderation is editorial judgment made visible.</li>
        <li className="point">4.21 Comments that improve the piece are part of the piece.</li>

        {/* 5 */}
        <li className="section-head">
          <span className="idx"><em>5.</em></span>
          <span>Error is human; corrections are divine.</span>
        </li>
        <li className="point">
          5.1 Send corrections to <a href="mailto:editor@ahabsdream.com">editor@ahabsdream.com</a>.
        </li>
        <li className="point">5.11 We fix with speed and note with grace.</li>

        {/* 6 */}
        <li className="section-head">
          <span className="idx"><em>6.</em></span>
          <span>Who speaks here?</span>
        </li>
        <li className="point">6.1 A small, stubborn crew who reads records and listens to books.</li>
        <li className="point">6.11 Guest contributors enlarge the map; editors keep it legible.</li>

        {/* 7 */}
        <li className="section-head">
          <span className="idx"><em>7.</em></span>
          <span>Where to find us is where we are.</span>
        </li>
        <li className="point">7.1 Follow: Instagram, YouTube, Facebook (links in the footer).</li>
        <li className="point">7.11 The newsletter says what’s new; it says it briefly.</li>

        {/* 8 */}
        <li className="section-head">
          <span className="idx"><em>8.</em></span>
          <span>The aim of Ahab’s Dream is not to say more, but to say what matters.</span>
        </li>
        <li className="point">8.1 When a piece ends and you hear something differently, it has succeeded.</li>
        <li className="point">8.11 When a piece ends and you buy a book or cue a record, it has also succeeded.</li>

        {/* 9 */}
        <li className="section-head">
          <span className="idx"><em>9.</em></span>
          <span>This page is a ladder.</span>
        </li>
        <li className="point">9.1 Having climbed up it to understanding, you may forget it—</li>
        <li className="point">9.11 —but please still pitch us.</li>
      </ul>
    </section>
  );
};

export default About;
