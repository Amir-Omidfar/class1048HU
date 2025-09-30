import { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import api from "../utils/api";

interface CommentFormProps {
  postId: string | number;
  onCommentAdded: () => void;
}

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const { t } = useTranslation();
  const [content, setContent] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert(t("login"));
      return;
    }

    try {
      await api.post(
        `/posts/${postId}/comments`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent("");
      onCommentAdded();
    } catch (err) {
      console.error("Failed to post comment", err);
      alert("Error posting comment");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label={t("writeComment")}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />
        <Button variant="contained" type="submit">
          {t("postComment")}
        </Button>
      </Stack>
    </form>
  );
}