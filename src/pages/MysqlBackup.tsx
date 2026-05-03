import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function MysqlBackup() {
  return (
    <PageContainer
      title="Backup e Restore do MariaDB"
      subtitle="Lógico (mysqldump/mariadb-dump) vs físico (mariabackup), point-in-time recovery com binlog, automatização (cron/Agendador), restore parcial e estratégia 3-2-1."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        XAMPP rodando com MySQL ativo. Conhecer o capítulo de{" "}
        <a href="#/mysql-senha-root">usuários e senhas</a> — você vai
        precisar credenciais. Espaço em disco para os dumps (1-2× o
        tamanho dos seus dados).
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Backup lógico</strong> — comandos SQL (CREATE TABLE,
        INSERT) num arquivo de texto. Portátil, lê em qualquer versão,
        edita à mão. Lento para bancos grandes. Ferramenta:{" "}
        <code>mysqldump</code> / <code>mariadb-dump</code>.
      </p>
      <p>
        <strong>Backup físico</strong> — cópia binária dos arquivos de
        dados (.ibd, ib_logfile…). Rápido (não converte nada), mas só
        restaura na mesma versão major. Ferramenta:{" "}
        <code>mariabackup</code>.
      </p>
      <p>
        <strong>Hot backup</strong> — backup feito com o servidor rodando
        e aceitando writes. <code>mariabackup</code> é hot.{" "}
        <code>mysqldump --single-transaction</code> é "quase hot" para
        InnoDB.
      </p>
      <p>
        <strong>Cold backup</strong> — backup com o servidor parado.
        Cópia da pasta <code>data/</code>. Mais simples, mas tem downtime.
      </p>
      <p>
        <strong>Binary log (binlog)</strong> — log sequencial de toda
        modificação. Permite point-in-time recovery (PITR): "quero o
        banco como estava terça às 14:32:11".
      </p>
      <p>
        <strong>3-2-1</strong> — regra básica: <strong>3</strong> cópias
        dos dados, em <strong>2</strong> mídias diferentes,{" "}
        <strong>1</strong> off-site (em outro lugar físico).
      </p>

      <h2>Backup lógico — mysqldump (mariadb-dump)</h2>
      <p>
        Vem dentro do XAMPP em{" "}
        <code>C:/xampp/mysql/bin/mysqldump.exe</code> (ou{" "}
        <code>mariadb-dump.exe</code> em versões novas). Gera um arquivo{" "}
        <code>.sql</code> com toda a estrutura e os dados.
      </p>

      <CodeBlock language="bash" code={`# Backup de um banco específico
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
    --databases loja > loja_completo.sql`} />

      <ParamsTable
        title="Flags úteis do mysqldump"
        params={[
          { flag: "-u root", desc: "Usuário do MySQL." },
          { flag: "-p", desc: "Vai pedir a senha (sem mostrar). Para senha vazia, dê -p e Enter." },
          { flag: '-p"senha"', desc: "Senha inline — visível no histórico do shell, evite em produção." },
          { flag: "-h 127.0.0.1", desc: "Host do banco. Padrão é localhost." },
          { flag: "-P 3306", desc: "Porta. Padrão 3306." },
          { flag: "--all-databases", desc: "Backup de TUDO (incluindo mysql, information_schema)." },
          { flag: "--databases db1 db2", desc: "Backup de bancos específicos (com CREATE DATABASE)." },
          { flag: "--no-data", desc: "Só estrutura. Útil para clonar schema sem mover dados." },
          { flag: "--no-create-info", desc: "Só os INSERTs. Útil pra repopular tabelas existentes." },
          { flag: "--single-transaction", desc: "Faz dump consistente em InnoDB sem travar tabelas. SEMPRE use para bancos só-InnoDB." },
          { flag: "--lock-tables", desc: "Trava todas as tabelas durante o dump. Necessário para MyISAM. Padrão se não usar --single-transaction." },
          { flag: "--default-character-set=utf8mb4", desc: "Garante que acentos e emojis sobrevivam. SEMPRE use." },
          { flag: "--routines", desc: "Inclui stored procedures e functions." },
          { flag: "--triggers", desc: "Inclui triggers (padrão é ON)." },
          { flag: "--events", desc: "Inclui events (job scheduler do MySQL)." },
          { flag: "--add-drop-database", desc: "Adiciona DROP DATABASE antes do CREATE — restore sobrescreve sem queixa." },
          { flag: "--add-drop-table", desc: "DROP TABLE antes do CREATE TABLE." },
          { flag: "--quick", desc: "Stream tabelas grandes sem carregar tudo em RAM. Padrão atualmente." },
          { flag: "--skip-extended-insert", desc: "Um INSERT por linha (em vez de INSERT em batch). Mais leve para diff/git." },
          { flag: "--where='condicao'", desc: "Backup parcial — só os registros que casam. Ex.: --where='created_at > 2024-01-01'" },
          { flag: "--ignore-table=db.tabela", desc: "Excluir uma tabela do dump. Útil para tabelas de log/sessão." },
          { flag: "--master-data=2", desc: "Inclui posição do binlog no dump (comentário). Necessário para PITR." },
        ]}
      />

      <h2>Restaurando um dump</h2>
      <CodeBlock language="bash" code={`# Restaurar (banco precisa existir, exceto se dump tiver CREATE DATABASE)
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
EOF`} />

      <h2>Backup automático no Windows (Agendador)</h2>
      <CodeBlock title="C:/xampp/scripts/backup-mysql.bat" language="bat" code={`@echo off
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

echo Backup salvo em %DESTINO%\\backup-%DATA%.sql`} />
      <p>
        Agende em <strong>Agendador de Tarefas</strong>: Tarefa Básica →
        diariamente, 03:00 → "Iniciar um programa" → aponte para esse{" "}
        <code>.bat</code>.
      </p>

      <h2>Backup automático no Linux (cron)</h2>
      <CodeBlock language="bash" code={`# Edite o cron
crontab -e

# Diário às 03:00 com retenção de 30 dias
0 3 * * * /opt/lampp/bin/mysqldump -u root -p'SENHA' --all-databases \\
    --single-transaction --routines --triggers --events \\
    | gzip > /var/backups/mysql/full-$(date +\\%Y-\\%m-\\%d).sql.gz \\
    && find /var/backups/mysql -name '*.sql.gz' -mtime +30 -delete`} />

      <AlertBox type="warning" title="Senha no comando = visível em ps aux">
        <code>-p"SENHA"</code> aparece no <code>ps aux</code> e em logs.
        Use o arquivo <code>~/.my.cnf</code> com permissão 600:
        <CodeBlock language="ini" code={`# ~/.my.cnf  (chmod 600)
[client]
user = root
password = SENHA`} />
        Aí <code>mysqldump --all-databases</code> conecta sem precisar
        de <code>-u/-p</code>.
      </AlertBox>

      <h2>Backup físico — mariabackup</h2>
      <p>
        Para bancos grandes (acima de ~10 GB),{" "}
        <code>mysqldump</code> fica lento. <code>mariabackup</code> faz
        cópia binária dos arquivos InnoDB enquanto o servidor está
        rodando, em uma fração do tempo.
      </p>
      <CodeBlock language="bash" code={`# Backup completo
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
    --user=root --password=SENHA`} />
      <p>
        <code>mariabackup</code> não vem no XAMPP Windows. No XAMPP Linux
        você precisa instalar separado (<code>apt install mariadb-backup</code>).
      </p>

      <h2>Cold backup — copiar a pasta data</h2>
      <p>
        Alternativa simples: parar o MySQL, copiar <code>mysql/data/</code>{" "}
        inteira. Funciona em InnoDB também — desde que o serviço esteja{" "}
        <strong>parado</strong>.
      </p>
      <CodeBlock language="bash" code={`# 1. Pare o MySQL pelo painel XAMPP

# 2. Copie a pasta data
xcopy /E /I /H "C:\\xampp\\mysql\\data" "C:\\Backups\\mysql-data-2026-05-02"

# 3. Inicie de novo`} />
      <AlertBox type="warning" title="Não copie data com MySQL rodando">
        Vai gerar arquivos corrompidos pela metade. Sempre pare o serviço
        primeiro: <code>painel → MySQL → Stop</code>.
      </AlertBox>

      <h2>Point-in-time recovery (PITR) com binlog</h2>
      <p>
        Cenário: alguém rodou <code>DELETE FROM produtos</code> sem
        WHERE às 14:32 de terça. Você quer restaurar o banco às 14:31:59.
      </p>
      <p>Para PITR funcionar, o binlog precisa estar ativo:</p>
      <CodeBlock language="ini" code={`# my.ini
[mysqld]
log-bin = mysql-bin
binlog_format = ROW
expire_logs_days = 14            # rotaciona após 14 dias
server-id = 1                    # obrigatório quando log-bin ativo`} />

      <CodeBlock language="bash" code={`# 1. Restaure o último backup completo (aquele com --master-data=2)
mysql -u root -p < backup-2026-05-01.sql

# 2. No comentário do dump, ache: -- CHANGE MASTER TO ... MASTER_LOG_FILE='...' MASTER_LOG_POS=...

# 3. Aplicar binlog desse ponto até pouco antes do desastre
mysqlbinlog \\
    --start-position=12345 \\
    --stop-datetime="2026-05-03 14:31:59" \\
    /var/lib/mysql/mysql-bin.000001 \\
    /var/lib/mysql/mysql-bin.000002 \\
    | mysql -u root -p`} />

      <h2>Restore parcial — só uma tabela</h2>
      <CodeBlock language="bash" code={`# Extrair APENAS uma tabela do dump completo
sed -n '/-- Table structure for table .produtos./,/-- Table structure for table /p' \\
    full-backup.sql > so-produtos.sql

# Ou — se o dump foi feito por tabela
mysql -u root -p loja < produtos.sql

# Reproduzir só DELETEs/UPDATEs do binlog em uma tabela
mysqlbinlog --database=loja mysql-bin.000001 \\
    | grep -i "produtos" \\
    | mysql -u root -p loja`} />

      <h2>phpMyAdmin: o caminho gráfico</h2>
      <p>
        Já vimos no capítulo <a href="#/phpmyadmin">phpMyAdmin</a>: aba
        <strong>Exportar</strong> / <strong>Importar</strong>. Bom para
        bancos pequenos. Para arquivos grandes (acima de ~50 MB) o limite
        de upload do PHP atrapalha — use o terminal ou aumente{" "}
        <code>upload_max_filesize</code> e <code>post_max_size</code> no{" "}
        <a href="#/php-ini">php.ini</a>.
      </p>

      <h2>Estratégia de backup recomendada (3-2-1)</h2>
      <ParamsTable
        title="O que rodar com que frequência"
        params={[
          { flag: "Diário (mysqldump completo)", desc: "Roda 03:00. Retém 14 dias. Local + cloud (S3/GDrive)." },
          { flag: "Horário (binlog rotation)", desc: "Sem ação manual — basta log-bin ativo. Mantém últimos 7 dias." },
          { flag: "Semanal (off-site)", desc: "Cópia do diário para outro disco físico ou serviço cloud." },
          { flag: "Mensal (cold)", desc: "Pasta data inteira após shutdown. Para versão arqueológica." },
          { flag: "Antes de migration", desc: "Backup específico nomeado: pre-migration-2026-05-03.sql" },
          { flag: "Restore TEST", desc: "Mensalmente, restaure em outro servidor e confira contagens. Backup não testado = sem backup." },
        ]}
      />
    </PageContainer>
  );
}
