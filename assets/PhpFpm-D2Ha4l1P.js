import{j as e}from"./index-BreI0dyu.js";import{P as r,A as a}from"./AlertBox-C_bJKc46.js";import{C as o}from"./CodeBlock-D0rWxPIU.js";import{P as s}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function c(){return e.jsxs(r,{title:"PHP-FPM — saindo do mod_php",subtitle:"Por que o mundo migrou para FPM, como funciona, como configurar pools e como ligar ao Apache (XAMPP) ou ao Nginx no servidor de verdade.",difficulty:"avancado",timeToRead:"12 min",children:[e.jsx(a,{type:"info",title:"O que é",children:"FPM (FastCGI Process Manager) é um daemon separado que mantém um pool de processos PHP prontos. O servidor web (Apache/Nginx) entrega via FastCGI. Isso desacopla o ciclo de vida do PHP do servidor web, permite MPM event no Apache, dá controle fino de memória, e suporta múltiplos usuários/versões."}),e.jsx("h2",{children:"mod_php vs PHP-FPM"}),e.jsx(s,{title:"Comparativo",params:[{flag:"mod_php",desc:"PHP embutido em cada processo Apache. Simples no XAMPP, mas força MPM prefork (caro em RAM) e impede thread-safety."},{flag:"PHP-FPM",desc:"Daemon separado com pool. Apache usa MPM event/worker (leve), processos PHP isolados, possibilidade de pools por aplicação."}]}),e.jsx("h2",{children:"O XAMPP traz PHP-FPM?"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Linux/macOS"}),": sim, ",e.jsx("code",{children:"/opt/lampp/bin/php-fpm"})," está disponível."," ",e.jsx("strong",{children:"Windows"}),": o XAMPP não embarca FPM — para FPM no Windows, instale o PHP oficial (windows.php.net) ao lado do XAMPP e aponte o Apache para ele."]}),e.jsx("h2",{children:"Configuração — pools"}),e.jsx(o,{title:"/opt/lampp/etc/php-fpm.conf",language:"ini",code:`[global]
pid = /opt/lampp/var/run/php-fpm.pid
error_log = /opt/lampp/logs/php-fpm.log
log_level = notice
emergency_restart_threshold = 10
emergency_restart_interval  = 1m
process_control_timeout     = 10s

include = /opt/lampp/etc/php-fpm.d/*.conf`}),e.jsx(o,{title:"/opt/lampp/etc/php-fpm.d/www.conf",language:"ini",code:`[www]
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
env[APP_ENV] = production`}),e.jsx(s,{title:"Modos de pm",params:[{flag:"static",desc:"Sempre N processos. Previsível mas desperdiça RAM em horário ocioso."},{flag:"dynamic",desc:"Ajusta entre min/max conforme demanda. Padrão equilibrado."},{flag:"ondemand",desc:"Cria processos só quando há request. Para sites de pouco tráfego."}]}),e.jsx("h2",{children:"Dimensionando max_children"}),e.jsx(o,{title:"Regra prática",language:"text",code:`pm.max_children = (RAM_disponível) / (RAM_média_por_processo)

# Meça com:
ps -ylC php-fpm --sort:rss | awk '{sum+=$8; n++} END {print "Média KB:", sum/n}'

# Exemplo: 4 GB livres, processo médio = 80 MB
# pm.max_children = 4096 / 80 ≈ 51`}),e.jsx("h2",{children:"Ligando o Apache ao FPM"}),e.jsx("p",{children:"Linux / XAMPP — habilite mod_proxy_fcgi:"}),e.jsx(o,{title:"httpd.conf",language:"apache",code:`LoadModule proxy_module      modules/mod_proxy.so
LoadModule proxy_fcgi_module modules/mod_proxy_fcgi.so

# Em todos os sites OU em <Directory>:
<FilesMatch "\\.php$">
    SetHandler "proxy:unix:/opt/lampp/var/run/php-fpm.sock|fcgi://localhost/"
</FilesMatch>

# Para porta TCP em vez de socket:
# SetHandler "proxy:fcgi://127.0.0.1:9000"`}),e.jsxs("p",{children:["Antes disso, comente as linhas do ",e.jsx("code",{children:"php_module"})," / ",e.jsx("code",{children:"php_admin_value"})," ","do mod_php no ",e.jsx("code",{children:"httpd.conf"})," — caso contrário, ele continua atendendo PHP e o FPM nunca recebe."]}),e.jsx("h2",{children:"Múltiplos pools (sites diferentes, isolados)"}),e.jsx(o,{title:"php-fpm.d/loja.conf",language:"ini",code:`[loja]
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
php_admin_value[open_basedir] = /var/www/loja:/tmp`}),e.jsx(o,{title:"php-fpm.d/admin.conf",language:"ini",code:`[admin]
user  = admin
group = admin
listen = /var/run/php-fpm-admin.sock
chdir = /var/www/admin/public
php_admin_value[memory_limit] = 512M
php_admin_value[max_execution_time] = 300`}),e.jsx(o,{title:"Apache: cada vhost ao seu pool",language:"apache",code:`<VirtualHost *:80>
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
</VirtualHost>`}),e.jsx("h2",{children:"Status e monitoramento"}),e.jsx(o,{title:"Apache — expor pm.status_path",language:"apache",code:`<Location "/fpm-status">
    SetHandler "proxy:unix:/opt/lampp/var/run/php-fpm.sock|fcgi://localhost/"
    Require ip 127.0.0.1
</Location>

<Location "/ping">
    SetHandler "proxy:unix:/opt/lampp/var/run/php-fpm.sock|fcgi://localhost/"
    Require ip 127.0.0.1
</Location>`}),e.jsx(o,{language:"bash",code:`curl http://localhost/fpm-status
# pool:                 www
# process manager:      dynamic
# accepted conn:        4823
# listen queue:         0
# idle processes:       3
# active processes:     2
# total processes:      5

curl http://localhost/fpm-status?full   # detalhe por processo
curl http://localhost/fpm-status?json   # parseável`}),e.jsx("h2",{children:"Slow log do FPM"}),e.jsx(o,{language:"ini",code:`request_slowlog_timeout = 5s
slowlog = /opt/lampp/logs/fpm-slow.log`}),e.jsx("p",{children:"Cada request que passar de 5s gera um stacktrace completo no log:"}),e.jsx(o,{language:"text",code:`[03-May-2026 14:31:11] [pool www] pid 4392
script_filename = /var/www/loja/public/relatorio.php
[0x7fff...]  PDOStatement->execute() /var/www/loja/src/Repo.php:42
[0x7fff...]  Repo->totalMensal()      /var/www/loja/src/Controller.php:18
[0x7fff...]  Controller->index()      /var/www/loja/public/relatorio.php:8`}),e.jsx("h2",{children:"Restart sem dropar"}),e.jsx(o,{language:"bash",code:`# Reload config sem matar requests em curso
sudo kill -USR2 $(cat /opt/lampp/var/run/php-fpm.pid)

# Restart total
sudo /opt/lampp/lampp restartphp-fpm`}),e.jsx("h2",{children:"OPcache + FPM"}),e.jsx(o,{title:"php.ini",language:"ini",code:`opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0       # produção: invalida só com restart
opcache.preload=/var/www/loja/preload.php  ; PHP 7.4+ — pré-carrega classes`}),e.jsx("h2",{children:"FPM x Nginx (referência)"}),e.jsx(o,{title:"nginx.conf",language:"nginx",code:`server {
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
}`}),e.jsxs(a,{type:"warning",title:"Permissões do socket",children:["Erro ",e.jsx("code",{children:"connect() to unix:... failed (13: Permission denied)"}),": o usuário do Apache (daemon / www-data) não pode ler o socket. Ajuste"," ",e.jsx("code",{children:"listen.owner"})," / ",e.jsx("code",{children:"listen.group"})," / ",e.jsx("code",{children:"listen.mode"})," no pool."]}),e.jsx("h2",{children:"Receita: migrando do mod_php sem dor"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Backup do ",e.jsx("code",{children:"httpd.conf"})," e ",e.jsx("code",{children:"php.ini"}),"."]}),e.jsx("li",{children:"Instale e suba o php-fpm ao lado, sem mexer no Apache."}),e.jsxs("li",{children:["Teste: ",e.jsx("code",{children:"SCRIPT_NAME=/info.php REQUEST_METHOD=GET cgi-fcgi -bind -connect /var/run/php-fpm.sock"})]}),e.jsx("li",{children:"Crie um vhost de teste só para uma rota apontando para o FPM. Valide."}),e.jsxs("li",{children:["Comente o ",e.jsx("code",{children:"LoadModule php_module"}),", mude o ",e.jsx("code",{children:"FilesMatch"})," global para FPM."]}),e.jsx("li",{children:"Restart do Apache. Se algo quebrar, é só reverter os comentários."})]}),e.jsx("h2",{children:"Armadilhas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Esquecer ",e.jsx("code",{children:"SetHandler"})," em algum vhost — esse vhost continua usando mod_php (se ainda carregado) ou serve o ",e.jsx("code",{children:".php"})," como texto plano."]}),e.jsxs("li",{children:["Pool com ",e.jsx("code",{children:"user = root"})," = vulnerabilidade. Crie usuário dedicado por site."]}),e.jsxs("li",{children:[e.jsx("code",{children:"request_terminate_timeout"})," menor que ",e.jsx("code",{children:"max_execution_time"})," do PHP — request morre sem stack trace bonito. Mantenha o do FPM um pouco maior."]}),e.jsxs("li",{children:["Editar ",e.jsx("code",{children:"php.ini"})," e esquecer de restart do FPM — Apache não basta."]})]})]})}export{c as default};
