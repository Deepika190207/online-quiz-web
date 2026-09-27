import { motion } from "framer-motion";
import {
  BookOpen,
  FlaskConical,
  History,
  Computer,
  Sparkles,
  Search,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

const mockQuizzes = [
  {
    id: 1,
    title: "World History Trivia",
    description:
      "Test your knowledge of key historical events and figures from around the globe.",
    category: "History",
    icon: <History size={22} />,
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: 2,
    title: "Science Superlatives",
    description:
      "Explore fascinating facts and concepts across physics, biology, and chemistry.",
    category: "Science",
    icon: <FlaskConical size={22} />,
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: 3,
    title: "Computer Science Basics",
    description:
      "A beginner-friendly quiz on fundamental programming and computer science topics.",
    category: "Technology",
    icon: <Computer size={22} />,
    color: "from-emerald-500 to-green-600",
  },
  {
    id: 4,
    title: "Literature Legends",
    description:
      "From Shakespeare to modern authors, how well do you know classic books and their stories?",
    category: "Literature",
    icon: <BookOpen size={22} />,
    color: "from-rose-500 to-red-600",
  },
  {
    id: 5,
    title: "General Knowledge",
    description:
      "A wide-ranging quiz to test your general knowledge on various topics.",
    category: "Misc",
    icon: <Sparkles size={22} />,
    color: "from-amber-500 to-orange-600",
  },
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQuizzes = mockQuizzes.filter((quiz) => {
    const query = searchQuery.toLowerCase();

    return (
      quiz.title.toLowerCase().includes(query) ||
      quiz.category.toLowerCase().includes(query) ||
      quiz.description.toLowerCase().includes(query)
    );
  });

  const cardVariants = {
    hidden: {
      y: 25,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.45,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/60 px-4 py-10 transition-colors duration-300 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950/40 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm dark:border-indigo-900/60 dark:bg-slate-900 dark:text-indigo-300"
          >
            <Sparkles size={16} />
            Discover Something New
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl"
          >
            Explore Quizzes
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base"
          >
            Discover interesting quizzes across different topics, challenge
            yourself, and learn something new.
          </motion.p>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mx-auto mb-12 w-full max-w-xl"
        >
          <div className="relative">
            <Search
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />

            <input
              type="text"
              placeholder="Search quizzes, categories, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-13 pr-5 text-sm text-slate-700 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
            />
          </div>
        </motion.div>

        {/* Results */}
        {filteredQuizzes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-xl rounded-3xl border border-dashed border-indigo-200 bg-white p-12 text-center shadow-sm dark:border-indigo-900/70 dark:bg-slate-900"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
              <Search size={30} />
            </div>

            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              No quizzes found
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Try searching for another quiz title, category, or topic.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.09,
                },
              },
            }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredQuizzes.map((quiz) => (
              <motion.div
                key={quiz.id}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2 },
                }}
                className="group flex min-h-[320px] flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:shadow-indigo-950/30"
              >
                {/* Gradient Header */}
                <div
                  className={`relative overflow-hidden bg-gradient-to-br ${quiz.color} p-6`}
                >
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />

                  <div className="absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-white/10" />

                  <div className="relative">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm">
                        {quiz.icon}
                      </div>

                      <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                        {quiz.category}
                      </span>
                    </div>

                    <h3 className="min-h-[3.5rem] text-xl font-bold leading-7 text-white">
                      {quiz.title}
                    </h3>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {quiz.description}
                  </p>

                  {/* Start Button */}
                  <div className="mt-6">
                    <button
                      type="button"
                      className="group/button flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 px-5 py-3 font-semibold text-indigo-600 transition-all duration-300 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 dark:text-indigo-300 dark:hover:bg-indigo-600 dark:hover:text-white"
                    >
                      Start Quiz

                      <ArrowRight
                        size={18}
                        className="transition-transform duration-300 group-hover/button:translate-x-1"
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Explore;