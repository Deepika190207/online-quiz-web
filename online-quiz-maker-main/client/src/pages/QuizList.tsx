import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Plus,
  Clock,
  ListOrdered,
  Search,
  Sparkles,
  CalendarDays,
} from "lucide-react";
import { useApi } from "../api/api";
import { useError } from "../context/useError";

interface Quiz {
  _id: string;
  title: string;
  createdAt: string;
  timeLimit: number;
  questionCount: number;
}

export default function QuizList() {
  const api = useApi();
  const { setErrors } = useError();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadQuizzes() {
      setErrors([]);

      try {
        const res = await api.get("/quizzes");

        const quizzesWithDetails = (res.data.data || []).map(
          (quiz: Quiz) => ({
            ...quiz,
            timeLimit: quiz.timeLimit || 10,
            questionCount: quiz.questionCount || 10,
          })
        );

        setQuizzes(quizzesWithDetails);
      } catch {
        // The global API interceptor handles errors
      } finally {
        setLoading(false);
      }
    }

    loadQuizzes();
  }, [api, setErrors]);

  const filteredQuizzes = quizzes.filter((quiz) => {
    const titleMatch = quiz.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const dateMatch = new Date(quiz.createdAt)
      .toLocaleDateString()
      .includes(searchTerm);

    return titleMatch || dateMatch;
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.97,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/60 px-4 py-8 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950/40 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm dark:border-indigo-900/60 dark:bg-slate-900 dark:text-indigo-300">
              <Sparkles size={16} />
              Explore & Learn
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Available Quizzes
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
              Choose a quiz, test your knowledge, and see how much you can
              learn.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />

            <input
              type="text"
              placeholder="Search by title or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-700 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-950"
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-500" />

            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              Loading quizzes...
            </p>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {filteredQuizzes.length === 0 ? (
              <motion.div
                className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-3xl border border-dashed border-indigo-200 bg-white p-10 text-center shadow-sm dark:border-indigo-900/70 dark:bg-slate-900 sm:p-14"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                  <Search size={30} />
                </div>

                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  No quizzes found
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Try searching with another title or date, or create a new
                  quiz to get started.
                </p>

                <Link
                  to="/create"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:shadow-indigo-950/40"
                >
                  <Plus size={19} />
                  Create a New Quiz
                </Link>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {filteredQuizzes.map((quiz) => (
                    <motion.div
                      key={quiz._id}
                      variants={itemVariants}
                      layout
                      whileHover={{
                        y: -7,
                        transition: { duration: 0.2 },
                      }}
                      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:shadow-indigo-950/30"
                    >
                      {/* Card Top */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-600 p-6">
                        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
                        <div className="absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-purple-300/10" />

                        <div className="relative">
                          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
                            <Sparkles size={21} />
                          </div>

                          <h2 className="line-clamp-2 min-h-[3.5rem] text-xl font-bold leading-7 text-white">
                            {quiz.title}
                          </h2>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="flex flex-1 flex-col p-6">

                        {/* Created Date */}
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <CalendarDays
                            size={16}
                            className="text-indigo-500 dark:text-indigo-400"
                          />

                          <span>
                            Created{" "}
                            {new Date(quiz.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Quiz Details */}
                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <div className="rounded-2xl bg-indigo-50 p-3 dark:bg-indigo-950/50">
                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300">
                              <Clock size={17} />
                              <span className="text-xs font-semibold uppercase tracking-wide">
                                Time
                              </span>
                            </div>

                            <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">
                              {quiz.timeLimit} min
                            </p>
                          </div>

                          <div className="rounded-2xl bg-purple-50 p-3 dark:bg-purple-950/50">
                            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-300">
                              <ListOrdered size={17} />
                              <span className="text-xs font-semibold uppercase tracking-wide">
                                Questions
                              </span>
                            </div>

                            <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">
                              {quiz.questionCount}
                            </p>
                          </div>
                        </div>

                        {/* Button */}
                        <div className="mt-6">
                          <Link
                            to={`/take/${quiz._id}`}
                            className="group/button flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3.5 font-semibold text-white shadow-md shadow-indigo-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:shadow-indigo-950/40"
                          >
                            Take Quiz

                            <ArrowRight
                              size={19}
                              className="transition-transform duration-300 group-hover/button:translate-x-1"
                            />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}