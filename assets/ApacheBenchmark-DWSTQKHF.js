import{j as e}from"./index-BreI0dyu.js";import{P as s,A as o}from"./AlertBox-C_bJKc46.js";import{C as a}from"./CodeBlock-D0rWxPIU.js";import{P as r}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function d(){return e.jsxs(s,{title:"Benchmark com ab, siege e wrk",subtitle:"Quanto seu XAMPP aguenta? Como medir requisições por segundo, p99, throughput e detectar gargalos antes do usuário detectar.",difficulty:"avancado",timeToRead:"11 min",children:[e.jsx(o,{type:"info",title:"Por que medir em local?",children:"Testar o XAMPP no seu PC tem dois objetivos: validar mudanças de configuração (você ajustou o php.ini, performance subiu ou caiu?) e descobrir gargalos antes de subir para produção (lentidão em uma rota, query N+1, cache ausente)."}),e.jsx("h2",{children:"ab — ApacheBench"}),e.jsxs("p",{children:["Vem com o XAMPP em ",e.jsx("code",{children:"C:/xampp/apache/bin/ab.exe"}),". Sintaxe simples, ótimo para smoke test."]}),e.jsx(a,{language:"bash",code:`# 1000 requisições, 50 simultâneas, na URL X
ab -n 1000 -c 50 http://localhost/

# Com keep-alive
ab -k -n 1000 -c 50 http://localhost/

# POST (precisa arquivo com o body)
ab -p body.json -T 'application/json' -n 500 -c 20 http://localhost/api/login

# Cabeçalhos custom (Authorization, Cookie)
ab -H "Authorization: Bearer abc" -n 500 -c 20 http://localhost/api/me`}),e.jsx(r,{title:"Flags principais do ab",params:[{flag:"-n",desc:"Total de requisições."},{flag:"-c",desc:"Concorrência (número de conexões em paralelo)."},{flag:"-k",desc:"Keep-alive (HTTP 1.1)."},{flag:"-t N",desc:"Roda por N segundos em vez de número fixo."},{flag:"-p arquivo",desc:"Arquivo com body para POST/PUT."},{flag:"-T tipo",desc:"Content-Type do POST."},{flag:"-H 'X: Y'",desc:"Adiciona cabeçalho."},{flag:"-C 'k=v'",desc:"Cookie."},{flag:"-g out.tsv",desc:"Salva todos os tempos em TSV — gere gráfico no Excel."}]}),e.jsx("h2",{children:"Lendo o resultado"}),e.jsx(a,{language:"text",code:`Concurrency Level:      50
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
 100%   2310 (longest request)`}),e.jsxs("p",{children:["O ",e.jsx("strong",{children:"p95"})," e ",e.jsx("strong",{children:"p99"})," dizem mais que a média. Média de 171ms com p99 de 340ms é saudável. Média 171ms com p99 de 2310ms significa que 1% dos usuários sofrem brutalmente — algo escala mal (cache miss, GC, lock)."]}),e.jsx("h2",{children:"siege — mais realista"}),e.jsx(a,{language:"bash",code:`# Instalar (Linux): sudo apt install siege
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
siege -c 5 -t 30s --delay=3 http://localhost/`}),e.jsx("h2",{children:"wrk — alta performance"}),e.jsxs("p",{children:["Para testes pesados (10k+ rps) o ab fica limitado. ",e.jsx("strong",{children:"wrk"})," usa epoll/kqueue e dá números mais confiáveis — escolha quando quiser estressar de verdade."]}),e.jsx(a,{language:"bash",code:`# 12 threads, 400 conexões, 30 segundos
wrk -t12 -c400 -d30s http://localhost/

# Script Lua para POST com body dinâmico
wrk -t4 -c100 -d30s -s post.lua http://localhost/api/login`}),e.jsx(a,{title:"post.lua",language:"lua",code:`wrk.method = "POST"
wrk.body   = '{"email":"a@b.com","senha":"123"}'
wrk.headers["Content-Type"] = "application/json"`}),e.jsx("h2",{children:"Metodologia"}),e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Aqueça"})," o servidor com 1 minuto de tráfego baixo antes de medir (caches do OPcache, do MariaDB, do filesystem)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Isole"})," uma variável por vez. Não troque o php.ini E o my.cnf na mesma rodada — você não saberá o que melhorou."]}),e.jsxs("li",{children:["Rode pelo menos ",e.jsx("strong",{children:"3 vezes"})," e compare. Variação de 5% é ruído."]}),e.jsxs("li",{children:["Meça ",e.jsx("strong",{children:"com"})," e ",e.jsx("strong",{children:"sem"})," cache para ter dois cenários."]}),e.jsxs("li",{children:["Olhe ",e.jsx("strong",{children:"p99"}),", não só média."]})]}),e.jsx("h2",{children:"Receitas comuns"}),e.jsx("h3",{children:"Antes vs depois do OPcache"}),e.jsx(a,{language:"bash",code:`# 1) Desabilite o opcache (php.ini)
opcache.enable=0

# 2) ab -n 2000 -c 50 http://localhost/loja
# Suponha 80 rps

# 3) opcache.enable=1 + opcache.validate_timestamps=0
# 4) Repita: 320 rps  →  4× mais rápido
# Ganho típico ao ligar OPcache.`}),e.jsx("h3",{children:"Antes vs depois de innodb_buffer_pool"}),e.jsx(a,{language:"bash",code:`# my.ini com 128M de buffer pool — gargalo em IO
ab -n 2000 -c 30 http://localhost/relatorio

# Suba para 1G, restart MariaDB, repita.
# Tempo de resposta médio cai dramaticamente em queries grandes.`}),e.jsx("h3",{children:"Detectar N+1"}),e.jsxs("p",{children:["Se ao aumentar a concorrência (",e.jsx("code",{children:"-c 1"})," → ",e.jsx("code",{children:"-c 50"}),") o tempo médio cresce mais que linearmente, geralmente há query mal indexada ou N+1. Use o slow query log do MariaDB para confirmar."]}),e.jsx("h2",{children:"O que NÃO fazer"}),e.jsx(o,{type:"warning",title:"Não rode benchmark contra produção",children:"Você pode derrubar o site real ou ser bloqueado pelo provedor. Use réplica, ambiente de staging ou seu XAMPP local."}),e.jsx(o,{type:"danger",title:"Não compare ab com produção real",children:"ab roda na mesma máquina, sem latência de rede, sem TLS handshake, sem CDN. Os números absolutos não traduzem para internet — sirvam para comparar versões."}),e.jsx("h2",{children:"Profiling complementar"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Xdebug"})," em modo profiler (",e.jsx("code",{children:"xdebug.mode=profile"}),") gera"," ",e.jsx("em",{children:"cachegrind"})," — abra no ",e.jsx("strong",{children:"KCachegrind"})," ou Webgrind."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Blackfire / Tideways"})," — APM de PHP, paid mas brutal em diagnóstico."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"EXPLAIN"})," + slow log do MariaDB para ver as queries reais."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Devtools do navegador"}),' aba "Network" / "Performance" — para ver o que o cliente sente, não só o servidor.']})]}),e.jsx("h2",{children:"Lista de checagem rápida (subiu lentidão de repente)"}),e.jsx(a,{language:"text",code:`1. Apache: /server-status — quantos workers livres?
2. PHP:    OPcache ativo? memory_limit?  error_log gigante?
3. MariaDB: SHOW PROCESSLIST — query travada?
4. Disco:  espaço em disco (ENOSPC) ou IO 100%?
5. Rede:   curl direto na porta do backend — devolve rápido?
6. Logs:   error.log do Apache nas últimas linhas — algum padrão?`})]})}export{d as default};
