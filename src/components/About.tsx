import "./styles/About.css";
import { usePortfolio } from "../context/PortfolioProvider";

const About = () => {
  const { portfolio } = usePortfolio();
  return (
    <div className="about-section" id="about">
      <div className="about-box">
        <h2 className="title">
          W<span className="bout-h2">HO</span>
          <div>
            &nbsp;AM<span className="me-h2"> I</span>
          </div>
        </h2>
      </div>
      <div className="about-box">
        <div className="about-content">
          <p className="para">
            {portfolio.about.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
