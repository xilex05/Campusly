import { motion } from 'framer-motion';
import LikeButton from './LikeButton';
import { API_BASE } from '../api/axios';

export default function HappeningCard({ post, currentUserId, onLike }) {
  const liked = post.likes?.some((id) => id.toString() === currentUserId?.toString());
  const imageSrc = post.image ? `${API_BASE}${post.image}` : null;
  const timeAgo = post.createdAt
    ? (() => {
        const d = new Date(post.createdAt);
        const now = new Date();
        const sec = Math.floor((now - d) / 1000);
        if (sec < 60) return 'Just now';
        if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
        if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
        return d.toLocaleDateString();
      })()
    : '';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: '0 8px 20px -6px rgba(0,0,0,0.08)' }}
      className="bg-white dark:bg-darkPalette-card rounded-2xl p-4 shadow-sm border border-pastel-blue/20 dark:border-darkPalette-border transition-shadow overflow-hidden"
    >
      {imageSrc && (
        <img src={imageSrc} alt="" className="w-full h-40 object-cover rounded-xl mb-3" />
      )}
      <p className="text-gray-800 dark:text-white mb-3 whitespace-pre-wrap">{post.content}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-darkPalette-muted">{timeAgo}</span>
        <LikeButton
          postId={post._id}
          initialLikes={post.likes?.length ?? 0}
          initialLiked={liked}
          onToggle={onLike}
        />
      </div>
    </motion.article>
  );
}
