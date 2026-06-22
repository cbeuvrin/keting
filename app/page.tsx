"use client";

import { Header } from "@/components/layout/header";
import { Hero } from "@/components/layout/hero";
import { Services } from "@/components/layout/services";
import { DigitalSolutions } from "@/components/layout/digital-solutions";
import { Toogo } from "@/components/layout/toogo";
import { AboutUs } from "@/components/layout/about-us";
import { Footer } from "@/components/layout/footer";
import { BlogCarousel } from "@/components/layout/blog-carousel";
import { BrandsConstellation } from "@/components/layout/brands-constellation";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";

export default function Home() {
  // El logo del header se muestra de inmediato (sin preloader que demore la página).
  const [showLogo] = useState(true);
  const [headerTheme, setHeaderTheme] = useState<"light" | "dark">("light");
  const pageRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"]
  });

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
        <BrandsConstellation />
        <Footer />
      </motion.main>
    </>
  );
}
