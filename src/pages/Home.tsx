import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import {
  Server, BookOpen, Rocket, ArrowRight, CheckCircle2, Circle, Sparkles,
  Database, Globe, Terminal, Shield, Settings, Play
} from "lucide-react";
import { COURSE_MODULES, getCourseProgress } from "@/lib/course";

// Terminal XAMPP animado
function LiveTerminal() {
  const steps = [
    { cmd: "root@xampp:~# /opt/lampp/lampp start", out: "Starting XAMPP for Linux 8.2.12...\nXAMPP: Starting Apache...ok.\nXAMPP: Starting MySQL...ok.", delay: 1200 },
    { cmd: "root@xampp:~# mysql -u root -p", out: "Enter password: ***\nWelcome to MariaDB monitor.\nType 'help;' for help.", delay: 1000 },
    { cmd: "MariaDB [(none)]> CREATE DATABASE localhost;", out: "Query OK, 1 row affected (0.01 sec)", delay: 800 },
    { cmd: "root@xampp:~# tail -f /opt/lampp/logs/error_log", out: "[Sat Jul 11] [core:notice] Apache/2.4.54 configured\n[Sat Jul 11] [mpm_prefork:notice] AH00163: Apache started", delay: 1100 },
  ];

  const [step, setStep] = useState(0);
  const [showOut, setShowOut] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    if (step >= steps.length) {
      const timer = setTimeout(() => { setStep(0); setShowOut(false); }, 3000);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setShowOut(true), steps[step].delay);
    const nextTimer = setTimeout(() => { setStep((s) => s + 1); setShowOut(false); }, steps[step].delay + 1800);
    return () => { clearTimeout(timer); clearTimeout(nextTimer); };
  }, [step, isInView]);

  const currentCmd = steps[Math.min(step, steps.length - 1)];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="rounded-lg overflow-hidden border border-orange-500/30 shadow-2xl shadow-black/40 text-left"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1407] border-b border-orange-500/20">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="ml-2 text-xs font-mono text-gray-400">XAMPP Terminal</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400" title="Apache" />
          <div className="w-2 h-2 rounded-full bg-blue-400" title="MySQL" />
        </div>
      </div>
      {/* Terminal body */}
      <div className="bg-[#0f0a03] p-5 font-mono text-sm min-h-[180px] text-white">
        {steps.slice(0, step).map((s, i) => (
          <div key={i} className="mb-3">
            <div className="text-orange-400">{s.cmd}</div>
            {s.out && <div className="text-green-400 whitespace-pre-line mt-1 pl-2">{s.out}</div>}
          </div>
        ))}
        {step < steps.length && (
          <div>
            <span className="text-orange-400">{currentCmd.cmd}</span>
            <span className="inline-block w-2 h-4 ml-1 bg-orange-400 animate-pulse" />
            {showOut && currentCmd.out && (
              <div className="text-green-400 whitespace-pre-line mt-1 pl-2">{currentCmd.out}</div>
            )}
          </div>
        )}
        {step >= steps.length && (
          <div className="text-[#fb923c]">✓ Servidor rodando — reiniciando demo...</div>
        )}
      </div>
    </motion.div>
  );
}

// Card de módulo
function ModuleCard({ module, index, completedLessons }: { module: typeof COURSE_MODULES[0]; index: number; completedLessons: Set<string> }) {
  const total = module.lessons.length;
  const done = module.lessons.filter((l) => completedLessons.has(l.id)).length;
  const percentage = total > 0 ? (done / total) * 100 : 0;

  const icons: Record<string, React.ReactNode> = {
    "comece-aqui": <BookOpen className="w-5 h-5" />,
    "instalacao": <Server className="w-5 h-5" />,
    "painel-servicos": <Settings className="w-5 h-5" />,
    "apache-basico": <Globe className="w-5 h-5" />,
    "apache-avancado": <Terminal className="w-5 h-5" />,
    "php-basico": <Server className="w-5 h-5" />,
    "php-avancado": <Terminal className="w-5 h-5" />,
    "mysql-mariadb": <Database className="w-5 h-5" />,
    "perl-outros": <Server className="w-5 h-5" />,
    "frameworks": <Rocket className="w-5 h-5" />,
    "automacao": <Settings className="w-5 h-5" />,
    "producao": <Shield className="w-5 h-5" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="group relative p-5 bg-[#1a1407]/60 border border-orange-500/20 rounded-lg hover:border-orange-500/50 transition-all overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent pointer-events-none" style={{ width: `${percentage}%` }} />

      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="w-10 h-10 rounded-lg bg-[#fb923c]/20 border border-orange-500/30 flex items-center justify-center text-[#fb923c]">
          {icons[module.id] || <BookOpen className="w-5 h-5" />}
        </div>
        <span className="text-xs font-mono text-gray-400 tabular-nums">
          {done}/{total}
        </span>
      </div>

      <h3 className="font-bold text-white mb-1 relative z-10">{module.title}</h3>
      <p className="text-sm text-gray-400 mb-3 relative z-10">{module.description}</p>

      <div className="h-1.5 bg-[#0f0a03] rounded-full overflow-hidden mb-4 relative z-10">
        <motion.div
          className="h-full bg-[#fb923c]"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </div>

      <ul className="space-y-1 relative z-10">
        {module.lessons.slice(0, 3).map((lesson) => (
          <li key={lesson.id}>
            <Link
              href={lesson.path}
              className="flex items-center gap-2 text-sm text-gray-300/70 hover:text-orange-400 transition-colors py-0.5"
            >
              {completedLessons.has(lesson.id) ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
              ) : (
                <Circle className="w-3.5 h-3.5 opacity-30" />
              )}
              <span className="truncate">{lesson.title}</span>
            </Link>
          </li>
        ))}
        {module.lessons.length > 3 && (
          <li className="text-xs text-gray-500">+{module.lessons.length - 3} mais</li>
        )}
      </ul>
    </motion.div>
  );
}

