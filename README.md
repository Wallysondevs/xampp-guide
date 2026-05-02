# XAMPP Guide — do Zero ao Avançado

Guia completo de XAMPP em **Português Brasileiro**, escrito do ponto de vista de quem está aprendendo a hospedar projetos PHP localmente. **30 tópicos** cobrindo Apache, MariaDB, PHP e Perl em ordem cronológica — da instalação até deploy em produção.

> Aplicativo web feito em React + Vite, com tema escuro/claro, busca por seções, exemplos de código copiáveis e exercícios práticos.

## Tópicos abordados

- **Comece aqui** — O que é XAMPP, comparação com WAMP/MAMP/Laragon
- **Instalação** — Windows, Linux, macOS, estrutura de pastas
- **Painel & Serviços** — XAMPP Control Panel, conflitos de portas
- **Apache** — `httpd.conf`, Virtual Hosts, `.htaccess`, HTTPS local (SSL), módulos
- **PHP** — `php.ini`, extensões, múltiplas versões, Composer, Xdebug
- **MySQL/MariaDB** — Configuração, phpMyAdmin, senha do root, backups
- **Projetos** — Mercury (email local), WordPress, Laravel, migração para produção
- **Manutenção** — Segurança, erros comuns, backup completo

## Como rodar localmente

```bash
# Requer Node.js 18+ e pnpm (ou npm/yarn)
pnpm install
pnpm dev
```

Acesse [http://localhost:5173](http://localhost:5173).

### Build de produção

```bash
pnpm build
pnpm preview
```

A build estática fica em `dist/` e pode ser hospedada em qualquer CDN (Vercel, Netlify, GitHub Pages, Cloudflare Pages, etc.).

## Stack

- **React 19** + **Vite 7**
- **Tailwind CSS v4** com tema customizado (laranja XAMPP)
- **wouter** para roteamento por hash
- **framer-motion** para animações suaves
- **react-syntax-highlighter** (vscDarkPlus) para blocos de código
- **lucide-react** para ícones
- **shadcn/ui** (Radix UI primitives)

## Estrutura

```
src/
├── App.tsx               # Roteador (hash) com 30 rotas
├── main.tsx              # Entry point
├── index.css             # Tema XAMPP (HSL orange 22 95% 56%)
├── components/
│   ├── layout/           # Header, Sidebar, PageContainer
│   └── ui/               # AlertBox, CodeBlock, ParamsTable, PracticeBox + shadcn
├── hooks/                # use-theme, use-toast, use-mobile
├── lib/utils.ts          # cn() para merge de classes Tailwind
└── pages/                # 30 páginas de tópicos + Home + 404
```

## Autor

**Wallyson Lopes da Silva** — [@Wallysondevs](https://github.com/Wallysondevs)

## Licença

MIT — veja [LICENSE](./LICENSE).
