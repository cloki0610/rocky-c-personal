"use client";

import { useSyncExternalStore } from "react";
import { COLUMNS_NARROW, COLUMNS_WIDE, WIDE_QUERY } from "../utils/constants";

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(WIDE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const getSnapshot = () =>
  window.matchMedia(WIDE_QUERY).matches ? COLUMNS_WIDE : COLUMNS_NARROW;

/* number of stone columns that fit the scene: five on desktop, three otherwise */
export default function useSceneColumns() {
  return useSyncExternalStore(subscribe, getSnapshot, () => COLUMNS_NARROW);
}
