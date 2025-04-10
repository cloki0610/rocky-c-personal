"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";

const AboutContent = () => {
  return (
    <div>
      <motion.p
        variants={fadeIn("down", "spring", 1, 2, 0)}
        className="mt-4 text-xl md:text-2xl max-2-3xl leading-[30px]"
        initial="hidden"
        animate="show"
      >
        Currently working as a Junior Software Engineer at WorkL, obtain some
        skill in JavaScript/TypeScript, Python, Rust with modern front-end
        frameworks.
      </motion.p>
      <motion.p
        variants={fadeIn("left", "spring", 1.5, 2, 0)}
        className="mt-4 text-xl md:text-2xl max-2-3xl leading-[30px]"
        initial="hidden"
        animate="show"
      >
        Focused on expanding my skills in AI integration and web development.{" "}
        <br />
        Contact via Instagram(cloki0610) or email(cloki0610@gmail.com).
      </motion.p>
      <p className="flex gap-[36px] mt-4 text-xl md:text-2xl max-2-3xl leading-[30px]">
        <motion.a
          variants={fadeIn("right", "spring", 2.5, 2, 0)}
          initial="hidden"
          animate="show"
          whileHover={{ scale: 1.1, rotateY: 180 }}
          whileTap={{ scale: 0.9 }}
          href="https://github.com/cloki0610"
        >
          <Image src="/gh.svg" alt="My GitHub" width={50} height={50} />
        </motion.a>
        <motion.a
          variants={fadeIn("right", "spring", 3, 2, 0)}
          initial="hidden"
          animate="show"
          whileHover={{ scale: 1.1, rotateX: 180 }}
          whileTap={{ scale: 0.9 }}
          href="https://www.instagram.com/cloki0610/"
        >
          <Image src="/ins.svg" alt="My Instagram" width={50} height={50} />
        </motion.a>
        <motion.a
          variants={fadeIn("right", "spring", 3.5, 2, 0)}
          initial="hidden"
          animate="show"
          whileHover={{ scale: 1.1, rotateY: 180 }}
          whileTap={{ scale: 0.9 }}
          href="mailto:cloki0610@gamil.com"
        >
          <Image src="/email.svg" alt="My Email" width={50} height={50} />
        </motion.a>
      </p>
    </div>
  );
};

export default AboutContent;
