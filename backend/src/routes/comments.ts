import { Router, Request, Response } from "express";
const authMiddleware = require("../middleware/authMiddleware");
const { pool } = require("../db");

const router = Router();

// Add comment
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const { postId, text, language } = req.body;
  const userId = (req as any).user?.id;
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

module.exports = router;
