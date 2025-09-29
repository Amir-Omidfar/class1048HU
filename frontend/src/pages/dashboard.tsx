"use client";

import { useEffect, useState } from "react";
import api from "../utils/api";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <Link href="/new-post">➕ Create New Post</Link>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>
              {post.title} ({new Date(post.created_at).toLocaleDateString()})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
