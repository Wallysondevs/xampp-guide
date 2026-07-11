import{j as e}from"./index-BreI0dyu.js";import{P as s,A as o}from"./AlertBox-C_bJKc46.js";import{C as a}from"./CodeBlock-D0rWxPIU.js";import{P as r}from"./ParamsTable-DyRs6_CQ.js";import{P as i}from"./PracticeBox-BV05Hsfh.js";import"./circle-alert-_acnmM4q.js";function u(){return e.jsxs(s,{title:"Senha do root e gestão de usuários no MariaDB",subtitle:"Por que o XAMPP entrega senha vazia, como criar usuários com privilégios mínimos, plugins de autenticação (mysql_native_password vs unix_socket), recuperar senha esquecida e integrar tudo com phpMyAdmin.",difficulty:"intermediario",timeToRead:"13 min",children:[e.jsxs(o,{type:"info",title:"Pré-requisitos",children:["XAMPP rodando, MySQL iniciado, capítulo de"," ",e.jsx("a",{href:"#/phpmyadmin",children:"phpMyAdmin"})," lido. Saber abrir terminal/CMD com privilégio de administrador."]}),e.jsx("h2",{children:"Glossário rápido"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Conta (account)"})," — par ",e.jsx("code",{children:"'usuario'@'host'"}),"."," ",e.jsx("code",{children:"'root'@'localhost'"})," e ",e.jsx("code",{children:"'root'@'%'"})," são duas contas ",e.jsx("em",{children:"diferentes"}),". O host pode ser nome (",e.jsx("code",{children:"'app.local'"}),"), IP, ou wildcard ",e.jsx("code",{children:"%"})," (qualquer)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Privilégio"})," — permissão para executar uma operação (SELECT, INSERT, CREATE, DROP, GRANT…). Pode ser global, por banco, por tabela ou por coluna."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Authentication plugin"})," — método de validar a senha. No MariaDB moderno: ",e.jsx("code",{children:"mysql_native_password"})," (clássico),"," ",e.jsx("code",{children:"ed25519"})," (mais seguro, padrão recente),"," ",e.jsx("code",{children:"unix_socket"})," (sem senha — autentica pelo usuário do SO, comum em Linux)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"FLUSH PRIVILEGES"})," — recarrega as tabelas de permissão (",e.jsx("code",{children:"mysql.user"}),", etc.) na memória do servidor. Necessário se você editar essas tabelas com INSERT/UPDATE direto. Comandos ",e.jsx("code",{children:"GRANT"}),"/",e.jsx("code",{children:"CREATE USER"})," já fazem o flush automaticamente."]}),e.jsxs(o,{type:"warning",title:"Por que XAMPP entrega senha vazia?",children:['Para acelerar o "primeiro contato". Se você só estuda local, deixar vazio é OK ',e.jsx("strong",{children:"desde que"})," o MariaDB esteja com"," ",e.jsx("code",{children:"bind-address = 127.0.0.1"})," (padrão XAMPP). Não está exposto à internet. Mas se for criar senha, faça do jeito certo — esqueceu de avisar o phpMyAdmin? Ele para de abrir."]}),e.jsx("h2",{children:"1. Mudar a senha pelo phpMyAdmin"}),e.jsx(i,{title:"Definir senha de root pelo phpMyAdmin",goal:"Mudar a senha do usuário root@localhost com a interface gráfica.",steps:["Abra http://localhost/phpmyadmin","Clique na aba 'Contas de usuários' no topo","Encontre a linha do usuário 'root' / Host 'localhost'","Clique em 'Editar privilégios' nesta linha","No topo da página, clique em 'Mudar senha'","Digite uma senha forte e clique em 'Executar'"],verify:"Aparece a mensagem 'A senha foi alterada para...'."}),e.jsx("h2",{children:"2. Avise o phpMyAdmin sobre a nova senha"}),e.jsxs("p",{children:["Logo depois do passo 1, o phpMyAdmin vai dar erro 1045 (Access denied) ao recarregar — ele tenta conectar com a senha antiga (vazia). Edite"," ",e.jsx("code",{children:"C:/xampp/phpMyAdmin/config.inc.php"}),":"]}),e.jsx(a,{language:"php",code:`/* Authentication type and info */
$cfg['Servers'][$i]['auth_type']     = 'config';
$cfg['Servers'][$i]['user']          = 'root';
$cfg['Servers'][$i]['password']      = 'sua_senha_aqui';   // ← preencha
$cfg['Servers'][$i]['extension']     = 'mysqli';
$cfg['Servers'][$i]['AllowNoPassword'] = false;            // ← agora false`}),e.jsx("p",{children:"Salve. Recarregue o phpMyAdmin — entra normalmente."}),e.jsxs(o,{type:"info",title:"Mais seguro: auth_type = 'cookie'",children:["Em vez de salvar a senha no ",e.jsx("code",{children:"config.inc.php"}),", use"," ",e.jsx("code",{children:"auth_type = 'cookie'"}),". O phpMyAdmin pedirá login na tela e guardará o token só na sessão do navegador.",e.jsx(a,{language:"php",code:`$cfg['Servers'][$i]['auth_type']  = 'cookie';
$cfg['Servers'][$i]['user']       = '';
$cfg['Servers'][$i]['password']   = '';
$cfg['blowfish_secret']           = 'qualquer_string_aleatoria_de_32+_chars';`})]}),e.jsx("h2",{children:"3. Mudar a senha por SQL (root e qualquer outro usuário)"}),e.jsx(a,{language:"sql",code:`-- MariaDB / MySQL 8.x — sintaxe oficial atual
ALTER USER 'root'@'localhost' IDENTIFIED BY 'nova_senha_segura';

-- Sintaxe legada (ainda funciona)
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('nova_senha');

-- Trocar a SUA própria senha (do usuário logado)
SET PASSWORD = PASSWORD('minha_nova');

-- Confirmar
SELECT user, host, plugin FROM mysql.user;`}),e.jsx("h2",{children:"4. Esqueci a senha do root!"}),e.jsxs("p",{children:["Acontece. A maneira oficial é parar o MariaDB e iniciar em modo"," ",e.jsx("code",{children:"--skip-grant-tables"})," (sem autenticação):"]}),e.jsx(a,{language:"bash",code:`# 1. Pare o MySQL pelo painel

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

# 5. Pare o mysqld da primeira janela (Ctrl+C) e inicie normal pelo painel`}),e.jsx("h2",{children:"5. Plugins de autenticação"}),e.jsx("p",{children:"O MariaDB suporta vários plugins. Cada conta usa um. Você pode listar e mudar:"}),e.jsx(a,{language:"sql",code:`-- Ver plugin de cada conta
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
ALTER USER 'root'@'localhost' IDENTIFIED VIA unix_socket;`}),e.jsxs(o,{type:"info",title:"Compatibilidade do PHP com plugins",children:["O driver ",e.jsx("code",{children:"mysqli"})," e ",e.jsx("code",{children:"pdo_mysql"})," do PHP suportam ",e.jsx("code",{children:"mysql_native_password"})," e"," ",e.jsx("code",{children:"caching_sha2_password"})," (MySQL 8 default). Para"," ",e.jsx("code",{children:"ed25519"})," precisa de driver atualizado. No XAMPP padrão, prefira ",e.jsx("code",{children:"mysql_native_password"})," para evitar dor de cabeça."]}),e.jsx("h2",{children:"6. Criar usuário separado (recomendado para projetos)"}),e.jsxs("p",{children:["Em vez de o seu projeto usar ",e.jsx("code",{children:"root"}),", crie um usuário dedicado com ",e.jsx("strong",{children:"apenas"})," os privilégios que ele precisa (princípio do menor privilégio):"]}),e.jsx(a,{language:"sql",code:`-- Criar usuário com plugin nativo
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
SHOW GRANTS FOR 'loja_app'@'localhost';`}),e.jsx("h2",{children:"Privilégios — o catálogo completo"}),e.jsx(r,{title:"Privilégios MariaDB mais usados",params:[{flag:"ALL PRIVILEGES",desc:"Tudo (exceto GRANT). Atalho perigoso — só se realmente quiser."},{flag:"SELECT",desc:"Ler dados (SELECT)."},{flag:"INSERT",desc:"Inserir registros."},{flag:"UPDATE",desc:"Atualizar registros existentes."},{flag:"DELETE",desc:"Apagar registros."},{flag:"CREATE",desc:"Criar tabelas/views/databases."},{flag:"DROP",desc:"Apagar tabelas/views/databases."},{flag:"ALTER",desc:"ALTER TABLE / ALTER DATABASE."},{flag:"INDEX",desc:"CREATE/DROP INDEX."},{flag:"REFERENCES",desc:"Criar foreign keys que apontam para esta tabela."},{flag:"EXECUTE",desc:"Executar stored procedures e functions."},{flag:"CREATE ROUTINE / ALTER ROUTINE",desc:"Criar/alterar stored procs."},{flag:"TRIGGER",desc:"Criar/dropar triggers."},{flag:"CREATE VIEW / SHOW VIEW",desc:"Mexer com views."},{flag:"GRANT OPTION",desc:"Permissão para dar permissões a outros (super-perigoso, root only)."},{flag:"PROCESS / SUPER / RELOAD / SHUTDOWN",desc:"Privilégios administrativos. NÃO dê para conta de aplicação."}]}),e.jsx("h2",{children:"Sintaxe de GRANT — todos os escopos"}),e.jsx(a,{language:"sql",code:`-- Escopo: tabela específica
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
RENAME USER 'app'@'localhost' TO 'app2'@'localhost';`}),e.jsx("h2",{children:"Inspecionar permissões"}),e.jsx(a,{language:"sql",code:`-- Permissões do usuário X
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
FROM information_schema.processlist;`}),e.jsx("h2",{children:"Conectando do PHP"}),e.jsx(a,{language:"php",code:`<?php
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
mysqli_set_charset($conn, 'utf8mb4');`}),e.jsx("h2",{children:"Senha em ambiente real — .env"}),e.jsxs("p",{children:["Em produção, a senha do banco ",e.jsx("strong",{children:"nunca"})," vai no código — vai em variável de ambiente:"]}),e.jsx(a,{language:"bash",code:`# .env (na raiz do projeto)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=loja
DB_USER=loja_app
DB_PASS=senha_super_forte_e_unica_aqui`}),e.jsx(a,{language:"php",code:`<?php
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
// Agora acessa via $_ENV['DB_HOST'] ou getenv('DB_HOST')`}),e.jsxs(o,{type:"danger",title:"Nunca commite .env",children:["Coloque ",e.jsx("code",{children:".env"})," no ",e.jsx("code",{children:".gitignore"}),". Se já commitou com senha, troque a senha imediatamente — git history é forever."]}),e.jsx("h2",{children:"Hardening final (mesmo em XAMPP local)"}),e.jsx(a,{language:"sql",code:`-- 1. Remover usuário anônimo (se existir)
DROP USER ''@'localhost';
DROP USER ''@'%';

-- 2. Remover acesso remoto do root
DROP USER 'root'@'%';
DROP USER 'root'@'::1';   -- IPv6 loopback se não precisar

-- 3. Remover banco de teste
DROP DATABASE IF EXISTS test;

-- 4. Aplicar
FLUSH PRIVILEGES;`})]})}export{u as default};
