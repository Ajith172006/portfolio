import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextSplitter } from "../../utils/textSplitter";

interface ParaElement extends HTMLElement {
  anim?: gsap.core.Animation;
  split?: TextSplitter;
}

gsap.registerPlugin(ScrollTrigger);

let refreshListenerAdded = false;

export default function setSplitText() {
  ScrollTrigger.config({ ignoreMobileResize: true });

  const paras: NodeListOf<ParaElement> = document.querySelectorAll(".para");
  const titles: NodeListOf<ParaElement> = document.querySelectorAll(".title");

  // Clean up any existing animations and split text structures first
  paras.forEach((para: ParaElement) => {
    if (para.anim) {
      para.anim.progress(1).kill();
      para.split?.revert();
    }
  });
  titles.forEach((title: ParaElement) => {
    if (title.anim) {
      title.anim.progress(1).kill();
      title.split?.revert();
    }
  });

  const ToggleAction = "play pause resume reverse";

  if (window.innerWidth < 900) {
    // Mobile view: animate elements as a whole block to prevent wrapping/reflow issues on small screens
    const TriggerStart = "top 85%";

    paras.forEach((para: ParaElement) => {
      para.classList.add("visible");
      para.anim = gsap.fromTo(
        para,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          scrollTrigger: {
            trigger: para,
            toggleActions: ToggleAction,
            start: TriggerStart,
          },
          duration: 0.8,
          ease: "power2.out",
          y: 0,
        }
      );
    });

    titles.forEach((title: ParaElement) => {
      title.anim = gsap.fromTo(
        title,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          scrollTrigger: {
            trigger: title,
            toggleActions: ToggleAction,
            start: TriggerStart,
          },
          duration: 0.8,
          ease: "power2.out",
          y: 0,
        }
      );
    });

    return;
  }

  // Desktop view: split text and animate words/characters
  const TriggerStart = window.innerWidth <= 1024 ? "top 60%" : "20% 60%";

  paras.forEach((para: ParaElement) => {
    para.classList.add("visible");
    para.split = new TextSplitter(para, {
      type: "lines,words",
      linesClass: "split-line",
    });

    para.anim = gsap.fromTo(
      para.split.words,
      { autoAlpha: 0, y: 80 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: para.parentElement?.parentElement,
          toggleActions: ToggleAction,
          start: TriggerStart,
        },
        duration: 1,
        ease: "power3.out",
        y: 0,
        stagger: 0.02,
      }
    );
  });

  titles.forEach((title: ParaElement) => {
    title.split = new TextSplitter(title, {
      type: "chars,lines",
      linesClass: "split-line",
    });

    title.anim = gsap.fromTo(
      title.split.chars,
      { autoAlpha: 0, y: 80, rotate: 10 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: title.parentElement?.parentElement,
          toggleActions: ToggleAction,
          start: TriggerStart,
        },
        duration: 0.8,
        ease: "power2.inOut",
        y: 0,
        rotate: 0,
        stagger: 0.03,
      }
    );
  });

  if (!refreshListenerAdded) {
    ScrollTrigger.addEventListener("refresh", () => setSplitText());
    refreshListenerAdded = true;
  }
}
