import Link from "next/link";
import React from "react";

export default function PostCard({ post }: { post: any }) {
  return (
    <div style={{ border: "1px solid #ddd", marginBottom: 12, padding: 12 }}>
      <h3>{post.title} <small>({post.language})</small></h3>
      <p>{post.content.slice(0, 250)}{post.content.length > 250 && "..."}</p>
      <div>Tags: {(post.tags || []).join(", ")}</div>
      <Link href={`/posts/${post.id}`}>Read</Link>
    </div>
  );
}
