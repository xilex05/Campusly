import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { user } = useAuth();
  const { dark, toggleTheme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Settings</h1>
      <p className="text-gray-600 dark:text-darkPalette-muted mb-6">Your account & preferences</p>

      <div className="space-y-4 max-w-md">
        <div className="bg-white dark:bg-darkPalette-card rounded-2xl border border-pastel-blue/20 dark:border-darkPalette-border shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 dark:text-white mb-3">Appearance</h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-darkPalette-muted">Dark mode</span>
            <button
              type="button"
              role="switch"
              aria-checked={dark}
              onClick={toggleTheme}
              className={`relative inline-flex h-7 w-12 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-pastel-lavender dark:focus:ring-darkPalette-purple ${
                dark ? 'bg-darkPalette-purple' : 'bg-pastel-lavender'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition ${
                  dark ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-darkPalette-card rounded-2xl border border-pastel-blue/20 dark:border-darkPalette-border shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 dark:text-white mb-3">Account</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-darkPalette-muted">Name</p>
              <p className="font-medium text-gray-800 dark:text-white">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-darkPalette-muted">Email</p>
              <p className="font-medium text-gray-800 dark:text-white">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-darkPalette-muted">Role</p>
              <p className="font-medium text-gray-800 dark:text-white capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
