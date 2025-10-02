"use client";
import { useAuth } from "../hooks/useAuth";
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
  const { user, loading } = useAuth(true); // ← redirect if not logged in

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts");
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
    };
    if (user) fetchPosts(); // only fetch posts once user is available
  }, [user]);

  if (loading) return <p>Loading...</p>; // waiting for auth

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
