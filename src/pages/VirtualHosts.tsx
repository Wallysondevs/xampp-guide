import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function VirtualHosts() {
  return (
    <PageContainer
      title="Virtual Hosts — vários sites em um só XAMPP"
      subtitle="Em vez de http://localhost/projeto1 e http://localhost/projeto2, tenha http://projeto1.local e http://projeto2.local."
      difficulty="intermediario"
      timeToRead="8 min"
    >
      <p>
        Virtual Hosts (VHosts) são entradas de configuração que dizem ao
        Apache: "quando alguém acessar tal nome de domínio, sirva os arquivos
        de tal pasta". Permite trabalhar em vários projetos ao mesmo tempo sem
        bagunçar URLs.
      </p>

      <h2>Passo 1 — Habilite o include de vhosts</h2>
      <p>
        Abra <code>apache/conf/httpd.conf</code> e procure pela linha:
      </p>
      <CodeBlock language="apache" code={`# Virtual hosts
#Include conf/extra/httpd-vhosts.conf`} />
      <p>Remova o <code>#</code> da segunda linha e salve:</p>
      <CodeBlock language="apache" code={`Include conf/extra/httpd-vhosts.conf`} />

      <h2>Passo 2 — Defina seus VHosts</h2>
      <p>Edite <code>apache/conf/extra/httpd-vhosts.conf</code>:</p>
      <CodeBlock language="apache" code={`# Mantém o localhost padrão funcionando
<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs"
    ServerName localhost
</VirtualHost>

# Site 1 — minha loja
<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/minhaloja"
    ServerName minhaloja.local
    ServerAlias www.minhaloja.local
    <Directory "C:/xampp/htdocs/minhaloja">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    ErrorLog "logs/minhaloja-error.log"
    CustomLog "logs/minhaloja-access.log" common
</VirtualHost>

# Site 2 — meu blog
<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/blog"
    ServerName blog.local
    <Directory "C:/xampp/htdocs/blog">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>`} />

      <AlertBox type="warning" title="Por que o primeiro VirtualHost de localhost?">
        Quando você habilita VHosts, o Apache deixa de servir o htdocs raiz
        automaticamente. Sem o primeiro bloco apontando para localhost,
        acessar <code>http://localhost</code> mostraria sempre o primeiro VHost
        cadastrado (não o htdocs).
      </AlertBox>

      <h2>Passo 3 — Mapeie os domínios no arquivo hosts</h2>
      <p>
        Os domínios <code>minhaloja.local</code> e <code>blog.local</code> não
        existem na internet. Para o seu computador entender que devem ser
        respondidos pelo próprio Apache, edite o arquivo <code>hosts</code>:
      </p>
      <CodeBlock language="text" code={`# Windows: C:\\Windows\\System32\\drivers\\etc\\hosts
# (precisa abrir o Bloco de Notas como Administrador)

# Linux:   /etc/hosts
# macOS:   /etc/hosts

127.0.0.1   localhost
127.0.0.1   minhaloja.local
127.0.0.1   www.minhaloja.local
127.0.0.1   blog.local`} />

      <AlertBox type="info" title="Por que .local e não .com?">
        Você pode usar qualquer sufixo (<code>.test</code>, <code>.dev</code>,
        <code>.local</code>). Evite <code>.dev</code> — desde 2017 o Chrome
        força HTTPS nesse TLD. <code>.local</code> e <code>.test</code> são as
        opções mais seguras.
      </AlertBox>

      <h2>Passo 4 — Reinicie e acesse</h2>
      <p>
        Painel → Apache → Stop → Start. Agora abra:
      </p>
      <CodeBlock language="text" code={`http://minhaloja.local
http://blog.local
http://localhost  ← continua funcionando`} />

      <PracticeBox
        title="Crie seu primeiro virtual host"
        goal="Acessar http://meuapp.local sem precisar digitar /meuapp."
        steps={[
          "Crie a pasta C:/xampp/htdocs/meuapp",
          "Dentro dela, crie index.php com: <h1>Meu app local!</h1>",
          "Habilite httpd-vhosts.conf no httpd.conf (descomente a linha Include)",
          "Adicione um <VirtualHost *:80> com ServerName meuapp.local",
          "Edite o hosts do sistema adicionando: 127.0.0.1   meuapp.local",
          "Reinicie o Apache pelo painel",
          "Acesse http://meuapp.local no navegador",
        ]}
        verify="O navegador mostra 'Meu app local!' direto, sem nenhum sub-caminho."
      />

      <h2>Erros comuns</h2>
      <ul>
        <li>
          <strong>"Forbidden — You don't have permission"</strong> — esqueceu
          o bloco <code>&lt;Directory&gt;</code> com <code>Require all granted</code>.
        </li>
        <li>
          <strong>O navegador continua indo no localhost padrão</strong> —
          esqueceu de salvar o arquivo hosts (precisava ser Administrador) ou
          esqueceu de reiniciar o Apache.
        </li>
        <li>
          <strong>"This site can't be reached"</strong> — typo no
          <code>ServerName</code> ou no arquivo hosts.
        </li>
        <li>
          <strong>Cache do DNS</strong> — após editar hosts, no Windows rode:
          <CodeBlock language="powershell" code={`ipconfig /flushdns`} />
        </li>
      </ul>
    </PageContainer>
  );
}
