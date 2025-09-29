import Link from "next/link";
import React from "react";
import {useTranslation} from "react-i18next";
import api from "../utils/api";

interface Post {
  id: number;
  title: string;
  content: string;
  tags: string[];
  language: string;
  user_id?: number; // make sure backend sends user_id with each post
}


export default function PostCard({ post, currentUserId, onDelete }: { 
  post: Post; 
  currentUserId?: number; 
  onDelete?: (id: number) => void;
}) {
  const { t } = useTranslation();

  async function handleDelete() {
    if (!confirm(t("confirmDelete") || "Are you sure you want to delete this post?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/posts/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onDelete) onDelete(post.id);
    } catch (err) {
      console.error("Delete failed", err);
      alert(t("deleteFailed") || "Failed to delete post");
    }
  }

  return (
    <div style={{ border: "1px solid #ddd", marginBottom: 12, padding: 12 }}>
      <h3>
        {post.title} <small>({post.language})</small>
      </h3>
      <p>
        {post.content.slice(0, 250)}
        {post.content.length > 250 && "..."}
      </p>
      <div>
        {t("tags")}: {(post.tags || []).join(", ")}
      </div>
      <Link href={`/posts/${post.id}`}>{t("read")}</Link>

      {currentUserId === post.user_id && (
        <div style={{ marginTop: 8 }}>
          <Link href={`/edit-post/${post.id}`}>
            <button>{t("edit")}</button>
          </Link>
          <button onClick={handleDelete} style={{ marginLeft: 8 }}>
            {t("delete")}
          </button>
        </div>
      )}
    </div>
  );
}
