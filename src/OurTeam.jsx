import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import './OurTeam.css';
import Footer from './Footer';

const teamMembers = [
  { name: "McKenzi Humbert", image: "kenzi.jpg", bio: "Kenzi is majoring in Animal Science. She started shooting in fall of 2022, when she first came to Purdue. Outside of archery, she enjoys longboarding and painting minifigures. A fun fact about her is she has a three-legged cat.", position: "President", bowType: "Barebow", pronouns: "She / Her" },
  { name: "George Metcalf", image: "george.jpg", bio: "George is in Biomedical Health Science, with a Pre-Med concentration. He loves to golf on the weekends, even though he's not very good. He has been shooting for 10 years now, but Olympic recurve only for 5. He has also tried every watersport where you're towed by a boat.", position: "Vice President", bowType: "Recurve", pronouns: "He / Him" },
  { name: "Gavin Bowden", image: "gavin.png", bio: "Gavin is a Junior in Computer Science and Artificial Intelligence. He has been shooting for 8+ years, including competitively. He enjoys reading and writing outside of archery, and occasionally programming things (like this website which took forever).", position: "Treasurer", bowType: "Compound", pronouns: "He / Him" },
  { name: "Grace Kadziolka", image: "grace.jpg", bio: "", position: "Fundraising", bowType: "Barebow", pronouns: "She / Her" },
  { name: "Wendy Chung", image: "wendy.jpg", bio: "", position: "Community Service", bowType: "Barebow", pronouns: "She / Her" },
  { name: "Andrew Westra", image: "andrew.jpg", bio: "", position: "Social Media", bowType: "Barebow", pronouns: "He / Him" },
  { name: "Matthew Glimcher", image: "matthewg.jpg", bio: "", position: "Safety", bowType: "Barebow", pronouns: "He / Him" },
  { name: "Matthew Van-Ausdal", image: "matthewv.jpg", bio: "", position: "Safety", bowType: "Recurve", pronouns: "He / Him" },
  { name: "Dan N", image: "dan.jpg", bio: "", position: "Safety", bowType: "Barebow", pronouns: "He / Him" },
  { name: "Cesare", image: "cesare.jpg", bio: "", position: "Faculty Advisor", bowType: "Barebow", pronouns: "He / Him" },
];

const Modal = ({ member, initialRect, onClose }) => {
  const [animated, setAnimated] = useState(false);
  useLayoutEffect(() => {
    requestAnimationFrame(() => setAnimated(true));
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content ${animated ? 'entered' : ''}`}
        style={initialRect && {
          position: 'absolute',
          top: initialRect.top,
          left: initialRect.left,
          width: initialRect.width,
          height: initialRect.height
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-bg" style={{ backgroundImage: `url(/OurTeamPhotos/${member.image})` }} />
        <div className="modal-body">
          <h2>{member.name}</h2>
          <div className="tags">
           <span className={`tag bow ${member.bowType.toLowerCase()}-tag`}>{member.bowType}</span>
            <span className="tag pronouns">{member.pronouns}</span>
          </div>
          <p className="modal-bio">{member.bio}</p>
        </div>
      </div>
    </div>
  );
};

const OurTeam = () => {
  const [selected, setSelected] = useState(null);
  const [initialRect, setInitialRect] = useState(null);

  useEffect(() => {
    const onPop = () => setSelected(null);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const openModal = (member, e) => {
    window.history.pushState({}, '', '#' + member.name.replace(/\s+/g, '-'));
    const rect = e.currentTarget.getBoundingClientRect();
    setInitialRect(rect);
    setSelected(member);
  };

  const closeModal = () => {
    window.history.back();
    setSelected(null);
  };

  const renderSection = (title, members) => (
    <div className="team-section" key={title}>
      <h2 className="section-title">{title}</h2>
      <div className="team-grid">
        {members.map((m,i) => (
          <div
            className="team-tile"
            key={i}
            onClick={e => openModal(m,e)}
            style={{ backgroundImage: `url(/OurTeamPhotos/${m.image})` }}
          >
            <div className="tile-footer">
              <h3>{m.name}</h3>
              <span>{m.position}</span>
              <div className="tags">
                <span className={`tag bow ${m.bowType.toLowerCase()}-tag`}>{m.bowType}</span>
                <span className="tag pronouns">{m.pronouns}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="our-team-page">
        <h1>Our Team</h1>
        {renderSection('Executive', teamMembers.filter(m=>!["Safety","Faculty Advisor"].includes(m.position)))}
        {renderSection('Safety Officers', teamMembers.filter(m=>m.position==='Safety'))}
        {renderSection('Faculty Advisor', teamMembers.filter(m=>m.position==='Faculty Advisor'))}
      </div>
      {selected && <Modal member={selected} initialRect={initialRect} onClose={closeModal} />}
      <Footer />
    </>
  );
};

export default OurTeam;
