import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-soft via-pastel-cream to-pastel-lavender/50 dark:from-darkPalette-bg dark:via-darkPalette-card dark:to-darkPalette-bg p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8 flex justify-center">
          <Logo size="large" className="justify-center" />
        </div>
        <p className="text-center text-gray-600 dark:text-darkPalette-muted mb-8">Create your account</p>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white/95 dark:bg-darkPalette-card backdrop-blur rounded-2xl shadow-xl border border-pastel-blue/20 dark:border-darkPalette-border p-6 space-y-4"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-darkPalette-muted mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-pastel-blue/40 dark:border-darkPalette-border dark:bg-darkPalette-bg dark:text-white focus:ring-2 focus:ring-pastel-lavender dark:focus:ring-darkPalette-purple focus:border-transparent outline-none transition placeholder:dark:text-darkPalette-muted"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-darkPalette-muted mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-pastel-blue/40 dark:border-darkPalette-border dark:bg-darkPalette-bg dark:text-white focus:ring-2 focus:ring-pastel-lavender dark:focus:ring-darkPalette-purple focus:border-transparent outline-none transition placeholder:dark:text-darkPalette-muted"
              placeholder="you@college.edu"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-darkPalette-muted mb-1">
              Password (min 6 characters)
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-pastel-blue/40 dark:border-darkPalette-border dark:bg-darkPalette-bg dark:text-white focus:ring-2 focus:ring-pastel-lavender dark:focus:ring-darkPalette-purple focus:border-transparent outline-none transition placeholder:dark:text-darkPalette-muted"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 dark:text-red-400 text-sm text-center"
            >
              {error}
            </motion.p>
          )}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl font-medium text-white shadow-md disabled:opacity-60 transition bg-pastel-lavender dark:bg-darkPalette-purple hover:opacity-90 dark:hover:opacity-90"
          >
            {loading ? 'Creating account...' : 'Register'}
          </motion.button>
        </motion.form>

        <p className="text-center mt-6 text-gray-600 dark:text-darkPalette-muted text-sm">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-pastel-lavender dark:text-darkPalette-purple hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
