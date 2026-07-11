import{j as e}from"./index-BreI0dyu.js";import{P as d,A as a}from"./AlertBox-C_bJKc46.js";import{C as o}from"./CodeBlock-D0rWxPIU.js";import{P as s}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function n(){return e.jsxs(d,{title:"Módulos do Apache 2.4",subtitle:"O Apache é um esqueleto magro que ganha poder com módulos. MPMs, módulos base, módulos comuns e como ativá-los — referência completa do que vem com o XAMPP.",difficulty:"intermediario",timeToRead:"12 min",children:[e.jsxs(a,{type:"info",title:"Pré-requisitos",children:["Capítulo de ",e.jsx("a",{href:"#/apache-config",children:"httpd.conf"})," lido. Saber o que é uma diretiva e como reiniciar o Apache."]}),e.jsx("h2",{children:"Glossário rápido"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Módulo"})," — pedaço de código que adiciona funcionalidade ao Apache. Cada um implementa um conjunto de diretivas e/ou hooks que o servidor chama em pontos específicos do ciclo de vida da requisição."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Built-in (estático)"})," — módulo compilado dentro do binário do Apache. Não pode ser desabilitado em runtime. No XAMPP: muito poucos (basicamente ",e.jsx("code",{children:"core"}),", ",e.jsx("code",{children:"so"}),","," ",e.jsx("code",{children:"http"}),")."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"DSO (Dynamic Shared Object)"})," — módulo carregado em tempo de execução via ",e.jsx("code",{children:"LoadModule"}),". É como o Apache do XAMPP foi compilado: kernel pequeno + dezenas de"," ",e.jsx("code",{children:".so"}),"/",e.jsx("code",{children:".dll"})," opcionais. Vantagem: liga/desliga sem recompilar."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"MPM (Multi-Processing Module)"})," — módulo especial que define como o Apache atende requisições simultâneas. Um único MPM por instalação."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Hook / fase"}),' — ponto do ciclo onde o Apache chama os módulos: pós-leitura do request, autenticação, autorização, mapeamento de URL, handler, log, etc. Cada módulo se "registra" nos hooks que precisa.']}),e.jsx("h2",{children:"MPMs — o coração do paralelismo"}),e.jsxs("p",{children:["O Apache só pode ter ",e.jsx("strong",{children:"um"})," MPM ativo por vez. O MPM define como o servidor lida com várias conexões ao mesmo tempo:"]}),e.jsx(s,{title:"MPMs disponíveis no Apache 2.4",params:[{flag:"mpm_winnt",desc:"Único MPM no Windows. Um processo pai + um filho com várias threads. É o que o XAMPP para Windows usa."},{flag:"mpm_prefork",desc:"Multi-processo, sem threads. Cada requisição em um processo separado. Estável, isola falhas, mas consome muita memória. Único MPM seguro com PHP mod_php."},{flag:"mpm_worker",desc:"Multi-processo + multi-thread (híbrido). Menos memória que prefork, mais throughput."},{flag:"mpm_event",desc:"Variação do worker que delega keep-alive a uma thread separada. MPM padrão atual em Linux. Excelente para muitas conexões keep-alive (APIs, WebSockets)."}]}),e.jsxs(a,{type:"warning",title:"MPM event + PHP-FPM (em produção)",children:["Em produção Linux moderna, a stack recomendada é:"," ",e.jsx("strong",{children:"Apache + mpm_event + PHP-FPM"})," (em vez de mod_php). O Apache passa as requisições PHP por FastCGI ao FPM, ganhando muita performance. O XAMPP é simplista — usa ",e.jsx("code",{children:"mod_php"})," ","(mais fácil, menos rápido)."]}),e.jsx("h2",{children:"Como ativar/desativar um módulo"}),e.jsx(o,{language:"apache",code:`# DESATIVADO (com #):
#LoadModule rewrite_module modules/mod_rewrite.so

