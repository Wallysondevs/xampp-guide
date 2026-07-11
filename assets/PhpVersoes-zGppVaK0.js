import{j as e}from"./index-BreI0dyu.js";import{P as r,A as o}from"./AlertBox-C_bJKc46.js";import{C as a}from"./CodeBlock-D0rWxPIU.js";import{P as p}from"./ParamsTable-DyRs6_CQ.js";import{P as s}from"./PracticeBox-BV05Hsfh.js";import"./circle-alert-_acnmM4q.js";function h(){return e.jsxs(r,{title:"Trocando a versão do PHP no XAMPP",subtitle:"Política de versionamento do PHP, ciclo de vida (active/security/EOL), 4 estratégias para rodar múltiplas versões no XAMPP, e o que mudou em PHP 8.2/8.3/8.4.",difficulty:"avancado",timeToRead:"14 min",children:[e.jsxs(o,{type:"info",title:"Pré-requisitos",children:["Capítulos de ",e.jsx("a",{href:"#/php-ini",children:"php.ini"})," e"," ",e.jsx("a",{href:"#/php-extensoes",children:"extensões"})," lidos. Saber editar",e.jsx("code",{children:"httpd.conf"}),". Espaço em disco — cada PHP novo ocupa ~80 MB."]}),e.jsx("h2",{children:"Política de versões do PHP"}),e.jsx("p",{children:"O PHP segue versionamento semântico (MAJOR.MINOR.PATCH) e mantém:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"2 anos de suporte ativo"})," — bugs e features."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"+1 ano só de bug críticos e segurança"}),"."]}),e.jsx("li",{children:"Depois disso a versão entra em EOL (End Of Life) — sem nenhum patch."})]}),e.jsx(p,{title:"Versões do PHP em maio/2026 (consulte php.net/supported-versions.php)",params:[{flag:"PHP 8.4",desc:"Suporte ativo até nov/2026; segurança até dez/2028. Última stable. Property hooks, asymmetric visibility."},{flag:"PHP 8.3",desc:"Suporte ativo até nov/2025; segurança até dez/2027. Typed class constants, json_validate()."},{flag:"PHP 8.2",desc:"Apenas segurança até dez/2026. Readonly classes, DNF types, traits constants."},{flag:"PHP 8.1",desc:"EOL desde dez/2025. Não use mais."},{flag:"PHP 8.0 / 7.4",desc:"EOL há tempos. Manter código rodando aqui é débito de segurança."}]}),e.jsx("h2",{children:"Glossário rápido"}),e.jsxs("p",{children:[e.jsx("strong",{children:"SAPI handler"})," — o jeito que o PHP é injetado no Apache. No XAMPP Windows é ",e.jsx("code",{children:"mod_php"})," ","(",e.jsx("code",{children:"php8apache2_4.dll"}),"). No Linux moderno em produção é"," ",e.jsx("code",{children:"php-fpm"})," via ",e.jsx("code",{children:"mod_proxy_fcgi"}),"."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"FastCGI / FPM"})," — modo onde o PHP roda como processo separado e o Apache fala com ele via socket. Permite versões diferentes em vhosts diferentes (mesma estratégia do cPanel)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Build do PHP"})," — combinação versão + arquitetura (x86/x64) + TS/NTS + compilador (VS16/VS17). O XAMPP Windows usa",e.jsx("strong",{children:"x64 + TS + VS17"}),"."]}),e.jsx("h2",{children:"Como o XAMPP entrega versões"}),e.jsx("p",{children:"Cada instalador do XAMPP traz uma única versão do PHP. A página de downloads em apachefriends.org/download.html disponibiliza instaladores separados para cada MINOR (8.0, 8.1, 8.2, 8.3, 8.4) — tudo no mesmo formato XAMPP."}),e.jsx("h2",{children:"Estratégia 1 — instalar XAMPP em pastas separadas (mais seguro)"}),e.jsxs("p",{children:["Cada versão do XAMPP em sua própria pasta. Inicie só o que precisar — eles não brigam ",e.jsx("strong",{children:"desde que"})," as portas (80, 443, 3306) não estejam em uso simultâneo."]}),e.jsx(s,{title:"Dois XAMPPs lado a lado",goal:"Rodar XAMPP com PHP 8.4 e XAMPP com PHP 7.4 sem conflito.",steps:["Instale o XAMPP atual em C:/xampp84","Baixe outro instalador (ex.: PHP 7.4) em apachefriends.org","Instale na pasta C:/xampp74","Mude as portas do segundo: Apache para 8080/8443, MySQL para 3307","Use o painel do XAMPP correto para cada projeto","(Opcional) Crie atalhos no Desktop para cada xampp-control.exe"],verify:"Os dois Apaches respondem em portas diferentes (http://localhost vs http://localhost:8080)."}),e.jsxs("p",{children:[e.jsx("strong",{children:"Custo"}),": ~500 MB cada. ",e.jsx("strong",{children:"Vantagem"}),": zero risco de bagunça."]}),e.jsx("h2",{children:"Estratégia 2 — trocar a pasta php inteira"}),e.jsx("p",{children:"É o mais simples e funciona pra um projeto por vez:"}),e.jsx(s,{title:"Instalar PHP 7.4 lado a lado com a versão atual",goal:"Manter a pasta atual e poder alternar entre versões renomeando-a.",steps:["Baixe o ZIP do PHP em windows.php.net/download — pegue a versão 7.4.x VC15 x64 Thread Safe","Extraia para C:/xampp/php-7.4","Renomeie a pasta atual: C:/xampp/php → C:/xampp/php-8.4","Para usar o 7.4, renomeie: C:/xampp/php-7.4 → C:/xampp/php","Copie o php.ini-production de dentro da nova pasta para php.ini e habilite as extensões que você usa","Reinicie o Apache","Verifique abrindo http://localhost/dashboard/phpinfo.php"],verify:"A página phpinfo() mostra 'PHP Version 7.4.x' no topo."}),e.jsxs(o,{type:"warning",title:"Cuidado com módulo do Apache",children:["Cada versão do PHP traz seu próprio ",e.jsx("code",{children:"php8apache2_4.dll"})," ","ou ",e.jsx("code",{children:"php7apache2_4.dll"}),". Em ",e.jsx("code",{children:"httpd-xampp.conf"})," ","(na pasta ",e.jsx("code",{children:"apache/conf/extra/"}),"), o Apache faz o LoadModule apontando para esse arquivo. Se você trocar a versão e o nome do .dll mudar, edite o LoadModule:",e.jsx(a,{language:"apache",code:`# Antes (PHP 8.x):
LoadModule php_module "C:/xampp/php/php8apache2_4.dll"
PHPIniDir "C:/xampp/php"

# Depois (PHP 7.x):
LoadModule php7_module "C:/xampp/php/php7apache2_4.dll"
PHPIniDir "C:/xampp/php"`})]}),e.jsx("h2",{children:"Estratégia 3 — duas versões via FastCGI por VHost"}),e.jsx("p",{children:"Mais avançado: cada virtual host roda em uma versão diferente. Use FastCGI:"}),e.jsx(a,{language:"apache",code:`# httpd-xampp.conf
# Carregue o módulo FastCGI (vem no XAMPP)
LoadModule fcgid_module modules/mod_fcgid.so

# Defina dois "wrappers" — um por versão
<IfModule mod_fcgid.c>
    FcgidWrapper "C:/xampp/php-7.4/php-cgi.exe" .php74
    FcgidWrapper "C:/xampp/php-8.3/php-cgi.exe" .php83
    FcgidWrapper "C:/xampp/php-8.4/php-cgi.exe" .php84
    AddHandler fcgid-script .php74 .php83 .php84
</IfModule>

# VHost rodando PHP 7.4
<VirtualHost *:80>
    ServerName legado.local
    DocumentRoot "C:/xampp/htdocs/legado"
    <Directory "C:/xampp/htdocs/legado">
        AllowOverride All
        Require all granted
        Options +ExecCGI
        FcgidInitialEnv PHPRC "C:/xampp/php-7.4"
        AddType application/x-httpd-php .php
        Action application/x-httpd-php "/cgi-bin/php-7.4.fcgi"
    </Directory>
</VirtualHost>

# VHost rodando PHP 8.4
<VirtualHost *:80>
    ServerName novo.local
    DocumentRoot "C:/xampp/htdocs/novo"
    <Directory "C:/xampp/htdocs/novo">
        AllowOverride All
        Require all granted
        Options +ExecCGI
        FcgidInitialEnv PHPRC "C:/xampp/php-8.4"
        AddType application/x-httpd-php .php
        Action application/x-httpd-php "/cgi-bin/php-8.4.fcgi"
    </Directory>
</VirtualHost>`}),e.jsx("p",{children:"É bem mais trabalhoso e quebra fácil. Para a maioria dos casos, a Estratégia 1 ou 2 é mais prática."}),e.jsx("h2",{children:"Estratégia 4 — Docker (recomendado para projetos sérios)"}),e.jsxs("p",{children:["Quando você precisa de múltiplas versões + isolamento + deploy idêntico, abandone o XAMPP e use Docker. Cada projeto tem seu"," ",e.jsx("code",{children:"docker-compose.yml"})," com a versão exata de PHP/MySQL/etc."]}),e.jsx(a,{language:"yaml",code:`# docker-compose.yml minimal
services:
  app:
    image: php:8.4-apache
    ports:
      - "8080:80"
    volumes:
      - ./:/var/www/html
  db:
    image: mariadb:11.4
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: app`}),e.jsx("p",{children:"Para aprender mais, fica como sugestão de próximo passo (não cabe neste guia de XAMPP)."}),e.jsx("h2",{children:"Como alternar rapidamente — script .bat (Estratégia 2)"}),e.jsxs("p",{children:["Para automatizar a Estratégia 2, salve estes arquivos em ",e.jsx("code",{children:"C:/xampp"}),":"]}),e.jsx(a,{title:"usar-php74.bat",language:"bat",code:`@echo off
echo Parando Apache...
C:\\xampp\\xampp_stop.exe

cd /d C:\\xampp
ren php php-temp
ren php-7.4 php
ren php-temp php-8.4

echo PHP 7.4 ativo. Iniciando Apache...
C:\\xampp\\xampp_start.exe
pause`}),e.jsx(a,{title:"usar-php84.bat",language:"bat",code:`@echo off
echo Parando Apache...
C:\\xampp\\xampp_stop.exe

cd /d C:\\xampp
ren php php-temp
ren php-8.4 php
ren php-temp php-7.4

echo PHP 8.4 ativo. Iniciando Apache...
C:\\xampp\\xampp_start.exe
pause`}),e.jsxs(o,{type:"info",title:"No CLI, mude o PATH",children:["O comando ",e.jsx("code",{children:"php"})," no terminal só aponta para a versão que está em ",e.jsx("code",{children:"C:/xampp/php/php.exe"}),". Após alternar, abra um novo terminal — o antigo pode ter cache do PATH."]}),e.jsx("h2",{children:"Atenção com Composer e dependências"}),e.jsxs("p",{children:["Cada versão do PHP tem seu próprio ",e.jsx("code",{children:"vendor/"}),". Se você roda ",e.jsx("code",{children:"composer install"})," no PHP 8.4 e depois troca para o PHP 7.4, alguns pacotes podem reclamar de versão mínima. O",e.jsx("code",{children:"composer.json"})," declara essa restrição:"]}),e.jsx(a,{language:"json",code:`{
    "require": {
        "php": "^8.2",
        "laravel/framework": "^11.0"
    }
}`}),e.jsxs("p",{children:["O ideal é manter ",e.jsx("code",{children:"composer.json"})," coerente com a versão do PHP usada no projeto e refazer"," ",e.jsx("code",{children:"composer install --ignore-platform-reqs=ext-* --no-cache"})," ","quando necessário."]}),e.jsx("h2",{children:"Mudanças relevantes por versão (resumo das migration guides)"}),e.jsx("p",{children:e.jsx("strong",{children:"PHP 8.4 (2024):"})}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Property hooks"})," — getters/setters nativos (estilo C# / Swift)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Asymmetric visibility"})," — ",e.jsx("code",{children:"public private(set)"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"new MyClass()->method()"})," — sem parênteses extras."]}),e.jsxs("li",{children:["Atributo ",e.jsx("code",{children:"#[\\Deprecated]"}),"."]}),e.jsx("li",{children:"Funções array_find/array_find_key/array_any/array_all."})]}),e.jsx("p",{children:e.jsx("strong",{children:"PHP 8.3 (2023):"})}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Typed class constants"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"json_validate()"})," — sem precisar try/catch."]}),e.jsxs("li",{children:[e.jsx("code",{children:"#[\\Override]"})," garante que o método sobrescreve um da superclasse."]})]}),e.jsx("p",{children:e.jsx("strong",{children:"PHP 8.2 (2022):"})}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Readonly classes"})," — ",e.jsx("code",{children:"readonly class Foo"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"DNF types"})," — ",e.jsx("code",{children:"(A&B)|null"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"true/false/null"})," como tipos individuais."]}),e.jsxs("li",{children:["Constants em ",e.jsx("strong",{children:"traits"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Deprecation"})," de propriedades dinâmicas."]})]}),e.jsx("p",{children:"Para detalhes completos, leia as migration guides em php.net (existe versão PT-BR)."}),e.jsx("h2",{children:"Diagnóstico"}),e.jsx(a,{language:"bash",code:`# Versão do PHP no CLI
php -v

# Versão do PHP que o Apache carrega
# → http://localhost/dashboard/phpinfo.php (procure no topo)

# Quais módulos cada um carrega
php -m              ; CLI
# E na phpinfo() para o Apache

# Quais php.ini cada um carrega
php --ini           ; CLI
# E o "Loaded Configuration File" da phpinfo() para o Apache`})]})}export{h as default};
