"use client";

import { useEffect } from "react";
import { themeChange } from "theme-change";

const ChangeTheme = () => {
  useEffect(() => {
    themeChange(false);
  }, []);

  const themes = [
    { name: "Default", theme: "winter" },
    { name: "Dark", theme: "dark" },
    { name: "Light", theme: "light" },
    { name: "Synthwave", theme: "synthwave" },
    { name: "Cyberpunk", theme: "cyberpunk" },
  ];

  return (
    <div>
      <p className="font-bold text-lg">Choose Theme</p>
      <div className="flex gap-4">
        {themes.map((theme) => (
          <div
            key={theme.theme}
            data-theme={theme.theme}
            className="bg-base-100 rounded-lg"
          >
            <button
              className="btn btn-sm btn-ghost"
              data-set-theme={theme.theme}
            >
              {theme.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChangeTheme;
