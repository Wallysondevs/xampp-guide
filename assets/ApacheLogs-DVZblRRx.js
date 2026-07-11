import{j as o}from"./index-BreI0dyu.js";import{P as s,A as r}from"./AlertBox-C_bJKc46.js";import{C as e}from"./CodeBlock-D0rWxPIU.js";import{P as a}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function n(){return o.jsxs(s,{title:"Logs do Apache — access.log e error.log na prática",subtitle:"Como ler, customizar formato (LogFormat), separar logs por VirtualHost, fazer rotação e analisar tráfego — tudo dentro do XAMPP.",difficulty:"intermediario",timeToRead:"12 min",children:[o.jsxs(r,{type:"info",title:"Onde ficam",children:["Padrão XAMPP: ",o.jsx("code",{children:"C:/xampp/apache/logs/access.log"})," e"," ",o.jsx("code",{children:"C:/xampp/apache/logs/error.log"}),". No Linux:"," ",o.jsx("code",{children:"/opt/lampp/logs/"}),". Os logs ",o.jsx("strong",{children:"nunca"})," param de crescer sozinhos — você precisa rotacionar."]}),o.jsx("h2",{children:"Os dois arquivos principais"}),o.jsxs("ul",{children:[o.jsxs("li",{children:[o.jsx("strong",{children:"access.log"}),' — uma linha por requisição HTTP recebida. É o "diário do tráfego": quem entrou, em qual URL, com qual status.']}),o.jsxs("li",{children:[o.jsx("strong",{children:"error.log"})," — erros do Apache, falhas de PHP (quando configurado para enviar pra cá), avisos de configuração, mensagens do mod_rewrite com trace."]})]}),o.jsx("h2",{children:"Lendo o access.log"}),o.jsx(e,{title:"Linha típica (formato 'combined')",language:"text",code:'192.168.0.10 - admin [03/Mai/2026:14:23:11 -0300] "GET /produto/42 HTTP/1.1" 200 4823 "https://meusite.local/loja" "Mozilla/5.0 (Windows NT 10.0)"'}),o.jsx("p",{children:"Quebrando os campos:"}),o.jsx(a,{title:"Campos do formato 'combined'",params:[{flag:"192.168.0.10",desc:"IP do cliente."},{flag:"-",desc:"Identidade RFC 1413 (quase sempre vazio)."},{flag:"admin",desc:"Usuário autenticado por mod_auth_* (vazio se anônimo)."},{flag:"[03/Mai/2026:14:23:11 -0300]",desc:"Data/hora local + offset do servidor."},{flag:'"GET /produto/42 HTTP/1.1"',desc:"Método, recurso, versão do protocolo."},{flag:"200",desc:"Status HTTP (200 ok, 301 redirect, 404 não achou, 500 erro)."},{flag:"4823",desc:"Bytes enviados (sem cabeçalhos)."},{flag:'"https://..."',desc:"Referer — página de onde o usuário veio."},{flag:'"Mozilla/5.0 ..."',desc:"User-Agent — navegador / bot."}]}),o.jsx("h2",{children:"Customizando o formato"}),o.jsxs("p",{children:["No ",o.jsx("code",{children:"httpd.conf"})," você define um ",o.jsx("strong",{children:"LogFormat"})," com placeholders e depois associa via ",o.jsx("strong",{children:"CustomLog"}),":"]}),o.jsx(e,{title:"httpd.conf",language:"apache",code:`# Formato padrão
LogFormat "%h %l %u %t \\"%r\\" %>s %b \\"%{Referer}i\\" \\"%{User-Agent}i\\"" combined

# Formato com tempo de resposta em microssegundos (ótimo para diagnosticar lentidão)
LogFormat "%h %l %u %t \\"%r\\" %>s %b %D \\"%{User-Agent}i\\"" perf

# Logs separados
CustomLog "logs/access.log" combined
CustomLog "logs/perf.log" perf`}),o.jsx(a,{title:"Placeholders mais úteis em LogFormat",params:[{flag:"%h",desc:"Host remoto (IP do cliente)."},{flag:"%t",desc:"Hora da requisição."},{flag:"%r",desc:"Primeira linha da requisição (método + URI + protocolo)."},{flag:"%>s",desc:"Status HTTP final (após reescritas)."},{flag:"%b",desc:"Bytes enviados (sem header)."},{flag:"%{Referer}i",desc:"Cabeçalho de entrada (substitua Referer por qualquer header)."},{flag:"%{User-Agent}i",desc:"Navegador/bot."},{flag:"%T",desc:"Tempo total da resposta em segundos."},{flag:"%D",desc:"Tempo total da resposta em microssegundos."},{flag:"%X",desc:"Estado da conexão ao final ('-' close, '+' keep-alive, 'X' aborted)."},{flag:"%{cookie_nome}C",desc:"Valor de um cookie."}]}),o.jsx("h2",{children:"Logs por Virtual Host"}),o.jsx(e,{title:"httpd-vhosts.conf",language:"apache",code:`<VirtualHost *:80>
    ServerName loja.local
    DocumentRoot "C:/xampp/htdocs/loja"
    ErrorLog "logs/loja-error.log"
    CustomLog "logs/loja-access.log" combined
</VirtualHost>

<VirtualHost *:80>
    ServerName api.local
    DocumentRoot "C:/xampp/htdocs/api"
    ErrorLog "logs/api-error.log"
    CustomLog "logs/api-access.log" combined
</VirtualHost>`}),o.jsx("h2",{children:"Lendo o error.log"}),o.jsx(e,{title:"Exemplos típicos",language:"text",code:`[Sun May 03 14:21:00.000 2026] [core:error] [pid 4392] [client 127.0.0.1:55012] AH00126: Invalid URI in request GET /\\xff\\xff
[Sun May 03 14:22:13.000 2026] [php:error] [pid 4392] PHP Fatal error: Uncaught Error: Class "Foo" not found in /htdocs/index.php:5
[Sun May 03 14:25:48.000 2026] [proxy:warn] [pid 4392] AH01144: No protocol handler was valid for the URL /api/`}),o.jsxs("p",{children:["O nível antes do ",o.jsx("code",{children:":"})," indica severidade — ",o.jsx("code",{children:"emerg"}),", ",o.jsx("code",{children:"alert"}),",",o.jsx("code",{children:"crit"}),", ",o.jsx("code",{children:"error"}),", ",o.jsx("code",{children:"warn"}),", ",o.jsx("code",{children:"notice"}),","," ",o.jsx("code",{children:"info"}),", ",o.jsx("code",{children:"debug"}),", ",o.jsx("code",{children:"trace1..8"}),". Defina o mínimo no"," ",o.jsx("code",{children:"httpd.conf"}),":"]}),o.jsx(e,{language:"apache",code:`LogLevel warn               # padrão sensato
LogLevel rewrite:trace3     # SÓ o mod_rewrite em trace3 (debug regras)
LogLevel proxy:debug        # debug para proxy reverso`}),o.jsx("h2",{children:"Análise rápida"}),o.jsx(e,{title:"Linhas mais lentas (PowerShell / Linux)",language:"bash",code:`# Linux / Git Bash — top 10 URLs mais lentas (precisa do %D no formato)
awk '{print $NF, $7}' logs/perf.log | sort -nr | head

# Top 20 IPs com mais hits
awk '{print $1}' logs/access.log | sort | uniq -c | sort -nr | head -20

# Códigos de status agrupados
awk '{print $9}' logs/access.log | sort | uniq -c | sort -nr

# Últimos 50 erros 500
grep ' 500 ' logs/access.log | tail -50

# Erros do PHP
grep -i 'php' logs/error.log | tail -50`}),o.jsx("h2",{children:"Rotação de logs"}),o.jsxs("p",{children:["Sem rotação, ",o.jsx("code",{children:"access.log"})," facilmente passa de 1 GB e degrada a performance do filesystem. O Apache traz o utilitário ",o.jsx("strong",{children:"rotatelogs"}),":"]}),o.jsx(e,{title:"Diariamente, mantendo no máximo 30 dias",language:"apache",code:`# Roda em pipe — Apache nunca segura o handle do arquivo
CustomLog "|bin/rotatelogs.exe -l logs/access-%Y%m%d.log 86400" combined

# 86400 segundos = 1 dia. Para 1 hora use 3600.
# -l = usar hora local em vez de UTC
# Limpe arquivos antigos com tarefa agendada / cron`}),o.jsxs("p",{children:["No Linux há também ",o.jsx("code",{children:"logrotate"})," (recomendado fora do XAMPP — leve e padrão)."]}),o.jsx("h2",{children:"Onde os erros do PHP aparecem?"}),o.jsxs("p",{children:["Depende de duas diretivas no ",o.jsx("code",{children:"php.ini"}),":"]}),o.jsx(e,{language:"ini",code:`log_errors = On
error_log = "C:/xampp/php/logs/php_error_log"

; Se log_errors = On e error_log estiver vazio, o PHP envia para o
; SAPI — no Apache cai no error.log do Apache.`}),o.jsxs(r,{type:"danger",title:"Não logue senhas",children:["Cuidado com formatos custom incluindo ",o.jsxs("code",{children:["%","{Cookie}i"]})," ou"," ",o.jsx("code",{children:"%q"})," (query string) — eles podem registrar tokens e dados sensíveis. Mascare antes de logar ou desative em produção."]}),o.jsx("h2",{children:"Ferramentas de visualização"}),o.jsxs("ul",{children:[o.jsxs("li",{children:[o.jsx("strong",{children:"GoAccess"})," — terminal interativo + relatório HTML, em segundos."]}),o.jsxs("li",{children:[o.jsx("strong",{children:"AWStats"})," — incluído como módulo extra do XAMPP."]}),o.jsxs("li",{children:[o.jsx("strong",{children:"Webalizer"})," — clássico (capítulo dedicado)."]}),o.jsxs("li",{children:[o.jsx("strong",{children:"Loki + Grafana"})," — para quem já está pronto para monitorar de verdade."]})]})]})}export{n as default};
