import{j as e}from"./index-BreI0dyu.js";import{P as i,A as a}from"./AlertBox-C_bJKc46.js";import{C as r}from"./CodeBlock-D0rWxPIU.js";import{P as o}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function l(){return e.jsxs(i,{title:"mod_rewrite — URLs amigáveis e redirecionamentos",subtitle:"O motor de reescrita de URL do Apache. Frente a frente com RewriteRule, RewriteCond, flags e armadilhas mais comuns — com exemplos prontos para WordPress, Laravel, SPA e HTTPS forçado.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsxs(a,{type:"info",title:"Pré-requisitos",children:["Apache rodando, módulo ",e.jsx("code",{children:"rewrite"})," ativo (no XAMPP já vem por padrão) e ",e.jsx("code",{children:"AllowOverride All"})," no diretório onde o ",e.jsx("code",{children:".htaccess"})," vai operar — caso contrário, suas regras são silenciosamente ignoradas."]}),e.jsx("h2",{children:"Conceito"}),e.jsxs("p",{children:[e.jsx("strong",{children:"mod_rewrite"})," intercepta cada requisição e, antes de servir o arquivo, aplica regras (regex) que podem reescrever a URL ",e.jsx("em",{children:"internamente"})," (o cliente não vê) ou",e.jsx("em",{children:"externamente"})," (resposta 301/302). É a base de URLs amigáveis (",e.jsx("code",{children:"/produto/123"})," ","em vez de ",e.jsx("code",{children:"/index.php?id=123"}),"), redirecionamentos canônicos, força de HTTPS, bloqueio por User-Agent etc."]}),e.jsx("h2",{children:"Conferindo se o módulo está ativo"}),e.jsx(r,{title:"httpd.conf — XAMPP",language:"apache",code:`# Em C:/xampp/apache/conf/httpd.conf — esta linha NÃO pode estar comentada:
LoadModule rewrite_module modules/mod_rewrite.so

# E onde quer que use .htaccess:
<Directory "C:/xampp/htdocs">
    AllowOverride All
    Require all granted
</Directory>`}),e.jsxs("p",{children:["Após qualquer alteração no ",e.jsx("code",{children:"httpd.conf"}),", reinicie o Apache pelo painel. Mudanças em ",e.jsx("code",{children:".htaccess"})," são lidas a cada request e ",e.jsx("strong",{children:"não"})," ","precisam de restart."]}),e.jsx("h2",{children:"Anatomia de uma regra"}),e.jsx(r,{title:".htaccess básico",language:"apache",code:`RewriteEngine On
RewriteBase /

# RewriteCond  -> precondições (múltiplas viram AND)
# RewriteRule  -> padrão a casar  destino  [flags]

RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]`}),e.jsx("h2",{children:"Variáveis úteis"}),e.jsx(o,{title:"Variáveis de servidor mais usadas em RewriteCond",params:[{flag:"%{HTTPS}",desc:"'on' ou 'off'. Use para forçar HTTPS."},{flag:"%{HTTP_HOST}",desc:"Domínio da requisição (ex: meusite.local)."},{flag:"%{REQUEST_URI}",desc:"Caminho da URL pedido (sem o domínio)."},{flag:"%{QUERY_STRING}",desc:"Tudo que vier depois do '?'. Use [QSA] para preservar."},{flag:"%{HTTP_USER_AGENT}",desc:"Identificação do navegador/bot."},{flag:"%{REMOTE_ADDR}",desc:"IP do cliente."},{flag:"%{REQUEST_METHOD}",desc:"GET, POST, PUT, DELETE..."},{flag:"%{REQUEST_FILENAME}",desc:"Caminho absoluto no disco. Combinado com -f / -d testa existência."}]}),e.jsx("h2",{children:"Flags essenciais"}),e.jsx(o,{title:"Flags entre colchetes em RewriteRule",params:[{flag:"[L]",desc:"Last — pare de processar regras (continua só se houver outro request interno)."},{flag:"[R=301]",desc:"Redirect permanente. Use 302 para temporário."},{flag:"[QSA]",desc:"Query String Append — concatena ?foo=bar em vez de descartar."},{flag:"[NC]",desc:"No Case — case-insensitive na regex."},{flag:"[F]",desc:"Forbidden — devolve 403 sem reescrever."},{flag:"[G]",desc:"Gone — devolve 410."},{flag:"[E=VAR:val]",desc:"Define variável de ambiente para outras regras / PHP."},{flag:"[END]",desc:"Como [L] mas também impede que .htaccess de subpasta processe de novo."}]}),e.jsx("h2",{children:"Receitas prontas"}),e.jsx("h3",{children:"1. Forçar HTTPS"}),e.jsx(r,{language:"apache",code:`RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]`}),e.jsx("h3",{children:"2. Forçar www (ou remover www)"}),e.jsx(r,{language:"apache",code:`# Sem www -> com www
RewriteCond %{HTTP_HOST} ^meusite\\.local$ [NC]
RewriteRule ^ http://www.meusite.local%{REQUEST_URI} [R=301,L]

# Com www -> sem www
RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]
RewriteRule ^ http://%1%{REQUEST_URI} [R=301,L]`}),e.jsx("h3",{children:"3. WordPress padrão"}),e.jsx(r,{language:"apache",code:`# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase /
RewriteRule ^index\\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress`}),e.jsx("h3",{children:"4. Laravel (servir tudo via public/index.php)"}),e.jsx(r,{language:"apache",code:`<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>
    RewriteEngine On
    # Cabeçalhos Authorization (JWT/OAuth)
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
    # Sem barra final
    RewriteRule ^(.*)/$ /$1 [L,R=301]
    # Tudo o que não for arquivo/pasta cai no front controller
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>`}),e.jsx("h3",{children:"5. SPA (React/Vue/Angular) servida pelo XAMPP"}),e.jsx(r,{language:"apache",code:`# Caia no index.html para o router do front cuidar das rotas
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>`}),e.jsx("h3",{children:"6. URL bonita para PHP antigo"}),e.jsx(r,{language:"apache",code:`# /produto/42  ->  /produto.php?id=42
RewriteEngine On
RewriteRule ^produto/([0-9]+)/?$  produto.php?id=$1 [L,QSA]
RewriteRule ^categoria/([a-z0-9-]+)/?$  categoria.php?slug=$1 [L,QSA]`}),e.jsx("h3",{children:"7. Bloquear bots indesejados"}),e.jsx(r,{language:"apache",code:`RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} (ahrefs|semrush|mj12bot|petalbot) [NC]
RewriteRule ^ - [F,L]`}),e.jsx("h3",{children:"8. Manter SOMENTE arquivos reais (.html, .css, .js, ...)"}),e.jsx(r,{language:"apache",code:`RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ erro404.php [L]`}),e.jsx("h2",{children:"Depurando regras"}),e.jsx("p",{children:'Não confie só no "deve estar funcionando". Ative o log do mod_rewrite:'}),e.jsx(r,{title:"httpd.conf",language:"apache",code:`LogLevel alert rewrite:trace3
ErrorLog "logs/error.log"`}),e.jsxs("p",{children:["Faça uma requisição, abra ",e.jsx("code",{children:"C:/xampp/apache/logs/error.log"})," e siga linha por linha como o motor casou (ou não) cada regra. Em produção,"," ",e.jsx("strong",{children:"desative o trace"})," — gera logs enormes."]}),e.jsxs(a,{type:"warning",title:"Loop infinito de redirect",children:["Se a regra reescreve para uma URL que cai na própria regra, o navegador entra em loop e o Apache devolve ",e.jsx("em",{children:'"too many redirects"'}),". Sempre use uma ",e.jsx("code",{children:"RewriteCond"})," ","que ",e.jsx("strong",{children:"impeça o casamento na segunda passada"})," (ex.:"," ",e.jsxs("code",{children:["%","{HTTPS} off"]})," ao forçar HTTPS)."]}),e.jsx("h2",{children:"Armadilhas comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"AllowOverride None"})," no ",e.jsx("code",{children:"httpd.conf"})," — o ",e.jsx("code",{children:".htaccess"})," ","é simplesmente ignorado e nada do que você escreve funciona."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Cache do navegador"})," em redirect 301 — o navegador guarda a resposta para sempre. Teste em janela anônima ou com ",e.jsx("kbd",{children:"Ctrl+Shift+Del"}),"."]}),e.jsxs("li",{children:["Regex ",e.jsx("strong",{children:"guloso demais"}),": ",e.jsx("code",{children:"(.*)"})," casa string vazia também. Prefira ",e.jsx("code",{children:"([a-z0-9-]+)"})," com classes explícitas."]}),e.jsxs("li",{children:["Esquecer o ",e.jsx("code",{children:"[L]"})," faz a regra continuar processando e às vezes a próxima desfaz a anterior."]})]})]})}export{l as default};
