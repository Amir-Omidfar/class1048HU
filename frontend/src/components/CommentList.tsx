export default function CommentList({ comments }: { comments: any[] }) {
  if (!comments || comments.length === 0) return <div>No comments yet</div>;
  return (
    <div>
      {comments.map(c => (
        <div key={c.id} style={{ borderBottom: "1px solid #eee", padding: 8 }}>
          <div>{c.text}</div>
          <div style={{ fontSize: 12, color: "#666" }}>{c.language} — {new Date(c.created_at).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
