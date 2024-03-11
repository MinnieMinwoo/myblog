import { useEffect, useState } from "react";

const useColorScheme = () => {
  const getColorScheme = () => {
    if (localStorage.getItem("theme") === "dark") return "dark";
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    else return "light";
  };

  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setColorScheme(getColorScheme());
  }, []);

  useEffect(() => {
    applyColorMode();
  }, [colorScheme]);

  const applyColorMode = () => {
    document.documentElement.setAttribute("data-bs-theme", colorScheme);
  };

  const setColorMode = (colorMode: "light" | "dark") => {
    localStorage.setItem("theme", colorMode);
    setColorScheme(colorMode);
    applyColorMode();
  };

  return { colorScheme, setColorMode };
};

export default useColorScheme;
