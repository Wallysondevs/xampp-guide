import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getLessonByPath,
  getNextLesson,
  getPrevLesson,
  markLessonComplete,
  isLessonCompleted,
  getCourseProgress,
} from "@/lib/course";

interface LessonNavProps {
  onComplete?: () => void;
}

export function LessonNav({ onComplete }: LessonNavProps) {
  const [location] = useLocation();
  const [completed, setCompleted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0, percentage: 0 });

  useEffect(() => {
    const lesson = getLessonByPath(location);
    if (lesson) {
      setCompleted(isLessonCompleted(lesson.id));
      setProgress(getCourseProgress());
    }
  }, [location]);

  const handleComplete = () => {
    const lesson = getLessonByPath(location);
    if (!lesson) return;

    markLessonComplete(lesson.id);
    setCompleted(true);
    setProgress(getCourseProgress());
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    onComplete?.();
  };

  const nextLesson = getNextLesson(location);
  const prevLesson = getPrevLesson(location);
  const currentLesson = getLessonByPath(location);

  if (!currentLesson || location === "/") return null;

  return (
    <>
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#fb923c] text-white font-medium shadow-lg shadow-orange-500/25"
          >
            ✓ Capítulo marcado como concluído!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 lg:left-72 bg-[#1a1407]/95 backdrop-blur-xl border-t border-orange-500/20 z-40">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              {prevLesson && (
                <Link
                  href={prevLesson.path}
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="truncate hidden sm:inline">{prevLesson.title}</span>
                  <span className="truncate sm:hidden">Anterior</span>
                </Link>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                <span>{progress.completed}/{progress.total}</span>
                <div className="w-16 h-1.5 bg-[#0f0a03] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#fb923c] transition-all duration-500"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
                <span>{progress.percentage}%</span>
              </div>

              <Button
                size="sm"
                variant={completed ? "secondary" : "default"}
                onClick={handleComplete}
                className={completed ? "bg-[#fb923c]/20 text-orange-400 border-orange-500/40" : "bg-[#fb923c] text-white hover:bg-[#ea580c]"}
              >
                {completed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Concluído
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    Marcar concluído
                  </>
                )}
              </Button>
            </div>

            <div className="flex-1 text-right">
              {nextLesson ? (
                <Link
                  href={nextLesson.path}
                  className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <span className="truncate hidden sm:inline">{nextLesson.title}</span>
                  <span className="truncate sm:hidden">Próximo</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Início
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
