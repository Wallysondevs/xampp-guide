import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function MysqlConfig() {
  return (
    <PageContainer
      title="my.ini — configurando o MariaDB do XAMPP"
      subtitle="O 'MySQL' do XAMPP, na verdade, é MariaDB. As diretivas mudam pouco, mas vale conhecer."
      difficulty="intermediario"
      timeToRead="7 min"
    >
      <h2>MySQL ou MariaDB?</h2>
      <p>
        Desde a versão 5.5 do XAMPP, o "MySQL" do painel é na verdade o{" "}
        <strong>MariaDB</strong> — um fork compatível, mantido pelos
        criadores originais do MySQL após a aquisição pela Oracle. Para 99% dos
        usos é transparente: clientes, drivers e queries funcionam igual.
      </p>

      <h2>Onde fica o my.ini</h2>
      <ul>
        <li>Windows: <code>C:/xampp/mysql/bin/my.ini</code></li>
        <li>Linux: <code>/opt/lampp/etc/my.cnf</code></li>
        <li>macOS: <code>/Applications/XAMPP/etc/my.cnf</code></li>
      </ul>
      <p>
        Pelo painel: clique em <em>Config</em> ao lado de MySQL → <code>my.ini</code>.
      </p>

      <h2>Diretivas que você vai mexer</h2>
      <ParamsTable
        title="As mais usadas em [mysqld] e [client]"
        params={[
          { flag: "port", desc: "Porta em que o MariaDB escuta. Padrão 3306. Mude se conflitar com outro MySQL.", exemplo: "port = 3306" },
          { flag: "datadir", desc: "Onde os bancos ficam fisicamente. Padrão é mysql/data/. Pode mudar pra outro disco se quiser.", exemplo: 'datadir = "C:/xampp/mysql/data"' },
          { flag: "max_allowed_packet", desc: "Tamanho máximo de uma única query/pacote. Suba para 64M ou mais se importar dumps grandes.", exemplo: "max_allowed_packet = 64M" },
          { flag: "innodb_buffer_pool_size", desc: "Cache de tabelas InnoDB em RAM. Quanto mais, mais rápido. Em dev, 128M-512M tá ótimo.", exemplo: "innodb_buffer_pool_size = 256M" },
          { flag: "max_connections", desc: "Quantas conexões simultâneas ao banco. 100 é o padrão e raramente precisa mexer em dev.", exemplo: "max_connections = 200" },
          { flag: "character-set-server", desc: "Charset padrão. Para acentos e emojis, sempre utf8mb4.", exemplo: "character-set-server = utf8mb4" },
          { flag: "collation-server", desc: "Collation padrão. Combine com utf8mb4 — utf8mb4_unicode_ci ou utf8mb4_general_ci.", exemplo: "collation-server = utf8mb4_unicode_ci" },
          { flag: "sql_mode", desc: "Modo de validação do SQL. STRICT_TRANS_TABLES é mais seguro. ONLY_FULL_GROUP_BY pode quebrar queries antigas.", exemplo: "sql_mode = STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION" },
          { flag: "default-time-zone", desc: "Fuso horário do banco. Para o Brasil, '-03:00'.", exemplo: "default-time-zone = '-03:00'" },
          { flag: "log_error", desc: "Caminho do log de erros do MySQL. Sempre olhe quando o serviço não inicia.", exemplo: 'log_error = "C:/xampp/mysql/data/mysql_error.log"' },
          { flag: "general_log + general_log_file", desc: "Loga TODAS as queries. Útil em debug, péssimo em produção (cresce muito rápido).", exemplo: "general_log = 1" },
          { flag: "slow_query_log + long_query_time", desc: "Loga só queries que demoram mais que long_query_time segundos. Ideal pra encontrar gargalos.", exemplo: "long_query_time = 1" },
        ]}
      />

      <h2>Receita de bolo: my.ini para desenvolvimento</h2>
      <CodeBlock language="ini" code={`[client]
port = 3306
default-character-set = utf8mb4

[mysqld]
port = 3306
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
default-time-zone = '-03:00'

max_allowed_packet = 64M
innodb_buffer_pool_size = 256M
max_connections = 200

sql_mode = STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION

# Logs
log_error = "C:/xampp/mysql/data/mysql_error.log"
slow_query_log = 1
slow_query_log_file = "C:/xampp/mysql/data/mysql_slow.log"
long_query_time = 2

[mysql]
default-character-set = utf8mb4

[mysqldump]
default-character-set = utf8mb4
max_allowed_packet = 64M`} />

      <AlertBox type="warning" title="Reinicie o MySQL após mudar o my.ini">
        Diferente do <code>.htaccess</code>, mudanças no <code>my.ini</code>
        só valem ao parar e iniciar o serviço MySQL no painel.
      </AlertBox>

      <h2>Conferindo as configurações ativas</h2>
      <p>Conecte no MySQL e rode:</p>
      <CodeBlock language="sql" code={`-- Variáveis ativas
SHOW VARIABLES LIKE 'char%';
SHOW VARIABLES LIKE 'innodb_buffer%';
SHOW VARIABLES LIKE 'max_connections';
SHOW VARIABLES LIKE 'time_zone';

-- Status atual (queries por segundo, conexões abertas, etc.)
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Uptime';`} />

      <h2>MySQL não inicia depois de mexer no my.ini</h2>
      <p>É a coisa mais comum do mundo. Olhe o log:</p>
      <CodeBlock language="text" code={`C:/xampp/mysql/data/mysql_error.log
ou
C:/xampp/mysql/data/<NOME-DO-PC>.err`} />
      <p>
        Os erros mais frequentes são: typo no <code>my.ini</code> (linha
        sem <code>=</code>, valor com espaço estranho), <code>datadir</code>{" "}
        apontando para pasta inexistente, ou tabela InnoDB corrompida (veja{" "}
        <a href="#/erros-comuns">erros comuns</a>).
      </p>
    </PageContainer>
  );
}
