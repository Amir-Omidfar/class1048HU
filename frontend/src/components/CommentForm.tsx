import { useState } from "react";
import axios from "axios";

interface CommentFormProps {
  postId: string | number;
  onCommentAdded: () => void;
}

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/comments`,
        { postId, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText("");
      onCommentAdded();
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your comment..."
        rows={3}
        style={{ width: "100%", padding: "0.5rem" }}
      />
      <button type="submit" disabled={loading} style={{ marginTop: "0.5rem" }}>
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
