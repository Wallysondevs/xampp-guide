import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function ErrosComuns() {
  return (
    <PageContainer
      title="Erros mais comuns do XAMPP — e como resolver"
      subtitle="Receituário rápido para os tropeços do dia a dia. Mensagem do erro → causa provável → comando para resolver."
      difficulty="iniciante"
      timeToRead="14 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Saber abrir o painel do XAMPP, navegar pelo terminal/PowerShell e
        editar arquivos <code>.ini</code> e <code>.conf</code>. Conhecer o
        caminho do log do Apache (
        <code>C:/xampp/apache/logs/error.log</code>) e do MySQL (
        <code>C:/xampp/mysql/data/mysql_error.log</code>) acelera demais o
        diagnóstico.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>error.log</strong> — arquivo de texto onde o Apache grava
        erros do servidor e do PHP (quando <code>log_errors = On</code>).
      </p>
      <p>
        <strong>InnoDB</strong> — engine padrão do MySQL/MariaDB, com
        suporte a transações e crash recovery. A maioria dos erros de
        "MySQL não sobe" envolve recuperação dela.
      </p>
      <p>
        <strong>PID</strong> (Process ID) — número que o sistema dá a cada
        processo rodando. Usado para matar/identificar quem ocupa uma
        porta.
      </p>
      <p>
        <strong>mod_rewrite</strong> — módulo do Apache que reescreve URLs
        (URLs amigáveis). Sem ele, frameworks PHP como Laravel/Slim não
        funcionam.
      </p>
      <p>
        <strong>Charset / Collation</strong> — codificação dos caracteres
        (UTF-8) e regras de comparação. Inconsistência causa o famoso
        "Ã©".
      </p>

      <p>
        Este capítulo é seu primeiro lugar para olhar quando algo dá
        errado. Os problemas mais comuns têm soluções de 1 minuto. Para
        cada erro, mostramos a mensagem que aparece, a causa mais
        provável e o que digitar para resolver.
      </p>

      <h2>"Apache shutdown unexpectedly"</h2>
      <p>
        Mensagem completa típica:{" "}
        <code>"Apache shutdown unexpectedly. This may be due to a blocked
        port, missing dependencies, or improper privileges."</code>
      </p>
      <AlertBox type="danger" title="Causa #1 — Porta 80 ocupada">
        Outro programa está usando a 80. Veja{" "}
        <a href="#/portas-conflitos">Conflitos de portas</a>. Soluções:
        parar o IIS / desinstalar o Skype antigo / fechar Docker Desktop /
        mudar a porta do Apache para 8080.
        <CodeBlock language="powershell" code={`# Quem está na 80?
netstat -ano | findstr :80
tasklist /FI "PID eq <numero>"`} />
      </AlertBox>
      <AlertBox type="warning" title="Causa #2 — Erro no httpd.conf">
        Algum erro de sintaxe que você acabou de digitar.
        <CodeBlock language="bash" code={`# Confirma se a config está válida:
C:/xampp/apache/bin/httpd.exe -t

# Saída esperada: "Syntax OK"
# Se vier um número de linha + arquivo, é onde está o erro.`} />
        Olhe também <code>apache/logs/error.log</code> e leia as 5
        últimas linhas (a causa real costuma estar nelas).
      </AlertBox>
      <AlertBox type="warning" title="Causa #3 — Faltando arquivo SSL">
        Se ativou <code>httpd-ssl.conf</code> mas o cert não existe, o
        Apache morre ao subir. Confira <code>SSLCertificateFile</code> e{" "}
        <code>SSLCertificateKeyFile</code> apontando para arquivos
        existentes.
      </AlertBox>
      <AlertBox type="warning" title="Causa #4 — VC Redistributable faltando (Windows)">
        Versões recentes do XAMPP exigem o <strong>Visual C++ 2015-2022
        Redistributable x64</strong>. Sem ele, o httpd nem inicia. Baixe
        do site da Microsoft e instale.
      </AlertBox>

      <h2>"MySQL shutdown unexpectedly"</h2>
      <AlertBox type="danger" title="Causa #1 — Tabela InnoDB corrompida">
        Falta de luz, kill -9, formatar máquina com o MySQL aberto, etc.,
        podem deixar arquivos inconsistentes. Solução com cuidado:
        <CodeBlock language="text" code={`# 1. Pare o MySQL pelo painel
# 2. Faça BACKUP da pasta mysql/data/ (cópia bruta)
# 3. Edite mysql/bin/my.ini e adicione (ou descomente) na seção [mysqld]:
[mysqld]
innodb_force_recovery = 1

# 4. Inicie. Se subir, faça mysqldump de TUDO (backup):
mysqldump -u root --all-databases --single-transaction > full.sql

# 5. Pare o MySQL, tire a linha innodb_force_recovery, e reinicie.
# 6. Se a base voltou corrompida, restaure o full.sql em uma instância limpa.`} />
        Se com 1 não subir, tente 2, 3, 4 (até 6). Quanto maior, mais
        agressivo — e mais arriscado de perder dados. Acima de 4, escritas
        ficam desabilitadas (banco read-only).
      </AlertBox>
      <AlertBox type="warning" title="Causa #2 — Outro MySQL na 3306">
        Se você tem MySQL Server da Oracle instalado (vem com Workbench),
        ele e o MariaDB do XAMPP brigam pela mesma porta. Pare um dos
        dois ou mude a porta. No Windows:
        <CodeBlock language="powershell" code={`# Lista os serviços Windows com 'mysql' no nome
Get-Service | Where-Object Name -Match "mysql"

# Pare o serviço Oracle (se existir)
Stop-Service "MySQL80"`} />
      </AlertBox>
      <AlertBox type="warning" title="Causa #3 — ibdata1 / ib_logfile com tamanho diferente">
        Se você mexeu em <code>innodb_log_file_size</code> no{" "}
        <code>my.ini</code>, o MariaDB pode reclamar do tamanho dos
        <code>ib_logfile0/1</code>. Pare, apague esses dois arquivos
        (mantendo <code>ibdata1</code> intacto) e suba — eles serão
        recriados.
      </AlertBox>

      <h2>phpMyAdmin: "#1045 - Access denied for user 'root'@'localhost'"</h2>
      <p>
        Você definiu uma senha pro root e não atualizou o phpMyAdmin. Veja{" "}
        <a href="#/mysql-senha-root">Senha do root</a> seção 2. Na prática:
      </p>
      <CodeBlock title="phpMyAdmin/config.inc.php" language="php" code={`$cfg['Servers'][$i]['auth_type'] = 'config';
$cfg['Servers'][$i]['user'] = 'root';
$cfg['Servers'][$i]['password'] = 'sua_senha_aqui';

# Ou para forçar tela de login (mais seguro):
$cfg['Servers'][$i]['auth_type'] = 'cookie';`} />

      <h2>phpMyAdmin: "#2002 - Não foi possível conectar"</h2>
      <p>
        O serviço do MySQL não está rodando. Painel → MySQL → Start. Se
        mesmo assim falhar, veja erro acima ("MySQL shutdown
        unexpectedly"). Em Linux, pode ser que esteja apontando para
        socket Unix em vez de TCP — defina{" "}
        <code>$cfg['Servers'][$i]['host'] = '127.0.0.1'</code>.
      </p>

      <h2>"This site can't be reached" (no navegador)</h2>
      <ul>
        <li>O Apache está realmente rodando? Painel → Apache em verde?</li>
        <li>
          Acessou a URL certa? <code>http://localhost</code> (não https —
          a menos que tenha configurado)?
        </li>
        <li>
          Se trocou pra porta 8080, escreveu{" "}
          <code>http://localhost:8080</code>?
        </li>
        <li>
          Algum antivírus / firewall corporativo bloqueando localhost?
          Teste desativando temporariamente.
        </li>
      </ul>

      <h2>"403 Forbidden — You don't have permission"</h2>
      <ul>
        <li>
          O <code>&lt;Directory&gt;</code> da pasta não tem{" "}
          <code>Require all granted</code>.
        </li>
        <li>
          Está faltando <code>index.php</code>/<code>index.html</code> na
          pasta e <code>Options Indexes</code> também não está ativo.
        </li>
        <li>
          Em Linux, permissão de leitura faltando:{" "}
          <code>chmod -R +r /opt/lampp/htdocs/projeto</code>.
        </li>
        <li>
          DocumentRoot do VirtualHost aponta para uma pasta que não
          existe (typo).
        </li>
      </ul>

      <h2>"500 Internal Server Error"</h2>
      <ul>
        <li>
          <strong>Erro de PHP fatal</strong> — abra{" "}
          <code>php/logs/php_error_log</code> ou{" "}
          <code>apache/logs/error.log</code> e leia as últimas linhas.
        </li>
        <li>
          <strong>.htaccess inválido</strong> — comente a última linha que
          adicionou e teste. Diretivas que requerem módulo não carregado
          também causam 500.
        </li>
        <li>
          <strong>Permissão de escrita faltando</strong> — Laravel/WordPress
          precisam escrever em <code>storage/</code> ou{" "}
          <code>wp-content/uploads/</code>.
        </li>
        <li>
          <strong>Sintaxe PHP quebrada</strong> — rode{" "}
          <code>php -l arquivo.php</code> para checar.
        </li>
        <li>
          <strong>Memória estourada</strong> — aumente{" "}
          <code>memory_limit</code> no <code>php.ini</code>.
        </li>
      </ul>

      <h2>"404 Not Found" em todas as URLs (exceto a raiz)</h2>
      <p>
        Quase certo: <code>mod_rewrite</code> desabilitado ou{" "}
        <code>AllowOverride None</code>.
      </p>
      <CodeBlock language="apache" code={`# httpd.conf
LoadModule rewrite_module modules/mod_rewrite.so

<Directory "C:/xampp/htdocs">
    AllowOverride All       # TEM que ser All (ou pelo menos FileInfo)
    Require all granted
</Directory>`} />
      <p>Reinicie o Apache. Em Laravel, confirme que <code>public/.htaccess</code> existe.</p>

      <h2>"upload: Maximum file size exceeded"</h2>
      <p>php.ini com upload curto:</p>
      <CodeBlock language="ini" code={`upload_max_filesize = 64M
post_max_size = 80M       # tem que ser >= upload_max_filesize
memory_limit = 256M
max_input_time = 300
max_execution_time = 300`} />
      <p>
        Reinicie o Apache. Confirme com <code>phpinfo()</code> que os
        novos valores estão ativos (e não foram sobrescritos por algum{" "}
        <code>.user.ini</code> ou <code>php_value</code> em .htaccess).
      </p>

      <h2>"Allowed memory size of N bytes exhausted"</h2>
      <p>
        Aumente <code>memory_limit</code> no <code>php.ini</code>.
        WordPress com muitos plugins precisa de pelo menos 256M; Composer
        atualizando dependências pode pedir 1G ou mais. Para casos
        pontuais (CLI):
      </p>
      <CodeBlock language="bash" code={`php -d memory_limit=-1 artisan migrate
php -d memory_limit=512M composer.phar update`} />

      <h2>Acentos viraram "Ã©" e "Ã£"</h2>
      <p>Inconsistência de charset. Padronize tudo em UTF-8:</p>
      <ParamsTable
        title="Pontos onde o charset precisa estar igual"
        params={[
          { flag: "HTML", desc: "<meta charset=\"UTF-8\"> dentro do <head>." },
          { flag: "PHP no início do script", desc: "header('Content-Type: text/html; charset=UTF-8');" },
          { flag: "php.ini", desc: "default_charset = \"UTF-8\"" },
          { flag: "my.ini ([mysqld])", desc: "character-set-server = utf8mb4 / collation-server = utf8mb4_unicode_ci" },
          { flag: "Conexão PDO", desc: "$dsn = 'mysql:host=...;dbname=...;charset=utf8mb4';" },
          { flag: "Conexão mysqli", desc: "$mysqli->set_charset('utf8mb4');" },
          { flag: "Tabelas e colunas", desc: "ALTER TABLE x CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" },
          { flag: "Arquivo PHP em si", desc: "Salve sem BOM em UTF-8 (no editor: 'Save as UTF-8 without BOM')." },
        ]}
      />
      <CodeBlock language="sql" code={`-- Para checar o charset atual
SHOW VARIABLES LIKE 'character_set%';
SHOW VARIABLES LIKE 'collation%';

-- Para um banco específico
SELECT default_character_set_name, default_collation_name
FROM information_schema.SCHEMATA WHERE schema_name = 'meu_banco';

-- Para converter tudo
ALTER DATABASE meu_banco CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`} />

      <h2>"Out of memory" no Composer</h2>
      <CodeBlock language="bash" code={`# Use o php do XAMPP com memory_limit -1
C:/xampp/php/php.exe -d memory_limit=-1 C:/path/composer.phar install

# Ou em um único comando
COMPOSER_MEMORY_LIMIT=-1 composer install`} />

      <h2>VirtualHost não funciona</h2>
      <ul>
        <li>
          Habilitou <code>Include conf/extra/httpd-vhosts.conf</code> no{" "}
          <code>httpd.conf</code>?
        </li>
        <li>Reiniciou o Apache?</li>
        <li>
          Editou o arquivo hosts <strong>como administrador</strong>?
        </li>
        <li>
          Em Windows: <code>ipconfig /flushdns</code> após editar hosts.
        </li>
        <li>
          O <code>ServerName</code> do VirtualHost confere com o que você
          está digitando no navegador?
        </li>
        <li>
          O <code>DocumentRoot</code> aponta para uma pasta que existe e
          tem permissão? E tem um <code>&lt;Directory&gt;</code>{" "}
          correspondente com <code>Require all granted</code>?
        </li>
      </ul>

      <h2>"There is already a process using port 80/443/3306"</h2>
      <CodeBlock language="powershell" code={`# Windows — descobrir quem está usando a porta
netstat -ano | findstr :80
netstat -ano | findstr :3306

# Pegar o PID e matar (substitua 1234)
taskkill /F /PID 1234

# Ou descobrir o nome do processo
tasklist /FI "PID eq 1234"`} />
      <CodeBlock language="bash" code={`# Linux/macOS — lsof
sudo lsof -i :80
sudo lsof -i :3306

# Matar
sudo kill -9 <PID>

# Ou ss (mais moderno)
sudo ss -tulpn | grep ':80'`} />

      <h2>"PHP Fatal error: Class 'Foo' not found"</h2>
      <ul>
        <li>
          Usando Composer? Esqueceu de rodar <code>composer install</code>?
          Confira <code>vendor/autoload.php</code> existindo.
        </li>
        <li>
          Esqueceu o <code>require_once 'vendor/autoload.php'</code> no
          ponto de entrada?
        </li>
        <li>
          Use namespace? O nome do arquivo tem que bater com o nome da
          classe (PSR-4): <code>App\\Models\\User</code> →{" "}
          <code>app/Models/User.php</code>.
        </li>
      </ul>

      <h2>"phpMyAdmin: o tempo de espera está esgotado"</h2>
      <p>Aumente o tempo da sessão e os limites do PHP:</p>
      <CodeBlock language="ini" code={`; php.ini
max_execution_time = 300
max_input_time = 300
memory_limit = 256M`} />
      <CodeBlock title="phpMyAdmin/config.inc.php" language="php" code={`$cfg['LoginCookieValidity'] = 3600 * 12; // 12 horas
$cfg['ExecTimeLimit'] = 0;               // sem limite para imports/exports`} />

      <AlertBox type="success" title="Quando nada do guia resolveu">
        99% dos erros do XAMPP têm o detalhe exato em{" "}
        <code>apache/logs/error.log</code> ou em{" "}
        <code>mysql/data/mysql_error.log</code>. Sempre olhe os logs antes
        de procurar no Google — costuma ter a resposta lá em uma frase.
        Comando útil para acompanhar em tempo real:
        <CodeBlock language="powershell" code={`# Windows (PowerShell 7+)
Get-Content C:\\xampp\\apache\\logs\\error.log -Wait -Tail 20

# Linux/macOS
tail -f /opt/lampp/logs/error_log`} />
      </AlertBox>
    </PageContainer>
  );
}