export default function Home() {
  const progress = getCourseProgress();
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem("xampp-curso-progresso");
    if (saved) setCompletedLessons(new Set(JSON.parse(saved)));
  }, []);

  const STATS = [
    { value: "56", label: "Capítulos" },
    { value: "Apache+MySQL+PHP+Perl", label: "Stack" },
    { value: "Cross-platform", label: "Funciona em" },
    { value: "100%", label: "Português BR" },
  ];

  return (
    <div className="min-h-screen relative bg-[#0f0a03]">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4">
        <motion.div
          className="absolute inset-0 opacity-60"
          animate={{
            background: [
              "radial-gradient(800px 400px at 20% 10%, hsl(25 95% 53% / 0.12), transparent 60%)",
              "radial-gradient(800px 400px at 80% 20%, hsl(25 95% 45% / 0.10), transparent 60%)",
              "radial-gradient(800px 400px at 50% 0%, hsl(25 95% 50% / 0.15), transparent 60%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          style={{ background: "radial-gradient(800px 400px at 20% 10%, hsl(25 95% 53% / 0.15), transparent 60%)" }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 mb-7"
            >
              <Server className="w-4 h-4 text-orange-400" />
              <span className="font-medium text-orange-400 text-sm">Guia completo · 56 capítulos · 2026</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
              <span className="text-white">Domine o</span>{" "}
              <span className="text-orange-400">XAMPP</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Do <code className="text-orange-400 bg-black/30 px-2 py-0.5 rounded">htdocs</code> ao Apache, PHP, MySQL/MariaDB e deploy em produção — <strong>tudo em português</strong>.
            </p>

            {progress.completed > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 max-w-md mx-auto"
              >
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Seu progresso</span>
                  <span className="font-mono font-bold text-orange-400">{progress.percentage}%</span>
                </div>
                <div className="h-2 bg-[#0f0a03] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </motion.div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              <Link
                href="/instalacao-windows"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-orange-500 text-white font-bold no-underline hover:bg-orange-600 hover:scale-[1.02] transition-all shadow-lg shadow-orange-500/25"
              >
                <Rocket className="w-4 h-4" /> Começar agora
              </Link>
              <Link
                href="/o-que-e-xampp"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1a1407]/80 border border-orange-500/30 text-white font-semibold no-underline hover:bg-[#1a1407] transition-colors"
              >
                <BookOpen className="w-4 h-4" /> O que é XAMPP?
              </Link>
            </div>

            <LiveTerminal />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-14"
          >
            {STATS.map((s, i) => (
              <div key={i} className="p-4 rounded-lg bg-[#1a1407]/60 border border-orange-500/20 text-center">
                <div className="text-3xl font-extrabold text-orange-400">{s.value}</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-mono">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Módulos */}
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trilha de aprendizado
          </h2>
          <p className="text-gray-400 text-lg">
            Progresso salvo automaticamente. Marque cada capítulo como concluído.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {COURSE_MODULES.map((module, i) => (
            <ModuleCard key={module.id} module={module} index={i} completedLessons={completedLessons} />
          ))}
        </div>

        {/* CTA final */}
        <section className="mt-20 relative rounded-2xl overflow-hidden border border-orange-500/30 p-10 text-center bg-gradient-to-br from-orange-500/10 via-[#0f0a03] to-[#0f0a03]">
          <Database className="w-8 h-8 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Pronto para dominar o desenvolvimento local?
          </h2>
          <p className="text-gray-400 mb-6">
            Apache, PHP, MySQL/MariaDB — tudo funcionando junto.
          </p>
          <Link
            href="/instalacao-windows"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-orange-500 text-white font-bold no-underline hover:bg-orange-600 hover:scale-[1.02] transition-all shadow-lg shadow-orange-500/25"
          >
            Começar curso
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
