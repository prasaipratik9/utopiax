/*
  PowerShell (after login → TOKEN=...):

  Invoke-RestMethod -Method Post -Uri http://localhost:4000/api/uploads/signature `
    -Headers @{ Authorization = "Bearer $TOKEN" }
*/

import { Router } from "express";
import { getSignedUploadPayload, isCloudinaryConfigured } from "../cloudinary.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.post("/signature", requireAuth, (req, res) => {
  if (!isCloudinaryConfigured()) {
    return res.status(503).json({
      error:
        "Cloudinary not configured (set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)",
    });
  }

  try {
    res.json(getSignedUploadPayload());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not sign upload" });
  }
});

export default router;