# ATIVADO (descomentado):
LoadModule rewrite_module modules/mod_rewrite.so`}),e.jsx("p",{children:"Salve o arquivo. Reinicie o Apache (Painel → Stop → Start). Pronto."}),e.jsxs(a,{type:"warning",title:"Erro de syntax na inicialização?",children:["Se o Apache parar de iniciar logo após você ativar um módulo, é provavelmente porque alguma diretiva no httpd.conf depende dele e agora há outro conflito (módulo dependente faltando, conflito de nome, etc). Olhe o ",e.jsx("code",{children:"apache/logs/error.log"})," — a primeira linha do erro costuma dizer exatamente onde está o problema."]}),e.jsx("h2",{children:"Categorias de módulos"}),e.jsx("p",{children:"A documentação oficial do Apache organiza os módulos em:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Core"})," — ",e.jsx("code",{children:"core"}),", ",e.jsx("code",{children:"mpm_*"}),", ",e.jsx("code",{children:"so"}),". Funcionalidade base."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Loggers"})," — ",e.jsx("code",{children:"mod_log_config"}),", ",e.jsx("code",{children:"mod_log_debug"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Filtros"})," — ",e.jsx("code",{children:"mod_filter"}),", ",e.jsx("code",{children:"mod_deflate"}),", ",e.jsx("code",{children:"mod_substitute"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Mappers"})," — ",e.jsx("code",{children:"mod_alias"}),", ",e.jsx("code",{children:"mod_rewrite"}),", ",e.jsx("code",{children:"mod_userdir"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Autenticação"})," — ",e.jsx("code",{children:"mod_auth_basic"}),", ",e.jsx("code",{children:"mod_auth_digest"}),", ",e.jsx("code",{children:"mod_authn_file"}),", ",e.jsx("code",{children:"mod_authn_dbm"}),", ",e.jsx("code",{children:"mod_authnz_ldap"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Autorização"})," — ",e.jsx("code",{children:"mod_authz_*"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Cache"})," — ",e.jsx("code",{children:"mod_cache"}),", ",e.jsx("code",{children:"mod_cache_disk"}),", ",e.jsx("code",{children:"mod_expires"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"SSL/TLS"})," — ",e.jsx("code",{children:"mod_ssl"}),", ",e.jsx("code",{children:"mod_md"})," (Let's Encrypt)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Proxy"})," — ",e.jsx("code",{children:"mod_proxy"}),", ",e.jsx("code",{children:"mod_proxy_http"}),", ",e.jsx("code",{children:"mod_proxy_fcgi"}),", ",e.jsx("code",{children:"mod_proxy_wstunnel"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"HTTP"})," — ",e.jsx("code",{children:"mod_http2"}),", ",e.jsx("code",{children:"mod_headers"}),", ",e.jsx("code",{children:"mod_mime"}),"."]})]}),e.jsx("h2",{children:"Módulos do dia a dia (XAMPP)"}),e.jsx(s,{title:"Os módulos que você provavelmente vai querer ligar",params:[{flag:"mod_rewrite",desc:"URLs amigáveis e redirects via .htaccess. Imprescindível para WordPress, Laravel, qualquer framework moderno. JÁ VEM ATIVO no XAMPP."},{flag:"mod_ssl",desc:"Suporte a HTTPS. Necessário para o Apache servir conexões na porta 443."},{flag:"mod_headers",desc:"Adiciona/remove cabeçalhos HTTP via .htaccess (Header set, Header unset). Essencial para CORS, HSTS, CSP, segurança."},{flag:"mod_expires",desc:"Define cabeçalhos Expires e Cache-Control para imagens/CSS/JS."},{flag:"mod_deflate",desc:"Compactação gzip de respostas. Reduz drasticamente o peso de HTML/CSS/JS enviados."},{flag:"mod_brotli",desc:"Compressão brotli (mais eficiente que gzip). Apache 2.4.26+."},{flag:"mod_alias",desc:"Cria aliases — manda /docs para /var/www/documentos sem mover arquivos. E Redirect (sem regex)."},{flag:"mod_proxy + mod_proxy_http",desc:"Reverse proxy. Útil quando você quer servir um Node.js/Vite por trás do Apache."},{flag:"mod_proxy_wstunnel",desc:"Suporte a WebSocket via proxy. Para testar app real-time atrás do Apache."},{flag:"mod_proxy_fcgi",desc:"FastCGI proxy — usado para conversar com PHP-FPM."},{flag:"mod_dav + mod_dav_fs",desc:"Suporte a WebDAV. Permite usar o Apache como compartilhamento de arquivos via HTTP."},{flag:"mod_userdir",desc:"Habilita pastas pessoais — http://localhost/~usuario aponta para /home/usuario/public_html."},{flag:"mod_status",desc:"Página /server-status com estatísticas em tempo real (conexões, threads, requests/s)."},{flag:"mod_info",desc:"Página /server-info com toda a configuração ativa do Apache. Útil para debug."},{flag:"mod_cgi / mod_cgid",desc:"Executa scripts CGI (Perl, shell scripts). Praticamente legado, mas o XAMPP traz."},{flag:"mod_security2",desc:"Web Application Firewall (WAF). Bloqueia ataques conhecidos antes de chegar no PHP. Não vem habilitado."},{flag:"mod_http2",desc:"Suporte a HTTP/2. Apache 2.4.17+. Geralmente combinado com TLS (h2)."},{flag:"mod_md",desc:"ACME / Let's Encrypt automático. Apache 2.4.30+. Em produção, gera e renova certs automaticamente."}]}),e.jsx("h2",{children:"Listando todos os módulos carregados"}),e.jsx(o,{language:"bash",code:`# Windows
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
#  headers_module (shared)`}),e.jsxs("p",{children:["Repare em ",e.jsx("code",{children:"(static)"})," vs ",e.jsx("code",{children:"(shared)"})," — o primeiro é built-in, o segundo é DSO (carregado via"," ",e.jsx("code",{children:"LoadModule"}),")."]}),e.jsx("h2",{children:"Habilitar gzip (mod_deflate)"}),e.jsxs("p",{children:["No ",e.jsx("code",{children:"httpd.conf"}),", deixe ativo o LoadModule:"]}),e.jsx(o,{language:"apache",code:"LoadModule deflate_module modules/mod_deflate.so"}),e.jsxs("p",{children:["Em um ",e.jsx("code",{children:".htaccess"})," (ou no próprio httpd.conf):"]}),e.jsx(o,{language:"apache",code:`<IfModule mod_deflate.c>
    # Comprimir tudo que faz sentido (texto)
    AddOutputFilterByType DEFLATE text/html text/plain text/xml
    AddOutputFilterByType DEFLATE text/css text/javascript
    AddOutputFilterByType DEFLATE application/javascript application/json
    AddOutputFilterByType DEFLATE application/xml application/rss+xml
    AddOutputFilterByType DEFLATE image/svg+xml application/x-font-ttf

    # Não tente comprimir o que já está comprimido
    SetEnvIfNoCase Request_URI \\.(?:gif|jpe?g|png|webp|woff2?)$ no-gzip
