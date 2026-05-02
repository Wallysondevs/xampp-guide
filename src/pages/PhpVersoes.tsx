import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function PhpVersoes() {
  return (
    <PageContainer
      title="Trocando a versão do PHP no XAMPP"
      subtitle="Trabalhar em um projeto Laravel 11 (PHP 8.3) e em um WordPress legado (PHP 7.4) no mesmo computador."
      difficulty="avancado"
      timeToRead="9 min"
    >
      <p>
        Cada instalador do XAMPP traz uma única versão do PHP. Para alternar
        entre, digamos, PHP 7.4 e PHP 8.3, você precisa instalar mais de uma
        versão lado a lado e ensinar o Apache qual usar. Tem dois caminhos:
        substituir a pasta <code>php</code> ou rodar duas versões em
        VirtualHosts diferentes.
      </p>

      <h2>Caminho 1 — trocar a pasta php inteira</h2>
      <p>É o mais simples e funciona pra um projeto por vez:</p>

      <PracticeBox
        title="Instalar PHP 7.4 lado a lado com a versão atual"
        goal="Manter a pasta atual e poder alternar entre versões renomeando-a."
        steps={[
          "Baixe o ZIP do PHP em windows.php.net/download — pegue a versão 7.4.x VC15 x64 Thread Safe.",
          "Extraia para C:/xampp/php-7.4",
          "Renomeie a pasta atual: C:/xampp/php → C:/xampp/php-8.3",
          "Para usar o 7.4, renomeie: C:/xampp/php-7.4 → C:/xampp/php",
          "Copie o php.ini-production de dentro da nova pasta para php.ini e habilite as extensões que você usa",
          "Reinicie o Apache",
          "Verifique abrindo http://localhost/dashboard/phpinfo.php",
        ]}
        verify="A página phpinfo() mostra 'PHP Version 7.4.x' no topo."
      />

      <AlertBox type="warning" title="Cuidado com módulo do Apache">
        Cada versão do PHP traz seu próprio <code>php8apache2_4.dll</code> ou{" "}
        <code>php7apache2_4.dll</code>. Em <code>httpd-xampp.conf</code> (na
        pasta <code>apache/conf/extra/</code>), o Apache faz o LoadModule
        apontando para esse arquivo. Se você trocar a versão e o nome do .dll
        mudar, edite o LoadModule.
      </AlertBox>

      <h2>Caminho 2 — duas versões ao mesmo tempo (por VHost)</h2>
      <p>
        Mais avançado: cada virtual host roda em uma versão diferente. Use
        <code>FastCGI</code>:
      </p>
      <CodeBlock language="apache" code={`# httpd-xampp.conf
# Carregue o módulo FastCGI (vem no XAMPP)
LoadModule fcgid_module modules/mod_fcgid.so

# Defina dois "wrappers" — um por versão
<IfModule mod_fcgid.c>
    FcgidInitialEnv PHPRC "C:/xampp/php-7.4"
    FcgidWrapper "C:/xampp/php-7.4/php-cgi.exe" .php-74
    FcgidWrapper "C:/xampp/php-8.3/php-cgi.exe" .php-83
    AddHandler fcgid-script .php-74 .php-83
</IfModule>

# VHost rodando PHP 7.4
<VirtualHost *:80>
    ServerName legado.local
    DocumentRoot "C:/xampp/htdocs/legado"
    <Directory "C:/xampp/htdocs/legado">
        AllowOverride All
        Require all granted
        Options +ExecCGI
        # Faz qualquer .php desta pasta rodar com php-7.4
        AddType application/x-httpd-php .php
        Action application/x-httpd-php "/cgi-bin/php-7.4.fcgi"
    </Directory>
</VirtualHost>`} />

      <p>
        É bem mais trabalhoso e quebra fácil. Para a maioria dos casos, o
        caminho 1 (renomear pastas) é mais prático.
      </p>

      <h2>Caminho 3 — versões oficiais via "XAMPP rebuilds"</h2>
      <p>
        A Apache Friends mantém em{" "}
        <a href="https://www.apachefriends.org/download.html" target="_blank" rel="noreferrer">
          apachefriends.org/download.html
        </a>{" "}
        instaladores para PHP 8.0, 8.1, 8.2 e 8.3 — todos no mesmo formato
        XAMPP. Você pode instalar um em <code>C:/xampp80</code>, outro em{" "}
        <code>C:/xampp83</code> e iniciar só o que precisar.
      </p>
      <p>
        Custa mais espaço em disco (cada um ~500 MB), mas é o jeito mais
        seguro de não bagunçar nada.
      </p>

      <h2>Como alternar rapidamente — script .bat</h2>
      <p>
        Para automatizar o caminho 1, salve estes dois arquivos no
        <code>C:/xampp</code>:
      </p>
      <CodeBlock title="usar-php74.bat" language="bat" code={`@echo off
cd /d C:\\xampp
ren php php-temp
ren php-7.4 php
ren php-temp php-8.3
echo PHP 7.4 ativo. Reinicie o Apache pelo painel!
pause`} />
      <CodeBlock title="usar-php83.bat" language="bat" code={`@echo off
cd /d C:\\xampp
ren php php-temp
ren php-8.3 php
ren php-temp php-7.4
echo PHP 8.3 ativo. Reinicie o Apache pelo painel!
pause`} />

      <AlertBox type="info" title="No CLI, mude o PATH">
        O comando <code>php</code> no terminal só aponta para a versão que
        está em <code>C:/xampp/php/php.exe</code>. Após alternar, abra um novo
        terminal — o antigo pode ter cache do PATH.
      </AlertBox>

      <h2>Atenção com Composer e dependências</h2>
      <p>
        Cada versão do PHP tem seu próprio <code>vendor/</code>. Se você roda{" "}
        <code>composer install</code> no PHP 8.3 e depois troca para o PHP
        7.4, alguns pacotes podem reclamar de versão mínima. O ideal é manter{" "}
        <code>composer.json</code> coerente com a versão do PHP usada no
        projeto e refazer <code>composer install</code> ao trocar.
      </p>
    </PageContainer>
  );
}
