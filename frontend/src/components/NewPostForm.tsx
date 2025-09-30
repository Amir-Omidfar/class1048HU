import { TextField, Button, ListItem, Stack } from "@mui/material";
import React, { useState } from "react";
import api from "../utils/api";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

interface Props {
  post?: {
    id: number;
    title: string;
    content: string;
    tags: string[];
    language: string;
  };
}

export default function NewPostForm({ post }: Props) {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [tags, setTags] = useState(post?.tags?.join(", ") || "");
  const [language, setLanguage] = useState(post?.language || i18n.language || "en");

  const isEditing = !!post;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert(t("login"));
      router.push("/login");
      return;
    }

    const payload = {
      title,
      content,
      tags: tags.split(",").map((t) => t.trim()),
      language,
    };

    try {
      if (isEditing && post) {
        await api.put(`/posts/${post.id}`, payload);
      } else {
        await api.post("/posts", payload);
      }
      router.push("/");
    } catch (err) {
      console.error("Post save error", err);
      alert("Failed to save post");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{padding: "20px", width:"70%"}}>
      <Stack spacing={2}>
        <TextField
          label={t("postTitle")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          slotProps={{
            input: {
              dir: language === "fa" ? "rtl" : "ltr", // Dynamically set text direction
            }
          }}
        />
        <TextField
          label={t("writePost")}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          multiline
          rows={6}
          required
          slotProps={{
            input: {
              dir: language === "fa" ? "rtl" : "ltr", // Dynamically set text direction
            }
          }}
        />
        <TextField
          slotProps={{
            input: {
              dir: language === "fa" ? "rtl" : "ltr", // Dynamically set text direction
            }
          }}
          label={t("tag")}
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <TextField
        slotProps={{
          input: {
            dir: language === "fa" ? "rtl" : "ltr", // Dynamically set text direction
            readOnly: true
          }
        }}
          label={t("language")}
          value={t("languageName")}
        />
        <Button variant="contained" type="submit">
          {isEditing ? t("updatePost") : t("createPost")}
        </Button>
      </Stack>
    </form>
  );
}
