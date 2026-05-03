import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function SSLLocal() {
  return (
    <PageContainer
      title="HTTPS local com SSL/TLS no XAMPP"
      subtitle="Da teoria de criptografia assimétrica e cadeia de confiança ao certificado válido em https://localhost — incluindo mkcert, OpenSSL puro, SNI, HSTS, HTTP/2 e endurecimento (hardening) do mod_ssl."
      difficulty="avancado"
      timeToRead="18 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Capítulos de <a href="#/apache-config">httpd.conf</a> e{" "}
        <a href="#/virtual-hosts">Virtual Hosts</a> lidos. Saber abrir um
        terminal/CMD com privilégio de administrador.
      </AlertBox>

      <h2>Glossário rápido — TLS na medida</h2>
      <p>
        <strong>SSL vs TLS</strong> — SSL (Secure Sockets Layer) é o nome
        antigo. TLS (Transport Layer Security) é o nome atual. SSL 3.0 e
        anteriores estão obsoletos (vulneráveis). Use TLS 1.2+ (ideal: TLS
        1.3). "SSL" hoje é só jargão.
      </p>
      <p>
        <strong>Criptografia assimétrica</strong> — par de chaves: pública
        (que você distribui) e privada (que você guarda). O que uma
        criptografa, só a outra descriptografa. É o que faz HTTPS funcionar.
      </p>
      <p>
        <strong>Certificado</strong> — arquivo (<code>.crt</code> /{" "}
        <code>.pem</code>) que contém a chave pública + metadados (dono,
        domínio, validade) + assinatura de uma autoridade.
      </p>
      <p>
        <strong>Chave privada</strong> — arquivo (<code>.key</code>) que
        nunca pode vazar. Quem tem a chave privada pode "personificar" o
        servidor.
      </p>
      <p>
        <strong>CSR (Certificate Signing Request)</strong> — arquivo que
        você envia para uma CA pedindo um certificado. Contém a chave
        pública + dados do solicitante.
      </p>
      <p>
        <strong>CA (Certificate Authority)</strong> — autoridade que assina
        certificados. Navegadores trazem dezenas de CAs confiáveis embutidas
        (Let's Encrypt, DigiCert, GlobalSign…). Você pode também ser sua
        própria CA local — é o que o mkcert faz.
      </p>
      <p>
        <strong>SNI (Server Name Indication)</strong> — extensão TLS
        criada em 2003 que permite ao cliente dizer, no início do handshake,
        qual hostname está acessando. Antes do SNI, cada cert HTTPS exigia
        um IP próprio. Hoje suportado em tudo (exceto IE no XP).
      </p>
      <p>
        <strong>Cadeia de confiança</strong> — um cert do site é assinado
        por uma CA intermediária, que por sua vez é assinada pela CA raiz
        (que vem no navegador). O navegador verifica essa cadeia.
      </p>
      <p>
        <strong>HSTS (HTTP Strict Transport Security)</strong> — cabeçalho
        que diz ao navegador "para esse domínio, sempre use HTTPS, nunca
        tente HTTP". Defende contra downgrade attacks.
      </p>

      <h2>Como o handshake TLS funciona (simplificado)</h2>
      <ol>
        <li>Navegador abre conexão TCP no servidor (porta 443).</li>
        <li><strong>ClientHello</strong> — navegador diz ao servidor as versões TLS e cipher suites que aceita, e o SNI (hostname pedido).</li>
        <li><strong>ServerHello + Certificate</strong> — servidor escolhe cipher e versão, envia o certificado.</li>
        <li>Navegador valida o cert (cadeia até CA confiável, validade, hostname bate, não está revogado).</li>
        <li>Negociam uma chave simétrica (ECDHE) usada para criptografar a sessão.</li>
        <li>Daí em diante, todo tráfego é criptografado.</li>
      </ol>

      <h2>Por que mexer nisso em desenvolvimento?</h2>
      <ul>
        <li><strong>Service Workers</strong> só rodam em HTTPS (ou em <code>localhost</code> sem cert).</li>
        <li><strong>Webhooks</strong> de Stripe, Mercado Pago, GitHub etc. exigem HTTPS.</li>
        <li><strong>OAuth, cookies <code>SameSite=None</code> e <code>Secure</code></strong> exigem HTTPS.</li>
        <li><strong>HTTP/2</strong> em quase todos os navegadores só ativa sobre TLS.</li>
        <li>Você quer testar o ambiente <strong>igual</strong> ao de produção (incluindo CSP, HSTS, redirects).</li>
      </ul>

      <h2>O cert que vem no XAMPP</h2>
      <p>
        Por padrão o XAMPP já vem com SSL configurado em{" "}
        <code>https://localhost</code> (porta 443) usando um certificado
        auto-assinado de exemplo. Funciona, mas o navegador reclama
        ("Sua conexão não é privada"). Os arquivos vêm em:
      </p>
      <CodeBlock language="text" code={`apache/conf/ssl.crt/server.crt    ← certificado
apache/conf/ssl.key/server.key    ← chave privada`} />

      <h2>Caminho rápido: usar mkcert</h2>
      <p>
        O <code>mkcert</code> (do Filippo Valsorda) cria uma autoridade
        certificadora local e a instala no sistema. O navegador passa a
        confiar em qualquer cert assinado por essa CA — sem cadeado
        vermelho, sem aviso.
      </p>
      <CodeBlock language="bash" code={`# Windows (com Chocolatey)
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
# localhost+4-key.pem  ← chave privada (NUNCA compartilhe)`} />

      <h2>Configure o Apache para usar o cert novo</h2>
      <p>
        Confirme que <code>httpd.conf</code> está com{" "}
        <code>Include conf/extra/httpd-ssl.conf</code> descomentado e que
        o módulo SSL está carregado:
      </p>
      <CodeBlock language="apache" code={`LoadModule ssl_module modules/mod_ssl.so
LoadModule socache_shmcb_module modules/mod_socache_shmcb.so

Listen 443

Include conf/extra/httpd-ssl.conf`} />

      <p>Edite <code>apache/conf/extra/httpd-ssl.conf</code>:</p>
      <CodeBlock language="apache" code={`# Configuração GERAL do mod_ssl (fora dos VirtualHost)

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
</VirtualHost>`} />

      <PracticeBox
        title="Habilitar HTTPS local com mkcert"
        goal="Ver o cadeado verde em https://localhost — sem aviso de inseguro."
        steps={[
          "Instale o mkcert (Chocolatey, Homebrew ou baixando o binário do GitHub).",
          "Rode mkcert -install para ativar a CA local.",
          "Vá em C:/xampp/apache/conf/ e gere os certificados com mkcert localhost 127.0.0.1.",
          "Edite httpd-ssl.conf para apontar SSLCertificateFile / SSLCertificateKeyFile para os arquivos novos.",
          "Confirme que mod_ssl está carregado e que o Include do httpd-ssl.conf está ativo.",
          "Reinicie o Apache.",
          "Abra https://localhost no Chrome.",
        ]}
        verify="Apareceu o cadeado verde sem aviso. Clicando nele, você vê 'A conexão é segura'."
      />

      <h2>Diretivas SSL — referência</h2>
      <ParamsTable
        title="Diretivas mais usadas do mod_ssl"
        params={[
          { flag: "SSLEngine on", desc: "Liga o SSL para esse VirtualHost. Sem isso, o resto não vale." },
          { flag: "SSLCertificateFile", desc: "Caminho do arquivo de certificado (PEM). Pode conter a cadeia inteira concatenada." },
          { flag: "SSLCertificateKeyFile", desc: "Caminho da chave privada. NUNCA fique acessível pelo Apache (fora do htdocs)." },
          { flag: "SSLCertificateChainFile", desc: "Cadeia de CAs intermediárias (legado; em 2.4.8+ pode ir tudo no Certificate File)." },
          { flag: "SSLProtocol", desc: "Quais versões de TLS aceitar. Recomendado: -all +TLSv1.2 +TLSv1.3" },
          { flag: "SSLCipherSuite", desc: "Quais conjuntos de cifras aceitar. Use a recomendação do Mozilla SSL Config Generator." },
          { flag: "SSLHonorCipherOrder on", desc: "Servidor escolhe a cifra (não o cliente). Em geral on em produção." },
          { flag: "SSLCompression off", desc: "Desliga compressão TLS (ataque CRIME). Padrão off no Apache 2.4.4+." },
          { flag: "SSLSessionTickets off", desc: "Desliga session tickets (lá-fora — em produção pública requer rotação periódica)." },
          { flag: "SSLUseStapling on", desc: "OCSP stapling — servidor já entrega prova de não-revogação. Reduz latência e melhora privacidade." },
          { flag: "SSLVerifyClient", desc: "Habilita autenticação por certificado de cliente (mTLS). Útil em APIs internas." },
        ]}
      />

      <h2>Forçar HTTP → HTTPS</h2>
      <p>Coloque no <code>.htaccess</code> da raiz do projeto:</p>
      <CodeBlock language="apache" code={`RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`} />

      <h2>Ative HSTS (em produção e em dev se quiser)</h2>
      <p>
        Cabeçalho que diz ao navegador "use HTTPS para esse domínio nos
        próximos N segundos, nem tente HTTP".
      </p>
      <CodeBlock language="apache" code={`<IfModule mod_headers.c>
    # max-age = 1 ano. includeSubDomains força em todos os subdomínios.
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>`} />
      <AlertBox type="warning" title="HSTS é grudento">
        Uma vez que o navegador recebeu HSTS para um domínio, ele se recusa
        a abrir HTTP nele até o <code>max-age</code> expirar. Em
        desenvolvimento, isso pode te morder se você precisar voltar pra
        HTTP. Solução no Chrome: <code>chrome://net-internals/#hsts</code>{" "}
        e remova o domínio.
      </AlertBox>

      <h2>HTTP/2 sobre TLS</h2>
      <p>
        O Apache 2.4.17+ traz <code>mod_http2</code>. Para habilitar:
      </p>
      <CodeBlock language="apache" code={`# httpd.conf
LoadModule http2_module modules/mod_http2.so

# Dentro do VirtualHost SSL
Protocols h2 http/1.1`} />

      <h2>Caminho longo: gerar com OpenSSL puro</h2>
      <p>
        Se prefere não instalar o mkcert, o XAMPP já traz o OpenSSL
        embutido. Roteiro completo:
      </p>
      <CodeBlock language="bash" code={`cd C:/xampp/apache/conf/

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
    -subj "/C=BR/ST=SP/L=SaoPaulo/O=Local/CN=minhaloja.local"`} />

      <h2>Cert com SAN (vários domínios)</h2>
      <p>
        Certificados modernos usam o campo <strong>SAN</strong> (Subject
        Alternative Name) — pode listar vários domínios. Crie um arquivo
        de configuração:
      </p>
      <CodeBlock title="san.cnf" language="text" code={`[req]
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
IP.1  = 127.0.0.1`} />
      <CodeBlock language="bash" code={`openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\
    -keyout minhaloja.key \\
    -out minhaloja.crt \\
    -config san.cnf -extensions v3_req`} />

      <h2>Inspecionando um certificado</h2>
      <CodeBlock language="bash" code={`# Ver conteúdo de um cert PEM
openssl x509 -in minhaloja.crt -text -noout

# Ver só o validade e o subject
openssl x509 -in minhaloja.crt -noout -subject -dates -issuer

# Confirmar que cert e chave casam (mesmo modulus)
openssl x509 -in minhaloja.crt -noout -modulus | openssl md5
openssl rsa  -in minhaloja.key -noout -modulus | openssl md5
# Se os hashes batem, são par.

# Testar conexão TLS contra o seu servidor
openssl s_client -connect localhost:443 -servername minhaloja.local`} />

      <AlertBox type="warning" title="Em produção: nunca use cert auto-assinado">
        Esse setup é só para desenvolvimento. Em produção use{" "}
        <strong>Let's Encrypt</strong> (certbot ou mod_md no Apache 2.4.30+)
        ou o cert que sua hospedagem oferece. Auto-assinado em produção
        espanta o usuário, bloqueia integrações com Stripe/Mercado Pago, e
        impede HTTP/2 em muitos clientes.
      </AlertBox>

      <h2>Recursos</h2>
      <ul>
        <li>
          <a href="https://ssl-config.mozilla.org/" target="_blank" rel="noreferrer">
            Mozilla SSL Configuration Generator
          </a>{" "}
          — gera config Apache pronta com ciphers modernos.
        </li>
        <li>
          <a href="https://www.ssllabs.com/ssltest/" target="_blank" rel="noreferrer">
            Qualys SSL Labs
          </a>{" "}
          — em produção, dá nota A+ ao seu HTTPS.
        </li>
        <li>
          <a href="https://github.com/FiloSottile/mkcert" target="_blank" rel="noreferrer">
            mkcert no GitHub
          </a>{" "}
          — projeto oficial.
        </li>
      </ul>
    </PageContainer>
  );
}
