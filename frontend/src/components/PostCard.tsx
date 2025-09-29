import Link from "next/link";
import React from "react";
import {useTranslation} from "react-i18next";

interface Post{
  id: number;
  title: string;
  content: string;
  tags: string[];
  language: string;
}

export default function PostCard({ post }: { post: Post }) {
  const { t } = useTranslation();

  return (
    <div style={{ border: "1px solid #ddd", marginBottom: 12, padding: 12 }}>
      <h3>
        {post.title} <small>({post.language})</small>
      </h3>
      <p>
        {post.content.slice(0, 250)}{post.content.length > 250 && "..."}
      </p>
      <div>
        {t("tag")}: {(post.tags || []).join(", ")}
      </div>
      <Link href={`/posts/${post.id}`}>{t("read")}</Link>
    </div>
  );
}
