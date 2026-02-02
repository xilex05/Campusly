import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { IconHeart } from './NavIcons';

export default function LikeButton({ postId, initialLikes, initialLiked, onToggle }) {
  const [likes, setLikes] = useState(initialLikes ?? 0);
  const [liked, setLiked] = useState(!!initialLiked);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    const prevLikes = likes;
    const prevLiked = liked;
    setLiked(!liked);
    setLikes((n) => (liked ? n - 1 : n + 1));
    try {
      const { data } = await api.post(`/posts/${postId}/like`);
      setLikes(data.likes);
      setLiked(data.liked);
      onToggle?.(data);
    } catch {
      setLikes(prevLikes);
      setLiked(prevLiked);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        liked
          ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
          : 'bg-gray-100 dark:bg-darkPalette-border text-gray-600 dark:text-darkPalette-muted hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400'
      }`}
    >
      <motion.span
        animate={{ scale: liked ? 1.2 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="flex items-center justify-center"
      >
        <IconHeart filled={liked} />
      </motion.span>
      <span>{likes}</span>
    </motion.button>
  );
}
