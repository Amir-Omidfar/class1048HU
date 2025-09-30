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
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      await api.post("/comments", { postId, text });
      setText("");
      onCommentAdded();
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      
      <Stack spacing={2}>
        <TextField 
          label={t("writeComment")}
          value={text}
          onChange={(e) => setText(e.target.value)}
          multiline
          rows={3}
          fullWidth
          />
          <Button variant="contained" disabled={loading} type="submit">
            {t("postComment")}
          </Button>
      </Stack>
      
      {/*
      <textarea
        placeholder={t("writeComment")}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        style={{ width: "100%", padding: "0.5rem" }}
      />
      <button type="submit" disabled={loading} style={{ marginTop: "0.5rem" }}>
        {t("postComment")}
    </button>*/}
  
    </form>
  );
}
