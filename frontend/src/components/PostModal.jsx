import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { API_BASE } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { IconHappenings, IconEvents, IconNews } from './NavIcons';

const POST_TYPES = [
  { id: 'happening', label: 'Happening', desc: 'Free anonymous post – visible immediately', Icon: IconHappenings },
  { id: 'event', label: 'Event', desc: 'Requires admin approval', Icon: IconEvents },
  { id: 'news', label: 'News', desc: 'Requires admin approval', Icon: IconNews },
];

const NEWS_CATEGORIES = ['Internship', 'Project', 'Startup', 'Registration'];

export default function PostModal({ open, onClose }) {
  const { user } = useAuth();
  const [step, setStep] = useState('type');
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const reset = () => {
    setStep('type');
    setType('');
    setTitle('');
    setContent('');
    setCategory('');
    setDateTime('');
    setImageUrl('');
    setError('');
    setSuccess('');
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\/(jpe?g|png|gif|webp)$/i.test(file.type)) {
      setError('Please choose an image (JPEG, PNG, GIF, or WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.');
      return;
    }
    setError('');
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post('/upload', formData, {
        transformRequest: [(d, headers) => { delete headers['Content-Type']; return d; }],
      });
      setImageUrl(data.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/posts', {
        type,
        title: type === 'happening' ? '' : title,
        content,
        category: type === 'news' ? category : '',
        dateTime: type === 'event' && dateTime ? dateTime : undefined,
        image: imageUrl || undefined,
      });
      setSuccess(type === 'happening' ? "Posted! It's live now." : 'Submitted! It will appear after admin approval.');
      setTimeout(handleClose, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-darkPalette-card rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-darkPalette-border"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">New Post</h2>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-darkPalette-bg text-gray-500 dark:text-darkPalette-muted"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {step === 'type' ? (
              <>
                <p className="text-gray-600 dark:text-darkPalette-muted mb-4">Choose post type</p>
                <div className="space-y-2">
                  {POST_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setType(t.id);
                        setStep('form');
                      }}
                      className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-pastel-blue/30 dark:border-darkPalette-border hover:border-pastel-lavender dark:hover:border-darkPalette-purple hover:bg-pastel-soft dark:hover:bg-darkPalette-bg transition-all text-left"
                    >
                      <span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-pastel-blue/20 dark:bg-darkPalette-accent/20 text-pastel-lavender dark:text-darkPalette-accent">
                        <t.Icon />
                      </span>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">{t.label}</div>
                        <div className="text-sm text-gray-500 dark:text-darkPalette-muted">{t.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {type !== 'happening' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-darkPalette-muted mb-1">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-pastel-blue/40 dark:border-darkPalette-border dark:bg-darkPalette-bg dark:text-white focus:ring-2 focus:ring-pastel-lavender dark:focus:ring-darkPalette-purple outline-none transition"
                      placeholder={type === 'event' ? 'Event name' : 'Headline'}
                      required={type !== 'happening'}
                    />
                  </div>
                )}
                {type === 'event' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-darkPalette-muted mb-1">Date & time</label>
                    <input
                      type="datetime-local"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-pastel-blue/40 dark:border-darkPalette-border dark:bg-darkPalette-bg dark:text-white focus:ring-2 focus:ring-pastel-lavender dark:focus:ring-darkPalette-purple outline-none transition"
                    />
                  </div>
                )}
                {type === 'news' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-darkPalette-muted mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-pastel-blue/40 dark:border-darkPalette-border dark:bg-darkPalette-bg dark:text-white focus:ring-2 focus:ring-pastel-lavender dark:focus:ring-darkPalette-purple outline-none transition"
                    >
                      <option value="">Select</option>
                      {NEWS_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-darkPalette-muted mb-1">Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 rounded-xl border border-pastel-blue/40 dark:border-darkPalette-border dark:bg-darkPalette-bg dark:text-white focus:ring-2 focus:ring-pastel-lavender dark:focus:ring-darkPalette-purple focus:border-transparent outline-none transition resize-none placeholder:dark:text-darkPalette-muted"
                    placeholder="Write your post..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-darkPalette-muted mb-1">Attach image (optional)</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="px-4 py-2 rounded-xl border border-pastel-blue/40 dark:border-darkPalette-border text-gray-700 dark:text-darkPalette-muted hover:bg-pastel-soft dark:hover:bg-darkPalette-bg transition text-sm"
                    >
                      {uploadingImage ? 'Uploading...' : 'Choose image'}
                    </button>
                    {imageUrl && (
                      <div className="relative inline-block">
                        <img
                          src={`${API_BASE}${imageUrl}`}
                          alt="Attached"
                          className="h-20 w-20 object-cover rounded-lg border border-pastel-blue/30 dark:border-darkPalette-border"
                        />
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
                {success && <p className="text-green-600 dark:text-darkPalette-green text-sm">{success}</p>}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('type')}
                    className="px-4 py-2 rounded-xl border border-gray-300 dark:border-darkPalette-border text-gray-700 dark:text-darkPalette-muted hover:bg-gray-50 dark:hover:bg-darkPalette-bg"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 rounded-xl bg-pastel-mint dark:bg-darkPalette-green/30 text-green-800 dark:text-darkPalette-green font-medium hover:opacity-90 disabled:opacity-50 transition"
                  >
                    {loading ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
