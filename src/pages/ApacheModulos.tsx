import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function ApacheModulos() {
  return (
    <PageContainer
      title="Módulos do Apache"
      subtitle="O Apache é um esqueleto magro que ganha poder com módulos. Saiba quais ativar e quando."
      difficulty="intermediario"
      timeToRead="6 min"
    >
      <p>
        Cada funcionalidade do Apache vive em um módulo. Para usar URLs
        amigáveis, ativa-se <code>mod_rewrite</code>. Para HTTPS, o{" "}
        <code>mod_ssl</code>. E assim por diante. No <code>httpd.conf</code>
        você tem dezenas de linhas <code>LoadModule</code>: descomente as que
        precisar.
      </p>

      <h2>Como ativar/desativar um módulo</h2>
      <CodeBlock language="apache" code={`# DESATIVADO (com #):
#LoadModule rewrite_module modules/mod_rewrite.so

# ATIVADO:
LoadModule rewrite_module modules/mod_rewrite.so`} />
      <p>
        Salve o arquivo. Reinicie o Apache (Painel → Stop → Start). Pronto.
      </p>

      <AlertBox type="warning" title="Erro de syntax na inicialização?">
        Se o Apache parar de iniciar logo após você ativar um módulo, é
        provavelmente porque alguma diretiva no httpd.conf depende dele e
        agora ele tem outro conflito. Olhe o <code>error.log</code> para
        descobrir.
      </AlertBox>

      <h2>Módulos mais úteis no dia a dia</h2>
      <ParamsTable
        title="Os módulos que você provavelmente vai querer ligar"
        params={[
          { flag: "mod_rewrite", desc: "URLs amigáveis e redirects via .htaccess. Imprescindível para WordPress, Laravel, qualquer framework moderno." },
          { flag: "mod_ssl", desc: "Suporte a HTTPS. Necessário para o Apache servir conexões na porta 443." },
          { flag: "mod_headers", desc: "Permite adicionar/remover cabeçalhos HTTP via .htaccess (Header set, Header unset). Essencial para CORS e segurança." },
          { flag: "mod_expires", desc: "Define cabeçalhos Expires para controle de cache em CSS, JS, imagens." },
          { flag: "mod_deflate", desc: "Compactação gzip de respostas. Reduz drasticamente o peso de HTML/CSS/JS enviados." },
          { flag: "mod_alias", desc: "Cria aliases — manda /docs para /var/www/documentos sem mover arquivos." },
          { flag: "mod_proxy + mod_proxy_http", desc: "Faz reverse proxy. Útil quando você quer servir um Node.js/Vite por trás do Apache." },
          { flag: "mod_proxy_wstunnel", desc: "Suporte a WebSocket via proxy. Para testar app real-time atrás do Apache." },
          { flag: "mod_dav + mod_dav_fs", desc: "Suporte a WebDAV. Permite usar o Apache como compartilhamento de arquivos via HTTP." },
          { flag: "mod_userdir", desc: "Habilita pastas pessoais — http://localhost/~usuario aponta para /home/usuario/public_html." },
          { flag: "mod_security2", desc: "Web Application Firewall (WAF). Bloqueia ataques conhecidos antes de chegar no PHP. Não vem habilitado por padrão." },
        ]}
      />

      <h2>Listando todos os módulos carregados</h2>
      <CodeBlock language="bash" code={`# Windows
C:/xampp/apache/bin/httpd.exe -M

# Linux
/opt/lampp/bin/httpd -M

# Saída exemplo:
# Loaded Modules:
#  core_module (static)
#  http_module (static)
#  ...
#  rewrite_module (shared)
#  ssl_module (shared)`} />

      <h2>Habilitar gzip (mod_deflate)</h2>
      <p>
        No <code>httpd.conf</code>, deixe ativo o LoadModule:
      </p>
      <CodeBlock language="apache" code={`LoadModule deflate_module modules/mod_deflate.so`} />
      <p>
        Em um <code>.htaccess</code> (ou no próprio httpd.conf):
      </p>
      <CodeBlock language="apache" code={`<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml
    AddOutputFilterByType DEFLATE text/css text/javascript
    AddOutputFilterByType DEFLATE application/javascript application/json
    AddOutputFilterByType DEFLATE application/xml application/rss+xml
    AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>`} />

      <h2>CORS via mod_headers</h2>
      <CodeBlock language="apache" code={`<IfModule mod_headers.c>
    # Liberar pra qualquer origem (use só em dev)
    Header set Access-Control-Allow-Origin "*"

    # Liberar só para um domínio específico
    Header set Access-Control-Allow-Origin "https://meufrontend.com.br"

    # Métodos e headers liberados
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>`} />

      <AlertBox type="info" title="Não exagere">
        Cada módulo carregado consome memória do Apache. Em desenvolvimento
        isso não importa, mas em produção deixe carregado só o necessário.
      </AlertBox>
    </PageContainer>
  );
}
