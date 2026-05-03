import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function ApacheModulos() {
  return (
    <PageContainer
      title="Módulos do Apache 2.4"
      subtitle="O Apache é um esqueleto magro que ganha poder com módulos. MPMs, módulos base, módulos comuns e como ativá-los — referência completa do que vem com o XAMPP."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Capítulo de <a href="#/apache-config">httpd.conf</a> lido. Saber o
        que é uma diretiva e como reiniciar o Apache.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Módulo</strong> — pedaço de código que adiciona
        funcionalidade ao Apache. Cada um implementa um conjunto de
        diretivas e/ou hooks que o servidor chama em pontos específicos do
        ciclo de vida da requisição.
      </p>
      <p>
        <strong>Built-in (estático)</strong> — módulo compilado dentro do
        binário do Apache. Não pode ser desabilitado em runtime. No XAMPP:
        muito poucos (basicamente <code>core</code>, <code>so</code>,{" "}
        <code>http</code>).
      </p>
      <p>
        <strong>DSO (Dynamic Shared Object)</strong> — módulo carregado em
        tempo de execução via <code>LoadModule</code>. É como o Apache do
        XAMPP foi compilado: kernel pequeno + dezenas de{" "}
        <code>.so</code>/<code>.dll</code> opcionais. Vantagem:
        liga/desliga sem recompilar.
      </p>
      <p>
        <strong>MPM (Multi-Processing Module)</strong> — módulo especial
        que define como o Apache atende requisições simultâneas. Um único
        MPM por instalação.
      </p>
      <p>
        <strong>Hook / fase</strong> — ponto do ciclo onde o Apache chama
        os módulos: pós-leitura do request, autenticação, autorização,
        mapeamento de URL, handler, log, etc. Cada módulo se "registra"
        nos hooks que precisa.
      </p>

      <h2>MPMs — o coração do paralelismo</h2>
      <p>
        O Apache só pode ter <strong>um</strong> MPM ativo por vez. O MPM
        define como o servidor lida com várias conexões ao mesmo tempo:
      </p>
      <ParamsTable
        title="MPMs disponíveis no Apache 2.4"
        params={[
          { flag: "mpm_winnt", desc: "Único MPM no Windows. Um processo pai + um filho com várias threads. É o que o XAMPP para Windows usa." },
          { flag: "mpm_prefork", desc: "Multi-processo, sem threads. Cada requisição em um processo separado. Estável, isola falhas, mas consome muita memória. Único MPM seguro com PHP mod_php." },
          { flag: "mpm_worker", desc: "Multi-processo + multi-thread (híbrido). Menos memória que prefork, mais throughput." },
          { flag: "mpm_event", desc: "Variação do worker que delega keep-alive a uma thread separada. MPM padrão atual em Linux. Excelente para muitas conexões keep-alive (APIs, WebSockets)." },
        ]}
      />

      <AlertBox type="warning" title="MPM event + PHP-FPM (em produção)">
        Em produção Linux moderna, a stack recomendada é:{" "}
        <strong>Apache + mpm_event + PHP-FPM</strong> (em vez de mod_php).
        O Apache passa as requisições PHP por FastCGI ao FPM, ganhando
        muita performance. O XAMPP é simplista — usa <code>mod_php</code>{" "}
        (mais fácil, menos rápido).
      </AlertBox>

      <h2>Como ativar/desativar um módulo</h2>
      <CodeBlock language="apache" code={`# DESATIVADO (com #):
#LoadModule rewrite_module modules/mod_rewrite.so

# ATIVADO (descomentado):
LoadModule rewrite_module modules/mod_rewrite.so`} />
      <p>
        Salve o arquivo. Reinicie o Apache (Painel → Stop → Start).
        Pronto.
      </p>

      <AlertBox type="warning" title="Erro de syntax na inicialização?">
        Se o Apache parar de iniciar logo após você ativar um módulo, é
        provavelmente porque alguma diretiva no httpd.conf depende dele e
        agora há outro conflito (módulo dependente faltando, conflito de
        nome, etc). Olhe o <code>apache/logs/error.log</code> — a primeira
        linha do erro costuma dizer exatamente onde está o problema.
      </AlertBox>

      <h2>Categorias de módulos</h2>
      <p>A documentação oficial do Apache organiza os módulos em:</p>
      <ul>
        <li><strong>Core</strong> — <code>core</code>, <code>mpm_*</code>, <code>so</code>. Funcionalidade base.</li>
        <li><strong>Loggers</strong> — <code>mod_log_config</code>, <code>mod_log_debug</code>.</li>
        <li><strong>Filtros</strong> — <code>mod_filter</code>, <code>mod_deflate</code>, <code>mod_substitute</code>.</li>
        <li><strong>Mappers</strong> — <code>mod_alias</code>, <code>mod_rewrite</code>, <code>mod_userdir</code>.</li>
        <li><strong>Autenticação</strong> — <code>mod_auth_basic</code>, <code>mod_auth_digest</code>, <code>mod_authn_file</code>, <code>mod_authn_dbm</code>, <code>mod_authnz_ldap</code>.</li>
        <li><strong>Autorização</strong> — <code>mod_authz_*</code>.</li>
        <li><strong>Cache</strong> — <code>mod_cache</code>, <code>mod_cache_disk</code>, <code>mod_expires</code>.</li>
        <li><strong>SSL/TLS</strong> — <code>mod_ssl</code>, <code>mod_md</code> (Let's Encrypt).</li>
        <li><strong>Proxy</strong> — <code>mod_proxy</code>, <code>mod_proxy_http</code>, <code>mod_proxy_fcgi</code>, <code>mod_proxy_wstunnel</code>.</li>
        <li><strong>HTTP</strong> — <code>mod_http2</code>, <code>mod_headers</code>, <code>mod_mime</code>.</li>
      </ul>

      <h2>Módulos do dia a dia (XAMPP)</h2>
      <ParamsTable
        title="Os módulos que você provavelmente vai querer ligar"
        params={[
          { flag: "mod_rewrite", desc: "URLs amigáveis e redirects via .htaccess. Imprescindível para WordPress, Laravel, qualquer framework moderno. JÁ VEM ATIVO no XAMPP." },
          { flag: "mod_ssl", desc: "Suporte a HTTPS. Necessário para o Apache servir conexões na porta 443." },
          { flag: "mod_headers", desc: "Adiciona/remove cabeçalhos HTTP via .htaccess (Header set, Header unset). Essencial para CORS, HSTS, CSP, segurança." },
          { flag: "mod_expires", desc: "Define cabeçalhos Expires e Cache-Control para imagens/CSS/JS." },
          { flag: "mod_deflate", desc: "Compactação gzip de respostas. Reduz drasticamente o peso de HTML/CSS/JS enviados." },
          { flag: "mod_brotli", desc: "Compressão brotli (mais eficiente que gzip). Apache 2.4.26+." },
          { flag: "mod_alias", desc: "Cria aliases — manda /docs para /var/www/documentos sem mover arquivos. E Redirect (sem regex)." },
          { flag: "mod_proxy + mod_proxy_http", desc: "Reverse proxy. Útil quando você quer servir um Node.js/Vite por trás do Apache." },
          { flag: "mod_proxy_wstunnel", desc: "Suporte a WebSocket via proxy. Para testar app real-time atrás do Apache." },
          { flag: "mod_proxy_fcgi", desc: "FastCGI proxy — usado para conversar com PHP-FPM." },
          { flag: "mod_dav + mod_dav_fs", desc: "Suporte a WebDAV. Permite usar o Apache como compartilhamento de arquivos via HTTP." },
          { flag: "mod_userdir", desc: "Habilita pastas pessoais — http://localhost/~usuario aponta para /home/usuario/public_html." },
          { flag: "mod_status", desc: "Página /server-status com estatísticas em tempo real (conexões, threads, requests/s)." },
          { flag: "mod_info", desc: "Página /server-info com toda a configuração ativa do Apache. Útil para debug." },
          { flag: "mod_cgi / mod_cgid", desc: "Executa scripts CGI (Perl, shell scripts). Praticamente legado, mas o XAMPP traz." },
          { flag: "mod_security2", desc: "Web Application Firewall (WAF). Bloqueia ataques conhecidos antes de chegar no PHP. Não vem habilitado." },
          { flag: "mod_http2", desc: "Suporte a HTTP/2. Apache 2.4.17+. Geralmente combinado com TLS (h2)." },
          { flag: "mod_md", desc: "ACME / Let's Encrypt automático. Apache 2.4.30+. Em produção, gera e renova certs automaticamente." },
        ]}
      />

      <h2>Listando todos os módulos carregados</h2>
      <CodeBlock language="bash" code={`# Windows
C:/xampp/apache/bin/httpd.exe -M

# Linux
/opt/lampp/bin/httpd -M

# Saída exemplo:
# Loaded Modules:
#  core_module (static)
#  http_module (static)
#  ...
#  rewrite_module (shared)
#  ssl_module (shared)
#  headers_module (shared)`} />
      <p>
        Repare em <code>(static)</code> vs <code>(shared)</code> — o
        primeiro é built-in, o segundo é DSO (carregado via{" "}
        <code>LoadModule</code>).
      </p>

      <h2>Habilitar gzip (mod_deflate)</h2>
      <p>No <code>httpd.conf</code>, deixe ativo o LoadModule:</p>
      <CodeBlock language="apache" code={`LoadModule deflate_module modules/mod_deflate.so`} />
      <p>
        Em um <code>.htaccess</code> (ou no próprio httpd.conf):
      </p>
      <CodeBlock language="apache" code={`<IfModule mod_deflate.c>
    # Comprimir tudo que faz sentido (texto)
    AddOutputFilterByType DEFLATE text/html text/plain text/xml
    AddOutputFilterByType DEFLATE text/css text/javascript
    AddOutputFilterByType DEFLATE application/javascript application/json
    AddOutputFilterByType DEFLATE application/xml application/rss+xml
    AddOutputFilterByType DEFLATE image/svg+xml application/x-font-ttf

    # Não tente comprimir o que já está comprimido
    SetEnvIfNoCase Request_URI \\.(?:gif|jpe?g|png|webp|woff2?)$ no-gzip
</IfModule>`} />

      <h2>Habilitar brotli (mod_brotli)</h2>
      <p>
        Brotli comprime ~20% melhor que gzip para texto. Suportado em
        todos os navegadores modernos.
      </p>
      <CodeBlock language="apache" code={`LoadModule brotli_module modules/mod_brotli.so

<IfModule mod_brotli.c>
    AddOutputFilterByType BROTLI_COMPRESS text/html text/plain text/xml text/css
    AddOutputFilterByType BROTLI_COMPRESS application/javascript application/json
</IfModule>`} />

      <h2>CORS via mod_headers</h2>
      <CodeBlock language="apache" code={`<IfModule mod_headers.c>
    # Liberar pra qualquer origem (USE SÓ EM DEV)
    Header set Access-Control-Allow-Origin "*"

    # Liberar só para um domínio específico (produção)
    Header set Access-Control-Allow-Origin "https://meufrontend.com.br"

    # Métodos e headers liberados
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
    Header set Access-Control-Allow-Credentials "true"
</IfModule>`} />

      <h2>mod_status — métricas em tempo real</h2>
      <CodeBlock language="apache" code={`LoadModule status_module modules/mod_status.so

<Location "/server-status">
    SetHandler server-status
    Require host localhost
    Require ip 127.0.0.1
</Location>

# Detalhes "ExtendedStatus" (custa um pouquinho mais)
ExtendedStatus On`} />
      <p>
        Acesse <code>http://localhost/server-status</code> — vê todas as
        threads ativas, qual URL cada uma está servindo, há quanto tempo,
        bytes enviados, etc.
      </p>

      <h2>mod_info — configuração efetiva</h2>
      <CodeBlock language="apache" code={`LoadModule info_module modules/mod_info.so

<Location "/server-info">
    SetHandler server-info
    Require host localhost
</Location>`} />
      <p>
        Acesse <code>http://localhost/server-info</code> — mostra TODA a
        configuração do Apache, módulo por módulo, com origem
        (arquivo:linha) de cada diretiva.
      </p>

      <h2>Reverse proxy para um Node.js/Vite</h2>
      <p>
        Cenário: você está fazendo um app SPA com Vite em{" "}
        <code>:5173</code> e quer servi-lo em <code>http://app.local</code>{" "}
        passando pelo Apache (para usar o cert SSL local, evitar CORS, etc).
      </p>
      <CodeBlock language="apache" code={`LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so

<VirtualHost *:80>
    ServerName app.local

    ProxyPreserveHost On
    ProxyPass        /  http://localhost:5173/
    ProxyPassReverse /  http://localhost:5173/

    # WebSocket do HMR do Vite
    ProxyPass        /ws  ws://localhost:5173/ws
    ProxyPassReverse /ws  ws://localhost:5173/ws
</VirtualHost>`} />

      <h2>WebDAV — pasta de arquivos via HTTP</h2>
      <CodeBlock language="apache" code={`LoadModule dav_module modules/mod_dav.so
LoadModule dav_fs_module modules/mod_dav_fs.so

DavLockDB "C:/xampp/apache/var/DavLock"

<Directory "C:/xampp/htdocs/files">
    Dav On
    AuthType Basic
    AuthName "WebDAV"
    AuthUserFile "C:/xampp/htdocs/.htpasswd"
    Require valid-user
</Directory>`} />

      <AlertBox type="info" title="Não exagere">
        Cada módulo carregado consome memória do Apache. Em desenvolvimento
        isso não importa, mas em produção deixe carregado só o necessário
        — e use <code>httpd -M</code> para auditar periodicamente.
      </AlertBox>

      <h2>Módulos de terceiros</h2>
      <p>
        O Apache tem um ecossistema gigante. Os mais conhecidos fora da
        distribuição padrão:
      </p>
      <ul>
        <li>
          <strong>mod_security</strong> (Trustwave) — WAF open source com
          regras OWASP.
        </li>
        <li>
          <strong>mod_evasive</strong> — defesa contra DoS simples (rate
          limit por IP).
        </li>
        <li>
          <strong>mod_pagespeed</strong> (Google, descontinuado em 2020 mas
          ainda funciona) — otimização automática de assets.
        </li>
        <li>
          <strong>mod_xsendfile</strong> — entrega de downloads grandes
          delegada ao Apache (em vez do PHP segurar a memória).
        </li>
      </ul>
      <p>
        Para instalar, baixe o <code>.so</code>/<code>.dll</code> compilado
        para a versão exata do seu Apache, coloque em{" "}
        <code>apache/modules/</code>, adicione um <code>LoadModule</code>{" "}
        e reinicie.
      </p>
    </PageContainer>
  );
}
