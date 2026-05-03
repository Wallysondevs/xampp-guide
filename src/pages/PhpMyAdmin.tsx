import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function PhpMyAdmin() {
  return (
    <PageContainer
      title="phpMyAdmin no XAMPP"
      subtitle="A interface web para gerenciar o MariaDB. Login, criar bancos, importar/exportar, executar SQL, gerenciar usuários e proteger a tela contra acesso indevido."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        XAMPP instalado com Apache + MariaDB rodando. Ter feito (ou não) o
        wizard de segurança — o comportamento do login muda nos dois
        cenários, vamos cobrir os dois.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>phpMyAdmin</strong> — aplicação PHP web que controla o
        MySQL/MariaDB sem você precisar lembrar de SQL. Foi criada em 1998 e
        é o painel mais usado no mundo PHP.
      </p>
      <p>
        <strong>Banco de dados</strong> — coleção de tabelas. Em MariaDB,
        cada projeto costuma ter seu próprio banco (ex.: <code>loja</code>,
        {" "}<code>blog</code>, <code>laravel_app</code>).
      </p>
      <p>
        <strong>Engine</strong> — mecanismo de armazenamento da tabela.{" "}
        <code>InnoDB</code> (transacional, com foreign keys) é o padrão
        moderno.<code>MyISAM</code> (mais antigo, sem transações) ainda
        aparece em códigos legados.
      </p>
      <p>
        <strong>Charset</strong> — codificação de caracteres. Use sempre{" "}
        <code>utf8mb4</code> para suportar emojis e acentos sem problema.
      </p>

      <h2>Acessar pela primeira vez</h2>
      <ol>
        <li>Inicie Apache + MySQL no painel.</li>
        <li>
          Acesse{" "}
          <code>http://localhost/phpmyadmin</code> ou clique em{" "}
          <strong>Admin</strong> ao lado do MySQL no painel.
        </li>
        <li>
          <strong>Sem wizard de segurança</strong>: usuário <code>root</code>{" "}
          e senha em branco — entra direto.
        </li>
        <li>
          <strong>Após wizard de segurança</strong>: usuário{" "}
          <code>root</code> e a senha que você definiu. Se trocar a senha
          do MySQL pelo prompt e o phpMyAdmin parar de logar, atualize o
          arquivo de config (próxima seção).
        </li>
      </ol>

      <h2>Anatomia da tela</h2>
      <ParamsTable
        title="Áreas principais"
        params={[
          { flag: "Sidebar esquerda", desc: "Lista de bancos. Clicar em um expande as tabelas. O 'information_schema' é metadados — não mexa." },
          { flag: "Tab Bancos", desc: "Cria/dropa bancos." },
          { flag: "Tab SQL", desc: "Executa qualquer query digitada." },
          { flag: "Tab Estado", desc: "Ver estatísticas do servidor (queries por segundo, conexões, cache)." },
          { flag: "Tab Contas de usuário", desc: "Gerencia usuários do MariaDB e seus privilégios." },
          { flag: "Tab Exportar / Importar", desc: "Backups (.sql, .csv, .zip, .gz). Veja o capítulo dedicado em /mysql-backup." },
          { flag: "Tab Configurações", desc: "Personalização visual (tema, cor, idioma)." },
          { flag: "Tab Replicação", desc: "Master-slave (raramente usado em local)." },
        ]}
      />

      <h2>Criar um banco do zero</h2>
      <PracticeBox
        title="Criar o banco 'loja'"
        goal="Ter um banco vazio para começar a trabalhar."
        steps={[
          "Clique na aba 'Bancos de dados'",
          "Em 'Criar banco de dados', digite: loja",
          "Selecione collation 'utf8mb4_unicode_ci' (suporta emoji e acentos)",
          "Clique em 'Criar'",
        ]}
        verify="O banco 'loja' aparece na sidebar esquerda."
      />

      <h2>Criar uma tabela</h2>
      <CodeBlock language="sql" code={`CREATE TABLE produtos (
    id          INT          AUTO_INCREMENT PRIMARY KEY,
    nome        VARCHAR(120) NOT NULL,
    preco       DECIMAL(10,2) NOT NULL,
    estoque     INT          NOT NULL DEFAULT 0,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`} />
      <p>
        Cole na aba <strong>SQL</strong> e clique <strong>Executar</strong>.
        Você verá a tabela aparecer na sidebar.
      </p>

      <h2>Inserir, alterar e remover dados pela GUI</h2>
      <ul>
        <li>
          <strong>Inserir</strong> — abra a tabela → aba <em>Inserir</em> →
          preencha os campos e <em>Executar</em>.
        </li>
        <li>
          <strong>Procurar</strong> → aba <em>Procurar</em>. Lista todos os
          registros com paginação.
        </li>
        <li>
          <strong>Editar</strong> → ícone de lápis ao lado do registro.
        </li>
        <li>
          <strong>Excluir</strong> → ícone X. Pede confirmação.
        </li>
      </ul>

      <h2>Importar um .sql</h2>
      <ol>
        <li>Selecione o banco destino na sidebar.</li>
        <li>Aba <strong>Importar</strong>.</li>
        <li>"Procurar" → selecione o arquivo .sql.</li>
        <li>"Formato": SQL.</li>
        <li>Botão "Importar" no fim da página.</li>
      </ol>
      <AlertBox type="warning" title="Arquivo grande dá erro de upload">
        phpMyAdmin respeita o <code>upload_max_filesize</code> e{" "}
        <code>post_max_size</code> do <code>php.ini</code>. Para arquivos
        acima de ~50 MB, prefira <code>mysql -u root -p loja &lt; arquivo.sql</code>{" "}
        no terminal — bem mais rápido e sem timeout.
      </AlertBox>

      <h2>Executar SQL avançado</h2>
      <p>
        A aba <strong>SQL</strong> aceita qualquer query, inclusive
        múltiplas separadas por <code>;</code>. Útil para:
      </p>
      <CodeBlock language="sql" code={`-- Criar índice
CREATE INDEX idx_produtos_nome ON produtos(nome);

-- Update em massa
UPDATE produtos SET preco = preco * 1.10 WHERE estoque > 0;

-- Listar tamanho de cada banco
SELECT
    table_schema AS 'Banco',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Tamanho (MB)'
FROM information_schema.tables
GROUP BY table_schema;

-- Top 10 tabelas mais pesadas
SELECT
    table_schema AS 'Banco',
    table_name AS 'Tabela',
    ROUND((data_length + index_length) / 1024 / 1024, 2) AS 'MB'
FROM information_schema.tables
ORDER BY (data_length + index_length) DESC
LIMIT 10;`} />

      <h2>Criar um usuário (não use root nas suas apps)</h2>
      <p>
        O <code>root</code> é todo-poderoso. Para sua aplicação, crie um
        usuário com privilégios só do banco que ela precisa:
      </p>
      <CodeBlock language="sql" code={`CREATE USER 'loja_user'@'localhost' IDENTIFIED BY 'senha-forte-aqui';

GRANT SELECT, INSERT, UPDATE, DELETE ON loja.* TO 'loja_user'@'localhost';

-- (opcional) DDL também:
GRANT CREATE, ALTER, DROP, INDEX, REFERENCES ON loja.* TO 'loja_user'@'localhost';

FLUSH PRIVILEGES;`} />
      <p>Daí no <code>.env</code> da sua app:</p>
      <CodeBlock language="env" code={`DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=loja
DB_USERNAME=loja_user
DB_PASSWORD=senha-forte-aqui`} />

      <h2>Onde mora a configuração</h2>
      <ParamsTable
        title="Arquivos relevantes"
        params={[
          { flag: "phpMyAdmin/config.inc.php", desc: "Configuração principal — host, usuário, senha do MariaDB, blowfish_secret (cookie auth), idioma padrão." },
          { flag: "phpMyAdmin/themes/", desc: "Temas. O 'pmahomme' é o padrão moderno; 'metro' (azul) também é popular." },
          { flag: "apache/conf/extra/httpd-xampp.conf", desc: "Aliases e regras de acesso. É AQUI que você restringe quem pode abrir /phpmyadmin." },
        ]}
      />

      <h2>Atualizar a senha de root no config</h2>
      <p>
        Se você trocou a senha do <code>root</code> do MariaDB pelo terminal
        e o phpMyAdmin parou de logar:
      </p>
      <CodeBlock title="phpMyAdmin/config.inc.php" language="php" code={`<?php
$cfg['blowfish_secret'] = 'frase-aleatoria-de-32-chars-aqui';

$i = 0;
$i++;

$cfg['Servers'][\$i]['auth_type']  = 'cookie';        // 'config' = login automático; 'cookie' = pede senha
$cfg['Servers'][\$i]['host']       = 'localhost';
$cfg['Servers'][\$i]['user']       = 'root';
$cfg['Servers'][\$i]['password']   = 'NOVA-SENHA-AQUI';
$cfg['Servers'][\$i]['extension']  = 'mysqli';
$cfg['Servers'][\$i]['AllowNoPassword'] = false;       // não aceita senha vazia (mais seguro)`} />

      <h2>Restringindo o acesso ao phpMyAdmin</h2>
      <AlertBox type="danger" title="Por padrão, qualquer um na sua rede local pode acessar">
        Se você roda XAMPP em um notebook num café com Wi-Fi público, todo
        mundo na rede pode abrir <code>http://SEU-IP/phpmyadmin</code>.
        Restrinja imediatamente.
      </AlertBox>
      <p>
        Edite <code>apache/conf/extra/httpd-xampp.conf</code> e procure pelo
        bloco <code>&lt;Directory ".../phpMyAdmin"&gt;</code>. Substitua por:
      </p>
      <CodeBlock language="apache" code={`<Directory "C:/xampp/phpMyAdmin">
    AllowOverride AuthConfig
    Require local
    ErrorDocument 403 /error/HTTP_FORBIDDEN.html
</Directory>`} />
      <p>
        <code>Require local</code> só aceita conexões da própria máquina
        (127.0.0.1). Reinicie o Apache.
      </p>

      <h2>Trocar idioma para PT-BR</h2>
      <p>
        No canto superior direito da tela inicial, clique em{" "}
        <em>Language</em> e escolha <em>Português - Brasil</em>. Para
        deixar fixo:
      </p>
      <CodeBlock title="phpMyAdmin/config.inc.php" language="php" code={`$cfg['Lang'] = 'pt_BR';
$cfg['DefaultLang'] = 'pt_BR';`} />

      <h2>Erros comuns no phpMyAdmin</h2>
      <ul>
        <li>
          <strong>"#1045 Access denied for user 'root'@'localhost'"</strong>{" "}
          → senha errada. Edite <code>config.inc.php</code> ou redefina a
          senha do MariaDB (veja <a href="#/mysql-senha-root">Senha do root</a>).
        </li>
        <li>
          <strong>"The mbstring extension is missing"</strong> → habilite{" "}
          <code>extension=mbstring</code> no <code>php.ini</code>.
        </li>
        <li>
          <strong>"Cannot start session"</strong> → permissão na pasta de
          sessão (<code>tmp/</code>) ou tema do phpMyAdmin quebrado.
        </li>
        <li>
          <strong>"Wrong permissions on configuration file"</strong> (Linux)
          → <code>chmod 644 phpMyAdmin/config.inc.php</code>.
        </li>
      </ul>

      <AlertBox type="success" title="Próximos passos">
        <ul>
          <li><a href="#/mysql-senha-root">Trocar/recuperar a senha do root</a></li>
          <li><a href="#/mysql-backup">Backup e restore com mysqldump</a></li>
          <li><a href="#/seguranca">Hardening completo</a></li>
        </ul>
      </AlertBox>
    </PageContainer>
  );
}
