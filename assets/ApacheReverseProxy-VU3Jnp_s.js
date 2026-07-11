import{j as e}from"./index-BreI0dyu.js";import{P as r,A as a}from"./AlertBox-C_bJKc46.js";import{C as o}from"./CodeBlock-D0rWxPIU.js";import{P as s}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function n(){return e.jsxs(r,{title:"Proxy reverso com mod_proxy",subtitle:"Sirva Node, Python, Go ou outro Apache pela porta 80/443 do XAMPP — sem expor portas extras. WebSockets, balanceador e cache inclusos.",difficulty:"avancado",timeToRead:"13 min",children:[e.jsxs(a,{type:"info",title:"Quando faz sentido",children:["Você roda um app Node em ",e.jsx("code",{children:":3000"}),", outro Python em ",e.jsx("code",{children:":5000"})," e quer acessar tudo via ",e.jsx("code",{children:"http://meusite.local/api"})," e ",e.jsx("code",{children:"http://meusite.local/app"})," ",'sem porta extra. O Apache é o "porteiro": recebe as requisições, encaminha aos backends, devolve a resposta.']}),e.jsx("h2",{children:"Módulos necessários"}),e.jsx(o,{title:"httpd.conf",language:"apache",code:`# Habilite (descomente) estas linhas:
LoadModule proxy_module             modules/mod_proxy.so
LoadModule proxy_http_module        modules/mod_proxy_http.so
LoadModule proxy_balancer_module    modules/mod_proxy_balancer.so
LoadModule proxy_wstunnel_module    modules/mod_proxy_wstunnel.so
LoadModule slotmem_shm_module       modules/mod_slotmem_shm.so
LoadModule lbmethod_byrequests_module modules/mod_lbmethod_byrequests.so
LoadModule headers_module           modules/mod_headers.so`}),e.jsx("h2",{children:"Proxy simples — passa tudo para um backend"}),e.jsx(o,{title:".htaccess ou VirtualHost",language:"apache",code:`# /api/qualquercoisa  ->  http://localhost:3000/qualquercoisa
ProxyPreserveHost On
ProxyPass        /api  http://localhost:3000
ProxyPassReverse /api  http://localhost:3000`}),e.jsx(s,{title:"Diretivas básicas",params:[{flag:"ProxyPass A B",desc:"Encaminha requisições para A para o backend B."},{flag:"ProxyPassReverse A B",desc:"Reescreve cabeçalhos Location/Set-Cookie de B para A — essencial em redirects."},{flag:"ProxyPreserveHost On",desc:"Preserva o Host original (importante para vhosts no backend)."},{flag:"ProxyTimeout 60",desc:"Tempo máximo aguardando o backend."},{flag:"ProxyRequests Off",desc:"Desativa proxy de saída (open proxy) — DEIXE OFF sempre."}]}),e.jsxs(a,{type:"warning",title:"ProxyPass com barra final é diferente",children:[e.jsx("code",{children:"ProxyPass /api http://localhost:3000"})," e ",e.jsx("code",{children:"ProxyPass /api/ http://localhost:3000/"})," ","têm comportamentos sutilmente diferentes. Mantenha consistência: ou ambos com barra ou ambos sem."]}),e.jsx("h2",{children:"VirtualHost completo (recomendado)"}),e.jsx(o,{title:"httpd-vhosts.conf",language:"apache",code:`<VirtualHost *:80>
    ServerName api.local
    ProxyPreserveHost On
    ProxyRequests Off

    <Proxy *>
        Require all granted
    </Proxy>

    ProxyPass        /  http://localhost:3000/
    ProxyPassReverse /  http://localhost:3000/

    # Encaminha o IP real do cliente
    RequestHeader set X-Real-IP "%{REMOTE_ADDR}s"
    RequestHeader set X-Forwarded-Proto "http"

    ErrorLog  "logs/api-error.log"
    CustomLog "logs/api-access.log" combined
</VirtualHost>`}),e.jsx("h2",{children:"WebSockets (Socket.io, chat, hot reload)"}),e.jsx(o,{language:"apache",code:`# WebSocket em /ws  ->  ws://localhost:3000/ws
RewriteEngine On
RewriteCond %{HTTP:Upgrade} websocket [NC]
RewriteCond %{HTTP:Connection} upgrade [NC]
RewriteRule ^/?ws/?(.*) "ws://localhost:3000/ws/$1" [P,L]

# Resto continua HTTP normal
ProxyPass        /  http://localhost:3000/
ProxyPassReverse /  http://localhost:3000/`}),e.jsx("h2",{children:"Balanceador de carga"}),e.jsx(o,{language:"apache",code:`<Proxy "balancer://meucluster">
    BalancerMember http://localhost:3001
    BalancerMember http://localhost:3002
    BalancerMember http://localhost:3003 status=+H   # +H = hot standby
    ProxySet lbmethod=byrequests
</Proxy>

ProxyPass        /api  balancer://meucluster
ProxyPassReverse /api  balancer://meucluster

# Painel administrativo do balanceador
<Location "/balancer-manager">
    SetHandler balancer-manager
    Require ip 127.0.0.1
</Location>`}),e.jsx(s,{title:"Métodos de balanceamento (lbmethod)",params:[{flag:"byrequests",desc:"Round-robin com contagem de requests (padrão)."},{flag:"bytraffic",desc:"Distribui pelo volume de bytes — bom para downloads grandes."},{flag:"bybusyness",desc:"Manda para o menos ocupado (em conexões abertas)."},{flag:"heartbeat",desc:"Backends reportam saúde em batida — exige mod_heartmonitor."}]}),e.jsx("h2",{children:"Cache de respostas"}),e.jsx(o,{language:"apache",code:`LoadModule cache_module modules/mod_cache.so
LoadModule cache_disk_module modules/mod_cache_disk.so

<IfModule mod_cache_disk.c>
    CacheRoot   "C:/xampp/cache"
    CacheEnable disk /static
    CacheDirLevels 2
    CacheDirLength 1
    CacheDefaultExpire 3600
    CacheMaxExpire 86400
    CacheIgnoreNoLastMod On
</IfModule>`}),e.jsx("h2",{children:"Receita: Apache na frente do Node + Laravel"}),e.jsx(o,{title:"httpd-vhosts.conf",language:"apache",code:`<VirtualHost *:80>
    ServerName meuapp.local

    # API em Node (Express)
    ProxyPass        /api  http://localhost:3000
    ProxyPassReverse /api  http://localhost:3000

    # SPA estática servida pelo Apache
    DocumentRoot "C:/xampp/htdocs/meuapp/dist"
    <Directory "C:/xampp/htdocs/meuapp/dist">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

<VirtualHost *:80>
    ServerName admin.meuapp.local
    DocumentRoot "C:/xampp/htdocs/admin/public"   # Laravel
    <Directory "C:/xampp/htdocs/admin/public">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>`}),e.jsx("h2",{children:"HTTPS no proxy"}),e.jsx("p",{children:"Se o backend é HTTPS auto-assinado, o Apache se recusa a falar com ele por padrão. Para ambiente local:"}),e.jsx(o,{language:"apache",code:`SSLProxyEngine On
SSLProxyVerify none
SSLProxyCheckPeerCN off
SSLProxyCheckPeerName off
SSLProxyCheckPeerExpire off

ProxyPass        /api  https://localhost:8443/
ProxyPassReverse /api  https://localhost:8443/`}),e.jsx("h2",{children:"Diagnóstico"}),e.jsx(o,{language:"bash",code:`# Confira se o módulo está ativo
httpd.exe -M | findstr proxy

# Pingue o backend direto
curl -i http://localhost:3000/health

# Teste pelo Apache
curl -i http://localhost/api/health

# Logs detalhados de proxy
LogLevel proxy:debug
ErrorLog "logs/error.log"`}),e.jsxs(a,{type:"warning",title:"ProxyRequests On = OPEN PROXY",children:["Jamais ative ",e.jsx("code",{children:"ProxyRequests On"})," em servidor exposto à internet. Você viraria um proxy aberto e seu IP seria usado por bots em segundos."]}),e.jsx("h2",{children:"Armadilhas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"ProxyPass"})," dentro de ",e.jsx("code",{children:"<Location /api>"})," funciona, mas a ordem importa — sempre declare o proxy ",e.jsx("em",{children:"antes"})," de outras regras conflitantes."]}),e.jsxs("li",{children:["Backend devolve ",e.jsx("code",{children:"Set-Cookie; Domain=localhost:3000"})," e o navegador descarta — use ",e.jsx("code",{children:"ProxyPassReverseCookieDomain"})," para reescrever."]}),e.jsxs("li",{children:["Erro ",e.jsx("code",{children:"503 Service Unavailable"}),": backend offline ou timeout muito curto. Aumente ",e.jsx("code",{children:"ProxyTimeout"}),"."]}),e.jsxs("li",{children:["WebSocket sem ",e.jsx("code",{children:"mod_proxy_wstunnel"})," ou sem o ",e.jsx("code",{children:"RewriteCond"})," de Upgrade — conexão cai a cada 30s."]})]})]})}export{n as default};
