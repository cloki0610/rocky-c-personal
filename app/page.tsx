"use client";
import { motion } from "framer-motion";
import { fadeIn } from "./utils/motion";

export default function Home() {
  return (
    <main>
      <section className="sm:px-16 px-6 absolute inset-0 max-w-7xl mx-auto flex flex-row md:items-center gap-5 pt-[150px] md:pt-0">
        <div>
          <motion.h1
            variants={fadeIn("left", "spring", 0, 1)}
            initial="hidden"
            animate="show"
            className="font-black text-black text-[60px] lg:text-[80px]
            lg:leading-[98px] mt-2 select-none"
          >
            Hi, I&apos;m <span className="text-[#8d6e63] site-title">Rocky.C</span>
          </motion.h1>
          <motion.p
            variants={fadeIn("left", "spring", 0.5, 2)}
            initial="hidden"
            animate="show"
            className="text-black font-medium lg:text-[30px] sm:text-[24px] xs:text-[16px] text-[16px] 
            lg:leading-[40px] mt-2 text-white-100 select-none"
          >
            Casually share some prototype and weird ideas.
          </motion.p>
        </div>
      </section>
    </main>
  );
}
