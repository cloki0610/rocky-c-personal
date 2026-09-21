"use client";
import { motion } from "framer-motion";
import { Link } from "next-transition-router";
import { games, gamesAnimations } from "@/app/games/utils/constants";

export default function GamesContent() {
  return (
    <>
      <header className="max-w-3xl">
        <p className="text-sm font-semibold tracking-[0.2em] text-[#72574d] uppercase">
          Games
        </p>
        <motion.h1
          variants={gamesAnimations.intro}
          initial="hidden"
          animate="show"
          className="mt-4 text-5xl leading-tight font-black tracking-tight text-neutral-950 sm:text-7xl"
        >
          Prototypes worth <span className="text-[#8d6e63]">playing</span>.
        </motion.h1>
        <p className="mt-5 text-base leading-7 text-neutral-600 sm:text-lg">
          Mini-games built to try out ideas. Pick one below.
        </p>
      </header>
      <motion.div
        variants={gamesAnimations.grid}
        initial="hidden"
        animate="show"
        className="mt-10 grid gap-6 border-t border-neutral-200 pt-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        {games.map(({ name, description, href }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col justify-between rounded-2xl border border-neutral-200 p-6 transition-colors hover:border-[#8d6e63] hover:bg-[#8d6e63]/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#72574d]"
          >
            <div>
              <h2 className="text-xl font-semibold text-neutral-950 group-hover:text-[#72574d]">
                {name}
              </h2>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {description}
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[#8d6e63]">
              Play
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </span>
          </Link>
        ))}
      </motion.div>
    </>
  );
}
