import React, { useState } from "react";
import Router from "next/router";
import api from "../utils/api";
import {Button, TextField, Stack} from "@mui/material";

export default function Login() {
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
      <h2>LOGIN PAGE</h2>
      <Stack spacing={2} style={{marginBottom:10}} direction="row">
      <TextField placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
      <TextField placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      </Stack>
       
      <Button variant="outlined" type="submit">Login</Button>
    </form>
  );
}
