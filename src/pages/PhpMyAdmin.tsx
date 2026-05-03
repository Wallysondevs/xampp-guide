import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function PhpMyAdmin() {
  return (
    <PageContainer
      title="phpMyAdmin — banco de dados pelo navegador"
      subtitle="Crie bancos, edite tabelas, importe dumps e rode SQL — tudo numa interface gráfica vinda dentro do XAMPP."
      difficulty="iniciante"
      timeToRead="7 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Apache e MySQL/MariaDB rodando no painel do XAMPP (ambos com nome em
        verde). Se algum estiver vermelho, volte ao capítulo de{" "}
        <a href="#/portas-conflitos">conflitos de portas</a>.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>SGBD</strong> (Sistema Gerenciador de Banco de Dados) — o
        software que armazena e organiza os dados. MariaDB e MySQL são SGBDs.
        O phpMyAdmin <em>não</em> é um banco — é só uma <strong>interface
        web</strong> para conversar com o banco.
      </p>
      <p>
        <strong>Schema</strong> / <strong>Database</strong> — é o "container"
        que agrupa tabelas relacionadas. Cada projeto seu (loja, blog, sistema
        da faculdade) costuma ter o próprio database.
      </p>
      <p>
        <strong>Dump</strong> — arquivo <code>.sql</code> com todos os
        comandos necessários para recriar um banco (CREATE TABLE, INSERT...).
        Exportar o banco gera um dump; importar executa os comandos do dump.
      </p>

      <h2>Acessando</h2>
      <p>
        Com Apache e MySQL ligados no painel, abra:
      </p>
      <CodeBlock language="text" code={`http://localhost/phpmyadmin
http://localhost/phpmyadmin/`} />
      <p>
        A interface abre direto, sem pedir senha (porque a senha do{" "}
        <strong>root</strong> está vazia por padrão — falamos disso em{" "}
        <a href="#/mysql-senha-root">Senha do root</a>).
      </p>

      <h2>Anatomia da tela</h2>
      <ul>
        <li>
          <strong>Barra esquerda</strong>: lista de bancos (databases). Clique
          para expandir e ver as tabelas.
        </li>
        <li>
          <strong>Abas no topo</strong>: Bases de dados, SQL, Estado, Contas
          de usuários, Exportar, Importar, Configurações, Mais...
        </li>
        <li>
          <strong>Centro</strong>: o conteúdo da seção/tabela atual.
        </li>
      </ul>

      <h2>Criando um banco</h2>
      <PracticeBox
        title="Criar banco e tabela pela primeira vez"
        goal="Ter um banco 'loja' com uma tabela 'produtos' funcional."
        steps={[
          "Clique na aba 'Bases de dados' no topo",
          "Em 'Criar base de dados', digite: loja",
          "No menu de cotejamento, escolha utf8mb4_unicode_ci",
          "Clique em 'Criar'",
          "Na barra esquerda, clique em 'loja'",
          "Em 'Criar tabela', digite: produtos. Número de colunas: 4. Clique 'Criar'",
          "Configure as colunas: id (INT, AUTO_INCREMENT, primária), nome (VARCHAR 200), preco (DECIMAL 10,2), criado_em (DATETIME, default CURRENT_TIMESTAMP)",
          "Clique em 'Salvar'",
        ]}
        verify="A tabela 'produtos' aparece com 4 colunas. Você pode clicar em 'Inserir' e adicionar uma linha para testar."
      />

      <h2>Conectando do PHP</h2>
      <CodeBlock title="conexao.php" language="php" code={`<?php
$host = '127.0.0.1';
$db   = 'loja';
$user = 'root';
$pass = '';        // senha vazia, padrão do XAMPP
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$opcoes = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $opcoes);
    echo "Conectado!";
} catch (PDOException $e) {
    die("Falha na conexão: " . $e->getMessage());
}`} />

      <h2>Importando um dump SQL</h2>
      <p>
        Recebeu um arquivo <code>.sql</code>? Importe assim:
      </p>
      <ol>
        <li>Selecione o banco na barra esquerda (ou crie um novo).</li>
        <li>Clique na aba <strong>Importar</strong> no topo.</li>
        <li>Em "Arquivo a importar", clique em <em>Procurar</em> e escolha o .sql.</li>
        <li>Em "Formato", deixe SQL.</li>
        <li>Clique em <strong>Importar</strong> no fim da página.</li>
      </ol>

      <AlertBox type="warning" title="Dump muito grande?">
        O upload do phpMyAdmin é limitado pelo PHP (
        <code>upload_max_filesize</code> e <code>post_max_size</code> no
        <code>php.ini</code>). Para dumps acima de ~50 MB, use o terminal:
        <CodeBlock language="bash" code={`C:/xampp/mysql/bin/mysql.exe -u root loja < dump_grande.sql`} />
      </AlertBox>

      <h2>Exportando um banco</h2>
      <ol>
        <li>Clique no banco na barra esquerda.</li>
        <li>Aba <strong>Exportar</strong>.</li>
        <li>Método: <em>Rápido</em> (já vem bom). Formato: SQL.</li>
        <li>Clique em <strong>Exportar</strong> e salve o arquivo.</li>
      </ol>
      <p>O arquivo gerado é um SQL completo: estrutura + dados, importável em qualquer outro MySQL/MariaDB.</p>

      <h2>SQL ad-hoc</h2>
      <p>
        Aba <strong>SQL</strong> (no banco ou em uma tabela) abre um editor.
        Cole qualquer comando e execute:
      </p>
      <CodeBlock language="sql" code={`-- Listar tabelas com tamanho
SELECT table_name, ROUND(data_length/1024/1024, 2) AS mb
FROM information_schema.tables
WHERE table_schema = 'loja'
ORDER BY mb DESC;

-- Ver as 10 últimas linhas da tabela
SELECT * FROM produtos ORDER BY id DESC LIMIT 10;

-- Limpar uma tabela inteira
TRUNCATE TABLE produtos;`} />

      <h2>Erros comuns</h2>
      <ul>
        <li>
          <strong>"#1045 - Access denied for user 'root'@'localhost'"</strong>{" "}
          — você definiu uma senha pro root e o phpMyAdmin não sabe. Veja{" "}
          <a href="#/mysql-senha-root">Senha do root</a>.
        </li>
        <li>
          <strong>"#2002 - Não foi possível conectar"</strong> — o MySQL não
          está rodando no painel, ou a porta foi mudada.
        </li>
        <li>
          <strong>"O conteúdo da página foi muito grande"</strong> — sua
          query devolveu milhares de linhas. Adicione <code>LIMIT 100</code>.
        </li>
        <li>
          <strong>Caracteres bagunçados (Ã©, Ã£)</strong> — incompatibilidade de
          charset. Configure tudo como <code>utf8mb4</code>.
        </li>
      </ul>
    </PageContainer>
  );
}
