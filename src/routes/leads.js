import express from "express";
import { createLead, drawLead, getAllLeads } from "../controllers/leadController.js";

const router = express.Router();

router.post("/", createLead);
router.get("/draw", drawLead);
router.get("/", getAllLeads);

export default router;
