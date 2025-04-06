import React from "react";
import { useLanguage } from "./LanguageContext";
import "./LanguageSwitcher.css";

function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const handleToggle = (newLang) => {
    setLang(newLang);
  };

  return (
    <div className="language-switcher-container">
      <div className="language-toggle" data-active={lang}>
        <div
          className={`language-option ${lang === "en" ? "active" : ""}`}
          onClick={() => handleToggle("en")}
        >
          English
        </div>
        <div
          className={`language-option ${lang === "my" ? "active" : ""}`}
          onClick={() => handleToggle("my")}
        >
          မြန်မာစာ
        </div>
        <div className="language-toggle-pill"></div>
      </div>
    </div>
  );
}

export default LanguageSwitcher;
