import{j as e}from"./index-BreI0dyu.js";import{P as s,A as a}from"./AlertBox-C_bJKc46.js";import{C as o}from"./CodeBlock-D0rWxPIU.js";import{P as r}from"./ParamsTable-DyRs6_CQ.js";import{P as i}from"./PracticeBox-BV05Hsfh.js";import"./circle-alert-_acnmM4q.js";function h(){return e.jsxs(s,{title:"HTTPS local com SSL/TLS no XAMPP",subtitle:"Da teoria de criptografia assimétrica e cadeia de confiança ao certificado válido em https://localhost — incluindo mkcert, OpenSSL puro, SNI, HSTS, HTTP/2 e endurecimento (hardening) do mod_ssl.",difficulty:"avancado",timeToRead:"18 min",children:[e.jsxs(a,{type:"info",title:"Pré-requisitos",children:["Capítulos de ",e.jsx("a",{href:"#/apache-config",children:"httpd.conf"})," e"," ",e.jsx("a",{href:"#/virtual-hosts",children:"Virtual Hosts"})," lidos. Saber abrir um terminal/CMD com privilégio de administrador."]}),e.jsx("h2",{children:"Glossário rápido — TLS na medida"}),e.jsxs("p",{children:[e.jsx("strong",{children:"SSL vs TLS"}),' — SSL (Secure Sockets Layer) é o nome antigo. TLS (Transport Layer Security) é o nome atual. SSL 3.0 e anteriores estão obsoletos (vulneráveis). Use TLS 1.2+ (ideal: TLS 1.3). "SSL" hoje é só jargão.']}),e.jsxs("p",{children:[e.jsx("strong",{children:"Criptografia assimétrica"})," — par de chaves: pública (que você distribui) e privada (que você guarda). O que uma criptografa, só a outra descriptografa. É o que faz HTTPS funcionar."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Certificado"})," — arquivo (",e.jsx("code",{children:".crt"})," /"," ",e.jsx("code",{children:".pem"}),") que contém a chave pública + metadados (dono, domínio, validade) + assinatura de uma autoridade."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Chave privada"})," — arquivo (",e.jsx("code",{children:".key"}),') que nunca pode vazar. Quem tem a chave privada pode "personificar" o servidor.']}),e.jsxs("p",{children:[e.jsx("strong",{children:"CSR (Certificate Signing Request)"})," — arquivo que você envia para uma CA pedindo um certificado. Contém a chave pública + dados do solicitante."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"CA (Certificate Authority)"})," — autoridade que assina certificados. Navegadores trazem dezenas de CAs confiáveis embutidas (Let's Encrypt, DigiCert, GlobalSign…). Você pode também ser sua própria CA local — é o que o mkcert faz."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"SNI (Server Name Indication)"})," — extensão TLS criada em 2003 que permite ao cliente dizer, no início do handshake, qual hostname está acessando. Antes do SNI, cada cert HTTPS exigia um IP próprio. Hoje suportado em tudo (exceto IE no XP)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Cadeia de confiança"})," — um cert do site é assinado por uma CA intermediária, que por sua vez é assinada pela CA raiz (que vem no navegador). O navegador verifica essa cadeia."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"HSTS (HTTP Strict Transport Security)"}),' — cabeçalho que diz ao navegador "para esse domínio, sempre use HTTPS, nunca tente HTTP". Defende contra downgrade attacks.']}),e.jsx("h2",{children:"Como o handshake TLS funciona (simplificado)"}),e.jsxs("ol",{children:[e.jsx("li",{children:"Navegador abre conexão TCP no servidor (porta 443)."}),e.jsxs("li",{children:[e.jsx("strong",{children:"ClientHello"})," — navegador diz ao servidor as versões TLS e cipher suites que aceita, e o SNI (hostname pedido)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"ServerHello + Certificate"})," — servidor escolhe cipher e versão, envia o certificado."]}),e.jsx("li",{children:"Navegador valida o cert (cadeia até CA confiável, validade, hostname bate, não está revogado)."}),e.jsx("li",{children:"Negociam uma chave simétrica (ECDHE) usada para criptografar a sessão."}),e.jsx("li",{children:"Daí em diante, todo tráfego é criptografado."})]}),e.jsx("h2",{children:"Por que mexer nisso em desenvolvimento?"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Service Workers"})," só rodam em HTTPS (ou em ",e.jsx("code",{children:"localhost"})," sem cert)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Webhooks"})," de Stripe, Mercado Pago, GitHub etc. exigem HTTPS."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["OAuth, cookies ",e.jsx("code",{children:"SameSite=None"})," e ",e.jsx("code",{children:"Secure"})]})," exigem HTTPS."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"HTTP/2"})," em quase todos os navegadores só ativa sobre TLS."]}),e.jsxs("li",{children:["Você quer testar o ambiente ",e.jsx("strong",{children:"igual"})," ao de produção (incluindo CSP, HSTS, redirects)."]})]}),e.jsx("h2",{children:"O cert que vem no XAMPP"}),e.jsxs("p",{children:["Por padrão o XAMPP já vem com SSL configurado em"," ",e.jsx("code",{children:"https://localhost"}),' (porta 443) usando um certificado auto-assinado de exemplo. Funciona, mas o navegador reclama ("Sua conexão não é privada"). Os arquivos vêm em:']}),e.jsx(o,{language:"text",code:`apache/conf/ssl.crt/server.crt    ← certificado
apache/conf/ssl.key/server.key    ← chave privada`}),e.jsx("h2",{children:"Caminho rápido: usar mkcert"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"mkcert"})," (do Filippo Valsorda) cria uma autoridade certificadora local e a instala no sistema. O navegador passa a confiar em qualquer cert assinado por essa CA — sem cadeado vermelho, sem aviso."]}),e.jsx(o,{language:"bash",code:`# Windows (com Chocolatey)
choco install mkcert

# Windows (com Scoop)
scoop bucket add extras
scoop install mkcert

# macOS (com Homebrew)
brew install mkcert
brew install nss   # Para Firefox

# Linux (Debian/Ubuntu)
sudo apt install libnss3-tools
# Baixe o binário do mkcert no GitHub releases

# Instalar a CA local NO SISTEMA + navegadores (uma vez só)
mkcert -install

# Gerar certificados para vários domínios de uma vez
cd C:/xampp/apache/conf/
mkcert localhost 127.0.0.1 ::1 minhaloja.local "*.minhaloja.local"

# Vai gerar dois arquivos:
# localhost+4.pem      ← certificado (público)
# localhost+4-key.pem  ← chave privada (NUNCA compartilhe)`}),e.jsx("h2",{children:"Configure o Apache para usar o cert novo"}),e.jsxs("p",{children:["Confirme que ",e.jsx("code",{children:"httpd.conf"})," está com"," ",e.jsx("code",{children:"Include conf/extra/httpd-ssl.conf"})," descomentado e que o módulo SSL está carregado:"]}),e.jsx(o,{language:"apache",code:`LoadModule ssl_module modules/mod_ssl.so
LoadModule socache_shmcb_module modules/mod_socache_shmcb.so

Listen 443

Include conf/extra/httpd-ssl.conf`}),e.jsxs("p",{children:["Edite ",e.jsx("code",{children:"apache/conf/extra/httpd-ssl.conf"}),":"]}),e.jsx(o,{language:"apache",code:`# Configuração GERAL do mod_ssl (fora dos VirtualHost)

SSLPassPhraseDialog  builtin
SSLSessionCache      "shmcb:logs/ssl_scache(512000)"
SSLSessionCacheTimeout  300

# === Endurecimento (hardening) — habilitar para refletir produção ===
SSLProtocol            -all +TLSv1.2 +TLSv1.3
SSLCipherSuite         HIGH:!aNULL:!MD5:!3DES
SSLHonorCipherOrder    on

# OCSP Stapling — só faz sentido com cert real
SSLUseStapling          on
SSLStaplingCache        "shmcb:logs/ssl_stapling(32768)"


<VirtualHost _default_:443>
    DocumentRoot "C:/xampp/htdocs"
    ServerName localhost:443

    SSLEngine on
    SSLCertificateFile      "conf/localhost+4.pem"
    SSLCertificateKeyFile   "conf/localhost+4-key.pem"

    <Directory "C:/xampp/htdocs">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog "logs/ssl-error.log"
    CustomLog "logs/ssl-access.log" common
</VirtualHost>

# Virtual host SSL para minhaloja.local
<VirtualHost _default_:443>
    DocumentRoot "C:/xampp/htdocs/minhaloja"
    ServerName minhaloja.local

    SSLEngine on
    SSLCertificateFile      "conf/localhost+4.pem"
    SSLCertificateKeyFile   "conf/localhost+4-key.pem"

    <Directory "C:/xampp/htdocs/minhaloja">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>`}),e.jsx(i,{title:"Habilitar HTTPS local com mkcert",goal:"Ver o cadeado verde em https://localhost — sem aviso de inseguro.",steps:["Instale o mkcert (Chocolatey, Homebrew ou baixando o binário do GitHub).","Rode mkcert -install para ativar a CA local.","Vá em C:/xampp/apache/conf/ e gere os certificados com mkcert localhost 127.0.0.1.","Edite httpd-ssl.conf para apontar SSLCertificateFile / SSLCertificateKeyFile para os arquivos novos.","Confirme que mod_ssl está carregado e que o Include do httpd-ssl.conf está ativo.","Reinicie o Apache.","Abra https://localhost no Chrome."],verify:"Apareceu o cadeado verde sem aviso. Clicando nele, você vê 'A conexão é segura'."}),e.jsx("h2",{children:"Diretivas SSL — referência"}),e.jsx(r,{title:"Diretivas mais usadas do mod_ssl",params:[{flag:"SSLEngine on",desc:"Liga o SSL para esse VirtualHost. Sem isso, o resto não vale."},{flag:"SSLCertificateFile",desc:"Caminho do arquivo de certificado (PEM). Pode conter a cadeia inteira concatenada."},{flag:"SSLCertificateKeyFile",desc:"Caminho da chave privada. NUNCA fique acessível pelo Apache (fora do htdocs)."},{flag:"SSLCertificateChainFile",desc:"Cadeia de CAs intermediárias (legado; em 2.4.8+ pode ir tudo no Certificate File)."},{flag:"SSLProtocol",desc:"Quais versões de TLS aceitar. Recomendado: -all +TLSv1.2 +TLSv1.3"},{flag:"SSLCipherSuite",desc:"Quais conjuntos de cifras aceitar. Use a recomendação do Mozilla SSL Config Generator."},{flag:"SSLHonorCipherOrder on",desc:"Servidor escolhe a cifra (não o cliente). Em geral on em produção."},{flag:"SSLCompression off",desc:"Desliga compressão TLS (ataque CRIME). Padrão off no Apache 2.4.4+."},{flag:"SSLSessionTickets off",desc:"Desliga session tickets (lá-fora — em produção pública requer rotação periódica)."},{flag:"SSLUseStapling on",desc:"OCSP stapling — servidor já entrega prova de não-revogação. Reduz latência e melhora privacidade."},{flag:"SSLVerifyClient",desc:"Habilita autenticação por certificado de cliente (mTLS). Útil em APIs internas."}]}),e.jsx("h2",{children:"Forçar HTTP → HTTPS"}),e.jsxs("p",{children:["Coloque no ",e.jsx("code",{children:".htaccess"})," da raiz do projeto:"]}),e.jsx(o,{language:"apache",code:`RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`}),e.jsx("h2",{children:"Ative HSTS (em produção e em dev se quiser)"}),e.jsx("p",{children:'Cabeçalho que diz ao navegador "use HTTPS para esse domínio nos próximos N segundos, nem tente HTTP".'}),e.jsx(o,{language:"apache",code:`<IfModule mod_headers.c>
    # max-age = 1 ano. includeSubDomains força em todos os subdomínios.
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>`}),e.jsxs(a,{type:"warning",title:"HSTS é grudento",children:["Uma vez que o navegador recebeu HSTS para um domínio, ele se recusa a abrir HTTP nele até o ",e.jsx("code",{children:"max-age"})," expirar. Em desenvolvimento, isso pode te morder se você precisar voltar pra HTTP. Solução no Chrome: ",e.jsx("code",{children:"chrome://net-internals/#hsts"})," ","e remova o domínio."]}),e.jsx("h2",{children:"HTTP/2 sobre TLS"}),e.jsxs("p",{children:["O Apache 2.4.17+ traz ",e.jsx("code",{children:"mod_http2"}),". Para habilitar:"]}),e.jsx(o,{language:"apache",code:`# httpd.conf
LoadModule http2_module modules/mod_http2.so

# Dentro do VirtualHost SSL
Protocols h2 http/1.1`}),e.jsx("h2",{children:"Caminho longo: gerar com OpenSSL puro"}),e.jsx("p",{children:"Se prefere não instalar o mkcert, o XAMPP já traz o OpenSSL embutido. Roteiro completo:"}),e.jsx(o,{language:"bash",code:`cd C:/xampp/apache/conf/

# 1. Gerar chave privada de 2048 bits
C:/xampp/apache/bin/openssl genrsa -out minhaloja.key 2048

# 2. Gerar CSR (Certificate Signing Request)
C:/xampp/apache/bin/openssl req -new -key minhaloja.key -out minhaloja.csr \\
    -subj "/C=BR/ST=SP/L=SaoPaulo/O=Local/CN=minhaloja.local"

# 3. Gerar certificado auto-assinado (válido 365 dias)
C:/xampp/apache/bin/openssl x509 -req -days 365 \\
    -in minhaloja.csr -signkey minhaloja.key -out minhaloja.crt

# Tudo em um único comando (atalho)
C:/xampp/apache/bin/openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\
    -keyout minhaloja.key \\
    -out minhaloja.crt \\
    -subj "/C=BR/ST=SP/L=SaoPaulo/O=Local/CN=minhaloja.local"`}),e.jsx("h2",{children:"Cert com SAN (vários domínios)"}),e.jsxs("p",{children:["Certificados modernos usam o campo ",e.jsx("strong",{children:"SAN"})," (Subject Alternative Name) — pode listar vários domínios. Crie um arquivo de configuração:"]}),e.jsx(o,{title:"san.cnf",language:"text",code:`[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
C = BR
ST = SP
L = SaoPaulo
O = Local
CN = minhaloja.local

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = minhaloja.local
DNS.2 = www.minhaloja.local
DNS.3 = api.minhaloja.local
IP.1  = 127.0.0.1`}),e.jsx(o,{language:"bash",code:`openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\
    -keyout minhaloja.key \\
    -out minhaloja.crt \\
    -config san.cnf -extensions v3_req`}),e.jsx("h2",{children:"Inspecionando um certificado"}),e.jsx(o,{language:"bash",code:`# Ver conteúdo de um cert PEM
openssl x509 -in minhaloja.crt -text -noout

# Ver só o validade e o subject
openssl x509 -in minhaloja.crt -noout -subject -dates -issuer

# Confirmar que cert e chave casam (mesmo modulus)
openssl x509 -in minhaloja.crt -noout -modulus | openssl md5
openssl rsa  -in minhaloja.key -noout -modulus | openssl md5
# Se os hashes batem, são par.

# Testar conexão TLS contra o seu servidor
openssl s_client -connect localhost:443 -servername minhaloja.local`}),e.jsxs(a,{type:"warning",title:"Em produção: nunca use cert auto-assinado",children:["Esse setup é só para desenvolvimento. Em produção use"," ",e.jsx("strong",{children:"Let's Encrypt"})," (certbot ou mod_md no Apache 2.4.30+) ou o cert que sua hospedagem oferece. Auto-assinado em produção espanta o usuário, bloqueia integrações com Stripe/Mercado Pago, e impede HTTP/2 em muitos clientes."]}),e.jsx("h2",{children:"Recursos"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("a",{href:"https://ssl-config.mozilla.org/",target:"_blank",rel:"noreferrer",children:"Mozilla SSL Configuration Generator"})," ","— gera config Apache pronta com ciphers modernos."]}),e.jsxs("li",{children:[e.jsx("a",{href:"https://www.ssllabs.com/ssltest/",target:"_blank",rel:"noreferrer",children:"Qualys SSL Labs"})," ","— em produção, dá nota A+ ao seu HTTPS."]}),e.jsxs("li",{children:[e.jsx("a",{href:"https://github.com/FiloSottile/mkcert",target:"_blank",rel:"noreferrer",children:"mkcert no GitHub"})," ","— projeto oficial."]})]})]})}export{h as default};
