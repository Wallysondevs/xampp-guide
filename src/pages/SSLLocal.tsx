import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function SSLLocal() {
  return (
    <PageContainer
      title="HTTPS local com SSL no XAMPP"
      subtitle="Rode seu site em https://localhost para testar APIs que exigem TLS, Service Workers, cookies seguros, etc."
      difficulty="avancado"
      timeToRead="9 min"
    >
      <p>
        Por padrão o XAMPP já vem com SSL configurado em{" "}
        <code>https://localhost</code> (porta 443) usando um certificado
        auto-assinado de exemplo. O navegador reclama que "não é seguro", mas
        funciona. Aqui mostramos como fazer um certificado decente, instalar
        no sistema, e gerar para domínios próprios como{" "}
        <code>minhaloja.local</code>.
      </p>

      <h2>Por que mexer nisso?</h2>
      <ul>
        <li>Service Workers só rodam em HTTPS (ou em localhost).</li>
        <li>Webhooks de Stripe/Mercado Pago/etc. exigem HTTPS.</li>
        <li>OAuth, cookies <code>SameSite=None</code> e <code>Secure</code> exigem HTTPS.</li>
        <li>Você quer testar o ambiente igualzinho ao de produção.</li>
      </ul>

      <h2>Caminho rápido: usar mkcert</h2>
      <p>
        O <code>mkcert</code> é um utilitário do Filippo Valsorda que cria uma
        autoridade certificadora local e instala no Windows/macOS/Linux. O
        navegador passa a confiar — sem cadeado vermelho.
      </p>
      <CodeBlock language="bash" code={`# Windows (com Chocolatey)
choco install mkcert

# macOS (com Homebrew)
brew install mkcert

# Instalar a CA local (uma vez só)
mkcert -install

# Gerar certificados para localhost e domínios .local
cd C:/xampp/apache/conf/
mkcert localhost 127.0.0.1 ::1 minhaloja.local "*.minhaloja.local"

# Vai gerar:
# localhost+4.pem      ← certificado
# localhost+4-key.pem  ← chave privada`} />

      <h2>Configure o Apache para usar o cert novo</h2>
      <p>Edite <code>apache/conf/extra/httpd-ssl.conf</code>:</p>
      <CodeBlock language="apache" code={`<VirtualHost _default_:443>
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

      <p>
        Confirme que <code>httpd.conf</code> está com{" "}
        <code>Include conf/extra/httpd-ssl.conf</code> descomentado e que o
        módulo SSL está carregado:
      </p>
      <CodeBlock language="apache" code={`LoadModule ssl_module modules/mod_ssl.so
Include conf/extra/httpd-ssl.conf`} />

      <PracticeBox
        title="Habilitar HTTPS local com mkcert"
        goal="Ver o cadeado verde em https://localhost — sem aviso de inseguro."
        steps={[
          "Instale o mkcert (Chocolatey, Homebrew ou baixando o binário do GitHub).",
          "Rode mkcert -install.",
          "Vá em C:/xampp/apache/conf/ e gere os certificados com mkcert localhost 127.0.0.1.",
          "Edite httpd-ssl.conf para apontar SSLCertificateFile / SSLCertificateKeyFile para os arquivos novos.",
          "Reinicie o Apache.",
          "Abra https://localhost no Chrome.",
        ]}
        verify="Apareceu o cadeado verde sem aviso. Clicando nele, você vê 'A conexão é segura'."
      />

      <h2>Forçar HTTP → HTTPS</h2>
      <p>Coloque no <code>.htaccess</code> da raiz do projeto:</p>
      <CodeBlock language="apache" code={`RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`} />

      <AlertBox type="warning" title="Em produção: nunca use cert auto-assinado">
        Esse setup é só para desenvolvimento. Em produção use{" "}
        <strong>Let's Encrypt</strong> (certbot) ou o cert que sua hospedagem
        oferece. Certificado auto-assinado em produção espanta o usuário e
        bloqueia muitas integrações.
      </AlertBox>

      <h2>Caminho longo: gerar com OpenSSL puro</h2>
      <p>
        Se prefere não instalar o mkcert, o XAMPP traz o OpenSSL. Crie um
        certificado para <code>minhaloja.local</code>:
      </p>
      <CodeBlock language="bash" code={`cd C:/xampp/apache/conf/
C:/xampp/apache/bin/openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\
    -keyout minhaloja.key \\
    -out minhaloja.crt \\
    -subj "/C=BR/ST=SP/L=SaoPaulo/O=Local/CN=minhaloja.local"`} />
      <p>
        O navegador continuará reclamando porque o cert não vem de uma CA
        confiável — mas você consegue clicar em "avançado → continuar mesmo
        assim".
      </p>
    </PageContainer>
  );
}
