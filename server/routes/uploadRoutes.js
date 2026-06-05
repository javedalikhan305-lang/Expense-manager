import express from 'express';
import upload from '../middleware/upload.js';
import { v2 as cloudinary } from 'cloudinary';
import { protect } from '../middleware/auth.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'receipts',
    });

    // Clean up local file
    fs.unlinkSync(req.file.path);

    res.json({
      message: 'Image uploaded successfully',
      url: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
