import{j as a}from"./index-BreI0dyu.js";import{P as r,A as s}from"./AlertBox-C_bJKc46.js";import{C as e}from"./CodeBlock-D0rWxPIU.js";import{P as o}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function n(){return a.jsxs(r,{title:"Backup e Restore do MariaDB",subtitle:"Lógico (mysqldump/mariadb-dump) vs físico (mariabackup), point-in-time recovery com binlog, automatização (cron/Agendador), restore parcial e estratégia 3-2-1.",difficulty:"intermediario",timeToRead:"14 min",children:[a.jsxs(s,{type:"info",title:"Pré-requisitos",children:["XAMPP rodando com MySQL ativo. Conhecer o capítulo de"," ",a.jsx("a",{href:"#/mysql-senha-root",children:"usuários e senhas"})," — você vai precisar credenciais. Espaço em disco para os dumps (1-2× o tamanho dos seus dados)."]}),a.jsx("h2",{children:"Glossário rápido"}),a.jsxs("p",{children:[a.jsx("strong",{children:"Backup lógico"})," — comandos SQL (CREATE TABLE, INSERT) num arquivo de texto. Portátil, lê em qualquer versão, edita à mão. Lento para bancos grandes. Ferramenta:"," ",a.jsx("code",{children:"mysqldump"})," / ",a.jsx("code",{children:"mariadb-dump"}),"."]}),a.jsxs("p",{children:[a.jsx("strong",{children:"Backup físico"})," — cópia binária dos arquivos de dados (.ibd, ib_logfile…). Rápido (não converte nada), mas só restaura na mesma versão major. Ferramenta:"," ",a.jsx("code",{children:"mariabackup"}),"."]}),a.jsxs("p",{children:[a.jsx("strong",{children:"Hot backup"})," — backup feito com o servidor rodando e aceitando writes. ",a.jsx("code",{children:"mariabackup"})," é hot."," ",a.jsx("code",{children:"mysqldump --single-transaction"}),' é "quase hot" para InnoDB.']}),a.jsxs("p",{children:[a.jsx("strong",{children:"Cold backup"})," — backup com o servidor parado. Cópia da pasta ",a.jsx("code",{children:"data/"}),". Mais simples, mas tem downtime."]}),a.jsxs("p",{children:[a.jsx("strong",{children:"Binary log (binlog)"}),' — log sequencial de toda modificação. Permite point-in-time recovery (PITR): "quero o banco como estava terça às 14:32:11".']}),a.jsxs("p",{children:[a.jsx("strong",{children:"3-2-1"})," — regra básica: ",a.jsx("strong",{children:"3"})," cópias dos dados, em ",a.jsx("strong",{children:"2"})," mídias diferentes,"," ",a.jsx("strong",{children:"1"})," off-site (em outro lugar físico)."]}),a.jsx("h2",{children:"Backup lógico — mysqldump (mariadb-dump)"}),a.jsxs("p",{children:["Vem dentro do XAMPP em"," ",a.jsx("code",{children:"C:/xampp/mysql/bin/mysqldump.exe"})," (ou"," ",a.jsx("code",{children:"mariadb-dump.exe"})," em versões novas). Gera um arquivo"," ",a.jsx("code",{children:".sql"})," com toda a estrutura e os dados."]}),a.jsx(e,{language:"bash",code:`# Backup de um banco específico
C:/xampp/mysql/bin/mysqldump -u root -p loja > C:/backups/loja_2026-05-02.sql

# Backup de TODAS as bases (incluindo tabelas system)
C:/xampp/mysql/bin/mysqldump -u root -p --all-databases > C:/backups/full.sql

# Backup só da estrutura (sem dados)
C:/xampp/mysql/bin/mysqldump -u root -p --no-data loja > loja_estrutura.sql

# Backup só dos dados (sem CREATE TABLE)
C:/xampp/mysql/bin/mysqldump -u root -p --no-create-info loja > loja_dados.sql

# Backup de uma tabela só
C:/xampp/mysql/bin/mysqldump -u root -p loja produtos > produtos.sql

# Comprimido (Linux/Git Bash)
mysqldump -u root -p loja | gzip > loja.sql.gz

# Backup "production-grade" — InnoDB consistente, sem travar tabelas
mysqldump -u root -p \\
    --single-transaction \\
    --routines --triggers --events \\
    --default-character-set=utf8mb4 \\
    --add-drop-database \\
    --databases loja > loja_completo.sql`}),a.jsx(o,{title:"Flags úteis do mysqldump",params:[{flag:"-u root",desc:"Usuário do MySQL."},{flag:"-p",desc:"Vai pedir a senha (sem mostrar). Para senha vazia, dê -p e Enter."},{flag:'-p"senha"',desc:"Senha inline — visível no histórico do shell, evite em produção."},{flag:"-h 127.0.0.1",desc:"Host do banco. Padrão é localhost."},{flag:"-P 3306",desc:"Porta. Padrão 3306."},{flag:"--all-databases",desc:"Backup de TUDO (incluindo mysql, information_schema)."},{flag:"--databases db1 db2",desc:"Backup de bancos específicos (com CREATE DATABASE)."},{flag:"--no-data",desc:"Só estrutura. Útil para clonar schema sem mover dados."},{flag:"--no-create-info",desc:"Só os INSERTs. Útil pra repopular tabelas existentes."},{flag:"--single-transaction",desc:"Faz dump consistente em InnoDB sem travar tabelas. SEMPRE use para bancos só-InnoDB."},{flag:"--lock-tables",desc:"Trava todas as tabelas durante o dump. Necessário para MyISAM. Padrão se não usar --single-transaction."},{flag:"--default-character-set=utf8mb4",desc:"Garante que acentos e emojis sobrevivam. SEMPRE use."},{flag:"--routines",desc:"Inclui stored procedures e functions."},{flag:"--triggers",desc:"Inclui triggers (padrão é ON)."},{flag:"--events",desc:"Inclui events (job scheduler do MySQL)."},{flag:"--add-drop-database",desc:"Adiciona DROP DATABASE antes do CREATE — restore sobrescreve sem queixa."},{flag:"--add-drop-table",desc:"DROP TABLE antes do CREATE TABLE."},{flag:"--quick",desc:"Stream tabelas grandes sem carregar tudo em RAM. Padrão atualmente."},{flag:"--skip-extended-insert",desc:"Um INSERT por linha (em vez de INSERT em batch). Mais leve para diff/git."},{flag:"--where='condicao'",desc:"Backup parcial — só os registros que casam. Ex.: --where='created_at > 2024-01-01'"},{flag:"--ignore-table=db.tabela",desc:"Excluir uma tabela do dump. Útil para tabelas de log/sessão."},{flag:"--master-data=2",desc:"Inclui posição do binlog no dump (comentário). Necessário para PITR."}]}),a.jsx("h2",{children:"Restaurando um dump"}),a.jsx(e,{language:"bash",code:`# Restaurar (banco precisa existir, exceto se dump tiver CREATE DATABASE)
C:/xampp/mysql/bin/mysql -u root -p loja < loja_2026-05-02.sql

# Criar e restaurar de uma vez
C:/xampp/mysql/bin/mysql -u root -p -e "CREATE DATABASE loja_nova"
C:/xampp/mysql/bin/mysql -u root -p loja_nova < loja_2026-05-02.sql

# Restaurar all-databases (não precisa criar nada)
C:/xampp/mysql/bin/mysql -u root -p < full.sql

# Restaurar comprimido (Linux/Git Bash)
gunzip -c loja.sql.gz | mysql -u root -p loja

# Acompanhar progresso (Linux com pv)
pv loja.sql | mysql -u root -p loja

# Mais rápido para imports grandes — desligar checks temporariamente
mysql -u root -p loja <<EOF
SET autocommit = 0;
SET unique_checks = 0;
SET foreign_key_checks = 0;
SOURCE /caminho/loja.sql;
SET foreign_key_checks = 1;
SET unique_checks = 1;
COMMIT;
EOF`}),a.jsx("h2",{children:"Backup automático no Windows (Agendador)"}),a.jsx(e,{title:"C:/xampp/scripts/backup-mysql.bat",language:"bat",code:`@echo off
REM Data no formato YYYY-MM-DD
set DATA=%date:~6,4%-%date:~3,2%-%date:~0,2%
set DESTINO=C:\\Backups\\mysql

if not exist "%DESTINO%" mkdir "%DESTINO%"

C:\\xampp\\mysql\\bin\\mysqldump.exe ^
    -u root -p"SUA_SENHA" ^
    --all-databases ^
    --single-transaction ^
    --routines --triggers --events ^
    --default-character-set=utf8mb4 ^
    --master-data=2 ^
    > "%DESTINO%\\backup-%DATA%.sql"

REM Apaga backups com mais de 30 dias
forfiles /p "%DESTINO%" /m *.sql /d -30 /c "cmd /c del @path" 2>nul

echo Backup salvo em %DESTINO%\\backup-%DATA%.sql`}),a.jsxs("p",{children:["Agende em ",a.jsx("strong",{children:"Agendador de Tarefas"}),': Tarefa Básica → diariamente, 03:00 → "Iniciar um programa" → aponte para esse'," ",a.jsx("code",{children:".bat"}),"."]}),a.jsx("h2",{children:"Backup automático no Linux (cron)"}),a.jsx(e,{language:"bash",code:`# Edite o cron
crontab -e

# Diário às 03:00 com retenção de 30 dias
0 3 * * * /opt/lampp/bin/mysqldump -u root -p'SENHA' --all-databases \\
    --single-transaction --routines --triggers --events \\
    | gzip > /var/backups/mysql/full-$(date +\\%Y-\\%m-\\%d).sql.gz \\
    && find /var/backups/mysql -name '*.sql.gz' -mtime +30 -delete`}),a.jsxs(s,{type:"warning",title:"Senha no comando = visível em ps aux",children:[a.jsx("code",{children:'-p"SENHA"'})," aparece no ",a.jsx("code",{children:"ps aux"})," e em logs. Use o arquivo ",a.jsx("code",{children:"~/.my.cnf"})," com permissão 600:",a.jsx(e,{language:"ini",code:`# ~/.my.cnf  (chmod 600)
[client]
user = root
password = SENHA`}),"Aí ",a.jsx("code",{children:"mysqldump --all-databases"})," conecta sem precisar de ",a.jsx("code",{children:"-u/-p"}),"."]}),a.jsx("h2",{children:"Backup físico — mariabackup"}),a.jsxs("p",{children:["Para bancos grandes (acima de ~10 GB),"," ",a.jsx("code",{children:"mysqldump"})," fica lento. ",a.jsx("code",{children:"mariabackup"})," faz cópia binária dos arquivos InnoDB enquanto o servidor está rodando, em uma fração do tempo."]}),a.jsx(e,{language:"bash",code:`# Backup completo
mariabackup --backup \\
    --target-dir=/var/backups/full-2026-05-02 \\
    --user=root --password=SENHA

# Preparar (aplica logs InnoDB para deixar consistente)
mariabackup --prepare --target-dir=/var/backups/full-2026-05-02

# Restaurar
sudo systemctl stop mariadb
sudo rm -rf /var/lib/mysql/*
mariabackup --copy-back --target-dir=/var/backups/full-2026-05-02
sudo chown -R mysql:mysql /var/lib/mysql
sudo systemctl start mariadb

# Backup INCREMENTAL (só o que mudou desde o último)
mariabackup --backup \\
    --target-dir=/var/backups/inc-2026-05-03 \\
    --incremental-basedir=/var/backups/full-2026-05-02 \\
    --user=root --password=SENHA`}),a.jsxs("p",{children:[a.jsx("code",{children:"mariabackup"})," não vem no XAMPP Windows. No XAMPP Linux você precisa instalar separado (",a.jsx("code",{children:"apt install mariadb-backup"}),")."]}),a.jsx("h2",{children:"Cold backup — copiar a pasta data"}),a.jsxs("p",{children:["Alternativa simples: parar o MySQL, copiar ",a.jsx("code",{children:"mysql/data/"})," ","inteira. Funciona em InnoDB também — desde que o serviço esteja"," ",a.jsx("strong",{children:"parado"}),"."]}),a.jsx(e,{language:"bash",code:`# 1. Pare o MySQL pelo painel XAMPP

# 2. Copie a pasta data
xcopy /E /I /H "C:\\xampp\\mysql\\data" "C:\\Backups\\mysql-data-2026-05-02"

# 3. Inicie de novo`}),a.jsxs(s,{type:"warning",title:"Não copie data com MySQL rodando",children:["Vai gerar arquivos corrompidos pela metade. Sempre pare o serviço primeiro: ",a.jsx("code",{children:"painel → MySQL → Stop"}),"."]}),a.jsx("h2",{children:"Point-in-time recovery (PITR) com binlog"}),a.jsxs("p",{children:["Cenário: alguém rodou ",a.jsx("code",{children:"DELETE FROM produtos"})," sem WHERE às 14:32 de terça. Você quer restaurar o banco às 14:31:59."]}),a.jsx("p",{children:"Para PITR funcionar, o binlog precisa estar ativo:"}),a.jsx(e,{language:"ini",code:`# my.ini
[mysqld]
log-bin = mysql-bin
binlog_format = ROW
expire_logs_days = 14            # rotaciona após 14 dias
server-id = 1                    # obrigatório quando log-bin ativo`}),a.jsx(e,{language:"bash",code:`# 1. Restaure o último backup completo (aquele com --master-data=2)
mysql -u root -p < backup-2026-05-01.sql

# 2. No comentário do dump, ache: -- CHANGE MASTER TO ... MASTER_LOG_FILE='...' MASTER_LOG_POS=...

# 3. Aplicar binlog desse ponto até pouco antes do desastre
mysqlbinlog \\
    --start-position=12345 \\
    --stop-datetime="2026-05-03 14:31:59" \\
    /var/lib/mysql/mysql-bin.000001 \\
    /var/lib/mysql/mysql-bin.000002 \\
    | mysql -u root -p`}),a.jsx("h2",{children:"Restore parcial — só uma tabela"}),a.jsx(e,{language:"bash",code:`# Extrair APENAS uma tabela do dump completo
sed -n '/-- Table structure for table .produtos./,/-- Table structure for table /p' \\
    full-backup.sql > so-produtos.sql

# Ou — se o dump foi feito por tabela
mysql -u root -p loja < produtos.sql

# Reproduzir só DELETEs/UPDATEs do binlog em uma tabela
mysqlbinlog --database=loja mysql-bin.000001 \\
    | grep -i "produtos" \\
    | mysql -u root -p loja`}),a.jsx("h2",{children:"phpMyAdmin: o caminho gráfico"}),a.jsxs("p",{children:["Já vimos no capítulo ",a.jsx("a",{href:"#/phpmyadmin",children:"phpMyAdmin"}),": aba",a.jsx("strong",{children:"Exportar"})," / ",a.jsx("strong",{children:"Importar"}),". Bom para bancos pequenos. Para arquivos grandes (acima de ~50 MB) o limite de upload do PHP atrapalha — use o terminal ou aumente"," ",a.jsx("code",{children:"upload_max_filesize"})," e ",a.jsx("code",{children:"post_max_size"})," no"," ",a.jsx("a",{href:"#/php-ini",children:"php.ini"}),"."]}),a.jsx("h2",{children:"Estratégia de backup recomendada (3-2-1)"}),a.jsx(o,{title:"O que rodar com que frequência",params:[{flag:"Diário (mysqldump completo)",desc:"Roda 03:00. Retém 14 dias. Local + cloud (S3/GDrive)."},{flag:"Horário (binlog rotation)",desc:"Sem ação manual — basta log-bin ativo. Mantém últimos 7 dias."},{flag:"Semanal (off-site)",desc:"Cópia do diário para outro disco físico ou serviço cloud."},{flag:"Mensal (cold)",desc:"Pasta data inteira após shutdown. Para versão arqueológica."},{flag:"Antes de migration",desc:"Backup específico nomeado: pre-migration-2026-05-03.sql"},{flag:"Restore TEST",desc:"Mensalmente, restaure em outro servidor e confira contagens. Backup não testado = sem backup."}]})]})}export{n as default};
