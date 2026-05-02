import { Link } from "wouter";
import {
  Server,
  HardDrive,
  Database,
  Globe,
  ChevronRight,
  Rocket,
  ShieldAlert,
  Settings,
  PanelTop,
  Package,
  Mail,
  Wrench,
} from "lucide-react";

const sections = [
  {
    icon: Server,
    title: "O que é o XAMPP",
    desc: "Entenda o que é Apache + MariaDB + PHP + Perl em um único pacote.",
    href: "/o-que-e-xampp",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: HardDrive,
    title: "Instalação rápida",
    desc: "Windows, Linux ou macOS — passo a passo, sem deixar nada para trás.",
    href: "/instalacao-windows",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: PanelTop,
    title: "Painel & Portas",
    desc: "Controle Apache e MySQL. Resolva o famoso conflito da porta 80 com Skype/IIS.",
    href: "/painel-controle",
    color: "bg-yellow-500/10 text-yellow-500",
  },
  {
    icon: Settings,
    title: "Configurando Apache",
    desc: "Virtual Hosts, .htaccess, mod_rewrite e HTTPS local com certificado próprio.",
    href: "/apache-config",
    color: "bg-cyan-500/10 text-cyan-500",
  },
  {
    icon: Package,
    title: "Dominando o PHP",
    desc: "php.ini, extensões, Xdebug, Composer e como trocar a versão do PHP.",
    href: "/php-ini",
    color: "bg-violet-500/10 text-violet-500",
  },
  {
    icon: Database,
    title: "MySQL & phpMyAdmin",
    desc: "Defina senha do root, crie bancos, importe e exporte dumps SQL.",
    href: "/phpmyadmin",
    color: "bg-green-500/10 text-green-500",
  },
  {
    icon: Globe,
    title: "Hospedando aplicações",
    desc: "WordPress e Laravel rodando bonitinho em http://localhost.",
    href: "/wordpress",
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    icon: Rocket,
    title: "Indo para produção",
    desc: "Migre seu projeto local para um servidor de verdade — com checklist.",
    href: "/migrar-producao",
    color: "bg-red-500/10 text-red-500",
  },
];

const stats = [
  { value: "30+", label: "Tópicos" },
  { value: "100+", label: "Códigos prontos" },
  { value: "PT-BR", label: "Em Português" },
  { value: "Grátis", label: "Open Source" },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pb-24">
      {/* Aviso amigável — XAMPP não é hostil, mas é importante avisar do uso em produção */}
      <div className="mb-10 rounded-2xl border-2 border-yellow-500/40 bg-gradient-to-br from-yellow-500/15 to-orange-500/5 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 bg-yellow-500/20 border-b border-yellow-500/30">
          <ShieldAlert className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-300">
            Antes de começar — leitura rápida
          </span>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-sm text-foreground/90 leading-relaxed m-0">
            O XAMPP é um <strong>ambiente de desenvolvimento local</strong>. Ele
            vem com configurações abertas (senha de root vazia, phpMyAdmin
            acessível, etc.) para que você comece em segundos. <strong className="text-yellow-600 dark:text-yellow-300">
            Nunca o utilize como servidor de produção
            </strong>{" "}
            exposto à internet — esse não é o propósito da ferramenta.
          </p>
          <p className="text-sm text-foreground/90 leading-relaxed m-0">
            Use o XAMPP para aprender, prototipar, testar plugins do WordPress,
            rodar projetos Laravel/CodeIgniter, dar aulas, fazer trabalhos da
            faculdade. Quando o projeto for pro ar, use uma VPS de verdade
            (Hostinger, DigitalOcean, AWS, etc.). Temos um capítulo inteiro
            sobre isso.
          </p>
          <Link
            href="/seguranca"
            className="inline-flex items-center gap-2 px-4 py-2 mt-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-700 dark:text-yellow-300 border border-yellow-500/40 rounded-lg text-sm font-semibold transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            Ler o capítulo de Segurança
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="text-center mb-16 mt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
          <Server className="w-4 h-4" />
          Guia Completo em Português Brasileiro
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
          XAMPP <span className="text-primary">do Zero ao Avançado</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Apache, MariaDB, PHP e Perl em um único pacote. Instale, configure e
          hospede projetos PHP no seu computador em poucos minutos —{" "}
          <strong className="text-foreground">com exemplos práticos</strong>{" "}
          em ordem cronológica.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 max-w-2xl mx-auto">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-4 text-center"
            >
              <div className="text-3xl font-extrabold text-primary">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Sua trilha de aprendizado
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sections.map((s, i) => {
            const Icon = s.icon;
            return (
              <Link href={s.href} key={i}>
                <div className="group bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                  <div
                    className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1 text-sm mt-0 border-0">
                    {s.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>
                  <div className="flex items-center gap-1 mt-3 text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Explorar <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <Link href="/erros-comuns">
          <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all cursor-pointer h-full">
            <Wrench className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-bold text-sm mb-1 mt-0 border-0">
              Caiu? Erros mais comuns
            </h3>
            <p className="text-xs text-muted-foreground">
              Apache não inicia, porta 80 ocupada, MySQL travado…
              soluções diretas.
            </p>
          </div>
        </Link>
        <Link href="/mercury">
          <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all cursor-pointer h-full">
            <Mail className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-bold text-sm mb-1 mt-0 border-0">
              Email local com Mercury
            </h3>
            <p className="text-xs text-muted-foreground">
              Teste envio de email no PHP sem precisar de servidor SMTP
              de verdade.
            </p>
          </div>
        </Link>
        <Link href="/backup-completo">
          <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all cursor-pointer h-full">
            <Package className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-bold text-sm mb-1 mt-0 border-0">
              Backup do XAMPP inteiro
            </h3>
            <p className="text-xs text-muted-foreground">
              Salve htdocs, bancos e configs de uma vez — formate sem medo.
            </p>
          </div>
        </Link>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3 mt-0 border-0">
          Pronto para colocar a mão na massa?
        </h2>
        <p className="text-muted-foreground mb-6">
          Em 10 minutos você tem o XAMPP instalado, rodando e servindo seu
          primeiro <code>index.php</code> em http://localhost.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/instalacao-windows"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Instalar agora <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            href="/o-que-e-xampp"
            className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-xl font-semibold hover:border-primary/40 transition-colors"
          >
            <Server className="w-4 h-4 text-primary" />
            Antes, entender o que é
          </Link>
        </div>
      </div>
    </div>
  );
}
