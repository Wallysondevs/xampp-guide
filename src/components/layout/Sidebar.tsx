import { Link } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { cn } from "@/lib/utils";
import {
  BookOpen, Server, X, Package, FolderOpen, Database,
  Globe, ChevronRight, Settings, Layers, HardDrive,
  Zap, AlertTriangle, FileCode, Lock, Mail, ShieldAlert,
  GitCompare, Terminal, Key, Bug, Save, Rocket,
  PanelTop, FileText, Wrench, Award, Activity, Gauge,
  Replace, Users, BarChart3, Clock, Network, Shield,
  TestTube, ScrollText, Upload, Coffee,
} from "lucide-react";

const NAVIGATION = [
  {
    title: "🚀 Comece Aqui",
    items: [
      { path: "/", label: "Início", icon: BookOpen },
      { path: "/o-que-e-xampp", label: "O que é XAMPP", icon: Server },
      { path: "/comparacao", label: "XAMPP vs WAMP/MAMP/Laragon", icon: GitCompare },
    ],
  },
  {
    title: "Instalação",
    items: [
      { path: "/instalacao-windows", label: "Windows", icon: HardDrive },
      { path: "/instalacao-linux", label: "Linux", icon: HardDrive },
      { path: "/instalacao-macos", label: "macOS", icon: HardDrive },
      { path: "/estrutura-pastas", label: "Pastas e htdocs", icon: FolderOpen },
    ],
  },
  {
    title: "Painel & Serviços",
    items: [
      { path: "/painel-controle", label: "Painel de Controle", icon: PanelTop },
      { path: "/portas-conflitos", label: "Conflitos de portas", icon: AlertTriangle },
    ],
  },
  {
    title: "Apache — Básico",
    items: [
      { path: "/apache-config", label: "httpd.conf", icon: Settings },
      { path: "/virtual-hosts", label: "Virtual Hosts", icon: Globe },
      { path: "/htaccess", label: ".htaccess", icon: FileCode },
      { path: "/ssl-local", label: "HTTPS local (SSL)", icon: Lock },
      { path: "/apache-modulos", label: "Módulos do Apache", icon: Layers },
    ],
  },
  {
    title: "Apache — Avançado",
    items: [
      { path: "/apache-rewrite", label: "mod_rewrite avançado", icon: Replace },
      { path: "/apache-logs", label: "Logs e LogFormat", icon: ScrollText },
      { path: "/apache-auth", label: "Autenticação básica", icon: Key },
      { path: "/apache-mpms", label: "MPMs (prefork/worker)", icon: Layers },
      { path: "/apache-reverse-proxy", label: "Reverse proxy", icon: Network },
      { path: "/apache-headers", label: "mod_headers", icon: FileText },
      { path: "/apache-status", label: "mod_status", icon: Activity },
      { path: "/apache-benchmark", label: "ApacheBench (ab)", icon: Gauge },
    ],
  },
  {
    title: "PHP — Básico",
    items: [
      { path: "/php-ini", label: "php.ini", icon: Settings },
      { path: "/php-extensoes", label: "Extensões", icon: Package },
      { path: "/php-versoes", label: "Trocar versão", icon: Zap },
      { path: "/composer", label: "Composer", icon: Package },
      { path: "/xdebug", label: "Xdebug", icon: Bug },
    ],
  },
  {
    title: "PHP — Avançado",
    items: [
      { path: "/php-cli", label: "PHP via linha de comando", icon: Terminal },
      { path: "/php-fpm", label: "PHP-FPM", icon: Server },
      { path: "/php-unit", label: "PHPUnit (testes)", icon: TestTube },
      { path: "/php-debug-log", label: "Logs e error_log", icon: ScrollText },
    ],
  },
  {
    title: "MySQL / MariaDB",
    items: [
      { path: "/mysql-config", label: "my.ini", icon: Settings },
      { path: "/phpmyadmin", label: "phpMyAdmin", icon: Database },
      { path: "/mysql-senha-root", label: "Senha do root", icon: Key },
      { path: "/mysql-backup", label: "Backup & Restore", icon: Save },
      { path: "/mariadb-usuarios", label: "Usuários e GRANT", icon: Users },
      { path: "/mariadb-queries", label: "Queries essenciais", icon: Database },
      { path: "/mariadb-procedures", label: "Procedures & Triggers", icon: FileCode },
      { path: "/mariadb-performance", label: "Performance & EXPLAIN", icon: Gauge },
      { path: "/mariadb-replicacao", label: "Replicação master/slave", icon: BarChart3 },
    ],
  },
  {
    title: "Perl & Outros Serviços",
    items: [
      { path: "/perl-cgi", label: "Perl CGI", icon: Terminal },
      { path: "/perl-modulos", label: "Módulos Perl (CPAN)", icon: Package },
      { path: "/tomcat", label: "Tomcat (Java)", icon: Coffee },
      { path: "/filezilla", label: "FileZilla FTP", icon: Upload },
      { path: "/webalizer", label: "Webalizer", icon: BarChart3 },
    ],
  },
  {
    title: "Email & Aplicações",
    items: [
      { path: "/mercury", label: "Mercury Mail", icon: Mail },
      { path: "/wordpress", label: "WordPress", icon: Globe },
      { path: "/laravel", label: "Laravel", icon: Terminal },
    ],
  },
  {
    title: "Workflow & Operação",
    items: [
      { path: "/cron-xampp", label: "Cron / Tarefas agendadas", icon: Clock },
      { path: "/multi-site", label: "Múltiplos sites locais", icon: Layers },
      { path: "/modsecurity", label: "ModSecurity (WAF)", icon: Shield },
    ],
  },
  {
    title: "Produção & Manutenção",
    items: [
      { path: "/migrar-producao", label: "Migrar para produção", icon: Rocket },
      { path: "/seguranca", label: "Segurança", icon: ShieldAlert },
      { path: "/erros-comuns", label: "Erros comuns", icon: Wrench },
      { path: "/backup-completo", label: "Backup completo", icon: Save },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useHashLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-72 bg-card border-r border-border z-50 overflow-y-auto transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-extrabold text-lg leading-none">
              X
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight">XAMPP</h1>
              <p className="text-xs text-muted-foreground">Guia Completo PT-BR</p>
            </div>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-accent"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="p-3 space-y-4">
          {NAVIGATION.map((section) => (
            <div key={section.title}>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1">
                {section.title}
              </h2>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location === item.path;
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1 leading-tight">{item.label}</span>
                        {isActive && <ChevronRight className="w-3 h-3" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border mt-4">
          <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
            <Award className="w-3 h-3" /> 55 tópicos
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            Apache · MariaDB · PHP · Perl
          </p>
        </div>
      </aside>
    </>
  );
}
