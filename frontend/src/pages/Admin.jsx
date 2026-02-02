import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalPosts: 0, pendingCount: 0 });
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = () => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/pending'),
    ])
      .then(([statsRes, pendingRes]) => {
        setStats(statsRes.data);
        setPending(pendingRes.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load admin data.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin]);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/admin/posts/${id}/approve`);
      setPending((prev) => prev.filter((p) => p._id !== id));
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve.');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/admin/posts/${id}/reject`);
      setPending((prev) => prev.filter((p) => p._id !== id));
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject.');
    }
  };

  if (!isAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl bg-amber-50 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 p-6 text-amber-800 dark:text-amber-400"
      >
        Admin access required.
      </motion.div>
    );
  }

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
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Admin Panel</h1>
      <p className="text-gray-600 dark:text-darkPalette-muted mb-6">Approve or reject event/news submissions</p>

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400 p-4 mb-6">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-darkPalette-card rounded-xl p-4 border border-pastel-blue/20 dark:border-darkPalette-border shadow-sm"
        >
          <p className="text-sm text-gray-500 dark:text-darkPalette-muted">Total Users</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalUsers}</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white dark:bg-darkPalette-card rounded-xl p-4 border border-pastel-blue/20 dark:border-darkPalette-border shadow-sm"
        >
          <p className="text-sm text-gray-500 dark:text-darkPalette-muted">Total Posts</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalPosts}</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-amber-50 dark:bg-amber-500/20 rounded-xl p-4 border border-amber-200 dark:border-amber-500/30 shadow-sm"
        >
          <p className="text-sm text-amber-700 dark:text-amber-400">Pending</p>
          <p className="text-2xl font-bold text-amber-800 dark:text-amber-300">{stats.pendingCount}</p>
        </motion.div>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Pending submissions</h2>
      {pending.length === 0 ? (
        <div className="rounded-2xl bg-white/80 dark:bg-darkPalette-card border border-pastel-blue/20 dark:border-darkPalette-border p-8 text-center text-gray-500 dark:text-darkPalette-muted">
          No pending posts.
        </div>
      ) : (
        <ul className="space-y-4">
          {pending.map((post) => (
            <motion.li
              key={post._id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-darkPalette-card rounded-xl p-4 border border-pastel-blue/20 dark:border-darkPalette-border shadow-sm"
            >
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-darkPalette-border text-gray-700 dark:text-darkPalette-muted">
                  {post.type}
                </span>
                {post.category && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-pastel-lavender/40 dark:bg-darkPalette-purple/30 text-purple-700 dark:text-darkPalette-purple">
                    {post.category}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white">{post.title || '(No title)'}</h3>
              <p className="text-gray-600 dark:text-darkPalette-muted text-sm mt-1 line-clamp-2">{post.content}</p>
              <p className="text-xs text-gray-400 dark:text-darkPalette-muted mt-2">
                By {post.postedBy?.name} ({post.postedBy?.email})
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => handleApprove(post._id)}
                  className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-sm font-medium hover:bg-green-200 transition"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleReject(post._id)}
                  className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200 transition"
                >
                  Reject
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
