"use client";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button, TextField, Stack, Typography } from "@mui/material";

export default function Register() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error} = await supabase.auth.signUp({email, password});
    if (error) {
        setError(error.message);
        } else {
        alert("✅ Registration successful! Please check your email to confirm your account.");
        router.push("/login");
        }
    };
    return (
        <form onSubmit={handleRegister}>
        <Typography variant="h2" gutterBottom>{t("registerPage")}</Typography>
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
            <Button variant="outlined" type="submit">Register</Button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </Stack>
      
    </form>
    );
}