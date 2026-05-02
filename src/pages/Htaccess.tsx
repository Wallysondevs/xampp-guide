import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function Htaccess() {
  return (
    <PageContainer
      title=".htaccess e mod_rewrite"
      subtitle="O arquivo .htaccess permite mudar a configuração do Apache pasta a pasta — sem reiniciar."
      difficulty="intermediario"
      timeToRead="8 min"
    >
      <h2>O que é o .htaccess</h2>
      <p>
        É um arquivo de configuração local. Quando o Apache recebe uma
        requisição, ele lê o <code>.htaccess</code> da pasta do arquivo (e dos
        diretórios pai). É como um <code>httpd.conf</code> em miniatura, com a
        vantagem de não precisar reiniciar o Apache para que as mudanças
        valham.
      </p>

      <AlertBox type="warning" title="Pré-requisito: AllowOverride All">
        Para o Apache levar o <code>.htaccess</code> a sério, no{" "}
        <code>httpd.conf</code> a diretiva da pasta correspondente precisa
        estar com <code>AllowOverride All</code>. Sem isso, qualquer{" "}
        <code>.htaccess</code> é silenciosamente ignorado.
      </AlertBox>

      <h2>Habilitando o mod_rewrite</h2>
      <p>
        URLs amigáveis (sem <code>?id=</code> e <code>.php</code>) dependem do
        módulo <code>mod_rewrite</code>. No <code>httpd.conf</code> deixe assim:
      </p>
      <CodeBlock language="apache" code={`# Tire o # da frente:
LoadModule rewrite_module modules/mod_rewrite.so`} />
      <p>Reinicie o Apache. Agora os <code>.htaccess</code> com regras de rewrite funcionam.</p>

      <h2>Exemplo 1 — URL amigável genérica</h2>
      <CodeBlock title=".htaccess (na raiz do projeto)" language="apache" code={`RewriteEngine On
RewriteBase /

# Se o arquivo ou pasta NÃO existirem, manda tudo para index.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php?route=$1 [QSA,L]`} />
      <p>
        Resultado: <code>http://localhost/produtos/123</code> chega no
        <code>index.php</code> com <code>$_GET['route'] = 'produtos/123'</code>.
        É a base de qualquer router de framework.
      </p>

      <h2>Exemplo 2 — Forçar HTTPS (em produção)</h2>
      <CodeBlock language="apache" code={`RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]`} />

      <h2>Exemplo 3 — Forçar www (ou tirar)</h2>
      <CodeBlock language="apache" code={`# Forçar www.minhaloja.com.br
RewriteEngine On
RewriteCond %{HTTP_HOST} ^minhaloja\\.com\\.br [NC]
RewriteRule ^(.*)$ https://www.minhaloja.com.br/$1 [R=301,L]

# OU tirar o www
RewriteCond %{HTTP_HOST} ^www\\.minhaloja\\.com\\.br [NC]
RewriteRule ^(.*)$ https://minhaloja.com.br/$1 [R=301,L]`} />

      <h2>Exemplo 4 — Bloquear acesso a arquivos sensíveis</h2>
      <CodeBlock language="apache" code={`# Negar acesso a .env, .git, composer.json, .htaccess
<FilesMatch "^(\\.env|\\.git|composer\\.(json|lock)|package\\.json|\\.htaccess)$">
    Require all denied
</FilesMatch>

# Negar acesso à pasta vendor inteira
RedirectMatch 404 /vendor`} />

      <h2>Exemplo 5 — Cache de imagens e CSS</h2>
      <CodeBlock language="apache" code={`<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>`} />

      <h2>Exemplo 6 — Proteger uma pasta com senha</h2>
      <CodeBlock title=".htaccess dentro da pasta /admin" language="apache" code={`AuthType Basic
AuthName "Area Restrita"
AuthUserFile "C:/xampp/htdocs/.htpasswd"
Require valid-user`} />
      <p>
        Crie o arquivo de senhas com o utilitário <code>htpasswd</code> que vem
        com o XAMPP:
      </p>
      <CodeBlock language="bash" code={`# Windows (cmd)
C:\\xampp\\apache\\bin\\htpasswd -c C:\\xampp\\htdocs\\.htpasswd admin

# Vai pedir a senha duas vezes`} />

      <h2>Diretivas de redirect</h2>
      <ParamsTable
        title="Tipos de Redirect e Rewrite"
        params={[
          { flag: "Redirect 301 /antigo /novo", desc: "Redirect permanente. O Google vai entender que o /antigo se mudou pro /novo. Use em troca de URL." },
          { flag: "Redirect 302 /promo /produto/123", desc: "Redirect temporário. Para promoções e testes A/B." },
          { flag: "RewriteRule ^pattern$ destino [L]", desc: "Reescreve a URL internamente. O navegador continua vendo a URL antiga, mas o Apache serve o destino." },
          { flag: "[L]", desc: "Last — para de processar regras se essa der match. Use quase sempre." },
          { flag: "[R=301]", desc: "Redirect — manda o navegador para outra URL com código 301 (permanente)." },
          { flag: "[QSA]", desc: "Query String Append — preserva a query string original (?id=1) na URL final." },
          { flag: "[NC]", desc: "No Case — match case-insensitive." },
          { flag: "RewriteCond %{HTTPS} on", desc: "Condição: só aplica a próxima RewriteRule se a requisição for HTTPS." },
          { flag: "RewriteCond %{HTTP_HOST} ^x\\.com$", desc: "Condição com regex no domínio. Útil para forçar/tirar www." },
        ]}
      />

      <AlertBox type="success" title="Para depurar regras">
        Habilite o RewriteLog (Apache 2.4+ usa LogLevel) no httpd.conf:{" "}
        <code>LogLevel alert rewrite:trace3</code>. As reescritas aparecem em{" "}
        <code>apache/logs/error.log</code>. Lembre-se de desativar depois — gera muito log.
      </AlertBox>
    </PageContainer>
  );
}
