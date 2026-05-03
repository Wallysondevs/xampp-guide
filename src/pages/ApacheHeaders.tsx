import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function ApacheHeaders() {
  return (
    <PageContainer
      title="Headers, CORS e segurança HTTP"
      subtitle="mod_headers, mod_expires, CSP, HSTS, X-Frame-Options e a parte teimosa do CORS — tudo configurado direto no Apache, sem tocar no PHP."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <AlertBox type="info" title="Por que aqui e não no PHP?">
        Cabeçalhos no Apache são aplicados a <strong>todos</strong> os arquivos (HTML, CSS, JS,
        imagens, fontes) — não só PHP. Política de segurança séria precisa estar nesse nível.
      </AlertBox>

      <h2>mod_headers</h2>
      <CodeBlock
        title="httpd.conf"
        language="apache"
        code={`LoadModule headers_module modules/mod_headers.so`}
      />
      <ParamsTable
        title="Diretivas principais"
        params={[
          { flag: "Header set X Y", desc: "Define ou substitui o cabeçalho X com valor Y." },
          { flag: "Header always set", desc: "Aplica até em respostas de erro (404, 500). Use sempre 'always set'." },
          { flag: "Header append X Y", desc: "Adiciona ao valor existente." },
          { flag: "Header unset X", desc: "Remove um cabeçalho." },
          { flag: "Header edit X regex novo", desc: "Edita por regex." },
        ]}
      />

      <h2>Pacote de segurança recomendado</h2>
      <CodeBlock
        title=".htaccess ou httpd.conf"
        language="apache"
        code={`<IfModule mod_headers.c>
    # Negue ser embutido em iframes (anti clickjacking)
    Header always set X-Frame-Options "SAMEORIGIN"

    # MIME-sniffing off
    Header always set X-Content-Type-Options "nosniff"

    # Política de Referer (privacidade do usuário)
    Header always set Referrer-Policy "strict-origin-when-cross-origin"

    # Permissões de APIs do navegador (geolocation, camera, etc.)
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"

    # HSTS — só ative depois que HTTPS estiver 100% funcional
    # Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

    # Remove identificação do servidor (defesa em profundidade)
    Header unset X-Powered-By
    Header unset Server
</IfModule>`}
      />

      <CodeBlock
        title="No httpd.conf (não dá no .htaccess)"
        language="apache"
        code={`ServerTokens Prod
ServerSignature Off
TraceEnable Off`}
      />

      <h2>Content Security Policy (CSP)</h2>
      <p>
        Define quais origens podem carregar scripts/estilos/imagens. Reduz risco de XSS quase a
        zero quando bem configurado.
      </p>
      <CodeBlock
        title="CSP básica"
        language="apache"
        code={`Header always set Content-Security-Policy "
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.meusite.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
"`}
      />
      <p>
        Comece em modo <strong>report-only</strong> para descobrir o que quebraria sem aplicar:
      </p>
      <CodeBlock
        language="apache"
        code={`Header always set Content-Security-Policy-Report-Only "
    default-src 'self';
    report-uri /csp-report.php
"`}
      />

      <ParamsTable
        title="Diretivas de CSP"
        params={[
          { flag: "default-src", desc: "Fallback para tudo que não tiver diretiva específica." },
          { flag: "script-src", desc: "Origens de JavaScript." },
          { flag: "style-src", desc: "Origens de CSS." },
          { flag: "img-src", desc: "Imagens (data: permite base64)." },
          { flag: "connect-src", desc: "fetch/XHR/WebSocket." },
          { flag: "frame-ancestors", desc: "Quem pode embutir (substitui X-Frame-Options)." },
          { flag: "'self'", desc: "Mesma origem do documento." },
          { flag: "'unsafe-inline'", desc: "Permite estilo/script inline (evite — exige nonce ou hash)." },
          { flag: "'nonce-XYZ'", desc: "Permite inline com nonce gerado pelo backend." },
        ]}
      />

      <h2>CORS — Cross-Origin Resource Sharing</h2>
      <p>
        Quando <code>front.local</code> chama <code>api.local</code>, o navegador exige que a API
        autorize via cabeçalhos:
      </p>
      <CodeBlock
        title="CORS permissivo (dev)"
        language="apache"
        code={`<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET,POST,PUT,DELETE,OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type,Authorization,X-Requested-With"
    Header always set Access-Control-Max-Age "86400"
</IfModule>

# Responder ao preflight OPTIONS sem chamar o PHP
RewriteEngine On
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]`}
      />

      <CodeBlock
        title="CORS restrito (produção)"
        language="apache"
        code={`SetEnvIf Origin "^https://(meusite\\.com|admin\\.meusite\\.com)$" CORS_ALLOW=$0

Header always set Access-Control-Allow-Origin "%{CORS_ALLOW}e" env=CORS_ALLOW
Header always set Access-Control-Allow-Credentials "true" env=CORS_ALLOW
Header always set Vary "Origin"`}
      />
      <AlertBox type="warning" title="Allow-Origin: * + Credentials = inválido">
        Se a API exige cookies/Authorization, você <strong>não pode</strong> usar{" "}
        <code>Access-Control-Allow-Origin: *</code>. Tem que devolver o origin exato.
      </AlertBox>

      <h2>Cache (mod_expires)</h2>
      <CodeBlock
        title="httpd.conf"
        language="apache"
        code={`LoadModule expires_module modules/mod_expires.so

<IfModule mod_expires.c>
    ExpiresActive On

    # Padrão para tudo
    ExpiresDefault                          "access plus 1 hour"

    # Imagens, fontes, vídeos — semanas/anos
    ExpiresByType image/jpeg                "access plus 30 days"
    ExpiresByType image/png                 "access plus 30 days"
    ExpiresByType image/svg+xml             "access plus 30 days"
    ExpiresByType image/webp                "access plus 30 days"
    ExpiresByType font/woff2                "access plus 1 year"

    # Assets versionados (com hash no nome)
    ExpiresByType application/javascript    "access plus 1 year"
    ExpiresByType text/css                  "access plus 1 year"

    # HTML — sempre revalidar
    ExpiresByType text/html                 "access plus 0 seconds"
</IfModule>

# Cache-Control mais explícito
<FilesMatch "\\.(jpg|jpeg|png|gif|webp|woff2|css|js)$">
    Header set Cache-Control "public, max-age=2592000, immutable"
</FilesMatch>
<FilesMatch "\\.html$">
    Header set Cache-Control "no-cache, must-revalidate"
</FilesMatch>`}
      />

      <h2>Compressão (mod_deflate)</h2>
      <CodeBlock
        language="apache"
        code={`LoadModule deflate_module modules/mod_deflate.so

<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE \\
        text/html text/plain text/xml text/css \\
        application/javascript application/json application/xml \\
        image/svg+xml font/ttf font/otf
</IfModule>`}
      />
      <p>
        Para Brotli (compressão melhor): habilite <code>mod_brotli</code> e use{" "}
        <code>AddOutputFilterByType BROTLI_COMPRESS ...</code>.
      </p>

      <h2>HSTS — só faça com HTTPS estável</h2>
      <CodeBlock
        language="apache"
        code={`# Diga ao navegador: SEMPRE HTTPS por 1 ano (subdomínios incluídos)
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"`}
      />
      <AlertBox type="danger" title="HSTS é tatuagem">
        Uma vez que o navegador receber HSTS, ele recusa HTTP para esse domínio até o{" "}
        <code>max-age</code> expirar. Se HTTPS quebrar, usuários ficam sem acesso. Comece com{" "}
        <code>max-age=300</code>, valide tudo, depois suba para 1 ano.
      </AlertBox>

      <h2>Testando</h2>
      <CodeBlock
        language="bash"
        code={`# Ver TODOS os headers da resposta
curl -I https://meusite.local/

# Especificamente os de segurança
curl -I https://meusite.local/ | grep -E '^(Strict|X-|Content-Security|Referrer|Permissions)'

# Online (em produção)
# https://securityheaders.com
# https://observatory.mozilla.org
# https://www.ssllabs.com/ssltest/`}
      />

      <h2>Armadilhas</h2>
      <ul>
        <li>
          Esquecer <strong>always</strong> em <code>Header always set</code> — em respostas 4xx
          o cabeçalho some.
        </li>
        <li>
          CSP quebrar tudo de uma vez — sempre comece com{" "}
          <code>Content-Security-Policy-Report-Only</code>.
        </li>
        <li>
          CORS só no <code>.htaccess</code>: requisições <code>OPTIONS</code> em rotas
          inexistentes geram 404 (sem CORS). Resolva no <code>RewriteRule</code> acima ou
          no PHP/framework.
        </li>
        <li>
          Cache muito agressivo em HTML faz deploy não chegar para usuários — use{" "}
          <code>no-cache</code> em <code>.html</code>.
        </li>
      </ul>
    </PageContainer>
  );
}
