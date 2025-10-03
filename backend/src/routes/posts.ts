import { Router, Request, Response } from "express";
import { requireAuth, getAuth } from "@clerk/express";
import { get } from "http";
const { pool } = require("../db");

const router = Router();

// Create a post
router.post("/", requireAuth(), async (req: Request, res: Response) => {
  const { title, content, tags, language } = req.body;
  const userId = getAuth(req).userId;
  if (!userId) return res.status(401).json({ error: "Auth required" });

  try {
    const result = await pool.query(
      "INSERT INTO posts (title, content, tags, language, author_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, content, tags || [], language || "en", userId]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Get posts with optional filters
router.get("/", async (req: Request, res: Response) => {
  const { language, tag, search } = req.query;

  let query = "SELECT * FROM posts WHERE 1=1";
  const values: any[] = [];

  if (language) {
    values.push(language);
    query += ` AND language = $${values.length}`;
  }
  if (tag) {
    values.push(tag);
    query += ` AND $${values.length} = ANY(tags)`;
  }
  if (search) {
    values.push(`%${search}%`);
    query += ` AND (title ILIKE $${values.length} OR content ILIKE $${values.length})`;
  }

  query += " ORDER BY created_at DESC";

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get single
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update a post
router.put("/:id", requireAuth(), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, tags, language } = req.body;
  const userId = getAuth(req).userId;

  try{
    const result = await pool.query(
      `UPDATE posts
       SET title = $1, content = $2, tags = $3, language = $4
       WHERE id = $5 AND author_id = $6
       RETURNING *`,
      [title, content, tags || [], language || "en", id, userId]
    );
    if (result.rows.length === 0) return res.status(403).json({ error: "Not found or not authorized" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update the post" });
  }

});

// Delete a post
router.delete("/:id", requireAuth(), async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = getAuth(req).userId;

  try {
    const result = await pool.query(
      `DELETE FROM posts 
       WHERE id = $1 AND author_id = $2 RETURNING *`, 
       [id, userId]
    );
    if (result.rows.length === 0) return res.status(403).json({ error: "Not found or not authorized" });
    res.json({ message: "Post deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
