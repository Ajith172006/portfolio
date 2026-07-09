import "./styles/CallToAction.css";

const CallToAction = () => {
  return (
    <div className="cta-section">
      <div className="cta-buttons">
        <a 
          href="#work" 
          onClick={(e) => {
            e.preventDefault();
            const target = document.querySelector("#work") as HTMLElement | null;
            if (target) {
              import("./Navbar").then((module) => {
                if (module.lenis) {
                  module.lenis.scrollTo(target);
                } else {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              });
            }
          }}
          className="cta-btn cta-btn-play" 
          data-cursor="disable"
        >
          View My Work →
        </a>
      </div>
    </div>
  );
};

export default CallToAction;
