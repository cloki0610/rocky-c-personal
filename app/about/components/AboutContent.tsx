"use client";
import Image from "next/image";
import { Link } from "next-transition-router";
import { motion } from "framer-motion";
import {
  aboutAnimations,
  contacts,
  linkStyle,
  skills,
} from "@/app/about/utils/constants";

export default function AboutContent() {
  return (
    <>
      <header className="max-w-3xl">
        <p className="text-sm font-semibold tracking-[0.2em] text-[#72574d] uppercase">
          About me
        </p>
        <h1 className="mt-4 text-5xl leading-tight font-black tracking-tight text-neutral-950 sm:text-7xl">
          I&apos;m <span className="text-[#8d6e63]">Rocky</span>.
        </h1>
        <motion.p
          variants={aboutAnimations.intro}
          initial="hidden"
          animate="show"
          className="mt-6 max-w-2xl text-xl leading-relaxed text-neutral-700 sm:text-2xl"
        >
          A Software Engineer at WorkL, with a curiosity for how things work and
          what I can build next.
        </motion.p>
      </header>

      <motion.div
        variants={aboutAnimations.details}
        initial="hidden"
        animate="show"
        className="mt-12 grid gap-10 border-t border-neutral-200 pt-10 lg:mt-16 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20"
      >
        <section aria-labelledby="approach-heading">
          <h2
            id="approach-heading"
            className="text-xl font-semibold text-neutral-950"
          >
            Learning by building
          </h2>
          <div className="mt-4 space-y-4 text-base leading-8 text-neutral-600 sm:text-lg">
            <p>
              I work with JavaScript, TypeScript, Python, and Rust, alongside
              modern frontend frameworks. I enjoy turning ideas into interactive
              experiences and learning something new along the way.
            </p>
            <p>
              This site is my space to experiment: a home for small prototypes,
              browser games, and unusual ideas worth trying. Play a round of{" "}
              <Link href="/office-politics" className={linkStyle}>
                Office Politics
              </Link>{" "}
              or see how long you last in{" "}
              <Link href="/endless-arena" className={linkStyle}>
                Endless Arena
              </Link>
              .
            </p>
          </div>
        </section>
        <section aria-labelledby="toolkit-heading">
          <h2
            id="toolkit-heading"
            className="text-xl font-semibold text-neutral-950"
          >
            My toolkit
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-[#8d6e63]/20 bg-[#8d6e63]/5 px-4 py-2 text-sm font-medium text-[#72574d]"
              >
                {skill}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-base leading-7 text-neutral-600">
            Currently exploring AI integration and deepening my web development
            skills, one project at a time.
          </p>
        </section>
      </motion.div>

      <motion.section
        variants={aboutAnimations.contact}
        initial="hidden"
        animate="show"
        aria-labelledby="contact-heading"
        className="mt-12 border-t border-neutral-200 pt-8 sm:mt-16"
      >
        <h2
          id="contact-heading"
          className="text-xl font-semibold text-neutral-950"
        >
          Let&apos;s connect
        </h2>
        <p className="mt-3 text-base leading-7 text-neutral-600">
          Have an idea to share, a question about a project, or just want to say
          hello? Get in touch.
        </p>
        <ul className="mt-5 flex flex-wrap gap-3">
          {contacts.map(({ label, href, icon }) => (
            <li key={label}>
              <a
                href={href}
                className="inline-flex min-h-12 items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-800 transition-colors hover:border-[#8d6e63] hover:bg-[#8d6e63]/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#72574d]"
              >
                <Image src={icon} alt="" width={20} height={20} />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </motion.section>
    </>
  );
}
