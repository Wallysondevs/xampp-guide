import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function ApacheMpms() {
  return (
    <PageContainer
      title="MPMs — prefork, worker e event"
      subtitle="O Apache atende cada requisição via um Multi-Processing Module. Entenda o trade-off de cada um e ajuste limites para não derrubar a máquina."
      difficulty="avancado"
      timeToRead="11 min"
    >
      <AlertBox type="info" title="Conceito">
        MPM é o motor de concorrência do Apache. <strong>Apenas um</strong> MPM fica ativo por
        vez, e ele decide se o servidor cria um processo por conexão (prefork), uma thread por
        conexão (worker), ou usa loops de eventos para keep-alive (event).
      </AlertBox>

      <h2>Os três MPMs</h2>
      <ParamsTable
        title="Comparativo"
        params={[
          {
            flag: "prefork",
            desc: "1 processo por conexão. Sem threads — seguro com extensões PHP não thread-safe (a maioria delas). Padrão histórico do XAMPP. Memória alta, throughput médio.",
          },
          {
            flag: "worker",
            desc: "Múltiplos processos, cada um com várias threads. Menos memória, maior throughput. Exige PHP-FPM (não mod_php).",
          },
          {
            flag: "event",
            desc: "Igual ao worker, mas dedica threads para gerenciar conexões keep-alive sem ocupar workers ativos. Padrão moderno. Idem worker: precisa PHP-FPM.",
          },
        ]}
      />

      <h2>Verificando o MPM ativo</h2>
      <CodeBlock
        language="bash"
        code={`# Windows / XAMPP
C:/xampp/apache/bin/httpd.exe -V | findstr MPM
# Server MPM:     WinNT

# Linux
/opt/lampp/bin/httpd -V | grep -i MPM
# Server MPM:     prefork`}
      />
      <p>
        No <strong>Windows</strong> o Apache só suporta o MPM <code>winnt</code> — single-process,
        thread-pool. As diretivas que vamos ver afetam o número de threads, não processos.
      </p>

      <h2>Ativando um MPM (Linux/macOS)</h2>
      <CodeBlock
        title="httpd.conf"
        language="apache"
        code={`# Comente os outros, deixe apenas um:
LoadModule mpm_event_module modules/mod_mpm_event.so
# LoadModule mpm_worker_module modules/mod_mpm_worker.so
# LoadModule mpm_prefork_module modules/mod_mpm_prefork.so

# Inclua a config específica:
Include conf/extra/httpd-mpm.conf`}
      />

      <h2>Configuração — prefork</h2>
      <CodeBlock
        title="extra/httpd-mpm.conf"
        language="apache"
        code={`<IfModule mpm_prefork_module>
    StartServers             5
    MinSpareServers          5
    MaxSpareServers         10
    MaxRequestWorkers      150
    MaxConnectionsPerChild 1000
</IfModule>`}
      />

      <ParamsTable
        title="Diretivas (prefork)"
        params={[
          { flag: "StartServers", desc: "Quantos processos filhos criar no boot." },
          { flag: "MinSpareServers", desc: "Mínimo de processos ociosos prontos para responder." },
          { flag: "MaxSpareServers", desc: "Máximo de ociosos antes de matar excedentes." },
          { flag: "MaxRequestWorkers", desc: "Limite TOTAL de processos simultâneos. Cada um = 1 conexão." },
          { flag: "MaxConnectionsPerChild", desc: "Recicla o processo após N requisições — protege contra memory leaks." },
        ]}
      />

      <h2>Configuração — worker / event</h2>
      <CodeBlock
        title="extra/httpd-mpm.conf"
        language="apache"
        code={`<IfModule mpm_event_module>
    StartServers             3
    MinSpareThreads         75
    MaxSpareThreads        250
    ThreadLimit             64
    ThreadsPerChild         25
    MaxRequestWorkers      400
    MaxConnectionsPerChild   0
</IfModule>`}
      />

      <ParamsTable
        title="Diretivas (worker / event)"
        params={[
          { flag: "ThreadsPerChild", desc: "Quantas threads cada processo cria." },
          { flag: "ThreadLimit", desc: "Teto rígido de ThreadsPerChild — só muda com restart 'graceful' especial." },
          { flag: "MaxRequestWorkers", desc: "Total de threads simultâneas (= processos × ThreadsPerChild)." },
          { flag: "MinSpareThreads / MaxSpareThreads", desc: "Pool de threads ociosas." },
          { flag: "MaxConnectionsPerChild", desc: "0 = nunca recicla. Use >0 se houver vazamento." },
        ]}
      />

      <h2>Como dimensionar</h2>
      <p>Regra prática para começar:</p>
      <CodeBlock
        title="Cálculo"
        language="text"
        code={`MaxRequestWorkers ≈ (RAM_total - RAM_para_OS_DB_cache) / RAM_por_processo

# Exemplo: servidor com 8 GB total
#   - 1 GB para SO
#   - 2 GB para MariaDB innodb_buffer_pool
#   - sobra: 5 GB
#   - cada processo prefork com mod_php pesado: ~80 MB
#   - MaxRequestWorkers = 5120 / 80 ≈ 64

# No event (sem mod_php), processo é bem mais leve (~30 MB) →
#   MaxRequestWorkers pode ser 200+`}
      />

      <h2>Monitorando</h2>
      <p>
        Ative <code>mod_status</code> (capítulo dedicado) e acesse{" "}
        <code>http://localhost/server-status</code>. Você verá quantos workers estão{" "}
        <em>busy</em>, <em>idle</em>, <em>reading</em>, <em>writing</em>. Se idle bate em zero
        com frequência, aumente <code>MaxRequestWorkers</code> (cuidado com a RAM).
      </p>

      <CodeBlock
        title="Sintomas e ajuste"
        language="text"
        code={`Sintoma: requisições engasgam, server-status mostra 0 workers idle
→ MaxRequestWorkers baixo. Aumente E confira se a RAM aguenta.

Sintoma: Apache ocupa toda a RAM, sistema vai pro swap
→ MaxRequestWorkers alto demais. Reduza ou troque para event+PHP-FPM.

Sintoma: lentidão depois de horas, restart resolve
→ memory leak em extensão PHP. Ajuste MaxConnectionsPerChild para 1000.

Sintoma: muitas conexões em keep-alive ocupam workers
→ Mude para MPM event (libera workers durante keep-alive).`}
      />

      <h2>Keep-alive</h2>
      <CodeBlock
        title="httpd.conf"
        language="apache"
        code={`KeepAlive On
MaxKeepAliveRequests 100
KeepAliveTimeout 5

# KeepAliveTimeout 65 (HTTP/1.1 pipelining) é demais para servidor lotado:
# o worker fica preso esperando o cliente mandar próxima request.
# 5s é equilíbrio bom para tráfego web típico — exceto no MPM event,
# onde 65s é seguro.`}
      />

      <AlertBox type="warning" title="mod_php trava no worker/event">
        O <strong>mod_php</strong> (PHP rodando dentro do Apache) NÃO é thread-safe na maioria das
        extensões. Se ativar MPM worker/event com mod_php, espere falhas estranhas e crashes. Use{" "}
        <strong>PHP-FPM</strong> via <code>mod_proxy_fcgi</code> (capítulo PHP-FPM).
      </AlertBox>

      <h2>Receita: stack moderna</h2>
      <CodeBlock
        title="httpd.conf"
        language="apache"
        code={`# 1) MPM event ativo
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
</IfModule>`}
      />

      <h2>Armadilhas</h2>
      <ul>
        <li>Editar <code>httpd-mpm.conf</code> mas esquecer o <code>Include</code> no <code>httpd.conf</code>.</li>
        <li>Trocar de prefork para event sem migrar para PHP-FPM — sintoma: páginas em branco aleatórias.</li>
        <li>
          Esquecer que cada processo prefork carrega <em>todo</em> o PHP — 80&nbsp;MB × 200
          processos = 16&nbsp;GB de RAM.
        </li>
        <li>Subir <code>KeepAliveTimeout</code> com prefork — mata throughput.</li>
      </ul>
    </PageContainer>
  );
}
