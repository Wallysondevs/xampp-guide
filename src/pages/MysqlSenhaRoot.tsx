import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function MysqlSenhaRoot() {
  return (
    <PageContainer
      title="Senha do root e gestão de usuários no MariaDB"
      subtitle="Por que o XAMPP entrega senha vazia, como criar usuários com privilégios mínimos, plugins de autenticação (mysql_native_password vs unix_socket), recuperar senha esquecida e integrar tudo com phpMyAdmin."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        XAMPP rodando, MySQL iniciado, capítulo de{" "}
        <a href="#/phpmyadmin">phpMyAdmin</a> lido. Saber abrir
        terminal/CMD com privilégio de administrador.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Conta (account)</strong> — par <code>'usuario'@'host'</code>.{" "}
        <code>'root'@'localhost'</code> e <code>'root'@'%'</code> são duas
        contas <em>diferentes</em>. O host pode ser nome (
        <code>'app.local'</code>), IP, ou wildcard <code>%</code> (qualquer).
      </p>
      <p>
        <strong>Privilégio</strong> — permissão para executar uma operação
        (SELECT, INSERT, CREATE, DROP, GRANT…). Pode ser global, por banco,
        por tabela ou por coluna.
      </p>
      <p>
        <strong>Authentication plugin</strong> — método de validar a senha.
        No MariaDB moderno: <code>mysql_native_password</code> (clássico),{" "}
        <code>ed25519</code> (mais seguro, padrão recente),{" "}
        <code>unix_socket</code> (sem senha — autentica pelo usuário do
        SO, comum em Linux).
      </p>
      <p>
        <strong>FLUSH PRIVILEGES</strong> — recarrega as tabelas de
        permissão (<code>mysql.user</code>, etc.) na memória do servidor.
        Necessário se você editar essas tabelas com INSERT/UPDATE direto.
        Comandos <code>GRANT</code>/<code>CREATE USER</code> já fazem o
        flush automaticamente.
      </p>

      <AlertBox type="warning" title="Por que XAMPP entrega senha vazia?">
        Para acelerar o "primeiro contato". Se você só estuda local, deixar
        vazio é OK <strong>desde que</strong> o MariaDB esteja com{" "}
        <code>bind-address = 127.0.0.1</code> (padrão XAMPP). Não está
        exposto à internet. Mas se for criar senha, faça do jeito certo —
        esqueceu de avisar o phpMyAdmin? Ele para de abrir.
      </AlertBox>

      <h2>1. Mudar a senha pelo phpMyAdmin</h2>
      <PracticeBox
        title="Definir senha de root pelo phpMyAdmin"
        goal="Mudar a senha do usuário root@localhost com a interface gráfica."
        steps={[
          "Abra http://localhost/phpmyadmin",
          "Clique na aba 'Contas de usuários' no topo",
          "Encontre a linha do usuário 'root' / Host 'localhost'",
          "Clique em 'Editar privilégios' nesta linha",
          "No topo da página, clique em 'Mudar senha'",
          "Digite uma senha forte e clique em 'Executar'",
        ]}
        verify="Aparece a mensagem 'A senha foi alterada para...'."
      />

      <h2>2. Avise o phpMyAdmin sobre a nova senha</h2>
      <p>
        Logo depois do passo 1, o phpMyAdmin vai dar erro 1045 (Access
        denied) ao recarregar — ele tenta conectar com a senha antiga
        (vazia). Edite{" "}
        <code>C:/xampp/phpMyAdmin/config.inc.php</code>:
      </p>
      <CodeBlock language="php" code={`/* Authentication type and info */
$cfg['Servers'][$i]['auth_type']     = 'config';
$cfg['Servers'][$i]['user']          = 'root';
$cfg['Servers'][$i]['password']      = 'sua_senha_aqui';   // ← preencha
$cfg['Servers'][$i]['extension']     = 'mysqli';
$cfg['Servers'][$i]['AllowNoPassword'] = false;            // ← agora false`} />
      <p>Salve. Recarregue o phpMyAdmin — entra normalmente.</p>

      <AlertBox type="info" title="Mais seguro: auth_type = 'cookie'">
        Em vez de salvar a senha no <code>config.inc.php</code>, use{" "}
        <code>auth_type = 'cookie'</code>. O phpMyAdmin pedirá login na
        tela e guardará o token só na sessão do navegador.
        <CodeBlock language="php" code={`$cfg['Servers'][$i]['auth_type']  = 'cookie';
$cfg['Servers'][$i]['user']       = '';
$cfg['Servers'][$i]['password']   = '';
$cfg['blowfish_secret']           = 'qualquer_string_aleatoria_de_32+_chars';`} />
      </AlertBox>

      <h2>3. Mudar a senha por SQL (root e qualquer outro usuário)</h2>
      <CodeBlock language="sql" code={`-- MariaDB / MySQL 8.x — sintaxe oficial atual
ALTER USER 'root'@'localhost' IDENTIFIED BY 'nova_senha_segura';

-- Sintaxe legada (ainda funciona)
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('nova_senha');

-- Trocar a SUA própria senha (do usuário logado)
SET PASSWORD = PASSWORD('minha_nova');

-- Confirmar
SELECT user, host, plugin FROM mysql.user;`} />

      <h2>4. Esqueci a senha do root!</h2>
      <p>
        Acontece. A maneira oficial é parar o MariaDB e iniciar em modo{" "}
        <code>--skip-grant-tables</code> (sem autenticação):
      </p>
      <CodeBlock language="bash" code={`# 1. Pare o MySQL pelo painel

# 2. Abra um terminal como admin e rode:
C:/xampp/mysql/bin/mysqld --console --skip-grant-tables --skip-networking

# (skip-networking impede acesso de rede enquanto está sem auth — IMPORTANTE)

# 3. Em OUTRA janela do terminal, conecte sem senha:
C:/xampp/mysql/bin/mysql -u root

# 4. Defina a senha nova:
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'nova_senha_aqui';
FLUSH PRIVILEGES;
EXIT;

# 5. Pare o mysqld da primeira janela (Ctrl+C) e inicie normal pelo painel`} />

      <h2>5. Plugins de autenticação</h2>
      <p>
        O MariaDB suporta vários plugins. Cada conta usa um. Você pode
        listar e mudar:
      </p>
      <CodeBlock language="sql" code={`-- Ver plugin de cada conta
SELECT user, host, plugin FROM mysql.user;

-- Plugins disponíveis no servidor
SHOW PLUGINS;

-- Trocar o plugin de uma conta para mysql_native_password
ALTER USER 'app'@'localhost'
    IDENTIFIED VIA mysql_native_password
    USING PASSWORD('senha');

-- ed25519 (mais moderno, default em MariaDB recente)
INSTALL SONAME 'auth_ed25519';
ALTER USER 'app'@'localhost'
    IDENTIFIED VIA ed25519
    USING PASSWORD('senha');

-- unix_socket (Linux apenas) — sem senha, autentica pelo usuário do SO
ALTER USER 'root'@'localhost' IDENTIFIED VIA unix_socket;`} />

      <AlertBox type="info" title="Compatibilidade do PHP com plugins">
        O driver <code>mysqli</code> e <code>pdo_mysql</code> do PHP
        suportam <code>mysql_native_password</code> e{" "}
        <code>caching_sha2_password</code> (MySQL 8 default). Para{" "}
        <code>ed25519</code> precisa de driver atualizado. No XAMPP padrão,
        prefira <code>mysql_native_password</code> para evitar dor de
        cabeça.
      </AlertBox>

      <h2>6. Criar usuário separado (recomendado para projetos)</h2>
      <p>
        Em vez de o seu projeto usar <code>root</code>, crie um usuário
        dedicado com <strong>apenas</strong> os privilégios que ele
        precisa (princípio do menor privilégio):
      </p>
      <CodeBlock language="sql" code={`-- Criar usuário com plugin nativo
CREATE USER 'loja_app'@'localhost'
    IDENTIFIED WITH mysql_native_password
    BY 'senha_da_loja';

-- Dar acesso APENAS ao banco 'loja' e APENAS aos comandos necessários
GRANT SELECT, INSERT, UPDATE, DELETE
    ON loja.*
    TO 'loja_app'@'localhost';

-- Se a app rodar migrations, precisa também de DDL
GRANT CREATE, ALTER, DROP, INDEX, REFERENCES
    ON loja.*
    TO 'loja_app'@'localhost';

FLUSH PRIVILEGES;

-- Conferir
SHOW GRANTS FOR 'loja_app'@'localhost';`} />

      <h2>Privilégios — o catálogo completo</h2>
      <ParamsTable
        title="Privilégios MariaDB mais usados"
        params={[
          { flag: "ALL PRIVILEGES", desc: "Tudo (exceto GRANT). Atalho perigoso — só se realmente quiser." },
          { flag: "SELECT", desc: "Ler dados (SELECT)." },
          { flag: "INSERT", desc: "Inserir registros." },
          { flag: "UPDATE", desc: "Atualizar registros existentes." },
          { flag: "DELETE", desc: "Apagar registros." },
          { flag: "CREATE", desc: "Criar tabelas/views/databases." },
          { flag: "DROP", desc: "Apagar tabelas/views/databases." },
          { flag: "ALTER", desc: "ALTER TABLE / ALTER DATABASE." },
          { flag: "INDEX", desc: "CREATE/DROP INDEX." },
          { flag: "REFERENCES", desc: "Criar foreign keys que apontam para esta tabela." },
          { flag: "EXECUTE", desc: "Executar stored procedures e functions." },
          { flag: "CREATE ROUTINE / ALTER ROUTINE", desc: "Criar/alterar stored procs." },
          { flag: "TRIGGER", desc: "Criar/dropar triggers." },
          { flag: "CREATE VIEW / SHOW VIEW", desc: "Mexer com views." },
          { flag: "GRANT OPTION", desc: "Permissão para dar permissões a outros (super-perigoso, root only)." },
          { flag: "PROCESS / SUPER / RELOAD / SHUTDOWN", desc: "Privilégios administrativos. NÃO dê para conta de aplicação." },
        ]}
      />

      <h2>Sintaxe de GRANT — todos os escopos</h2>
      <CodeBlock language="sql" code={`-- Escopo: tabela específica
GRANT SELECT, UPDATE ON loja.produtos TO 'app'@'localhost';

-- Escopo: banco inteiro (todas as tabelas)
GRANT SELECT, INSERT, UPDATE, DELETE ON loja.* TO 'app'@'localhost';

-- Escopo: TODOS os bancos (equivalente a global)
GRANT SELECT ON *.* TO 'reporting'@'%';

-- Escopo: colunas específicas
GRANT SELECT (id, nome), UPDATE (preco) ON loja.produtos TO 'pricing'@'localhost';

-- Concedido COM possibilidade de re-conceder a outros (CUIDADO)
GRANT SELECT ON loja.* TO 'auditor'@'localhost' WITH GRANT OPTION;

-- Por host wildcard
GRANT SELECT ON loja.* TO 'app'@'192.168.0.%';   -- só rede interna

-- Revogar
REVOKE INSERT ON loja.* FROM 'app'@'localhost';

-- Apagar usuário inteiro
DROP USER 'app'@'localhost';

-- Renomear usuário
RENAME USER 'app'@'localhost' TO 'app2'@'localhost';`} />

      <h2>Inspecionar permissões</h2>
      <CodeBlock language="sql" code={`-- Permissões do usuário X
SHOW GRANTS FOR 'loja_app'@'localhost';

-- Suas próprias permissões
SHOW GRANTS;

-- Lista de TODOS os usuários
SELECT user, host, plugin, account_locked, password_expired
FROM mysql.user
ORDER BY user, host;

-- Conexões ativas (quem está logado agora?)
SHOW PROCESSLIST;
SELECT user, host, db, command, time, state
FROM information_schema.processlist;`} />

      <h2>Conectando do PHP</h2>
      <CodeBlock language="php" code={`<?php
// Padrão: PDO com prepared statements + tratamento de erro
$pdo = new PDO(
    'mysql:host=127.0.0.1;dbname=loja;charset=utf8mb4',
    'loja_app',
    'senha_da_loja',
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,  // prepares reais
    ]
);

// Mysqli (estilo procedural)
$conn = mysqli_connect('127.0.0.1', 'loja_app', 'senha_da_loja', 'loja');
mysqli_set_charset($conn, 'utf8mb4');`} />

      <h2>Senha em ambiente real — .env</h2>
      <p>
        Em produção, a senha do banco <strong>nunca</strong> vai no
        código — vai em variável de ambiente:
      </p>
      <CodeBlock language="bash" code={`# .env (na raiz do projeto)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=loja
DB_USER=loja_app
DB_PASS=senha_super_forte_e_unica_aqui`} />
      <CodeBlock language="php" code={`<?php
// Sem dependência (projeto pequeno)
$env = parse_ini_file(__DIR__ . '/.env');
$pdo = new PDO(
    "mysql:host={$env['DB_HOST']};port={$env['DB_PORT']};dbname={$env['DB_NAME']};charset=utf8mb4",
    $env['DB_USER'],
    $env['DB_PASS']
);

// Com vlucas/phpdotenv (projeto Composer)
require 'vendor/autoload.php';
$dotenv = Dotenv\\Dotenv::createImmutable(__DIR__);
$dotenv->load();
// Agora acessa via $_ENV['DB_HOST'] ou getenv('DB_HOST')`} />

      <AlertBox type="danger" title="Nunca commite .env">
        Coloque <code>.env</code> no <code>.gitignore</code>. Se já
        commitou com senha, troque a senha imediatamente — git history
        é forever.
      </AlertBox>

      <h2>Hardening final (mesmo em XAMPP local)</h2>
      <CodeBlock language="sql" code={`-- 1. Remover usuário anônimo (se existir)
DROP USER ''@'localhost';
DROP USER ''@'%';

-- 2. Remover acesso remoto do root
DROP USER 'root'@'%';
DROP USER 'root'@'::1';   -- IPv6 loopback se não precisar

-- 3. Remover banco de teste
DROP DATABASE IF EXISTS test;

-- 4. Aplicar
FLUSH PRIVILEGES;`} />
    </PageContainer>
  );
}
