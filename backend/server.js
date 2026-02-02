import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import authRoutes from './routes/auth.js';
import postsRoutes from './routes/posts.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/uploads', express.static(uploadsDir));
app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);
app.use('/admin', adminRoutes);
app.use('/upload', uploadRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campusly')
  .then(() => {
    app.listen(PORT, () => console.log(`CAMPUSLY API running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
