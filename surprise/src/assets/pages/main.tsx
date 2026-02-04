import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMonths: number;
  totalDays: number;
  totalHours: number;
}

interface Heart {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
}

const START_DATE = new Date("2020-06-12T00:00:00");

const AnniversaryTracker = () => {
  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMonths: 0,
    totalDays: 0,
    totalHours: 0,
  });
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [specialMessage, setSpecialMessage] = useState("");
  const [messageEmoji, setMessageEmoji] = useState("");

  const calculateTimeElapsed = useCallback(() => {
    const now = new Date();

    let years = now.getFullYear() - START_DATE.getFullYear();
    let months = now.getMonth() - START_DATE.getMonth();
    let days = now.getDate() - START_DATE.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Totals since START_DATE
    const diff = now.getTime() - START_DATE.getTime();
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    const totalMonths = years * 12 + months;

    return {
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      totalMonths,
      totalDays,
      totalHours,
    };
  }, []);

  const checkSpecialOccasion = useCallback(() => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const weekday = now.getDay();
    if (month === 2 && day === 14) {
      setMessageEmoji("💕");
      return "Happy Valentine's Day, Love!";
    }
    if (month === 8 && day === 30) {
      setMessageEmoji("🎂");
      return "Happy Birthday, Love!";
    }

    if (day === 12 && month === 6) {
      setMessageEmoji("🎉");
      return "Happy Anniversary!, Love!";
    }
    if (day === 12) {
      setMessageEmoji("🌹");
      return "Happy Monthsary!, Love!";
    }
    if (weekday === 3) {
      setMessageEmoji("❤️");
      return "Happy Weeksary!, Love!";
    }

    return "";
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(calculateTimeElapsed());
      setSpecialMessage(checkSpecialOccasion());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeElapsed, checkSpecialOccasion]);

  useEffect(() => {
    const interval = setInterval(() => {
      const heart: Heart = {
        id: Date.now(),
        left: Math.random() * 100,
        delay: 0,
        duration: 5,
        size: 16 + Math.random() * 16,
      };
      setHearts((h) => [...h, heart]);
      setTimeout(() => {
        setHearts((h) => h.filter((x) => x.id !== heart.id));
      }, 6000);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const sparkle: Sparkle = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100,
      };
      setSparkles((s) => [...s, sparkle]);
      setTimeout(() => {
        setSparkles((s) => s.filter((x) => x.id !== sparkle.id));
      }, 2000);
    }, 1600);

    return () => clearInterval(interval);
  }, []);

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 16 },
    },
  };

  const timeUnits = [
    { value: timeElapsed.years, label: "Years" },
    { value: timeElapsed.months, label: "Months" },
    { value: timeElapsed.days, label: "Days" },
    { value: timeElapsed.hours, label: "Hours" },
    { value: timeElapsed.minutes, label: "Minutes" },
    { value: timeElapsed.seconds, label: "Seconds" },

    // Totals
    { value: timeElapsed.totalMonths, label: "Total Months" },
    { value: timeElapsed.totalDays, label: "Total Days" },
    { value: timeElapsed.totalHours, label: "Total Hours" },
  ];

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-pink-200 via-purple-200 to-rose-200 overflow-hidden">
      {/* Floating Hearts */}
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            className="absolute bottom-0"
            style={{ left: `${h.left}%`, fontSize: h.size }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: "-110vh", opacity: [0, 1, 1, 0] }}
            transition={{ duration: h.duration }}
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Sparkles */}
      <AnimatePresence>
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            className="absolute text-xl"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2 }}
          >
            ✨
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 space-y-8">
        {/* Title */}
        <h1 className="text-center font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-xl">
          Our Love Story
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-white/90">
          Since June 12, 2020
        </p>

        {/* Special Message */}
        {specialMessage && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white font-semibold text-center text-sm sm:text-base md:text-lg"
          >
            {messageEmoji} {specialMessage} {messageEmoji}
          </motion.div>
        )}

        {/* Counter Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-md sm:max-w-xl md:max-w-3xl w-full"
          initial="hidden"
          animate="visible"
        >
          {timeUnits.map((unit) => (
            <motion.div
              key={unit.label}
              variants={cardVariants}
              className="bg-white/90 rounded-2xl p-4 sm:p-5 text-center shadow-lg"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-pink-600">
                {unit.value}
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-700 font-semibold">
                {unit.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Love Message */}
        <motion.div
          className="bg-white/90 max-w-md sm:max-w-xl md:max-w-2xl rounded-3xl p-6 sm:p-8 text-center shadow-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-base sm:text-lg md:text-xl text-gray-800">
            Every moment with you is a blessing.
          </p>
          <p className="mt-4 text-lg sm:text-xl md:text-2xl font-bold text-pink-600">
            I love you more with each passing second 💖
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AnniversaryTracker;
