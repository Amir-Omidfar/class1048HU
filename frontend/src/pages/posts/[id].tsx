"use client";
import { TextField, Divider, ListItem, Stack,Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../utils/api";
import { useTranslation } from "react-i18next";
import CommentForm from "../../components/CommentForm";
import { useRouter } from "next/router";
import dayjs from "dayjs";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  author_id?: number; // make sure backend sends user_id with each post
}

interface Comment {
  id: number;
  text: string;
  user_id: number;
  created_at: string;
}

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "fa" ? "rtl" : "ltr";
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
    <div style={{ padding: "2rem" }} dir={direction}>
      <Stack >
        <Typography variant="h4" gutterBottom> {post.title} </Typography>
        <Typography variant="body1" gutterBottom> {post.content} </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {t("postedOn")} {dayjs(post.created_at).format("MMMM D, YYYY h:mm A")}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom> {t("authorID")}: {post.author_id || t("unknown")} </Typography>
        
      </Stack>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}> {t("comments")} </Typography>
      <ul>
        {comments.map((c) => (
          <ListItem key={c.id} disableGutters>
            <Stack>
              <Typography variant="body2">{c.text}</Typography>
              <Typography variant="caption" color="text.secondary">
                {t("byUser")} {c.user_id} • {dayjs(c.created_at).format("MMM D, YYYY h:mm A")}
              </Typography>
            </Stack>
          </ListItem>
        ))}
      </ul>

      <Divider sx={{ my: 3 }} />

      <CommentForm postId={id as string} onCommentAdded={fetchData} />
    </div>
  );
}
