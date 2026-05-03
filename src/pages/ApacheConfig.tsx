import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function ApacheConfig() {
  return (
    <PageContainer
      title="httpd.conf — coração do Apache"
      subtitle="O arquivo principal de configuração do Apache 2.4 dentro do XAMPP, das diretivas básicas aos blocos de seção, escopo, includes e MPM."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        XAMPP instalado, capítulo de <a href="#/estrutura-pastas">pastas</a>{" "}
        lido. Saber abrir e editar arquivos de texto puro (Notepad++, VS Code,
        Sublime — não use Bloco de Notas padrão do Windows porque ele bagunça
        as quebras de linha em alguns casos).
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Diretiva</strong> — uma linha de instrução do Apache, no
        formato <code>Nome valor</code> (ou <code>Nome arg1 arg2</code>). O
        Apache 2.4 tem mais de 700 diretivas espalhadas em mais de 100 módulos.
      </p>
      <p>
        <strong>Bloco / seção / contêiner</strong> — agrupamento delimitado por
        tags em formato XML, como <code>&lt;Directory&gt;…&lt;/Directory&gt;</code>{" "}
        ou <code>&lt;VirtualHost&gt;…&lt;/VirtualHost&gt;</code>. Diretivas
        dentro do bloco só valem para o escopo dele.
      </p>
      <p>
        <strong>Escopo</strong> — onde uma diretiva tem efeito: servidor todo,
        um virtual host, um diretório, um arquivo. Cada diretiva da
        documentação oficial tem uma seção <em>Context</em> dizendo onde pode
        aparecer.
      </p>
      <p>
        <strong>MPM (Multi-Processing Module)</strong> — módulo que define
        como o Apache lida com requisições simultâneas: cria processos
        (<code>prefork</code>), threads (<code>worker</code>) ou um misto
        assíncrono (<code>event</code>). No XAMPP para Windows o MPM é o{" "}
        <code>winnt</code> (próprio do Windows). No Linux costuma ser{" "}
        <code>event</code>.
      </p>
      <p>
        <strong>DSO (Dynamic Shared Object)</strong> — módulo carregado em
        tempo de execução via <code>LoadModule</code>. É como o Apache do
        XAMPP é compilado: kernel pequeno + dezenas de <code>.so</code>/
        <code>.dll</code> opcionais.
      </p>

      <h2>Onde fica e como o Apache lê</h2>
      <p>
        O arquivo principal é <code>apache/conf/httpd.conf</code>. Ao iniciar,
        o Apache lê esse arquivo de cima para baixo, processando cada linha:
      </p>
      <ul>
        <li>Linhas iniciadas por <code>#</code> são comentários — ignoradas.</li>
        <li>Diretivas são <strong>case-insensitive</strong> (<code>ServerName</code> = <code>servername</code>), mas argumentos podem ser case-sensitive (caminhos de arquivo no Linux são).</li>
        <li>Uma diretiva por linha. Para quebrar em várias linhas, use <code>\</code> no fim da linha.</li>
        <li>Espaços em branco ao redor são ignorados.</li>
        <li>Argumentos com espaço precisam vir entre aspas duplas: <code>"C:/xampp/htdocs"</code>.</li>
      </ul>

      <AlertBox type="info" title="Includes — modularize sua configuração">
        Em vez de um <code>httpd.conf</code> gigante, o XAMPP separa em vários
        arquivos dentro de <code>conf/extra/</code> e os puxa via{" "}
        <code>Include</code>. Você também pode criar os seus:
        <CodeBlock language="apache" code={`# Inclui um arquivo específico
Include conf/extra/httpd-vhosts.conf

# Inclui TODOS os .conf da pasta (wildcard)
IncludeOptional conf/projetos/*.conf`} />
      </AlertBox>

      <AlertBox type="warning" title="Antes de editar — faça backup">
        Sempre copie o <code>httpd.conf</code> para{" "}
        <code>httpd.conf.bak</code> antes de mexer. Um caractere errado e o
        Apache não inicia mais. Tendo o backup, é só restaurar.
      </AlertBox>

      <h2>As diretivas mais importantes</h2>
      <ParamsTable
        title="Diretivas que você vai mexer com frequência"
        params={[
          { flag: "ServerRoot", desc: "Pasta onde o Apache foi instalado. Todos os caminhos relativos no httpd.conf são relativos a esta.", exemplo: 'ServerRoot "C:/xampp/apache"' },
          { flag: "Listen 80", desc: "Em qual porta (e opcionalmente IP) o Apache escuta. Pode aparecer várias vezes para escutar em múltiplas portas.", exemplo: "Listen 80\nListen 443" },
          { flag: "ServerName", desc: "Nome canônico que o servidor usa para se identificar em redirects. Padrão localhost.", exemplo: "ServerName localhost:80" },
          { flag: "ServerAdmin", desc: "Email exibido em páginas de erro padrão. Em produção, um endereço real.", exemplo: "ServerAdmin admin@meusite.com" },
          { flag: "DocumentRoot", desc: "Pasta raiz do site servido em http://localhost/. Padrão aponta para htdocs.", exemplo: 'DocumentRoot "C:/xampp/htdocs"' },
          { flag: "<Directory>", desc: "Bloco de regras para uma pasta específica (Allow/Deny, Options, AllowOverride).", exemplo: '<Directory "C:/xampp/htdocs">' },
          { flag: "DirectoryIndex", desc: "Quais arquivos servir quando o cliente pede só uma pasta (sem nome de arquivo).", exemplo: "DirectoryIndex index.php index.html" },
          { flag: "LoadModule", desc: "Carrega um módulo DSO. Para ativar mod_rewrite, descomente a linha respectiva.", exemplo: "LoadModule rewrite_module modules/mod_rewrite.so" },
          { flag: "AllowOverride", desc: "Define o que o .htaccess pode sobrescrever na pasta. None ignora .htaccess; All libera tudo.", exemplo: "AllowOverride All" },
          { flag: "ErrorLog / CustomLog", desc: "Caminho dos arquivos de log. CustomLog precisa de um LogFormat.", exemplo: 'ErrorLog "logs/error.log"' },
          { flag: "LogLevel", desc: "Quanto detalhe vai para o error.log. warn é o padrão; debug ou trace para investigar problemas.", exemplo: "LogLevel warn" },
          { flag: "Timeout", desc: "Segundos que o Apache aguarda em operações de rede. Padrão 60 — em geral está bom.", exemplo: "Timeout 60" },
          { flag: "KeepAlive", desc: "Permite ao cliente reutilizar a mesma conexão TCP para várias requisições. On é o recomendado.", exemplo: "KeepAlive On" },
          { flag: "ServerTokens / ServerSignature", desc: "Define o quanto o Apache se identifica. Em produção: Prod e Off.", exemplo: "ServerTokens Prod\nServerSignature Off" },
          { flag: "Include", desc: "Importa outro arquivo de configuração. Use para separar virtual hosts, SSL, etc.", exemplo: "Include conf/extra/httpd-vhosts.conf" },
        ]}
      />

      <h2>Tipos de blocos (configuration sections)</h2>
      <p>
        Diretivas podem estar no escopo principal (valem para o servidor todo)
        ou dentro de um bloco. O Apache 2.4 oferece vários tipos de bloco.
        Cada um filtra <em>quando</em> as diretivas internas se aplicam:
      </p>
      <ParamsTable
        title="Blocos de configuração mais usados"
        params={[
          { flag: "<VirtualHost>", desc: "Diretivas valem só para um host virtual específico (combinação de IP + porta + ServerName)." },
          { flag: "<Directory>", desc: "Aplica-se aos arquivos dentro do caminho de sistema de arquivos especificado." },
          { flag: "<DirectoryMatch>", desc: "Igual ao Directory, mas com regex. Útil para padrões como /home/(.*)/public." },
          { flag: "<Files>", desc: "Aplica-se a arquivos pelo nome (sem caminho). Use para proteger .env, .git, etc." },
          { flag: "<FilesMatch>", desc: "Files com regex." },
          { flag: "<Location>", desc: "Aplica-se com base na URL pedida pelo cliente, NÃO pelo caminho do arquivo. Para coisas que não existem em disco (status, info)." },
          { flag: "<LocationMatch>", desc: "Location com regex." },
          { flag: "<If> / <Else> / <ElseIf>", desc: "Condicional baseada em expressões: se tal header existe, se IP do cliente é tal, etc. (Apache 2.4+)." },
          { flag: "<IfModule>", desc: "Só executa as diretivas internas se o módulo X estiver carregado. Útil para .htaccess portáveis." },
          { flag: "<IfDefine>", desc: "Só executa se uma define foi passada na inicialização (httpd -DEnableSSL)." },
          { flag: "<Limit> / <LimitExcept>", desc: "Restringe diretivas a métodos HTTP específicos (GET, POST, DELETE...)." },
        ]}
      />

      <AlertBox type="warning" title="Ordem de processamento (importante!)">
        O Apache não aplica as seções na ordem em que aparecem no arquivo —
        ele aplica em ordem específica:
        <ol className="list-decimal pl-6 mt-2 space-y-1 text-sm">
          <li><code>&lt;Directory&gt;</code> (sem regex) e <code>.htaccess</code> — do menos específico (raiz) ao mais específico (pasta interna).</li>
          <li><code>&lt;DirectoryMatch&gt;</code> e <code>&lt;Directory ~&gt;</code> com regex.</li>
          <li><code>&lt;Files&gt;</code> e <code>&lt;FilesMatch&gt;</code>.</li>
          <li><code>&lt;Location&gt;</code> e <code>&lt;LocationMatch&gt;</code>.</li>
          <li><code>&lt;If&gt;</code>.</li>
        </ol>
        Quando há conflito, a diretiva da seção processada mais tarde vence.
      </AlertBox>

      <h2>Bloco &lt;Directory&gt; explicado linha por linha</h2>
      <p>
        Esse é o bloco mais comum de erro de configuração. Ele controla o que
        o Apache permite ou não dentro de uma pasta:
      </p>
      <CodeBlock language="apache" code={`<Directory "C:/xampp/htdocs">
    #
    # Options - lista de comportamentos liberados:
    #   Indexes        - se não tiver index.php, lista os arquivos da pasta
    #   FollowSymLinks - segue symlinks (atalhos de pasta)
    #   ExecCGI        - permite execução de scripts CGI
    #   Includes       - permite Server-Side Includes (.shtml)
    #   IncludesNOEXEC - SSI mas sem #exec / #include
    #   MultiViews     - tenta encontrar arquivos parecidos com o pedido
    #   None           - nenhuma das anteriores
    #   All            - todas exceto MultiViews
    #
    # Você pode somar/subtrair: Options +ExecCGI -Indexes
    #
    Options Indexes FollowSymLinks Includes ExecCGI

    #
    # AllowOverride - o que o .htaccess pode sobrescrever:
    #   All        - tudo (mod_rewrite, AuthType, etc.)
    #   None       - nada (Apache nem lê o .htaccess)
    #   AuthConfig - só diretivas de autenticação (AuthType, AuthName, Require)
    #   FileInfo   - só ErrorDocument, AddType, RewriteEngine, etc.
    #   Indexes    - só DirectoryIndex, IndexOptions
    #   Limit      - só Allow/Deny/Require
    #   Options    - só Options (com ou sem lista)
    #
    AllowOverride All

    #
    # Quem pode acessar (Apache 2.4 - sintaxe nova com mod_authz_core):
    #   Require all granted - libera para todos
    #   Require all denied  - bloqueia todos
    #   Require ip 192.168  - só essa rede
    #   Require host example.com - só esse hostname (precisa reverse DNS)
    #   Require user joao   - só usuário autenticado "joao"
    #   Require valid-user  - qualquer usuário autenticado
    #
    Require all granted
</Directory>`} />

      <AlertBox type="warning" title="AllowOverride None bloqueia .htaccess">
        Se seu <code>.htaccess</code> não está funcionando (URLs amigáveis do
        WordPress quebradas, por exemplo), 90% das vezes é porque{" "}
        <code>AllowOverride</code> está como <code>None</code>. Mude para{" "}
        <code>All</code> e reinicie o Apache.
      </AlertBox>

      <h2>Performance — &lt;Directory&gt; vs &lt;Location&gt;</h2>
      <p>
        Use <code>&lt;Directory&gt;</code> sempre que puder. Ele é resolvido{" "}
        <strong>em disco</strong> (o Apache sabe que <code>/var/www/foo</code>{" "}
        é uma pasta real) e processado uma vez. <code>&lt;Location&gt;</code>{" "}
        é resolvido <strong>na URL</strong> e roda em toda requisição —
        necessário para handlers virtuais (como <code>/server-status</code>),
        mas mais caro.
      </p>

      <h2>Mudando a pasta raiz (DocumentRoot)</h2>
      <p>
        Cansado de trabalhar dentro de <code>C:\xampp\htdocs</code>? Você pode
        apontar o Apache para uma pasta de projetos qualquer:
      </p>
      <CodeBlock language="apache" code={`# Antes:
DocumentRoot "C:/xampp/htdocs"
<Directory "C:/xampp/htdocs">

# Depois (use barras / em todos os caminhos no httpd.conf):
DocumentRoot "D:/Projetos/web"
<Directory "D:/Projetos/web">
    Options Indexes FollowSymLinks Includes ExecCGI
    AllowOverride All
    Require all granted
</Directory>`} />

      <AlertBox type="info" title="Use sempre / nas barras">
        Mesmo no Windows, dentro do <code>httpd.conf</code> você usa barras
        normais (<code>/</code>), não barras invertidas. Apache tem origem
        Unix.
      </AlertBox>

      <h2>Variáveis de ambiente e expressões</h2>
      <p>
        Algumas diretivas aceitam variáveis (do request, do ambiente, de
        macros). Sintaxe: <code>%&#123;NOME&#125;</code> em RewriteCond /
        SetEnvIf, ou <code>$&#123;NOME&#125;</code> em diretivas comuns.
      </p>
      <CodeBlock language="apache" code={`# Bloquear uma rede inteira via expressão
<If "%{REMOTE_ADDR} =~ /^192\\.168\\.0\\./">
    Require all denied
</If>

# Definir variável de ambiente para o PHP receber
SetEnv APP_ENV "development"

# Carregar valor de uma variável do SO
Define DOCROOT "/var/www/projetos"
DocumentRoot "\${DOCROOT}/blog"`} />

      <h2>Salvou? Reinicie</h2>
      <p>
        Toda mudança no <code>httpd.conf</code> só vale após reiniciar o
        Apache (mudanças em <code>.htaccess</code> são instantâneas):
      </p>
      <CodeBlock language="text" code={`Painel XAMPP → Apache → Stop → Start

# Ou via comando:
# Windows
C:\\xampp\\apache\\bin\\httpd.exe -k restart

# Linux
sudo /opt/lampp/lampp restartapache`} />

      <h2>Verificando se a sintaxe está correta</h2>
      <p>
        Antes de reiniciar, sempre teste a sintaxe — assim você não derruba o
        Apache no meio do dia:
      </p>
      <CodeBlock language="bash" code={`# Windows
C:\\xampp\\apache\\bin\\httpd.exe -t

# Linux
/opt/lampp/bin/httpd -t

# Saídas possíveis:
# Syntax OK                       ← tudo certo, pode reiniciar
# Syntax error on line N of ...   ← o N te diz a linha do problema`} />

      <h2>Diagnóstico rápido</h2>
      <ParamsTable
        title="Comandos úteis para inspecionar a configuração ativa"
        params={[
          { flag: "httpd -t", desc: "Testa sintaxe (não inicia o servidor)." },
          { flag: "httpd -t -D DUMP_VHOSTS", desc: "Lista os virtual hosts que serão ativados, com origem (arquivo:linha)." },
          { flag: "httpd -t -D DUMP_MODULES", desc: "Lista todos os módulos carregados (idêntico a httpd -M)." },
          { flag: "httpd -t -D DUMP_INCLUDES", desc: "Lista todos os arquivos incluídos via Include." },
          { flag: "httpd -V", desc: "Mostra a versão completa, MPM em uso, e as opções de compilação." },
          { flag: "httpd -L", desc: "Lista todas as diretivas suportadas pelos módulos carregados, com escopo permitido." },
        ]}
      />
    </PageContainer>
  );
}
