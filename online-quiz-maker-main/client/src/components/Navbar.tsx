import { useState, useContext, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  User,
  Mail,
  Info,
  Moon,
  Sun,
} from "lucide-react";
import { AuthContext } from "../context/authContextValue";
import type { Variants } from "framer-motion";
import { useSuccess } from "../context/useSuccess";

// Navigation links
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Create Quiz", path: "/create" },
  { name: "Quiz Hub", path: "/list" },
  { name: "Explore", path: "/explore" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dark mode
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const { user, logout } = useContext(AuthContext);
  const { addMessage } = useSuccess();

  // Apply dark/light mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Prevent background scrolling while profile modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);

    if (isModalOpen) {
      setIsModalOpen(false);
    }
  };

  // Toggle user profile modal
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);

    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    addMessage("Logout Sucessfully");
    setIsModalOpen(false);
  };

  // Close profile modal when opening dashboard
  const handleDashboardClick = () => {
    setIsModalOpen(false);
  };

  // Navigation link styling
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? "text-indigo-600 dark:text-indigo-300 font-bold tracking-wide bg-indigo-50 dark:bg-indigo-900/40 px-4 py-2 rounded-full transition-all duration-300"
    : "text-gray-700 dark:text-gray-200 font-semibold tracking-wide px-4 py-2 rounded-full hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300";

  // Mobile menu animation
  const mobileMenuVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Profile modal animation
  const modalVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.25,
        duration: 0.45,
      },
    },
  };

  return (
    <>
      {/* =========================
          NAVBAR
      ========================== */}
      <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-gray-700 dark:text-gray-200 shadow-[0_4px_20px_rgba(79,70,229,0.08)] sticky top-0 z-50 border-b border-indigo-50 dark:border-slate-700">
        <div className="container mx-auto px-4 py-3.5 flex justify-between items-center">

          {/* Brand Name */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              to="/"
              className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
            >
              Quizzy
            </Link>
          </motion.div>

          <div className="flex items-center space-x-6">

            {/* Desktop Navigation Links */}
            <motion.div
              className="hidden md:flex items-center space-x-2"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={linkClasses}
                >
                  {link.name}
                </NavLink>
              ))}
            </motion.div>

            {/* User Avatar + Theme Toggle + Mobile Menu */}
            <div className="flex items-center space-x-3">

              {/* Dark / Light Mode Toggle */}
              <motion.button
                type="button"
                onClick={() => setDarkMode((prev) => !prev)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 dark:text-yellow-300 bg-gray-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-yellow-200 transition-all duration-300"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>

              {/* User Avatar */}
              {user ? (
                <motion.button
                  type="button"
                  onClick={toggleModal}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 hover:ring-4 hover:ring-indigo-100 dark:hover:ring-indigo-900 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="User profile"
                >
                  {user.name.charAt(0).toUpperCase()}
                </motion.button>
              ) : (
                <NavLink
                  to="/auth"
                  className="hidden md:block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-full font-semibold shadow-md shadow-indigo-200 hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                >
                  Login
                </NavLink>
              )}

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all duration-300 md:hidden"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =========================
            MOBILE MENU
        ========================== */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileMenuVariants}
              className="md:hidden bg-white/98 dark:bg-slate-900/98 backdrop-blur-md absolute top-full left-0 w-full shadow-xl border-t border-indigo-50 dark:border-slate-700 pb-5"
            >
              <div className="flex flex-col items-center space-y-3 pt-5">

                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={toggleMobileMenu}
                    className={linkClasses}
                  >
                    {link.name}
                  </NavLink>
                ))}

                {user?.name ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-full hover:shadow-lg transition-all duration-300 w-1/2 font-semibold"
                  >
                    {user.name}
                  </button>
                ) : (
                  <NavLink
                    to="/auth"
                    onClick={toggleMobileMenu}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-full hover:shadow-lg transition-all duration-300 w-1/2 text-center font-semibold"
                  >
                    Login
                  </NavLink>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* =========================
          USER PROFILE MODAL
          IMPORTANT: OUTSIDE NAV
      ========================== */}
      <AnimatePresence>
        {isModalOpen && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={toggleModal}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={modalVariants}
              className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-indigo-100 bg-white p-8 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
              onClick={(e) => e.stopPropagation()}
            >

              {/* =========================
                  CLOSE BUTTON
              ========================== */}
              <button
                type="button"
                onClick={toggleModal}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all duration-200 hover:bg-red-100 hover:text-red-600 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-red-900/40 dark:hover:text-red-400"
                aria-label="Close profile"
              >
                <X size={22} />
              </button>

              {/* =========================
                  MODAL HEADER
              ========================== */}
              <div className="mb-6 pr-12">
                <h3 className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  <Info
                    size={24}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                  User Profile
                </h3>
              </div>

              {/* =========================
                  USER DETAILS
              ========================== */}
              <div className="space-y-4">

                {/* Name */}
                <div className="flex items-center gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 dark:border-indigo-900 dark:from-indigo-950/50 dark:to-purple-950/50">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                    <User
                      size={22}
                      className="text-indigo-600 dark:text-indigo-300"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Name
                    </p>

                    <p className="break-words font-semibold text-gray-800 dark:text-gray-100">
                      {user.name}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50 p-4 dark:border-purple-900 dark:from-purple-950/50 dark:to-indigo-950/50">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                    <Mail
                      size={22}
                      className="text-purple-600 dark:text-purple-300"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Email
                    </p>

                    <p className="break-all font-semibold text-gray-800 dark:text-gray-100">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* =========================
                  MODAL BUTTONS
              ========================== */}
              <div className="mt-8 flex flex-col gap-3">

                {/* Dashboard */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/dashboard"
                    onClick={handleDashboardClick}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-bold text-white shadow-md transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
                  >
                    Dashboard
                  </Link>
                </motion.div>

                {/* Logout */}
                <motion.button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 py-3 font-bold text-white shadow-md transition-all duration-300 hover:from-red-600 hover:to-rose-700 hover:shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut size={20} />
                  Logout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}