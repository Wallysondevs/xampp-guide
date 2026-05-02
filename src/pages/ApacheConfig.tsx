import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function ApacheConfig() {
  return (
    <PageContainer
      title="httpd.conf — coração do Apache"
      subtitle="Entenda o arquivo principal de configuração do Apache que vem dentro do XAMPP."
      difficulty="intermediario"
      timeToRead="9 min"
    >
      <p>
        O arquivo <code>apache/conf/httpd.conf</code> é onde tudo começa. Cada
        comportamento do Apache (em qual porta escuta, qual a pasta raiz, quais
        módulos carrega, qual é o usuário do processo) está descrito ali.
      </p>

      <AlertBox type="info" title="Antes de editar — faça backup">
        Sempre copie o <code>httpd.conf</code> para{" "}
        <code>httpd.conf.bak</code> antes de mexer. Um caractere errado e o
        Apache não inicia mais. Tendo o backup, é só restaurar.
      </AlertBox>

      <h2>As diretivas mais importantes</h2>
      <ParamsTable
        title="Diretivas que você vai mexer com frequência"
        params={[
          { flag: "Listen 80", desc: "Define em qual porta o Apache escuta. Mude para 8080 se a 80 estiver ocupada.", exemplo: "Listen 8080" },
          { flag: "ServerName", desc: "Nome que o servidor responde. Padrão é localhost. Pode mudar para um domínio fictício se quiser.", exemplo: "ServerName localhost:80" },
          { flag: "DocumentRoot", desc: "Pasta raiz do site servido em http://localhost/. Padrão aponta para htdocs.", exemplo: 'DocumentRoot "C:/xampp/htdocs"' },
          { flag: "<Directory>", desc: "Bloco de regras aplicadas a uma pasta específica: Allow/Deny, Options, AllowOverride.", exemplo: '<Directory "C:/xampp/htdocs">' },
          { flag: "DirectoryIndex", desc: "Quais arquivos o Apache procura quando você acessa só uma pasta (sem nome de arquivo).", exemplo: "DirectoryIndex index.php index.html" },
          { flag: "LoadModule", desc: "Carrega um módulo do Apache. Para ativar mod_rewrite, descomente: LoadModule rewrite_module modules/mod_rewrite.so", exemplo: "LoadModule rewrite_module modules/mod_rewrite.so" },
          { flag: "AllowOverride All", desc: "Permite que o .htaccess sobrescreva configurações daquela pasta. Sem isso, .htaccess é ignorado.", exemplo: "AllowOverride All" },
          { flag: "ErrorLog / CustomLog", desc: "Caminho dos arquivos de log. Padrão: logs/error.log e logs/access.log dentro da pasta do Apache.", exemplo: 'ErrorLog "logs/error.log"' },
          { flag: "Include conf/extra/httpd-vhosts.conf", desc: "Inclui um arquivo separado com as definições de virtual hosts. Descomente para habilitar.", exemplo: "Include conf/extra/httpd-vhosts.conf" },
          { flag: "ServerTokens / ServerSignature", desc: "Define o quanto o Apache se identifica ao mundo. Em produção, o ideal é Prod e Off respectivamente.", exemplo: "ServerTokens Prod / ServerSignature Off" },
        ]}
      />

      <h2>Bloco &lt;Directory&gt; explicado</h2>
      <p>
        Esse é o bloco mais comum de erro de configuração. Ele controla o que o
        Apache permite ou não dentro de uma pasta:
      </p>
      <CodeBlock language="apache" code={`<Directory "C:/xampp/htdocs">
    #
    # Options - lista de comportamentos liberados:
    # Indexes        - se não tiver index.php, lista os arquivos da pasta
    # FollowSymLinks - segue symlinks (atalhos de pasta)
    # ExecCGI        - permite execução de scripts CGI
    # MultiViews     - tenta encontrar arquivos parecidos com o pedido
    #
    Options Indexes FollowSymLinks Includes ExecCGI

    #
    # AllowOverride - o que o .htaccess pode sobrescrever:
    # All     - tudo (mod_rewrite, AuthType, etc.)
    # None    - nada (ignora .htaccess)
    # FileInfo, AuthConfig, Limit, Options - controle granular
    #
    AllowOverride All

    #
    # Quem pode acessar:
    # Require all granted - libera para todos
    # Require all denied  - bloqueia todos
    # Require ip 192.168  - só essa rede
    #
    Require all granted
</Directory>`} />

      <AlertBox type="warning" title="AllowOverride None bloqueia .htaccess">
        Se seu <code>.htaccess</code> não está funcionando (URLs amigáveis do
        WordPress quebradas, por exemplo), 90% das vezes é porque{" "}
        <code>AllowOverride</code> está como <code>None</code>. Mude para{" "}
        <code>All</code> e reinicie o Apache.
      </AlertBox>

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

      <h2>Salvou? Reinicie</h2>
      <p>Toda mudança no <code>httpd.conf</code> só vale após reiniciar o Apache:</p>
      <CodeBlock language="text" code={`Painel → Apache → Stop → Start`} />

      <h2>Verificando se a sintaxe está correta</h2>
      <p>
        Antes de reiniciar, você pode testar se o arquivo está sem erros de
        sintaxe:
      </p>
      <CodeBlock language="bash" code={`# Windows (no terminal/cmd)
C:\\xampp\\apache\\bin\\httpd.exe -t

# Linux
/opt/lampp/bin/httpd -t

# Saída esperada quando está tudo certo:
# Syntax OK`} />
      <p>
        Se aparecer um erro, ele já te diz qual linha está com problema.
      </p>
    </PageContainer>
  );
}
