import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";

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

  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchPosts();
    // read token on client only to avoid SSR/client markup mismatch
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token") || undefined);
    }
  }, []);

  async function fetchPosts() {
    const params = new URLSearchParams();
    if (language) params.set("language", language);
    if (tag) params.set("tag", tag);
    if (search) params.set("search", search);

    const res = await fetch(`http://localhost:5001/posts?${params.toString()}`);
    const data = await res.json();
    setPosts(data);
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

        <div>
          {posts.map(p => <PostCard key={p.id} post={p} />)}
        </div>
      </div>
    </div>
  );
}
