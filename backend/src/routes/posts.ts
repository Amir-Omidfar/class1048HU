import { Router, Request, Response } from "express";
const authMiddleware = require("../middleware/authMiddleware");
const { pool } = require("../db");

const router = Router();

// Create a post
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const { title, content, tags, language } = req.body;
  const userId = (req as any).user?.id;
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

module.exports = router;
