/**
 * Curso de XAMPP — estrutura de módulos e progresso.
 */

export interface Lesson {
  id: string;
  path: string;
  title: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export const COURSE_MODULES: Module[] = [
  {
    id: "comece-aqui",
    title: "Comece Aqui",
    description: "Introdução e primeiros passos",
    lessons: [
      { id: "inicio", path: "/", title: "Início" },
      { id: "o-que-e", path: "/o-que-e-xampp", title: "O que é XAMPP" },
      { id: "comparacao", path: "/comparacao", title: "XAMPP vs Alternativas" },
    ],
  },
  {
    id: "instalacao",
    title: "Instalação",
    description: "Instalar em Windows, Linux e macOS",
    lessons: [
      { id: "instalacao-windows", path: "/instalacao-windows", title: "Windows" },
      { id: "instalacao-linux", path: "/instalacao-linux", title: "Linux" },
      { id: "instalacao-macos", path: "/instalacao-macos", title: "macOS" },
      { id: "estrutura-pastas", path: "/estrutura-pastas", title: "Pastas e htdocs" },
    ],
  },
  {
    id: "painel-servicos",
    title: "Painel & Serviços",
    description: "Controlar serviços e resolver conflitos",
    lessons: [
      { id: "painel-controle", path: "/painel-controle", title: "Painel de Controle" },
      { id: "portas-conflitos", path: "/portas-conflitos", title: "Conflitos de Portas" },
    ],
  },
  {
    id: "apache-basico",
    title: "Apache — Básico",
    description: "Configuração inicial do Apache",
    lessons: [
      { id: "apache-config", path: "/apache-config", title: "httpd.conf" },
      { id: "virtual-hosts", path: "/virtual-hosts", title: "Virtual Hosts" },
      { id: "htaccess", path: "/htaccess", title: ".htaccess" },
      { id: "ssl-local", path: "/ssl-local", title: "HTTPS Local (SSL)" },
      { id: "apache-modulos", path: "/apache-modulos", title: "Módulos do Apache" },
    ],
  },
  {
    id: "apache-avancado",
    title: "Apache — Avançado",
    description: "Routes, proxy, logs e performance",
    lessons: [
      { id: "apache-rewrite", path: "/apache-rewrite", title: "mod_rewrite Avançado" },
      { id: "apache-logs", path: "/apache-logs", title: "Logs e LogFormat" },
      { id: "apache-auth", path: "/apache-auth", title: "Autenticação Básica" },
      { id: "apache-mpms", path: "/apache-mpms", title: "MPMs (prefork/worker)" },
      { id: "apache-reverse-proxy", path: "/apache-reverse-proxy", title: "Reverse Proxy" },
      { id: "apache-headers", path: "/apache-headers", title: "mod_headers" },
      { id: "apache-status", path: "/apache-status", title: "mod_status" },
      { id: "apache-benchmark", path: "/apache-benchmark", title: "ApacheBench (ab)" },
    ],
  },
  {
    id: "php-basico",
    title: "PHP — Básico",
    description: "Configurar PHP e extensões",
    lessons: [
      { id: "php-ini", path: "/php-ini", title: "php.ini" },
      { id: "php-extensoes", path: "/php-extensoes", title: "Extensões PHP" },
      { id: "php-versoes", path: "/php-versoes", title: "Trocar Versão do PHP" },
      { id: "composer", path: "/composer", title: "Composer" },
      { id: "xdebug", path: "/xdebug", title: "Xdebug" },
    ],
  },
  {
    id: "php-avancado",
    title: "PHP — Avançado",
    description: "CLI, FPM, testes e debugging",
    lessons: [
      { id: "php-cli", path: "/php-cli", title: "PHP via Linha de Comando" },
      { id: "php-fpm", path: "/php-fpm", title: "PHP-FPM" },
      { id: "php-unit", path: "/php-unit", title: "PHPUnit (Testes)" },
      { id: "php-debug-log", path: "/php-debug-log", title: "Logs e error_log" },
    ],
  },
  {
    id: "mysql-mariadb",
    title: "MySQL / MariaDB",
    description: "Banco de dados essencial",
    lessons: [
      { id: "mysql-config", path: "/mysql-config", title: "my.ini" },
      { id: "phpmyadmin", path: "/phpmyadmin", title: "phpMyAdmin" },
      { id: "mysql-senha-root", path: "/mysql-senha-root", title: "Senha do Root" },
      { id: "mysql-backup", path: "/mysql-backup", title: "Backup & Restore" },
      { id: "mariadb-usuarios", path: "/mariadb-usuarios", title: "Usuários e GRANT" },
      { id: "mariadb-queries", path: "/mariadb-queries", title: "Queries Essenciais" },
      { id: "mariadb-procedures", path: "/mariadb-procedures", title: "Procedures & Triggers" },
      { id: "mariadb-performance", path: "/mariadb-performance", title: "Performance & EXPLAIN" },
      { id: "mariadb-replicacao", path: "/mariadb-replicacao", title: "Replicação Master/Slave" },
    ],
  },
  {
    id: "perl-outros",
    title: "Perl & Outros",
    description: "Perl, Tomcat e serviços extras",
    lessons: [
      { id: "perl-cgi", path: "/perl-cgi", title: "Perl CGI" },
      { id: "perl-modulos", path: "/perl-modulos", title: "Módulos Perl (CPAN)" },
      { id: "tomcat", path: "/tomcat", title: "Tomcat (Java)" },
      { id: "filezilla", path: "/filezilla", title: "FileZilla FTP" },
      { id: "webalizer", path: "/webalizer", title: "Webalizer" },
      { id: "mercury", path: "/mercury", title: "Mercury Mail" },
    ],
  },
  {
    id: "frameworks",
    title: "Frameworks",
    description: "WordPress, Laravel e mais",
    lessons: [
      { id: "wordpress", path: "/wordpress", title: "WordPress" },
      { id: "laravel", path: "/laravel", title: "Laravel" },
    ],
  },
  {
    id: "automacao",
    title: "Automação",
    description: "Cron, multi-site e scripts",
    lessons: [
      { id: "cron-xampp", path: "/cron-xampp", title: "Cron Jobs no XAMPP" },
      { id: "multi-site", path: "/multi-site", title: "Múltiplos Sites Locais" },
    ],
  },
  {
    id: "producao",
    title: "Produção & Segurança",
    description: "Deploy, segurança e backup",
    lessons: [
      { id: "mod-security", path: "/mod-security", title: "ModSecurity" },
      { id: "migrar-producao", path: "/migrar-producao", title: "Migrar para Produção" },
      { id: "seguranca", path: "/seguranca", title: "Segurança" },
      { id: "erros-comuns", path: "/erros-comuns", title: "Erros Comuns" },
      { id: "backup-completo", path: "/backup-completo", title: "Backup Completo" },
    ],
  },
];

const STORAGE_KEY = "xampp-curso-progresso";

export function getProgress(): Set<string> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch {
    return new Set();
  }
}

