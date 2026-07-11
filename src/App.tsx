import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { LessonNav } from "@/components/ui/LessonNav";
import Home from "@/pages/Home";

const NotFound = lazy(() => import("@/pages/not-found"));
const OQueEXampp = lazy(() => import("@/pages/OQueEXampp"));
const Comparacao = lazy(() => import("@/pages/Comparacao"));
const InstalacaoWindows = lazy(() => import("@/pages/InstalacaoWindows"));
const InstalacaoLinux = lazy(() => import("@/pages/InstalacaoLinux"));
const InstalacaoMacOS = lazy(() => import("@/pages/InstalacaoMacOS"));
const EstruturaPastas = lazy(() => import("@/pages/EstruturaPastas"));
const PainelControle = lazy(() => import("@/pages/PainelControle"));
const PortasConflitos = lazy(() => import("@/pages/PortasConflitos"));
const ApacheConfig = lazy(() => import("@/pages/ApacheConfig"));
const VirtualHosts = lazy(() => import("@/pages/VirtualHosts"));
const Htaccess = lazy(() => import("@/pages/Htaccess"));
const SSLLocal = lazy(() => import("@/pages/SSLLocal"));
const ApacheModulos = lazy(() => import("@/pages/ApacheModulos"));
const ApacheRewrite = lazy(() => import("@/pages/ApacheRewrite"));
const ApacheLogs = lazy(() => import("@/pages/ApacheLogs"));
const ApacheAuth = lazy(() => import("@/pages/ApacheAuth"));
const ApacheMpms = lazy(() => import("@/pages/ApacheMpms"));
const ApacheReverseProxy = lazy(() => import("@/pages/ApacheReverseProxy"));
const ApacheHeaders = lazy(() => import("@/pages/ApacheHeaders"));
const ApacheStatus = lazy(() => import("@/pages/ApacheStatus"));
const ApacheBenchmark = lazy(() => import("@/pages/ApacheBenchmark"));
const PhpIni = lazy(() => import("@/pages/PhpIni"));
const PhpExtensoes = lazy(() => import("@/pages/PhpExtensoes"));
const PhpVersoes = lazy(() => import("@/pages/PhpVersoes"));
const Composer = lazy(() => import("@/pages/Composer"));
const Xdebug = lazy(() => import("@/pages/Xdebug"));
const PhpCli = lazy(() => import("@/pages/PhpCli"));
const PhpFpm = lazy(() => import("@/pages/PhpFpm"));
const PhpUnit = lazy(() => import("@/pages/PhpUnit"));
const PhpDebugLog = lazy(() => import("@/pages/PhpDebugLog"));
const MysqlConfig = lazy(() => import("@/pages/MysqlConfig"));
const PhpMyAdmin = lazy(() => import("@/pages/PhpMyAdmin"));
const MysqlSenhaRoot = lazy(() => import("@/pages/MysqlSenhaRoot"));
const MysqlBackup = lazy(() => import("@/pages/MysqlBackup"));
const MariaDBUsuarios = lazy(() => import("@/pages/MariaDBUsuarios"));
const MariaDBReplicacao = lazy(() => import("@/pages/MariaDBReplicacao"));
const MariaDBPerformance = lazy(() => import("@/pages/MariaDBPerformance"));
const MariaDBProcedures = lazy(() => import("@/pages/MariaDBProcedures"));
const MariaDBQueries = lazy(() => import("@/pages/MariaDBQueries"));
const PerlCgi = lazy(() => import("@/pages/PerlCgi"));
const PerlModulos = lazy(() => import("@/pages/PerlModulos"));
const Tomcat = lazy(() => import("@/pages/Tomcat"));
const FileZilla = lazy(() => import("@/pages/FileZilla"));
const Webalizer = lazy(() => import("@/pages/Webalizer"));
const Mercury = lazy(() => import("@/pages/Mercury"));
const WordPress = lazy(() => import("@/pages/WordPress"));
const Laravel = lazy(() => import("@/pages/Laravel"));
const CronXampp = lazy(() => import("@/pages/CronXampp"));
const MultiSite = lazy(() => import("@/pages/MultiSite"));
const ModSecurity = lazy(() => import("@/pages/ModSecurity"));
const MigrarProducao = lazy(() => import("@/pages/MigrarProducao"));
const Seguranca = lazy(() => import("@/pages/Seguranca"));
const ErrosComuns = lazy(() => import("@/pages/ErrosComuns"));
const BackupCompleto = lazy(() => import("@/pages/BackupCompleto"));

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);
  return null;
}

function ChapterFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="font-mono text-sm text-muted-foreground flex items-center gap-3">
        <span className="inline-block w-2 h-4 bg-primary animate-pulse" />
        carregando capítulo…
      </div>
    </div>
  );
}

function AppRouter() {
  return (
    <Suspense fallback={<ChapterFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/o-que-e-xampp" component={OQueEXampp} />
        <Route path="/comparacao" component={Comparacao} />
        <Route path="/instalacao-windows" component={InstalacaoWindows} />
        <Route path="/instalacao-linux" component={InstalacaoLinux} />
        <Route path="/instalacao-macos" component={InstalacaoMacOS} />
        <Route path="/estrutura-pastas" component={EstruturaPastas} />
        <Route path="/painel-controle" component={PainelControle} />
        <Route path="/portas-conflitos" component={PortasConflitos} />
        <Route path="/apache-config" component={ApacheConfig} />
        <Route path="/virtual-hosts" component={VirtualHosts} />
        <Route path="/htaccess" component={Htaccess} />
        <Route path="/ssl-local" component={SSLLocal} />
        <Route path="/apache-modulos" component={ApacheModulos} />
        <Route path="/apache-rewrite" component={ApacheRewrite} />
        <Route path="/apache-logs" component={ApacheLogs} />
        <Route path="/apache-auth" component={ApacheAuth} />
        <Route path="/apache-mpms" component={ApacheMpms} />
        <Route path="/apache-reverse-proxy" component={ApacheReverseProxy} />
        <Route path="/apache-headers" component={ApacheHeaders} />
        <Route path="/apache-status" component={ApacheStatus} />
        <Route path="/apache-benchmark" component={ApacheBenchmark} />
        <Route path="/php-ini" component={PhpIni} />
        <Route path="/php-extensoes" component={PhpExtensoes} />
        <Route path="/php-versoes" component={PhpVersoes} />
        <Route path="/composer" component={Composer} />
        <Route path="/xdebug" component={Xdebug} />
        <Route path="/php-cli" component={PhpCli} />
        <Route path="/php-fpm" component={PhpFpm} />
        <Route path="/php-unit" component={PhpUnit} />
        <Route path="/php-debug-log" component={PhpDebugLog} />
        <Route path="/mysql-config" component={MysqlConfig} />
        <Route path="/phpmyadmin" component={PhpMyAdmin} />
        <Route path="/mysql-senha-root" component={MysqlSenhaRoot} />
        <Route path="/mysql-backup" component={MysqlBackup} />
        <Route path="/mariadb-usuarios" component={MariaDBUsuarios} />
        <Route path="/mariadb-replicacao" component={MariaDBReplicacao} />
        <Route path="/mariadb-performance" component={MariaDBPerformance} />
        <Route path="/mariadb-procedures" component={MariaDBProcedures} />
        <Route path="/mariadb-queries" component={MariaDBQueries} />
        <Route path="/perl-cgi" component={PerlCgi} />
        <Route path="/perl-modulos" component={PerlModulos} />
        <Route path="/tomcat" component={Tomcat} />
        <Route path="/filezilla" component={FileZilla} />
        <Route path="/webalizer" component={Webalizer} />
        <Route path="/mercury" component={Mercury} />
        <Route path="/wordpress" component={WordPress} />
        <Route path="/laravel" component={Laravel} />
        <Route path="/cron-xampp" component={CronXampp} />
        <Route path="/multi-site" component={MultiSite} />
        <Route path="/modsecurity" component={ModSecurity} />
        <Route path="/migrar-producao" component={MigrarProducao} />
        <Route path="/seguranca" component={Seguranca} />
        <Route path="/erros-comuns" component={ErrosComuns} />
        <Route path="/backup-completo" component={BackupCompleto} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router hook={useHashLocation}>
          <ScrollToTop />
          <div className="min-h-screen bg-[#0f0a03] text-white">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="lg:pl-72">
              <Header onMenuClick={() => setSidebarOpen(true)} />
              <main className="pb-16">
                <AppRouter />
              </main>
            </div>
            <LessonNav />
          </div>
        </Router>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
