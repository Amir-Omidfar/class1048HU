import express from "express";
import { Webhook } from "svix";
import bodyParser from "body-parser";
const { pool } = require("../db");

const router = express.Router();
router.use("/clerk", async (req, res, next) => {
    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).send("Missing Svix headers");
    }

    const webhookSercet = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSercet) {
        console.error("❌ CLERK_WEBHOOK_SECRET is not set");
        return res.status(500).send("Server misconfiguration");
    }
    const wh = new Webhook(webhookSercet);
    let evt: any;
    try{
        const payload = req.body.toString("utf8");
        evt = wh.verify(payload,{
            "svix-id": svix_id as string,
            "svix-timestamp": svix_timestamp as string,
            "svix-signature": svix_signature as string,
        });
    } catch (err) {
        console.error("❌ Failed to verify Clerk webhook:", err);
        return res.status(400).send("Invalid webhook signature");   
    }
    const {id, email_addressees, first_name, last_name} = evt.data;
    const email = email_addressees?.[0]?.email_address || null;
    const username = first_name || last_name ? `${first_name || ""} ${last_name || ""}`.trim() : null;
    try{
        if (evt.type =="user.created" || evt.type == "user.updated"){
            await pool.query(
                `INSERT INTO users (id,email,username)
                VALUES ($1, $2, $3)
                ON CONFLICT (id) DO UPDATE
                SET email = EXCLUDED.email,
                    username = EXCLUDED.username;`,
                [id, email, username]
            );
            console.log(`✅ Synced user ${id} (${email})`);
        }else if (evt.type == "user.deleted"){
            await pool.query(
                `DELETE FROM users WHERE id = $1;`,
                [id]
            );
            console.log(`🗑️ Deleted user ${id} from local DB`);
        }
        res.status(200).json({ success: true });
    }catch (err: any){
        console.error("❌ Database error:", err);
        res.status(500).json({ error: err.message });
    }
      
    });

    module.exports = router;