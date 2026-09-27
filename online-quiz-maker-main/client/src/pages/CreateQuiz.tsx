import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Share2,
  Copy,
  CheckCircle2,
  Sparkles,
  CircleHelp,
} from "lucide-react";
import { useApi } from "../api/api";
import { useError } from "../context/useError";
import { useSuccess } from "../context/useSuccess";

type Option = string;

type Q = {
  question: string;
  options: Option[];
  correctIndex: number;
};

export default function CreateQuiz() {
  const api = useApi();
  const { setErrors } = useError();
  const { addMessage } = useSuccess();

  const [title, setTitle] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [questions, setQuestions] = useState<Q[]>([
    {
      question: "",
      options: ["", "", "", ""],
      correctIndex: 0,
    },
  ]);

  const [quizLink, setQuizLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopyLink = () => {
    if (!quizLink) return;

    const fullLink = `${window.location.origin}${quizLink}`;

    navigator.clipboard.writeText(fullLink).then(() => setCopied(true));
  };

  const updateQuestion = (i: number, field: Partial<Q>) => {
    const copy = [...questions];
    copy[i] = {
      ...copy[i],
      ...field,
    };

    setQuestions(copy);
  };

  const addQuestion = () =>
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctIndex: 0,
      },
    ]);

  const removeQuestion = (i: number) => {
    if (questions.length <= 1) return;

    setQuestions(questions.filter((_, idx) => idx !== i));
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!title.trim()) {
      newErrors.push("Quiz title is required.");
    }

    questions.forEach((q, i) => {
      if (!q.question.trim()) {
        newErrors.push(`Question ${i + 1} cannot be empty.`);
      }

      q.options.forEach((opt, j) => {
        if (!opt.trim()) {
          newErrors.push(
            `Option ${j + 1} for Question ${i + 1} cannot be empty.`
          );
        }
      });
    });

    setErrors(newErrors);

    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitted(true);
    setErrors([]);

    if (!validateForm()) return;

    try {
      const payload = {
        title,
        questions,
      };

      const res = await api.post("/quizzes", payload);

      const quizId = res.data.data._id;

      addMessage("Quiz Created Successfully");

      setQuizLink(`/take/${quizId}`);

      setTitle("");

      setQuestions([
        {
          question: "",
          options: ["", "", "", ""],
          correctIndex: 0,
        },
      ]);
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
          "Something went wrong while creating the quiz.",
      ]);
    }
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const fullQuizLink = quizLink
    ? `${window.location.origin}${quizLink}`
    : "";

  const whatsappUrl = encodeURI(
    `https://api.whatsapp.com/send?text=Take this quiz: ${fullQuizLink}`
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950/40 px-4 py-8 md:py-12 transition-colors duration-300">
      <motion.div
        className="max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <AnimatePresence mode="wait">
          {quizLink ? (
            /* =========================
               QUIZ CREATED SUCCESS
            ========================== */
            <motion.div
              key="success-message"
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
              }}
              transition={{
                duration: 0.4,
              }}
              className="overflow-hidden rounded-3xl border border-green-100 dark:border-green-900/50 bg-white dark:bg-slate-900 shadow-2xl shadow-green-100/50 dark:shadow-black/30"
            >
              {/* Success Header */}
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 px-6 py-12 text-center text-white md:px-12">
                <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-white/10" />
                <div className="absolute -bottom-20 -right-10 h-52 w-52 rounded-full bg-white/10" />

                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.5,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    delay: 0.1,
                    type: "spring",
                    stiffness: 160,
                  }}
                  className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/15 ring-8 ring-white/10 backdrop-blur-sm"
                >
                  <CheckCircle2
                    size={48}
                    className="text-white"
                  />
                </motion.div>

                <h2 className="relative text-3xl font-extrabold tracking-tight md:text-4xl">
                  Quiz Created! 🎉
                </h2>

                <p className="relative mt-3 text-sm text-indigo-100 md:text-base">
                  Your quiz is ready. Share it with your friends and
                  challenge them!
                </p>
              </div>

              {/* Link Section */}
              <div className="p-6 md:p-10">
                <p className="mb-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Your quiz link
                </p>

                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 shadow-inner">
                  <a
                    href={quizLink}
                    className="min-w-0 flex-1 break-all px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 transition-colors hover:text-indigo-800 dark:hover:text-indigo-300 md:text-base"
                  >
                    {fullQuizLink}
                  </a>

                  <motion.button
                    type="button"
                    onClick={handleCopyLink}
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all ${
                      copied
                        ? "bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400"
                        : "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/60"
                    }`}
                    aria-label="Copy quiz link"
                  >
                    {copied ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <Copy size={20} />
                    )}

                    <AnimatePresence>
                      {copied && (
                        <motion.span
                          initial={{
                            opacity: 0,
                            y: 5,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            y: 5,
                          }}
                          className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 dark:bg-white px-2.5 py-1 text-xs font-semibold text-white dark:text-slate-900 shadow-lg"
                        >
                          Copied!
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <motion.a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-green-200 dark:shadow-black/30 transition-all hover:shadow-xl"
                  >
                    <Share2 size={20} />
                    Share on WhatsApp
                  </motion.a>

                  <motion.button
                    type="button"
                    onClick={() => setQuizLink(null)}
                    whileHover={{
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-indigo-200 dark:shadow-black/30 transition-all hover:shadow-xl"
                  >
                    <Plus size={20} />
                    Create Another Quiz
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* =========================
               CREATE QUIZ FORM
            ========================== */
            <motion.div
              key="create-form"
              initial={{
                opacity: 0,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.97,
              }}
              transition={{
                duration: 0.4,
              }}
              className="overflow-hidden rounded-3xl border border-indigo-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-indigo-100/60 dark:shadow-black/30"
            >
              {/* Page Header */}
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 px-6 py-10 text-center text-white md:px-10">
                <div className="absolute -left-16 -top-20 h-48 w-48 rounded-full bg-white/10" />
                <div className="absolute -bottom-24 -right-10 h-60 w-60 rounded-full bg-white/10" />

                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.1,
                  }}
                  className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 shadow-lg ring-1 ring-white/20 backdrop-blur-sm"
                >
                  <Sparkles size={28} />
                </motion.div>

                <h2 className="relative text-3xl font-extrabold tracking-tight md:text-4xl">
                  Create a New Quiz
                </h2>

                <p className="relative mx-auto mt-3 max-w-xl text-sm leading-6 text-indigo-100 md:text-base">
                  Build an engaging quiz, add your questions, choose the
                  correct answers, and share it with others.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-7 p-5 md:p-10"
              >
                {/* Quiz Title */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="quiz-title"
                      className="text-sm font-bold text-slate-700 dark:text-slate-200"
                    >
                      Quiz Title
                    </label>

                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      Give your quiz a name
                    </span>
                  </div>

                  <motion.input
                    id="quiz-title"
                    whileFocus={{
                      scale: 1.005,
                    }}
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);

                      if (submitted) {
                        validateForm();
                      }
                    }}
                    placeholder="e.g. General Knowledge Challenge"
                    className={`w-full rounded-2xl border-2 bg-slate-50 dark:bg-slate-800 px-4 py-3.5 text-base font-medium text-slate-800 dark:text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-950/60 ${
                      submitted && !title.trim()
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 dark:border-slate-700 focus:border-indigo-500"
                    }`}
                  />

                  {submitted && !title.trim() && (
                    <motion.p
                      initial={{
                        opacity: 0,
                        y: -4,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="mt-2 text-sm font-medium text-red-500"
                    >
                      Quiz title is required.
                    </motion.p>
                  )}
                </div>

                {/* Questions Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">
                      Questions
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Select the radio button beside the correct answer.
                    </p>
                  </div>

                  <div className="hidden items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-300 sm:flex">
                    <CircleHelp size={14} />
                    {questions.length}{" "}
                    {questions.length === 1
                      ? "Question"
                      : "Questions"}
                  </div>
                </div>

                {/* Questions */}
                <AnimatePresence>
                  {questions.map((q, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: -30,
                        height: 0,
                        marginBottom: 0,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/70 p-4 shadow-sm transition-all duration-300 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg md:p-6"
                    >
                      {/* Question Header */}
                      <div className="mb-5 flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-extrabold text-white shadow-md shadow-indigo-200 dark:shadow-black/30">
                          {i + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                              Question {i + 1}
                            </span>

                            {questions.length > 1 && (
                              <motion.button
                                type="button"
                                onClick={() => removeQuestion(i)}
                                whileHover={{
                                  scale: 1.05,
                                }}
                                whileTap={{
                                  scale: 0.95,
                                }}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 dark:text-slate-500 transition-all hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-500 dark:hover:text-red-400"
                                aria-label={`Remove question ${i + 1}`}
                              >
                                <Trash2 size={18} />
                              </motion.button>
                            )}
                          </div>

                          <input
                            value={q.question}
                            onChange={(e) =>
                              updateQuestion(i, {
                                question: e.target.value,
                              })
                            }
                            placeholder={`Write question ${i + 1} here...`}
                            className={`w-full border-b-2 bg-transparent py-2 text-base font-semibold text-slate-800 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                              submitted && !q.question.trim()
                                ? "border-red-400 focus:border-red-500"
                                : "border-slate-200 dark:border-slate-700 focus:border-indigo-500"
                            }`}
                          />

                          {submitted && !q.question.trim() && (
                            <p className="mt-2 text-xs font-medium text-red-500">
                              Question {i + 1} cannot be empty.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {q.options.map((opt, j) => (
                          <motion.div
                            key={j}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{
                              delay: j * 0.04,
                            }}
                            className={`flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${
                              q.correctIndex === j
                                ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50/60 dark:bg-indigo-950/50 shadow-sm"
                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-sm"
                            }`}
                          >
                            {/* Correct Answer Radio */}
                            <input
                              type="radio"
                              name={`correct-${i}`}
                              checked={q.correctIndex === j}
                              onChange={() =>
                                updateQuestion(i, {
                                  correctIndex: j,
                                })
                              }
                              className="h-5 w-5 shrink-0 cursor-pointer accent-indigo-600"
                              aria-label={`Mark option ${
                                j + 1
                              } as correct`}
                            />

                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400">
                              {String.fromCharCode(65 + j)}
                            </div>

                            <input
                              value={opt}
                              onChange={(e) => {
                                const opts = [...q.options];
                                opts[j] = e.target.value;

                                updateQuestion(i, {
                                  options: opts,
                                });
                              }}
                              placeholder={`Option ${j + 1}`}
                              className={`min-w-0 flex-1 bg-transparent py-1 text-sm font-medium text-slate-700 dark:text-slate-200 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                                submitted && !opt.trim()
                                  ? "text-red-600 dark:text-red-400"
                                  : ""
                              }`}
                            />
                          </motion.div>
                        ))}
                      </div>

                      {submitted &&
                        q.options.some((opt) => !opt.trim()) && (
                          <motion.p
                            initial={{
                              opacity: 0,
                              y: -4,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            className="mt-3 text-xs font-medium text-red-500"
                          >
                            All options for Question {i + 1} must be
                            filled.
                          </motion.p>
                        )}

                      <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                        💡 Tip: Select the radio button for the correct
                        answer.
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="grid gap-3 border-t border-slate-100 dark:border-slate-800 pt-6 sm:grid-cols-2">
                  <motion.button
                    type="button"
                    onClick={addQuestion}
                    whileHover={{
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-indigo-100 dark:border-indigo-900/60 bg-indigo-50 dark:bg-indigo-950/50 px-6 py-3.5 font-bold text-indigo-600 dark:text-indigo-300 transition-all hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/60"
                  >
                    <Plus size={20} />
                    Add Question
                  </motion.button>

                  <motion.button
                    type="submit"
                    whileHover={{
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-indigo-200 dark:shadow-black/30 transition-all hover:shadow-xl"
                  >
                    <Sparkles size={19} />
                    Create Quiz
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}