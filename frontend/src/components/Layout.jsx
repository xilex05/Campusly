import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PostModal from './PostModal';
import Logo from './Logo';
import {
  IconHome,
  IconEvents,
  IconNews,
  IconHappenings,
  IconPost,
  IconAdmin,
  IconSettings,
  IconLogout,
  IconChevronLeft,
  IconChevronRight,
} from './NavIcons';
import { useState } from 'react';

const navItems = [
  { to: '/', label: 'Home', Icon: IconHome },
  { to: '/events', label: 'Events', Icon: IconEvents },
  { to: '/news', label: 'News', Icon: IconNews },
  { to: '/happenings', label: 'Happenings', Icon: IconHappenings },
];

export default function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const handleLogout = () => {
    setLogoutConfirmOpen(false);
    logout();
  };

  return (
    <div className="min-h-screen flex bg-pastel-soft dark:bg-darkPalette-bg transition-colors">
      <motion.aside
        initial={false}
        animate={{ width: navCollapsed ? 72 : 240 }}
        className="flex flex-col bg-white/90 dark:bg-darkPalette-card backdrop-blur border-r border-pastel-blue/30 dark:border-darkPalette-border shadow-sm shrink-0 transition-colors"
      >
        <div className="p-4 flex items-center justify-between border-b border-pastel-blue/20 dark:border-darkPalette-border">
          {!navCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Logo />
            </motion.div>
          )}
          <button
            type="button"
            onClick={() => setNavCollapsed(!navCollapsed)}
            className="p-2 rounded-lg hover:bg-pastel-lavender/30 dark:hover:bg-darkPalette-border transition-colors text-gray-600 dark:text-darkPalette-muted"
            aria-label="Toggle nav"
          >
            {navCollapsed ? <IconChevronRight /> : <IconChevronLeft />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-pastel-lavender/50 dark:bg-darkPalette-purple/30 text-purple-800 dark:text-darkPalette-purple font-medium shadow-sm'
                    : 'text-gray-600 dark:text-darkPalette-muted hover:bg-pastel-blue/20 dark:hover:bg-darkPalette-border hover:text-gray-800 dark:hover:text-white'
                }`
              }
            >
              <span className="shrink-0 flex items-center justify-center w-5 h-5">
                <Icon />
              </span>
              {!navCollapsed && <span>{label}</span>}
            </NavLink>
          ))}

          <button
            type="button"
            onClick={() => setPostModalOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-pastel-mint/60 dark:bg-darkPalette-green/20 text-green-800 dark:text-darkPalette-green hover:bg-pastel-mint dark:hover:bg-darkPalette-green/30 transition-all duration-200 font-medium mt-2"
          >
            <span className="shrink-0 flex items-center justify-center w-5 h-5">
              <IconPost />
            </span>
            {!navCollapsed && <span>Post</span>}
          </button>
        </nav>

        <div className="p-2 border-t border-pastel-blue/20 dark:border-darkPalette-border space-y-1">
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400'
                    : 'text-gray-600 dark:text-darkPalette-muted hover:bg-pastel-blue/20 dark:hover:bg-darkPalette-border'
                }`
              }
            >
              <span className="shrink-0 flex items-center justify-center w-5 h-5">
                <IconAdmin />
              </span>
              {!navCollapsed && <span>Admin</span>}
            </NavLink>
          )}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-pastel-blue/40 dark:bg-darkPalette-accent/20 text-blue-800 dark:text-darkPalette-accent'
                  : 'text-gray-600 dark:text-darkPalette-muted hover:bg-pastel-blue/20 dark:hover:bg-darkPalette-border'
              }`
            }
          >
            <span className="shrink-0 flex items-center justify-center w-5 h-5">
              <IconSettings />
            </span>
            {!navCollapsed && <span>Settings</span>}
          </NavLink>
          <button
            type="button"
            onClick={() => setLogoutConfirmOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-darkPalette-muted hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-400 transition-all"
          >
            <span className="shrink-0 flex items-center justify-center w-5 h-5">
              <IconLogout />
            </span>
            {!navCollapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 overflow-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.2 }}
          className="p-6 md:p-8 max-w-4xl mx-auto"
        >
          <Outlet />
        </motion.div>
      </main>

      <PostModal open={postModalOpen} onClose={() => setPostModalOpen(false)} />

      <AnimatePresence>
        {logoutConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setLogoutConfirmOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-darkPalette-card rounded-2xl shadow-xl max-w-sm w-full p-6 border border-gray-200 dark:border-darkPalette-border"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Log out?
              </h3>
              <p className="text-gray-600 dark:text-darkPalette-muted text-sm mb-4">
                Are you sure you want to log out?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setLogoutConfirmOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-gray-300 dark:border-darkPalette-border text-gray-700 dark:text-darkPalette-muted hover:bg-gray-50 dark:hover:bg-darkPalette-bg transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
                >
                  Log out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
