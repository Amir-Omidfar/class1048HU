import React from "react";
import { useTranslation } from "react-i18next";
import {Button, TextField} from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";


export default function Navbar() {
  const { t, i18n } = useTranslation();

  function toggleLang() {
    const next = i18n.language === "en" ? "fa" : "en";
    i18n.changeLanguage(next);
    if (typeof document !== "undefined") {
      document.documentElement.dir = next === "fa" ? "rtl" : "ltr";
    }
  }

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
      <div>{t("title")}</div>
      <div>
        <Button variant="contained" onClick={toggleLang}>{i18n.language === "en" ? "FA" : "EN"}</Button>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>

        <SignedOut>
          <Button  href="/sign-in">{t("login")}</Button>{" "}
          <Button  href="/sign-up">{t("register")}</Button>
        </SignedOut>
      </div>
    </nav>
  );
}