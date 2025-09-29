import React, { useState } from "react";
import api from "../utils/api";

interface Post {
  id?: number;
  title: string;
  content: string;
  tags: string[];
  language: string;
}

interface Props {
  post?: Post; // 👈 make it optional for new vs edit
}

export default function NewPostForm({ post }: Props) {
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [tags, setTags] = useState(post?.tags?.join(", ") || "");
  const [language, setLanguage] = useState(post?.language || "en");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      title,
      content,
      tags: tags.split(",").map((t) => t.trim()),
      language,
    };

    try {
      if (post?.id) {
        // update existing post
        await api.put(`/posts/${post.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Post updated!");
      } else {
        // create new post
        await api.post("/posts", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Post created!");
      }
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Error saving post");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="fa">Farsi</option>
      </select>
      <button type="submit">{post ? "Update Post" : "Create Post"}</button>
    </form>
  );
}
