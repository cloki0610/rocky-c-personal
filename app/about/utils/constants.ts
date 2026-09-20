import { fadeIn } from "@/app/utils/motion";

export const skills = ["JavaScript", "TypeScript", "Python", "Rust"];

export const contacts = [
  { label: "Email", href: "mailto:cloki0610@gmail.com", icon: "/email.svg" },
  { label: "GitHub", href: "https://github.com/cloki0610", icon: "/gh.svg" },
  {
    label: "Instagram",
    href: "https://www.instagram.com/cloki0610/",
    icon: "/ins.svg",
  },
];

export const aboutAnimations = {
  title: fadeIn("down", "spring", 1, 2, 0),
  intro: fadeIn("right", "spring", 1, 2, 0),
  details: fadeIn("", "spring", 1.5, 2, 0),
  contact: fadeIn("", "spring", 2, 2, 0),
};
