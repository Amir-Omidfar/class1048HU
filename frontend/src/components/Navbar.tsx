import React from "react";
import { useTranslation } from "react-i18next";

export default function Navbar({ onLogout, token }: { onLogout: ()=>void, token?: string}) {
  const { t, i18n } = useTranslation();

  function toggleLang() {
    const next = i18n.language === "en" ? "fa" : "en";
    i18n.changeLanguage(next);
    // set dir if fa: (guard document for SSR)
    if (typeof document !== "undefined") {
      document.documentElement.dir = next === "fa" ? "rtl" : "ltr";
    }
  }

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
      <div>{t("title")}</div>
      <div>
  <button onClick={toggleLang}>{(i18n.language === "en" ? "FA" : "EN")}</button>
        {token ? <button onClick={onLogout}>{t("logout")}</button> : <>
          <a href="/login">{t("login")}</a>{" "}
          <a href="/register">{t("register")}</a>
        </>}
      </div>
    </nav>
  );
}
