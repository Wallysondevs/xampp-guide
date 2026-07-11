import{j as e}from"./index-BreI0dyu.js";import{P as a,A as o}from"./AlertBox-C_bJKc46.js";import{C as s}from"./CodeBlock-D0rWxPIU.js";import{P as r}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function c(){return e.jsxs(a,{title:"mod_status e mod_info — observabilidade do Apache",subtitle:"Veja em tempo real quantos workers estão ocupados, quais URLs estão sendo servidas agora e qual a configuração efetiva — sem precisar abrir log algum.",difficulty:"intermediario",timeToRead:"9 min",children:[e.jsxs(o,{type:"info",title:"O que cada um faz",children:[e.jsx("strong",{children:"mod_status"})," — painel ao vivo de processos/threads, CPU, requests por segundo, lista de conexões ativas. ",e.jsx("strong",{children:"mod_info"})," — dump completo da config compilada e dos módulos carregados. Os dois são leitura, não alteram nada."]}),e.jsx("h2",{children:"Habilitando"}),e.jsx(s,{title:"httpd.conf",language:"apache",code:`# Carregar (já vem compilado no XAMPP)
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
</Location>`}),e.jsxs("p",{children:["Reinicie o Apache. Acesse"," ",e.jsx("code",{children:"http://localhost/server-status"})," e"," ",e.jsx("code",{children:"http://localhost/server-info"}),"."]}),e.jsx("h2",{children:"Lendo /server-status"}),e.jsx(s,{title:"Cabeçalho típico",language:"text",code:`Server Version: Apache/2.4.58 (Win64)
Current Time: Sunday, 03-May-2026 14:23:11 BRT
Restart Time: Sunday, 03-May-2026 09:11:00 BRT
Parent Server Generation: 0
Server uptime: 5 hours 12 minutes 11 seconds
Total accesses: 14823 - Total Traffic: 482.1 MB
CPU Usage: u3.21 s1.04 cu0 cs0 - .023% CPU load
0.79 requests/sec - 26.4 kB/second - 33.4 kB/request
3 requests currently being processed, 47 idle workers`}),e.jsx("h2",{children:"Tabela de scoreboard"}),e.jsx("p",{children:"Cada worker é representado por um caractere; entender o estado é a chave do tuning."}),e.jsx(r,{title:"Códigos do scoreboard",params:[{flag:"_",desc:"Idle — pronto, sem fazer nada."},{flag:"S",desc:"Starting up."},{flag:"R",desc:"Reading request — recebendo cabeçalhos."},{flag:"W",desc:"Sending reply — escrevendo resposta."},{flag:"K",desc:"Keep-alive aberto, esperando próxima request do cliente."},{flag:"D",desc:"DNS lookup."},{flag:"C",desc:"Closing connection."},{flag:"L",desc:"Logging."},{flag:"G",desc:"Gracefully finishing — vai morrer após terminar."},{flag:"I",desc:"Idle cleanup of worker."},{flag:".",desc:"Slot ainda não usado (potencial)."}]}),e.jsxs("p",{children:["Se você vê ",e.jsx("em",{children:"muito"})," ",e.jsx("code",{children:"K"})," ocupando workers e nenhum ",e.jsx("code",{children:"_"})," idle, sinal de que o keep-alive está consumindo seu pool — considere MPM event ou reduzir"," ",e.jsx("code",{children:"KeepAliveTimeout"}),"."]}),e.jsx("h2",{children:"Modo automático (auto-refresh + JSON)"}),e.jsx(s,{language:"bash",code:`# HTML com refresh a cada 5 segundos
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
# IdleWorkers: 47`}),e.jsx("h2",{children:"Coletando para Prometheus / Grafana"}),e.jsx(s,{title:"Exporter pronto",language:"bash",code:`# https://github.com/Lusitaniae/apache_exporter
docker run -d --net=host \\
    lusotycoon/apache-exporter \\
    --scrape_uri="http://localhost/server-status?auto"

# Prometheus.yml
scrape_configs:
  - job_name: 'apache'
    static_configs:
      - targets: ['localhost:9117']`}),e.jsx("h2",{children:"mod_info"}),e.jsxs("p",{children:["Mostra todos os módulos carregados, em qual arquivo cada diretiva foi definida e a configuração final efetiva (depois de includes/overrides). Útil para descobrir"," ",e.jsx("em",{children:'"de onde vem essa diretiva?"'}),"."]}),e.jsx(s,{language:"text",code:`Sections:
  - Server Settings
  - Module list (com link para a doc de cada um)
  - Active Configuration  ← aqui mostra arquivo + linha de cada diretiva
  - Active Hooks`}),e.jsx(s,{title:"Acesso direto a uma seção",language:"text",code:`http://localhost/server-info?config         (apenas config)
http://localhost/server-info?hooks          (hooks)
http://localhost/server-info?modules        (módulos)
http://localhost/server-info?mod_rewrite.c  (info de um módulo específico)`}),e.jsx("h2",{children:"Segurança"}),e.jsxs(o,{type:"danger",title:"NUNCA exponha publicamente",children:[e.jsx("code",{children:"/server-status"})," e ",e.jsx("code",{children:"/server-info"})," revelam URLs sendo acessadas em tempo real, nomes de módulos, caminhos, versões — material de ouro pra atacante. Restrinja SEMPRE por IP. Em produção use VPN ou autenticação."]}),e.jsx(s,{title:"Restrição mais robusta",language:"apache",code:`<Location "/server-status">
    SetHandler server-status
    AuthType Basic
    AuthName "Status restrito"
    AuthUserFile "C:/xampp/auth/.htpasswd"
    <RequireAll>
        Require valid-user
        Require ip 192.168.1.0/24
    </RequireAll>
</Location>`}),e.jsx("h2",{children:"Comparando com alternativas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"mod_status"})," — gratuito, embutido, leve. Funciona desde o boot."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"htop / Resource Monitor"})," — só CPU/RAM por processo, sem contexto HTTP."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Apache Exporter + Grafana"})," — histórico, alertas, dashboards bonitos."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"tcpdump / Wireshark"})," — análise de pacotes, mais profundo, mais lento."]})]}),e.jsx("h2",{children:'Receita: alerta "ficou sem worker"'}),e.jsx(s,{title:"check_apache.ps1",language:"powershell",code:`# Roda a cada minuto via Agendador de Tarefas
$resp = Invoke-WebRequest "http://localhost/server-status?auto" -UseBasicParsing
$busy = ($resp.Content -split "\\n" | Where-Object { $_ -match "BusyWorkers" }) -replace "[^\\d]"
$idle = ($resp.Content -split "\\n" | Where-Object { $_ -match "IdleWorkers" }) -replace "[^\\d]"

if ([int]$idle -lt 5) {
    # mande email / Slack
    Send-MailMessage -From alerta@empresa.com -To dev@empresa.com \\
        -Subject "Apache: $busy busy / $idle idle" -SmtpServer smtp.empresa.com
}`})]})}export{c as default};
