import { Router, Request, Response } from "express";
import { requireAuth, getAuth } from "@clerk/express";
import { get } from "http";
const { pool } = require("../db");

const router = Router();

// Add comment
router.post("/", requireAuth(), async (req: Request, res: Response) => {
  const { postId, text, language } = req.body;
  const userId = getAuth(req).userId;
  if (!userId) return res.status(401).json({ error: "Auth required" });

  try {
    const result = await pool.query(
      "INSERT INTO comments (post_id, user_id, text, language) VALUES ($1, $2, $3, $4) RETURNING *",
      [postId, userId, text, language || "en"]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Get comments for a post (with optional lang + search)
router.get("/:postId", async (req: Request, res: Response) => {
  const { language, search } = req.query;
  const { postId } = req.params;

  let query = "SELECT * FROM comments WHERE post_id = $1";
  const values: any[] = [postId];

  if (language) {
    values.push(language);
    query += ` AND language = $${values.length}`;
  }
  if (search) {
    values.push(`%${search}%`);
    query += ` AND text ILIKE $${values.length}`;
  }

  query += " ORDER BY created_at DESC";

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete comment
router.delete("/:id", requireAuth(), async (req: Request, res: Response) => {
  const userId = getAuth(req).userId;
  if (!userId) return res.status(401).json({ error: "Auth required" });

  try {
    // Ensure the comment belongs to the user
    const commentResult = await pool.query("SELECT * FROM comments WHERE id = $1", [req.params.id]);
    if (commentResult.rows.length === 0) return res.status(404).json({ error: "Not found" });
    if (commentResult.rows[0].user_id !== userId) return res.status(403).json({ error: "Forbidden" });

    await pool.query("DELETE FROM comments WHERE id = $1", [req.params.id]);
    res.json({ message: "Comment deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
