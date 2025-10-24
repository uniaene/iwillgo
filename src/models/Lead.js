// src/models/Lead.js
import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    whatsapp: String,
    course: String,
    local: String,
    synced: { type: Boolean, default: false },
    syncedAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model("Lead", leadSchema);
