import{j as e}from"./index-BreI0dyu.js";import{P as s,A as r}from"./AlertBox-C_bJKc46.js";import{C as a}from"./CodeBlock-D0rWxPIU.js";import{P as o}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function t(){return e.jsxs(s,{title:"Replicação Master-Replica no MariaDB",subtitle:"Como espelhar um banco em tempo real para outra instância — base para alta disponibilidade, backup ao vivo e separação de leitura/escrita.",difficulty:"avancado",timeToRead:"13 min",children:[e.jsx(r,{type:"info",title:"Casos de uso",children:"Backup contínuo sem travar o servidor principal, balancear leituras (SELECT vai para replicas), failover quando o master cair, ambiente de relatório que não atrapalha o app de produção."}),e.jsx("h2",{children:"Como funciona"}),e.jsxs("p",{children:["O ",e.jsx("strong",{children:"master"})," grava cada modificação num arquivo chamado ",e.jsx("strong",{children:"binlog"}),"(registro binário). A ",e.jsx("strong",{children:"replica"})," mantém uma thread ",e.jsx("em",{children:"I/O"})," que copia o binlog para um ",e.jsx("strong",{children:"relay log"})," local, e uma thread ",e.jsx("em",{children:"SQL"})," que aplica esse relay log no banco. O resultado: a replica é uma cópia (quase) ao vivo do master."]}),e.jsxs("p",{children:["Há dois modos: ",e.jsx("strong",{children:"file-position"})," (clássico) e ",e.jsx("strong",{children:"GTID"})," (Global Transaction ID — recomendado em MariaDB 10.x)."]}),e.jsx("h2",{children:"1. Configurando o master"}),e.jsx(a,{title:"my.ini do master",language:"ini",code:`[mysqld]
server-id           = 1
log-bin             = mysql-bin
binlog_format       = ROW
expire_logs_days    = 7
gtid_strict_mode    = ON
gtid_domain_id      = 0

# Bind no IP da rede para a replica chegar
bind-address        = 0.0.0.0`}),e.jsx("p",{children:"Reinicie o MariaDB do master e crie o usuário de replicação:"}),e.jsx(a,{language:"sql",code:`CREATE USER 'repl'@'%' IDENTIFIED BY 'senha_repl_forte';
GRANT REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'repl'@'%';
FLUSH PRIVILEGES;`}),e.jsx("h2",{children:"2. Snapshot inicial"}),e.jsx("p",{children:"A replica precisa começar idêntica ao master. Tire um dump consistente:"}),e.jsx(a,{language:"bash",code:`# Dump com posição do binlog incluída
mysqldump -u root -p \\
    --all-databases \\
    --master-data=2 \\
    --single-transaction \\
    --flush-logs \\
    --routines --triggers --events \\
    > master-dump.sql

# Veja a posição (cabeçalho do dump)
grep "CHANGE MASTER TO" master-dump.sql`}),e.jsx("p",{children:"Você vai ver algo como:"}),e.jsx(a,{language:"sql",code:"-- CHANGE MASTER TO MASTER_LOG_FILE='mysql-bin.000005', MASTER_LOG_POS=4823;"}),e.jsx("h2",{children:"3. Configurando a replica"}),e.jsx(a,{title:"my.ini da replica",language:"ini",code:`[mysqld]
server-id           = 2
relay-log           = relay-bin
read_only           = ON
gtid_strict_mode    = ON
log-slave-updates   = ON       # se essa replica for replicar para outra
skip-slave-start    = ON       # não começa sozinho (você decide)`}),e.jsx("p",{children:"Restaure o dump:"}),e.jsx(a,{language:"bash",code:"mysql -u root -p < master-dump.sql"}),e.jsx("h2",{children:"4. Apontando a replica"}),e.jsx(a,{title:"No CLI da replica",language:"sql",code:`-- Modo file-position (clássico)
CHANGE MASTER TO
    MASTER_HOST     = '10.0.0.10',
    MASTER_USER     = 'repl',
    MASTER_PASSWORD = 'senha_repl_forte',
    MASTER_LOG_FILE = 'mysql-bin.000005',
    MASTER_LOG_POS  = 4823;

START SLAVE;

-- Modo GTID (preferido em MariaDB)
CHANGE MASTER TO
    MASTER_HOST     = '10.0.0.10',
    MASTER_USER     = 'repl',
    MASTER_PASSWORD = 'senha_repl_forte',
    MASTER_USE_GTID = slave_pos;

START SLAVE;`}),e.jsx("h2",{children:"5. Verificando"}),e.jsx(a,{language:"sql",code:`SHOW SLAVE STATUS\\G

-- Campos críticos:
-- Slave_IO_Running:    Yes
-- Slave_SQL_Running:   Yes
-- Seconds_Behind_Master: 0     ← atraso atual
-- Last_Error:          (vazio)`}),e.jsx(o,{title:"Sintomas e causas",params:[{flag:"Slave_IO_Running: No",desc:"Rede / firewall / usuário 'repl' / senha errada."},{flag:"Slave_SQL_Running: No",desc:"Erro ao aplicar uma query (ver Last_SQL_Error)."},{flag:"Seconds_Behind_Master alto",desc:"Replica não consegue acompanhar — IO / disco / query lenta."},{flag:"Yes/Yes mas dados divergem",desc:"Alguém escreveu na replica diretamente — sempre read_only=ON."}]}),e.jsx("h2",{children:"Pulando um erro (com cuidado)"}),e.jsx(a,{language:"sql",code:`-- File-position
STOP SLAVE;
SET GLOBAL sql_slave_skip_counter = 1;
START SLAVE;

-- GTID
STOP SLAVE;
SET GLOBAL gtid_slave_pos = '0-1-12345';   -- pular para a próxima
START SLAVE;`}),e.jsx(r,{type:"warning",title:"Pular = divergência",children:"Pular eventos pode deixar replica e master diferentes. Documente, e dê re-snapshot completo se possível."}),e.jsx("h2",{children:"Promovendo replica a master (failover)"}),e.jsx(a,{language:"sql",code:`-- Na antiga replica
STOP SLAVE;
RESET SLAVE ALL;
SET GLOBAL read_only = OFF;

-- Aponte os apps novos para o IP dela
-- Configure as outras replicas para apontarem aqui
-- (aceite que pode haver pequena perda se replicação assíncrona estava atrasada)`}),e.jsx("h2",{children:"Estratégias de uso"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Read-replicas"})," — escreve no master, lê das replicas. Frameworks (Laravel, Doctrine) suportam pool de hosts read/write."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Backup contínuo"})," — uma replica dedicada só pra rodar mysqldump sem travar produção."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Standby"})," — replica reserva, ligada à rede, pronta pra promover em segundos."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Replicação multi-source"})," (MariaDB 10.x): uma replica recebe binlog de vários masters — útil pra consolidar dados."]})]}),e.jsx("h2",{children:"Galera Cluster — alternativa síncrona"}),e.jsxs("p",{children:["Quando precisa de ",e.jsx("strong",{children:"multi-master ativo"})," (escrever em qualquer nó), MariaDB Galera Cluster usa replicação síncrona. Mais complexo, mas zero perda de dados em failover. Foge do escopo do XAMPP — anote para servidores Linux dedicados."]}),e.jsx("h2",{children:"Replicação no XAMPP local (lab)"}),e.jsx("p",{children:"Dá para simular dois MariaDB no mesmo PC mudando portas:"}),e.jsx(a,{title:"Cópia da pasta + mudança de porta",language:"text",code:`1. Copie C:/xampp/mysql para C:/xampp/mysql2
2. Edite C:/xampp/mysql2/bin/my.ini:
       port = 3307
       socket = mysql2.sock
       datadir = C:/xampp/mysql2/data
       server-id = 2
3. Inicialize o data dir:
       C:/xampp/mysql2/bin/mariadb-install-db.exe --datadir=C:/xampp/mysql2/data
4. Suba como serviço Windows separado ou via console
5. Configure replicação como acima usando 127.0.0.1:3307 como replica`}),e.jsx("h2",{children:"Backup com replica"}),e.jsx(a,{language:"bash",code:`# Na replica, durante a noite
STOP SLAVE;
mysqldump --all-databases --master-data=2 --single-transaction \\
    > /backups/full-$(date +%F).sql
START SLAVE;

# Resultado: dump consistente sem ter parado o master.`}),e.jsx("h2",{children:"Armadilhas"}),e.jsxs("ul",{children:[e.jsx("li",{children:"server-id duplicado entre master e replica → replicação se recusa a iniciar."}),e.jsxs("li",{children:["binlog_format ",e.jsx("code",{children:"STATEMENT"})," com queries não determinísticas (NOW(), UUID()) gera divergência. Use ",e.jsx("code",{children:"ROW"}),"."]}),e.jsxs("li",{children:["Esquecer ",e.jsx("code",{children:"read_only=ON"})," na replica → desenvolvedor escreve lá pensando ser master e o master sobrescreve depois."]}),e.jsxs("li",{children:["Manter binlogs eternamente (",e.jsx("code",{children:"expire_logs_days"})," alto) → disco cheio em semanas."]}),e.jsx("li",{children:"Replicação assíncrona = perda possível em failover. Aceite ou use Galera."})]})]})}export{t as default};
