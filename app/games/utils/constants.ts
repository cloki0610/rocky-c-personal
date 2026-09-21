import { fadeIn } from "@/app/utils/motion";

export const games = [
  {
    name: "Office Politics",
    description:
      "A local three-player strategy game. Play as the Boss, Manager, or Staff and compete for control of the office.",
    href: "/games/office-politics",
  },
  {
    name: "Endless Arena",
    description:
      "Choose a Warrior or Ranger and survive endless waves of enemies and bosses in this keyboard-controlled arena game.",
    href: "/games/endless-arena",
  },
  {
    name: "Tower Defense",
    description:
      "Build turrets to hold the line through endless waves in this classic tower defense game.",
    href: "/games/barebone-td",
  },
];

export const gamesAnimations = {
  intro: fadeIn("right", "spring", 0, 1, 0),
  grid: fadeIn("", "spring", 0.3, 1, 0),
};
