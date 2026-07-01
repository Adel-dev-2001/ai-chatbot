/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * useTheme — Custom hook managing Dark/Light mode preference.
 * Reads system preference on mount and syncs state with the DOM class list.
 */

import { useState, useEffect, useCallback } from "react";

interface UseThemeReturn {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function useTheme(): UseThemeReturn {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Determine initial mode from the OS color-scheme preference
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  // Keep the <html> class in sync whenever isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  return { isDarkMode, toggleDarkMode };
}
