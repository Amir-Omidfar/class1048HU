import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import api from "../utils/api";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {Button, TextField, Stack, MenuItem} from "@mui/material";
import { useUser } from "@clerk/nextjs";

interface Post {
  id: number;
  title: string;
  content: string;
  tags: string[];
  language: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [language, setLanguage] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const { t } = useTranslation();
  const { isSignedIn } = useUser();

  useEffect(() => {
    fetchPosts();
  }, [language, tag, search]);

  async function fetchPosts() {
    try {
      const params: Record<string, string> = {};
      if (language) params.language = language;
      if (tag) params.tag = tag;
      if (search) params.search = search;

      const query = new URLSearchParams(params).toString();
      const res = await api.get(`/posts?${query}`); // <-- use api instance
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  }

  
  return (
    <div>
      <Navbar />
      <div style={{padding:20}}>
      <div>
        <div style={{ marginBottom: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" style={{marginBottom:10}}>
            <div>
              <Stack direction="row" spacing={1} style={{marginBottom:5}}>
                <TextField
                  select
                  label={language}
                  value={t("languageName")}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="fa">Farsi</MenuItem>
                </TextField>
                <TextField placeholder={t("tag")} value={tag} onChange={(e)=>setTag(e.target.value)} /> {""}
                <TextField placeholder={t("keywords")} value={search} onChange={(e)=>setSearch(e.target.value)} />{" "}
              </Stack>
              <Button variant="outlined" onClick={fetchPosts}>{t("search")}</Button>
            </div> 
            <div>
              {/* Show create post button only when logged in */}
              {isSignedIn && (
                <div style={{ marginBottom: "1rem" }}>
                  <Link href="/create-post">
                    <Button variant="outlined">{t("createPost")}</Button>
                  </Link>
                </div>
              )}
            </div>
          </Stack>
          
        </div>
        <div>
          
          {posts.map(p => <PostCard key={p.id} post={p} />)}
        </div>
      </div>
      </div>
      
    </div>
  );
}
