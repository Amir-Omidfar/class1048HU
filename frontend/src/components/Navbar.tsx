"use client";
import { useRouter } from "next/navigation";
import { supabase }  from "../utils/supabaseClient";
import React from "react";
import { useTranslation } from "react-i18next";
import {Button, TextField, Typography, Stack} from "@mui/material";


export default function Navbar({ token }: { token?: string }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  function toggleLang() {
    const next = i18n.language === "en" ? "fa" : "en";
    i18n.changeLanguage(next);
    if (typeof document !== "undefined") {
      document.documentElement.dir = next === "fa" ? "rtl" : "ltr";
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
      <Typography variant="h3">{t("title")}</Typography >
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={toggleLang}>
          {i18n.language === "en" ? "FA" : "EN"}
        </Button>

        {token ? (
          <Button variant="contained" onClick={handleLogout}>{t("logout")}</Button>
        ) : (
          <>
            <Button variant="outlined" href="/login">{t("login")}</Button>
            <Button variant="outlined" href="/register">{t("register")}</Button>
          </>
        )}
      </Stack>
    </nav>
  );
}
