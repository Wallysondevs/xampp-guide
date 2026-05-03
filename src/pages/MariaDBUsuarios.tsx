import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function MariaDBUsuarios() {
  return (
    <PageContainer
      title="Usuários, GRANT e Roles no MariaDB"
      subtitle="Crie usuários por aplicação, dê apenas o que precisa, use roles para reaproveitar permissões — e nunca mais use root no PHP."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <AlertBox type="info" title="Princípio">
        Cada aplicação merece um usuário com privilégio <strong>mínimo</strong>. Loja, blog,
        relatório — cada um seu user e seu banco. Se vazar, o estrago fica contido.
      </AlertBox>

      <h2>Conectando como root</h2>
      <CodeBlock
        language="bash"
        code={`# Windows
C:/xampp/mysql/bin/mysql.exe -u root -p

# Linux
/opt/lampp/bin/mysql -u root -p

# Pelo phpMyAdmin: aba SQL`}
      />

      <h2>Identidade no MariaDB: usuario@host</h2>
      <p>
        O MariaDB identifica um usuário pela tupla{" "}
        <code>'nome'@'host'</code>. <code>'app'@'localhost'</code> e <code>'app'@'%'</code> são
        usuários <strong>diferentes</strong>, com senhas e permissões independentes.
      </p>
      <ParamsTable
        title="Padrões de host"
        params={[
          { flag: "'localhost'", desc: "Conexões via socket Unix ou loopback (padrão XAMPP)." },
          { flag: "'127.0.0.1'", desc: "Conexões TCP loopback IPv4 explícitas." },
          { flag: "'%'", desc: "Qualquer IP (CUIDADO em produção)." },
          { flag: "'192.168.1.%'", desc: "Qualquer IP da subnet local." },
          { flag: "'app.empresa.com'", desc: "Hostname específico (precisa DNS reverso ativo)." },
        ]}
      />

      <h2>Criando um usuário</h2>
      <CodeBlock
        language="sql"
        code={`-- Criar (MariaDB 10.4+)
CREATE USER 'app_loja'@'localhost' IDENTIFIED BY 'senha_forte_aqui';

-- Versão antiga — funciona em todas
GRANT USAGE ON *.* TO 'app_loja'@'localhost' IDENTIFIED BY 'senha_forte_aqui';

-- Trocar senha depois
ALTER USER 'app_loja'@'localhost' IDENTIFIED BY 'nova_senha';

-- Renomear
RENAME USER 'app_loja'@'localhost' TO 'loja'@'localhost';

-- Apagar
DROP USER 'app_loja'@'localhost';`}
      />

      <h2>GRANT — dando privilégios</h2>
      <CodeBlock
        title="Padrão para uma aplicação"
        language="sql"
        code={`-- 1) Crie o banco
CREATE DATABASE loja CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2) Dê os privilégios mínimos no banco
GRANT SELECT, INSERT, UPDATE, DELETE
    ON loja.*
    TO 'app_loja'@'localhost';

-- 3) Quase nunca:  GRANT ALL — evite, dá DROP/CREATE também
-- 4) Recarrega tabelas de privilégios (necessário em algumas mudanças)
FLUSH PRIVILEGES;`}
      />

      <ParamsTable
        title="Privilégios mais usados"
        params={[
          { flag: "SELECT", desc: "Ler dados." },
          { flag: "INSERT", desc: "Inserir linhas." },
          { flag: "UPDATE", desc: "Atualizar linhas existentes." },
          { flag: "DELETE", desc: "Remover linhas." },
          { flag: "CREATE", desc: "Criar tabelas." },
          { flag: "DROP", desc: "Remover tabelas." },
          { flag: "ALTER", desc: "Alterar estrutura." },
          { flag: "INDEX", desc: "Criar/remover índices." },
          { flag: "EXECUTE", desc: "Executar stored procedures e functions." },
          { flag: "REFERENCES", desc: "Criar foreign keys." },
          { flag: "TRIGGER", desc: "Criar triggers." },
          { flag: "GRANT OPTION", desc: "Repassar próprios privilégios — use com cautela." },
          { flag: "ALL PRIVILEGES", desc: "Tudo (exceto GRANT OPTION e privilégios de admin)." },
        ]}
      />

      <h2>Granularidade</h2>
      <CodeBlock
        language="sql"
        code={`-- Banco inteiro
GRANT SELECT ON loja.* TO 'leitor'@'%';

-- Apenas uma tabela
GRANT SELECT ON loja.produtos TO 'leitor'@'%';

-- Apenas algumas colunas
GRANT SELECT (id, nome, preco) ON loja.produtos TO 'leitor'@'%';
GRANT UPDATE (preco) ON loja.produtos TO 'editor_preco'@'%';

-- Apenas uma stored procedure
GRANT EXECUTE ON PROCEDURE loja.atualizar_estoque TO 'integrador'@'%';

-- Servidor inteiro (admin)
GRANT ALL PRIVILEGES ON *.* TO 'super'@'localhost' WITH GRANT OPTION;`}
      />

      <h2>REVOKE — tirando privilégios</h2>
      <CodeBlock
        language="sql"
        code={`REVOKE INSERT, UPDATE, DELETE ON loja.* FROM 'app_loja'@'localhost';

-- Tira tudo (mas não apaga o usuário)
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'app_loja'@'localhost';

FLUSH PRIVILEGES;`}
      />

      <h2>Vendo o que existe</h2>
      <CodeBlock
        language="sql"
        code={`-- Lista de usuários
SELECT user, host, password_expired
  FROM mysql.user
 ORDER BY user;

-- Privilégios efetivos de um usuário
SHOW GRANTS FOR 'app_loja'@'localhost';

-- Privilégios do usuário atual
SHOW GRANTS;`}
      />

      <h2>Roles (MariaDB 10.0.5+)</h2>
      <p>
        Em vez de repetir GRANTs para 10 usuários, agrupe permissões em uma <strong>role</strong>.
      </p>
      <CodeBlock
        language="sql"
        code={`-- 1) Crie a role
CREATE ROLE 'r_leitor';
CREATE ROLE 'r_editor';

-- 2) Dê privilégios à role
GRANT SELECT ON loja.* TO 'r_leitor';
GRANT SELECT, INSERT, UPDATE, DELETE ON loja.* TO 'r_editor';

-- 3) Atribua a usuários
GRANT 'r_leitor' TO 'maria'@'localhost';
GRANT 'r_editor' TO 'joao'@'localhost';

-- 4) Para a role começar a valer no login, defina como padrão
SET DEFAULT ROLE 'r_editor' FOR 'joao'@'localhost';

-- O usuário também pode ativar manualmente
SET ROLE 'r_editor';

-- Listar roles
SELECT * FROM mysql.roles_mapping;`}
      />

      <h2>Política de senhas</h2>
      <CodeBlock
        title="my.ini — restrições básicas"
        language="ini"
        code={`[mysqld]
# Plugin de validação (vem desativado por padrão no XAMPP)
# Em MySQL 8 / MariaDB 10.6+ existe o cracklib_password_check
# Aqui o caminho é forçar via política de criação manual.

# Máximo de tentativas erradas antes de bloquear (MariaDB 10.4+)
# Não vem por padrão — instale plugin password_lock se precisar.`}
      />
      <CodeBlock
        title="Boas práticas"
        language="text"
        code={`✓ Mínimo 16 caracteres, gerada por gerenciador de senhas
✓ Diferente para cada banco/ambiente
✓ Rotacione a cada 90 dias em produção
✓ Nunca commite no Git — use .env / variáveis de ambiente
✓ Restrinja host: 'app'@'10.0.0.5' é melhor que 'app'@'%'`}
      />

      <h2>Senhas no PHP — sem hardcode</h2>
      <CodeBlock
        title=".env (fora do htdocs ou com .htaccess bloqueando)"
        language="text"
        code={`DB_HOST=127.0.0.1
DB_NAME=loja
DB_USER=app_loja
DB_PASS=senha_super_forte`}
      />
      <CodeBlock
        title="config.php"
        language="php"
        code={`<?php
$env = parse_ini_file(__DIR__ . '/../.env');
$pdo = new PDO(
    "mysql:host={$env['DB_HOST']};dbname={$env['DB_NAME']};charset=utf8mb4",
    $env['DB_USER'],
    $env['DB_PASS'],
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
    ],
);`}
      />

      <h2>Receita: aplicação leitora separada</h2>
      <CodeBlock
        language="sql"
        code={`-- App principal (CRUD)
CREATE USER 'loja_rw'@'localhost' IDENTIFIED BY 'rw_pwd';
GRANT SELECT, INSERT, UPDATE, DELETE ON loja.* TO 'loja_rw'@'localhost';

-- Dashboard / relatórios — só leitura
CREATE USER 'loja_ro'@'localhost' IDENTIFIED BY 'ro_pwd';
GRANT SELECT ON loja.* TO 'loja_ro'@'localhost';

-- Worker que só roda procedures
CREATE USER 'loja_job'@'localhost' IDENTIFIED BY 'job_pwd';
GRANT EXECUTE ON loja.* TO 'loja_job'@'localhost';

FLUSH PRIVILEGES;`}
      />

      <AlertBox type="warning" title="root@'%' = porta aberta">
        XAMPP cria <code>root@'localhost'</code> sem senha. <strong>Nunca</strong> mude o host
        para <code>'%'</code> sem trocar a senha primeiro — é convite para invasão se a porta 3306
        vazar para a rede.
      </AlertBox>

      <h2>Auditoria simples</h2>
      <CodeBlock
        language="sql"
        code={`-- Quem está conectado agora
SHOW PROCESSLIST;

-- Última vez que cada usuário logou (precisa MariaDB 10.6+)
SELECT user, host, last_login
  FROM mysql.user
 ORDER BY last_login DESC;

-- Para auditoria avançada: plugin server_audit
INSTALL SONAME 'server_audit';
SET GLOBAL server_audit_logging = ON;
SET GLOBAL server_audit_events = 'CONNECT,QUERY';`}
      />

      <h2>Armadilhas</h2>
      <ul>
        <li>
          Esquecer <code>FLUSH PRIVILEGES</code> depois de mexer direto nas tabelas{" "}
          <code>mysql.user</code>/<code>mysql.db</code> — mudanças não valem.
        </li>
        <li>
          Conceder <code>GRANT OPTION</code> a um usuário comum — ele passa a poder dar
          permissões a outros.
        </li>
        <li>
          Usar <code>'app'@'%'</code> e abrir a porta 3306 no firewall: scanners da internet
          tentam credenciais fracas em segundos.
        </li>
        <li>
          Reusar senha do root para o <code>app</code>. Se o app vazar, vazou tudo.
        </li>
      </ul>
    </PageContainer>
  );
}
