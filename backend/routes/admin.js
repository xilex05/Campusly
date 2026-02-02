import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

// GET /admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalPosts, pendingCount] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Post.countDocuments({ status: 'pending', type: { $in: ['event', 'news'] } }),
    ]);
    res.json({ totalUsers, totalPosts, pendingCount });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch stats.' });
  }
});

// GET /admin/pending - pending event/news only
router.get('/pending', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'pending', type: { $in: ['event', 'news'] } })
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name email')
      .lean();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch pending posts.' });
  }
});

// PATCH /admin/posts/:id/approve
router.patch('/posts/:id/approve', async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, status: 'pending' },
      { status: 'approved' },
      { new: true }
    )
      .populate('postedBy', 'name')
      .lean();
    if (!post) return res.status(404).json({ message: 'Post not found or already processed.' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to approve.' });
  }
});

// PATCH /admin/posts/:id/reject
router.patch('/posts/:id/reject', async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, status: 'pending' },
      { status: 'rejected' }
    );
    if (!post) return res.status(404).json({ message: 'Post not found or already processed.' });
    res.json({ message: 'Post rejected.' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to reject.' });
  }
});

export default router;
