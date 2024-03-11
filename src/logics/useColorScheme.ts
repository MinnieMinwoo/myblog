import { useEffect, useState } from "react";

const useColorScheme = () => {
  const getColorScheme = () => {
    if (localStorage.getItem("theme")) {
      const currentColorScheme = localStorage.getItem("theme");
      if (currentColorScheme === "light" || currentColorScheme === "dark") return currentColorScheme;
      else localStorage.removeItem("theme");
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    else return "light";
  };

  const applyColorMode = () => {
    document.documentElement.setAttribute("data-bs-theme", colorScheme);
  };

  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setColorScheme(getColorScheme());
  }, []);

  useEffect(() => {
    applyColorMode();
  }, [colorScheme]);

  const deleteColorMode = () => {
    localStorage.removeItem("theme");
    setColorScheme(getColorScheme());
    applyColorMode();
  };

  const setColorMode = (colorMode: "light" | "dark") => {
    localStorage.setItem("theme", colorMode);
    setColorScheme(colorMode);
    applyColorMode();
  };

  return { colorScheme, setColorMode, deleteColorMode };
};

export default useColorScheme;
