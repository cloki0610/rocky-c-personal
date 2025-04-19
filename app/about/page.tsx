import type { Metadata } from "next/types";

import AboutContent from "./components/AboutContent";

export const metadata: Metadata = {
  title: "Rocky.C - About Me",
  description: "Few words about Rocky.C.",
};

const AboutPage = () => {
  return (
    <main className="sm:px-16 h-80 px-6 max-w-7xl mx-auto flex flex-col justify-center gap-5 pt-50">
      <AboutContent />
    </main>
  );
};

export default AboutPage;
