import{j as e}from"./index-BreI0dyu.js";import{P as s,A as a}from"./AlertBox-C_bJKc46.js";import{C as o}from"./CodeBlock-D0rWxPIU.js";import{P as r}from"./ParamsTable-DyRs6_CQ.js";import{P as i}from"./PracticeBox-BV05Hsfh.js";import"./circle-alert-_acnmM4q.js";function m(){return e.jsxs(s,{title:"Migrando do XAMPP para produção",subtitle:"Quando seu projeto está pronto, é hora de tirar do localhost. Aqui está o checklist completo — do tipo de hospedagem ao certificado, das permissões ao OPcache.",difficulty:"avancado",timeToRead:"14 min",children:[e.jsxs(a,{type:"info",title:"Pré-requisitos",children:["Você já deve ter dominado ",e.jsx("a",{href:"#/mysql-backup",children:"backup do MySQL"}),", ",e.jsx("a",{href:"#/htaccess",children:".htaccess"}),","," ",e.jsx("a",{href:"#/seguranca",children:"configurações de segurança"})," e"," ",e.jsx("a",{href:"#/php-ini",children:"php.ini"}),". Migrar é colocar tudo isso em ordem."]}),e.jsx("h2",{children:"Glossário rápido"}),e.jsxs("p",{children:[e.jsx("strong",{children:"VPS"})," (Virtual Private Server) — servidor dedicado virtual com acesso root. Você instala e mantém o stack todo."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Hospedagem compartilhada"})," — várias contas no mesmo servidor. Painel cPanel/Plesk pronto, mas você não muda PHP/MySQL livremente."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"PaaS"})," (Platform as a Service) — você dá o código, a plataforma cuida de servidor, escala e deploy. Heroku, Railway, Render, Fly.io."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Certbot"})," — cliente Let's Encrypt que emite e renova certificados TLS automaticamente."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"OPcache"})," — cache de bytecode do PHP. Em produção, pode acelerar 3x ou mais."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"HSTS"}),' (HTTP Strict Transport Security) — header que diz ao navegador "só me acesse via HTTPS pelos próximos N segundos".']}),e.jsxs("p",{children:[e.jsx("strong",{children:"Zero-downtime deploy"})," — atualizar o código sem derrubar o site. Usual com symlinks e blue/green ou Docker."]}),e.jsx("p",{children:"Migrar localhost → produção é um momento delicado. URLs mudam, senhas mudam, charsets podem mudar, certificados precisam ser configurados, debug tem que ser desligado. Este capítulo é o checklist para você não esquecer nada."}),e.jsx("h2",{children:"Antes de tudo: escolher onde hospedar"}),e.jsx(r,{title:"Tipos de hospedagem para PHP+MySQL",params:[{flag:"Hospedagem compartilhada",desc:"Hostinger, HostGator, KingHost, Locaweb. Já vem com cPanel/Plesk, Apache, PHP, MySQL e e-mail. Para projetos pequenos é o caminho mais barato e fácil. ~R$ 15-50/mês. Limitação: você não escolhe versão de PHP nem instala extensões fora do que o painel oferece."},{flag:"VPS (Virtual Private Server)",desc:"DigitalOcean, Vultr, Linode, AWS Lightsail, Hetzner. Você tem o servidor todo. Mais controle, mais responsabilidade (Apache/Nginx, certbot, segurança, backup, fail2ban). De R$ 30/mês pra cima."},{flag:"Cloud (AWS, GCP, Azure)",desc:"Para escala maior, multi-AZ, auto-scaling. Custos variáveis, mais complexo. Só vale se já tem conhecimento ou volume."},{flag:"Plataformas como serviço (PaaS)",desc:"Heroku, Railway, Render, Fly.io, Platform.sh. Você só faz push do Git e eles cuidam do resto. Para PHP/Laravel existem buildpacks; preço escala junto com o uso."},{flag:"Servidor próprio (on-premise)",desc:"Servidor físico no escritório. Faz sentido em pouquíssimos casos hoje (compliance, intranet). Manutenção e link de internet ficam por sua conta."}]}),e.jsx("h2",{children:"Checklist de migração"}),e.jsx("h3",{children:"1. Backup completo do XAMPP"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Pasta inteira do projeto em ",e.jsx("code",{children:"htdocs/seu-projeto/"}),"."]}),e.jsxs("li",{children:["Dump do banco via ",e.jsx("code",{children:"mysqldump"})," com"," ",e.jsx("code",{children:"--single-transaction --routines --triggers --events --default-character-set=utf8mb4"})," (",e.jsx("a",{href:"#/mysql-backup",children:"veja Backup"}),")."]}),e.jsxs("li",{children:["Cópia do ",e.jsx("code",{children:".env"}),", mas com a senha já trocada para a senha de produção (não suba a senha local!)."]}),e.jsxs("li",{children:["Lista de extensões PHP que você usa (",e.jsx("code",{children:"php -m"}),") e versão do PHP (",e.jsx("code",{children:"php -v"}),") — a hospedagem precisa oferecer."]})]}),e.jsx("h3",{children:"2. Subir os arquivos"}),e.jsx("p",{children:"Pelos clientes mais comuns:"}),e.jsx(o,{language:"bash",code:`# === Via FileZilla / cPanel File Manager ===
# Suba o conteúdo de htdocs/seu-projeto/ para public_html/ (cPanel)
# ou /var/www/html/ (VPS).

# === Via Git (RECOMENDADO) ===
# Local:
git add .
git commit -m "Pronto para deploy"
git push origin main

# No servidor:
cd /var/www
git clone https://github.com/seu-usuario/seu-projeto.git html
cd html
composer install --no-dev --optimize-autoloader

# === Via SCP (Linux/macOS) ===
scp -r ./meu-app usuario@servidor.com:/var/www/html/

# === Via rsync (incremental, evita reupload) ===
rsync -avz --exclude=node_modules --exclude=.git ./ usuario@servidor:/var/www/html/`}),e.jsxs(a,{type:"warning",title:"composer install --no-dev em produção",children:["Em produção, instale só dependências de runtime — PHPUnit, Faker, debugbar e outros pacotes ",e.jsx("code",{children:"require-dev"})," não devem ir. Use ",e.jsx("code",{children:"--no-dev --optimize-autoloader"})," para gerar um autoloader mais rápido (PSR-4 com classmap)."]}),e.jsx("h3",{children:"3. Importar o banco"}),e.jsx(o,{language:"bash",code:`# Suba o dump.sql para o servidor (scp/rsync/sftp)

# Crie o banco vazio no servidor (com charset utf8mb4)
mysql -u root -p -e "CREATE DATABASE banco_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Crie um usuário dedicado (NUNCA use root para a app)
mysql -u root -p -e "
  CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'senha_super_forte';
  GRANT ALL PRIVILEGES ON banco_prod.* TO 'app_user'@'localhost';
  FLUSH PRIVILEGES;
"

# Importe o dump
mysql -u app_user -p banco_prod < dump.sql

# Em hospedagem compartilhada, use o phpMyAdmin do cPanel`}),e.jsx("h3",{children:"4. Trocar credenciais e URLs"}),e.jsxs("p",{children:["Edite o ",e.jsx("code",{children:".env"})," (Laravel) ou ",e.jsx("code",{children:"config.php"})," (CMS) no servidor:"]}),e.jsx(o,{language:"bash",code:`APP_ENV=production
APP_DEBUG=false           # MUITO importante: nunca true em produção
APP_URL=https://meusite.com.br

DB_HOST=mysql.hosting.com  # ou localhost se MySQL local
DB_DATABASE=banco_prod
DB_USERNAME=app_user
DB_PASSWORD=senha_super_forte_diferente_da_local

CACHE_DRIVER=redis         # produção pede driver de cache rápido
SESSION_DRIVER=redis       # ou database
QUEUE_CONNECTION=redis     # filas em Redis são muito mais rápidas

MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=SG.xxxxxxxx
MAIL_ENCRYPTION=tls`}),e.jsx(a,{type:"danger",title:"APP_DEBUG=false sempre",children:"Com debug ligado, qualquer erro mostra stack trace, .env, query SQL e variáveis sensíveis na tela. É o pior vazamento que pode acontecer."}),e.jsx("h3",{children:"5. WordPress: trocar URLs no banco"}),e.jsx("p",{children:"Se for WP, as URLs ficam SALVAS no banco. Use:"}),e.jsx(o,{language:"sql",code:`-- Pelo phpMyAdmin do cPanel ou pelo terminal
UPDATE wp_options SET option_value = 'https://meusite.com.br'
    WHERE option_name = 'siteurl';
UPDATE wp_options SET option_value = 'https://meusite.com.br'
    WHERE option_name = 'home';

UPDATE wp_posts SET guid = REPLACE(guid,
    'http://localhost/wordpress', 'https://meusite.com.br');

UPDATE wp_posts SET post_content = REPLACE(post_content,
    'http://localhost/wordpress', 'https://meusite.com.br');

UPDATE wp_postmeta SET meta_value = REPLACE(meta_value,
    'http://localhost/wordpress', 'https://meusite.com.br');`}),e.jsxs("p",{children:["Ou — muito mais seguro com dados serializados — use o plugin"," ",e.jsx("strong",{children:"Better Search Replace"})," (interface gráfica) ou o WP-CLI:"]}),e.jsx(o,{language:"bash",code:"wp search-replace 'http://localhost/wordpress' 'https://meusite.com.br' --all-tables --report-changed-only"}),e.jsx("h3",{children:"6. Habilitar HTTPS no servidor"}),e.jsx(o,{language:"bash",code:`# Em cPanel: AutoSSL faz tudo sozinho.

# Em VPS Ubuntu/Debian (Let's Encrypt via Certbot):
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d meusite.com.br -d www.meusite.com.br

# Renovação automática já fica configurada via systemd timer ou cron.
# Confira quando vai renovar:
sudo certbot certificates
sudo systemctl status certbot.timer`}),e.jsx("h3",{children:"7. Forçar HTTPS no .htaccess"}),e.jsx(o,{language:"apache",code:`RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Bônus: HSTS (só ative DEPOIS de testar o HTTPS por dias)
<IfModule mod_headers.c>
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" env=HTTPS
</IfModule>`}),e.jsx("h3",{children:"8. Permissões corretas"}),e.jsx(o,{language:"bash",code:`# Linux — proprietário do Apache (www-data em Debian/Ubuntu)
sudo chown -R www-data:www-data /var/www/html

# Pastas: 755 (rwxr-xr-x)
sudo find /var/www/html -type d -exec chmod 755 {} \\;

# Arquivos: 644 (rw-r--r--)
sudo find /var/www/html -type f -exec chmod 644 {} \\;

# Pastas que precisam ser graváveis (Laravel/WordPress):
sudo chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
sudo chmod -R 775 /var/www/html/wp-content/uploads

# Nada deve ser 777 em produção.`}),e.jsx("h3",{children:"9. Configurar PHP de produção"}),e.jsx(o,{language:"ini",code:`; php.ini de produção
display_errors = Off
display_startup_errors = Off
log_errors = On
error_log = /var/log/php/php_errors.log
expose_php = Off

; Limites generosos mas não infinitos
memory_limit = 256M
max_execution_time = 60
upload_max_filesize = 50M
post_max_size = 60M

; Sessões — em produção, prefira Redis/DB
session.cookie_secure = 1
session.cookie_httponly = 1
session.cookie_samesite = "Lax"
session.use_strict_mode = 1

; OPcache ligado e ajustado
opcache.enable = 1
opcache.memory_consumption = 256
opcache.max_accelerated_files = 20000
opcache.revalidate_freq = 0
opcache.validate_timestamps = 0   ; em prod: false. Recompila só com restart do PHP-FPM.
opcache.save_comments = 1
opcache.fast_shutdown = 1

; JIT (PHP 8+) — ganho extra em CPU-bound
opcache.jit_buffer_size = 100M
opcache.jit = tracing`}),e.jsxs(a,{type:"info",title:"opcache.validate_timestamps = 0 implica restart no deploy",children:["Com essa flag em ",e.jsx("code",{children:"0"}),", o OPcache não percebe que o arquivo mudou. Após cada deploy, faça ",e.jsx("code",{children:"systemctl reload php8.3-fpm"})," ","(ou ",e.jsx("code",{children:"service apache2 reload"})," no mod_php) para invalidar o cache."]}),e.jsx("h3",{children:"10. Ajustes específicos por framework"}),e.jsx(o,{language:"bash",code:`# === Laravel ===
php artisan config:cache    # consolida config/*.php em um arquivo
php artisan route:cache     # idem para rotas
php artisan view:cache      # pré-compila as views Blade
php artisan event:cache     # cache de listeners de evento
php artisan optimize        # roda tudo isso de uma vez

# Storage link público
php artisan storage:link

# Migrations em produção (atenção: --force porque o ambiente não é local)
php artisan migrate --force

# === WordPress ===
# Ative cache: WP Super Cache, W3 Total Cache ou WP Rocket
# Defina:
define('WP_DEBUG', false);
define('DISALLOW_FILE_EDIT', true);   // bloqueia editor de tema/plugin no admin

# === Symfony ===
APP_ENV=prod composer install --no-dev --optimize-autoloader
php bin/console cache:clear --env=prod
php bin/console cache:warmup --env=prod`}),e.jsx("h3",{children:"11. Testar tudo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Login do admin funciona?"}),e.jsx("li",{children:"Envio de formulário e e-mail (com SPF/DKIM no DNS)?"}),e.jsx("li",{children:"Upload de arquivos?"}),e.jsx("li",{children:"Pagamentos (se houver) — em sandbox e em produção real?"}),e.jsx("li",{children:"HTTPS realmente força redirect (acessar com http:// e verificar 301)?"}),e.jsx("li",{children:"404 personalizado abre?"}),e.jsx("li",{children:"Robots.txt e sitemap.xml acessíveis?"}),e.jsxs("li",{children:["Performance — rode no ",e.jsx("a",{href:"https://pagespeed.web.dev",target:"_blank",rel:"noreferrer",children:"PageSpeed"})," e veja TTFB."]}),e.jsx("li",{children:"Logs estão sendo gravados? Tem rotação?"})]}),e.jsx("h3",{children:"12. Configurar backup automático"}),e.jsxs("p",{children:["No servidor de produção, configure backup recorrente. Combine"," ",e.jsx("code",{children:"mysqldump"})," + ",e.jsx("code",{children:"tar"})," + envio para outro lugar (S3, Backblaze, Wasabi, Drive). Veja"," ",e.jsx("a",{href:"#/backup-completo",children:"Backup completo"}),"."]}),e.jsx(o,{language:"bash",code:`# crontab -e
0 3 * * * /usr/local/bin/backup-app.sh >> /var/log/backup.log 2>&1`}),e.jsx(i,{title:"Migrar um projeto Laravel do XAMPP para um VPS",goal:"Subir o projeto para um servidor Ubuntu com HTTPS e tudo configurado direito.",steps:["Aluga VPS (Hetzner CX11, DigitalOcean Basic, etc) com Ubuntu 22.04","ssh root@ip → cria usuário não-root, desabilita login root, ativa UFW","Instala Apache + PHP 8.2 + MySQL: sudo apt install apache2 php php-mysql php-mbstring php-xml php-curl php-zip mysql-server","Cria banco e usuário dedicado no MySQL","git clone do projeto em /var/www/meu-app, composer install --no-dev","Copia .env de produção (NUNCA suba .env no Git)","php artisan key:generate, php artisan migrate --force, php artisan optimize","Configura VirtualHost apontando para meu-app/public","sudo certbot --apache -d meusite.com.br","Testa com curl -I https://meusite.com.br","Configura cron para schedule:run e backup"],verify:"Acessar https://meusite.com.br mostra a app, certificate é válido, e curl em http:// retorna 301 para https://."}),e.jsx("h2",{children:"Estratégias de deploy"}),e.jsx(r,{title:"Como atualizar o código depois que tá no ar",params:[{flag:"git pull manual",desc:"Mais simples. SSH no servidor, git pull, composer install, php artisan migrate. Tem alguns segundos de inconsistência durante o deploy."},{flag:"Deployer / Capistrano / Envoyer",desc:"Ferramentas de deploy zero-downtime. Cria pasta nova com o release novo, roda migrations, e troca um symlink no fim. Se algo dá errado, rollback é trocar o symlink."},{flag:"GitHub Actions / GitLab CI",desc:"Deploy automático ao fazer push em main. CI roda testes, builda assets, manda para o servidor via SSH/rsync."},{flag:"Docker",desc:"Empacota app + dependências em uma imagem. Deploy = subir nova imagem. Zero-downtime via Kubernetes/Docker Swarm/ECS."},{flag:"PaaS (push to deploy)",desc:"git push no Heroku/Railway/Render dispara build e deploy. Você não toca em servidor."}]}),e.jsxs(a,{type:"danger",title:"Lembre-se de tirar coisas que só são pra dev",children:["Senha vazia, ",e.jsx("code",{children:"APP_DEBUG=true"}),", mensagens de erro na tela,",e.jsx("code",{children:"phpinfo.php"})," público, ",e.jsx("code",{children:"mod_status"})," aberto,",e.jsx("code",{children:"dump.sql"})," na raiz, pasta ",e.jsx("code",{children:".git"})," exposta,",e.jsx("code",{children:".env"})," acessível pela web... Vasculhe o projeto antes de subir. Bloqueie no .htaccess:",e.jsx(o,{language:"apache",code:`<FilesMatch "^\\.|composer\\.(json|lock)|package\\.json|\\.sql$|\\.env">
    Require all denied
</FilesMatch>`})]}),e.jsxs(a,{type:"success",title:"Pós-deploy: monitore",children:["Logue tudo (",e.jsx("code",{children:"error_log"}),', logs do Apache, logs do banco) e confira nos primeiros dias. Configure backup automático no servidor — não dependa só do "no meu PC tem". Considere serviços de monitoramento (UptimeRobot, BetterStack, Sentry para erros do PHP) e alertas no Telegram/Email para que você saiba antes do usuário reclamar.']})]})}export{m as default};
