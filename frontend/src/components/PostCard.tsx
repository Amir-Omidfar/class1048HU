import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Stack,
} from "@mui/material";
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
    <Card sx={{ mb: 2 }}>
       <CardContent>
        <Typography variant="h6">{post.title} <small>({post.language})</small></Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {post.content.slice(0, 250)}
          {post.content.length > 250 && "..."}
        </Typography>
        {post.tags?.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Typography variant="subtitle2">{t("tag")}:</Typography>
            {post.tags.map((tg, idx) => (
              <Chip key={idx} label={tg} size="small" color="primary" />
            ))}
          </Stack>
        )}
      </CardContent>
      <CardActions>
  <Stack direction="row" spacing={1}>
    <Button size="small" component={Link} href={`/posts/${post.id}`} variant="contained">
      {t("read")}
    </Button>
    {currentUserId === post.user_id && (
      <>
        <Button size="small" component={Link} href={`/edit-post/${post.id}`} variant="outlined">
          {t("edit")}
        </Button>
        <Button size="small" onClick={handleDelete} color="error" variant="outlined">
          {t("delete")}
        </Button>
      </>
    )}
  </Stack>
</CardActions>
    </Card>
  );
}
