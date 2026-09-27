// src/pages/Result.tsx
import { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Home,
  RotateCcw,
  LayoutDashboard,
  Trophy,
} from "lucide-react";
import { useApi } from "../api/api";

interface QuestionResult {
  question: string;
  options: string[];
  correctIndex: number;
  yourAnswer: number | null;
}

interface ResultData {
  title: string;
  total: number;
  score: number;
  details: QuestionResult[];
}

export default function Result() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const api = useApi();

  const [resultData, setResultData] = useState<ResultData | null>(
    location.state as ResultData | null
  );
  const [loading, setLoading] = useState(!resultData);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isDevToolsModal, setIsDevToolsModal] = useState(false);

  // Fetch result if location.state is missing
  useEffect(() => {
    if (resultData || !id) return;

    const fetchResult = async () => {
      setLoading(true);

      try {
        const res = await api.get(`/quizzes/${id}/result`);

        if (!res.data.success) {
          throw new Error(
            res.data.message || "Failed to load result"
          );
        }

        const data = res.data.data;
        setResultData(data);
      } catch (err: unknown) {
        const error = err as {
          response?: {
            data?: {
              message?: string;
            };
          };
          message?: string;
        };

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load result"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id, resultData, api]);

  // Disable right-click and developer tools
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    document.addEventListener("contextmenu", handleContextMenu);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.metaKey && e.altKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const checkDevTools = () => {
      const widthThreshold =
        window.outerWidth - window.innerWidth > 160;

      const heightThreshold =
        window.outerHeight - window.innerHeight > 160;

      if (widthThreshold || heightThreshold) {
        setModalMessage("Developer tools detected! Closing...");
        setIsDevToolsModal(true);
        setShowModal(true);
        clearInterval(interval);
      }
    };

    const interval = setInterval(checkDevTools, 1000);

    return () => {
      document.removeEventListener(
        "contextmenu",
        handleContextMenu
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      clearInterval(interval);
    };
  }, [navigate]);

  const handleRetakeQuiz = () => {
    if (id) {
      navigate(`/take/${id}`);
    } else {
      setModalMessage(
        "Quiz ID not found. Cannot retake quiz."
      );
      setIsDevToolsModal(false);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);

    if (isDevToolsModal) {
      navigate("/");
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        <span className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 dark:border-slate-700 border-t-indigo-600 dark:border-t-indigo-400" />
      </div>
    );
  }

  // Error / no result
  if (!resultData || error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/60 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950/40 px-4 transition-colors duration-300">
        <div className="w-full max-w-lg rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center shadow-xl">
          <p className="mb-4 text-xl font-bold text-red-500">
            {error || "No result data found."}
          </p>

          <p className="mb-6 text-gray-600 dark:text-gray-300">
            The quiz results could not be loaded.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-md font-medium text-white shadow-lg transition-all duration-300 hover:bg-indigo-700 hover:scale-105"
            >
              <Home size={18} />
              Go Home
            </Link>

            {id && (
              <button
                onClick={handleRetakeQuiz}
                className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-md font-medium text-white shadow-lg transition-all duration-300 hover:bg-green-700 hover:scale-105"
              >
                <RotateCcw size={18} />
                Retake Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const { title, total, score, details } = resultData;

  const percentage =
    total > 0 ? ((score / total) * 100).toFixed(0) : "0";

  const passed =
    total > 0 && score >= total / 2;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/60 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950/40 px-4 py-6 font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="mx-auto max-w-7xl">
          {/* Title */}
          <h2
            className="mb-8 text-2xl font-extrabold leading-snug sm:text-4xl"
            style={{
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            <span className="text-indigo-600 dark:text-indigo-400">
              Subject:&nbsp;
            </span>

            {title || "Untitled Quiz"}
          </h2>

          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Score Summary */}
            <div className="lg:w-1/3">
              <motion.div
                className="sticky top-6 mb-6 rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 text-center shadow-xl transition-colors duration-300"
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: 0.2,
                }}
              >
                {/* Passed / Failed */}
                <div className="mb-4 flex items-center justify-center gap-3">
                  {passed ? (
                    <Trophy
                      size={48}
                      className="text-yellow-500"
                    />
                  ) : (
                    <XCircle
                      size={48}
                      className="text-red-500"
                    />
                  )}

                  <h2
                    className={`text-4xl font-extrabold ${
                      passed
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {passed ? "Passed!" : "Failed"}
                  </h2>
                </div>

                <h2 className="mb-3 text-3xl font-extrabold text-gray-800 dark:text-white">
                  Quiz Results
                </h2>

                <p className="mb-3 text-xl font-bold text-gray-600 dark:text-gray-300">
                  You scored{" "}
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {score}
                  </span>{" "}
                  out of{" "}
                  <span className="text-gray-800 dark:text-white">
                    {total}
                  </span>
                </p>

                <p className="mb-4 text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {percentage}%
                </p>

                {/* Progress */}
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
                  <div
                    className="h-3 rounded-full bg-indigo-600 transition-all duration-500 ease-out dark:bg-indigo-500"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col gap-4">
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-indigo-700 hover:scale-105"
                  >
                    <Home size={20} />
                    Go Home
                  </Link>

                  {id && (
                    <button
                      onClick={handleRetakeQuiz}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-green-700 hover:scale-105"
                    >
                      <RotateCcw size={20} />
                      Retake Quiz
                    </button>
                  )}

                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-purple-700 hover:scale-105"
                  >
                    <LayoutDashboard size={20} />
                    Dashboard
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Detailed Feedback */}
            <div className="lg:w-2/3">
              <div className="space-y-4">
                {details && details.length > 0 ? (
                  details.map((q, i) => {
                    const isCorrect =
                      q.correctIndex === q.yourAnswer;

                    return (
                      <motion.div
                        key={i}
                        className={`rounded-2xl border p-5 shadow-lg transition-all duration-300 hover:scale-[1.01] ${
                          isCorrect
                            ? "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
                            : "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
                        }`}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{
                          delay: 0.5 + i * 0.1,
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1 shrink-0">
                            {isCorrect ? (
                              <CheckCircle
                                size={24}
                                className="text-green-500"
                              />
                            ) : (
                              <XCircle
                                size={24}
                                className="text-red-500"
                              />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="mb-2 text-md font-bold text-gray-800 dark:text-gray-100">
                              {i + 1}. {q.question}
                            </p>

                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Correct Answer:{" "}
                              <span className="font-semibold text-green-600 dark:text-green-400">
                                {q.options[q.correctIndex]}
                              </span>
                            </p>

                            <p
                              className={`text-sm font-medium ${
                                isCorrect
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              Your Answer:{" "}
                              {q.yourAnswer !== null
                                ? q.options[q.yourAnswer]
                                : "Not answered"}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center shadow-lg">
                    <p className="text-gray-500 dark:text-gray-400">
                      No feedback available.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Custom Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 dark:bg-black/75 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="w-full max-w-sm rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center shadow-2xl"
              initial={{
                y: -50,
                scale: 0.9,
              }}
              animate={{
                y: 0,
                scale: 1,
              }}
              exit={{
                y: -50,
                scale: 0.9,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
                Alert
              </h3>

              <p className="mb-6 text-gray-600 dark:text-gray-300">
                {modalMessage}
              </p>

              <button
                onClick={handleCloseModal}
                className="rounded-full bg-indigo-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                {isDevToolsModal
                  ? "Go to Home"
                  : "OK"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}