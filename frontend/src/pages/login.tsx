import React, { useState } from "react";
import Router from "next/router";
import api from "../utils/api";
import { useTranslation } from "react-i18next";
import {Button, TextField, Stack, Typography} from "@mui/material";

export default function Login() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e:any) {
    e.preventDefault();
    try{
      const res = await api.post("/auth/login", { username, password })
      const data = res.data;

      if (data.token) {
        localStorage.setItem("token", data.token);
        Router.push("/");
      } else {
        alert(data.error || "Login failed");
      }
    }
    catch(err){
      console.error("Login error", err);
      alert("Login failed");
    }
    
  }

  return (
    <form onSubmit={submit} style={{padding:10}}>
      <Typography variant="h2" gutterBottom>{t("loginPage")}</Typography>
      <Stack spacing={2} style={{marginBottom:10}} direction="row">
      <TextField placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
      <TextField placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      </Stack>
       
      <Button variant="outlined" type="submit">Login</Button>
    </form>
  );
}
