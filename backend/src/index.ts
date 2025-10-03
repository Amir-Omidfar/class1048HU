import express, { Request, Response, NextFunction } from "express";
import { clerkMiddleware, requireAuth, getAuth } from "@clerk/express";
import cors from "cors";
import dotenv from "dotenv";

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Use clerkMiddleware to set up request.auth (or req.auth) context
app.use(clerkMiddleware());

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

// Example of a protected route
app.get("/protected", requireAuth(), (req: any, res: Response) => {
  const { userId } = getAuth(req);
  res.json({
    message: "You are authenticated",
    userId,
  });
});

// 🧱 Example: Protect specific route groups
// If your postRoutes include create/update/delete, you can apply Clerk protection like this:
// app.use("/posts", ClerkExpressRequireAuth(), postRoutes);

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

const DEFAULT_PORT = Number(process.env.PORT) || 5000;

/**
 * Start the Express server and retry on EADDRINUSE by incrementing the port.
 * This helps during development when macOS or another app reserves common ports.
 */
function startServer(port: number = DEFAULT_PORT, remainingRetries = 5) {
  const server = app.listen(port, () =>
    console.log(`🚀 Server running on http://localhost:${port}`)
  );

  server.on("error", (err: any) => {
    if (err && err.code === "EADDRINUSE") {
      if (remainingRetries > 0) {
        const nextPort = port + 1;
        console.warn(
          `Port ${port} is in use, trying ${nextPort} (retries left: ${remainingRetries - 1})`
        );
        setTimeout(() => startServer(nextPort, remainingRetries - 1), 200);
        return;
      }
      console.error(
        `Port ${port} is in use and no retries left. Exiting.`
      );
      process.exit(1);
    }
    // Unknown error - rethrow/exit
    console.error(err);
    process.exit(1);
  });
}

startServer();
