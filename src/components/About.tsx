import "./styles/About.css";
import { usePortfolio } from "../context/PortfolioProvider";

const About = () => {
  const { portfolio } = usePortfolio();
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">{portfolio.about.title}</h3>
        <p className="para">
          {portfolio.about.description}
        </p>
      </div>
    </div>
  );
};

export default About;
