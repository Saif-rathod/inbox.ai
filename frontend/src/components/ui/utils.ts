// This is a fallback utils file for build systems that have path resolution issues
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function for deployment verification
export const deploymentVersion = "v1.0.1";
