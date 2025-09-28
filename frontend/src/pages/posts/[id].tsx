import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import CommentList from "../../components/CommentList";
import CommentForm from "../../components/CommentForm";

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || undefined : undefined;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
    }
  }, [id]);

  async function fetchPost() {
    const res = await fetch(`${API_URL}/posts/${id}`);
    setPost(await res.json());
  }
  async function fetchComments() {
    const res = await fetch(`${API_URL}/posts/${id}/comments`);
    setComments(await res.json());
  }

  function onLogout() { localStorage.removeItem("token"); location.reload(); }

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <Navbar onLogout={onLogout} token={token} />
      <div style={{ padding: 20 }}>
        <h1>{post.title}</h1>
        <div>{post.content}</div>
        <hr />
        <h3>Comments</h3>
        <CommentList comments={comments} />
        {token ? <CommentForm postId={post.id} onAdded={fetchComments} token={token} /> : <div>Please login to comment</div>}
      </div>
    </div>
  );
}
