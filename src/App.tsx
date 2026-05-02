import { useEffect, useState } from "react";
import { Switch, Route, Router, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import OQueEXampp from "@/pages/OQueEXampp";
import Comparacao from "@/pages/Comparacao";
import InstalacaoWindows from "@/pages/InstalacaoWindows";
import InstalacaoLinux from "@/pages/InstalacaoLinux";
import InstalacaoMacOS from "@/pages/InstalacaoMacOS";
import EstruturaPastas from "@/pages/EstruturaPastas";
import PainelControle from "@/pages/PainelControle";
import PortasConflitos from "@/pages/PortasConflitos";
import ApacheConfig from "@/pages/ApacheConfig";
import VirtualHosts from "@/pages/VirtualHosts";
import Htaccess from "@/pages/Htaccess";
import SSLLocal from "@/pages/SSLLocal";
import ApacheModulos from "@/pages/ApacheModulos";
import PhpIni from "@/pages/PhpIni";
import PhpExtensoes from "@/pages/PhpExtensoes";
import PhpVersoes from "@/pages/PhpVersoes";
import Composer from "@/pages/Composer";
import Xdebug from "@/pages/Xdebug";
import MysqlConfig from "@/pages/MysqlConfig";
import PhpMyAdmin from "@/pages/PhpMyAdmin";
import MysqlSenhaRoot from "@/pages/MysqlSenhaRoot";
import MysqlBackup from "@/pages/MysqlBackup";
import Mercury from "@/pages/Mercury";
import WordPress from "@/pages/WordPress";
import Laravel from "@/pages/Laravel";
import MigrarProducao from "@/pages/MigrarProducao";
import Seguranca from "@/pages/Seguranca";
import ErrosComuns from "@/pages/ErrosComuns";
import BackupCompleto from "@/pages/BackupCompleto";

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);
  return null;
}

function AppRouter() {
  return (
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
