import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function MigrarProducao() {
  return (
    <PageContainer
      title="Migrando do XAMPP para produção"
      subtitle="Quando seu projeto está pronto, é hora de tirar do localhost. Aqui está o checklist completo — do tipo de hospedagem ao certificado, das permissões ao OPcache."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Você já deve ter dominado <a href="#/mysql-backup">backup do
        MySQL</a>, <a href="#/htaccess">.htaccess</a>,{" "}
        <a href="#/seguranca">configurações de segurança</a> e{" "}
        <a href="#/php-ini">php.ini</a>. Migrar é colocar tudo isso em
        ordem.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>VPS</strong> (Virtual Private Server) — servidor dedicado
        virtual com acesso root. Você instala e mantém o stack todo.
      </p>
      <p>
        <strong>Hospedagem compartilhada</strong> — várias contas no mesmo
        servidor. Painel cPanel/Plesk pronto, mas você não muda PHP/MySQL
        livremente.
      </p>
      <p>
        <strong>PaaS</strong> (Platform as a Service) — você dá o código, a
        plataforma cuida de servidor, escala e deploy. Heroku, Railway,
        Render, Fly.io.
      </p>
      <p>
        <strong>Certbot</strong> — cliente Let's Encrypt que emite e renova
        certificados TLS automaticamente.
      </p>
      <p>
        <strong>OPcache</strong> — cache de bytecode do PHP. Em produção,
        pode acelerar 3x ou mais.
      </p>
      <p>
        <strong>HSTS</strong> (HTTP Strict Transport Security) — header que
        diz ao navegador "só me acesse via HTTPS pelos próximos N segundos".
      </p>
      <p>
        <strong>Zero-downtime deploy</strong> — atualizar o código sem
        derrubar o site. Usual com symlinks e blue/green ou Docker.
      </p>

      <p>
        Migrar localhost → produção é um momento delicado. URLs mudam,
        senhas mudam, charsets podem mudar, certificados precisam ser
        configurados, debug tem que ser desligado. Este capítulo é o
        checklist para você não esquecer nada.
      </p>

      <h2>Antes de tudo: escolher onde hospedar</h2>
      <ParamsTable
        title="Tipos de hospedagem para PHP+MySQL"
        params={[
          { flag: "Hospedagem compartilhada", desc: "Hostinger, HostGator, KingHost, Locaweb. Já vem com cPanel/Plesk, Apache, PHP, MySQL e e-mail. Para projetos pequenos é o caminho mais barato e fácil. ~R$ 15-50/mês. Limitação: você não escolhe versão de PHP nem instala extensões fora do que o painel oferece." },
          { flag: "VPS (Virtual Private Server)", desc: "DigitalOcean, Vultr, Linode, AWS Lightsail, Hetzner. Você tem o servidor todo. Mais controle, mais responsabilidade (Apache/Nginx, certbot, segurança, backup, fail2ban). De R$ 30/mês pra cima." },
          { flag: "Cloud (AWS, GCP, Azure)", desc: "Para escala maior, multi-AZ, auto-scaling. Custos variáveis, mais complexo. Só vale se já tem conhecimento ou volume." },
          { flag: "Plataformas como serviço (PaaS)", desc: "Heroku, Railway, Render, Fly.io, Platform.sh. Você só faz push do Git e eles cuidam do resto. Para PHP/Laravel existem buildpacks; preço escala junto com o uso." },
          { flag: "Servidor próprio (on-premise)", desc: "Servidor físico no escritório. Faz sentido em pouquíssimos casos hoje (compliance, intranet). Manutenção e link de internet ficam por sua conta." },
        ]}
      />

      <h2>Checklist de migração</h2>

      <h3>1. Backup completo do XAMPP</h3>
      <ul>
        <li>Pasta inteira do projeto em <code>htdocs/seu-projeto/</code>.</li>
        <li>
          Dump do banco via <code>mysqldump</code> com{" "}
          <code>--single-transaction --routines --triggers --events
          --default-character-set=utf8mb4</code> (
          <a href="#/mysql-backup">veja Backup</a>).
        </li>
        <li>
          Cópia do <code>.env</code>, mas com a senha já trocada para a
          senha de produção (não suba a senha local!).
        </li>
        <li>
          Lista de extensões PHP que você usa (<code>php -m</code>) e
          versão do PHP (<code>php -v</code>) — a hospedagem precisa
          oferecer.
        </li>
      </ul>

      <h3>2. Subir os arquivos</h3>
      <p>Pelos clientes mais comuns:</p>
      <CodeBlock language="bash" code={`# === Via FileZilla / cPanel File Manager ===
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
rsync -avz --exclude=node_modules --exclude=.git ./ usuario@servidor:/var/www/html/`} />
      <AlertBox type="warning" title="composer install --no-dev em produção">
        Em produção, instale só dependências de runtime — PHPUnit, Faker,
        debugbar e outros pacotes <code>require-dev</code> não devem ir.
        Use <code>--no-dev --optimize-autoloader</code> para gerar um
        autoloader mais rápido (PSR-4 com classmap).
      </AlertBox>

      <h3>3. Importar o banco</h3>
      <CodeBlock language="bash" code={`# Suba o dump.sql para o servidor (scp/rsync/sftp)

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

# Em hospedagem compartilhada, use o phpMyAdmin do cPanel`} />

      <h3>4. Trocar credenciais e URLs</h3>
      <p>Edite o <code>.env</code> (Laravel) ou <code>config.php</code> (CMS) no servidor:</p>
      <CodeBlock language="bash" code={`APP_ENV=production
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
MAIL_ENCRYPTION=tls`} />
      <AlertBox type="danger" title="APP_DEBUG=false sempre">
        Com debug ligado, qualquer erro mostra stack trace, .env, query SQL
        e variáveis sensíveis na tela. É o pior vazamento que pode
        acontecer.
      </AlertBox>

      <h3>5. WordPress: trocar URLs no banco</h3>
      <p>Se for WP, as URLs ficam SALVAS no banco. Use:</p>
      <CodeBlock language="sql" code={`-- Pelo phpMyAdmin do cPanel ou pelo terminal
UPDATE wp_options SET option_value = 'https://meusite.com.br'
    WHERE option_name = 'siteurl';
UPDATE wp_options SET option_value = 'https://meusite.com.br'
    WHERE option_name = 'home';

UPDATE wp_posts SET guid = REPLACE(guid,
    'http://localhost/wordpress', 'https://meusite.com.br');

UPDATE wp_posts SET post_content = REPLACE(post_content,
    'http://localhost/wordpress', 'https://meusite.com.br');

UPDATE wp_postmeta SET meta_value = REPLACE(meta_value,
    'http://localhost/wordpress', 'https://meusite.com.br');`} />
      <p>
        Ou — muito mais seguro com dados serializados — use o plugin{" "}
        <strong>Better Search Replace</strong> (interface gráfica) ou o
        WP-CLI:
      </p>
      <CodeBlock language="bash" code={`wp search-replace 'http://localhost/wordpress' 'https://meusite.com.br' --all-tables --report-changed-only`} />

      <h3>6. Habilitar HTTPS no servidor</h3>
      <CodeBlock language="bash" code={`# Em cPanel: AutoSSL faz tudo sozinho.

# Em VPS Ubuntu/Debian (Let's Encrypt via Certbot):
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d meusite.com.br -d www.meusite.com.br

# Renovação automática já fica configurada via systemd timer ou cron.
# Confira quando vai renovar:
sudo certbot certificates
sudo systemctl status certbot.timer`} />

      <h3>7. Forçar HTTPS no .htaccess</h3>
      <CodeBlock language="apache" code={`RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Bônus: HSTS (só ative DEPOIS de testar o HTTPS por dias)
<IfModule mod_headers.c>
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" env=HTTPS
</IfModule>`} />

      <h3>8. Permissões corretas</h3>
      <CodeBlock language="bash" code={`# Linux — proprietário do Apache (www-data em Debian/Ubuntu)
sudo chown -R www-data:www-data /var/www/html

# Pastas: 755 (rwxr-xr-x)
sudo find /var/www/html -type d -exec chmod 755 {} \\;

# Arquivos: 644 (rw-r--r--)
sudo find /var/www/html -type f -exec chmod 644 {} \\;

# Pastas que precisam ser graváveis (Laravel/WordPress):
sudo chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
sudo chmod -R 775 /var/www/html/wp-content/uploads

# Nada deve ser 777 em produção.`} />

      <h3>9. Configurar PHP de produção</h3>
      <CodeBlock language="ini" code={`; php.ini de produção
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
opcache.jit = tracing`} />
      <AlertBox type="info" title="opcache.validate_timestamps = 0 implica restart no deploy">
        Com essa flag em <code>0</code>, o OPcache não percebe que o arquivo
        mudou. Após cada deploy, faça <code>systemctl reload php8.3-fpm</code>
        {" "}(ou <code>service apache2 reload</code> no mod_php) para
        invalidar o cache.
      </AlertBox>

      <h3>10. Ajustes específicos por framework</h3>
      <CodeBlock language="bash" code={`# === Laravel ===
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
php bin/console cache:warmup --env=prod`} />

      <h3>11. Testar tudo</h3>
      <ul>
        <li>Login do admin funciona?</li>
        <li>Envio de formulário e e-mail (com SPF/DKIM no DNS)?</li>
        <li>Upload de arquivos?</li>
        <li>Pagamentos (se houver) — em sandbox e em produção real?</li>
        <li>HTTPS realmente força redirect (acessar com http:// e verificar 301)?</li>
        <li>404 personalizado abre?</li>
        <li>Robots.txt e sitemap.xml acessíveis?</li>
        <li>Performance — rode no <a href="https://pagespeed.web.dev" target="_blank" rel="noreferrer">PageSpeed</a> e veja TTFB.</li>
        <li>Logs estão sendo gravados? Tem rotação?</li>
      </ul>

      <h3>12. Configurar backup automático</h3>
      <p>
        No servidor de produção, configure backup recorrente. Combine{" "}
        <code>mysqldump</code> + <code>tar</code> + envio para outro lugar
        (S3, Backblaze, Wasabi, Drive). Veja{" "}
        <a href="#/backup-completo">Backup completo</a>.
      </p>
      <CodeBlock language="bash" code={`# crontab -e
0 3 * * * /usr/local/bin/backup-app.sh >> /var/log/backup.log 2>&1`} />

      <PracticeBox
        title="Migrar um projeto Laravel do XAMPP para um VPS"
        goal="Subir o projeto para um servidor Ubuntu com HTTPS e tudo configurado direito."
        steps={[
          "Aluga VPS (Hetzner CX11, DigitalOcean Basic, etc) com Ubuntu 22.04",
          "ssh root@ip → cria usuário não-root, desabilita login root, ativa UFW",
          "Instala Apache + PHP 8.2 + MySQL: sudo apt install apache2 php php-mysql php-mbstring php-xml php-curl php-zip mysql-server",
          "Cria banco e usuário dedicado no MySQL",
          "git clone do projeto em /var/www/meu-app, composer install --no-dev",
          "Copia .env de produção (NUNCA suba .env no Git)",
          "php artisan key:generate, php artisan migrate --force, php artisan optimize",
          "Configura VirtualHost apontando para meu-app/public",
          "sudo certbot --apache -d meusite.com.br",
          "Testa com curl -I https://meusite.com.br",
          "Configura cron para schedule:run e backup",
        ]}
        verify="Acessar https://meusite.com.br mostra a app, certificate é válido, e curl em http:// retorna 301 para https://."
      />

      <h2>Estratégias de deploy</h2>
      <ParamsTable
        title="Como atualizar o código depois que tá no ar"
        params={[
          { flag: "git pull manual", desc: "Mais simples. SSH no servidor, git pull, composer install, php artisan migrate. Tem alguns segundos de inconsistência durante o deploy." },
          { flag: "Deployer / Capistrano / Envoyer", desc: "Ferramentas de deploy zero-downtime. Cria pasta nova com o release novo, roda migrations, e troca um symlink no fim. Se algo dá errado, rollback é trocar o symlink." },
          { flag: "GitHub Actions / GitLab CI", desc: "Deploy automático ao fazer push em main. CI roda testes, builda assets, manda para o servidor via SSH/rsync." },
          { flag: "Docker", desc: "Empacota app + dependências em uma imagem. Deploy = subir nova imagem. Zero-downtime via Kubernetes/Docker Swarm/ECS." },
          { flag: "PaaS (push to deploy)", desc: "git push no Heroku/Railway/Render dispara build e deploy. Você não toca em servidor." },
        ]}
      />

      <AlertBox type="danger" title="Lembre-se de tirar coisas que só são pra dev">
        Senha vazia, <code>APP_DEBUG=true</code>, mensagens de erro na tela,
        <code>phpinfo.php</code> público, <code>mod_status</code> aberto,
        <code>dump.sql</code> na raiz, pasta <code>.git</code> exposta,
        <code>.env</code> acessível pela web... Vasculhe o projeto antes de
        subir. Bloqueie no .htaccess:
        <CodeBlock language="apache" code={`<FilesMatch "^\\.|composer\\.(json|lock)|package\\.json|\\.sql$|\\.env">
    Require all denied
</FilesMatch>`} />
      </AlertBox>

      <AlertBox type="success" title="Pós-deploy: monitore">
        Logue tudo (<code>error_log</code>, logs do Apache, logs do banco) e
        confira nos primeiros dias. Configure backup automático no servidor
        — não dependa só do "no meu PC tem". Considere serviços de
        monitoramento (UptimeRobot, BetterStack, Sentry para erros do PHP) e
        alertas no Telegram/Email para que você saiba antes do usuário
        reclamar.
      </AlertBox>
    </PageContainer>
  );
}