</IfModule>`}),e.jsx("h2",{children:"Habilitar brotli (mod_brotli)"}),e.jsx("p",{children:"Brotli comprime ~20% melhor que gzip para texto. Suportado em todos os navegadores modernos."}),e.jsx(o,{language:"apache",code:`LoadModule brotli_module modules/mod_brotli.so

<IfModule mod_brotli.c>
    AddOutputFilterByType BROTLI_COMPRESS text/html text/plain text/xml text/css
    AddOutputFilterByType BROTLI_COMPRESS application/javascript application/json
</IfModule>`}),e.jsx("h2",{children:"CORS via mod_headers"}),e.jsx(o,{language:"apache",code:`<IfModule mod_headers.c>
    # Liberar pra qualquer origem (USE SÓ EM DEV)
    Header set Access-Control-Allow-Origin "*"

    # Liberar só para um domínio específico (produção)
    Header set Access-Control-Allow-Origin "https://meufrontend.com.br"

    # Métodos e headers liberados
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
    Header set Access-Control-Allow-Credentials "true"
</IfModule>`}),e.jsx("h2",{children:"mod_status — métricas em tempo real"}),e.jsx(o,{language:"apache",code:`LoadModule status_module modules/mod_status.so

<Location "/server-status">
    SetHandler server-status
    Require host localhost
    Require ip 127.0.0.1
