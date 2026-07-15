import "./styles/About.css";
import { usePortfolio } from "../context/PortfolioProvider";

const About = () => {
  const { portfolio } = usePortfolio();
  return (
    <div className="about-section" id="about">
      <div className="about-box">
        <h2 className="title" style={{ whiteSpace: "nowrap" }}>
          W<span className="bout-h2">HO</span> AM<span className="me-h2"> I</span>
        </h2>
      </div>
      <div className="about-box">
        <div className="about-content about-me">
          <p className="para">
            {portfolio.about.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
