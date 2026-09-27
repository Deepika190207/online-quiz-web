import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, Clock } from "lucide-react";
import { useApi } from "../api/api";
import { useError } from "../context/useError";
import { AuthContext } from "../context/authContextValue";
import { useSuccess } from "../context/useSuccess";

// Define the shape of a question
type Q = {
  _id?: string;
  question: string;
  options: string[];
  correctIndex: number;
};

// Define the shape of the quiz data
type QuizData = {
  title: string;
  questions: Q[];
};

// Helper function to format time from seconds to MM:SS
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

export default function TakeQuiz() {
  const { id } = useParams();
  const api = useApi();
  const { setErrors } = useError();
  const { addMessage } = useSuccess();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [, setIsDevToolsModal] = useState(false);

  // Custom Modal for Alerts
  const CustomModal = ({
    isOpen,
    onClose,
    message,
    showCloseButton = true,
  }: {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    showCloseButton?: boolean;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75 dark:bg-black/80 p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-6 text-center shadow-2xl">
          <p className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
            {message}
          </p>

          {showCloseButton && (
            <button
              onClick={onClose}
              className="rounded-xl bg-red-600 px-5 py-2.5 font-medium text-white transition-all duration-200 hover:bg-red-700 hover:scale-105"
            >
              OK
            </button>
          )}
        </div>
      </div>
    );
  };

  // Disclaimer modal on initial load
  useEffect(() => {
    if (!loading) {
      setModalMessage(
        "Important: This is a timed quiz. Switching tabs or leaving this page will result in the quiz ending and the page refreshing. Inspecting the page is also disabled."
      );

      setShowModal(true);
    }
  }, [loading]);

  // Disable right-click & inspect
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey &&
          e.shiftKey &&
          ["I", "J"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U")
      ) {
        e.preventDefault();

        setModalMessage("Inspecting is disabled!");
        setShowModal(true);
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  // Tab-switching protection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setModalMessage(
          "Warning: You left the quiz. The page will now refresh."
        );

        setShowModal(true);

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  // Load quiz
  const loadQuiz = async () => {
    setErrors([]);

    // DevTools check
    const isDevToolsOpen = () => {
      const widthThreshold =
        window.outerWidth - window.innerWidth > 160;

      const heightThreshold =
        window.outerHeight - window.innerHeight > 160;

      return widthThreshold || heightThreshold;
    };

    if (isDevToolsOpen()) {
      setModalMessage(
        "Developer tools detected! Please close them to start the quiz."
      );

      setIsDevToolsModal(true);
      setShowModal(true);
      setLoading(false);

      return;
    }

    try {
      const res = await api.get(`/quizzes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const quizData: QuizData = res.data.data;

      setQuiz(quizData);
      setAnswers(
        Array(quizData.questions.length).fill(null)
      );
    } catch (err: unknown) {
      const error = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      setErrors([
        error.response?.data?.message ||
          "Failed to load quiz",
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Load quiz when token is available
  useEffect(() => {
    if (!token) return;

    loadQuiz();

    // loadQuiz uses api, id and setErrors from the component scope.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Timer logic for each question
  useEffect(() => {
    if (loading || !quiz || showModal) return;

    if (timeLeft <= 0) {
      if (index < quiz.questions.length - 1) {
        setIndex((i) => i + 1);
        setTimeLeft(30);
      } else {
        submitQuiz(answers);
      }

      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // Handle quiz submission
  const submitQuiz = async (
    finalAnswers: (number | null)[] = answers
  ) => {
    try {
      const res = await api.post(
        `/quizzes/${id}/submit`,
        {
          answers: finalAnswers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/result/${id}`, {
        state: {
          score: res.data.score,
          title: res.data.title,
          total: res.data.total,
          answers: finalAnswers,
          quiz,
          details: res.data.details,
        },
      });

      addMessage("Quiz Submitted Sucessfully");
    } catch (err: unknown) {
      const error = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      setErrors([
        error.response?.data?.message ||
          "Failed to submit quiz",
      ]);
    }
  };

  // Move to the next question or submit
  const next = async () => {
    if (
      index <
      (quiz?.questions.length ?? 0) - 1
    ) {
      setIndex((i) => i + 1);
      setTimeLeft(30);
    } else {
      await submitQuiz();
    }
  };

  // Handle option selection
  const chooseOption = (idx: number) => {
    const copy = [...answers];

    copy[index] = idx;

    setAnswers(copy);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 dark:border-slate-700 border-t-indigo-600 dark:border-t-indigo-400" />

        <p className="ml-4 text-xl text-gray-600 dark:text-gray-300">
          Loading quiz...
        </p>
      </div>
    );
  }

  // Quiz not found / no questions
  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950 p-4">
        <div className="mx-auto w-full max-w-xl rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center shadow-xl">
          <p className="mb-6 flex items-center justify-center gap-2 text-2xl font-bold text-red-500">
            <XCircle size={28} />
            Your developer tool detected
          </p>

          <p className="mb-8 text-gray-600 dark:text-gray-300">
            Close the Developer tool to start the quiz. Please try
            again or go back to the homepage. Quiz Not Found or No
            Questions Available.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:bg-indigo-700 hover:scale-105"
            >
              Go Home
            </Link>

            <button
              onClick={loadQuiz}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:bg-red-700 hover:scale-105"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = quiz.questions[index];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/60 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950/40 p-4 sm:p-6 md:p-8 font-mono text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <CustomModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message={modalMessage}
        showCloseButton={
          !modalMessage.includes("Warning")
        }
      />

      <motion.div
        className="w-full max-w-3xl rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl transition-colors duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.5 },
        }}
      >
        {/* Quiz Header */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 dark:border-slate-700 pb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {quiz.title}
          </h2>

          <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/40 px-3 py-2 text-xl font-semibold text-red-600 dark:text-red-400">
            <Clock size={24} />
            <p>{formatTime(timeLeft)}</p>
          </div>
        </div>

        {/* Question Information */}
        <div className="mb-8">
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            Question{" "}
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {index + 1}
            </span>{" "}
            of{" "}
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {quiz.questions.length}
            </span>
          </p>

          <p className="text-lg sm:text-xl font-semibold leading-relaxed text-gray-800 dark:text-gray-100">
            {q.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {q.options.map((opt, i) => (
            <motion.button
              key={i}
              onClick={() => chooseOption(i)}
              className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 transform hover:-translate-y-0.5 ${
                answers[index] === i
                  ? "border-indigo-600 bg-indigo-600 text-white shadow-lg"
                  : "border-gray-200 bg-gray-50 text-gray-800 hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200 dark:hover:border-indigo-500 dark:hover:bg-slate-700"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.1 + i * 0.05,
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold transition-colors duration-300 ${
                    answers[index] === i
                      ? "bg-white text-indigo-600"
                      : "border border-gray-300 bg-white text-gray-500 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>

                <span className="flex-1 text-base sm:text-lg">
                  {opt}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Next / Submit */}
        <div className="mt-8 flex justify-end">
          <motion.button
            onClick={next}
            className={`rounded-xl px-8 py-3 text-lg font-bold shadow-lg transition-all duration-300 transform ${
              answers[index] === null
                ? "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-slate-700 dark:text-slate-500"
                : "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105"
            }`}
            disabled={answers[index] === null}
          >
            {index <
            (quiz?.questions.length ?? 0) - 1
              ? "Next Question"
              : "Submit Quiz"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}