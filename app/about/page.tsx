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
          width={600}
          height={600}
        />
      </motion.div>
      <div>
        <motion.p
          variants={fadeIn("down", "spring", 1, 2, 0)}
          className="mt-4 text-secondary text-xl md:text-2xl max-2-3xl leading-[30px]"
          initial="hidden"
          animate="show"
        >
          Currently working as a Junior Software Engineer at WorkL, obtain some
          skill in JavaScript/TypeScript, Python, Rust with modern front-end
          frameworks.
        </motion.p>
        <motion.p
          variants={fadeIn("left", "spring", 2, 2, 0)}
          className="mt-4 text-secondary text-xl md:text-2xl max-2-3xl leading-[30px]"
          initial="hidden"
          animate="show"
        >
          Focused on expanding my skills in AI integration and web development.
          Contact via Instagram(cloki0610) or email(cloki0610@gmail.com).
        </motion.p>
      </div>
    </div>
  );
};

export default AboutPage;
