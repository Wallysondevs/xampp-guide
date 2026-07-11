import{j as e}from"./index-BreI0dyu.js";import{P as s,A as r}from"./AlertBox-C_bJKc46.js";import{C as o}from"./CodeBlock-D0rWxPIU.js";import{P as a}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function p(){return e.jsxs(s,{title:"MPMs — prefork, worker e event",subtitle:"O Apache atende cada requisição via um Multi-Processing Module. Entenda o trade-off de cada um e ajuste limites para não derrubar a máquina.",difficulty:"avancado",timeToRead:"11 min",children:[e.jsxs(r,{type:"info",title:"Conceito",children:["MPM é o motor de concorrência do Apache. ",e.jsx("strong",{children:"Apenas um"})," MPM fica ativo por vez, e ele decide se o servidor cria um processo por conexão (prefork), uma thread por conexão (worker), ou usa loops de eventos para keep-alive (event)."]}),e.jsx("h2",{children:"Os três MPMs"}),e.jsx(a,{title:"Comparativo",params:[{flag:"prefork",desc:"1 processo por conexão. Sem threads — seguro com extensões PHP não thread-safe (a maioria delas). Padrão histórico do XAMPP. Memória alta, throughput médio."},{flag:"worker",desc:"Múltiplos processos, cada um com várias threads. Menos memória, maior throughput. Exige PHP-FPM (não mod_php)."},{flag:"event",desc:"Igual ao worker, mas dedica threads para gerenciar conexões keep-alive sem ocupar workers ativos. Padrão moderno. Idem worker: precisa PHP-FPM."}]}),e.jsx("h2",{children:"Verificando o MPM ativo"}),e.jsx(o,{language:"bash",code:`# Windows / XAMPP
C:/xampp/apache/bin/httpd.exe -V | findstr MPM
# Server MPM:     WinNT

# Linux
/opt/lampp/bin/httpd -V | grep -i MPM
# Server MPM:     prefork`}),e.jsxs("p",{children:["No ",e.jsx("strong",{children:"Windows"})," o Apache só suporta o MPM ",e.jsx("code",{children:"winnt"})," — single-process, thread-pool. As diretivas que vamos ver afetam o número de threads, não processos."]}),e.jsx("h2",{children:"Ativando um MPM (Linux/macOS)"}),e.jsx(o,{title:"httpd.conf",language:"apache",code:`# Comente os outros, deixe apenas um:
LoadModule mpm_event_module modules/mod_mpm_event.so
# LoadModule mpm_worker_module modules/mod_mpm_worker.so
# LoadModule mpm_prefork_module modules/mod_mpm_prefork.so

# Inclua a config específica:
Include conf/extra/httpd-mpm.conf`}),e.jsx("h2",{children:"Configuração — prefork"}),e.jsx(o,{title:"extra/httpd-mpm.conf",language:"apache",code:`<IfModule mpm_prefork_module>
    StartServers             5
    MinSpareServers          5
    MaxSpareServers         10
    MaxRequestWorkers      150
    MaxConnectionsPerChild 1000
</IfModule>`}),e.jsx(a,{title:"Diretivas (prefork)",params:[{flag:"StartServers",desc:"Quantos processos filhos criar no boot."},{flag:"MinSpareServers",desc:"Mínimo de processos ociosos prontos para responder."},{flag:"MaxSpareServers",desc:"Máximo de ociosos antes de matar excedentes."},{flag:"MaxRequestWorkers",desc:"Limite TOTAL de processos simultâneos. Cada um = 1 conexão."},{flag:"MaxConnectionsPerChild",desc:"Recicla o processo após N requisições — protege contra memory leaks."}]}),e.jsx("h2",{children:"Configuração — worker / event"}),e.jsx(o,{title:"extra/httpd-mpm.conf",language:"apache",code:`<IfModule mpm_event_module>
    StartServers             3
    MinSpareThreads         75
    MaxSpareThreads        250
    ThreadLimit             64
    ThreadsPerChild         25
    MaxRequestWorkers      400
    MaxConnectionsPerChild   0
</IfModule>`}),e.jsx(a,{title:"Diretivas (worker / event)",params:[{flag:"ThreadsPerChild",desc:"Quantas threads cada processo cria."},{flag:"ThreadLimit",desc:"Teto rígido de ThreadsPerChild — só muda com restart 'graceful' especial."},{flag:"MaxRequestWorkers",desc:"Total de threads simultâneas (= processos × ThreadsPerChild)."},{flag:"MinSpareThreads / MaxSpareThreads",desc:"Pool de threads ociosas."},{flag:"MaxConnectionsPerChild",desc:"0 = nunca recicla. Use >0 se houver vazamento."}]}),e.jsx("h2",{children:"Como dimensionar"}),e.jsx("p",{children:"Regra prática para começar:"}),e.jsx(o,{title:"Cálculo",language:"text",code:`MaxRequestWorkers ≈ (RAM_total - RAM_para_OS_DB_cache) / RAM_por_processo

# Exemplo: servidor com 8 GB total
#   - 1 GB para SO
#   - 2 GB para MariaDB innodb_buffer_pool
#   - sobra: 5 GB
#   - cada processo prefork com mod_php pesado: ~80 MB
#   - MaxRequestWorkers = 5120 / 80 ≈ 64

# No event (sem mod_php), processo é bem mais leve (~30 MB) →
#   MaxRequestWorkers pode ser 200+`}),e.jsx("h2",{children:"Monitorando"}),e.jsxs("p",{children:["Ative ",e.jsx("code",{children:"mod_status"})," (capítulo dedicado) e acesse"," ",e.jsx("code",{children:"http://localhost/server-status"}),". Você verá quantos workers estão"," ",e.jsx("em",{children:"busy"}),", ",e.jsx("em",{children:"idle"}),", ",e.jsx("em",{children:"reading"}),", ",e.jsx("em",{children:"writing"}),". Se idle bate em zero com frequência, aumente ",e.jsx("code",{children:"MaxRequestWorkers"})," (cuidado com a RAM)."]}),e.jsx(o,{title:"Sintomas e ajuste",language:"text",code:`Sintoma: requisições engasgam, server-status mostra 0 workers idle
→ MaxRequestWorkers baixo. Aumente E confira se a RAM aguenta.

Sintoma: Apache ocupa toda a RAM, sistema vai pro swap
→ MaxRequestWorkers alto demais. Reduza ou troque para event+PHP-FPM.

Sintoma: lentidão depois de horas, restart resolve
→ memory leak em extensão PHP. Ajuste MaxConnectionsPerChild para 1000.

Sintoma: muitas conexões em keep-alive ocupam workers
→ Mude para MPM event (libera workers durante keep-alive).`}),e.jsx("h2",{children:"Keep-alive"}),e.jsx(o,{title:"httpd.conf",language:"apache",code:`KeepAlive On
MaxKeepAliveRequests 100
KeepAliveTimeout 5

# KeepAliveTimeout 65 (HTTP/1.1 pipelining) é demais para servidor lotado:
# o worker fica preso esperando o cliente mandar próxima request.
# 5s é equilíbrio bom para tráfego web típico — exceto no MPM event,
# onde 65s é seguro.`}),e.jsxs(r,{type:"warning",title:"mod_php trava no worker/event",children:["O ",e.jsx("strong",{children:"mod_php"})," (PHP rodando dentro do Apache) NÃO é thread-safe na maioria das extensões. Se ativar MPM worker/event com mod_php, espere falhas estranhas e crashes. Use"," ",e.jsx("strong",{children:"PHP-FPM"})," via ",e.jsx("code",{children:"mod_proxy_fcgi"})," (capítulo PHP-FPM)."]}),e.jsx("h2",{children:"Receita: stack moderna"}),e.jsx(o,{title:"httpd.conf",language:"apache",code:`# 1) MPM event ativo
LoadModule mpm_event_module modules/mod_mpm_event.so

# 2) PHP via FPM (não mod_php)
<FilesMatch "\\.php$">
    SetHandler "proxy:unix:/var/run/php/php8.4-fpm.sock|fcgi://localhost/"
</FilesMatch>

# 3) Compressão e cache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
</IfModule>

<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/* "access plus 30 days"
    ExpiresByType text/css "access plus 7 days"
    ExpiresByType application/javascript "access plus 7 days"
</IfModule>`}),e.jsx("h2",{children:"Armadilhas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Editar ",e.jsx("code",{children:"httpd-mpm.conf"})," mas esquecer o ",e.jsx("code",{children:"Include"})," no ",e.jsx("code",{children:"httpd.conf"}),"."]}),e.jsx("li",{children:"Trocar de prefork para event sem migrar para PHP-FPM — sintoma: páginas em branco aleatórias."}),e.jsxs("li",{children:["Esquecer que cada processo prefork carrega ",e.jsx("em",{children:"todo"})," o PHP — 80 MB × 200 processos = 16 GB de RAM."]}),e.jsxs("li",{children:["Subir ",e.jsx("code",{children:"KeepAliveTimeout"})," com prefork — mata throughput."]})]})]})}export{p as default};
