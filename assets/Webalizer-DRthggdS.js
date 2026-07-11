import{j as e}from"./index-BreI0dyu.js";import{P as i,A as s}from"./AlertBox-C_bJKc46.js";import{C as a}from"./CodeBlock-D0rWxPIU.js";import{P as o}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function d(){return e.jsxs(i,{title:"Webalizer e AWStats — relatórios estáticos do access.log",subtitle:"Ferramentas clássicas para gerar relatórios HTML a partir do access.log do Apache. Quando ainda fazem sentido, configuração mínima e alternativas modernas.",difficulty:"iniciante",timeToRead:"8 min",children:[e.jsx(s,{type:"info",title:"Por que ainda existem?",children:"Não dependem de JavaScript no cliente, não vazam dados pra terceiros, processam logs offline e produzem HTML estático que aguenta qualquer carga. Para intranet e relatórios regulatórios, ainda são úteis."}),e.jsx("h2",{children:"O Webalizer"}),e.jsx("p",{children:"Distribuído com o XAMPP Linux/macOS (em Windows você baixa separado). Lê o access.log do Apache e produz dashboards mensais com:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Total de visitas, hits, bytes"}),e.jsx("li",{children:"Top URLs, top IPs, top User-Agents"}),e.jsx("li",{children:"Países (precisa GeoIP)"}),e.jsx("li",{children:"Histórico mensal/anual em gráficos PNG"})]}),e.jsx("h2",{children:"Instalação"}),e.jsx(a,{language:"bash",code:`# Linux (fora do XAMPP)
sudo apt install webalizer        # Debian/Ubuntu
sudo dnf install webalizer         # Fedora/Rocky

# macOS
brew install webalizer

# Windows: baixe http://www.webalizer.org/download.html (port antigo)`}),e.jsx("h2",{children:"Configuração mínima"}),e.jsx(a,{title:"/etc/webalizer/webalizer.conf  (ou C:/Program Files/Webalizer/webalizer.conf)",language:"ini",code:`# Onde está o access.log
LogFile     /opt/lampp/logs/access_log
LogType     clf

# Onde gerar os HTMLs
OutputDir   /opt/lampp/htdocs/webalizer
HistoryName webalizer.hist
ReportTitle Estatísticas — meu site
HostName    meusite.local

# Identifique seu próprio tráfego como "interno"
HideSite    *meusite.local
HideURL     *.gif
HideURL     *.jpg
HideURL     *.png
HideURL     *.css
HideURL     *.js

# Agrupar referers
GroupReferrer http://www.google.   Google
GroupReferrer http://www.bing.     Bing

# Ignorar bots conhecidos
IgnoreAgent  Googlebot
IgnoreAgent  bingbot

# Saída em HTML 5
HTMLPre      <!DOCTYPE html>`}),e.jsx("h2",{children:"Rodando"}),e.jsx(a,{language:"bash",code:`# Manual
webalizer -c /etc/webalizer/webalizer.conf

# Saída esperada
# Webalizer V2.23-08 ...
# Using logfile /opt/lampp/logs/access_log
# Records: 14823, ...
# Generating report for May 2026
# Generating summary report

# Acesse
http://localhost/webalizer/`}),e.jsx("h2",{children:"Automatizando — cron diário"}),e.jsx(a,{title:"/etc/cron.d/webalizer",language:"bash",code:`# Toda madrugada às 03:30
30 3 * * * root /usr/bin/webalizer -c /etc/webalizer/webalizer.conf >> /var/log/webalizer.log 2>&1`}),e.jsx(a,{title:"Windows — Agendador de Tarefas",language:"text",code:`Programa: C:\\Program Files\\Webalizer\\webalizer.exe
Argumentos: -c "C:\\Program Files\\Webalizer\\webalizer.conf"
Frequência: diária 03:30`}),e.jsx("h2",{children:"GeoIP — saber de onde vêm"}),e.jsx("p",{children:"O Webalizer usa a base GeoIP da MaxMind. Hoje o GeoLite2 exige cadastro grátis para baixar:"}),e.jsx(a,{language:"bash",code:`# 1) Cadastre em maxmind.com → baixe GeoLite2-Country.mmdb
# 2) Webalizer 2.23+ usa libGeoIP
sudo cp GeoLite2-Country.mmdb /usr/share/GeoIP/

# webalizer.conf
GeoDB        yes
GeoDBDatabase /usr/share/GeoIP/GeoLite2-Country.mmdb`}),e.jsx("h2",{children:"AWStats — alternativa mais rica"}),e.jsx("p",{children:"Outra ferramenta clássica, escrita em Perl. Vem com painel HTML mais detalhado e suporta mais formatos de log."}),e.jsx(a,{language:"bash",code:`# Instalar
sudo apt install awstats

# Cria config para o site
sudo cp /etc/awstats/awstats.conf /etc/awstats/awstats.meusite.conf

# Edite essencial:
# LogFile="/opt/lampp/logs/access_log"
# SiteDomain="meusite.local"
# DirData="/var/lib/awstats"
# DirCgi="/cgi-bin/awstats"
# DirIcons="/icon"

# Atualizar
sudo /usr/lib/cgi-bin/awstats.pl -update -config=meusite

# Acesso via CGI
http://localhost/cgi-bin/awstats.pl?config=meusite`}),e.jsx(a,{title:"httpd.conf — ScriptAlias",language:"apache",code:`Alias /awstats-icon "/usr/share/awstats/icon/"
ScriptAlias /awstats /usr/lib/cgi-bin/awstats.pl

<Directory "/usr/lib/cgi-bin">
    Options +ExecCGI
    Require ip 127.0.0.1
    AuthType Basic
    AuthName "Stats"
    AuthUserFile "/etc/httpd/.htpasswd"
    Require valid-user
</Directory>`}),e.jsx("h2",{children:"GoAccess — moderna e em tempo real"}),e.jsxs("p",{children:["Recomendação se você está começando hoje: ",e.jsx("strong",{children:"GoAccess"})," é mais rápido, dá relatório terminal interativo + HTML auto-atualizando, sem cron."]}),e.jsx(a,{language:"bash",code:`# Instalar
sudo apt install goaccess

# Modo terminal interativo
goaccess /opt/lampp/logs/access_log -c

# Gerar HTML estático
goaccess access_log -o report.html --log-format=COMBINED

# Tempo real (atualiza via WebSocket)
goaccess access_log -o /var/www/html/report.html \\
    --log-format=COMBINED --real-time-html`}),e.jsx(o,{title:"Comparativo",params:[{flag:"Webalizer",desc:"Leve, ultra portátil, gráficos PNG estáticos. Visual datado."},{flag:"AWStats",desc:"Mais detalhe (motores de busca, sistemas operacionais), CGI Perl."},{flag:"GoAccess",desc:"Moderno, real-time, HTML responsivo, terminal."},{flag:"Matomo (ex-Piwik)",desc:"Plataforma completa estilo Google Analytics, self-hosted, exige PHP+MariaDB."},{flag:"Plausible / Umami",desc:"Analytics privacy-first, web-based, requer instalação dedicada."}]}),e.jsx("h2",{children:"Onde Webalizer falha"}),e.jsxs("ul",{children:[e.jsx("li",{children:'Não detecta SPAs (uma "URL" para o usuário pode ser zero requisições novas).'}),e.jsx("li",{children:"Não rastreia eventos (clicks, scroll, conversão)."}),e.jsx("li",{children:"Não mostra duração de sessão real."}),e.jsxs("li",{children:["Bots/crawlers inflam números — exige ",e.jsx("code",{children:"IgnoreAgent"})," bem mantido."]})]}),e.jsx("h2",{children:"Receita: dashboard semanal por email"}),e.jsx(a,{title:"Linux",language:"bash",code:`# /usr/local/bin/relatorio-semanal.sh
webalizer -c /etc/webalizer/webalizer.conf

cd /opt/lampp/htdocs/webalizer
zip -qr /tmp/stats.zip .
echo "Relatório anexo." | mail -s "Stats $(date +%V)" \\
    -a /tmp/stats.zip dono@empresa.com

# Cron: 0 8 * * 1   /usr/local/bin/relatorio-semanal.sh`}),e.jsxs(s,{type:"warning",title:"Proteja /webalizer",children:["A pasta gerada contém URLs internas, IPs visitantes, padrões de tráfego. Restrinja por"," ",e.jsx("code",{children:"Require ip"})," ou ",e.jsx("code",{children:"AuthBasic"})," — capítulo Apache Auth."]}),e.jsx("h2",{children:"Armadilhas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Apontar ",e.jsx("code",{children:"LogFile"})," para um access.log já rotacionado (vazio) — relatório fica em branco."]}),e.jsxs("li",{children:["Esquecer ",e.jsx("code",{children:"HideURL *.png"}),' — assets inflam contagem de "páginas".']}),e.jsx("li",{children:'Não atualizar lista de bots — meses depois, 80% das "visitas" é AhrefsBot.'}),e.jsx("li",{children:'GeoIP desatualizado — IPs novos saem como "Unknown".'})]})]})}export{d as default};
