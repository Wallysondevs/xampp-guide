import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function WordPress() {
  return (
    <PageContainer
      title="WordPress no XAMPP — guia completo"
      subtitle="Da pasta vazia ao site rodando. Banco, wp-config.php, pretty permalinks, multisite, plugins, debug, migração para produção."
      difficulty="iniciante"
      timeToRead="14 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        XAMPP instalado com Apache + MariaDB rodando. Acesso ao
        phpMyAdmin (<code>http://localhost/phpmyadmin</code>). Saber criar
        pastas em <code>htdocs/</code>.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>WordPress (WP)</strong> — CMS open source que move ~43% dos
        sites da web. Roda em PHP + MySQL/MariaDB. Mantém-se com plugins e
        temas instaláveis pelo painel admin.
      </p>
      <p>
        <strong>wp-config.php</strong> — arquivo na raiz do site que diz ao
        WordPress qual banco usar, prefixo de tabelas, salts de cookie e
        flags de debug.
      </p>
      <p>
        <strong>wp-content/</strong> — pasta com tudo que <em>você</em>{" "}
        adiciona: temas (<code>themes/</code>), plugins (<code>plugins/</code>)
        e uploads (<code>uploads/</code>). É a pasta sagrada para backup.
      </p>
      <p>
        <strong>Pretty permalinks</strong> — URLs amigáveis (<code>/sobre/</code>{" "}
        em vez de <code>/?p=2</code>). Exigem <code>mod_rewrite</code> +{" "}
        <code>.htaccess</code>.
      </p>

      <h2>1. Baixar e descompactar</h2>
      <ol>
        <li>
          Vá em{" "}
          <a href="https://br.wordpress.org/download/" target="_blank" rel="noreferrer">
            br.wordpress.org/download
          </a>{" "}
          e baixe a versão em PT-BR.
        </li>
        <li>Descompacte em <code>C:/xampp/htdocs/meu-site/</code>.</li>
        <li>
          A pasta deve conter: <code>wp-admin/</code>, <code>wp-content/</code>,{" "}
          <code>wp-includes/</code>, <code>index.php</code>,{" "}
          <code>wp-config-sample.php</code>, <code>readme.html</code>,
          {" "}<code>license.txt</code>, etc.
        </li>
      </ol>

      <h2>2. Criar o banco no phpMyAdmin</h2>
      <PracticeBox
        title="Banco para o WordPress"
        goal="Ter um banco vazio chamado 'meu_site_wp'."
        steps={[
          "Acesse http://localhost/phpmyadmin",
          "Clique em 'Bancos de dados'",
          "Crie 'meu_site_wp' com collation utf8mb4_unicode_ci",
          "(opcional) Crie um usuário 'wp_user' com privilégios SOMENTE neste banco",
        ]}
        verify="O banco aparece na sidebar e está vazio."
      />

      <h2>3. Configurar wp-config.php</h2>
      <p>
        Renomeie <code>wp-config-sample.php</code> para{" "}
        <code>wp-config.php</code> e edite:
      </p>
      <CodeBlock title="C:/xampp/htdocs/meu-site/wp-config.php" language="php" code={`<?php
// ** Banco de dados ** //
define( 'DB_NAME',     'meu_site_wp' );
define( 'DB_USER',     'root' );        // ou 'wp_user' se criou
define( 'DB_PASSWORD', '' );             // vazio se não rodou o security wizard
define( 'DB_HOST',     'localhost' );
define( 'DB_CHARSET',  'utf8mb4' );
define( 'DB_COLLATE',  '' );

// ** Salts ** //
// Gere em https://api.wordpress.org/secret-key/1.1/salt/
define( 'AUTH_KEY',         'cole-aqui-uma-string-de-64-chars' );
define( 'SECURE_AUTH_KEY',  '...' );
define( 'LOGGED_IN_KEY',    '...' );
define( 'NONCE_KEY',        '...' );
define( 'AUTH_SALT',        '...' );
define( 'SECURE_AUTH_SALT', '...' );
define( 'LOGGED_IN_SALT',   '...' );
define( 'NONCE_SALT',       '...' );

// ** Prefixo das tabelas (em produção, prefira algo NÃO 'wp_') ** //
\$table_prefix = 'wp_';

// ** Debug em desenvolvimento ** //
define( 'WP_DEBUG',         true );
define( 'WP_DEBUG_LOG',     true );      // grava em wp-content/debug.log
define( 'WP_DEBUG_DISPLAY', false );     // não vaza erro na tela
define( 'SCRIPT_DEBUG',     true );      // usa CSS/JS não-minificados

// ** URL local ** //
define( 'WP_HOME',    'http://localhost/meu-site' );
define( 'WP_SITEURL', 'http://localhost/meu-site' );

// ** Memória ** //
define( 'WP_MEMORY_LIMIT', '256M' );

if ( ! defined( 'ABSPATH' ) ) {
    define( 'ABSPATH', __DIR__ . '/' );
}
require_once ABSPATH . 'wp-settings.php';`} />

      <AlertBox type="warning" title="Sempre gere salts novos">
        Os salts garantem que cookies de login não sejam previsíveis.
        Use o gerador oficial (link no comentário) — nunca deixe os valores
        de exemplo do <code>wp-config-sample.php</code>.
      </AlertBox>

      <h2>4. Rodar o instalador</h2>
      <ol>
        <li>Acesse <code>http://localhost/meu-site/</code>.</li>
        <li>Escolha o idioma (PT-BR vem padrão se baixou em br.wordpress.org).</li>
        <li>Preencha: Título do site, usuário admin, senha forte, email.</li>
        <li>Clique <strong>Instalar WordPress</strong>.</li>
        <li>Login em <code>http://localhost/meu-site/wp-admin</code>.</li>
      </ol>

      <h2>5. Pretty permalinks (URLs amigáveis)</h2>
      <p>
        Em <em>Configurações → Links permanentes</em>, escolha{" "}
        <strong>"Nome do post"</strong>. O WordPress tenta criar/atualizar o{" "}
        <code>.htaccess</code> automaticamente. Se falhar, cole manualmente:
      </p>
      <CodeBlock title="C:/xampp/htdocs/meu-site/.htaccess" language="apache" code={`# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /meu-site/
RewriteRule ^index\\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /meu-site/index.php [L]
</IfModule>
# END WordPress`} />
      <p>
        Confirme que o <code>mod_rewrite</code> está ativo no Apache (no XAMPP
        já vem habilitado por padrão) e que <code>AllowOverride All</code>{" "}
        está no bloco <code>&lt;Directory&gt;</code> do htdocs (
        <a href="#/htaccess">veja a página sobre .htaccess</a>).
      </p>

      <h2>Estrutura de pastas do WP</h2>
      <ParamsTable
        title="Pastas e arquivos principais"
        params={[
          { flag: "wp-admin/", desc: "Painel administrativo. NÃO edite arquivos aqui — atualizações sobrescrevem." },
          { flag: "wp-includes/", desc: "Núcleo do WordPress. Mesmo princípio: mão fora." },
          { flag: "wp-content/themes/", desc: "Temas instalados. Crie temas filhos aqui para customizar sem perder ao atualizar." },
          { flag: "wp-content/plugins/", desc: "Plugins. Cada subpasta é um plugin." },
          { flag: "wp-content/uploads/", desc: "Imagens e mídias enviadas via Biblioteca de Mídia. Organizada por ano/mês." },
          { flag: "wp-content/languages/", desc: "Arquivos .mo de tradução." },
          { flag: "wp-content/mu-plugins/", desc: "Must-Use plugins — carregados automaticamente, sem aparecer na tela de plugins." },
          { flag: "wp-content/debug.log", desc: "Gerado quando WP_DEBUG_LOG=true. Onde os erros silenciosos aparecem." },
          { flag: "wp-config.php", desc: "Sua configuração. NUNCA committe em repositório público sem mascarar credenciais." },
          { flag: ".htaccess", desc: "Reescritas de URL para pretty permalinks." },
        ]}
      />

      <h2>Trocando o tema</h2>
      <p>
        <em>Aparência → Temas → Adicionar novo</em>. Você pode buscar no
        repositório oficial ou enviar um <code>.zip</code> de tema premium.
        Os temas oficiais (Twenty Twenty-Four, Twenty Twenty-Five) já vêm
        instalados.
      </p>

      <h3>Tema filho (child theme) — o jeito certo de customizar</h3>
      <CodeBlock title="wp-content/themes/twentytwentyfour-child/style.css" language="css" code={`/*
Theme Name:  Twenty Twenty-Four Child
Template:    twentytwentyfour
Version:     1.0
Description: Customizações em cima do TT4
*/`} />
      <CodeBlock title="wp-content/themes/twentytwentyfour-child/functions.php" language="php" code={`<?php
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('child-style',  get_stylesheet_uri(), ['parent-style']);
});`} />

      <h2>Plugins essenciais para começar</h2>
      <ul>
        <li><strong>Yoast SEO</strong> ou <strong>Rank Math</strong> — SEO on-page.</li>
        <li><strong>WP Mail SMTP</strong> — manda email pelo Gmail/Mailgun (no local, configure para o Mercury).</li>
        <li><strong>WPForms Lite</strong> ou <strong>Contact Form 7</strong> — formulários.</li>
        <li><strong>UpdraftPlus</strong> — backup completo automático.</li>
        <li><strong>WP Super Cache</strong> ou <strong>W3 Total Cache</strong> — performance.</li>
        <li><strong>Wordfence</strong> ou <strong>iThemes Security</strong> — segurança.</li>
        <li><strong>Query Monitor</strong> — debug em desenvolvimento.</li>
      </ul>

      <h2>Modo multisite</h2>
      <p>
        Se quer rodar várias redes (subdomínios ou subpastas) em uma única
        instalação, ative o multisite. Adicione ao{" "}
        <code>wp-config.php</code> antes da linha <em>"Pronto, pare de editar"</em>:
      </p>
      <CodeBlock language="php" code={`define( 'WP_ALLOW_MULTISITE', true );`} />
      <p>
        Salve, abra <em>Ferramentas → Configuração de Rede</em>, escolha
        subpastas (mais fácil em local) e finalize. O wizard adiciona mais
        linhas ao <code>wp-config.php</code> e ao <code>.htaccess</code>.
      </p>

      <h2>Debug — encontrando o erro</h2>
      <p>Com debug ligado (já fizemos), os erros vão para:</p>
      <CodeBlock language="text" code={`C:/xampp/htdocs/meu-site/wp-content/debug.log`} />
      <p>
        Em desenvolvimento ative também o <strong>Query Monitor</strong>:
        ele coloca uma barra no topo do site mostrando todas as queries SQL
        executadas, hooks, requisições HTTP, ganchos e tempo de cada plugin.
      </p>

      <h2>Email no local com Mercury</h2>
      <p>
        Sem configurar nada, o <code>wp_mail()</code> tenta usar a função
        nativa <code>mail()</code> do PHP — que no XAMPP fica desligada por
        padrão. Use <strong>WP Mail SMTP</strong> configurado para Mercury:
      </p>
      <CodeBlock language="text" code={`Host: localhost
Porta: 25
Criptografia: nenhuma
Autenticação: não
Remetente: dev@localhost`} />
      <p>
        Veja o capítulo <a href="#/mercury">Mercury Mail</a> para como
        habilitar Mercury e ver as caixas de entrada.
      </p>

      <h2>Migrar para produção</h2>
      <ol>
        <li>
          No phpMyAdmin: exporte o banco do site local (formato SQL).
        </li>
        <li>Compacte a pasta <code>meu-site/</code> em .zip.</li>
        <li>
          Edite o .sql e troque <code>http://localhost/meu-site</code> por{" "}
          <code>https://meusite.com</code>. Ou use o plugin{" "}
          <strong>Better Search Replace</strong> após subir.
        </li>
        <li>
          Suba o zip e o .sql para a hospedagem. Importe o .sql via cPanel
          ou linha de comando.
        </li>
        <li>
          Crie o banco e usuário em produção. Edite o{" "}
          <code>wp-config.php</code> com as credenciais novas.
        </li>
        <li>
          Defina <code>WP_HOME</code> e <code>WP_SITEURL</code> para o
          domínio definitivo.
        </li>
        <li>
          Em produção, mude para{" "}
          <code>WP_DEBUG = false</code> e remova o <code>debug.log</code>.
        </li>
        <li>Ajuste permissões: pastas 755, arquivos 644, wp-config 600.</li>
      </ol>

      <AlertBox type="info" title="Atalho: All-in-One WP Migration">
        Plugin que exporta tudo (banco + arquivos) num único .wpress e
        importa do outro lado. Versão grátis tem limite de tamanho — para
        sites maiores, use o método manual acima.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li>
          <strong>"Erro ao estabelecer conexão com o banco"</strong> →
          credenciais erradas no <code>wp-config.php</code> ou MariaDB
          parado no painel.
        </li>
        <li>
          <strong>"White screen of death"</strong> → erro fatal de PHP. Ative
          <code>WP_DEBUG</code> e leia <code>wp-content/debug.log</code>.
        </li>
        <li>
          <strong>"Briefly unavailable for scheduled maintenance"</strong> →
          atualização travou. Apague o arquivo <code>.maintenance</code> da
          raiz.
        </li>
        <li>
          <strong>404 em todas as páginas após mudar permalinks</strong> →
          falta o <code>mod_rewrite</code> ou{" "}
          <code>AllowOverride All</code>.
        </li>
        <li>
          <strong>"You do not have sufficient permissions to access this page"</strong>
          → cookie corrompido. Limpe cookies do navegador para localhost.
        </li>
      </ul>

      <AlertBox type="success" title="Pronto para o próximo passo">
        Rodando o WordPress local? Estude também{" "}
        <a href="#/laravel">Laravel</a>,{" "}
        <a href="#/composer">Composer</a> e{" "}
        <a href="#/migrar-producao">Migrar para produção</a>.
      </AlertBox>
    </PageContainer>
  );
}