export function saveProgress(completed: Set<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
}

export function markLessonComplete(lessonId: string): void {
  const completed = getProgress();
  completed.add(lessonId);
  saveProgress(completed);
}

export function isLessonCompleted(lessonId: string): boolean {
  return getProgress().has(lessonId);
}

export function getCourseProgress(): {
  completed: number;
  total: number;
  percentage: number;
} {
  const completed = getProgress();
  const allLessons = COURSE_MODULES.flatMap((m) => m.lessons);
  const total = allLessons.length;
  const done = allLessons.filter((l) => completed.has(l.id)).length;
  return {
    completed: done,
    total,
    percentage: total > 0 ? Math.round((done / total) * 100) : 0,
  };
}

export function getNextLesson(currentPath: string): Lesson | null {
  const allLessons = COURSE_MODULES.flatMap((m) => m.lessons);
  const idx = allLessons.findIndex((l) => l.path === currentPath);
  return idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null;
}

export function getPrevLesson(currentPath: string): Lesson | null {
  const allLessons = COURSE_MODULES.flatMap((m) => m.lessons);
  const idx = allLessons.findIndex((l) => l.path === currentPath);
  return idx > 0 ? allLessons[idx - 1] : null;
}

export function getLessonByPath(path: string): Lesson | undefined {
  return COURSE_MODULES.flatMap((m) => m.lessons).find((l) => l.path === path);
}
