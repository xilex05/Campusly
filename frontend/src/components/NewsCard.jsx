import { motion } from 'framer-motion';
import LikeButton from './LikeButton';
import { API_BASE } from '../api/axios';

export default function NewsCard({ post, currentUserId, onLike }) {
  const liked = post.likes?.some((id) => id.toString() === currentUserId?.toString());
  const imageSrc = post.image ? `${API_BASE}${post.image}` : null;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.1)' }}
      className="bg-white dark:bg-darkPalette-card rounded-2xl p-5 shadow-sm border border-pastel-blue/20 dark:border-darkPalette-border transition-shadow overflow-hidden"
    >
      {imageSrc && (
        <img src={imageSrc} alt="" className="w-full h-48 object-cover rounded-xl mb-3 -mx-1 -mt-1" />
      )}
      <div className="flex flex-wrap gap-2 mb-2">
        {post.category && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-pastel-lavender/40 dark:bg-darkPalette-purple/30 text-purple-700 dark:text-darkPalette-purple">
            {post.category}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-1">{post.title || 'News'}</h3>
      <p className="text-gray-600 dark:text-darkPalette-muted text-sm mb-3 line-clamp-3">{post.content}</p>
      {post.postedBy?.name && (
        <p className="text-xs text-gray-500 dark:text-darkPalette-muted mb-3">Posted by {post.postedBy.name}</p>
      )}
      <LikeButton
        postId={post._id}
        initialLikes={post.likes?.length ?? 0}
        initialLiked={liked}
        onToggle={onLike}
      />
    </motion.article>
  );
}
