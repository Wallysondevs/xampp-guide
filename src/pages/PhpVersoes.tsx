import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function PhpVersoes() {
  return (
    <PageContainer
      title="Trocando a versão do PHP no XAMPP"
      subtitle="Política de versionamento do PHP, ciclo de vida (active/security/EOL), 4 estratégias para rodar múltiplas versões no XAMPP, e o que mudou em PHP 8.2/8.3/8.4."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Capítulos de <a href="#/php-ini">php.ini</a> e{" "}
        <a href="#/php-extensoes">extensões</a> lidos. Saber editar
        <code>httpd.conf</code>. Espaço em disco — cada PHP novo ocupa ~80
        MB.
      </AlertBox>

      <h2>Política de versões do PHP</h2>
      <p>O PHP segue versionamento semântico (MAJOR.MINOR.PATCH) e mantém:</p>
      <ul>
        <li><strong>2 anos de suporte ativo</strong> — bugs e features.</li>
        <li><strong>+1 ano só de bug críticos e segurança</strong>.</li>
        <li>Depois disso a versão entra em EOL (End Of Life) — sem nenhum patch.</li>
      </ul>
      <ParamsTable
        title="Versões do PHP em maio/2026 (consulte php.net/supported-versions.php)"
        params={[
          { flag: "PHP 8.4", desc: "Suporte ativo até nov/2026; segurança até dez/2028. Última stable. Property hooks, asymmetric visibility." },
          { flag: "PHP 8.3", desc: "Suporte ativo até nov/2025; segurança até dez/2027. Typed class constants, json_validate()." },
          { flag: "PHP 8.2", desc: "Apenas segurança até dez/2026. Readonly classes, DNF types, traits constants." },
          { flag: "PHP 8.1", desc: "EOL desde dez/2025. Não use mais." },
          { flag: "PHP 8.0 / 7.4", desc: "EOL há tempos. Manter código rodando aqui é débito de segurança." },
        ]}
      />

      <h2>Glossário rápido</h2>
      <p>
        <strong>SAPI handler</strong> — o jeito que o PHP é injetado no
        Apache. No XAMPP Windows é <code>mod_php</code>{" "}
        (<code>php8apache2_4.dll</code>). No Linux moderno em produção é{" "}
        <code>php-fpm</code> via <code>mod_proxy_fcgi</code>.
      </p>
      <p>
        <strong>FastCGI / FPM</strong> — modo onde o PHP roda como processo
        separado e o Apache fala com ele via socket. Permite versões
        diferentes em vhosts diferentes (mesma estratégia do cPanel).
      </p>
      <p>
        <strong>Build do PHP</strong> — combinação versão + arquitetura
        (x86/x64) + TS/NTS + compilador (VS16/VS17). O XAMPP Windows usa
        <strong>x64 + TS + VS17</strong>.
      </p>

      <h2>Como o XAMPP entrega versões</h2>
      <p>
        Cada instalador do XAMPP traz uma única versão do PHP. A página de
        downloads em apachefriends.org/download.html disponibiliza
        instaladores separados para cada MINOR (8.0, 8.1, 8.2, 8.3, 8.4) —
        tudo no mesmo formato XAMPP.
      </p>

      <h2>Estratégia 1 — instalar XAMPP em pastas separadas (mais seguro)</h2>
      <p>
        Cada versão do XAMPP em sua própria pasta. Inicie só o que precisar
        — eles não brigam <strong>desde que</strong> as portas (80, 443,
        3306) não estejam em uso simultâneo.
      </p>
      <PracticeBox
        title="Dois XAMPPs lado a lado"
        goal="Rodar XAMPP com PHP 8.4 e XAMPP com PHP 7.4 sem conflito."
        steps={[
          "Instale o XAMPP atual em C:/xampp84",
          "Baixe outro instalador (ex.: PHP 7.4) em apachefriends.org",
          "Instale na pasta C:/xampp74",
          "Mude as portas do segundo: Apache para 8080/8443, MySQL para 3307",
          "Use o painel do XAMPP correto para cada projeto",
          "(Opcional) Crie atalhos no Desktop para cada xampp-control.exe",
        ]}
        verify="Os dois Apaches respondem em portas diferentes (http://localhost vs http://localhost:8080)."
      />
      <p>
        <strong>Custo</strong>: ~500 MB cada. <strong>Vantagem</strong>:
        zero risco de bagunça.
      </p>

      <h2>Estratégia 2 — trocar a pasta php inteira</h2>
      <p>É o mais simples e funciona pra um projeto por vez:</p>
      <PracticeBox
        title="Instalar PHP 7.4 lado a lado com a versão atual"
        goal="Manter a pasta atual e poder alternar entre versões renomeando-a."
        steps={[
          "Baixe o ZIP do PHP em windows.php.net/download — pegue a versão 7.4.x VC15 x64 Thread Safe",
          "Extraia para C:/xampp/php-7.4",
          "Renomeie a pasta atual: C:/xampp/php → C:/xampp/php-8.4",
          "Para usar o 7.4, renomeie: C:/xampp/php-7.4 → C:/xampp/php",
          "Copie o php.ini-production de dentro da nova pasta para php.ini e habilite as extensões que você usa",
          "Reinicie o Apache",
          "Verifique abrindo http://localhost/dashboard/phpinfo.php",
        ]}
        verify="A página phpinfo() mostra 'PHP Version 7.4.x' no topo."
      />

      <AlertBox type="warning" title="Cuidado com módulo do Apache">
        Cada versão do PHP traz seu próprio <code>php8apache2_4.dll</code>{" "}
        ou <code>php7apache2_4.dll</code>. Em <code>httpd-xampp.conf</code>{" "}
        (na pasta <code>apache/conf/extra/</code>), o Apache faz o
        LoadModule apontando para esse arquivo. Se você trocar a versão e
        o nome do .dll mudar, edite o LoadModule:
        <CodeBlock language="apache" code={`# Antes (PHP 8.x):
LoadModule php_module "C:/xampp/php/php8apache2_4.dll"
PHPIniDir "C:/xampp/php"

# Depois (PHP 7.x):
LoadModule php7_module "C:/xampp/php/php7apache2_4.dll"
PHPIniDir "C:/xampp/php"`} />
      </AlertBox>

      <h2>Estratégia 3 — duas versões via FastCGI por VHost</h2>
      <p>
        Mais avançado: cada virtual host roda em uma versão diferente.
        Use FastCGI:
      </p>
      <CodeBlock language="apache" code={`# httpd-xampp.conf
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
</VirtualHost>`} />
      <p>
        É bem mais trabalhoso e quebra fácil. Para a maioria dos casos, a
        Estratégia 1 ou 2 é mais prática.
      </p>

      <h2>Estratégia 4 — Docker (recomendado para projetos sérios)</h2>
      <p>
        Quando você precisa de múltiplas versões + isolamento + deploy
        idêntico, abandone o XAMPP e use Docker. Cada projeto tem seu{" "}
        <code>docker-compose.yml</code> com a versão exata de PHP/MySQL/etc.
      </p>
      <CodeBlock language="yaml" code={`# docker-compose.yml minimal
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
      MYSQL_DATABASE: app`} />
      <p>
        Para aprender mais, fica como sugestão de próximo passo (não cabe
        neste guia de XAMPP).
      </p>

      <h2>Como alternar rapidamente — script .bat (Estratégia 2)</h2>
      <p>Para automatizar a Estratégia 2, salve estes arquivos em <code>C:/xampp</code>:</p>
      <CodeBlock title="usar-php74.bat" language="bat" code={`@echo off
echo Parando Apache...
C:\\xampp\\xampp_stop.exe

cd /d C:\\xampp
ren php php-temp
ren php-7.4 php
ren php-temp php-8.4

echo PHP 7.4 ativo. Iniciando Apache...
C:\\xampp\\xampp_start.exe
pause`} />
      <CodeBlock title="usar-php84.bat" language="bat" code={`@echo off
echo Parando Apache...
C:\\xampp\\xampp_stop.exe

cd /d C:\\xampp
ren php php-temp
ren php-8.4 php
ren php-temp php-7.4

echo PHP 8.4 ativo. Iniciando Apache...
C:\\xampp\\xampp_start.exe
pause`} />

      <AlertBox type="info" title="No CLI, mude o PATH">
        O comando <code>php</code> no terminal só aponta para a versão
        que está em <code>C:/xampp/php/php.exe</code>. Após alternar,
        abra um novo terminal — o antigo pode ter cache do PATH.
      </AlertBox>

      <h2>Atenção com Composer e dependências</h2>
      <p>
        Cada versão do PHP tem seu próprio <code>vendor/</code>. Se você
        roda <code>composer install</code> no PHP 8.4 e depois troca para
        o PHP 7.4, alguns pacotes podem reclamar de versão mínima. O
        <code>composer.json</code> declara essa restrição:
      </p>
      <CodeBlock language="json" code={`{
    "require": {
        "php": "^8.2",
        "laravel/framework": "^11.0"
    }
}`} />
      <p>
        O ideal é manter <code>composer.json</code> coerente com a versão
        do PHP usada no projeto e refazer{" "}
        <code>composer install --ignore-platform-reqs=ext-* --no-cache</code>{" "}
        quando necessário.
      </p>

      <h2>Mudanças relevantes por versão (resumo das migration guides)</h2>
      <p><strong>PHP 8.4 (2024):</strong></p>
      <ul>
        <li><strong>Property hooks</strong> — getters/setters nativos (estilo C# / Swift).</li>
        <li><strong>Asymmetric visibility</strong> — <code>public private(set)</code>.</li>
        <li><strong>new MyClass()-&gt;method()</strong> — sem parênteses extras.</li>
        <li>Atributo <code>#[\Deprecated]</code>.</li>
        <li>Funções array_find/array_find_key/array_any/array_all.</li>
      </ul>
      <p><strong>PHP 8.3 (2023):</strong></p>
      <ul>
        <li><strong>Typed class constants</strong>.</li>
        <li><strong>json_validate()</strong> — sem precisar try/catch.</li>
        <li><code>#[\Override]</code> garante que o método sobrescreve um da superclasse.</li>
      </ul>
      <p><strong>PHP 8.2 (2022):</strong></p>
      <ul>
        <li><strong>Readonly classes</strong> — <code>readonly class Foo</code>.</li>
        <li><strong>DNF types</strong> — <code>(A&amp;B)|null</code>.</li>
        <li><strong>true/false/null</strong> como tipos individuais.</li>
        <li>Constants em <strong>traits</strong>.</li>
        <li><strong>Deprecation</strong> de propriedades dinâmicas.</li>
      </ul>
      <p>
        Para detalhes completos, leia as migration guides em php.net (existe
        versão PT-BR).
      </p>

      <h2>Diagnóstico</h2>
      <CodeBlock language="bash" code={`# Versão do PHP no CLI
php -v

# Versão do PHP que o Apache carrega
# → http://localhost/dashboard/phpinfo.php (procure no topo)

# Quais módulos cada um carrega
php -m              ; CLI
# E na phpinfo() para o Apache

# Quais php.ini cada um carrega
php --ini           ; CLI
# E o "Loaded Configuration File" da phpinfo() para o Apache`} />
    </PageContainer>
  );
}
