import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function MariaDBReplicacao() {
  return (
    <PageContainer
      title="Replicação Master-Replica no MariaDB"
      subtitle="Como espelhar um banco em tempo real para outra instância — base para alta disponibilidade, backup ao vivo e separação de leitura/escrita."
      difficulty="avancado"
      timeToRead="13 min"
    >
      <AlertBox type="info" title="Casos de uso">
        Backup contínuo sem travar o servidor principal, balancear leituras (SELECT vai para
        replicas), failover quando o master cair, ambiente de relatório que não atrapalha o app
        de produção.
      </AlertBox>

      <h2>Como funciona</h2>
      <p>
        O <strong>master</strong> grava cada modificação num arquivo chamado <strong>binlog</strong>
        (registro binário). A <strong>replica</strong> mantém uma thread <em>I/O</em> que copia o
        binlog para um <strong>relay log</strong> local, e uma thread <em>SQL</em> que aplica esse
        relay log no banco. O resultado: a replica é uma cópia (quase) ao vivo do master.
      </p>
      <p>
        Há dois modos: <strong>file-position</strong> (clássico) e <strong>GTID</strong> (Global
        Transaction ID — recomendado em MariaDB 10.x).
      </p>

      <h2>1. Configurando o master</h2>
      <CodeBlock
        title="my.ini do master"
        language="ini"
        code={`[mysqld]
server-id           = 1
log-bin             = mysql-bin
binlog_format       = ROW
expire_logs_days    = 7
gtid_strict_mode    = ON
gtid_domain_id      = 0

# Bind no IP da rede para a replica chegar
bind-address        = 0.0.0.0`}
      />
      <p>Reinicie o MariaDB do master e crie o usuário de replicação:</p>
      <CodeBlock
        language="sql"
        code={`CREATE USER 'repl'@'%' IDENTIFIED BY 'senha_repl_forte';
GRANT REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'repl'@'%';
FLUSH PRIVILEGES;`}
      />

      <h2>2. Snapshot inicial</h2>
      <p>
        A replica precisa começar idêntica ao master. Tire um dump consistente:
      </p>
      <CodeBlock
        language="bash"
        code={`# Dump com posição do binlog incluída
mysqldump -u root -p \\
    --all-databases \\
    --master-data=2 \\
    --single-transaction \\
    --flush-logs \\
    --routines --triggers --events \\
    > master-dump.sql

# Veja a posição (cabeçalho do dump)
grep "CHANGE MASTER TO" master-dump.sql`}
      />
      <p>Você vai ver algo como:</p>
      <CodeBlock
        language="sql"
        code={`-- CHANGE MASTER TO MASTER_LOG_FILE='mysql-bin.000005', MASTER_LOG_POS=4823;`}
      />

      <h2>3. Configurando a replica</h2>
      <CodeBlock
        title="my.ini da replica"
        language="ini"
        code={`[mysqld]
server-id           = 2
relay-log           = relay-bin
read_only           = ON
gtid_strict_mode    = ON
log-slave-updates   = ON       # se essa replica for replicar para outra
skip-slave-start    = ON       # não começa sozinho (você decide)`}
      />
      <p>Restaure o dump:</p>
      <CodeBlock
        language="bash"
        code={`mysql -u root -p < master-dump.sql`}
      />

      <h2>4. Apontando a replica</h2>
      <CodeBlock
        title="No CLI da replica"
        language="sql"
        code={`-- Modo file-position (clássico)
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

START SLAVE;`}
      />

      <h2>5. Verificando</h2>
      <CodeBlock
        language="sql"
        code={`SHOW SLAVE STATUS\\G

-- Campos críticos:
-- Slave_IO_Running:    Yes
-- Slave_SQL_Running:   Yes
-- Seconds_Behind_Master: 0     ← atraso atual
-- Last_Error:          (vazio)`}
      />

      <ParamsTable
        title="Sintomas e causas"
        params={[
          { flag: "Slave_IO_Running: No", desc: "Rede / firewall / usuário 'repl' / senha errada." },
          { flag: "Slave_SQL_Running: No", desc: "Erro ao aplicar uma query (ver Last_SQL_Error)." },
          { flag: "Seconds_Behind_Master alto", desc: "Replica não consegue acompanhar — IO / disco / query lenta." },
          { flag: "Yes/Yes mas dados divergem", desc: "Alguém escreveu na replica diretamente — sempre read_only=ON." },
        ]}
      />

      <h2>Pulando um erro (com cuidado)</h2>
      <CodeBlock
        language="sql"
        code={`-- File-position
STOP SLAVE;
SET GLOBAL sql_slave_skip_counter = 1;
START SLAVE;

-- GTID
STOP SLAVE;
SET GLOBAL gtid_slave_pos = '0-1-12345';   -- pular para a próxima
START SLAVE;`}
      />
      <AlertBox type="warning" title="Pular = divergência">
        Pular eventos pode deixar replica e master diferentes. Documente, e dê re-snapshot
        completo se possível.
      </AlertBox>

      <h2>Promovendo replica a master (failover)</h2>
      <CodeBlock
        language="sql"
        code={`-- Na antiga replica
STOP SLAVE;
RESET SLAVE ALL;
SET GLOBAL read_only = OFF;

-- Aponte os apps novos para o IP dela
-- Configure as outras replicas para apontarem aqui
-- (aceite que pode haver pequena perda se replicação assíncrona estava atrasada)`}
      />

      <h2>Estratégias de uso</h2>
      <ul>
        <li>
          <strong>Read-replicas</strong> — escreve no master, lê das replicas. Frameworks
          (Laravel, Doctrine) suportam pool de hosts read/write.
        </li>
        <li>
          <strong>Backup contínuo</strong> — uma replica dedicada só pra rodar mysqldump sem
          travar produção.
        </li>
        <li>
          <strong>Standby</strong> — replica reserva, ligada à rede, pronta pra promover em segundos.
        </li>
        <li>
          <strong>Replicação multi-source</strong> (MariaDB 10.x): uma replica recebe binlog de
          vários masters — útil pra consolidar dados.
        </li>
      </ul>

      <h2>Galera Cluster — alternativa síncrona</h2>
      <p>
        Quando precisa de <strong>multi-master ativo</strong> (escrever em qualquer nó), MariaDB
        Galera Cluster usa replicação síncrona. Mais complexo, mas zero perda de dados em
        failover. Foge do escopo do XAMPP — anote para servidores Linux dedicados.
      </p>

      <h2>Replicação no XAMPP local (lab)</h2>
      <p>
        Dá para simular dois MariaDB no mesmo PC mudando portas:
      </p>
      <CodeBlock
        title="Cópia da pasta + mudança de porta"
        language="text"
        code={`1. Copie C:/xampp/mysql para C:/xampp/mysql2
2. Edite C:/xampp/mysql2/bin/my.ini:
       port = 3307
       socket = mysql2.sock
       datadir = C:/xampp/mysql2/data
       server-id = 2
3. Inicialize o data dir:
       C:/xampp/mysql2/bin/mariadb-install-db.exe --datadir=C:/xampp/mysql2/data
4. Suba como serviço Windows separado ou via console
5. Configure replicação como acima usando 127.0.0.1:3307 como replica`}
      />

      <h2>Backup com replica</h2>
      <CodeBlock
        language="bash"
        code={`# Na replica, durante a noite
STOP SLAVE;
mysqldump --all-databases --master-data=2 --single-transaction \\
    > /backups/full-$(date +%F).sql
START SLAVE;

# Resultado: dump consistente sem ter parado o master.`}
      />

      <h2>Armadilhas</h2>
      <ul>
        <li>
          server-id duplicado entre master e replica → replicação se recusa a iniciar.
        </li>
        <li>
          binlog_format <code>STATEMENT</code> com queries não determinísticas (NOW(), UUID())
          gera divergência. Use <code>ROW</code>.
        </li>
        <li>
          Esquecer <code>read_only=ON</code> na replica → desenvolvedor escreve lá pensando ser
          master e o master sobrescreve depois.
        </li>
        <li>
          Manter binlogs eternamente (<code>expire_logs_days</code> alto) → disco cheio em semanas.
        </li>
        <li>
          Replicação assíncrona = perda possível em failover. Aceite ou use Galera.
        </li>
      </ul>
    </PageContainer>
  );
}
