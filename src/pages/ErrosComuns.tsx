import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function ErrosComuns() {
  return (
    <PageContainer
      title="Erros mais comuns do XAMPP — e como resolver"
      subtitle="Receituário rápido para os tropeços do dia a dia."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <p>
        Este capítulo é seu primeiro lugar para olhar quando algo dá errado.
        Os problemas mais comuns têm soluções de 1 minuto.
      </p>

      <h2>"Apache shutdown unexpectedly"</h2>
      <AlertBox type="danger" title="Causa #1 — Porta 80 ocupada">
        Outro programa está usando a 80. Veja{" "}
        <a href="#/portas-conflitos">Conflitos de portas</a>. Soluções: parar
        o IIS / desinstalar o Skype antigo / mudar a porta do Apache para 8080.
      </AlertBox>
      <AlertBox type="warning" title="Causa #2 — Erro no httpd.conf">
        Algum erro de sintaxe que você acabou de digitar.
        <CodeBlock language="bash" code={`# Confirma se a config tá válida:
C:/xampp/apache/bin/httpd.exe -t`} />
        Olhe também <code>apache/logs/error.log</code> e leia as 5 últimas linhas.
      </AlertBox>
      <AlertBox type="warning" title="Causa #3 — Faltando arquivo SSL">
        Se ativou <code>httpd-ssl.conf</code> mas o cert não existe, o Apache
        morre. Confira <code>SSLCertificateFile</code> e{" "}
        <code>SSLCertificateKeyFile</code>.
      </AlertBox>

      <h2>"MySQL shutdown unexpectedly"</h2>
      <AlertBox type="danger" title="Causa #1 — Tabela InnoDB corrompida">
        Falta de luz, kill -9, etc., podem deixar arquivos inconsistentes.
        Solução com cuidado:
        <CodeBlock language="text" code={`# Pare o MySQL pelo painel
# Edite mysql/bin/my.ini e adicione:
[mysqld]
innodb_force_recovery = 1

# Inicie. Se subir, faça mysqldump de TUDO (backup).
# Restaure os bancos em uma instância limpa.
# Tire a linha innodb_force_recovery e reinicie.`} />
        Se com 1 não subir, tente 2, 3, 4 (até 6). Quanto maior, mais agressivo
        — e mais arriscado de perder dados.
      </AlertBox>
      <AlertBox type="warning" title="Causa #2 — Outro MySQL na 3306">
        Se você tem MySQL Server da Oracle instalado (Workbench), ele e o
        MariaDB do XAMPP brigam. Pare um dos dois ou mude a porta.
      </AlertBox>

      <h2>phpMyAdmin: "#1045 - Access denied for user 'root'@'localhost'"</h2>
      <p>
        Você definiu uma senha pro root e não atualizou o phpMyAdmin. Veja{" "}
        <a href="#/mysql-senha-root">Senha do root</a> seção 2.
      </p>

      <h2>phpMyAdmin: "#2002 - Não foi possível conectar"</h2>
      <p>
        O serviço do MySQL não está rodando. Painel → MySQL → Start. Se mesmo
        assim falhar, veja erro acima ("MySQL shutdown unexpectedly").
      </p>

      <h2>"This site can't be reached" (no navegador)</h2>
      <ul>
        <li>O Apache está realmente rodando? Painel → Apache em verde?</li>
        <li>Acessou a URL certa? <code>http://localhost</code> (não https — a menos que tenha configurado)?</li>
        <li>Se trocou pra porta 8080, escreveu <code>http://localhost:8080</code>?</li>
      </ul>

      <h2>"403 Forbidden — You don't have permission"</h2>
      <ul>
        <li>O <code>&lt;Directory&gt;</code> da pasta não tem <code>Require all granted</code>.</li>
        <li>Está faltando <code>index.php</code> na pasta e <code>Options Indexes</code> também não está ativo.</li>
        <li>Em Linux, permissão de leitura faltando: <code>chmod -R +r /opt/lampp/htdocs/projeto</code>.</li>
      </ul>

      <h2>"500 Internal Server Error"</h2>
      <ul>
        <li><strong>Erro de PHP fatal</strong> — abra <code>php/logs/php_error_log</code> ou <code>apache/logs/error.log</code>.</li>
        <li><strong>.htaccess inválido</strong> — comente a última linha que adicionou e teste.</li>
        <li><strong>Permissão de escrita faltando</strong> — Laravel/WordPress precisam escrever em <code>storage/</code> ou <code>wp-content/uploads/</code>.</li>
      </ul>

      <h2>"404 Not Found" em todas as URLs (exceto a raiz)</h2>
      <p>Quase certo: <code>mod_rewrite</code> desabilitado ou <code>AllowOverride None</code>.</p>
      <CodeBlock language="apache" code={`# httpd.conf
LoadModule rewrite_module modules/mod_rewrite.so

<Directory "C:/xampp/htdocs">
    AllowOverride All       ← TEM que ser All
    Require all granted
</Directory>`} />
      <p>Reinicie o Apache.</p>

      <h2>"upload: Maximum file size exceeded"</h2>
      <p>php.ini com upload curto:</p>
      <CodeBlock language="ini" code={`upload_max_filesize = 64M
post_max_size = 80M
memory_limit = 256M`} />

      <h2>"Allowed memory size of N bytes exhausted"</h2>
      <p>
        Aumente <code>memory_limit</code> no <code>php.ini</code>. WordPress
        com muitos plugins precisa de pelo menos 256M; Composer pode pedir
        mais ainda.
      </p>

      <h2>Acentos viraram "Ã©" e "Ã£"</h2>
      <p>
        Inconsistência de charset. Padronize tudo em UTF-8:
      </p>
      <ul>
        <li>HTML: <code>&lt;meta charset="UTF-8"&gt;</code></li>
        <li>PHP no início do script: <code>header('Content-Type: text/html; charset=UTF-8');</code></li>
        <li>php.ini: <code>default_charset = "UTF-8"</code></li>
        <li>my.ini: <code>character-set-server = utf8mb4</code></li>
        <li>Conexão PDO: <code>charset=utf8mb4</code></li>
        <li>Tabelas e colunas no MySQL: <code>utf8mb4_unicode_ci</code></li>
      </ul>

      <h2>"Out of memory" no Composer</h2>
      <CodeBlock language="bash" code={`# Use o php do XAMPP com memory_limit -1
C:/xampp/php/php.exe -d memory_limit=-1 C:/path/composer.phar install`} />

      <h2>VirtualHost não funciona</h2>
      <ul>
        <li>Habilitou <code>Include conf/extra/httpd-vhosts.conf</code>?</li>
        <li>Reiniciou o Apache?</li>
        <li>Editou o arquivo hosts <strong>como administrador</strong>?</li>
        <li>Em Windows: <code>ipconfig /flushdns</code> após editar hosts.</li>
      </ul>

      <h2>"There is already a process using port 80"</h2>
      <CodeBlock language="powershell" code={`# Descobrir quem está usando
netstat -ano | findstr :80

# Pegar o PID e matar (substitua 1234)
taskkill /F /PID 1234`} />

      <AlertBox type="success" title="Quando nada do guia resolveu">
        99% dos erros do XAMPP têm o detalhe exato em{" "}
        <code>apache/logs/error.log</code> ou em{" "}
        <code>mysql/data/mysql_error.log</code>. Sempre olhe os logs antes
        de procurar no Google — costuma ter a resposta lá em uma frase.
      </AlertBox>
    </PageContainer>
  );
}
