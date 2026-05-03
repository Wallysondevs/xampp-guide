import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function Htaccess() {
  return (
    <PageContainer
      title=".htaccess e mod_rewrite"
      subtitle="O guia completo: como o Apache lê .htaccess, o que pode/não pode, performance, mod_rewrite passo a passo, flags, condições, variáveis e exemplos reais (WordPress, Laravel, força HTTPS, autenticação, cache)."
      difficulty="intermediario"
      timeToRead="16 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Capítulo de <a href="#/apache-config">httpd.conf</a> lido — você
        precisa entender o que é <code>AllowOverride</code> e
        <code>&lt;Directory&gt;</code>. Saber editar arquivos de texto puro.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>.htaccess</strong> — arquivo de configuração local. O ponto
        no início faz dele "oculto" no Linux/macOS. No Windows você precisa
        habilitar "Mostrar arquivos ocultos" no explorador.
      </p>
      <p>
        <strong>mod_rewrite</strong> — módulo do Apache que reescreve URLs
        usando regras com expressões regulares. É o módulo que faz a magia
        de "URLs amigáveis": <code>/produto/123</code> em vez de{" "}
        <code>/produto.php?id=123</code>.
      </p>
      <p>
        <strong>Per-directory configuration</strong> — outro nome para
        ".htaccess". A documentação oficial do Apache usa esse termo.
      </p>
      <p>
        <strong>RewriteRule</strong> — diretiva principal do mod_rewrite:
        define um padrão (regex) e o destino. Aceita flags entre colchetes
        que mudam o comportamento (<code>[L]</code>, <code>[R=301]</code>,{" "}
        <code>[QSA]</code>, etc.).
      </p>
      <p>
        <strong>RewriteCond</strong> — condição que precede uma{" "}
        <code>RewriteRule</code>. Só se a condição for verdadeira a regra
        seguinte é avaliada.
      </p>

      <h2>O que é o .htaccess</h2>
      <p>
        É um arquivo de configuração descentralizado. Quando o Apache
        recebe uma requisição para um arquivo, ele lê o <code>.htaccess</code>{" "}
        da pasta do arquivo <strong>e de todos os diretórios pais</strong>{" "}
        (do mais externo ao mais interno). É como um <code>httpd.conf</code>{" "}
        em miniatura, com a vantagem de:
      </p>
      <ul>
        <li><strong>Não precisar reiniciar</strong> o Apache para que mudanças valham.</li>
        <li>Funcionar em hospedagem compartilhada onde você não tem acesso ao httpd.conf.</li>
        <li>Permitir cada projeto ter sua própria configuração isolada.</li>
      </ul>

      <AlertBox type="warning" title="Pré-requisito: AllowOverride All">
        Para o Apache levar o <code>.htaccess</code> a sério, no{" "}
        <code>httpd.conf</code> a diretiva da pasta correspondente precisa
        estar com <code>AllowOverride All</code> (ou pelo menos liberar a
        categoria que você vai usar). Sem isso, qualquer{" "}
        <code>.htaccess</code> é silenciosamente ignorado — sem aviso no
        log.
      </AlertBox>

      <h2>O que cada AllowOverride libera</h2>
      <ParamsTable
        title="Categorias de diretivas controladas por AllowOverride"
        params={[
          { flag: "All", desc: "Todas as categorias abaixo. Padrão do XAMPP em htdocs." },
          { flag: "None", desc: "Nenhuma. Apache nem lê o .htaccess (mais rápido)." },
          { flag: "AuthConfig", desc: "AuthType, AuthName, AuthUserFile, Require, etc. (autenticação básica/digest)." },
          { flag: "FileInfo", desc: "AddType, AddEncoding, ErrorDocument, RewriteEngine/Rule/Cond, SetEnv, Header, etc. A categoria mais usada." },
          { flag: "Indexes", desc: "DirectoryIndex, IndexOptions, AddDescription. Controle da listagem de pastas." },
          { flag: "Limit", desc: "Allow, Deny, Order (legado 2.2), Require (2.4). Controle de acesso." },
          { flag: "Options[=lista]", desc: "Diretiva Options. AllowOverride Options=Indexes só permite mexer em Indexes." },
        ]}
      />

      <h2>Habilitando o mod_rewrite</h2>
      <p>
        URLs amigáveis (sem <code>?id=</code> e <code>.php</code>) dependem
        do módulo <code>mod_rewrite</code>. No <code>httpd.conf</code>{" "}
        deixe assim:
      </p>
      <CodeBlock language="apache" code={`# Tire o # da frente:
LoadModule rewrite_module modules/mod_rewrite.so`} />
      <p>
        Reinicie o Apache. Agora os <code>.htaccess</code> com regras de
        rewrite funcionam.
      </p>

      <h2>Sintaxe da RewriteRule</h2>
      <CodeBlock language="apache" code={`RewriteRule  PADRAO  SUBSTITUICAO  [FLAGS]
            ↑       ↑              ↑
            regex   destino        opções
            que a   (URL ou        (entre colchetes,
            URL     caminho)        separadas por vírgula)
            tem que
            casar`} />

      <h2>Flags do mod_rewrite (as mais usadas)</h2>
      <ParamsTable
        title="Flags entre colchetes em RewriteRule"
        params={[
          { flag: "L", desc: "Last — para de processar regras se essa der match. Use quase sempre." },
          { flag: "R[=301|302|303|307]", desc: "Redirect — manda o navegador para outra URL com o código HTTP indicado. 301=permanente, 302=temporário, 307=igual ao 302 mas preserva método." },
          { flag: "QSA", desc: "Query String Append — preserva a query string original (?id=1) na URL final." },
          { flag: "QSD", desc: "Query String Discard — descarta a query string original." },
          { flag: "NC", desc: "No Case — match case-insensitive." },
          { flag: "F", desc: "Forbidden — devolve 403 e para o processamento." },
          { flag: "G", desc: "Gone — devolve 410. Para conteúdo removido permanentemente." },
          { flag: "N", desc: "Next — recomeça o processamento a partir da primeira regra (com a URL nova)." },
          { flag: "NE", desc: "No Escape — não codifica caracteres especiais na URL substituída." },
          { flag: "PT", desc: "Pass-Through — entrega a URL reescrita ao motor seguinte (mod_alias, etc.)." },
          { flag: "E=VAR:VALOR", desc: "Define variável de ambiente, acessível depois pelo PHP via $_SERVER['VAR']." },
          { flag: "T=text/html", desc: "Força um Content-Type específico para a resposta." },
        ]}
      />

      <h2>RewriteCond — condições antes da regra</h2>
      <p>
        Coloque uma ou mais <code>RewriteCond</code> imediatamente antes da{" "}
        <code>RewriteRule</code>. <strong>Todas</strong> precisam ser
        verdadeiras (AND) para a regra disparar. Para OR, use{" "}
        <code>[OR]</code> em todas menos a última.
      </p>
      <CodeBlock language="apache" code={`RewriteCond  STRING_DE_TESTE  PADRAO  [FLAGS]

# STRING_DE_TESTE costuma ser uma variável %{...}
# PADRAO costuma ser regex (ou pode ser !arquivo / !-d)`} />

      <h2>Variáveis disponíveis em RewriteCond</h2>
      <ParamsTable
        title="Variáveis %{...} mais úteis"
        params={[
          { flag: "%{REQUEST_URI}", desc: "A URL pedida, sem o domínio. Ex: /produto/123" },
          { flag: "%{REQUEST_FILENAME}", desc: "Caminho completo no disco do arquivo pedido. Útil com -f e -d." },
          { flag: "%{HTTP_HOST}", desc: "O domínio (header Host). Ex: minhaloja.local" },
          { flag: "%{HTTPS}", desc: "on se a requisição é HTTPS, off se HTTP." },
          { flag: "%{HTTP_USER_AGENT}", desc: "Navegador do cliente. Útil para bloquear bots." },
          { flag: "%{HTTP_REFERER}", desc: "Página de onde o usuário veio." },
          { flag: "%{REMOTE_ADDR}", desc: "IP do cliente." },
          { flag: "%{QUERY_STRING}", desc: "Tudo depois do ? na URL. Ex: id=1&page=2" },
          { flag: "%{REQUEST_METHOD}", desc: "GET, POST, PUT, etc." },
          { flag: "%{SERVER_NAME}", desc: "Nome configurado no ServerName do VirtualHost." },
          { flag: "%{TIME_DAY} / TIME_HOUR / etc", desc: "Componentes da data/hora atual." },
        ]}
      />

      <AlertBox type="info" title="Operadores especiais no padrão">
        Além de regex, RewriteCond aceita operadores prontos:
        <ul className="text-sm mt-2 space-y-1">
          <li><code>-f</code> / <code>!-f</code> — é/não é arquivo regular existente.</li>
          <li><code>-d</code> / <code>!-d</code> — é/não é diretório existente.</li>
          <li><code>-s</code> — é arquivo com tamanho &gt; 0.</li>
          <li><code>-l</code> — é symlink.</li>
          <li><code>=string</code> — comparação literal de igualdade.</li>
          <li><code>&gt;string</code>, <code>&lt;string</code> — comparação lexicográfica.</li>
        </ul>
      </AlertBox>

      <h2>Exemplo 1 — URL amigável genérica (front controller)</h2>
      <CodeBlock title=".htaccess (na raiz do projeto)" language="apache" code={`RewriteEngine On
RewriteBase /

# Se o arquivo ou pasta NÃO existirem, manda tudo para index.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php?route=$1 [QSA,L]`} />
      <p>
        Resultado: <code>http://localhost/produtos/123</code> chega no{" "}
        <code>index.php</code> com{" "}
        <code>$_GET['route'] = 'produtos/123'</code>. É a base de qualquer
        router de framework.
      </p>

      <h2>Exemplo 2 — WordPress padrão</h2>
      <CodeBlock title="wordpress/.htaccess (gerado pelo WP)" language="apache" code={`# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase /
RewriteRule ^index\\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress`} />

      <h2>Exemplo 3 — Laravel padrão (pasta /public)</h2>
      <CodeBlock title="public/.htaccess (vem com o Laravel)" language="apache" code={`<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Manuseia Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redireciona trailing slash se NÃO for diretório
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Manda tudo para index.php
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>`} />

      <h2>Exemplo 4 — Forçar HTTPS</h2>
      <CodeBlock language="apache" code={`RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]`} />

      <h2>Exemplo 5 — Forçar www (ou tirar)</h2>
      <CodeBlock language="apache" code={`# Forçar www.minhaloja.com.br
RewriteEngine On
RewriteCond %{HTTP_HOST} ^minhaloja\\.com\\.br [NC]
RewriteRule ^(.*)$ https://www.minhaloja.com.br/$1 [R=301,L]

# OU tirar o www
RewriteCond %{HTTP_HOST} ^www\\.minhaloja\\.com\\.br [NC]
RewriteRule ^(.*)$ https://minhaloja.com.br/$1 [R=301,L]`} />

      <h2>Exemplo 6 — Bloquear acesso a arquivos sensíveis</h2>
      <CodeBlock language="apache" code={`# Negar acesso a .env, .git, composer.json, .htaccess
<FilesMatch "^(\\.env|\\.git|composer\\.(json|lock)|package\\.json|\\.htaccess)$">
    Require all denied
</FilesMatch>

# Negar acesso à pasta vendor inteira
RedirectMatch 404 /vendor

# Negar acesso por extensão
<FilesMatch "\\.(sql|bak|log|ini)$">
    Require all denied
</FilesMatch>`} />

      <h2>Exemplo 7 — Cache de imagens, CSS, JS</h2>
      <CodeBlock language="apache" code={`<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresDefault "access plus 1 month"

    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"

    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType application/json "access plus 0 seconds"
    ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Cache-Control também
<IfModule mod_headers.c>
    <FilesMatch "\\.(jpg|jpeg|png|gif|webp|svg|ico|woff2?|css|js)$">
        Header set Cache-Control "public, max-age=2592000"
    </FilesMatch>
</IfModule>`} />

      <h2>Exemplo 8 — Proteger uma pasta com senha</h2>
      <CodeBlock title=".htaccess dentro da pasta /admin" language="apache" code={`AuthType Basic
AuthName "Area Restrita"
AuthUserFile "C:/xampp/htdocs/.htpasswd"
Require valid-user`} />
      <p>
        Crie o arquivo de senhas com o utilitário <code>htpasswd</code>{" "}
        que vem com o XAMPP:
      </p>
      <CodeBlock language="bash" code={`# Windows (cmd)
C:\\xampp\\apache\\bin\\htpasswd -c C:\\xampp\\htdocs\\.htpasswd admin

# Vai pedir a senha duas vezes
# -c CRIA o arquivo (use só na primeira vez; sem -c apenas adiciona)`} />

      <h2>Exemplo 9 — Bloquear bots/User-Agents indesejados</h2>
      <CodeBlock language="apache" code={`RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} (AhrefsBot|MJ12bot|SemrushBot|DotBot) [NC]
RewriteRule .* - [F,L]`} />

      <h2>Exemplo 10 — Bloquear hotlinking de imagens</h2>
      <CodeBlock language="apache" code={`RewriteEngine On
RewriteCond %{HTTP_REFERER} !^$
RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?minhaloja\\.local [NC]
RewriteRule \\.(jpe?g|png|gif|webp)$ - [F,NC,L]`} />

      <h2>Diretivas Redirect (sem regex)</h2>
      <p>
        Para redirects simples, use <code>Redirect</code> em vez de{" "}
        <code>RewriteRule</code> — é mais simples e mais rápido:
      </p>
      <ParamsTable
        title="Tipos de Redirect e Rewrite"
        params={[
          { flag: "Redirect 301 /antigo /novo", desc: "Redirect permanente. O Google vai entender que o /antigo se mudou pro /novo. Use em troca de URL." },
          { flag: "Redirect 302 /promo /produto/123", desc: "Redirect temporário. Para promoções e testes A/B." },
          { flag: "RedirectMatch 301 ^/loja/(.*)$ /shop/$1", desc: "Redirect com regex. Bom para mover seções inteiras." },
          { flag: "Redirect gone /pagina-removida", desc: "410 Gone — diz ao Google: removi de propósito, não tente reindexar." },
          { flag: "RewriteRule ^pattern$ destino [L]", desc: "Reescreve a URL internamente. O navegador continua vendo a URL antiga, mas o Apache serve o destino." },
        ]}
      />

      <h2>Performance — quando NÃO usar .htaccess</h2>
      <AlertBox type="warning" title="Toda requisição re-lê os .htaccess">
        Com <code>AllowOverride All</code>, o Apache lê <strong>todos</strong>
        os <code>.htaccess</code> da árvore (raiz → pasta do arquivo) em
        cada requisição. Em sites grandes isso pesa.
      </AlertBox>
      <p>
        Se você tem acesso ao <code>httpd.conf</code> (ou seja, é o seu
        servidor, não hospedagem compartilhada), <strong>mova as regras
        para o httpd.conf</strong> dentro de um <code>&lt;Directory&gt;</code>{" "}
        e ponha <code>AllowOverride None</code>. O Apache lê 1× ao
        iniciar e nunca mais — bem mais rápido.
      </p>
      <p>
        Em desenvolvimento (XAMPP), a diferença é imperceptível e a
        comodidade do <code>.htaccess</code> compensa.
      </p>

      <h2>Backreferences ($1, %1)</h2>
      <p>
        Os parênteses no padrão capturam grupos. Use:
      </p>
      <ul>
        <li><code>$N</code> (1-9) — backreference do padrão da <strong>RewriteRule</strong>.</li>
        <li><code>%N</code> (1-9) — backreference do padrão da <strong>última RewriteCond</strong>.</li>
      </ul>
      <CodeBlock language="apache" code={`# Captura o subdomínio e usa como pasta
RewriteCond %{HTTP_HOST} ^(.+)\\.minhaloja\\.local$
RewriteRule ^(.*)$ /clientes/%1/$1 [L]
#               ↑              ↑
#               grupo 1 da     grupo 1 da
#               RewriteRule    RewriteCond`} />

      <AlertBox type="success" title="Para depurar regras complexas">
        Habilite o RewriteLog (Apache 2.4 usa LogLevel) no httpd.conf:{" "}
        <code>LogLevel alert rewrite:trace3</code>. As reescritas aparecem
        em <code>apache/logs/error.log</code>. Lembre-se de desativar
        depois — gera muito log.
      </AlertBox>

      <h2>Ferramentas online úteis</h2>
      <ul>
        <li>
          <a href="https://htaccess.madewithlove.com/" target="_blank" rel="noreferrer">
            htaccess.madewithlove.com
          </a>{" "}
          — testa regras de rewrite contra URLs de exemplo.
        </li>
        <li>
          <a href="https://regex101.com/" target="_blank" rel="noreferrer">
            regex101.com
          </a>{" "}
          — debug visual das regex (use o flavor "PCRE").
        </li>
      </ul>
    </PageContainer>
  );
}
