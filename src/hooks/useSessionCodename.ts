import { useMemo } from "react";

const prefixes = ["GHOST", "SPECTER", "PHANTOM", "SHADOW", "CIPHER", "WRAITH", "STEALTH", "NULL"];
const suffixes = ["74A", "019", "X3", "92B", "007", "13X", "88K", "21Z", "45C", "00X"];

const generateCodename = (): string => {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${prefix}-${suffix}`;
};

// Generate once per page load (not stored)
let sessionCodename: string | null = null;

export const useSessionCodename = (): string => {
  return useMemo(() => {
    if (!sessionCodename) {
      sessionCodename = generateCodename();
    }
    return sessionCodename;
  }, []);
};

export default useSessionCodename;
