import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import NewsCard from '../components/NewsCard';
import { useAuth } from '../context/AuthContext';

export default function News() {
  const { user } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNews = () => {
    api
      .get('/posts/news')
      .then((res) => setNews(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load news.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-pastel-lavender dark:border-darkPalette-purple border-t-pastel-blue dark:border-t-darkPalette-accent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">News</h1>
      <p className="text-gray-600 dark:text-darkPalette-muted mb-6">Opportunities, internships, projects & registrations</p>

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400 p-4 mb-6">{error}</div>
      )}

      {news.length === 0 && !error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-white/80 dark:bg-darkPalette-card border border-pastel-blue/20 dark:border-darkPalette-border p-12 text-center text-gray-500 dark:text-darkPalette-muted"
        >
          No news yet. Admin-approved posts will appear here.
        </motion.div>
      ) : (
        <ul className="space-y-4">
          {news.map((post) => (
            <li key={post._id}>
              <NewsCard
                post={post}
                currentUserId={user?._id}
                onLike={fetchNews}
              />
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
