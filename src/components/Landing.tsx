import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import { usePortfolio } from "../context/PortfolioProvider";

const Landing = ({ children }: PropsWithChildren) => {
  const { portfolio } = usePortfolio();
  
  // Split name: "Ajith" and "S"
  const nameParts = portfolio.developer.fullName.split(" ");
  const firstName = nameParts[0] || portfolio.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          
          {/* Left Side: Name and Socials */}
          <div className="landing-intro">
            <div className="landing-intro-header">
              <span className="hello-tag">HELLO!</span>
              <span className="im-tag">I'M</span>
            </div>
            
            <h1 className="name-title name-first">{firstName.toUpperCase()}</h1>
            <div className="name-last-row">
              <h1 className="name-title name-last">{lastName.toUpperCase()}</h1>
              <div className="landing-divider"></div>
            </div>
            
            <p className="landing-desc">
              Passionate Full Stack Developer who loves building innovative and scalable web applications.
            </p>
            
          </div>

          {/* Right Side: Role and Actions */}
          <div className="landing-info">
            <div className="landing-info-header">
              <span className="a-tag">A</span>
              <div className="landing-divider"></div>
            </div>
            
            <h1 className="role-title role-blue">FULL</h1>
            <h1 className="role-title role-white">STACK</h1>
            <h1 className="role-title role-white">DEVELOPER</h1>
            
            <p className="landing-desc">
              I build responsive, user-friendly, and performance-driven web applications.
            </p>
            
            <div className="landing-ctas">
              <a href="#work" className="btn-primary" data-cursor="disable">
                VIEW MY WORK <span className="arrow">→</span>
              </a>
              <a href="#contact" className="btn-secondary" data-cursor="disable">
                CONTACT ME
              </a>
            </div>
          </div>

          {/* Mobile Photo layout */}
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
