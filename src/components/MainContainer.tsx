import { useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import PhotoHero from "./PhotoHero";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import TechStackNew from "./TechStackNew";
import CallToAction from "./CallToAction";
import setSplitText from "./utils/splitText";
import { useLoading } from "../context/LoadingProvider";

const MainContainer = () => {
  const { completeLoading } = useLoading();

  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const isDesktopView = windowWidth > 1024;
  const isMobile = windowWidth <= 768;

  // No 3D model – complete loading immediately so the intro screen plays through
  useEffect(() => {
    completeLoading();
  }, [completeLoading]);

  useEffect(() => {
    const resizeHandler = () => {
      setWindowWidth(window.innerWidth);
      setSplitText();
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    import("./utils/initialFX").then((module) => {
      if (module.initialFX) {
        module.initialFX();
      }
    });
    import("./utils/GsapScroll").then((module) => {
      if (module.setAllTimeline) {
        module.setAllTimeline();
      }
    });
  }, []);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && !isMobile && <PhotoHero />}
      <div className="container-main">
        <Landing />
        <About />
        <WhatIDo />
        <Career />
        <Work />
        <TechStackNew />
        <CallToAction />
        <Contact />
      </div>
    </div>
  );
};

export default MainContainer;
