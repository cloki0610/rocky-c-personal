"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";

const AboutPage = () => {
  return (
    <div className="sm:px-16 px-6 absolute inset-0 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-5 pt-[150px] lg:pt-0">
      <motion.div
        variants={fadeIn("right", "spring", 0, 2, 0)}
        initial="hidden"
        animate="show"
      >
        <Image
          aria-hidden
          src="/icon-2024.png"
          alt="Rocky's logo image"
          width={1200}
          height={1200}
        />
      </motion.div>
      <div>
        <motion.p
          variants={fadeIn("down", "spring", 1, 2, 0)}
          className="mt-4 text-secondary text-xl md:text-3xl max-2-3xl leading-[30px]"
          initial="hidden"
          animate="show"
        >
          I&apos;m a Junior Software Engineer at WorkL, skilled in
          JavaScript/TypeScript, Python, Rust, Django, Node.js, and modern
          front-end frameworks like Vue and Next.js.
        </motion.p>
        <motion.p
          variants={fadeIn("left", "spring", 2, 2, 0)}
          className="mt-4 text-secondary text-xl md:text-3xl max-2-3xl leading-[30px]"
          initial="hidden"
          animate="show"
        >
          Hold an AWS Certified Solutions Architect Associate certificate with
          strong cloud knowledge, currently focused on expanding my skills in AI
          integration and web development.
        </motion.p>
      </div>
    </div>
  );
};

export default AboutPage;
