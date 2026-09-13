import type { Metadata } from "next/types";

import AboutContent from "./components/AboutContent";

export const metadata: Metadata = {
  title: "Rocky.C - About Me",
  description:
    "Meet Rocky.C, a Software Engineer at WorkL exploring web development, AI integration, and playful frontend prototypes.",
};

const AboutPage = () => {
  return (
    <main className="mx-auto max-w-7xl px-6 pt-12 pb-16 sm:px-16 sm:pt-20 sm:pb-24">
      <AboutContent />
    </main>
  );
};

export default AboutPage;
