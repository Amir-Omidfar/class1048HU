import React from "react";
import { useTranslation } from "react-i18next";
import {Button, TextField} from "@mui/material";
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
      <TextField
        slotProps={{
          input: {
            readOnly: true
          }
        }}
          //label={t("title")}
          value={t("title")}
        />
      <div style={{justifyContent: "space-between"}}>
        <Button variant="contained" onClick={toggleLang}>{(i18n.language === "en" ? "FA" : "EN")}</Button>
        {token ? <Button variant="outlined" onClick={onLogout}>{t("logout")}</Button> : <>
          <a href="/login">{t("login")}</a>{" "}
          <a href="/register">{t("register")}</a>
        </>}
      </div>
    </nav>
  );
}
