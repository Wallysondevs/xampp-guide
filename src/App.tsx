import { lazy, Suspense, useEffect, useState } from "react";
import { Switch, Route, Router, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
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
const PhpIni = lazy(() => import("@/pages/PhpIni"));
const PhpExtensoes = lazy(() => import("@/pages/PhpExtensoes"));
const PhpVersoes = lazy(() => import("@/pages/PhpVersoes"));
const Composer = lazy(() => import("@/pages/Composer"));
const Xdebug = lazy(() => import("@/pages/Xdebug"));
const MysqlConfig = lazy(() => import("@/pages/MysqlConfig"));
const PhpMyAdmin = lazy(() => import("@/pages/PhpMyAdmin"));
const MysqlSenhaRoot = lazy(() => import("@/pages/MysqlSenhaRoot"));
const MysqlBackup = lazy(() => import("@/pages/MysqlBackup"));
const Mercury = lazy(() => import("@/pages/Mercury"));
const WordPress = lazy(() => import("@/pages/WordPress"));
const Laravel = lazy(() => import("@/pages/Laravel"));
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
        <Route path="/php-ini" component={PhpIni} />
        <Route path="/php-extensoes" component={PhpExtensoes} />
        <Route path="/php-versoes" component={PhpVersoes} />
        <Route path="/composer" component={Composer} />
        <Route path="/xdebug" component={Xdebug} />
        <Route path="/mysql-config" component={MysqlConfig} />
        <Route path="/phpmyadmin" component={PhpMyAdmin} />
        <Route path="/mysql-senha-root" component={MysqlSenhaRoot} />
        <Route path="/mysql-backup" component={MysqlBackup} />
        <Route path="/mercury" component={Mercury} />
        <Route path="/wordpress" component={WordPress} />
        <Route path="/laravel" component={Laravel} />
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
          <div className="min-h-screen bg-background text-foreground">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="lg:pl-72">
              <Header onMenuClick={() => setSidebarOpen(true)} />
              <main>
                <AppRouter />
              </main>
            </div>
          </div>
        </Router>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
