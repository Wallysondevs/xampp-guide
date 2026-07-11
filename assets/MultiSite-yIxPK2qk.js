import{j as o}from"./index-BreI0dyu.js";import{P as s,A as a}from"./AlertBox-C_bJKc46.js";import{C as e}from"./CodeBlock-D0rWxPIU.js";import{P as l}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function n(){return o.jsxs(s,{title:"Hospedando vários sites no mesmo XAMPP",subtitle:"Múltiplos domínios locais, cada um com PHP, MariaDB e logs próprios. Como organizar pastas, hosts e VirtualHosts sem misturar nada.",difficulty:"intermediario",timeToRead:"11 min",children:[o.jsxs(a,{type:"info",title:"Pré-requisitos",children:["Já saber criar um VirtualHost (capítulo Virtual Hosts). Saber editar o arquivo"," ",o.jsx("code",{children:"hosts"})," do sistema. ",o.jsx("code",{children:"AllowOverride All"})," para os ",o.jsx("code",{children:".htaccess"})," ","funcionarem em cada site."]}),o.jsx("h2",{children:"Cenário"}),o.jsx("p",{children:"Quatro projetos no mesmo XAMPP, sem se atrapalharem:"}),o.jsx(e,{language:"text",code:`http://loja.local       → C:/xampp/htdocs/loja        (Laravel)
http://blog.local       → C:/xampp/htdocs/blog        (WordPress)
http://api.local        → C:/xampp/htdocs/api         (Slim)
http://admin.local      → C:/xampp/htdocs/admin/dist  (SPA React)`}),o.jsx("h2",{children:"1. Estrutura de pastas"}),o.jsx(e,{language:"text",code:`C:/xampp/htdocs/
├── loja/
│   ├── public/
│   │   └── index.php       ← DocumentRoot do vhost
│   ├── app/
│   ├── vendor/
│   └── .env
├── blog/                   ← WordPress (DocumentRoot = pasta inteira)
│   ├── wp-admin/
│   └── ...
├── api/
│   └── public/index.php
└── admin/
    └── dist/index.html     ← SPA já buildada`}),o.jsx("h2",{children:"2. Apontar domínios para localhost"}),o.jsx(e,{title:"C:/Windows/System32/drivers/etc/hosts  (abrir como admin)",language:"text",code:`# Esta linha sempre existe
127.0.0.1   localhost

# Adicione um por site (mesma linha pode listar vários)
127.0.0.1   loja.local
127.0.0.1   blog.local
127.0.0.1   api.local
127.0.0.1   admin.local`}),o.jsx(e,{title:"Linux/macOS — /etc/hosts",language:"bash",code:`sudo nano /etc/hosts
# adicione as mesmas linhas`}),o.jsxs("p",{children:["Após salvar, abra o navegador em ",o.jsx("code",{children:"http://loja.local"})," — ainda vai dar 404 (vhost não existe), mas o nome já resolve para 127.0.0.1."]}),o.jsx("h2",{children:"3. Habilitar VirtualHosts no Apache"}),o.jsx(e,{title:"C:/xampp/apache/conf/httpd.conf",language:"apache",code:`# Descomente esta linha (procure 'vhosts')
Include conf/extra/httpd-vhosts.conf

# Pra debug — exibe quais hosts estão ativos
NameVirtualHost *:80   # (apenas Apache 2.2; 2.4 ignora)`}),o.jsx("h2",{children:"4. Definir os VirtualHosts"}),o.jsx(e,{title:"C:/xampp/apache/conf/extra/httpd-vhosts.conf",language:"apache",code:`# Default — qualquer requisição que não bater em nenhum ServerName cai aqui
<VirtualHost *:80>
    ServerName  localhost
    DocumentRoot "C:/xampp/htdocs"
    <Directory "C:/xampp/htdocs">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

# === LOJA ===
<VirtualHost *:80>
    ServerName  loja.local
    ServerAlias www.loja.local
    DocumentRoot "C:/xampp/htdocs/loja/public"

    <Directory "C:/xampp/htdocs/loja/public">
        AllowOverride All
        Require all granted
        Options -Indexes +FollowSymLinks
    </Directory>

    ErrorLog  "logs/loja-error.log"
    CustomLog "logs/loja-access.log" combined

    php_admin_value memory_limit 512M
    php_admin_value upload_max_filesize 50M
</VirtualHost>

# === BLOG ===
<VirtualHost *:80>
    ServerName  blog.local
    DocumentRoot "C:/xampp/htdocs/blog"
    <Directory "C:/xampp/htdocs/blog">
        AllowOverride All
        Require all granted
    </Directory>
    ErrorLog  "logs/blog-error.log"
    CustomLog "logs/blog-access.log" combined
</VirtualHost>

# === API ===
<VirtualHost *:80>
    ServerName  api.local
    DocumentRoot "C:/xampp/htdocs/api/public"
    <Directory "C:/xampp/htdocs/api/public">
        AllowOverride All
        Require all granted
    </Directory>

    Header always set Access-Control-Allow-Origin  "*"
    Header always set Access-Control-Allow-Methods "GET,POST,PUT,DELETE,OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type,Authorization"

    ErrorLog  "logs/api-error.log"
    CustomLog "logs/api-access.log" combined
</VirtualHost>

# === ADMIN (SPA estática) ===
<VirtualHost *:80>
    ServerName  admin.local
    DocumentRoot "C:/xampp/htdocs/admin/dist"
    <Directory "C:/xampp/htdocs/admin/dist">
        AllowOverride All
        Require all granted

        # Fallback para SPA
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    ErrorLog  "logs/admin-error.log"
    CustomLog "logs/admin-access.log" combined
</VirtualHost>`}),o.jsxs("p",{children:["Reinicie o Apache. ",o.jsx("code",{children:"httpd -S"})," lista vhosts ativos para confirmar."]}),o.jsx("h2",{children:"5. Bancos de dados separados"}),o.jsx("p",{children:"Cada site, seu banco e seu usuário — limita estrago em caso de invasão."}),o.jsx(e,{language:"sql",code:`-- phpMyAdmin / SQL
CREATE DATABASE loja  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE blog  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE api   CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'app_loja'@'localhost' IDENTIFIED BY 'pwd_loja';
CREATE USER 'app_blog'@'localhost' IDENTIFIED BY 'pwd_blog';
CREATE USER 'app_api' @'localhost' IDENTIFIED BY 'pwd_api';

GRANT ALL PRIVILEGES ON loja.* TO 'app_loja'@'localhost';
GRANT ALL PRIVILEGES ON blog.* TO 'app_blog'@'localhost';
GRANT ALL PRIVILEGES ON api.*  TO 'app_api' @'localhost';
FLUSH PRIVILEGES;`}),o.jsx("h2",{children:"6. .env por site"}),o.jsx(e,{title:"loja/.env",language:"text",code:`APP_ENV=local
APP_URL=http://loja.local
DB_HOST=127.0.0.1
DB_DATABASE=loja
DB_USERNAME=app_loja
DB_PASSWORD=pwd_loja`}),o.jsxs("p",{children:["Repita para cada site. ",o.jsx("code",{children:".env"})," nunca vai pro Git — adicione a"," ",o.jsx("code",{children:".gitignore"}),"."]}),o.jsx("h2",{children:"7. HTTPS local para todos (opcional)"}),o.jsxs("p",{children:["Use ",o.jsx("code",{children:"mkcert"})," (",o.jsx("a",{children:"github.com/FiloSottile/mkcert"}),") para gerar certificados confiáveis pelo navegador:"]}),o.jsx(e,{language:"bash",code:`mkcert -install
mkcert loja.local blog.local api.local admin.local
# Gera 2 arquivos .pem`}),o.jsx(e,{title:"httpd-vhosts.conf — bloco SSL",language:"apache",code:`<VirtualHost *:443>
    ServerName loja.local
    DocumentRoot "C:/xampp/htdocs/loja/public"
    SSLEngine on
    SSLCertificateFile      "C:/xampp/apache/conf/cert/loja.local+3.pem"
    SSLCertificateKeyFile   "C:/xampp/apache/conf/cert/loja.local+3-key.pem"
    <Directory "C:/xampp/htdocs/loja/public">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>`}),o.jsx("h2",{children:"Confirmando que está tudo certo"}),o.jsx(e,{language:"bash",code:`# Lista vhosts vistos pelo Apache
C:/xampp/apache/bin/httpd.exe -S

# Saída esperada
# VirtualHost configuration:
# *:80   is a NameVirtualHost
#         default server localhost (...)
#         port 80 namevhost loja.local (...)
#         port 80 namevhost blog.local (...)
#         port 80 namevhost api.local  (...)`}),o.jsx("h2",{children:"Padrões para evitar dor"}),o.jsx(l,{title:"Convenções recomendadas",params:[{flag:"TLD .local / .test",desc:"Não use .com (pode resolver pra internet)."},{flag:"DocumentRoot = subpasta /public",desc:"Frameworks modernos (Laravel/Symfony) servem só /public — protege /vendor."},{flag:"Logs separados",desc:"loja-error.log, blog-error.log — debug sem confusão."},{flag:"Banco por app",desc:"loja, blog, api — usuário próprio com mínimo de privilégios."},{flag:".env por site",desc:"Variáveis de ambiente isoladas."},{flag:"PHP por vhost",desc:"php_admin_value memory_limit, upload_max_filesize ajustam por app."}]}),o.jsx("h2",{children:"Bonus: plugin que automatiza"}),o.jsxs("p",{children:["Se cansar de editar ",o.jsx("code",{children:"vhosts"})," + ",o.jsx("code",{children:"hosts"})," manualmente, use"," ",o.jsx("strong",{children:"XAMPP Virtual Host Manager"})," (extensão community) ou um script:"]}),o.jsx(e,{title:"add-vhost.bat",language:"text",code:`@echo off
set NAME=%1
echo. >> C:\\Windows\\System32\\drivers\\etc\\hosts
echo 127.0.0.1   %NAME%.local >> C:\\Windows\\System32\\drivers\\etc\\hosts

(
  echo ^<VirtualHost *:80^>
  echo     ServerName  %NAME%.local
  echo     DocumentRoot "C:/xampp/htdocs/%NAME%/public"
  echo     ^<Directory "C:/xampp/htdocs/%NAME%/public"^>
  echo         AllowOverride All
  echo         Require all granted
  echo     ^</Directory^>
  echo     ErrorLog  "logs/%NAME%-error.log"
  echo     CustomLog "logs/%NAME%-access.log" combined
  echo ^</VirtualHost^>
) >> C:\\xampp\\apache\\conf\\extra\\httpd-vhosts.conf

C:\\xampp\\apache\\bin\\httpd.exe -k restart
echo Site %NAME%.local pronto.`}),o.jsxs("p",{children:["Uso: ",o.jsx("code",{children:"add-vhost.bat novosite"})," — pronto."]}),o.jsxs(a,{type:"warning",title:"hosts não atualiza enquanto o navegador está aberto",children:["Chrome cacheia DNS interno por uma sessão. Se mudar o ",o.jsx("code",{children:"hosts"})," e o site continuar 404, abra ",o.jsx("code",{children:"chrome://net-internals/#dns"})," e clique"," ",'"Clear host cache". Funciona pro Edge também.']}),o.jsx("h2",{children:"Armadilhas"}),o.jsxs("ul",{children:[o.jsxs("li",{children:["Esquecer ",o.jsx("code",{children:"AllowOverride All"})," → ",o.jsx("code",{children:".htaccess"})," dos sites silenciosamente ignorado."]}),o.jsx("li",{children:'Reusar a porta 80 sem desabilitar IIS / Skype / outro Apache → "address already in use".'}),o.jsxs("li",{children:["Mesma sessão PHP entre sites → cookies se cruzam. Use ",o.jsx("code",{children:"session.cookie_path"})," ou",o.jsx("code",{children:"session_set_cookie_params(['domain' => 'loja.local'])"}),"."]}),o.jsxs("li",{children:["DocumentRoot apontando para a pasta raiz do projeto (em vez de ",o.jsx("code",{children:"/public"}),") → expõe",o.jsx("code",{children:".env"}),", ",o.jsx("code",{children:"vendor/"})," e ",o.jsx("code",{children:"composer.json"})," para o navegador."]})]})]})}export{n as default};
