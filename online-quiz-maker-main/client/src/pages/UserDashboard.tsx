import { useEffect, useState, useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  XCircle,
  Calendar,
  Trophy,
  ListChecks,
  Percent,
  ArrowRight,
  Search,
  Target,
  TrendingUp,
} from "lucide-react";
import { AuthContext } from "../context/authContextValue";
import ResultChart from "../components/ResultChart";
import { useApi } from "../api/api";

interface QuizResult {
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  date: string;
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const cardHover = {
  y: -4,
  transition: { duration: 0.2 },
};

export default function UserDashboard() {
  const api = useApi();

  const { user, token } = useContext(AuthContext);

  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [totals, setTotals] = useState({
    correct: 0,
    incorrect: 0,
  });

  const [activeChart, setActiveChart] = useState<"overall" | "latest">(
    "overall"
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const [resultFilter, setResultFilter] = useState<
    "all" | "passed" | "failed"
  >("all");

  useEffect(() => {
    if (!token) return;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get("/auth/dashboard");
        const data = res.data;

        const formattedResults: QuizResult[] = (data.tests || []).map(
          (r: {
            quizId: string;
            quizTitle?: string;
            score?: number;
            totalQuestions?: number;
            date?: string;
          }) => ({
            quizId: r.quizId,
            quizTitle:
              r.quizTitle ||
              `Quiz ${String(r.quizId || "").substring(0, 6)}`,
            score: typeof r.score === "number" ? r.score : 0,
            totalQuestions:
              typeof r.totalQuestions === "number" ? r.totalQuestions : 0,
            date: r.date || new Date().toISOString(),
          })
        );

        formattedResults.sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        const totalCorrect = formattedResults.reduce(
          (sum, q) => sum + q.score,
          0
        );

        const totalIncorrect = formattedResults.reduce(
          (sum, q) => sum + (q.totalQuestions - q.score),
          0
        );

        setResults(formattedResults);
        setTotals({
          correct: totalCorrect,
          incorrect: totalIncorrect,
        });
      } catch (err: unknown) {
        const errorResponse = err as {
          response?: {
            data?: {
              message?: string;
            };
          };
          message?: string;
        };

        setError(
          errorResponse.response?.data?.message ||
            errorResponse.message ||
            "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [token, api]);

  const totalQuizzes = results.length;
  const latestQuiz = results[0] || null;

  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce(
            (sum, result) =>
              sum +
              (result.totalQuestions > 0
                ? (result.score / result.totalQuestions) * 100
                : 0),
            0
          ) / results.length
        )
      : 0;

  const passedQuizzes = results.filter(
    (result) =>
      result.totalQuestions > 0 &&
      result.score >= result.totalQuestions / 2
  ).length;

  const filteredResults = useMemo(() => {
    return results.filter((res) => {
      const matchesTitle = res.quizTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const isoDay = new Date(res.date).toISOString().slice(0, 10);

      const matchesDate = searchDate ? isoDay === searchDate : true;

      const isPassed =
        res.totalQuestions > 0 &&
        res.score >= res.totalQuestions / 2;

      const matchesStatus =
        resultFilter === "all" ||
        (resultFilter === "passed" && isPassed) ||
        (resultFilter === "failed" && !isPassed);

      return matchesTitle && matchesDate && matchesStatus;
    });
  }, [results, searchTerm, searchDate, resultFilter]);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/60 px-4 py-8 text-slate-900 transition-colors duration-300 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950/40 dark:text-slate-100 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl space-y-8">

        {/* HEADER */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 p-7 text-white shadow-xl sm:p-10"
        >
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
              <Target size={17} />
              Your Learning Dashboard
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Welcome back, {user?.name || "Quizzer"}! 👋
            </h1>

            <p className="mt-2 max-w-2xl text-indigo-100">
              Track your quiz progress, review your results, and keep
              challenging yourself.
            </p>
          </div>
        </motion.div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <motion.div
            className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm dark:border-indigo-900/60 dark:bg-slate-900"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={cardHover}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Quizzes Completed
                </p>
                <p className="mt-2 text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {totalQuizzes}
                </p>
              </div>

              <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
                <ListChecks size={28} />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm dark:border-purple-900/60 dark:bg-slate-900"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={cardHover}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Average Score
                </p>
                <p className="mt-2 text-4xl font-extrabold text-purple-600 dark:text-purple-400">
                  {averageScore}%
                </p>
              </div>

              <div className="rounded-2xl bg-purple-50 p-4 text-purple-600 dark:bg-purple-950/50 dark:text-purple-300">
                <TrendingUp size={28} />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-900/60 dark:bg-slate-900"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={cardHover}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Quizzes Passed
                </p>
                <p className="mt-2 text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {passedQuizzes}
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
                <Trophy size={28} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">

          {/* LEFT SIDE */}
          <div className="space-y-6 lg:col-span-1">

            {/* USER CARD */}
            <motion.div
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={cardHover}
            >
              <div className="h-24 bg-gradient-to-r from-indigo-600 to-purple-600" />

              <div className="px-6 pb-6">
                <div className="-mt-10 mb-5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg dark:border-slate-900">
                    <User size={34} />
                  </div>
                </div>

                <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  Your Profile
                </p>

                <h2 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {user?.name || "Guest"}
                </h2>

                <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
                  {user?.email || "No Email"}
                </p>

                <div className="mt-6 rounded-2xl bg-indigo-50 p-4 dark:bg-indigo-950/50">
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                    Keep learning
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Every quiz is another opportunity to improve.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CHART */}
            {totalQuizzes > 0 && (
              <motion.div
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      Performance
                    </p>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      Quiz Analytics
                    </h3>
                  </div>

                  <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
                    <Percent size={20} />
                  </div>
                </div>

                <div className="mb-5 flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                  <button
                    className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${
                      activeChart === "overall"
                        ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-300"
                        : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                    onClick={() => setActiveChart("overall")}
                  >
                    Overall
                  </button>

                  <button
                    className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${
                      activeChart === "latest"
                        ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-300"
                        : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                    onClick={() => setActiveChart("latest")}
                  >
                    Latest Quiz
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {activeChart === "overall" && (
                    <motion.div
                      key="overall-chart"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <h3 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                        Overall Performance
                      </h3>

                      <ResultChart
                        correct={totals.correct}
                        incorrect={totals.incorrect}
                      />
                    </motion.div>
                  )}

                  {activeChart === "latest" && latestQuiz && (
                    <motion.div
                      key="latest-chart"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <h3 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                        Latest Quiz Performance
                      </h3>

                      <ResultChart
                        correct={latestQuiz.score}
                        incorrect={Math.max(
                          0,
                          latestQuiz.totalQuestions - latestQuiz.score
                        )}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* TAKE QUIZ */}
            <motion.a
              href="/list"
              className="group flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 text-center text-lg font-bold text-white shadow-lg shadow-indigo-200 transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl dark:shadow-indigo-950/40"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -2 }}
            >
              Take a New Quiz
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </motion.a>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-2">
            <motion.div
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-7"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* RESULTS HEADER */}
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <ListChecks size={21} />
                    <span className="text-sm font-bold">
                      Your Activity
                    </span>
                  </div>

                  <h2 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                    Recent Results
                  </h2>
                </div>

                <div className="rounded-xl bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
                  {filteredResults.length} Result
                  {filteredResults.length !== 1 ? "s" : ""}
                </div>
              </div>

              {/* FILTER BUTTONS */}
              <div className="mb-5 flex flex-wrap gap-2">
                <button
                  onClick={() => setResultFilter("all")}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                    resultFilter === "all"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-950/40"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  All Results
                </button>

                <button
                  onClick={() => setResultFilter("passed")}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                    resultFilter === "passed"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-950/40"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  Passed
                </button>

                <button
                  onClick={() => setResultFilter("failed")}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                    resultFilter === "failed"
                      ? "bg-red-600 text-white shadow-md shadow-red-200 dark:shadow-red-950/40"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  Failed
                </button>
              </div>

              {/* SEARCH + DATE */}
              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-indigo-500 dark:focus-within:bg-slate-800 dark:focus-within:ring-indigo-950">
                  <Search size={19} className="text-slate-400" />

                  <input
                    type="text"
                    placeholder="Search by quiz title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />
                </div>

                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 transition-all focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-indigo-500 dark:focus-within:bg-slate-800 dark:focus-within:ring-indigo-950">
                  <Calendar size={17} className="mr-2 text-slate-400" />

                  <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="bg-transparent py-3 text-sm text-slate-600 outline-none dark:text-slate-300"
                  />
                </div>
              </div>

              {/* RESULTS */}
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    className="flex min-h-[280px] flex-col items-center justify-center"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-500" />
                    <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      Loading your results...
                    </p>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    className="flex min-h-[280px] flex-col items-center justify-center text-center"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <div className="rounded-2xl bg-red-50 p-4 text-red-500 dark:bg-red-950/40 dark:text-red-400">
                      <XCircle size={30} />
                    </div>

                    <p className="mt-4 font-semibold text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </motion.div>
                ) : filteredResults.length === 0 ? (
                  <motion.div
                    key="no-results"
                    className="flex min-h-[280px] flex-col items-center justify-center text-center"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <div className="rounded-2xl bg-indigo-50 p-5 text-indigo-500 dark:bg-indigo-950/50 dark:text-indigo-300">
                      <ListChecks size={34} />
                    </div>

                    <h3 className="mt-5 text-lg font-extrabold text-slate-800 dark:text-white">
                      No matching results
                    </h3>

                    <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                      Try changing your search or filter, or take a new quiz
                      to start building your results.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    className="grid gap-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.08,
                        },
                      },
                    }}
                  >
                    {filteredResults.map((res, index) => {
                      const isPassed =
                        res.totalQuestions > 0 &&
                        res.score >= res.totalQuestions / 2;

                      const percent =
                        res.totalQuestions > 0
                          ? Math.round(
                              (res.score / res.totalQuestions) * 100
                            )
                          : 0;

                      return (
                        <motion.div
                          key={res.quizId + index}
                          className="group rounded-2xl border border-slate-200 bg-slate-50/80 p-5 transition-all hover:border-indigo-200 hover:bg-white hover:shadow-lg hover:shadow-indigo-100/50 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:border-indigo-800 dark:hover:bg-slate-800 dark:hover:shadow-indigo-950/30"
                          variants={itemVariants}
                          whileHover={cardHover}
                        >
                          <div className="flex flex-col gap-5">

                            {/* TITLE */}
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
                                  Quiz Result
                                </p>

                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                  {res.quizTitle}
                                </h3>
                              </div>

                              <div
                                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                                  isPassed
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                    : "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300"
                                }`}
                              >
                                {isPassed ? "Passed" : "Failed"}
                              </div>
                            </div>

                            {/* PROGRESS */}
                            <div>
                              <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                                <span className="text-slate-500 dark:text-slate-400">
                                  Score
                                </span>

                                <span className="text-indigo-600 dark:text-indigo-400">
                                  {percent}%
                                </span>
                              </div>

                              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                <motion.div
                                  className={`h-full rounded-full ${
                                    isPassed
                                      ? "bg-gradient-to-r from-emerald-500 to-green-400"
                                      : "bg-gradient-to-r from-red-500 to-orange-400"
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percent}%` }}
                                  transition={{
                                    duration: 0.7,
                                    delay: 0.2,
                                  }}
                                />
                              </div>
                            </div>

                            {/* META */}
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                <Trophy
                                  size={17}
                                  className="text-yellow-500"
                                />
                                <span className="font-bold">
                                  {res.score}
                                </span>
                                <span>/ {res.totalQuestions}</span>
                              </div>

                              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                <Percent size={16} />
                                <span className="font-bold">
                                  {percent}%
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                <Calendar size={16} />
                                {new Date(
                                  res.date
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}