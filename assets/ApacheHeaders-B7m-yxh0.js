import{j as e}from"./index-BreI0dyu.js";import{P as r,A as a}from"./AlertBox-C_bJKc46.js";import{C as s}from"./CodeBlock-D0rWxPIU.js";import{P as o}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function n(){return e.jsxs(r,{title:"Headers, CORS e segurança HTTP",subtitle:"mod_headers, mod_expires, CSP, HSTS, X-Frame-Options e a parte teimosa do CORS — tudo configurado direto no Apache, sem tocar no PHP.",difficulty:"intermediario",timeToRead:"12 min",children:[e.jsxs(a,{type:"info",title:"Por que aqui e não no PHP?",children:["Cabeçalhos no Apache são aplicados a ",e.jsx("strong",{children:"todos"})," os arquivos (HTML, CSS, JS, imagens, fontes) — não só PHP. Política de segurança séria precisa estar nesse nível."]}),e.jsx("h2",{children:"mod_headers"}),e.jsx(s,{title:"httpd.conf",language:"apache",code:"LoadModule headers_module modules/mod_headers.so"}),e.jsx(o,{title:"Diretivas principais",params:[{flag:"Header set X Y",desc:"Define ou substitui o cabeçalho X com valor Y."},{flag:"Header always set",desc:"Aplica até em respostas de erro (404, 500). Use sempre 'always set'."},{flag:"Header append X Y",desc:"Adiciona ao valor existente."},{flag:"Header unset X",desc:"Remove um cabeçalho."},{flag:"Header edit X regex novo",desc:"Edita por regex."}]}),e.jsx("h2",{children:"Pacote de segurança recomendado"}),e.jsx(s,{title:".htaccess ou httpd.conf",language:"apache",code:`<IfModule mod_headers.c>
    # Negue ser embutido em iframes (anti clickjacking)
    Header always set X-Frame-Options "SAMEORIGIN"

    # MIME-sniffing off
    Header always set X-Content-Type-Options "nosniff"

    # Política de Referer (privacidade do usuário)
    Header always set Referrer-Policy "strict-origin-when-cross-origin"

    # Permissões de APIs do navegador (geolocation, camera, etc.)
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"

    # HSTS — só ative depois que HTTPS estiver 100% funcional
    # Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

    # Remove identificação do servidor (defesa em profundidade)
    Header unset X-Powered-By
    Header unset Server
</IfModule>`}),e.jsx(s,{title:"No httpd.conf (não dá no .htaccess)",language:"apache",code:`ServerTokens Prod
ServerSignature Off
TraceEnable Off`}),e.jsx("h2",{children:"Content Security Policy (CSP)"}),e.jsx("p",{children:"Define quais origens podem carregar scripts/estilos/imagens. Reduz risco de XSS quase a zero quando bem configurado."}),e.jsx(s,{title:"CSP básica",language:"apache",code:`Header always set Content-Security-Policy "
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.meusite.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
"`}),e.jsxs("p",{children:["Comece em modo ",e.jsx("strong",{children:"report-only"})," para descobrir o que quebraria sem aplicar:"]}),e.jsx(s,{language:"apache",code:`Header always set Content-Security-Policy-Report-Only "
    default-src 'self';
    report-uri /csp-report.php
"`}),e.jsx(o,{title:"Diretivas de CSP",params:[{flag:"default-src",desc:"Fallback para tudo que não tiver diretiva específica."},{flag:"script-src",desc:"Origens de JavaScript."},{flag:"style-src",desc:"Origens de CSS."},{flag:"img-src",desc:"Imagens (data: permite base64)."},{flag:"connect-src",desc:"fetch/XHR/WebSocket."},{flag:"frame-ancestors",desc:"Quem pode embutir (substitui X-Frame-Options)."},{flag:"'self'",desc:"Mesma origem do documento."},{flag:"'unsafe-inline'",desc:"Permite estilo/script inline (evite — exige nonce ou hash)."},{flag:"'nonce-XYZ'",desc:"Permite inline com nonce gerado pelo backend."}]}),e.jsx("h2",{children:"CORS — Cross-Origin Resource Sharing"}),e.jsxs("p",{children:["Quando ",e.jsx("code",{children:"front.local"})," chama ",e.jsx("code",{children:"api.local"}),", o navegador exige que a API autorize via cabeçalhos:"]}),e.jsx(s,{title:"CORS permissivo (dev)",language:"apache",code:`<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET,POST,PUT,DELETE,OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type,Authorization,X-Requested-With"
    Header always set Access-Control-Max-Age "86400"
</IfModule>

# Responder ao preflight OPTIONS sem chamar o PHP
RewriteEngine On
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]`}),e.jsx(s,{title:"CORS restrito (produção)",language:"apache",code:`SetEnvIf Origin "^https://(meusite\\.com|admin\\.meusite\\.com)$" CORS_ALLOW=$0

Header always set Access-Control-Allow-Origin "%{CORS_ALLOW}e" env=CORS_ALLOW
Header always set Access-Control-Allow-Credentials "true" env=CORS_ALLOW
Header always set Vary "Origin"`}),e.jsxs(a,{type:"warning",title:"Allow-Origin: * + Credentials = inválido",children:["Se a API exige cookies/Authorization, você ",e.jsx("strong",{children:"não pode"})," usar"," ",e.jsx("code",{children:"Access-Control-Allow-Origin: *"}),". Tem que devolver o origin exato."]}),e.jsx("h2",{children:"Cache (mod_expires)"}),e.jsx(s,{title:"httpd.conf",language:"apache",code:`LoadModule expires_module modules/mod_expires.so

<IfModule mod_expires.c>
    ExpiresActive On

    # Padrão para tudo
    ExpiresDefault                          "access plus 1 hour"

    # Imagens, fontes, vídeos — semanas/anos
    ExpiresByType image/jpeg                "access plus 30 days"
    ExpiresByType image/png                 "access plus 30 days"
    ExpiresByType image/svg+xml             "access plus 30 days"
    ExpiresByType image/webp                "access plus 30 days"
    ExpiresByType font/woff2                "access plus 1 year"

    # Assets versionados (com hash no nome)
    ExpiresByType application/javascript    "access plus 1 year"
    ExpiresByType text/css                  "access plus 1 year"

    # HTML — sempre revalidar
    ExpiresByType text/html                 "access plus 0 seconds"
</IfModule>

# Cache-Control mais explícito
<FilesMatch "\\.(jpg|jpeg|png|gif|webp|woff2|css|js)$">
    Header set Cache-Control "public, max-age=2592000, immutable"
</FilesMatch>
<FilesMatch "\\.html$">
    Header set Cache-Control "no-cache, must-revalidate"
</FilesMatch>`}),e.jsx("h2",{children:"Compressão (mod_deflate)"}),e.jsx(s,{language:"apache",code:`LoadModule deflate_module modules/mod_deflate.so

<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE \\
        text/html text/plain text/xml text/css \\
        application/javascript application/json application/xml \\
        image/svg+xml font/ttf font/otf
</IfModule>`}),e.jsxs("p",{children:["Para Brotli (compressão melhor): habilite ",e.jsx("code",{children:"mod_brotli"})," e use"," ",e.jsx("code",{children:"AddOutputFilterByType BROTLI_COMPRESS ..."}),"."]}),e.jsx("h2",{children:"HSTS — só faça com HTTPS estável"}),e.jsx(s,{language:"apache",code:`# Diga ao navegador: SEMPRE HTTPS por 1 ano (subdomínios incluídos)
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"`}),e.jsxs(a,{type:"danger",title:"HSTS é tatuagem",children:["Uma vez que o navegador receber HSTS, ele recusa HTTP para esse domínio até o"," ",e.jsx("code",{children:"max-age"})," expirar. Se HTTPS quebrar, usuários ficam sem acesso. Comece com"," ",e.jsx("code",{children:"max-age=300"}),", valide tudo, depois suba para 1 ano."]}),e.jsx("h2",{children:"Testando"}),e.jsx(s,{language:"bash",code:`# Ver TODOS os headers da resposta
curl -I https://meusite.local/

# Especificamente os de segurança
curl -I https://meusite.local/ | grep -E '^(Strict|X-|Content-Security|Referrer|Permissions)'

# Online (em produção)
# https://securityheaders.com
# https://observatory.mozilla.org
# https://www.ssllabs.com/ssltest/`}),e.jsx("h2",{children:"Armadilhas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Esquecer ",e.jsx("strong",{children:"always"})," em ",e.jsx("code",{children:"Header always set"})," — em respostas 4xx o cabeçalho some."]}),e.jsxs("li",{children:["CSP quebrar tudo de uma vez — sempre comece com"," ",e.jsx("code",{children:"Content-Security-Policy-Report-Only"}),"."]}),e.jsxs("li",{children:["CORS só no ",e.jsx("code",{children:".htaccess"}),": requisições ",e.jsx("code",{children:"OPTIONS"})," em rotas inexistentes geram 404 (sem CORS). Resolva no ",e.jsx("code",{children:"RewriteRule"})," acima ou no PHP/framework."]}),e.jsxs("li",{children:["Cache muito agressivo em HTML faz deploy não chegar para usuários — use"," ",e.jsx("code",{children:"no-cache"})," em ",e.jsx("code",{children:".html"}),"."]})]})]})}export{n as default};
