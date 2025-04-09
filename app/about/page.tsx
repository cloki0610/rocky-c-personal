import AboutContent from "./AboutContent";
import type { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Rocky.C - About Me",
  description: "Few words about Rocky.C.",
};

const AboutPage = () => {
  return (
    <main className="sm:px-16 px-6 absolute inset-0 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-5 pt-[150px] lg:pt-0">
      <AboutContent />
    </main>
  );
};

export default AboutPage;
