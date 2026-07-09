import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePortfolio } from "../context/PortfolioProvider";

gsap.registerPlugin(ScrollTrigger);

/**
 * Interactive photo hero. The image source is editable from the admin panel.
 */
const PhotoHero = () => {
  const { portfolio } = usePortfolio();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      // Calculate cursor position relative to the viewport center
      const x = e.clientX / window.innerWidth - 0.5;   // -0.5 to 0.5
      const y = e.clientY / window.innerHeight - 0.5;  // -0.5 to 0.5

      // Smooth tilt up to 12 degrees for visible responsiveness
      el.style.transform = `translateX(-50%) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
    };

    const handleGlobalMouseLeave = () => {
      el.style.transform = "translateX(-50%) rotateY(0deg) rotateX(0deg)";
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseleave", handleGlobalMouseLeave);

    // Fade out and scale down the photo container as we scroll away from the landing section
    const container = el.closest(".photo-hero-container");
    let scrollTimeline: gsap.core.Timeline | null = null;

    if (container) {
      scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".landing-section",
          start: "top top",
          end: "bottom 30%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      scrollTimeline.to(container, {
        opacity: 0,
        scale: 0.85,
        y: 50,
        ease: "power1.inOut"
      });
    }

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseleave", handleGlobalMouseLeave);
      
      scrollTimeline?.kill();
    };
  }, []);

  return (
    <div
      className="character-container photo-hero-container"
      style={{ pointerEvents: "none" }}
    >
      <div
        className="photo-hero-model"
        ref={wrapperRef}
        style={{ pointerEvents: "none" }}
      >
        <div className="character-rim character-loaded-rim"></div>
        <img
          src={portfolio.developer.portraitImage}
          alt={portfolio.developer.fullName}
          className="hero-photo"
        />
      </div>
    </div>
  );
};

export default PhotoHero;
