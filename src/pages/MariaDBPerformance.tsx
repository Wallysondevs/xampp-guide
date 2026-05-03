import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function MariaDBPerformance() {
  return (
    <PageContainer
      title="Tuning de performance no MariaDB"
      subtitle="As cinco diretivas que mais impactam, índices que ninguém criou, slow query log e EXPLAIN — saída prática para deixar o XAMPP rápido."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <AlertBox type="info" title="Onde mexer">
        Windows: <code>C:/xampp/mysql/bin/my.ini</code>. Linux:{" "}
        <code>/opt/lampp/etc/my.cnf</code>. Sempre dentro da seção <code>[mysqld]</code>. Toda
        mudança exige restart do MariaDB.
      </AlertBox>

      <h2>Os 5 ajustes de maior impacto</h2>
      <CodeBlock
        title="my.ini — base segura"
        language="ini"
        code={`[mysqld]
# 1) Buffer pool do InnoDB — cache de dados/índices
#    Regra: 50–70% da RAM em servidor dedicado.
#    No XAMPP local, 25–50% da RAM costuma bastar.
innodb_buffer_pool_size  = 1G

# 2) Tamanho do log redo (transações pendentes)
innodb_log_file_size     = 256M
innodb_log_buffer_size   = 16M

# 3) Política de flush (compromisso entre durabilidade e velocidade)
#    1 = ACID 100% (padrão). 2 = mais rápido, perde até 1s em crash.
innodb_flush_log_at_trx_commit = 1
innodb_flush_method            = O_DIRECT

# 4) Concurrency
innodb_thread_concurrency = 0          # 0 = sem limite (deixe o OS decidir)
innodb_io_capacity        = 200        # SSD: 1000–2000
innodb_io_capacity_max    = 400

# 5) Conexões
max_connections = 200
thread_cache_size = 16

# Cache de tabelas abertas
table_open_cache  = 4000
table_definition_cache = 2000

# Tmp tables em disco — evite reduzindo tmp_table_size
tmp_table_size    = 64M
max_heap_table_size = 64M

# Charset moderno
character-set-server = utf8mb4
collation-server     = utf8mb4_unicode_ci`}
      />

      <h2>Por que innodb_buffer_pool é tudo</h2>
      <p>
        Cada <code>SELECT</code> precisa ler páginas (de 16&nbsp;KB) do disco. Com buffer pool
        grande, essas páginas ficam em RAM — leitura subsequente é instantânea. Com pool pequeno,
        o MariaDB pisa no disco a cada query e tudo fica lento. Confira o hit rate:
      </p>
      <CodeBlock
        language="sql"
        code={`SHOW STATUS LIKE 'Innodb_buffer_pool_read%';

-- Innodb_buffer_pool_reads        ← leu do disco
-- Innodb_buffer_pool_read_requests← leu (incluindo cache)
-- Hit rate = 1 - reads/read_requests
-- Bom: > 0.99`}
      />

      <h2>Slow query log</h2>
      <CodeBlock
        title="my.ini"
        language="ini"
        code={`[mysqld]
slow_query_log       = 1
slow_query_log_file  = "C:/xampp/mysql/data/slow.log"
long_query_time      = 1.0          # segundos
log_queries_not_using_indexes = 1
log_slow_admin_statements    = 1`}
      />
      <p>
        Reinicie. Após algum tráfego, analise:
      </p>
      <CodeBlock
        language="bash"
        code={`# Ferramenta nativa
mysqldumpslow -s t -t 10 C:/xampp/mysql/data/slow.log

# Mais detalhada (Percona Toolkit, instala separado)
pt-query-digest C:/xampp/mysql/data/slow.log`}
      />

      <h2>EXPLAIN — entenda o plano</h2>
      <CodeBlock
        language="sql"
        code={`EXPLAIN
SELECT p.id, p.nome, c.nome AS categoria
  FROM produtos p
  JOIN categorias c ON c.id = p.categoria_id
 WHERE p.preco > 100
 ORDER BY p.preco DESC
 LIMIT 20;`}
      />
      <p>Colunas críticas:</p>
      <ParamsTable
        title="Colunas de EXPLAIN"
        params={[
          { flag: "type", desc: "Estratégia de acesso. ALL = pior (table scan). ref/range/eq_ref/const = ótimos." },
          { flag: "key", desc: "Índice escolhido. NULL = nenhum (problema)." },
          { flag: "rows", desc: "Estimativa de linhas lidas. Quanto maior, pior." },
          { flag: "Extra", desc: "'Using filesort' / 'Using temporary' são alertas de query pesada." },
          { flag: "filtered", desc: "% de linhas que passa pelo WHERE depois do índice." },
        ]}
      />

      <h2>Índices — onde criar</h2>
      <CodeBlock
        language="sql"
        code={`-- WHERE em coluna
CREATE INDEX idx_preco ON produtos (preco);

-- ORDER BY em coluna
CREATE INDEX idx_data ON pedidos (criado_em);

-- WHERE multi-coluna (ordem importa: cardinalidade maior à esquerda)
CREATE INDEX idx_user_data ON pedidos (user_id, criado_em);

-- Cobertura: já traz tudo do índice (sem ler tabela)
CREATE INDEX idx_cover ON produtos (categoria_id, preco, id, nome);

-- Único — também garante integridade
CREATE UNIQUE INDEX idx_email ON usuarios (email);

-- Texto livre (busca parcial)
ALTER TABLE produtos ADD FULLTEXT INDEX ft_nome (nome, descricao);`}
      />
      <CodeBlock
        title="Listar / inspecionar"
        language="sql"
        code={`SHOW INDEX FROM produtos;

-- Cardinalidade muito baixa = índice inútil
SELECT TABLE_NAME, INDEX_NAME, CARDINALITY
  FROM information_schema.STATISTICS
 WHERE TABLE_SCHEMA = 'loja'
 ORDER BY CARDINALITY ASC
 LIMIT 20;`}
      />

      <h2>Anti-patterns comuns</h2>
      <CodeBlock
        language="sql"
        code={`-- 1) Função em coluna anula o índice
SELECT * FROM pedidos WHERE YEAR(criado_em) = 2026;
-- Melhor:
SELECT * FROM pedidos
 WHERE criado_em >= '2026-01-01' AND criado_em < '2027-01-01';

-- 2) LIKE com curinga à esquerda
SELECT * FROM produtos WHERE nome LIKE '%bola%';   -- table scan
-- Melhor: índice FULLTEXT + MATCH AGAINST

-- 3) IN gigantesco (100+ valores)
SELECT * FROM logs WHERE id IN (...);
-- Melhor: tabela temporária + JOIN

-- 4) SELECT *
SELECT * FROM produtos WHERE id = 5;
-- Melhor: SELECT id, nome, preco FROM produtos WHERE id = 5;

-- 5) JOIN sem índice na coluna de junção
-- Confirme com EXPLAIN — JOIN type 'ALL' é o vilão`}
      />

      <h2>Cache de queries — atenção</h2>
      <p>
        O <strong>query_cache</strong> foi removido no MariaDB 10.4 (e desativado por padrão
        antes). Não conte com ele — invista em buffer pool e índices.
      </p>

      <h2>Performance Schema</h2>
      <CodeBlock
        language="sql"
        code={`-- Top queries por tempo total (precisa Performance Schema ON)
SELECT digest_text, count_star, sum_timer_wait/1e9 AS soma_ms
  FROM performance_schema.events_statements_summary_by_digest
 ORDER BY sum_timer_wait DESC
 LIMIT 10;

-- Top tabelas por IO
SELECT object_schema, object_name, count_read, count_write
  FROM performance_schema.table_io_waits_summary_by_table
 ORDER BY count_read + count_write DESC
 LIMIT 10;`}
      />

      <h2>Connection pooling no PHP</h2>
      <p>
        Cada chamada PHP padrão abre+fecha conexão. Em volume alto, isso vira gargalo. Opções:
      </p>
      <ul>
        <li>
          <code>PDO::ATTR_PERSISTENT =&gt; true</code> — conexão persiste entre requests no mesmo
          processo PHP-FPM. Cuidado com pool grande de processos.
        </li>
        <li>
          <strong>ProxySQL</strong> ou <strong>MaxScale</strong> — proxy de conexão que faz pool
          real, separa read/write, faz failover.
        </li>
      </ul>

      <h2>Checklist de tuning</h2>
      <CodeBlock
        language="text"
        code={`☐ innodb_buffer_pool_size dimensionado (50% RAM em servidor dedicado)
☐ innodb_log_file_size ≥ 256M
☐ Slow query log ativo (long_query_time = 1)
☐ EXPLAIN rodado nas top 10 queries do app
☐ Índices em colunas de WHERE / JOIN / ORDER BY
☐ Sem SELECT * em queries quentes
☐ Sem funções em colunas indexadas
☐ Charset utf8mb4 (não utf8 antigo)
☐ Backup com mysqldump --single-transaction (não trava)
☐ Monitoring: hit rate buffer pool > 99%`}
      />

      <h2>Ferramentas auxiliares</h2>
      <ul>
        <li>
          <strong>mysqltuner.pl</strong> — script Perl que analisa STATUS e VARIABLES e sugere
          ajustes. Bom ponto de partida.
        </li>
        <li>
          <strong>Percona Toolkit</strong> — pt-query-digest, pt-online-schema-change.
        </li>
        <li>
          <strong>Adminer</strong> — alternativa leve ao phpMyAdmin para inspecionar índices.
        </li>
        <li>
          <strong>EXPLAIN ANALYZE</strong> (MariaDB 10.1+) — executa e mostra tempo real, não só
          estimativa.
        </li>
      </ul>

      <AlertBox type="warning" title="Não copie configs prontas da internet">
        Configs "tuning para 32 GB" rodam mal em PC de 8 GB. Sempre dimensione pela RAM real e
        meça o resultado com <em>benchmarks</em>.
      </AlertBox>
    </PageContainer>
  );
}
