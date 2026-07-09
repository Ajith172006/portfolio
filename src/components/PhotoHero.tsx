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

    // Replicate the original 3D character scroll animation timeline for the photo container
    const container = el.closest(".photo-hero-container");
    let tl1: gsap.core.Timeline | null = null;
    let tl2: gsap.core.Timeline | null = null;
    let tl3: gsap.core.Timeline | null = null;

    if (container) {
      tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: ".landing-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".about-section",
          start: "center 55%",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      tl3 = gsap.timeline({
        scrollTrigger: {
          trigger: ".whatIDO",
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // Animate the container x/y coordinates to mirror the 3D scroll movement
      tl1.to(container, { x: "-25vw", duration: 1 }, 0);

      tl2
        .to(container, { x: "-12vw", delay: 2, duration: 5 }, 0)
        .to(container.querySelector(".character-rim"), { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2 }, 0.3);

      tl3.to(container, { y: "-100vh", duration: 4, ease: "none", delay: 1 }, 0);
    }

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseleave", handleGlobalMouseLeave);
      
      tl1?.kill();
      tl2?.kill();
      tl3?.kill();
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