</Location>

# Detalhes "ExtendedStatus" (custa um pouquinho mais)
ExtendedStatus On`}),e.jsxs("p",{children:["Acesse ",e.jsx("code",{children:"http://localhost/server-status"})," — vê todas as threads ativas, qual URL cada uma está servindo, há quanto tempo, bytes enviados, etc."]}),e.jsx("h2",{children:"mod_info — configuração efetiva"}),e.jsx(o,{language:"apache",code:`LoadModule info_module modules/mod_info.so

<Location "/server-info">
    SetHandler server-info
    Require host localhost
</Location>`}),e.jsxs("p",{children:["Acesse ",e.jsx("code",{children:"http://localhost/server-info"})," — mostra TODA a configuração do Apache, módulo por módulo, com origem (arquivo:linha) de cada diretiva."]}),e.jsx("h2",{children:"Reverse proxy para um Node.js/Vite"}),e.jsxs("p",{children:["Cenário: você está fazendo um app SPA com Vite em"," ",e.jsx("code",{children:":5173"})," e quer servi-lo em ",e.jsx("code",{children:"http://app.local"})," ","passando pelo Apache (para usar o cert SSL local, evitar CORS, etc)."]}),e.jsx(o,{language:"apache",code:`LoadModule proxy_module modules/mod_proxy.so
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
</VirtualHost>`}),e.jsx("h2",{children:"WebDAV — pasta de arquivos via HTTP"}),e.jsx(o,{language:"apache",code:`LoadModule dav_module modules/mod_dav.so
LoadModule dav_fs_module modules/mod_dav_fs.so

DavLockDB "C:/xampp/apache/var/DavLock"

<Directory "C:/xampp/htdocs/files">
    Dav On
    AuthType Basic
    AuthName "WebDAV"
    AuthUserFile "C:/xampp/htdocs/.htpasswd"
    Require valid-user
</Directory>`}),e.jsxs(a,{type:"info",title:"Não exagere",children:["Cada módulo carregado consome memória do Apache. Em desenvolvimento isso não importa, mas em produção deixe carregado só o necessário — e use ",e.jsx("code",{children:"httpd -M"})," para auditar periodicamente."]}),e.jsx("h2",{children:"Módulos de terceiros"}),e.jsx("p",{children:"O Apache tem um ecossistema gigante. Os mais conhecidos fora da distribuição padrão:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"mod_security"})," (Trustwave) — WAF open source com regras OWASP."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"mod_evasive"})," — defesa contra DoS simples (rate limit por IP)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"mod_pagespeed"})," (Google, descontinuado em 2020 mas ainda funciona) — otimização automática de assets."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"mod_xsendfile"})," — entrega de downloads grandes delegada ao Apache (em vez do PHP segurar a memória)."]})]}),e.jsxs("p",{children:["Para instalar, baixe o ",e.jsx("code",{children:".so"}),"/",e.jsx("code",{children:".dll"})," compilado para a versão exata do seu Apache, coloque em"," ",e.jsx("code",{children:"apache/modules/"}),", adicione um ",e.jsx("code",{children:"LoadModule"})," ","e reinicie."]})]})}export{n as default};
