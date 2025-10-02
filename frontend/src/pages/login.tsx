"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabaseClient";
import { useTranslation } from "react-i18next";
import {Button, TextField, Stack, Typography} from "@mui/material";

export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Supabase handles JWT in localStorage automatically
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <Typography variant="h2" gutterBottom>{t("loginPage")}</Typography>
      <Stack spacing={2} style={{marginBottom:10, width:500}} direction="column">
        <TextField
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          type="password"
          placeholder={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button variant="outlined" type="submit">Login</Button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Stack>
    </form>
  );
}