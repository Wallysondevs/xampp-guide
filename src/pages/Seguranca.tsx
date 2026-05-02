import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Seguranca() {
  return (
    <PageContainer
      title="Segurança no XAMPP"
      subtitle="O XAMPP foi feito para desenvolvimento. Algumas configurações vêm relaxadas — aqui mostramos como apertar quando precisar."
      difficulty="intermediario"
      timeToRead="8 min"
    >
      <AlertBox type="danger" title="Regra de ouro">
        XAMPP <strong>não é servidor de produção</strong>. Mesmo apertando
        tudo, há ferramentas mais adequadas para hospedar projetos reais.
        Use este capítulo se você precisa expor temporariamente o XAMPP na
        rede local (apresentação, demo, hackathon) ou se quer reforçar
        práticas de boas senhas mesmo localmente.
      </AlertBox>

      <h2>1. Defina senha do root no MySQL</h2>
      <p>
        Veja <a href="#/mysql-senha-root">Senha do root</a>. É a primeira
        coisa que invasor automatizado tenta — e o XAMPP entrega vazia.
      </p>

      <h2>2. Restrinja o phpMyAdmin</h2>
      <p>
        Edite <code>apache/conf/extra/httpd-xampp.conf</code> e procure pelo
        bloco <code>&lt;Directory "C:/xampp/phpMyAdmin"&gt;</code>:
      </p>
      <CodeBlock language="apache" code={`<Directory "C:/xampp/phpMyAdmin">
    AllowOverride AuthConfig
    Require local        ← já é local-only por padrão na maioria das versões

    # Para acessar de outra máquina na rede local:
    # Require ip 192.168.1
    # Require ip 10.0.0
</Directory>`} />
      <p>
        Para uma camada extra, ponha o phpMyAdmin atrás de senha HTTP Basic
        (veja seção .htpasswd no <a href="#/htaccess">.htaccess</a>).
      </p>

      <h2>3. Use o "Security check" do XAMPP</h2>
      <p>O dashboard tem uma página automática que verifica vulnerabilidades:</p>
      <CodeBlock language="text" code={`http://localhost/security/`} />
      <p>
        Ela aponta o que está aberto. Tem um link "/security/xamppsecurity.php"
        que, se você acessar, faz um wizard pra:
      </p>
      <ul>
        <li>Definir senha do MySQL root</li>
        <li>Definir senha do diretório XAMPP (htpasswd)</li>
      </ul>

      <h2>4. Limite quem acessa o XAMPP pela rede</h2>
      <p>
        Por padrão o Apache do XAMPP escuta em <code>0.0.0.0:80</code>, ou
        seja, em todas as interfaces. Se sua máquina está em uma rede WiFi
        pública, qualquer um pode acessar <code>http://SEU-IP/</code>.
      </p>
      <p>
        Para limitar a apenas localhost, edite{" "}
        <code>apache/conf/httpd.conf</code>:
      </p>
      <CodeBlock language="apache" code={`# Antes:
Listen 80

# Depois (só escuta localmente):
Listen 127.0.0.1:80
Listen [::1]:80`} />

      <h2>5. Não exponha o phpinfo()</h2>
      <p>
        É um clássico: você cria <code>htdocs/info.php</code> com{" "}
        <code>phpinfo()</code> pra debugar e esquece de apagar. Em produção
        isso é <strong>uma mina de ouro</strong> para invasores: revela versão
        do PHP, módulos, caminho de arquivos, variáveis de ambiente.
      </p>
      <p>Sempre apague depois de usar — ou bloqueie:</p>
      <CodeBlock title=".htaccess" language="apache" code={`<Files "info.php">
    Require all denied
</Files>

# Ou bloqueie qualquer arquivo que comece com phpinfo
<FilesMatch "^phpinfo">
    Require all denied
</FilesMatch>`} />

      <h2>6. Esconda a versão do Apache e PHP</h2>
      <p>
        Em <code>httpd.conf</code>, adicione/edite:
      </p>
      <CodeBlock language="apache" code={`ServerTokens Prod
ServerSignature Off`} />
      <p>
        Em <code>php.ini</code>:
      </p>
      <CodeBlock language="ini" code={`expose_php = Off`} />
      <p>
        Antes: o navegador via <code>Server: Apache/2.4.58 (Win64) PHP/8.2.12</code>.
        Depois: só <code>Server: Apache</code>.
      </p>

      <h2>7. Cabeçalhos de segurança</h2>
      <p>
        Coloque no <code>.htaccess</code> ou no <code>httpd.conf</code>:
      </p>
      <CodeBlock language="apache" code={`<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
    Header set Permissions-Policy "geolocation=(), microphone=()"

    # Só ative HSTS quando estiver 100% certo do HTTPS — é difícil reverter
    # Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"

    # CSP é poderoso e quebra MUITA coisa se não for ajustado — comece restritivo
    # Header set Content-Security-Policy "default-src 'self'"
</IfModule>`} />

      <h2>8. Bloqueie acesso a arquivos sensíveis</h2>
      <CodeBlock title=".htaccess da raiz" language="apache" code={`<FilesMatch "(^\\.|composer\\.(json|lock)|package\\.json|README|\\.sql$|\\.env)">
    Require all denied
</FilesMatch>

# Negar listing de pastas
Options -Indexes`} />

      <h2>9. Atualize o XAMPP</h2>
      <p>
        Versões antigas têm CVEs conhecidas (PHP 5.x, Apache 2.2, MariaDB
        antigo). Mesmo em desenvolvimento, mantenha-se em uma versão recente
        e suportada — em{" "}
        <a href="https://www.apachefriends.org/download.html" target="_blank" rel="noreferrer">
          apachefriends.org
        </a>{" "}
        sempre tem a lista do que ainda recebe atualização.
      </p>

      <AlertBox type="success" title="Resumindo: o que fazer agora">
        Senha de root no MySQL, phpMyAdmin restrito ao localhost,
        <code>display_errors = Off</code> ao menos quando expor algo, sem{" "}
        <code>phpinfo.php</code> esquecido na raiz e <code>.htaccess</code>{" "}
        bloqueando arquivos sensíveis. Pra dia a dia local, isso é mais que
        suficiente.
      </AlertBox>
    </PageContainer>
  );
}
