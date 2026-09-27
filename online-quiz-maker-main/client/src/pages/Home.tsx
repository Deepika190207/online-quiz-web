import { motion, useInView } from "framer-motion";
import {
  Sparkles,
  Trophy,
  Settings,
  Users,
  Sun,
  CheckCircle,
} from "lucide-react";
import { useRef } from "react";
import type { Variants } from "framer-motion";

export default function Home() {
  const featureVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  } as const;

  const heroImageVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotate: -5,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  } as const;

  const cardVariants = {
    offscreen: {
      y: 100,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.35,
        duration: 0.9,
      },
    },
  } as const;

  const cardRef = useRef(null);

  const isCardInView = useInView(cardRef, {
    once: true,
    amount: 0.3,
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 min-h-screen font-sans overflow-hidden transition-colors duration-300">

      {/* Custom Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      {/* ================= HERO SECTION ================= */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 text-white rounded-b-[3rem] shadow-2xl"
      >

        {/* Decorative Background Circles */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl" />

        <div className="absolute top-20 right-1/3 w-20 h-20 bg-white/5 rounded-full blur-xl" />

        {/* Decorative Wave */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d="M0,160L48,165.3C96,171,192,181,288,170.7C384,160,480,128,576,133.3C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:px-10 md:py-24 lg:py-28 flex flex-col md:flex-row items-center justify-between gap-14">

          {/* Hero Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-sm font-medium"
            >
              <Sparkles size={17} />
              Create. Challenge. Learn.
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6">
              Quizzy
              <span className="block text-purple-200 mt-2">
                Make Learning Fun.
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed text-white/85 max-w-2xl mx-auto md:mx-0 mb-9">
              The ultimate platform to create, share, and conquer quizzes.
              Test your knowledge on any topic, anytime.
            </p>

            {/* Hero Buttons */}
            <div className="flex justify-center md:justify-start flex-wrap gap-4">

              <motion.a
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 15px 30px rgba(0,0,0,0.20)",
                }}
                whileTap={{ scale: 0.97 }}
                href="/create"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-700 font-bold rounded-2xl shadow-lg transition-all duration-300"
              >
                Create a Quiz
              </motion.a>

              <motion.a
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  backgroundColor: "#ffffff",
                  color: "#4f46e5",
                }}
                whileTap={{ scale: 0.97 }}
                href="/list"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/80 text-white font-bold rounded-2xl transition-all duration-300"
              >
                Explore Quizzes
              </motion.a>

            </div>
          </div>

          {/* Hero Image */}
          <motion.div
            className="w-full md:w-1/2 flex justify-center"
            variants={heroImageVariants as Variants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >

              <div className="absolute inset-4 bg-white/20 blur-3xl rounded-full" />

              <img
                src="/images/Home.png"
                alt="A fun illustration of people interacting with quizzes"
                className="relative rounded-[2rem] shadow-2xl h-auto max-h-96 w-auto object-contain border-4 border-white/20 backdrop-blur-sm"
              />

            </motion.div>
          </motion.div>

        </div>
      </motion.section>


      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-5 py-16 md:px-8 md:py-24">

        {/* ================= FEATURES HEADER ================= */}
        <div className="text-center mb-14">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 text-sm font-semibold"
          >
            <Sparkles size={16} />
            Powerful Features
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-4">
            Key Features
          </h2>

          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Quizzy offers a seamless experience for creators and players alike.
          </p>

        </div>


        {/* ================= FEATURE CARDS ================= */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >

          {/* Easy Creation */}
          <motion.div
            className="group bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm hover:shadow-2xl text-center border border-gray-100 dark:border-slate-800 transition-all duration-300"
            variants={featureVariants as Variants}
            whileHover={{
              y: -10,
              scale: 1.02,
            }}
          >
            <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-yellow-50 dark:bg-yellow-950/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Sparkles
                size={34}
                className="text-yellow-500"
              />
            </div>

            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              Easy Creation
            </h3>

            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              Quickly build engaging quizzes with a simple, intuitive
              interface. No coding required.
            </p>
          </motion.div>


          {/* Challenge & Share */}
          <motion.div
            className="group bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm hover:shadow-2xl text-center border border-gray-100 dark:border-slate-800 transition-all duration-300"
            variants={featureVariants as Variants}
            whileHover={{
              y: -10,
              scale: 1.02,
            }}
          >
            <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-950/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Trophy
                size={34}
                className="text-green-500"
              />
            </div>

            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              Challenge & Share
            </h3>

            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              Share your quizzes with friends and see who can get the highest
              score.
            </p>
          </motion.div>


          {/* Instant Feedback */}
          <motion.div
            className="group bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm hover:shadow-2xl text-center border border-gray-100 dark:border-slate-800 transition-all duration-300"
            variants={featureVariants as Variants}
            whileHover={{
              y: -10,
              scale: 1.02,
            }}
          >
            <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Settings
                size={34}
                className="text-blue-500"
              />
            </div>

            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              Instant Feedback
            </h3>

            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              Receive immediate results and review your answers to learn on
              the spot.
            </p>
          </motion.div>

        </motion.div>


        {/* ================= WHY CHOOSE QUIZZY ================= */}
        <motion.div
          ref={cardRef}
          className="relative bg-white dark:bg-slate-900 p-8 md:p-14 rounded-[2rem] shadow-sm hover:shadow-xl flex flex-col md:flex-row items-center gap-12 border border-gray-100 dark:border-slate-800 transition-colors duration-300"
          initial="offscreen"
          animate={isCardInView ? "onscreen" : "offscreen"}
          variants={cardVariants as Variants}
        >

          {/* Left Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">

            <span className="inline-block px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 text-sm font-semibold mb-5">
              Why Quizzy?
            </span>

            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-5">
              Learn.
              <span className="block text-indigo-600 dark:text-indigo-400">
                Play.
              </span>
              Grow.
            </h2>

            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg md:max-w-none">
              We're more than just a quiz maker—we're a community. Our modern
              design and robust features make learning and creating fun.
            </p>

          </div>


          {/* Right Content */}
          <div className="w-full md:w-1/2 grid grid-cols-1 gap-6">

            {/* Community */}
            <motion.div
              whileHover={{ x: 6 }}
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 transition-all duration-300"
            >
              <div className="bg-indigo-100 dark:bg-indigo-950/70 p-3 rounded-2xl flex-shrink-0">
                <Users size={30} className="text-indigo-600 dark:text-indigo-400" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-1">
                  Community Driven
                </h3>

                <p className="text-gray-500 dark:text-gray-400">
                  Join a network of learners and creators who share your
                  passion for knowledge and fun.
                </p>
              </div>
            </motion.div>


            {/* Modern Design */}
            <motion.div
              whileHover={{ x: 6 }}
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-green-50/60 dark:hover:bg-green-950/40 transition-all duration-300"
            >
              <div className="bg-green-100 dark:bg-green-950/70 p-3 rounded-2xl flex-shrink-0">
                <Sun size={30} className="text-green-600 dark:text-green-400" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-1">
                  Modern & Clean Design
                </h3>

                <p className="text-gray-500 dark:text-gray-400">
                  Enjoy a beautiful and distraction-free interface that makes
                  creating and taking quizzes a pleasure.
                </p>
              </div>
            </motion.div>


            {/* Reliable */}
            <motion.div
              whileHover={{ x: 6 }}
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-yellow-50/60 dark:hover:bg-yellow-950/40 transition-all duration-300"
            >
              <div className="bg-yellow-100 dark:bg-yellow-950/70 p-3 rounded-2xl flex-shrink-0">
                <CheckCircle size={30} className="text-yellow-600 dark:text-yellow-400" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-1">
                  Reliable & Free
                </h3>

                <p className="text-gray-500 dark:text-gray-400">
                  Our platform is robust, fast, and completely free to use,
                  with no hidden costs.
                </p>
              </div>
            </motion.div>


            {/* Compete */}
            <motion.div
              whileHover={{ x: 6 }}
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50/60 dark:hover:bg-red-950/40 transition-all duration-300"
            >
              <div className="bg-red-100 dark:bg-red-950/70 p-3 rounded-2xl flex-shrink-0">
                <Trophy size={30} className="text-red-600 dark:text-red-400" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-1">
                  Compete & Learn
                </h3>

                <p className="text-gray-500 dark:text-gray-400">
                  Challenge your friends and track your progress to see who is
                  the ultimate quiz master.
                </p>
              </div>
            </motion.div>

          </div>

        </motion.div>


        {/* ================= FINAL CTA ================= */}
        <motion.div
          className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-10 md:p-14 rounded-[2rem] text-center shadow-xl mt-24"
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.6,
          }}
          viewport={{
            once: true,
          }}
        >

          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />

          <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-purple-300/10 rounded-full blur-2xl" />

          <div className="relative z-10">

            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 border border-white/20 mb-5">
              <Trophy size={28} />
            </div>

            <h3 className="text-3xl md:text-4xl font-extrabold mb-4">
              Ready to get started?
            </h3>

            <p className="text-lg md:text-xl text-white/80 font-light mb-8 max-w-2xl mx-auto">
              It only takes a few minutes to create your first quiz.
            </p>

            <motion.a
              href="/create"
              whileHover={{
                scale: 1.05,
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="inline-flex items-center justify-center px-10 py-4 bg-white text-indigo-700 font-bold rounded-2xl shadow-lg transition-all duration-300"
            >
              Create Your Quiz
            </motion.a>

          </div>

        </motion.div>

      </main>
    </div>
  );
}