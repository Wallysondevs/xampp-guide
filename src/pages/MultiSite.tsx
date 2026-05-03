import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function MultiSite() {
  return (
    <PageContainer
      title="Hospedando vários sites no mesmo XAMPP"
      subtitle="Múltiplos domínios locais, cada um com PHP, MariaDB e logs próprios. Como organizar pastas, hosts e VirtualHosts sem misturar nada."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Já saber criar um VirtualHost (capítulo Virtual Hosts). Saber editar o arquivo{" "}
        <code>hosts</code> do sistema. <code>AllowOverride All</code> para os <code>.htaccess</code>{" "}
        funcionarem em cada site.
      </AlertBox>

      <h2>Cenário</h2>
      <p>Quatro projetos no mesmo XAMPP, sem se atrapalharem:</p>
      <CodeBlock
        language="text"
        code={`http://loja.local       → C:/xampp/htdocs/loja        (Laravel)
http://blog.local       → C:/xampp/htdocs/blog        (WordPress)
http://api.local        → C:/xampp/htdocs/api         (Slim)
http://admin.local      → C:/xampp/htdocs/admin/dist  (SPA React)`}
      />

      <h2>1. Estrutura de pastas</h2>
      <CodeBlock
        language="text"
        code={`C:/xampp/htdocs/
├── loja/
│   ├── public/
│   │   └── index.php       ← DocumentRoot do vhost
│   ├── app/
│   ├── vendor/
│   └── .env
├── blog/                   ← WordPress (DocumentRoot = pasta inteira)
│   ├── wp-admin/
│   └── ...
├── api/
│   └── public/index.php
└── admin/
    └── dist/index.html     ← SPA já buildada`}
      />

      <h2>2. Apontar domínios para localhost</h2>
      <CodeBlock
        title="C:/Windows/System32/drivers/etc/hosts  (abrir como admin)"
        language="text"
        code={`# Esta linha sempre existe
127.0.0.1   localhost

# Adicione um por site (mesma linha pode listar vários)
127.0.0.1   loja.local
127.0.0.1   blog.local
127.0.0.1   api.local
127.0.0.1   admin.local`}
      />
      <CodeBlock
        title="Linux/macOS — /etc/hosts"
        language="bash"
        code={`sudo nano /etc/hosts
# adicione as mesmas linhas`}
      />
      <p>
        Após salvar, abra o navegador em <code>http://loja.local</code> — ainda vai dar 404
        (vhost não existe), mas o nome já resolve para 127.0.0.1.
      </p>

      <h2>3. Habilitar VirtualHosts no Apache</h2>
      <CodeBlock
        title="C:/xampp/apache/conf/httpd.conf"
        language="apache"
        code={`# Descomente esta linha (procure 'vhosts')
Include conf/extra/httpd-vhosts.conf

# Pra debug — exibe quais hosts estão ativos
NameVirtualHost *:80   # (apenas Apache 2.2; 2.4 ignora)`}
      />

      <h2>4. Definir os VirtualHosts</h2>
      <CodeBlock
        title="C:/xampp/apache/conf/extra/httpd-vhosts.conf"
        language="apache"
        code={`# Default — qualquer requisição que não bater em nenhum ServerName cai aqui
<VirtualHost *:80>
    ServerName  localhost
    DocumentRoot "C:/xampp/htdocs"
    <Directory "C:/xampp/htdocs">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

# === LOJA ===
<VirtualHost *:80>
    ServerName  loja.local
    ServerAlias www.loja.local
    DocumentRoot "C:/xampp/htdocs/loja/public"

    <Directory "C:/xampp/htdocs/loja/public">
        AllowOverride All
        Require all granted
        Options -Indexes +FollowSymLinks
    </Directory>

    ErrorLog  "logs/loja-error.log"
    CustomLog "logs/loja-access.log" combined

    php_admin_value memory_limit 512M
    php_admin_value upload_max_filesize 50M
</VirtualHost>

# === BLOG ===
<VirtualHost *:80>
    ServerName  blog.local
    DocumentRoot "C:/xampp/htdocs/blog"
    <Directory "C:/xampp/htdocs/blog">
        AllowOverride All
        Require all granted
    </Directory>
    ErrorLog  "logs/blog-error.log"
    CustomLog "logs/blog-access.log" combined
</VirtualHost>

# === API ===
<VirtualHost *:80>
    ServerName  api.local
    DocumentRoot "C:/xampp/htdocs/api/public"
    <Directory "C:/xampp/htdocs/api/public">
        AllowOverride All
        Require all granted
    </Directory>

    Header always set Access-Control-Allow-Origin  "*"
    Header always set Access-Control-Allow-Methods "GET,POST,PUT,DELETE,OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type,Authorization"

    ErrorLog  "logs/api-error.log"
    CustomLog "logs/api-access.log" combined
</VirtualHost>

# === ADMIN (SPA estática) ===
<VirtualHost *:80>
    ServerName  admin.local
    DocumentRoot "C:/xampp/htdocs/admin/dist"
    <Directory "C:/xampp/htdocs/admin/dist">
        AllowOverride All
        Require all granted

        # Fallback para SPA
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    ErrorLog  "logs/admin-error.log"
    CustomLog "logs/admin-access.log" combined
</VirtualHost>`}
      />
      <p>Reinicie o Apache. <code>httpd -S</code> lista vhosts ativos para confirmar.</p>

      <h2>5. Bancos de dados separados</h2>
      <p>
        Cada site, seu banco e seu usuário — limita estrago em caso de invasão.
      </p>
      <CodeBlock
        language="sql"
        code={`-- phpMyAdmin / SQL
CREATE DATABASE loja  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE blog  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE api   CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'app_loja'@'localhost' IDENTIFIED BY 'pwd_loja';
CREATE USER 'app_blog'@'localhost' IDENTIFIED BY 'pwd_blog';
CREATE USER 'app_api' @'localhost' IDENTIFIED BY 'pwd_api';

GRANT ALL PRIVILEGES ON loja.* TO 'app_loja'@'localhost';
GRANT ALL PRIVILEGES ON blog.* TO 'app_blog'@'localhost';
GRANT ALL PRIVILEGES ON api.*  TO 'app_api' @'localhost';
FLUSH PRIVILEGES;`}
      />

      <h2>6. .env por site</h2>
      <CodeBlock
        title="loja/.env"
        language="text"
        code={`APP_ENV=local
APP_URL=http://loja.local
DB_HOST=127.0.0.1
DB_DATABASE=loja
DB_USERNAME=app_loja
DB_PASSWORD=pwd_loja`}
      />
      <p>
        Repita para cada site. <code>.env</code> nunca vai pro Git — adicione a{" "}
        <code>.gitignore</code>.
      </p>

      <h2>7. HTTPS local para todos (opcional)</h2>
      <p>
        Use <code>mkcert</code> (<a>github.com/FiloSottile/mkcert</a>) para gerar certificados
        confiáveis pelo navegador:
      </p>
      <CodeBlock
        language="bash"
        code={`mkcert -install
mkcert loja.local blog.local api.local admin.local
# Gera 2 arquivos .pem`}
      />
      <CodeBlock
        title="httpd-vhosts.conf — bloco SSL"
        language="apache"
        code={`<VirtualHost *:443>
    ServerName loja.local
    DocumentRoot "C:/xampp/htdocs/loja/public"
    SSLEngine on
    SSLCertificateFile      "C:/xampp/apache/conf/cert/loja.local+3.pem"
    SSLCertificateKeyFile   "C:/xampp/apache/conf/cert/loja.local+3-key.pem"
    <Directory "C:/xampp/htdocs/loja/public">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>`}
      />

      <h2>Confirmando que está tudo certo</h2>
      <CodeBlock
        language="bash"
        code={`# Lista vhosts vistos pelo Apache
C:/xampp/apache/bin/httpd.exe -S

# Saída esperada
# VirtualHost configuration:
# *:80   is a NameVirtualHost
#         default server localhost (...)
#         port 80 namevhost loja.local (...)
#         port 80 namevhost blog.local (...)
#         port 80 namevhost api.local  (...)`}
      />

      <h2>Padrões para evitar dor</h2>
      <ParamsTable
        title="Convenções recomendadas"
        params={[
          { flag: "TLD .local / .test", desc: "Não use .com (pode resolver pra internet)." },
          { flag: "DocumentRoot = subpasta /public", desc: "Frameworks modernos (Laravel/Symfony) servem só /public — protege /vendor." },
          { flag: "Logs separados", desc: "loja-error.log, blog-error.log — debug sem confusão." },
          { flag: "Banco por app", desc: "loja, blog, api — usuário próprio com mínimo de privilégios." },
          { flag: ".env por site", desc: "Variáveis de ambiente isoladas." },
          { flag: "PHP por vhost", desc: "php_admin_value memory_limit, upload_max_filesize ajustam por app." },
        ]}
      />

      <h2>Bonus: plugin que automatiza</h2>
      <p>
        Se cansar de editar <code>vhosts</code> + <code>hosts</code> manualmente, use{" "}
        <strong>XAMPP Virtual Host Manager</strong> (extensão community) ou um script:
      </p>
      <CodeBlock
        title="add-vhost.bat"
        language="text"
        code={`@echo off
set NAME=%1
echo. >> C:\\Windows\\System32\\drivers\\etc\\hosts
echo 127.0.0.1   %NAME%.local >> C:\\Windows\\System32\\drivers\\etc\\hosts

(
  echo ^<VirtualHost *:80^>
  echo     ServerName  %NAME%.local
  echo     DocumentRoot "C:/xampp/htdocs/%NAME%/public"
  echo     ^<Directory "C:/xampp/htdocs/%NAME%/public"^>
  echo         AllowOverride All
  echo         Require all granted
  echo     ^</Directory^>
  echo     ErrorLog  "logs/%NAME%-error.log"
  echo     CustomLog "logs/%NAME%-access.log" combined
  echo ^</VirtualHost^>
) >> C:\\xampp\\apache\\conf\\extra\\httpd-vhosts.conf

C:\\xampp\\apache\\bin\\httpd.exe -k restart
echo Site %NAME%.local pronto.`}
      />
      <p>
        Uso: <code>add-vhost.bat novosite</code> — pronto.
      </p>

      <AlertBox type="warning" title="hosts não atualiza enquanto o navegador está aberto">
        Chrome cacheia DNS interno por uma sessão. Se mudar o <code>hosts</code> e o site
        continuar 404, abra <code>chrome://net-internals/#dns</code> e clique{" "}
        "Clear host cache". Funciona pro Edge também.
      </AlertBox>

      <h2>Armadilhas</h2>
      <ul>
        <li>
          Esquecer <code>AllowOverride All</code> → <code>.htaccess</code> dos sites silenciosamente
          ignorado.
        </li>
        <li>
          Reusar a porta 80 sem desabilitar IIS / Skype / outro Apache → "address already in use".
        </li>
        <li>
          Mesma sessão PHP entre sites → cookies se cruzam. Use <code>session.cookie_path</code> ou
          <code>session_set_cookie_params(['domain' =&gt; 'loja.local'])</code>.
        </li>
        <li>
          DocumentRoot apontando para a pasta raiz do projeto (em vez de <code>/public</code>) → expõe
          <code>.env</code>, <code>vendor/</code> e <code>composer.json</code> para o navegador.
        </li>
      </ul>
    </PageContainer>
  );
}
