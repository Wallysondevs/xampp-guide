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
    desc: "Entenda Apache + MariaDB + PHP + Perl em um único pacote.",
    href: "/o-que-e-xampp",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: HardDrive,
    title: "Instalação rápida",
    desc: "Windows, Linux ou macOS — passo a passo, sem deixar nada para trás.",
    href: "/instalacao-windows",
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    icon: PanelTop,
    title: "Painel & Portas",
    desc: "Controle Apache e MySQL. Resolva o conflito da porta 80 com Skype/IIS.",
    href: "/painel-controle",
    color: "bg-yellow-500/10 text-yellow-400",
  },
  {
    icon: Settings,
    title: "Configurando Apache",
    desc: "Virtual Hosts, .htaccess, mod_rewrite e HTTPS local com certificado próprio.",
    href: "/apache-config",
    color: "bg-cyan-500/10 text-cyan-400",
  },
  {
    icon: Package,
    title: "Dominando o PHP",
    desc: "php.ini, extensões, Xdebug, Composer e como trocar a versão do PHP.",
    href: "/php-ini",
    color: "bg-violet-500/10 text-violet-400",
  },
  {
    icon: Database,
    title: "MariaDB & phpMyAdmin",
    desc: "Defina senha do root, crie bancos, importe e exporte dumps SQL.",
    href: "/phpmyadmin",
    color: "bg-green-500/10 text-green-400",
  },
  {
    icon: Globe,
    title: "Hospedando aplicações",
    desc: "WordPress e Laravel rodando bonitinho em http://localhost.",
    href: "/wordpress",
    color: "bg-pink-500/10 text-pink-400",
  },
  {
    icon: Rocket,
    title: "Indo para produção",
    desc: "Migre seu projeto local para um servidor de verdade — com checklist.",
    href: "/migrar-producao",
    color: "bg-red-500/10 text-red-400",
  },
];

const stats = [
  { value: "55", label: "Tópicos" },
  { value: "200+", label: "Códigos prontos" },
  { value: "PT-BR", label: "100% Português" },
  { value: "Grátis", label: "Open Source" },
];

const versions = [
  { name: "XAMPP", v: "8.2.12" },
  { name: "PHP", v: "8.2 / 8.3 / 8.4" },
  { name: "Apache", v: "2.4.66" },
  { name: "MariaDB", v: "11.4 LTS" },
  { name: "phpMyAdmin", v: "5.2.3" },
  { name: "OpenSSL", v: "3.x" },
  { name: "Composer", v: "2.8.x" },
  { name: "Mercury", v: "4.8" },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pb-24">
      {/* AVISO */}
      <div className="mb-10 rounded-2xl border-2 border-yellow-500/40 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 bg-yellow-500/15 border-b border-yellow-500/30">
          <ShieldAlert className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-bold uppercase tracking-wider text-yellow-300">
            Antes de começar — leitura rápida
          </span>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-sm text-foreground/90 leading-relaxed m-0">
            O XAMPP é um <strong>ambiente de desenvolvimento local</strong>. Ele vem
            com configurações abertas (senha de root vazia, phpMyAdmin acessível,
            mod_status ativo) para que você comece em segundos.{" "}
            <strong className="text-yellow-300">
              Nunca o utilize como servidor de produção
            </strong>{" "}
            exposto à internet — esse não é o propósito da ferramenta.
          </p>
          <p className="text-sm text-foreground/90 leading-relaxed m-0">
            Use o XAMPP para aprender, prototipar, testar plugins do WordPress,
            rodar projetos Laravel/Symfony, dar aulas, fazer trabalhos da
            faculdade. Quando o projeto for pro ar, use uma VPS de verdade
            (Hostinger, DigitalOcean, AWS, etc.). Temos um capítulo inteiro
            sobre isso.
          </p>
          <Link
            href="/seguranca"
            className="inline-flex items-center gap-2 px-4 py-2 mt-1 bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-300 border border-yellow-500/30 rounded-lg text-sm font-semibold transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            Ler o capítulo de Segurança
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* HERO */}
      <div className="text-center mb-16 mt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
          <Server className="w-4 h-4" />
          Guia Completo em Português Brasileiro — XAMPP 8.2 / PHP 8.4
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 forge-gradient-text leading-tight font-display tracking-tight">
          XAMPP do Zero ao Avançado
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Apache, MariaDB, PHP e Perl em um único pacote. Instale, configure e
          hospede projetos PHP no seu computador em poucos minutos —{" "}
          <strong className="text-foreground">com exemplos práticos</strong>{" "}
          em ordem cronológica e linguagem didática.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card/50 p-5 text-center"
          >
            <div className="text-3xl font-bold text-primary mb-1 font-display">
              {s.value}
            </div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* VERSÕES */}
      <div className="mb-16 rounded-2xl border border-border bg-card/30 overflow-hidden">
        <div className="px-5 py-3 bg-primary/5 border-b border-border">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary m-0 border-0 p-0">
            Versões cobertas — XAMPP 8.2.12 estável
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border">
          {versions.map((p) => (
            <div key={p.name} className="bg-card px-4 py-3">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                {p.name}
              </div>
              <div className="font-mono text-sm font-bold text-foreground">{p.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TRILHA */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-8 text-center font-display">
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
                  <h3 className="font-bold text-foreground mb-1 text-sm mt-0 border-0 font-display">
                    {s.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed m-0">
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

      {/* DESTAQUES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <Link href="/erros-comuns">
          <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all cursor-pointer h-full">
            <Wrench className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-bold text-sm mb-1 mt-0 border-0 font-display">
              Caiu? Erros mais comuns
            </h3>
            <p className="text-xs text-muted-foreground m-0">
              Apache não inicia, porta 80 ocupada, MySQL travado… soluções diretas.
            </p>
          </div>
        </Link>
        <Link href="/mercury">
          <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all cursor-pointer h-full">
            <Mail className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-bold text-sm mb-1 mt-0 border-0 font-display">
              Email local com Mercury
            </h3>
            <p className="text-xs text-muted-foreground m-0">
              Teste envio de email no PHP sem precisar de servidor SMTP de verdade.
            </p>
          </div>
        </Link>
        <Link href="/backup-completo">
          <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all cursor-pointer h-full">
            <Package className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-bold text-sm mb-1 mt-0 border-0 font-display">
              Backup do XAMPP inteiro
            </h3>
            <p className="text-xs text-muted-foreground m-0">
              Salve htdocs, bancos e configs de uma vez — formate sem medo.
            </p>
          </div>
        </Link>
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-orange-500/5 p-8 text-center">
        <h2 className="text-2xl font-bold mb-3 mt-0 border-0 font-display">
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
