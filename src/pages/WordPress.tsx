import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function WordPress() {
  return (
    <PageContainer
      title="Hospedando WordPress no XAMPP"
      subtitle="Do download ao primeiro post no ar — em http://localhost/wordpress."
      difficulty="iniciante"
      timeToRead="9 min"
    >
      <h2>Por que rodar WordPress local?</h2>
      <ul>
        <li>Desenvolver e testar plugins/temas sem mexer no site oficial.</li>
        <li>Estudar PHP no projeto open source mais usado do mundo.</li>
        <li>Migrar um site de produção para sua máquina e testar atualizações antes.</li>
        <li>Dar aulas, workshops, treinamentos.</li>
      </ul>

      <h2>1. Baixe o WordPress</h2>
      <p>
        Em{" "}
        <a href="https://br.wordpress.org/download/" target="_blank" rel="noreferrer">
          br.wordpress.org/download
        </a>{" "}
        baixe o ZIP em português. Extraia em{" "}
        <code>C:/xampp/htdocs/wordpress</code>.
      </p>

      <h2>2. Crie o banco no phpMyAdmin</h2>
      <PracticeBox
        title="Criar banco para o WordPress"
        goal="Ter um banco vazio chamado 'wordpress' pronto para o instalador."
        steps={[
          "Garanta que MySQL está rodando no painel",
          "Acesse http://localhost/phpmyadmin",
          "Aba 'Bases de dados' → digite 'wordpress' → cotejamento utf8mb4_unicode_ci → Criar",
        ]}
        verify="O banco 'wordpress' aparece na barra esquerda do phpMyAdmin."
      />

      <h2>3. Rode o instalador do WordPress</h2>
      <p>Acesse no navegador:</p>
      <CodeBlock language="text" code={`http://localhost/wordpress`} />
      <p>O assistente do WordPress abre. Preencha:</p>
      <ul>
        <li><strong>Nome do banco</strong>: wordpress</li>
        <li><strong>Nome de usuário</strong>: root</li>
        <li><strong>Senha</strong>: (vazia, salvo se você definiu)</li>
        <li><strong>Servidor</strong>: localhost (ou 127.0.0.1)</li>
        <li><strong>Prefixo das tabelas</strong>: wp_ (padrão tá ótimo)</li>
      </ul>
      <p>
        Se der erro de "não foi possível escrever wp-config.php", crie você
        mesmo o arquivo:
      </p>
      <CodeBlock language="bash" code={`# Dentro de C:/xampp/htdocs/wordpress
# Renomeie wp-config-sample.php para wp-config.php
# Abra e preencha:`} />
      <CodeBlock title="wp-config.php (trecho)" language="php" code={`define('DB_NAME',     'wordpress');
define('DB_USER',     'root');
define('DB_PASSWORD', '');
define('DB_HOST',     'localhost');
define('DB_CHARSET',  'utf8mb4');
define('DB_COLLATE',  '');

// Habilita debug enquanto desenvolvendo:
define('WP_DEBUG',         true);
define('WP_DEBUG_LOG',     true);
define('WP_DEBUG_DISPLAY', true);

define('WP_HOME',    'http://localhost/wordpress');
define('WP_SITEURL', 'http://localhost/wordpress');`} />

      <h2>4. Defina o admin e entre</h2>
      <p>O assistente pede:</p>
      <ul>
        <li>Título do site</li>
        <li>Nome de usuário (não use "admin" — escolha algo seu)</li>
        <li>Senha forte</li>
        <li>Email</li>
      </ul>
      <p>
        Após criar, faça login em{" "}
        <code>http://localhost/wordpress/wp-admin</code>.
      </p>

      <h2>Configurações do php.ini que o WordPress agradece</h2>
      <CodeBlock language="ini" code={`upload_max_filesize = 64M
post_max_size       = 80M
memory_limit        = 512M
max_execution_time  = 300
max_input_time      = 300
max_input_vars      = 5000

extension=mbstring
extension=gd
extension=intl
extension=zip
extension=curl
extension=openssl
extension=mysqli`} />

      <h2>Permalinks bonitos (URLs amigáveis)</h2>
      <p>
        Vá em <strong>Configurações → Links Permanentes</strong> e escolha
        "Nome do post". Para isso funcionar, você precisa de:
      </p>
      <ul>
        <li><code>mod_rewrite</code> habilitado no Apache (veja <a href="#/apache-modulos">Módulos do Apache</a>).</li>
        <li><code>AllowOverride All</code> em <code>htdocs/wordpress</code> no <code>httpd.conf</code>.</li>
        <li>O arquivo <code>.htaccess</code> da pasta wordpress (o WP cria automaticamente).</li>
      </ul>
      <CodeBlock title="wordpress/.htaccess" language="apache" code={`# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /wordpress/
RewriteRule ^index\\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /wordpress/index.php [L]
</IfModule>
# END WordPress`} />

      <h2>WordPress + Virtual Host (mais profissional)</h2>
      <p>
        Em vez de <code>http://localhost/wordpress</code>, configure um VHost
        para que o site responda em <code>http://meublog.local</code>. Veja{" "}
        <a href="#/virtual-hosts">Virtual Hosts</a>. Não esqueça de atualizar
        <code>WP_HOME</code> e <code>WP_SITEURL</code> no <code>wp-config.php</code>.
      </p>

      <AlertBox type="warning" title="Cuidado ao mover URLs depois">
        Se você instalar em <code>localhost/wordpress</code> e depois mudar
        para <code>meublog.local</code>, todos os links absolutos no banco
        (imagens, posts) continuam apontando para o antigo. Use o plugin{" "}
        <strong>Better Search Replace</strong> para fazer o
        find-and-replace seguro no banco inteiro.
      </AlertBox>

      <h2>Importando um site WordPress de produção</h2>
      <p>O fluxo padrão:</p>
      <ol>
        <li>Plugin <strong>All-in-One WP Migration</strong> (no site online).</li>
        <li>Exportar arquivo <code>.wpress</code> de até ~512MB grátis.</li>
        <li>Instalar WordPress limpo no XAMPP.</li>
        <li>Instalar o mesmo plugin no WP local.</li>
        <li>Importar o <code>.wpress</code>.</li>
      </ol>
      <p>Ou manualmente: copie a pasta <code>wp-content/</code> + dump SQL do banco.</p>
    </PageContainer>
  );
}
