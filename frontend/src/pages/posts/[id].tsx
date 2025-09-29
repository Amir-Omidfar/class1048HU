"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../utils/api";
import CommentForm from "../../components/CommentForm";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface Comment {
  id: number;
  text: string;
  user_id: number;
  created_at: string;
}

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const postRes = await api.get(`/posts/${id}`);
      setPost(postRes.data);

      const commentsRes = await api.get(`/comments/${id}`);
      setComments(commentsRes.data);
    } catch (err) {
      console.error("Failed to fetch post or comments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;
  if (!id) return <p>Invalid post ID</p>;
  return (
    <div style={{ padding: "2rem" }}>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>
        <small>Posted on {new Date(post.created_at).toLocaleString()}</small>
      </p>

      <h2>Comments</h2>
      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            {c.text} (by user {c.user_id})
          </li>
        ))}
      </ul>

      <CommentForm postId={id as string} onCommentAdded={fetchData} />
    </div>
  );
}
