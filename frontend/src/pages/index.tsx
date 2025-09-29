import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import api from "../utils/api";
import { useTranslation } from "react-i18next";
import Link from "next/link";

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
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchPosts();
    // read token on client only to avoid SSR/client markup mismatch
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token") || undefined);
    }
  }, []);

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

  function onLogout() {
    localStorage.removeItem("token");
  setToken(undefined);
  // optionally reload to reset app state
  // location.reload();
  }

  return (
    <div>
      <Navbar onLogout={onLogout} token={token} />
      <div style={{ padding: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <select value={language} onChange={(e)=>setLanguage(e.target.value)}>
            <option value="">All languages</option>
            <option value="en">English</option>
            <option value="fa">Farsi</option>
          </select>
          <input placeholder="tag" value={tag} onChange={(e)=>setTag(e.target.value)} />
          <input placeholder="search" value={search} onChange={(e)=>setSearch(e.target.value)} />
          <button onClick={fetchPosts}>Search</button>
        </div>
        <div style={{ padding: 20 }}>
          {/* Show create post button only when logged in */}
          {token && (
            <div style={{ marginBottom: "1rem" }}>
              <Link href="/create-post">
                <button>{t("createPost")}</button>
              </Link>
            </div>
          )}
          {posts.map(p => <PostCard key={p.id} post={p} />)}
        </div>
      </div>
    </div>
  );
}
