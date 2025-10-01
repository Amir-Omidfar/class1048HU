"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../utils/api";
import {Button, TextField, Stack, Typography} from "@mui/material";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/register", { username, password });
      alert("✅ Registration successful! Please log in.");
      router.push("/login");
    } catch (err: any) {
      alert(err.response?.data?.error || "❌ Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", width: "40vw"}}>
      <Typography variant="h2" gutterBottom>Register Page</Typography>
      <form onSubmit={handleRegister}>
        <Stack spacing={2} style={{marginBottom:10}} direction="column">
          <TextField  placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required />
          <TextField  placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <Button type="submit" disabled={loading} variant="outlined">
            {loading ? "Registering..." : "Register"}
          </Button>
        </Stack>

        
      </form>
    </div>
  );
}
