import{j as e}from"./index-BreI0dyu.js";import{P as i,A as s}from"./AlertBox-C_bJKc46.js";import{C as a}from"./CodeBlock-D0rWxPIU.js";import{P as o}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function t(){return e.jsxs(i,{title:"my.ini — configurando o MariaDB do XAMPP",subtitle:"Estrutura do arquivo, ordem de leitura, grupos [client]/[mysqld], variáveis essenciais (charset, InnoDB, conexões, sql_mode), tuning para dev, logs e diagnóstico — referência baseada em mariadb.com/kb.",difficulty:"intermediario",timeToRead:"14 min",children:[e.jsxs(s,{type:"info",title:"Pré-requisitos",children:["XAMPP rodando, MySQL/MariaDB iniciado pelo painel. Saber abrir um terminal/CMD. Capítulo de ",e.jsx("a",{href:"#/painel-controle",children:"painel"})," ","lido para parar/iniciar o serviço."]}),e.jsx("h2",{children:"Glossário rápido"}),e.jsxs("p",{children:[e.jsx("strong",{children:"MariaDB"}),' — fork do MySQL mantido pelos criadores originais (Monty Widenius e equipe) após a Oracle comprar o MySQL em 2009. Compatível com a esmagadora maioria do MySQL — drivers, clients, queries, .sql dumps. O "MySQL" do XAMPP ',e.jsx("strong",{children:"é"})," ","MariaDB desde a versão 5.5."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"my.ini / my.cnf"})," — arquivo de configuração do servidor (e dos clientes oficiais). Formato INI: grupos entre colchetes (",e.jsx("code",{children:"[mysqld]"}),", ",e.jsx("code",{children:"[client]"}),"), uma diretiva por linha."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"System variable"})," — uma diretiva. MariaDB 11.x tem ~600 variáveis (",e.jsx("code",{children:"SHOW VARIABLES"}),"). Algumas globais (servidor todo), outras por sessão (cada conexão)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Storage engine"}),' — o "motor" que armazena uma tabela. ',e.jsx("strong",{children:"InnoDB"})," é o padrão (transacional, ACID, chaves estrangeiras). ",e.jsx("strong",{children:"MyISAM"})," é mais antigo, sem transações — só usado para tabelas read-mostly."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Buffer pool"})," — cache em RAM do InnoDB. Páginas de dados e índices ficam aqui. A variável mais importante de tuning."]}),e.jsx("h2",{children:"Onde fica o arquivo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Windows"}),": ",e.jsx("code",{children:"C:/xampp/mysql/bin/my.ini"})]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Linux"}),": ",e.jsx("code",{children:"/opt/lampp/etc/my.cnf"})]}),e.jsxs("li",{children:[e.jsx("strong",{children:"macOS"}),": ",e.jsx("code",{children:"/Applications/XAMPP/etc/my.cnf"})]})]}),e.jsxs("p",{children:["Pelo painel: clique em ",e.jsx("em",{children:"Config"})," ao lado de MySQL →"," ",e.jsx("code",{children:"my.ini"}),"."]}),e.jsx("h2",{children:"Ordem em que o MariaDB lê os arquivos"}),e.jsx("p",{children:"Em vez de um único arquivo, o MariaDB procura em vários lugares. Os últimos lidos sobrescrevem os primeiros. No Linux a ordem padrão é:"}),e.jsx(a,{language:"text",code:`1. /etc/my.cnf
2. /etc/mysql/my.cnf
3. /opt/lampp/etc/my.cnf       (XAMPP override)
4. ~/.my.cnf                    (do usuário)
5. arquivo passado em --defaults-file=
6. arquivos incluídos via !include / !includedir`}),e.jsxs("p",{children:["No Windows o XAMPP usa exclusivamente ",e.jsx("code",{children:"my.ini"})," dentro de ",e.jsx("code",{children:"mysql/bin/"}),"."]}),e.jsx("h2",{children:"Estrutura do arquivo (grupos)"}),e.jsx("p",{children:"Cada grupo é lido por um programa específico:"}),e.jsx(o,{title:"Grupos mais comuns",params:[{flag:"[mysqld]",desc:"O servidor — mariadb-server. A maior parte da config vai aqui."},{flag:"[server]",desc:"Lido por TODOS os daemons (mariadbd, mariadb-galera, etc.). Para coisas universais."},{flag:"[client]",desc:"Lido por todos os programas-cliente (mysql, mariadb, mysqldump). Onde define usuário/senha padrão."},{flag:"[mysql]",desc:"Lido só pelo cliente interativo mysql/mariadb."},{flag:"[mysqldump]",desc:"Lido só pelo mysqldump. Útil para max_allowed_packet de dumps grandes."},{flag:"[mysqlimport]",desc:"Para o utilitário mysqlimport."},{flag:"[mysqld-10.11]",desc:"Lido só pelo servidor versão 10.11. Permite ter um único arquivo para várias instâncias."},{flag:"[mariabackup]",desc:"Para a ferramenta mariabackup (backup hot, alternativa ao mysqldump)."}]}),e.jsx("h2",{children:"Diretivas que você vai mexer"}),e.jsx(o,{title:"As mais usadas em [mysqld] e [client]",params:[{flag:"port",desc:"Porta em que o MariaDB escuta. Padrão 3306. Mude se conflitar com outro MySQL.",exemplo:"port = 3306"},{flag:"bind-address",desc:"Em qual interface escutar. 127.0.0.1 só localhost (padrão XAMPP, seguro). 0.0.0.0 todas as redes (use só se precisar acesso externo).",exemplo:"bind-address = 127.0.0.1"},{flag:"datadir",desc:"Onde os bancos ficam fisicamente. Padrão é mysql/data/. Pode mudar pra outro disco.",exemplo:'datadir = "C:/xampp/mysql/data"'},{flag:"socket",desc:"Caminho do socket UNIX (Linux/macOS). Conexões locais usam socket por padrão (mais rápido que TCP).",exemplo:"socket = /opt/lampp/var/mysql/mysql.sock"},{flag:"max_allowed_packet",desc:"Tamanho máximo de uma única query/pacote. Suba para 64M ou mais se importar dumps grandes ou usa BLOBs.",exemplo:"max_allowed_packet = 64M"},{flag:"max_connections",desc:"Quantas conexões simultâneas ao banco. 100 padrão; em dev raramente precisa mexer.",exemplo:"max_connections = 200"},{flag:"thread_cache_size",desc:"Quantas threads ficam em cache para reuso (evita criar/destruir). 8 padrão; ~ max_connections/100 está bom.",exemplo:"thread_cache_size = 16"},{flag:"wait_timeout",desc:"Segundos que o servidor espera antes de fechar uma conexão ociosa. Padrão 28800 (8h).",exemplo:"wait_timeout = 600"},{flag:"innodb_buffer_pool_size",desc:"Cache de tabelas InnoDB em RAM. A variável MAIS importante de tuning. Em prod: 50-70% da RAM. Em dev: 256M-512M tá ótimo.",exemplo:"innodb_buffer_pool_size = 256M"},{flag:"innodb_log_file_size",desc:"Tamanho do redo log. Maior = mais throughput de escrita, mas recovery mais lento. 256M é equilibrado.",exemplo:"innodb_log_file_size = 256M"},{flag:"innodb_flush_log_at_trx_commit",desc:"Política de fsync do redo log. 1 = ACID (padrão); 2 = grava no SO mas não força fsync; 0 = mais rápido, perigoso. Use 1 sempre que durabilidade importar.",exemplo:"innodb_flush_log_at_trx_commit = 1"},{flag:"innodb_file_per_table",desc:"ON faz cada tabela ter seu próprio .ibd. Padrão ON desde MariaDB 5.6. Mantenha ON.",exemplo:"innodb_file_per_table = ON"},{flag:"character-set-server",desc:"Charset padrão do servidor. Para acentos e emojis, sempre utf8mb4 (NÃO utf8 que é incompleto).",exemplo:"character-set-server = utf8mb4"},{flag:"collation-server",desc:"Collation padrão. utf8mb4_unicode_ci é o mais correto; utf8mb4_general_ci é mais rápido mas faz comparações erradas em alguns scripts.",exemplo:"collation-server = utf8mb4_unicode_ci"},{flag:"sql_mode",desc:"Modo de validação. STRICT_TRANS_TABLES rejeita dados inválidos. ONLY_FULL_GROUP_BY pode quebrar queries antigas (Laravel desliga por padrão).",exemplo:"sql_mode = STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION"},{flag:"default-time-zone",desc:"Fuso horário do banco. Para o Brasil, '-03:00'. Importante para CURRENT_TIMESTAMP e UTC_TIMESTAMP serem coerentes.",exemplo:"default-time-zone = '-03:00'"},{flag:"log_error",desc:"Caminho do log de erros. SEMPRE olhe quando o serviço não inicia.",exemplo:'log_error = "C:/xampp/mysql/data/mysql_error.log"'},{flag:"general_log + general_log_file",desc:"Loga TODAS as queries. Útil em debug, péssimo em produção (cresce muito).",exemplo:`general_log = 1
general_log_file = ...`},{flag:"slow_query_log + long_query_time",desc:"Loga queries que demoram mais que long_query_time segundos. Ideal pra encontrar gargalos.",exemplo:`slow_query_log = 1
long_query_time = 1`},{flag:"log_queries_not_using_indexes",desc:"Junto com slow_log: loga queries sem índice mesmo que rápidas. Ótimo para auditoria de performance.",exemplo:"log_queries_not_using_indexes = ON"},{flag:"skip-name-resolve",desc:"Não tenta resolver hostname dos clientes — só IP. Acelera conexões. Em dev XAMPP pode deixar (mais rápido).",exemplo:"skip-name-resolve"},{flag:"tmp_table_size + max_heap_table_size",desc:"Limite de tabelas temporárias em memória (acima disso, vai pra disco). 64M razoável.",exemplo:`tmp_table_size = 64M
max_heap_table_size = 64M`}]}),e.jsx("h2",{children:"Receita: my.ini para desenvolvimento"}),e.jsx(a,{language:"ini",code:`[client]
port = 3306
default-character-set = utf8mb4

[mysqld]
port = 3306
bind-address = 127.0.0.1

# Charset/locale — UTF-8 completo
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
default-time-zone = '-03:00'

# Conexões e timeouts
max_connections = 200
thread_cache_size = 16
max_allowed_packet = 64M
wait_timeout = 600
interactive_timeout = 600

# InnoDB — buffer pool é o que mais importa
innodb_buffer_pool_size = 256M
innodb_log_file_size = 128M
innodb_flush_log_at_trx_commit = 1
innodb_file_per_table = ON

# Tabelas temporárias em memória
tmp_table_size = 64M
max_heap_table_size = 64M

# SQL strict (recomendado)
sql_mode = STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO

# Logs
log_error = "C:/xampp/mysql/data/mysql_error.log"
slow_query_log = 1
slow_query_log_file = "C:/xampp/mysql/data/mysql_slow.log"
long_query_time = 2
log_queries_not_using_indexes = ON

[mysql]
default-character-set = utf8mb4

[mysqldump]
default-character-set = utf8mb4
max_allowed_packet = 64M`}),e.jsxs(s,{type:"warning",title:"Reinicie o MySQL após mudar o my.ini",children:["Diferente do ",e.jsx("code",{children:".htaccess"}),", mudanças no ",e.jsx("code",{children:"my.ini"})," ","só valem ao parar e iniciar o serviço MySQL no painel. Algumas variáveis (como ",e.jsx("code",{children:"character_set_server"}),") podem ser ajustadas em runtime via ",e.jsx("code",{children:"SET GLOBAL"}),", mas voltam ao valor do my.ini quando o servidor reinicia."]}),e.jsx("h2",{children:"Mudança em runtime (sem reiniciar)"}),e.jsx(a,{language:"sql",code:`-- Mudar UMA variável só nesta sessão
SET wait_timeout = 60;

-- Mudar GLOBAL (todas as conexões novas)
SET GLOBAL max_connections = 300;

-- Conferir variáveis
SHOW VARIABLES LIKE 'max_connections';
SHOW GLOBAL VARIABLES LIKE 'innodb_buffer%';

-- Variáveis que NÃO podem mudar em runtime
-- (ex.: innodb_buffer_pool_size em versões antigas)
-- precisam mexer no my.ini e reiniciar.`}),e.jsx("h2",{children:"Conferindo configurações ativas"}),e.jsx(a,{language:"sql",code:`-- Versão e plataforma
SELECT VERSION();
SHOW VARIABLES LIKE 'version_compile%';

-- Charset e collation
SHOW VARIABLES LIKE 'char%';
SHOW VARIABLES LIKE 'collation%';

-- InnoDB
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
SHOW VARIABLES LIKE 'innodb_log%';
SHOW VARIABLES LIKE 'innodb_flush%';

-- Conexões e estado
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Connections';
SHOW STATUS LIKE 'Uptime';
SHOW STATUS LIKE 'Slow_queries';

-- Tudo de uma vez
SHOW VARIABLES;          -- ~600 linhas
SHOW STATUS;             -- ~600 linhas

-- Processos ativos (queries rodando agora)
SHOW PROCESSLIST;
SHOW FULL PROCESSLIST;   -- com a query inteira`}),e.jsx("h2",{children:"InnoDB tuning — o essencial"}),e.jsx("p",{children:"90% do desempenho do MariaDB para apps OLTP (CRUD comum) depende de quatro variáveis InnoDB:"}),e.jsx(o,{title:"As 4 variáveis InnoDB que mais importam",params:[{flag:"innodb_buffer_pool_size",desc:"Cache em RAM. Em produção: 50-70% da RAM total da máquina. Maior é melhor (até cobrir o working set inteiro)."},{flag:"innodb_log_file_size",desc:"Redo log. Maior reduz I/O de checkpoint mas alonga recovery após crash. 256M-2G em prod."},{flag:"innodb_flush_log_at_trx_commit",desc:"1 = ACID/durável (padrão). 2 = ainda durável contra crash do mysql, não contra power-loss. 0 = mais rápido mas perde até 1s ao crash."},{flag:"innodb_flush_method",desc:"Como o InnoDB faz fsync. O_DIRECT é o melhor em Linux com SSD. Sem efeito no Windows."}]}),e.jsx("h2",{children:"MySQL não inicia depois de mexer no my.ini"}),e.jsx("p",{children:"É a coisa mais comum do mundo. Olhe o log:"}),e.jsx(a,{language:"text",code:`C:/xampp/mysql/data/mysql_error.log
ou
C:/xampp/mysql/data/<NOME-DO-PC>.err`}),e.jsx("p",{children:"Causas mais frequentes:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Typo no my.ini"})," — linha sem ",e.jsx("code",{children:"="}),", valor com espaço estranho."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"datadir apontando para pasta inexistente"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"innodb_buffer_pool_size maior que a RAM disponível"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Tabela InnoDB corrompida"})," — veja ",e.jsx("a",{href:"#/erros-comuns",children:"erros comuns"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Porta 3306 já em uso"})," por outro MySQL — veja ",e.jsx("a",{href:"#/portas-conflitos",children:"conflito de portas"}),"."]})]}),e.jsx("h2",{children:"Diagnóstico"}),e.jsx(a,{language:"bash",code:`# Verificar sintaxe do my.ini sem iniciar o servidor
C:/xampp/mysql/bin/mysqld.exe --help --verbose 2>&1 | findstr /i "Default options"

# Testar inicialização à mão (logs em stdout)
C:/xampp/mysql/bin/mysqld.exe --console

# Versão exata do MariaDB
C:/xampp/mysql/bin/mariadb.exe --version

# Conectar
C:/xampp/mysql/bin/mariadb.exe -u root

# Inspecionar variáveis pela linha de comando
C:/xampp/mysql/bin/mariadb.exe -u root -e "SHOW VARIABLES LIKE 'innodb%';"`})]})}export{t as default};
