import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function ApacheBenchmark() {
  return (
    <PageContainer
      title="Benchmark com ab, siege e wrk"
      subtitle="Quanto seu XAMPP aguenta? Como medir requisições por segundo, p99, throughput e detectar gargalos antes do usuário detectar."
      difficulty="avancado"
      timeToRead="11 min"
    >
      <AlertBox type="info" title="Por que medir em local?">
        Testar o XAMPP no seu PC tem dois objetivos: validar mudanças de configuração (você
        ajustou o php.ini, performance subiu ou caiu?) e descobrir gargalos antes de subir para
        produção (lentidão em uma rota, query N+1, cache ausente).
      </AlertBox>

      <h2>ab — ApacheBench</h2>
      <p>
        Vem com o XAMPP em <code>C:/xampp/apache/bin/ab.exe</code>. Sintaxe simples, ótimo para
        smoke test.
      </p>
      <CodeBlock
        language="bash"
        code={`# 1000 requisições, 50 simultâneas, na URL X
ab -n 1000 -c 50 http://localhost/

# Com keep-alive
ab -k -n 1000 -c 50 http://localhost/

# POST (precisa arquivo com o body)
ab -p body.json -T 'application/json' -n 500 -c 20 http://localhost/api/login

# Cabeçalhos custom (Authorization, Cookie)
ab -H "Authorization: Bearer abc" -n 500 -c 20 http://localhost/api/me`}
      />

      <ParamsTable
        title="Flags principais do ab"
        params={[
          { flag: "-n", desc: "Total de requisições." },
          { flag: "-c", desc: "Concorrência (número de conexões em paralelo)." },
          { flag: "-k", desc: "Keep-alive (HTTP 1.1)." },
          { flag: "-t N", desc: "Roda por N segundos em vez de número fixo." },
          { flag: "-p arquivo", desc: "Arquivo com body para POST/PUT." },
          { flag: "-T tipo", desc: "Content-Type do POST." },
          { flag: "-H 'X: Y'", desc: "Adiciona cabeçalho." },
          { flag: "-C 'k=v'", desc: "Cookie." },
          { flag: "-g out.tsv", desc: "Salva todos os tempos em TSV — gere gráfico no Excel." },
        ]}
      />

      <h2>Lendo o resultado</h2>
      <CodeBlock
        language="text"
        code={`Concurrency Level:      50
Time taken for tests:   3.421 seconds
Complete requests:      1000
Failed requests:        0
Requests per second:    292.31 [#/sec] (mean)
Time per request:       171.05 [ms] (mean)
Time per request:       3.421 [ms] (mean, across all concurrent requests)
Transfer rate:          82.45 [Kbytes/sec] received

Percentage of the requests served within a certain time (ms)
  50%    160
  66%    180
  75%    190
  80%    200
  90%    230
  95%    260
  98%    310
  99%    340
 100%   2310 (longest request)`}
      />

      <p>
        O <strong>p95</strong> e <strong>p99</strong> dizem mais que a média. Média de 171ms com
        p99 de 340ms é saudável. Média 171ms com p99 de 2310ms significa que 1% dos usuários
        sofrem brutalmente — algo escala mal (cache miss, GC, lock).
      </p>

      <h2>siege — mais realista</h2>
      <CodeBlock
        language="bash"
        code={`# Instalar (Linux): sudo apt install siege
# Windows via WSL ou Cygwin

# 25 usuários, durante 30 segundos
siege -c 25 -t 30s http://localhost/

# Lista de URLs sorteada (mais realista)
cat > urls.txt <<EOF
http://localhost/
http://localhost/produto/1
http://localhost/produto/2 POST {"qty":1}
http://localhost/api/cart  PUT  {"id":1}
EOF
siege -c 25 -t 30s -f urls.txt --content-type "application/json"

# Internet-throttling para simular 3G
siege -c 5 -t 30s --delay=3 http://localhost/`}
      />

      <h2>wrk — alta performance</h2>
      <p>
        Para testes pesados (10k+ rps) o ab fica limitado. <strong>wrk</strong> usa epoll/kqueue
        e dá números mais confiáveis — escolha quando quiser estressar de verdade.
      </p>
      <CodeBlock
        language="bash"
        code={`# 12 threads, 400 conexões, 30 segundos
wrk -t12 -c400 -d30s http://localhost/

# Script Lua para POST com body dinâmico
wrk -t4 -c100 -d30s -s post.lua http://localhost/api/login`}
      />
      <CodeBlock
        title="post.lua"
        language="lua"
        code={`wrk.method = "POST"
wrk.body   = '{"email":"a@b.com","senha":"123"}'
wrk.headers["Content-Type"] = "application/json"`}
      />

      <h2>Metodologia</h2>
      <ol>
        <li>
          <strong>Aqueça</strong> o servidor com 1 minuto de tráfego baixo antes de medir
          (caches do OPcache, do MariaDB, do filesystem).
        </li>
        <li>
          <strong>Isole</strong> uma variável por vez. Não troque o php.ini E o my.cnf na mesma
          rodada — você não saberá o que melhorou.
        </li>
        <li>
          Rode pelo menos <strong>3 vezes</strong> e compare. Variação de 5% é ruído.
        </li>
        <li>
          Meça <strong>com</strong> e <strong>sem</strong> cache para ter dois cenários.
        </li>
        <li>
          Olhe <strong>p99</strong>, não só média.
        </li>
      </ol>

      <h2>Receitas comuns</h2>

      <h3>Antes vs depois do OPcache</h3>
      <CodeBlock
        language="bash"
        code={`# 1) Desabilite o opcache (php.ini)
opcache.enable=0

# 2) ab -n 2000 -c 50 http://localhost/loja
# Suponha 80 rps

# 3) opcache.enable=1 + opcache.validate_timestamps=0
# 4) Repita: 320 rps  →  4× mais rápido
# Ganho típico ao ligar OPcache.`}
      />

      <h3>Antes vs depois de innodb_buffer_pool</h3>
      <CodeBlock
        language="bash"
        code={`# my.ini com 128M de buffer pool — gargalo em IO
ab -n 2000 -c 30 http://localhost/relatorio

# Suba para 1G, restart MariaDB, repita.
# Tempo de resposta médio cai dramaticamente em queries grandes.`}
      />

      <h3>Detectar N+1</h3>
      <p>
        Se ao aumentar a concorrência (<code>-c 1</code> → <code>-c 50</code>) o tempo médio
        cresce mais que linearmente, geralmente há query mal indexada ou N+1. Use o slow query
        log do MariaDB para confirmar.
      </p>

      <h2>O que NÃO fazer</h2>
      <AlertBox type="warning" title="Não rode benchmark contra produção">
        Você pode derrubar o site real ou ser bloqueado pelo provedor. Use réplica, ambiente de
        staging ou seu XAMPP local.
      </AlertBox>
      <AlertBox type="danger" title="Não compare ab com produção real">
        ab roda na mesma máquina, sem latência de rede, sem TLS handshake, sem CDN. Os números
        absolutos não traduzem para internet — sirvam para comparar versões.
      </AlertBox>

      <h2>Profiling complementar</h2>
      <ul>
        <li>
          <strong>Xdebug</strong> em modo profiler (<code>xdebug.mode=profile</code>) gera{" "}
          <em>cachegrind</em> — abra no <strong>KCachegrind</strong> ou Webgrind.
        </li>
        <li>
          <strong>Blackfire / Tideways</strong> — APM de PHP, paid mas brutal em diagnóstico.
        </li>
        <li>
          <strong>EXPLAIN</strong> + slow log do MariaDB para ver as queries reais.
        </li>
        <li>
          <strong>Devtools do navegador</strong> aba "Network" / "Performance" — para ver o que
          o cliente sente, não só o servidor.
        </li>
      </ul>

      <h2>Lista de checagem rápida (subiu lentidão de repente)</h2>
      <CodeBlock
        language="text"
        code={`1. Apache: /server-status — quantos workers livres?
2. PHP:    OPcache ativo? memory_limit?  error_log gigante?
3. MariaDB: SHOW PROCESSLIST — query travada?
4. Disco:  espaço em disco (ENOSPC) ou IO 100%?
5. Rede:   curl direto na porta do backend — devolve rápido?
6. Logs:   error.log do Apache nas últimas linhas — algum padrão?`}
      />
    </PageContainer>
  );
}
