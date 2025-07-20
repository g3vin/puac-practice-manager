import './OurTeam.css';
import Footer from './Footer';

const teamMembers = [
  {
    name: "McKenzi Humbert",
    image: "kenzi.jpg",
    bio: "Kenzi is majoring in Animal Science. She started shooting in fall of 2022, when she first came to Purdue. Outside of archery, she enjoys longboarding and painting minifigures. A fun fact about her is she has a three-legged cat.",
    position: "President",
    bowType: "Barebow"
  },
  {
    name: "George Metcalf",
    image: "george.jpg",
    bio: "",
    position: "Vice President",
    bowType: "Recurve"
  },
  {
    name: "Gavin Bowden",
    image: "gavin.jpg",
    bio: "Gavin is a Junior in Computer Science and Artifical Intelligence. He has been shooting for 8+ years, including competitively. He enjoys reading and writing outside of archery, and occasionally programming things.",
    position: "Treasurer",
    bowType: "Compound"
  },
  {
    name: "Grace Kadziolka",
    image: "grace.jpg",
    bio: "",
    position: "Fundraising",
    bowType: "Barebow"
  },
  {
    name: "Wendy Chung",
    image: "wendy.jpg",
    bio: "",
    position: "Community Service",
    bowType: "Barebow"
  },
  {
    name: "Andrew Westra",
    image: "andrew.jpg",
    bio: "",
    position: "Social Media",
    bowType: "Barebow"
  },
  {
    name: "Matthew Glimcher",
    image: "matthewg.jpg",
    bio: "",
    position: "Safety",
    bowType: "Barebow"
  },
  {
    name: "Matthew Van-Ausdal",
    image: "matthewv.jpg",
    bio: "",
    position: "Safety",
    bowType: "Recurve"
  },
  {
    name: "Dan N",
    image: "dan.jpg",
    bio: "",
    position: "Safety",
    bowType: "Barebow"
  },
  {
    name: "Cesare",
    image: "cesare.jpg",
    bio: "",
    position: "Faculty Advisor",
    bowType: "Barebow"
  },
  // Add more team members here
];

const OurTeam = () => {
  return (
    <>
      <div className="our-team-page">
        <h1>Our Team</h1>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-tile" key={index}>
              <div className="tags-position">
              <span className="tag position">{member.position}</span>
              </div>
              <img src={`/OurTeamPhotos/${member.image}`} alt={member.name} className="team-photo" />
              <div className="team-info">
                <h2>{member.name}</h2>
                <p className="team-bio">{member.bio}</p>
                <div className="tags">
                  <span className="tag bow">{member.bowType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OurTeam;
