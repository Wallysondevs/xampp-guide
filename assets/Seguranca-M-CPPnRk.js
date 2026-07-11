import{j as e}from"./index-BreI0dyu.js";import{P as r,A as s}from"./AlertBox-C_bJKc46.js";import{C as a}from"./CodeBlock-D0rWxPIU.js";import{P as o}from"./ParamsTable-DyRs6_CQ.js";import{P as i}from"./PracticeBox-BV05Hsfh.js";import"./circle-alert-_acnmM4q.js";function h(){return e.jsxs(r,{title:"Segurança no XAMPP",subtitle:"O XAMPP foi feito para desenvolvimento. Algumas configurações vêm relaxadas — aqui mostramos como apertar quando precisar, do MySQL ao Apache, dos cabeçalhos HTTP ao firewall do sistema.",difficulty:"intermediario",timeToRead:"14 min",children:[e.jsxs(s,{type:"info",title:"Pré-requisitos",children:["Confortável editando ",e.jsx("a",{href:"#/htaccess",children:".htaccess"}),","," ",e.jsx("a",{href:"#/apache-config",children:"httpd.conf"})," e ",e.jsx("a",{href:"#/php-ini",children:"php.ini"}),". Saber reiniciar o Apache e o MySQL pelo painel."]}),e.jsx("h2",{children:"Glossário rápido"}),e.jsxs("p",{children:[e.jsx("strong",{children:"CVE"})," (Common Vulnerabilities and Exposures) — identificador padronizado de vulnerabilidades públicas. Cada CVE descreve a falha, versões afetadas e severidade (CVSS)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"OWASP Top 10"})," — lista das 10 categorias mais comuns de falha em aplicações web (injection, XSS, autenticação quebrada etc.). Referência mundial para revisão de segurança."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"CSP"})," (Content Security Policy) — header HTTP que controla quais origens de script/imagem/fonte o navegador pode carregar. Defesa principal contra XSS."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"HSTS"}),' (HTTP Strict Transport Security) — header que diz ao navegador "só me acesse via HTTPS pelos próximos N segundos".']}),e.jsxs("p",{children:[e.jsx("strong",{children:"SQL Injection"})," — quando dados do usuário viram parte do SQL sem escape. Mitigação: prepared statements (PDO ou mysqli com bind)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"XSS"})," (Cross-Site Scripting) — quando dados do usuário viram parte do HTML sem escape. Mitigação:"," ",e.jsx("code",{children:"htmlspecialchars()"}),", CSP, frameworks que escapam por padrão (Blade, Twig)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"CSRF"})," (Cross-Site Request Forgery) — outro site força o navegador a fazer uma ação na sua app (ex: enquanto você está logado). Mitigação: tokens CSRF e cookies ",e.jsx("code",{children:"SameSite"}),"."]}),e.jsxs(s,{type:"danger",title:"Regra de ouro",children:["XAMPP ",e.jsx("strong",{children:"não é servidor de produção"}),". Mesmo apertando tudo, há ferramentas mais adequadas para hospedar projetos reais (Apache/Nginx em VPS com Certbot, ou hospedagem gerenciada). Use este capítulo se você precisa expor temporariamente o XAMPP na rede local (apresentação, demo, hackathon, intranet) ou se quer reforçar práticas de boas senhas e bons cabeçalhos mesmo localmente."]}),e.jsx("h2",{children:"1. Defina senha do root no MySQL"}),e.jsxs("p",{children:["Veja ",e.jsx("a",{href:"#/mysql-senha-root",children:"Senha do root"}),". É a primeira coisa que invasor automatizado tenta — e o XAMPP entrega vazia. Bots varrem a internet procurando justamente MySQL/MariaDB sem senha."]}),e.jsxs("p",{children:["Além de definir, não use ",e.jsx("code",{children:"root"})," em aplicações: crie um usuário dedicado por banco com"," ",e.jsx("code",{children:"GRANT SELECT, INSERT, UPDATE, DELETE"})," só nas tabelas que precisa."]}),e.jsx("h2",{children:"2. Restrinja o phpMyAdmin"}),e.jsxs("p",{children:["Edite ",e.jsx("code",{children:"apache/conf/extra/httpd-xampp.conf"})," e procure pelo bloco ",e.jsx("code",{children:'<Directory "C:/xampp/phpMyAdmin">'}),":"]}),e.jsx(a,{language:"apache",code:`<Directory "C:/xampp/phpMyAdmin">
    AllowOverride AuthConfig
    Require local        # local-only por padrão na maioria das versões

    # Para acessar de outra máquina na rede local:
    # Require ip 192.168.1
    # Require ip 10.0.0
</Directory>`}),e.jsx("p",{children:"Para uma camada extra, ponha o phpMyAdmin atrás de senha HTTP Basic:"}),e.jsx(a,{language:"bash",code:`# Gere o arquivo .htpasswd (no shell do XAMPP)
htpasswd -c C:/xampp/security/.htpasswd admin

# Edite httpd-xampp.conf:
<Directory "C:/xampp/phpMyAdmin">
    AuthType Basic
    AuthName "phpMyAdmin Restrito"
    AuthUserFile "C:/xampp/security/.htpasswd"
    Require valid-user
</Directory>`}),e.jsx("h2",{children:'3. Use o "Security check" do XAMPP'}),e.jsx("p",{children:"O dashboard tem uma página automática que verifica vulnerabilidades:"}),e.jsx(a,{language:"text",code:"http://localhost/security/"}),e.jsxs("p",{children:["Ela aponta o que está aberto. Tem um link"," ",e.jsx("code",{children:"/security/xamppsecurity.php"})," que, se você acessar, faz um wizard pra:"]}),e.jsxs("ul",{children:[e.jsx("li",{children:"Definir senha do MySQL root"}),e.jsx("li",{children:"Definir senha do diretório XAMPP (htpasswd)"}),e.jsx("li",{children:"Definir senha de FileZilla e Mercury (se instalados)"})]}),e.jsx("h2",{children:"4. Limite quem acessa o XAMPP pela rede"}),e.jsxs("p",{children:["Por padrão o Apache do XAMPP escuta em ",e.jsx("code",{children:"0.0.0.0:80"}),", ou seja, em todas as interfaces. Se sua máquina está em uma rede WiFi pública (cafeteria, aeroporto, coworking), qualquer um pode tentar acessar ",e.jsx("code",{children:"http://SEU-IP/"})," e ver seus projetos."]}),e.jsxs("p",{children:["Para limitar a apenas localhost, edite"," ",e.jsx("code",{children:"apache/conf/httpd.conf"}),":"]}),e.jsx(a,{language:"apache",code:`# Antes:
Listen 80

# Depois (só escuta localmente):
Listen 127.0.0.1:80
Listen [::1]:80`}),e.jsxs("p",{children:["Faça o mesmo no MySQL — em ",e.jsx("code",{children:"my.ini"}),", garanta:"]}),e.jsx(a,{language:"ini",code:`[mysqld]
bind-address = 127.0.0.1     # MySQL só aceita conexão local`}),e.jsx("h2",{children:"5. Não exponha o phpinfo()"}),e.jsxs("p",{children:["É um clássico: você cria ",e.jsx("code",{children:"htdocs/info.php"})," com"," ",e.jsx("code",{children:"phpinfo()"})," pra debugar e esquece de apagar. Em produção isso é ",e.jsx("strong",{children:"uma mina de ouro"})," para invasores: revela versão exata do PHP (e portanto CVEs aplicáveis), módulos, caminho de arquivos, variáveis de ambiente (incluindo segredos), e configurações inteiras."]}),e.jsx("p",{children:"Sempre apague depois de usar — ou bloqueie:"}),e.jsx(a,{title:".htaccess",language:"apache",code:`<Files "info.php">
    Require all denied
</Files>

# Ou bloqueie qualquer arquivo que comece com phpinfo
<FilesMatch "^phpinfo">
    Require all denied
</FilesMatch>`}),e.jsx("h2",{children:"6. Esconda a versão do Apache e PHP"}),e.jsxs("p",{children:["Em ",e.jsx("code",{children:"httpd.conf"}),", adicione/edite:"]}),e.jsx(a,{language:"apache",code:`ServerTokens Prod
ServerSignature Off`}),e.jsxs("p",{children:["Em ",e.jsx("code",{children:"php.ini"}),":"]}),e.jsx(a,{language:"ini",code:"expose_php = Off"}),e.jsxs("p",{children:["Antes: o navegador via"," ",e.jsx("code",{children:"Server: Apache/2.4.58 (Win64) PHP/8.2.12"}),". Depois: só"," ",e.jsx("code",{children:"Server: Apache"}),". Não impede ataque, mas dificulta reconhecimento automatizado."]}),e.jsx("h2",{children:"7. Cabeçalhos de segurança"}),e.jsxs("p",{children:["Coloque no ",e.jsx("code",{children:".htaccess"})," ou no ",e.jsx("code",{children:"httpd.conf"}),":"]}),e.jsx(a,{language:"apache",code:`<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
    Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"

    # HSTS — só ative quando estiver 100% certo do HTTPS (é difícil reverter)
    # Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains" env=HTTPS

    # CSP é poderoso e quebra MUITA coisa se não for ajustado — comece restritivo
    # e libere fontes/scripts conforme o navegador reclama
    # Header set Content-Security-Policy "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'"

    # Cross-Origin Opener Policy (isolamento entre janelas)
    Header set Cross-Origin-Opener-Policy "same-origin"
</IfModule>`}),e.jsx(o,{title:"O que cada cabeçalho previne",params:[{flag:"X-Content-Type-Options: nosniff",desc:"Impede que o navegador 'adivinhe' o tipo MIME (evita upload de .jpg que vira .html executável)."},{flag:"X-Frame-Options: SAMEORIGIN",desc:"Impede outros sites de embedar o seu em <iframe> — defesa contra clickjacking."},{flag:"Referrer-Policy",desc:"Controla quanta info do referrer vaza para outros sites em links externos."},{flag:"Permissions-Policy",desc:"Define quais APIs do navegador (câmera, mic, geo) podem ser usadas."},{flag:"Strict-Transport-Security",desc:"Força HTTPS por max-age segundos — depois de visitada uma vez, navegador não aceita HTTP mais."},{flag:"Content-Security-Policy",desc:"Whitelist de origens de scripts/estilos/imagens. Defesa principal contra XSS."}]}),e.jsxs(s,{type:"info",title:"Teste seus headers",children:["Use ",e.jsx("a",{href:"https://securityheaders.com",target:"_blank",rel:"noreferrer",children:"securityheaders.com"})," ou ",e.jsx("a",{href:"https://observatory.mozilla.org",target:"_blank",rel:"noreferrer",children:"Mozilla Observatory"})," — colocam nota A+/F e explicam o que falta."]}),e.jsx("h2",{children:"8. Bloqueie acesso a arquivos sensíveis"}),e.jsx(a,{title:".htaccess da raiz",language:"apache",code:`<FilesMatch "(^\\.|composer\\.(json|lock)|package\\.json|README|\\.sql$|\\.env|\\.git|\\.htaccess$|\\.htpasswd$)">
    Require all denied
</FilesMatch>

# Negar listing de pastas
Options -Indexes

# Negar pasta .git inteira
RedirectMatch 404 /\\.git`}),e.jsxs("p",{children:["Sem isso, alguém pode acessar ",e.jsx("code",{children:"https://seusite.com/.env"})," ","e baixar suas senhas em texto puro."]}),e.jsx("h2",{children:"9. PHP — endurecer o php.ini"}),e.jsx(a,{language:"ini",code:`; Em produção: nunca mostre erros na tela
display_errors = Off
display_startup_errors = Off
log_errors = On
error_log = "C:/xampp/php/logs/php_error_log"

; Esconder versão
expose_php = Off

; Desativar funções perigosas (se a app não precisar)
disable_functions = exec,passthru,shell_exec,system,proc_open,popen,curl_multi_exec,parse_ini_file,show_source

; Cookies de sessão seguros
session.cookie_secure = 1     ; só envia em HTTPS
session.cookie_httponly = 1   ; JS não acessa
session.cookie_samesite = "Lax"
session.use_strict_mode = 1
session.use_only_cookies = 1

; Limite de upload (evita DoS por upload gigante)
upload_max_filesize = 10M
post_max_size = 12M
max_input_time = 30
max_execution_time = 30
memory_limit = 128M

; Bloquear inclusão de URL remota (RFI)
allow_url_fopen = Off
allow_url_include = Off

; Limitar onde o PHP pode ler arquivos
open_basedir = "C:/xampp/htdocs/seuapp"`}),e.jsxs(s,{type:"warning",title:"disable_functions com cuidado",children:[e.jsx("code",{children:"shell_exec"}),", ",e.jsx("code",{children:"exec"}),", ",e.jsx("code",{children:"system"}),","," ",e.jsx("code",{children:"proc_open"}),", ",e.jsx("code",{children:"popen"})," e ",e.jsx("code",{children:"passthru"})," ","são úteis em apps legítimos (Composer, ImageMagick wrappers, deploy scripts). Desabilite só se sua app realmente não usa — ou permite só em rotas específicas."]}),e.jsx("h2",{children:"10. Defesa contra brute-force e bots"}),e.jsxs("p",{children:["Telas de login são alvo constante de tentativas automáticas. Em produção, instale ",e.jsx("strong",{children:"fail2ban"})," para banir IPs que falham N vezes em M minutos. Em XAMPP local, ao menos:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Implemente ",e.jsx("strong",{children:"rate limiting"})," na app (Laravel:"," ",e.jsx("code",{children:"throttle"})," middleware)."]}),e.jsxs("li",{children:["Use ",e.jsx("strong",{children:"CAPTCHA"})," em formulários públicos (hCaptcha, reCAPTCHA, Cloudflare Turnstile)."]}),e.jsxs("li",{children:["Force ",e.jsx("strong",{children:"senhas fortes"})," e MFA quando possível."]}),e.jsxs("li",{children:["Logue tentativas fracassadas para análise (",e.jsx("code",{children:"storage/logs/laravel.log"}),")."]})]}),e.jsx("h2",{children:"11. Atualize o XAMPP (e o stack)"}),e.jsxs("p",{children:["Versões antigas têm CVEs conhecidas (PHP 5.x, Apache 2.2, MariaDB antigo). Mesmo em desenvolvimento, mantenha-se em uma versão recente e suportada — em"," ",e.jsx("a",{href:"https://www.apachefriends.org/download.html",target:"_blank",rel:"noreferrer",children:"apachefriends.org"})," ","sempre tem a lista do que ainda recebe atualização. Veja também"," ",e.jsx("a",{href:"https://www.php.net/supported-versions.php",target:"_blank",rel:"noreferrer",children:"php.net/supported-versions"})," para o calendário de fim de suporte (EOL) de cada versão."]}),e.jsx(a,{language:"bash",code:`# Veja sua versão hoje
php -v
C:/xampp/apache/bin/httpd.exe -v
C:/xampp/mysql/bin/mysql --version`}),e.jsx("h2",{children:"12. Auditoria de dependências"}),e.jsx("p",{children:"Pacotes do Composer e do npm também têm vulnerabilidades. Rode regularmente:"}),e.jsx(a,{language:"bash",code:`# Composer
composer audit            # PHP 8+
composer outdated --direct

# npm
npm audit
npm audit fix
npm outdated`}),e.jsx(i,{title:"Hardening básico do XAMPP",goal:"Aplicar as defesas mínimas que cobrem 90% dos cenários de uso local com risco.",steps:["Defina senha forte para o root do MySQL","Crie um usuário dedicado por aplicação (sem usar root)","Confirme Listen 127.0.0.1:80 no httpd.conf","Confirme bind-address=127.0.0.1 no my.ini","Adicione expose_php = Off, ServerTokens Prod e ServerSignature Off","Crie .htaccess na raiz bloqueando .env, .git, .sql, composer.*","Configure cabeçalhos X-Content-Type-Options, X-Frame-Options, Referrer-Policy","Acesse http://localhost/security/ e siga o wizard","Atualize o XAMPP para versão atual de PHP e MariaDB"],verify:"securityheaders.com dá nota mínima B+ no seu vhost; phpMyAdmin recusa acesso de outra máquina; nenhum arquivo sensível responde 200."}),e.jsx("h2",{children:"Em código: as 5 vulnerabilidades clássicas"}),e.jsx(o,{title:"OWASP Top 10 que aparece em PHP do dia a dia",params:[{flag:"SQL Injection",desc:"Sempre use prepared statements: $pdo->prepare('SELECT * FROM users WHERE id = ?')->execute([$id]). Nunca concatene $_GET no SQL."},{flag:"XSS (Cross-Site Scripting)",desc:"Sempre escape ao imprimir HTML: echo htmlspecialchars($var, ENT_QUOTES, 'UTF-8'). Em Laravel/Twig, {{ $var }} já escapa."},{flag:"CSRF",desc:"Use tokens em formulários (Laravel: @csrf). Defina cookies SameSite=Lax ou Strict."},{flag:"Inclusão arbitrária (LFI/RFI)",desc:`Nunca faça include $_GET['page']. Use whitelist: $paginas = ['home','sobre']; if (in_array($p, $paginas, true)) include "$p.php";`},{flag:"Upload mal validado",desc:"Verifique MIME real (finfo), extensão pela whitelist, salve em pasta fora de htdocs ou bloqueie execução de PHP nessa pasta."},{flag:"Sessões fracas",desc:"session_regenerate_id(true) após login, cookies HttpOnly + Secure + SameSite, timeout razoável."},{flag:"Senhas em texto puro",desc:"password_hash($senha, PASSWORD_DEFAULT) na criação. password_verify() na conferência. Nunca MD5/SHA1."}]}),e.jsxs(s,{type:"success",title:"Resumindo: o que fazer agora",children:["Senha de root no MySQL, phpMyAdmin restrito ao localhost,"," ",e.jsx("code",{children:"display_errors = Off"})," ao menos quando expor algo, sem"," ",e.jsx("code",{children:"phpinfo.php"})," esquecido na raiz, ",e.jsx("code",{children:".htaccess"})," ","bloqueando arquivos sensíveis e cabeçalhos básicos no Apache. Para dia a dia local, isso é mais que suficiente. Para produção real, leia ",e.jsx("a",{href:"#/migrar-producao",children:"Migrando para produção"}),"."]})]})}export{h as default};
