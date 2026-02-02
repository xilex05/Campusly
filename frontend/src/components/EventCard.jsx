import { motion } from 'framer-motion';
import LikeButton from './LikeButton';
import { IconCalendar } from './NavIcons';
import { API_BASE } from '../api/axios';

export default function EventCard({ post, currentUserId, onLike }) {
  const liked = post.likes?.some((id) => id.toString() === currentUserId?.toString());
  const dateStr = post.dateTime
    ? new Date(post.dateTime).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null;
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
      <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-1">{post.title || 'Event'}</h3>
      <p className="text-gray-600 dark:text-darkPalette-muted text-sm mb-3 line-clamp-3">{post.content}</p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-darkPalette-muted">
        {dateStr && (
          <span className="flex items-center gap-1">
            <IconCalendar />
            {dateStr}
          </span>
        )}
        {post.postedBy?.name && <span>• Posted by {post.postedBy.name}</span>}
      </div>
      <div className="mt-3 flex items-center justify-between">
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
