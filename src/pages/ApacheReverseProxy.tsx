import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function ApacheReverseProxy() {
  return (
    <PageContainer
      title="Proxy reverso com mod_proxy"
      subtitle="Sirva Node, Python, Go ou outro Apache pela porta 80/443 do XAMPP — sem expor portas extras. WebSockets, balanceador e cache inclusos."
      difficulty="avancado"
      timeToRead="13 min"
    >
      <AlertBox type="info" title="Quando faz sentido">
        Você roda um app Node em <code>:3000</code>, outro Python em <code>:5000</code> e quer
        acessar tudo via <code>http://meusite.local/api</code> e <code>http://meusite.local/app</code>{" "}
        sem porta extra. O Apache é o "porteiro": recebe as requisições, encaminha aos backends,
        devolve a resposta.
      </AlertBox>

      <h2>Módulos necessários</h2>
      <CodeBlock
        title="httpd.conf"
        language="apache"
        code={`# Habilite (descomente) estas linhas:
LoadModule proxy_module             modules/mod_proxy.so
LoadModule proxy_http_module        modules/mod_proxy_http.so
LoadModule proxy_balancer_module    modules/mod_proxy_balancer.so
LoadModule proxy_wstunnel_module    modules/mod_proxy_wstunnel.so
LoadModule slotmem_shm_module       modules/mod_slotmem_shm.so
LoadModule lbmethod_byrequests_module modules/mod_lbmethod_byrequests.so
LoadModule headers_module           modules/mod_headers.so`}
      />

      <h2>Proxy simples — passa tudo para um backend</h2>
      <CodeBlock
        title=".htaccess ou VirtualHost"
        language="apache"
        code={`# /api/qualquercoisa  ->  http://localhost:3000/qualquercoisa
ProxyPreserveHost On
ProxyPass        /api  http://localhost:3000
ProxyPassReverse /api  http://localhost:3000`}
      />
      <ParamsTable
        title="Diretivas básicas"
        params={[
          { flag: "ProxyPass A B", desc: "Encaminha requisições para A para o backend B." },
          { flag: "ProxyPassReverse A B", desc: "Reescreve cabeçalhos Location/Set-Cookie de B para A — essencial em redirects." },
          { flag: "ProxyPreserveHost On", desc: "Preserva o Host original (importante para vhosts no backend)." },
          { flag: "ProxyTimeout 60", desc: "Tempo máximo aguardando o backend." },
          { flag: "ProxyRequests Off", desc: "Desativa proxy de saída (open proxy) — DEIXE OFF sempre." },
        ]}
      />

      <AlertBox type="warning" title="ProxyPass com barra final é diferente">
        <code>ProxyPass /api http://localhost:3000</code> e <code>ProxyPass /api/ http://localhost:3000/</code>{" "}
        têm comportamentos sutilmente diferentes. Mantenha consistência: ou ambos com barra ou
        ambos sem.
      </AlertBox>

      <h2>VirtualHost completo (recomendado)</h2>
      <CodeBlock
        title="httpd-vhosts.conf"
        language="apache"
        code={`<VirtualHost *:80>
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
</VirtualHost>`}
      />

      <h2>WebSockets (Socket.io, chat, hot reload)</h2>
      <CodeBlock
        language="apache"
        code={`# WebSocket em /ws  ->  ws://localhost:3000/ws
RewriteEngine On
RewriteCond %{HTTP:Upgrade} websocket [NC]
RewriteCond %{HTTP:Connection} upgrade [NC]
RewriteRule ^/?ws/?(.*) "ws://localhost:3000/ws/$1" [P,L]

# Resto continua HTTP normal
ProxyPass        /  http://localhost:3000/
ProxyPassReverse /  http://localhost:3000/`}
      />

      <h2>Balanceador de carga</h2>
      <CodeBlock
        language="apache"
        code={`<Proxy "balancer://meucluster">
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
</Location>`}
      />
      <ParamsTable
        title="Métodos de balanceamento (lbmethod)"
        params={[
          { flag: "byrequests", desc: "Round-robin com contagem de requests (padrão)." },
          { flag: "bytraffic", desc: "Distribui pelo volume de bytes — bom para downloads grandes." },
          { flag: "bybusyness", desc: "Manda para o menos ocupado (em conexões abertas)." },
          { flag: "heartbeat", desc: "Backends reportam saúde em batida — exige mod_heartmonitor." },
        ]}
      />

      <h2>Cache de respostas</h2>
      <CodeBlock
        language="apache"
        code={`LoadModule cache_module modules/mod_cache.so
LoadModule cache_disk_module modules/mod_cache_disk.so

<IfModule mod_cache_disk.c>
    CacheRoot   "C:/xampp/cache"
    CacheEnable disk /static
    CacheDirLevels 2
    CacheDirLength 1
    CacheDefaultExpire 3600
    CacheMaxExpire 86400
    CacheIgnoreNoLastMod On
</IfModule>`}
      />

      <h2>Receita: Apache na frente do Node + Laravel</h2>
      <CodeBlock
        title="httpd-vhosts.conf"
        language="apache"
        code={`<VirtualHost *:80>
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
</VirtualHost>`}
      />

      <h2>HTTPS no proxy</h2>
      <p>
        Se o backend é HTTPS auto-assinado, o Apache se recusa a falar com ele por padrão. Para
        ambiente local:
      </p>
      <CodeBlock
        language="apache"
        code={`SSLProxyEngine On
SSLProxyVerify none
SSLProxyCheckPeerCN off
SSLProxyCheckPeerName off
SSLProxyCheckPeerExpire off

ProxyPass        /api  https://localhost:8443/
ProxyPassReverse /api  https://localhost:8443/`}
      />

      <h2>Diagnóstico</h2>
      <CodeBlock
        language="bash"
        code={`# Confira se o módulo está ativo
httpd.exe -M | findstr proxy

# Pingue o backend direto
curl -i http://localhost:3000/health

# Teste pelo Apache
curl -i http://localhost/api/health

# Logs detalhados de proxy
LogLevel proxy:debug
ErrorLog "logs/error.log"`}
      />

      <AlertBox type="warning" title="ProxyRequests On = OPEN PROXY">
        Jamais ative <code>ProxyRequests On</code> em servidor exposto à internet. Você
        viraria um proxy aberto e seu IP seria usado por bots em segundos.
      </AlertBox>

      <h2>Armadilhas</h2>
      <ul>
        <li>
          <code>ProxyPass</code> dentro de <code>&lt;Location /api&gt;</code> funciona, mas a
          ordem importa — sempre declare o proxy <em>antes</em> de outras regras conflitantes.
        </li>
        <li>
          Backend devolve <code>Set-Cookie; Domain=localhost:3000</code> e o navegador descarta —
          use <code>ProxyPassReverseCookieDomain</code> para reescrever.
        </li>
        <li>
          Erro <code>503 Service Unavailable</code>: backend offline ou timeout muito curto.
          Aumente <code>ProxyTimeout</code>.
        </li>
        <li>
          WebSocket sem <code>mod_proxy_wstunnel</code> ou sem o <code>RewriteCond</code> de
          Upgrade — conexão cai a cada 30s.
        </li>
      </ul>
    </PageContainer>
  );
}
