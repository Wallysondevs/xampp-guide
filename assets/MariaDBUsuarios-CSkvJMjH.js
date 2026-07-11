import{j as a}from"./index-BreI0dyu.js";import{P as r,A as o}from"./AlertBox-C_bJKc46.js";import{C as e}from"./CodeBlock-D0rWxPIU.js";import{P as s}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function c(){return a.jsxs(r,{title:"Usuários, GRANT e Roles no MariaDB",subtitle:"Crie usuários por aplicação, dê apenas o que precisa, use roles para reaproveitar permissões — e nunca mais use root no PHP.",difficulty:"intermediario",timeToRead:"11 min",children:[a.jsxs(o,{type:"info",title:"Princípio",children:["Cada aplicação merece um usuário com privilégio ",a.jsx("strong",{children:"mínimo"}),". Loja, blog, relatório — cada um seu user e seu banco. Se vazar, o estrago fica contido."]}),a.jsx("h2",{children:"Conectando como root"}),a.jsx(e,{language:"bash",code:`# Windows
C:/xampp/mysql/bin/mysql.exe -u root -p

# Linux
/opt/lampp/bin/mysql -u root -p

# Pelo phpMyAdmin: aba SQL`}),a.jsx("h2",{children:"Identidade no MariaDB: usuario@host"}),a.jsxs("p",{children:["O MariaDB identifica um usuário pela tupla"," ",a.jsx("code",{children:"'nome'@'host'"}),". ",a.jsx("code",{children:"'app'@'localhost'"})," e ",a.jsx("code",{children:"'app'@'%'"})," são usuários ",a.jsx("strong",{children:"diferentes"}),", com senhas e permissões independentes."]}),a.jsx(s,{title:"Padrões de host",params:[{flag:"'localhost'",desc:"Conexões via socket Unix ou loopback (padrão XAMPP)."},{flag:"'127.0.0.1'",desc:"Conexões TCP loopback IPv4 explícitas."},{flag:"'%'",desc:"Qualquer IP (CUIDADO em produção)."},{flag:"'192.168.1.%'",desc:"Qualquer IP da subnet local."},{flag:"'app.empresa.com'",desc:"Hostname específico (precisa DNS reverso ativo)."}]}),a.jsx("h2",{children:"Criando um usuário"}),a.jsx(e,{language:"sql",code:`-- Criar (MariaDB 10.4+)
CREATE USER 'app_loja'@'localhost' IDENTIFIED BY 'senha_forte_aqui';

-- Versão antiga — funciona em todas
GRANT USAGE ON *.* TO 'app_loja'@'localhost' IDENTIFIED BY 'senha_forte_aqui';

-- Trocar senha depois
ALTER USER 'app_loja'@'localhost' IDENTIFIED BY 'nova_senha';

-- Renomear
RENAME USER 'app_loja'@'localhost' TO 'loja'@'localhost';

-- Apagar
DROP USER 'app_loja'@'localhost';`}),a.jsx("h2",{children:"GRANT — dando privilégios"}),a.jsx(e,{title:"Padrão para uma aplicação",language:"sql",code:`-- 1) Crie o banco
CREATE DATABASE loja CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2) Dê os privilégios mínimos no banco
GRANT SELECT, INSERT, UPDATE, DELETE
    ON loja.*
    TO 'app_loja'@'localhost';

-- 3) Quase nunca:  GRANT ALL — evite, dá DROP/CREATE também
-- 4) Recarrega tabelas de privilégios (necessário em algumas mudanças)
FLUSH PRIVILEGES;`}),a.jsx(s,{title:"Privilégios mais usados",params:[{flag:"SELECT",desc:"Ler dados."},{flag:"INSERT",desc:"Inserir linhas."},{flag:"UPDATE",desc:"Atualizar linhas existentes."},{flag:"DELETE",desc:"Remover linhas."},{flag:"CREATE",desc:"Criar tabelas."},{flag:"DROP",desc:"Remover tabelas."},{flag:"ALTER",desc:"Alterar estrutura."},{flag:"INDEX",desc:"Criar/remover índices."},{flag:"EXECUTE",desc:"Executar stored procedures e functions."},{flag:"REFERENCES",desc:"Criar foreign keys."},{flag:"TRIGGER",desc:"Criar triggers."},{flag:"GRANT OPTION",desc:"Repassar próprios privilégios — use com cautela."},{flag:"ALL PRIVILEGES",desc:"Tudo (exceto GRANT OPTION e privilégios de admin)."}]}),a.jsx("h2",{children:"Granularidade"}),a.jsx(e,{language:"sql",code:`-- Banco inteiro
GRANT SELECT ON loja.* TO 'leitor'@'%';

-- Apenas uma tabela
GRANT SELECT ON loja.produtos TO 'leitor'@'%';

-- Apenas algumas colunas
GRANT SELECT (id, nome, preco) ON loja.produtos TO 'leitor'@'%';
GRANT UPDATE (preco) ON loja.produtos TO 'editor_preco'@'%';

-- Apenas uma stored procedure
GRANT EXECUTE ON PROCEDURE loja.atualizar_estoque TO 'integrador'@'%';

-- Servidor inteiro (admin)
GRANT ALL PRIVILEGES ON *.* TO 'super'@'localhost' WITH GRANT OPTION;`}),a.jsx("h2",{children:"REVOKE — tirando privilégios"}),a.jsx(e,{language:"sql",code:`REVOKE INSERT, UPDATE, DELETE ON loja.* FROM 'app_loja'@'localhost';

-- Tira tudo (mas não apaga o usuário)
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'app_loja'@'localhost';

FLUSH PRIVILEGES;`}),a.jsx("h2",{children:"Vendo o que existe"}),a.jsx(e,{language:"sql",code:`-- Lista de usuários
SELECT user, host, password_expired
  FROM mysql.user
 ORDER BY user;

-- Privilégios efetivos de um usuário
SHOW GRANTS FOR 'app_loja'@'localhost';

-- Privilégios do usuário atual
SHOW GRANTS;`}),a.jsx("h2",{children:"Roles (MariaDB 10.0.5+)"}),a.jsxs("p",{children:["Em vez de repetir GRANTs para 10 usuários, agrupe permissões em uma ",a.jsx("strong",{children:"role"}),"."]}),a.jsx(e,{language:"sql",code:`-- 1) Crie a role
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
SELECT * FROM mysql.roles_mapping;`}),a.jsx("h2",{children:"Política de senhas"}),a.jsx(e,{title:"my.ini — restrições básicas",language:"ini",code:`[mysqld]
# Plugin de validação (vem desativado por padrão no XAMPP)
# Em MySQL 8 / MariaDB 10.6+ existe o cracklib_password_check
# Aqui o caminho é forçar via política de criação manual.

# Máximo de tentativas erradas antes de bloquear (MariaDB 10.4+)
# Não vem por padrão — instale plugin password_lock se precisar.`}),a.jsx(e,{title:"Boas práticas",language:"text",code:`✓ Mínimo 16 caracteres, gerada por gerenciador de senhas
✓ Diferente para cada banco/ambiente
✓ Rotacione a cada 90 dias em produção
✓ Nunca commite no Git — use .env / variáveis de ambiente
✓ Restrinja host: 'app'@'10.0.0.5' é melhor que 'app'@'%'`}),a.jsx("h2",{children:"Senhas no PHP — sem hardcode"}),a.jsx(e,{title:".env (fora do htdocs ou com .htaccess bloqueando)",language:"text",code:`DB_HOST=127.0.0.1
DB_NAME=loja
DB_USER=app_loja
DB_PASS=senha_super_forte`}),a.jsx(e,{title:"config.php",language:"php",code:`<?php
$env = parse_ini_file(__DIR__ . '/../.env');
$pdo = new PDO(
    "mysql:host={$env['DB_HOST']};dbname={$env['DB_NAME']};charset=utf8mb4",
    $env['DB_USER'],
    $env['DB_PASS'],
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
    ],
);`}),a.jsx("h2",{children:"Receita: aplicação leitora separada"}),a.jsx(e,{language:"sql",code:`-- App principal (CRUD)
CREATE USER 'loja_rw'@'localhost' IDENTIFIED BY 'rw_pwd';
GRANT SELECT, INSERT, UPDATE, DELETE ON loja.* TO 'loja_rw'@'localhost';

-- Dashboard / relatórios — só leitura
CREATE USER 'loja_ro'@'localhost' IDENTIFIED BY 'ro_pwd';
GRANT SELECT ON loja.* TO 'loja_ro'@'localhost';

-- Worker que só roda procedures
CREATE USER 'loja_job'@'localhost' IDENTIFIED BY 'job_pwd';
GRANT EXECUTE ON loja.* TO 'loja_job'@'localhost';

FLUSH PRIVILEGES;`}),a.jsxs(o,{type:"warning",title:"root@'%' = porta aberta",children:["XAMPP cria ",a.jsx("code",{children:"root@'localhost'"})," sem senha. ",a.jsx("strong",{children:"Nunca"})," mude o host para ",a.jsx("code",{children:"'%'"})," sem trocar a senha primeiro — é convite para invasão se a porta 3306 vazar para a rede."]}),a.jsx("h2",{children:"Auditoria simples"}),a.jsx(e,{language:"sql",code:`-- Quem está conectado agora
SHOW PROCESSLIST;

-- Última vez que cada usuário logou (precisa MariaDB 10.6+)
SELECT user, host, last_login
  FROM mysql.user
 ORDER BY last_login DESC;

-- Para auditoria avançada: plugin server_audit
INSTALL SONAME 'server_audit';
SET GLOBAL server_audit_logging = ON;
SET GLOBAL server_audit_events = 'CONNECT,QUERY';`}),a.jsx("h2",{children:"Armadilhas"}),a.jsxs("ul",{children:[a.jsxs("li",{children:["Esquecer ",a.jsx("code",{children:"FLUSH PRIVILEGES"})," depois de mexer direto nas tabelas"," ",a.jsx("code",{children:"mysql.user"}),"/",a.jsx("code",{children:"mysql.db"})," — mudanças não valem."]}),a.jsxs("li",{children:["Conceder ",a.jsx("code",{children:"GRANT OPTION"})," a um usuário comum — ele passa a poder dar permissões a outros."]}),a.jsxs("li",{children:["Usar ",a.jsx("code",{children:"'app'@'%'"})," e abrir a porta 3306 no firewall: scanners da internet tentam credenciais fracas em segundos."]}),a.jsxs("li",{children:["Reusar senha do root para o ",a.jsx("code",{children:"app"}),". Se o app vazar, vazou tudo."]})]})]})}export{c as default};
