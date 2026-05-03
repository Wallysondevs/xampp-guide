import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function ApacheStatus() {
  return (
    <PageContainer
      title="mod_status e mod_info — observabilidade do Apache"
      subtitle="Veja em tempo real quantos workers estão ocupados, quais URLs estão sendo servidas agora e qual a configuração efetiva — sem precisar abrir log algum."
      difficulty="intermediario"
      timeToRead="9 min"
    >
      <AlertBox type="info" title="O que cada um faz">
        <strong>mod_status</strong> — painel ao vivo de processos/threads, CPU, requests por
        segundo, lista de conexões ativas. <strong>mod_info</strong> — dump completo da config
        compilada e dos módulos carregados. Os dois são leitura, não alteram nada.
      </AlertBox>

      <h2>Habilitando</h2>
      <CodeBlock
        title="httpd.conf"
        language="apache"
        code={`# Carregar (já vem compilado no XAMPP)
LoadModule status_module modules/mod_status.so
LoadModule info_module   modules/mod_info.so

# Coleta detalhada (CPU por worker, tempos)
ExtendedStatus On

# Painel /server-status
<Location "/server-status">
    SetHandler server-status
    Require ip 127.0.0.1
    Require ip ::1
    # Em produção: liste IPs internos. NUNCA libere geral.
</Location>

# Painel /server-info
<Location "/server-info">
    SetHandler server-info
    Require ip 127.0.0.1
</Location>`}
      />
      <p>
        Reinicie o Apache. Acesse{" "}
        <code>http://localhost/server-status</code> e{" "}
        <code>http://localhost/server-info</code>.
      </p>

      <h2>Lendo /server-status</h2>
      <CodeBlock
        title="Cabeçalho típico"
        language="text"
        code={`Server Version: Apache/2.4.58 (Win64)
Current Time: Sunday, 03-May-2026 14:23:11 BRT
Restart Time: Sunday, 03-May-2026 09:11:00 BRT
Parent Server Generation: 0
Server uptime: 5 hours 12 minutes 11 seconds
Total accesses: 14823 - Total Traffic: 482.1 MB
CPU Usage: u3.21 s1.04 cu0 cs0 - .023% CPU load
0.79 requests/sec - 26.4 kB/second - 33.4 kB/request
3 requests currently being processed, 47 idle workers`}
      />

      <h2>Tabela de scoreboard</h2>
      <p>
        Cada worker é representado por um caractere; entender o estado é a chave do tuning.
      </p>
      <ParamsTable
        title="Códigos do scoreboard"
        params={[
          { flag: "_", desc: "Idle — pronto, sem fazer nada." },
          { flag: "S", desc: "Starting up." },
          { flag: "R", desc: "Reading request — recebendo cabeçalhos." },
          { flag: "W", desc: "Sending reply — escrevendo resposta." },
          { flag: "K", desc: "Keep-alive aberto, esperando próxima request do cliente." },
          { flag: "D", desc: "DNS lookup." },
          { flag: "C", desc: "Closing connection." },
          { flag: "L", desc: "Logging." },
          { flag: "G", desc: "Gracefully finishing — vai morrer após terminar." },
          { flag: "I", desc: "Idle cleanup of worker." },
          { flag: ".", desc: "Slot ainda não usado (potencial)." },
        ]}
      />

      <p>
        Se você vê <em>muito</em> <code>K</code> ocupando workers e nenhum <code>_</code> idle,
        sinal de que o keep-alive está consumindo seu pool — considere MPM event ou reduzir{" "}
        <code>KeepAliveTimeout</code>.
      </p>

      <h2>Modo automático (auto-refresh + JSON)</h2>
      <CodeBlock
        language="bash"
        code={`# HTML com refresh a cada 5 segundos
http://localhost/server-status?refresh=5

# Texto puro — útil pra scripts
curl http://localhost/server-status?auto

# Saída tipo:
# Total Accesses: 14823
# Total kBytes: 493670
# CPULoad: .023
# Uptime: 18731
# ReqPerSec: .79
# BytesPerSec: 26974
# BusyWorkers: 3
# IdleWorkers: 47`}
      />

      <h2>Coletando para Prometheus / Grafana</h2>
      <CodeBlock
        title="Exporter pronto"
        language="bash"
        code={`# https://github.com/Lusitaniae/apache_exporter
docker run -d --net=host \\
    lusotycoon/apache-exporter \\
    --scrape_uri="http://localhost/server-status?auto"

# Prometheus.yml
scrape_configs:
  - job_name: 'apache'
    static_configs:
      - targets: ['localhost:9117']`}
      />

      <h2>mod_info</h2>
      <p>
        Mostra todos os módulos carregados, em qual arquivo cada diretiva foi definida e a
        configuração final efetiva (depois de includes/overrides). Útil para descobrir{" "}
        <em>"de onde vem essa diretiva?"</em>.
      </p>
      <CodeBlock
        language="text"
        code={`Sections:
  - Server Settings
  - Module list (com link para a doc de cada um)
  - Active Configuration  ← aqui mostra arquivo + linha de cada diretiva
  - Active Hooks`}
      />

      <CodeBlock
        title="Acesso direto a uma seção"
        language="text"
        code={`http://localhost/server-info?config         (apenas config)
http://localhost/server-info?hooks          (hooks)
http://localhost/server-info?modules        (módulos)
http://localhost/server-info?mod_rewrite.c  (info de um módulo específico)`}
      />

      <h2>Segurança</h2>
      <AlertBox type="danger" title="NUNCA exponha publicamente">
        <code>/server-status</code> e <code>/server-info</code> revelam URLs sendo acessadas em
        tempo real, nomes de módulos, caminhos, versões — material de ouro pra atacante. Restrinja
        SEMPRE por IP. Em produção use VPN ou autenticação.
      </AlertBox>

      <CodeBlock
        title="Restrição mais robusta"
        language="apache"
        code={`<Location "/server-status">
    SetHandler server-status
    AuthType Basic
    AuthName "Status restrito"
    AuthUserFile "C:/xampp/auth/.htpasswd"
    <RequireAll>
        Require valid-user
        Require ip 192.168.1.0/24
    </RequireAll>
</Location>`}
      />

      <h2>Comparando com alternativas</h2>
      <ul>
        <li>
          <strong>mod_status</strong> — gratuito, embutido, leve. Funciona desde o boot.
        </li>
        <li>
          <strong>htop / Resource Monitor</strong> — só CPU/RAM por processo, sem
          contexto HTTP.
        </li>
        <li>
          <strong>Apache Exporter + Grafana</strong> — histórico, alertas, dashboards bonitos.
        </li>
        <li>
          <strong>tcpdump / Wireshark</strong> — análise de pacotes, mais profundo, mais lento.
        </li>
      </ul>

      <h2>Receita: alerta "ficou sem worker"</h2>
      <CodeBlock
        title="check_apache.ps1"
        language="powershell"
        code={`# Roda a cada minuto via Agendador de Tarefas
$resp = Invoke-WebRequest "http://localhost/server-status?auto" -UseBasicParsing
$busy = ($resp.Content -split "\\n" | Where-Object { $_ -match "BusyWorkers" }) -replace "[^\\d]"
$idle = ($resp.Content -split "\\n" | Where-Object { $_ -match "IdleWorkers" }) -replace "[^\\d]"

if ([int]$idle -lt 5) {
    # mande email / Slack
    Send-MailMessage -From alerta@empresa.com -To dev@empresa.com \\
        -Subject "Apache: $busy busy / $idle idle" -SmtpServer smtp.empresa.com
}`}
      />
    </PageContainer>
  );
}
