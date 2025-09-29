import { useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function NewPostForm({ onPostCreated }: { onPostCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await axios.post(
      `${API_URL}/posts`,
      { title, content },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTitle("");
    setContent("");
    onPostCreated();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Post</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your post..."
        required
      />
      <button type="submit">Publish</button>
    </form>
  );
}
