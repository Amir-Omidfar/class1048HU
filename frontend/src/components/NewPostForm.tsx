import { useState } from "react";
import { useRouter } from "next/router";
import api from "../utils/api";
import { useTranslation } from "react-i18next";
import axios from "axios";



export default function NewPostForm() {
  const {t, i18n} = useTranslation();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [language, setLanguage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert(t("You must be logged in to create a post."));
        return;
      }
      await api.post("/posts", {
        title,
        content,
        tags: tags.split(",").map(tag => tag.trim()),
        language
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      router.push("/");
    } catch (err) {
      console.error("Failed to create post", err);
      alert(t("Failed to create post"));
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 12, padding: 20 }}
    >
      <h1>{t("createPost")}</h1>

      <input
        type="text"
        placeholder={t("postTitle")}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder={t("writePost")}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        required
      />

      <input
        type="text"
        placeholder={t("tag")}
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="fa">فارسی</option>
      </select>

      <button type="submit">{t("createPost")}</button>
    </form>
  );
}
