import express from 'express';
import Post from '../models/Post.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /posts/events - approved events only
router.get('/events', async (req, res) => {
  try {
    const posts = await Post.find({ type: 'event', status: 'approved' })
      .sort({ dateTime: 1, createdAt: -1 })
      .populate('postedBy', 'name')
      .lean();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch events.' });
  }
});

// GET /posts/news - approved news only
router.get('/news', async (req, res) => {
  try {
    const posts = await Post.find({ type: 'news', status: 'approved' })
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name')
      .lean();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch news.' });
  }
});

// GET /posts/happenings - all approved happenings (anonymous - no postedBy in response)
router.get('/happenings', async (req, res) => {
  try {
    const posts = await Post.find({ type: 'happening', status: 'approved' })
      .sort({ createdAt: -1 })
      .select('-postedBy')
      .lean();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch happenings.' });
  }
});

// POST /posts - create post (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { type, title, content, category, dateTime, image } = req.body;
    if (!type || !content) {
      return res.status(400).json({ message: 'Type and content are required.' });
    }
    if (!['happening', 'event', 'news'].includes(type)) {
      return res.status(400).json({ message: 'Invalid post type.' });
    }
    const post = await Post.create({
      type,
      title: title || '',
      content,
      category: category || '',
      postedBy: req.user._id,
      dateTime: dateTime || null,
      image: image || '',
    });
    const populated = await Post.findById(post._id)
      .populate('postedBy', 'name')
      .lean();
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to create post.' });
  }
});

// POST /posts/:id/like - toggle like (protected)
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    const userId = req.user._id;
    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }
    await post.save();
    res.json({ likes: post.likes.length, liked: index === -1 });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update like.' });
  }
});

export default router;
