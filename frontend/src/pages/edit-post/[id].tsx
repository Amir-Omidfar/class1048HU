import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import NewPostForm from "../../components/NewPostForm";

interface Post {
  id: number;
  title: string;
  content: string;
  tags: string[];
  language: string;
}

export default function EditPostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (id) {
      api.get(`/posts/${id}`).then((res) => setPost(res.data));
    }
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return <NewPostForm post={post} />; // ✅ works now
}
