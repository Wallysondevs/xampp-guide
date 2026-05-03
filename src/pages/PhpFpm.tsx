import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function PhpFpm() {
  return (
    <PageContainer
      title="PHP-FPM — saindo do mod_php"
      subtitle="Por que o mundo migrou para FPM, como funciona, como configurar pools e como ligar ao Apache (XAMPP) ou ao Nginx no servidor de verdade."
      difficulty="avancado"
      timeToRead="12 min"
    >
      <AlertBox type="info" title="O que é">
        FPM (FastCGI Process Manager) é um daemon separado que mantém um pool de processos PHP
        prontos. O servidor web (Apache/Nginx) entrega via FastCGI. Isso desacopla o ciclo de vida
        do PHP do servidor web, permite MPM event no Apache, dá controle fino de memória, e suporta
        múltiplos usuários/versões.
      </AlertBox>

      <h2>mod_php vs PHP-FPM</h2>
      <ParamsTable
        title="Comparativo"
        params={[
          {
            flag: "mod_php",
            desc: "PHP embutido em cada processo Apache. Simples no XAMPP, mas força MPM prefork (caro em RAM) e impede thread-safety.",
          },
          {
            flag: "PHP-FPM",
            desc: "Daemon separado com pool. Apache usa MPM event/worker (leve), processos PHP isolados, possibilidade de pools por aplicação.",
          },
        ]}
      />

      <h2>O XAMPP traz PHP-FPM?</h2>
      <p>
        <strong>Linux/macOS</strong>: sim, <code>/opt/lampp/bin/php-fpm</code> está disponível.{" "}
        <strong>Windows</strong>: o XAMPP não embarca FPM — para FPM no Windows, instale o PHP
        oficial (windows.php.net) ao lado do XAMPP e aponte o Apache para ele.
      </p>

      <h2>Configuração — pools</h2>
      <CodeBlock
        title="/opt/lampp/etc/php-fpm.conf"
        language="ini"
        code={`[global]
pid = /opt/lampp/var/run/php-fpm.pid
error_log = /opt/lampp/logs/php-fpm.log
log_level = notice
emergency_restart_threshold = 10
emergency_restart_interval  = 1m
process_control_timeout     = 10s

include = /opt/lampp/etc/php-fpm.d/*.conf`}
      />

      <CodeBlock
        title="/opt/lampp/etc/php-fpm.d/www.conf"
        language="ini"
        code={`[www]
user  = daemon
group = daemon

; Listening — escolha socket OU porta TCP
listen = /opt/lampp/var/run/php-fpm.sock
listen.owner = daemon
listen.group = daemon
listen.mode  = 0660
; ou: listen = 127.0.0.1:9000

pm = dynamic
pm.max_children      = 50
pm.start_servers     = 5
pm.min_spare_servers = 2
pm.max_spare_servers = 8
pm.max_requests      = 1000

; Timeouts
request_terminate_timeout = 60s
request_slowlog_timeout   = 5s
slowlog                   = /opt/lampp/logs/fpm-slow.log

; Status & ping
pm.status_path = /fpm-status
ping.path      = /ping
ping.response  = pong

; Variáveis de ambiente que o PHP enxerga
env[PATH]    = /usr/local/bin:/usr/bin:/bin
env[APP_ENV] = production`}
      />

      <ParamsTable
        title="Modos de pm"
        params={[
          { flag: "static", desc: "Sempre N processos. Previsível mas desperdiça RAM em horário ocioso." },
          { flag: "dynamic", desc: "Ajusta entre min/max conforme demanda. Padrão equilibrado." },
          { flag: "ondemand", desc: "Cria processos só quando há request. Para sites de pouco tráfego." },
        ]}
      />

      <h2>Dimensionando max_children</h2>
      <CodeBlock
        title="Regra prática"
        language="text"
        code={`pm.max_children = (RAM_disponível) / (RAM_média_por_processo)

# Meça com:
ps -ylC php-fpm --sort:rss | awk '{sum+=$8; n++} END {print "Média KB:", sum/n}'

# Exemplo: 4 GB livres, processo médio = 80 MB
# pm.max_children = 4096 / 80 ≈ 51`}
      />

      <h2>Ligando o Apache ao FPM</h2>
      <p>Linux / XAMPP — habilite mod_proxy_fcgi:</p>
      <CodeBlock
        title="httpd.conf"
        language="apache"
        code={`LoadModule proxy_module      modules/mod_proxy.so
LoadModule proxy_fcgi_module modules/mod_proxy_fcgi.so

# Em todos os sites OU em <Directory>:
<FilesMatch "\\.php$">
    SetHandler "proxy:unix:/opt/lampp/var/run/php-fpm.sock|fcgi://localhost/"
</FilesMatch>

# Para porta TCP em vez de socket:
# SetHandler "proxy:fcgi://127.0.0.1:9000"`}
      />
      <p>
        Antes disso, comente as linhas do <code>php_module</code> / <code>php_admin_value</code>{" "}
        do mod_php no <code>httpd.conf</code> — caso contrário, ele continua atendendo PHP e o
        FPM nunca recebe.
      </p>

      <h2>Múltiplos pools (sites diferentes, isolados)</h2>
      <CodeBlock
        title="php-fpm.d/loja.conf"
        language="ini"
        code={`[loja]
user  = loja
group = loja
listen = /var/run/php-fpm-loja.sock
listen.owner = www-data
listen.group = www-data
pm = dynamic
pm.max_children = 20
chdir = /var/www/loja/public

php_admin_value[memory_limit] = 256M
php_admin_value[upload_max_filesize] = 50M
php_admin_value[error_log] = /var/log/php-loja.log
php_admin_flag[log_errors]  = on
php_admin_value[open_basedir] = /var/www/loja:/tmp`}
      />

      <CodeBlock
        title="php-fpm.d/admin.conf"
        language="ini"
        code={`[admin]
user  = admin
group = admin
listen = /var/run/php-fpm-admin.sock
chdir = /var/www/admin/public
php_admin_value[memory_limit] = 512M
php_admin_value[max_execution_time] = 300`}
      />

      <CodeBlock
        title="Apache: cada vhost ao seu pool"
        language="apache"
        code={`<VirtualHost *:80>
    ServerName loja.local
    DocumentRoot /var/www/loja/public
    <FilesMatch "\\.php$">
        SetHandler "proxy:unix:/var/run/php-fpm-loja.sock|fcgi://localhost/"
    </FilesMatch>
</VirtualHost>

<VirtualHost *:80>
    ServerName admin.local
    DocumentRoot /var/www/admin/public
    <FilesMatch "\\.php$">
        SetHandler "proxy:unix:/var/run/php-fpm-admin.sock|fcgi://localhost/"
    </FilesMatch>
</VirtualHost>`}
      />

      <h2>Status e monitoramento</h2>
      <CodeBlock
        title="Apache — expor pm.status_path"
        language="apache"
        code={`<Location "/fpm-status">
    SetHandler "proxy:unix:/opt/lampp/var/run/php-fpm.sock|fcgi://localhost/"
    Require ip 127.0.0.1
</Location>

<Location "/ping">
    SetHandler "proxy:unix:/opt/lampp/var/run/php-fpm.sock|fcgi://localhost/"
    Require ip 127.0.0.1
</Location>`}
      />
      <CodeBlock
        language="bash"
        code={`curl http://localhost/fpm-status
# pool:                 www
# process manager:      dynamic
# accepted conn:        4823
# listen queue:         0
# idle processes:       3
# active processes:     2
# total processes:      5

curl http://localhost/fpm-status?full   # detalhe por processo
curl http://localhost/fpm-status?json   # parseável`}
      />

      <h2>Slow log do FPM</h2>
      <CodeBlock
        language="ini"
        code={`request_slowlog_timeout = 5s
slowlog = /opt/lampp/logs/fpm-slow.log`}
      />
      <p>Cada request que passar de 5s gera um stacktrace completo no log:</p>
      <CodeBlock
        language="text"
        code={`[03-May-2026 14:31:11] [pool www] pid 4392
script_filename = /var/www/loja/public/relatorio.php
[0x7fff...]  PDOStatement->execute() /var/www/loja/src/Repo.php:42
[0x7fff...]  Repo->totalMensal()      /var/www/loja/src/Controller.php:18
[0x7fff...]  Controller->index()      /var/www/loja/public/relatorio.php:8`}
      />

      <h2>Restart sem dropar</h2>
      <CodeBlock
        language="bash"
        code={`# Reload config sem matar requests em curso
sudo kill -USR2 $(cat /opt/lampp/var/run/php-fpm.pid)

# Restart total
sudo /opt/lampp/lampp restartphp-fpm`}
      />

      <h2>OPcache + FPM</h2>
      <CodeBlock
        title="php.ini"
        language="ini"
        code={`opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0       # produção: invalida só com restart
opcache.preload=/var/www/loja/preload.php  ; PHP 7.4+ — pré-carrega classes`}
      />

      <h2>FPM x Nginx (referência)</h2>
      <CodeBlock
        title="nginx.conf"
        language="nginx"
        code={`server {
    listen 80;
    server_name loja.local;
    root /var/www/loja/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \\.php$ {
        include fastcgi_params;
        fastcgi_pass unix:/var/run/php-fpm-loja.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}`}
      />

      <AlertBox type="warning" title="Permissões do socket">
        Erro <code>connect() to unix:... failed (13: Permission denied)</code>: o usuário do
        Apache (daemon / www-data) não pode ler o socket. Ajuste{" "}
        <code>listen.owner</code> / <code>listen.group</code> / <code>listen.mode</code> no pool.
      </AlertBox>

      <h2>Receita: migrando do mod_php sem dor</h2>
      <ol>
        <li>Backup do <code>httpd.conf</code> e <code>php.ini</code>.</li>
        <li>Instale e suba o php-fpm ao lado, sem mexer no Apache.</li>
        <li>Teste: <code>SCRIPT_NAME=/info.php REQUEST_METHOD=GET cgi-fcgi -bind -connect /var/run/php-fpm.sock</code></li>
        <li>Crie um vhost de teste só para uma rota apontando para o FPM. Valide.</li>
        <li>Comente o <code>LoadModule php_module</code>, mude o <code>FilesMatch</code> global para FPM.</li>
        <li>Restart do Apache. Se algo quebrar, é só reverter os comentários.</li>
      </ol>

      <h2>Armadilhas</h2>
      <ul>
        <li>
          Esquecer <code>SetHandler</code> em algum vhost — esse vhost continua usando mod_php
          (se ainda carregado) ou serve o <code>.php</code> como texto plano.
        </li>
        <li>
          Pool com <code>user = root</code> = vulnerabilidade. Crie usuário dedicado por site.
        </li>
        <li>
          <code>request_terminate_timeout</code> menor que <code>max_execution_time</code> do
          PHP — request morre sem stack trace bonito. Mantenha o do FPM um pouco maior.
        </li>
        <li>
          Editar <code>php.ini</code> e esquecer de restart do FPM — Apache não basta.
        </li>
      </ul>
    </PageContainer>
  );
}
