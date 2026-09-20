import type { Metadata } from "next/types";

import AboutContent from "./components/AboutContent";

export const metadata: Metadata = {
  title: "Rocky.C - About Me",
  description:
    "Meet Rocky.C, a Software Engineer at WorkL exploring web development, AI integration, and playful frontend prototypes.",
};

const AboutPage = () => {
  return (
    <main className="mx-auto w-full h-[calc(100vh-6rem)] max-w-6xl px-4 py-8 sm:px-6">
      <AboutContent />
    </main>
  );
};

export default AboutPage;
