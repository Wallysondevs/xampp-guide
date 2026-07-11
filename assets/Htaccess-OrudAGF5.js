import{j as e}from"./index-BreI0dyu.js";import{P as s,A as o}from"./AlertBox-C_bJKc46.js";import{C as a}from"./CodeBlock-D0rWxPIU.js";import{P as r}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function l(){return e.jsxs(s,{title:".htaccess e mod_rewrite",subtitle:"O guia completo: como o Apache lê .htaccess, o que pode/não pode, performance, mod_rewrite passo a passo, flags, condições, variáveis e exemplos reais (WordPress, Laravel, força HTTPS, autenticação, cache).",difficulty:"intermediario",timeToRead:"16 min",children:[e.jsxs(o,{type:"info",title:"Pré-requisitos",children:["Capítulo de ",e.jsx("a",{href:"#/apache-config",children:"httpd.conf"})," lido — você precisa entender o que é ",e.jsx("code",{children:"AllowOverride"})," e",e.jsx("code",{children:"<Directory>"}),". Saber editar arquivos de texto puro."]}),e.jsx("h2",{children:"Glossário rápido"}),e.jsxs("p",{children:[e.jsx("strong",{children:".htaccess"}),' — arquivo de configuração local. O ponto no início faz dele "oculto" no Linux/macOS. No Windows você precisa habilitar "Mostrar arquivos ocultos" no explorador.']}),e.jsxs("p",{children:[e.jsx("strong",{children:"mod_rewrite"}),' — módulo do Apache que reescreve URLs usando regras com expressões regulares. É o módulo que faz a magia de "URLs amigáveis": ',e.jsx("code",{children:"/produto/123"})," em vez de"," ",e.jsx("code",{children:"/produto.php?id=123"}),"."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Per-directory configuration"}),' — outro nome para ".htaccess". A documentação oficial do Apache usa esse termo.']}),e.jsxs("p",{children:[e.jsx("strong",{children:"RewriteRule"})," — diretiva principal do mod_rewrite: define um padrão (regex) e o destino. Aceita flags entre colchetes que mudam o comportamento (",e.jsx("code",{children:"[L]"}),", ",e.jsx("code",{children:"[R=301]"}),","," ",e.jsx("code",{children:"[QSA]"}),", etc.)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"RewriteCond"})," — condição que precede uma"," ",e.jsx("code",{children:"RewriteRule"}),". Só se a condição for verdadeira a regra seguinte é avaliada."]}),e.jsx("h2",{children:"O que é o .htaccess"}),e.jsxs("p",{children:["É um arquivo de configuração descentralizado. Quando o Apache recebe uma requisição para um arquivo, ele lê o ",e.jsx("code",{children:".htaccess"})," ","da pasta do arquivo ",e.jsx("strong",{children:"e de todos os diretórios pais"})," ","(do mais externo ao mais interno). É como um ",e.jsx("code",{children:"httpd.conf"})," ","em miniatura, com a vantagem de:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Não precisar reiniciar"})," o Apache para que mudanças valham."]}),e.jsx("li",{children:"Funcionar em hospedagem compartilhada onde você não tem acesso ao httpd.conf."}),e.jsx("li",{children:"Permitir cada projeto ter sua própria configuração isolada."})]}),e.jsxs(o,{type:"warning",title:"Pré-requisito: AllowOverride All",children:["Para o Apache levar o ",e.jsx("code",{children:".htaccess"})," a sério, no"," ",e.jsx("code",{children:"httpd.conf"})," a diretiva da pasta correspondente precisa estar com ",e.jsx("code",{children:"AllowOverride All"})," (ou pelo menos liberar a categoria que você vai usar). Sem isso, qualquer"," ",e.jsx("code",{children:".htaccess"})," é silenciosamente ignorado — sem aviso no log."]}),e.jsx("h2",{children:"O que cada AllowOverride libera"}),e.jsx(r,{title:"Categorias de diretivas controladas por AllowOverride",params:[{flag:"All",desc:"Todas as categorias abaixo. Padrão do XAMPP em htdocs."},{flag:"None",desc:"Nenhuma. Apache nem lê o .htaccess (mais rápido)."},{flag:"AuthConfig",desc:"AuthType, AuthName, AuthUserFile, Require, etc. (autenticação básica/digest)."},{flag:"FileInfo",desc:"AddType, AddEncoding, ErrorDocument, RewriteEngine/Rule/Cond, SetEnv, Header, etc. A categoria mais usada."},{flag:"Indexes",desc:"DirectoryIndex, IndexOptions, AddDescription. Controle da listagem de pastas."},{flag:"Limit",desc:"Allow, Deny, Order (legado 2.2), Require (2.4). Controle de acesso."},{flag:"Options[=lista]",desc:"Diretiva Options. AllowOverride Options=Indexes só permite mexer em Indexes."}]}),e.jsx("h2",{children:"Habilitando o mod_rewrite"}),e.jsxs("p",{children:["URLs amigáveis (sem ",e.jsx("code",{children:"?id="})," e ",e.jsx("code",{children:".php"}),") dependem do módulo ",e.jsx("code",{children:"mod_rewrite"}),". No ",e.jsx("code",{children:"httpd.conf"})," ","deixe assim:"]}),e.jsx(a,{language:"apache",code:`# Tire o # da frente:
LoadModule rewrite_module modules/mod_rewrite.so`}),e.jsxs("p",{children:["Reinicie o Apache. Agora os ",e.jsx("code",{children:".htaccess"})," com regras de rewrite funcionam."]}),e.jsx("h2",{children:"Sintaxe da RewriteRule"}),e.jsx(a,{language:"apache",code:`RewriteRule  PADRAO  SUBSTITUICAO  [FLAGS]
            ↑       ↑              ↑
            regex   destino        opções
            que a   (URL ou        (entre colchetes,
            URL     caminho)        separadas por vírgula)
            tem que
            casar`}),e.jsx("h2",{children:"Flags do mod_rewrite (as mais usadas)"}),e.jsx(r,{title:"Flags entre colchetes em RewriteRule",params:[{flag:"L",desc:"Last — para de processar regras se essa der match. Use quase sempre."},{flag:"R[=301|302|303|307]",desc:"Redirect — manda o navegador para outra URL com o código HTTP indicado. 301=permanente, 302=temporário, 307=igual ao 302 mas preserva método."},{flag:"QSA",desc:"Query String Append — preserva a query string original (?id=1) na URL final."},{flag:"QSD",desc:"Query String Discard — descarta a query string original."},{flag:"NC",desc:"No Case — match case-insensitive."},{flag:"F",desc:"Forbidden — devolve 403 e para o processamento."},{flag:"G",desc:"Gone — devolve 410. Para conteúdo removido permanentemente."},{flag:"N",desc:"Next — recomeça o processamento a partir da primeira regra (com a URL nova)."},{flag:"NE",desc:"No Escape — não codifica caracteres especiais na URL substituída."},{flag:"PT",desc:"Pass-Through — entrega a URL reescrita ao motor seguinte (mod_alias, etc.)."},{flag:"E=VAR:VALOR",desc:"Define variável de ambiente, acessível depois pelo PHP via $_SERVER['VAR']."},{flag:"T=text/html",desc:"Força um Content-Type específico para a resposta."}]}),e.jsx("h2",{children:"RewriteCond — condições antes da regra"}),e.jsxs("p",{children:["Coloque uma ou mais ",e.jsx("code",{children:"RewriteCond"})," imediatamente antes da"," ",e.jsx("code",{children:"RewriteRule"}),". ",e.jsx("strong",{children:"Todas"})," precisam ser verdadeiras (AND) para a regra disparar. Para OR, use"," ",e.jsx("code",{children:"[OR]"})," em todas menos a última."]}),e.jsx(a,{language:"apache",code:`RewriteCond  STRING_DE_TESTE  PADRAO  [FLAGS]

# STRING_DE_TESTE costuma ser uma variável %{...}
# PADRAO costuma ser regex (ou pode ser !arquivo / !-d)`}),e.jsx("h2",{children:"Variáveis disponíveis em RewriteCond"}),e.jsx(r,{title:"Variáveis %{...} mais úteis",params:[{flag:"%{REQUEST_URI}",desc:"A URL pedida, sem o domínio. Ex: /produto/123"},{flag:"%{REQUEST_FILENAME}",desc:"Caminho completo no disco do arquivo pedido. Útil com -f e -d."},{flag:"%{HTTP_HOST}",desc:"O domínio (header Host). Ex: minhaloja.local"},{flag:"%{HTTPS}",desc:"on se a requisição é HTTPS, off se HTTP."},{flag:"%{HTTP_USER_AGENT}",desc:"Navegador do cliente. Útil para bloquear bots."},{flag:"%{HTTP_REFERER}",desc:"Página de onde o usuário veio."},{flag:"%{REMOTE_ADDR}",desc:"IP do cliente."},{flag:"%{QUERY_STRING}",desc:"Tudo depois do ? na URL. Ex: id=1&page=2"},{flag:"%{REQUEST_METHOD}",desc:"GET, POST, PUT, etc."},{flag:"%{SERVER_NAME}",desc:"Nome configurado no ServerName do VirtualHost."},{flag:"%{TIME_DAY} / TIME_HOUR / etc",desc:"Componentes da data/hora atual."}]}),e.jsxs(o,{type:"info",title:"Operadores especiais no padrão",children:["Além de regex, RewriteCond aceita operadores prontos:",e.jsxs("ul",{className:"text-sm mt-2 space-y-1",children:[e.jsxs("li",{children:[e.jsx("code",{children:"-f"})," / ",e.jsx("code",{children:"!-f"})," — é/não é arquivo regular existente."]}),e.jsxs("li",{children:[e.jsx("code",{children:"-d"})," / ",e.jsx("code",{children:"!-d"})," — é/não é diretório existente."]}),e.jsxs("li",{children:[e.jsx("code",{children:"-s"})," — é arquivo com tamanho > 0."]}),e.jsxs("li",{children:[e.jsx("code",{children:"-l"})," — é symlink."]}),e.jsxs("li",{children:[e.jsx("code",{children:"=string"})," — comparação literal de igualdade."]}),e.jsxs("li",{children:[e.jsx("code",{children:">string"}),", ",e.jsx("code",{children:"<string"})," — comparação lexicográfica."]})]})]}),e.jsx("h2",{children:"Exemplo 1 — URL amigável genérica (front controller)"}),e.jsx(a,{title:".htaccess (na raiz do projeto)",language:"apache",code:`RewriteEngine On
RewriteBase /

# Se o arquivo ou pasta NÃO existirem, manda tudo para index.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php?route=$1 [QSA,L]`}),e.jsxs("p",{children:["Resultado: ",e.jsx("code",{children:"http://localhost/produtos/123"})," chega no"," ",e.jsx("code",{children:"index.php"})," com"," ",e.jsx("code",{children:"$_GET['route'] = 'produtos/123'"}),". É a base de qualquer router de framework."]}),e.jsx("h2",{children:"Exemplo 2 — WordPress padrão"}),e.jsx(a,{title:"wordpress/.htaccess (gerado pelo WP)",language:"apache",code:`# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase /
RewriteRule ^index\\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress`}),e.jsx("h2",{children:"Exemplo 3 — Laravel padrão (pasta /public)"}),e.jsx(a,{title:"public/.htaccess (vem com o Laravel)",language:"apache",code:`<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Manuseia Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redireciona trailing slash se NÃO for diretório
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Manda tudo para index.php
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>`}),e.jsx("h2",{children:"Exemplo 4 — Forçar HTTPS"}),e.jsx(a,{language:"apache",code:`RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]`}),e.jsx("h2",{children:"Exemplo 5 — Forçar www (ou tirar)"}),e.jsx(a,{language:"apache",code:`# Forçar www.minhaloja.com.br
RewriteEngine On
RewriteCond %{HTTP_HOST} ^minhaloja\\.com\\.br [NC]
RewriteRule ^(.*)$ https://www.minhaloja.com.br/$1 [R=301,L]

# OU tirar o www
RewriteCond %{HTTP_HOST} ^www\\.minhaloja\\.com\\.br [NC]
RewriteRule ^(.*)$ https://minhaloja.com.br/$1 [R=301,L]`}),e.jsx("h2",{children:"Exemplo 6 — Bloquear acesso a arquivos sensíveis"}),e.jsx(a,{language:"apache",code:`# Negar acesso a .env, .git, composer.json, .htaccess
<FilesMatch "^(\\.env|\\.git|composer\\.(json|lock)|package\\.json|\\.htaccess)$">
    Require all denied
</FilesMatch>

# Negar acesso à pasta vendor inteira
RedirectMatch 404 /vendor

# Negar acesso por extensão
<FilesMatch "\\.(sql|bak|log|ini)$">
    Require all denied
</FilesMatch>`}),e.jsx("h2",{children:"Exemplo 7 — Cache de imagens, CSS, JS"}),e.jsx(a,{language:"apache",code:`<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresDefault "access plus 1 month"

    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"

    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType application/json "access plus 0 seconds"
    ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Cache-Control também
<IfModule mod_headers.c>
    <FilesMatch "\\.(jpg|jpeg|png|gif|webp|svg|ico|woff2?|css|js)$">
        Header set Cache-Control "public, max-age=2592000"
    </FilesMatch>
</IfModule>`}),e.jsx("h2",{children:"Exemplo 8 — Proteger uma pasta com senha"}),e.jsx(a,{title:".htaccess dentro da pasta /admin",language:"apache",code:`AuthType Basic
AuthName "Area Restrita"
AuthUserFile "C:/xampp/htdocs/.htpasswd"
Require valid-user`}),e.jsxs("p",{children:["Crie o arquivo de senhas com o utilitário ",e.jsx("code",{children:"htpasswd"})," ","que vem com o XAMPP:"]}),e.jsx(a,{language:"bash",code:`# Windows (cmd)
C:\\xampp\\apache\\bin\\htpasswd -c C:\\xampp\\htdocs\\.htpasswd admin

# Vai pedir a senha duas vezes
# -c CRIA o arquivo (use só na primeira vez; sem -c apenas adiciona)`}),e.jsx("h2",{children:"Exemplo 9 — Bloquear bots/User-Agents indesejados"}),e.jsx(a,{language:"apache",code:`RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} (AhrefsBot|MJ12bot|SemrushBot|DotBot) [NC]
RewriteRule .* - [F,L]`}),e.jsx("h2",{children:"Exemplo 10 — Bloquear hotlinking de imagens"}),e.jsx(a,{language:"apache",code:`RewriteEngine On
RewriteCond %{HTTP_REFERER} !^$
RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?minhaloja\\.local [NC]
RewriteRule \\.(jpe?g|png|gif|webp)$ - [F,NC,L]`}),e.jsx("h2",{children:"Diretivas Redirect (sem regex)"}),e.jsxs("p",{children:["Para redirects simples, use ",e.jsx("code",{children:"Redirect"})," em vez de"," ",e.jsx("code",{children:"RewriteRule"})," — é mais simples e mais rápido:"]}),e.jsx(r,{title:"Tipos de Redirect e Rewrite",params:[{flag:"Redirect 301 /antigo /novo",desc:"Redirect permanente. O Google vai entender que o /antigo se mudou pro /novo. Use em troca de URL."},{flag:"Redirect 302 /promo /produto/123",desc:"Redirect temporário. Para promoções e testes A/B."},{flag:"RedirectMatch 301 ^/loja/(.*)$ /shop/$1",desc:"Redirect com regex. Bom para mover seções inteiras."},{flag:"Redirect gone /pagina-removida",desc:"410 Gone — diz ao Google: removi de propósito, não tente reindexar."},{flag:"RewriteRule ^pattern$ destino [L]",desc:"Reescreve a URL internamente. O navegador continua vendo a URL antiga, mas o Apache serve o destino."}]}),e.jsx("h2",{children:"Performance — quando NÃO usar .htaccess"}),e.jsxs(o,{type:"warning",title:"Toda requisição re-lê os .htaccess",children:["Com ",e.jsx("code",{children:"AllowOverride All"}),", o Apache lê ",e.jsx("strong",{children:"todos"}),"os ",e.jsx("code",{children:".htaccess"})," da árvore (raiz → pasta do arquivo) em cada requisição. Em sites grandes isso pesa."]}),e.jsxs("p",{children:["Se você tem acesso ao ",e.jsx("code",{children:"httpd.conf"})," (ou seja, é o seu servidor, não hospedagem compartilhada), ",e.jsx("strong",{children:"mova as regras para o httpd.conf"})," dentro de um ",e.jsx("code",{children:"<Directory>"})," ","e ponha ",e.jsx("code",{children:"AllowOverride None"}),". O Apache lê 1× ao iniciar e nunca mais — bem mais rápido."]}),e.jsxs("p",{children:["Em desenvolvimento (XAMPP), a diferença é imperceptível e a comodidade do ",e.jsx("code",{children:".htaccess"})," compensa."]}),e.jsx("h2",{children:"Backreferences ($1, %1)"}),e.jsx("p",{children:"Os parênteses no padrão capturam grupos. Use:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"$N"})," (1-9) — backreference do padrão da ",e.jsx("strong",{children:"RewriteRule"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"%N"})," (1-9) — backreference do padrão da ",e.jsx("strong",{children:"última RewriteCond"}),"."]})]}),e.jsx(a,{language:"apache",code:`# Captura o subdomínio e usa como pasta
RewriteCond %{HTTP_HOST} ^(.+)\\.minhaloja\\.local$
RewriteRule ^(.*)$ /clientes/%1/$1 [L]
#               ↑              ↑
#               grupo 1 da     grupo 1 da
#               RewriteRule    RewriteCond`}),e.jsxs(o,{type:"success",title:"Para depurar regras complexas",children:["Habilite o RewriteLog (Apache 2.4 usa LogLevel) no httpd.conf:"," ",e.jsx("code",{children:"LogLevel alert rewrite:trace3"}),". As reescritas aparecem em ",e.jsx("code",{children:"apache/logs/error.log"}),". Lembre-se de desativar depois — gera muito log."]}),e.jsx("h2",{children:"Ferramentas online úteis"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("a",{href:"https://htaccess.madewithlove.com/",target:"_blank",rel:"noreferrer",children:"htaccess.madewithlove.com"})," ","— testa regras de rewrite contra URLs de exemplo."]}),e.jsxs("li",{children:[e.jsx("a",{href:"https://regex101.com/",target:"_blank",rel:"noreferrer",children:"regex101.com"})," ",'— debug visual das regex (use o flavor "PCRE").']})]})]})}export{l as default};
