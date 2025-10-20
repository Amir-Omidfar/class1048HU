import { TextField, Button, Stack } from "@mui/material";
import React, { useState } from "react";
import { useApi } from "../hooks/useApi";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useUser, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

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
  const api = useApi();
  const { user } = useUser();
  const isEditing = !!post;

  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [tags, setTags] = useState(post?.tags?.join(", ") || "");
  const [language, setLanguage] = useState(post?.language || i18n.language || "en");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      alert(t("login"));
      return; // or you can render SignInButton instead
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
    <>
    <SignedIn>
      <form onSubmit={handleSubmit} style={{ padding: "20px", width: "70%" }}>
        <Stack spacing={2}>
          <TextField
            label={t("postTitle")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            inputProps={{ dir: language === "fa" ? "rtl" : "ltr" }}
          />
          <TextField
            label={t("writePost")}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            multiline
            rows={6}
            required
            inputProps={{ dir: language === "fa" ? "rtl" : "ltr" }}
          />
          <TextField
            label={t("tag")}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            inputProps={{ dir: language === "fa" ? "rtl" : "ltr" }}
          />
          <TextField
            label={t("language")}
            value={t("languageName")}
            InputProps={{ readOnly: true }}
          />
          <Button variant="contained" type="submit">
            {isEditing ? t("updatePost") : t("createPost")}
          </Button>
        </Stack>
      </form>
    </SignedIn>
    <SignedOut>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p>{t("loginToCreatePost")}</p>
        <SignInButton />
      </div>
    </SignedOut>
    </>
  );
}
