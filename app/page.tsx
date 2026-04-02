"use client";

import { Header } from "@/components/layout/header";
import { Hero } from "@/components/layout/hero";
import { Services } from "@/components/layout/services";
import { DigitalSolutions } from "@/components/layout/digital-solutions";
import { Toogo } from "@/components/layout/toogo";
import { AboutUs } from "@/components/layout/about-us";
import { Footer } from "@/components/layout/footer";
import { BlogCarousel } from "@/components/layout/blog-carousel";
import { Preloader } from "@/components/ui/preloader";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function Home() {
  const [showPreloader, setShowPreloader] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [headerTheme, setHeaderTheme] = useState<"light" | "dark">("light");
  const pageRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("keting_visited");
    if (!hasVisited) {
      setShowPreloader(true);
      sessionStorage.setItem("keting_visited", "true");
    } else {
      setShowLogo(true);
    }
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // If progress > 0.25 (approx halfway to black), switch to dark theme (white text)
    // Adjust threshold as needed based on where the background actually gets dark enough
    if (latest > 0.25) {
      setHeaderTheme("dark");
    } else {
      setHeaderTheme("light");
    }
  });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5],
    ["#FAFAFA", "#242424"]
  );

  return (
    <>
      {showPreloader && <Preloader onComplete={() => setShowLogo(true)} />}
      <motion.main
        ref={pageRef}
        style={{ backgroundColor }}
        className="min-h-screen text-foreground overflow-x-hidden snap-y snap-mandatory"
      >
        <Header showLogo={showLogo} forcedTheme={headerTheme} />
        <Hero />
        <Services />
        <DigitalSolutions />
        <Toogo />
        <AboutUs />
        <BlogCarousel />
        <Footer />
      </motion.main>
    </>
  );
}
