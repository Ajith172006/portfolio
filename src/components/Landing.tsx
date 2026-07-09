import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import { usePortfolio } from "../context/PortfolioProvider";

const Landing = ({ children }: PropsWithChildren) => {
  const { portfolio } = usePortfolio();
  const nameParts = portfolio.developer.fullName.split(" ");
  const firstName = nameParts[0] || portfolio.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";
  const titleParts = portfolio.developer.title.split(" ");
  const titleLastWord = titleParts.pop() || "";
  const titleLead = titleParts.join(" ") || titleLastWord;
  const titleTail = titleLead === titleLastWord ? "" : titleLastWord;

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              {firstName.toUpperCase()}
              {' '}
              <br />
              {lastName && <span>{lastName.toUpperCase()}</span>}
            </h1>
          </div>
          <div className="landing-info">
            <h3>A</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">{titleLead}</div>
            </h2>
            <h2>
              <div className="landing-h2-info">{titleTail}</div>
            </h2>
          </div>
          {/* Mobile photo - shows only on mobile when 3D character is hidden */}
          <div className="mobile-photo">
            <img src={portfolio.developer.portraitImage} alt={portfolio.developer.fullName} />
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
