import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="mt-20 border-t-4 border-transparent bg-white pt-12 pb-8 text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-white"
      style={{
        borderImage:
          "linear-gradient(to right, #6366f1, #9333ea) 1",
        borderImageSlice: 1,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 text-center md:text-left">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">

          {/* Logo and Tagline */}
          <div>
            <h4 className="mb-2 text-3xl font-extrabold text-indigo-700 dark:text-indigo-400">
              Quizzy
            </h4>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create, share, and conquer.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h5 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              Quick Links
            </h5>

            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>
                <Link
                  to="/"
                  className="transition-colors duration-200 hover:text-indigo-500 dark:hover:text-indigo-400"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/create"
                  className="transition-colors duration-200 hover:text-indigo-500 dark:hover:text-indigo-400"
                >
                  Create a Quiz
                </Link>
              </li>

              <li>
                <Link
                  to="/explore"
                  className="transition-colors duration-200 hover:text-indigo-500 dark:hover:text-indigo-400"
                >
                  Explore Quizzes
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h5 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              Connect with Us
            </h5>

            <div className="flex justify-center space-x-6 md:justify-start">
              <a
                href="https://github.com/Deepika190207"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 transition-all duration-200 hover:scale-110 hover:text-black dark:text-gray-400 dark:hover:text-white"
              >
                <Github size={24} />
              </a>

              <a
                href="https://www.linkedin.com/in/deepika-hanumanthu-27a822327"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 transition-all duration-200 hover:scale-110 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <Linkedin size={24} />
              </a>

              <a
                href="#"
                className="text-gray-500 transition-all duration-200 hover:scale-110 hover:text-sky-500 dark:text-gray-400 dark:hover:text-sky-400"
              >
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-6 text-center dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Quizzy. All rights reserved By
            Deepika.
          </p>
        </div>
      </div>
    </footer>
  );
}