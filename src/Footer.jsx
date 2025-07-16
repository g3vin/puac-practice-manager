import './Footer.css';
import InstagramIcon from './assets/icon_instagram.svg';
import YouTubeIcon from './assets/icon_youtube.svg';
import SlackIcon from './assets/icon_slack.svg';
import LinkIcon from './assets/icon_link.svg';
import EmailIcon from './assets/icon_email.svg';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="/constitution">Constitution</a>
          <a href="/merch">Merch</a>
          <a href="/sponsorship">Sponsorship</a>
        </div>

        <div className="footer-socials">
          <a href="https://www.instagram.com/purduearcheryclub/" target="_blank" rel="noopener noreferrer">
            <img src={InstagramIcon} alt="Instagram" className="footer-icon" />
          </a>
          <a href="https://www.youtube.com/@purduearcheryclub" target="_blank" rel="noopener noreferrer">
            <img src={YouTubeIcon} alt="YouTube" className="footer-icon" />
          </a>
          <a href="https://join.slack.com/t/purduearcheryclub/shared_invite/zt-2txxalalg-_I7rq5aSKJEk9UYYKV3OXw" target="_blank" rel="noopener noreferrer">
            <img src={SlackIcon} alt="Slack" className="footer-icon" />
          </a>
          <a href="https://boilerlink.purdue.edu/organization/purduearchery" target="_blank" rel="noopener noreferrer">
            <img src={LinkIcon} alt="BoilerLink" className="footer-icon" />
          </a>
          <a href="mailto:puac@purdue.edu">
            <img src={EmailIcon} alt="Email" className="footer-icon" />
          </a>
        </div>

        <p>&copy; {new Date().getFullYear()} Purdue University Archery Club</p>
      </div>
    </footer>
  );
};

export default Footer;
