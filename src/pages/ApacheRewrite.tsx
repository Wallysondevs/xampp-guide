import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function ApacheRewrite() {
  return (
    <PageContainer
      title="mod_rewrite — URLs amigáveis e redirecionamentos"
      subtitle="O motor de reescrita de URL do Apache. Frente a frente com RewriteRule, RewriteCond, flags e armadilhas mais comuns — com exemplos prontos para WordPress, Laravel, SPA e HTTPS forçado."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Apache rodando, módulo <code>rewrite</code> ativo (no XAMPP já vem por padrão) e <code>AllowOverride All</code> no diretório onde o <code>.htaccess</code> vai operar — caso contrário, suas regras são silenciosamente ignoradas.
      </AlertBox>

      <h2>Conceito</h2>
      <p>
        <strong>mod_rewrite</strong> intercepta cada requisição e, antes de servir o arquivo, aplica
        regras (regex) que podem reescrever a URL <em>internamente</em> (o cliente não vê) ou
        <em>externamente</em> (resposta 301/302). É a base de URLs amigáveis (<code>/produto/123</code>{" "}
        em vez de <code>/index.php?id=123</code>), redirecionamentos canônicos, força de HTTPS,
        bloqueio por User-Agent etc.
      </p>

      <h2>Conferindo se o módulo está ativo</h2>
      <CodeBlock
        title="httpd.conf — XAMPP"
        language="apache"
        code={`# Em C:/xampp/apache/conf/httpd.conf — esta linha NÃO pode estar comentada:
LoadModule rewrite_module modules/mod_rewrite.so

# E onde quer que use .htaccess:
<Directory "C:/xampp/htdocs">
    AllowOverride All
    Require all granted
</Directory>`}
      />
      <p>
        Após qualquer alteração no <code>httpd.conf</code>, reinicie o Apache pelo painel.
        Mudanças em <code>.htaccess</code> são lidas a cada request e <strong>não</strong>{" "}
        precisam de restart.
      </p>

      <h2>Anatomia de uma regra</h2>
      <CodeBlock
        title=".htaccess básico"
        language="apache"
        code={`RewriteEngine On
RewriteBase /

# RewriteCond  -> precondições (múltiplas viram AND)
# RewriteRule  -> padrão a casar  destino  [flags]

RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]`}
      />

      <h2>Variáveis úteis</h2>
      <ParamsTable
        title="Variáveis de servidor mais usadas em RewriteCond"
        params={[
          { flag: "%{HTTPS}", desc: "'on' ou 'off'. Use para forçar HTTPS." },
          { flag: "%{HTTP_HOST}", desc: "Domínio da requisição (ex: meusite.local)." },
          { flag: "%{REQUEST_URI}", desc: "Caminho da URL pedido (sem o domínio)." },
          { flag: "%{QUERY_STRING}", desc: "Tudo que vier depois do '?'. Use [QSA] para preservar." },
          { flag: "%{HTTP_USER_AGENT}", desc: "Identificação do navegador/bot." },
          { flag: "%{REMOTE_ADDR}", desc: "IP do cliente." },
          { flag: "%{REQUEST_METHOD}", desc: "GET, POST, PUT, DELETE..." },
          { flag: "%{REQUEST_FILENAME}", desc: "Caminho absoluto no disco. Combinado com -f / -d testa existência." },
        ]}
      />

      <h2>Flags essenciais</h2>
      <ParamsTable
        title="Flags entre colchetes em RewriteRule"
        params={[
          { flag: "[L]", desc: "Last — pare de processar regras (continua só se houver outro request interno)." },
          { flag: "[R=301]", desc: "Redirect permanente. Use 302 para temporário." },
          { flag: "[QSA]", desc: "Query String Append — concatena ?foo=bar em vez de descartar." },
          { flag: "[NC]", desc: "No Case — case-insensitive na regex." },
          { flag: "[F]", desc: "Forbidden — devolve 403 sem reescrever." },
          { flag: "[G]", desc: "Gone — devolve 410." },
          { flag: "[E=VAR:val]", desc: "Define variável de ambiente para outras regras / PHP." },
          { flag: "[END]", desc: "Como [L] mas também impede que .htaccess de subpasta processe de novo." },
        ]}
      />

      <h2>Receitas prontas</h2>

      <h3>1. Forçar HTTPS</h3>
      <CodeBlock
        language="apache"
        code={`RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]`}
      />

      <h3>2. Forçar www (ou remover www)</h3>
      <CodeBlock
        language="apache"
        code={`# Sem www -> com www
RewriteCond %{HTTP_HOST} ^meusite\\.local$ [NC]
RewriteRule ^ http://www.meusite.local%{REQUEST_URI} [R=301,L]

# Com www -> sem www
RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]
RewriteRule ^ http://%1%{REQUEST_URI} [R=301,L]`}
      />

      <h3>3. WordPress padrão</h3>
      <CodeBlock
        language="apache"
        code={`# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase /
RewriteRule ^index\\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress`}
      />

      <h3>4. Laravel (servir tudo via public/index.php)</h3>
      <CodeBlock
        language="apache"
        code={`<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>
    RewriteEngine On
    # Cabeçalhos Authorization (JWT/OAuth)
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
    # Sem barra final
    RewriteRule ^(.*)/$ /$1 [L,R=301]
    # Tudo o que não for arquivo/pasta cai no front controller
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>`}
      />

      <h3>5. SPA (React/Vue/Angular) servida pelo XAMPP</h3>
      <CodeBlock
        language="apache"
        code={`# Caia no index.html para o router do front cuidar das rotas
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>`}
      />

      <h3>6. URL bonita para PHP antigo</h3>
      <CodeBlock
        language="apache"
        code={`# /produto/42  ->  /produto.php?id=42
RewriteEngine On
RewriteRule ^produto/([0-9]+)/?$  produto.php?id=$1 [L,QSA]
RewriteRule ^categoria/([a-z0-9-]+)/?$  categoria.php?slug=$1 [L,QSA]`}
      />

      <h3>7. Bloquear bots indesejados</h3>
      <CodeBlock
        language="apache"
        code={`RewriteEngine On
RewriteCond %{HTTP_USER_AGENT} (ahrefs|semrush|mj12bot|petalbot) [NC]
RewriteRule ^ - [F,L]`}
      />

      <h3>8. Manter SOMENTE arquivos reais (.html, .css, .js, ...)</h3>
      <CodeBlock
        language="apache"
        code={`RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ erro404.php [L]`}
      />

      <h2>Depurando regras</h2>
      <p>
        Não confie só no "deve estar funcionando". Ative o log do mod_rewrite:
      </p>
      <CodeBlock
        title="httpd.conf"
        language="apache"
        code={`LogLevel alert rewrite:trace3
ErrorLog "logs/error.log"`}
      />
      <p>
        Faça uma requisição, abra <code>C:/xampp/apache/logs/error.log</code> e siga linha
        por linha como o motor casou (ou não) cada regra. Em produção,{" "}
        <strong>desative o trace</strong> — gera logs enormes.
      </p>

      <AlertBox type="warning" title="Loop infinito de redirect">
        Se a regra reescreve para uma URL que cai na própria regra, o navegador entra em loop e o
        Apache devolve <em>"too many redirects"</em>. Sempre use uma <code>RewriteCond</code>{" "}
        que <strong>impeça o casamento na segunda passada</strong> (ex.:{" "}
        <code>%{`{HTTPS} off`}</code> ao forçar HTTPS).
      </AlertBox>

      <h2>Armadilhas comuns</h2>
      <ul>
        <li>
          <strong>AllowOverride None</strong> no <code>httpd.conf</code> — o <code>.htaccess</code>{" "}
          é simplesmente ignorado e nada do que você escreve funciona.
        </li>
        <li>
          <strong>Cache do navegador</strong> em redirect 301 — o navegador guarda a resposta para
          sempre. Teste em janela anônima ou com <kbd>Ctrl+Shift+Del</kbd>.
        </li>
        <li>
          Regex <strong>guloso demais</strong>: <code>(.*)</code> casa string vazia também.
          Prefira <code>([a-z0-9-]+)</code> com classes explícitas.
        </li>
        <li>
          Esquecer o <code>[L]</code> faz a regra continuar processando e às vezes a próxima
          desfaz a anterior.
        </li>
      </ul>
    </PageContainer>
  );
}
