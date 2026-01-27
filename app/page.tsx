"use client";

import { Header } from "@/components/layout/header";
import { Hero } from "@/components/layout/hero";
import { Services } from "@/components/layout/services";
import { DigitalSolutions } from "@/components/layout/digital-solutions";
import { Toogo } from "@/components/layout/toogo";
import { Footer } from "@/components/layout/footer";
import { Preloader } from "@/components/ui/preloader";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

export default function Home() {
  const [showLogo, setShowLogo] = useState(false);
  const pageRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"]
  });

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5],
    ["#FAFAFA", "#000000"]
  );

  return (
    <>
      <Preloader onComplete={() => setShowLogo(true)} />
      <motion.main
        ref={pageRef}
        style={{ backgroundColor }}
        className="min-h-screen text-foreground overflow-x-hidden"
      >
        <Header showLogo={showLogo} />
        <Hero />
        <Services />
        <DigitalSolutions />
        <Toogo />
        <Footer />
      </motion.main>
    </>
  );
}
