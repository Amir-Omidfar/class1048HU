import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { pool } = require("../db");

const router = Router();

// Register
router.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "username and password required" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
      [username, hashed]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    // unique violation typically
    res.status(400).json({ error: err.message || "User exists or DB error" });
  }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (result.rows.length === 0) return res.status(400).json({ error: "Invalid credentials" });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "8h" });
    res.json({ token });
  } catch (err: any) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
