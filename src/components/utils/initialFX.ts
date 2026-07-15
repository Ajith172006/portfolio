import { TextSplitter } from "../../utils/textSplitter";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenis } from "../Navbar";

gsap.registerPlugin(ScrollTrigger);

let initialFXRun = false;

export function initialFX() {
  if (initialFXRun) return;
  initialFXRun = true;
  document.body.style.overflowY = "auto";
  if (lenis) {
    lenis.start();
  }
  document.getElementsByTagName("main")[0].classList.add("main-active");
  gsap.to("body", {
    backgroundColor: "#050914",
    duration: 0.5,
    delay: 1,
  });

  const selectors = [
    ".hello-tag",
    ".im-tag",
    ".a-tag",
    ".name-title",
    ".role-title"
  ];
  const elements = selectors.flatMap(selector => Array.from(document.querySelectorAll(selector)));
  const landingText = new TextSplitter(elements, {
    type: "chars,lines",
    linesClass: "split-line",
  });
  
  gsap.fromTo(
    landingText.chars,
    { opacity: 0, y: 50, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1,
      filter: "blur(0px)",
      ease: "power3.out",
      y: 0,
      stagger: 0.015,
      delay: 0.2,
    }
  );

  // Animate description paragraphs, socials, and call-to-actions
  gsap.fromTo(
    [".landing-desc", ".landing-socials", ".landing-ctas"],
    { opacity: 0, y: 25 },
    {
      opacity: 1,
      duration: 1,
      ease: "power2.out",
      y: 0,
      stagger: 0.15,
      delay: 0.6,
    }
  );

  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

  // Mobile photo scroll fade-out and scale down
  gsap.fromTo(
    ".mobile-photo",
    { opacity: 1, scale: 1, y: 0 },
    {
      opacity: 0,
      scale: 0.85,
      y: 40,
      scrollTrigger: {
        trigger: ".landing-section",
        start: "top top",
        end: "bottom 30%",
        scrub: true,
      },
    }
  );
}
