import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function MysqlSenhaRoot() {
  return (
    <PageContainer
      title="Definindo a senha do root no MySQL"
      subtitle="Por que o XAMPP entrega senha vazia, e como mudar isso (sem quebrar o phpMyAdmin)."
      difficulty="intermediario"
      timeToRead="6 min"
    >
      <AlertBox type="warning" title="Atenção: já vou bagunçar tudo?">
        Se você só estuda local, deixar a senha em branco é OK. Não precisa
        criar senha "para boas práticas" se não vai expor o XAMPP à internet.
        Se for criar senha, faça do jeito certo — esqueceu de avisar o
        phpMyAdmin? Ele vai parar de abrir.
      </AlertBox>

      <h2>1. Mudar a senha pelo phpMyAdmin</h2>
      <PracticeBox
        title="Definir senha de root pelo phpMyAdmin"
        goal="Mudar a senha do usuário root@localhost com a interface gráfica."
        steps={[
          "Abra http://localhost/phpmyadmin",
          "Clique na aba 'Contas de usuários' no topo",
          "Encontre a linha do usuário 'root' / Host 'localhost'",
          "Clique em 'Editar privilégios' nesta linha",
          "No topo da página, clique em 'Mudar senha'",
          "Digite uma senha forte e clique em 'Executar'",
        ]}
        verify="Aparece a mensagem 'A senha foi alterada para...'."
      />

      <h2>2. Avise o phpMyAdmin sobre a nova senha</h2>
      <p>
        Logo depois do passo 1, o phpMyAdmin vai dar erro 1045 ao recarregar.
        É porque ele tenta conectar com a senha antiga (vazia). Edite{" "}
        <code>C:/xampp/phpMyAdmin/config.inc.php</code>:
      </p>
      <CodeBlock language="php" code={`/* Authentication type and info */
$cfg['Servers'][$i]['auth_type']     = 'config';
$cfg['Servers'][$i]['user']          = 'root';
$cfg['Servers'][$i]['password']      = 'sua_senha_aqui';   // ← preencha
$cfg['Servers'][$i]['extension']     = 'mysqli';
$cfg['Servers'][$i]['AllowNoPassword'] = false;            // ← agora false`} />
      <p>Salve o arquivo. Recarregue o phpMyAdmin — ele entra normalmente.</p>

      <AlertBox type="info" title="Mais seguro: auth_type = 'cookie'">
        Em vez de salvar a senha no <code>config.inc.php</code>, use{" "}
        <code>auth_type = 'cookie'</code>. O phpMyAdmin pedirá login na tela
        e guardará o token só na sessão do navegador.
        <CodeBlock language="php" code={`$cfg['Servers'][$i]['auth_type']  = 'cookie';
$cfg['Servers'][$i]['user']       = '';
$cfg['Servers'][$i]['password']   = '';
$cfg['blowfish_secret']           = 'qualquer_string_aleatoria_de_32+_chars';`} />
      </AlertBox>

      <h2>3. Esqueci a senha do root!</h2>
      <p>
        Acontece. A maneira oficial é parar o MySQL e iniciar em modo
        "skip-grant-tables" (sem autenticação):
      </p>
      <CodeBlock language="bash" code={`# 1. Pare o MySQL pelo painel

# 2. Abra um terminal como admin e rode:
C:/xampp/mysql/bin/mysqld --console --skip-grant-tables --skip-external-locking

# 3. Em OUTRA janela do terminal, conecte sem senha:
C:/xampp/mysql/bin/mysql -u root

# 4. Defina a senha nova:
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'nova_senha_aqui';
FLUSH PRIVILEGES;
EXIT;

# 5. Pare o mysqld da primeira janela (Ctrl+C) e inicie normal pelo painel`} />

      <h2>4. Criar usuário separado (recomendado para projetos)</h2>
      <p>
        Em vez de o seu projeto usar o <code>root</code>, crie um usuário
        dedicado com acesso só ao banco que precisa:
      </p>
      <CodeBlock language="sql" code={`-- Criar usuário e dar acesso apenas ao banco 'loja'
CREATE USER 'loja_app'@'localhost' IDENTIFIED BY 'senha_da_loja';

GRANT SELECT, INSERT, UPDATE, DELETE
    ON loja.*
    TO 'loja_app'@'localhost';

FLUSH PRIVILEGES;

-- Conferir
SHOW GRANTS FOR 'loja_app'@'localhost';`} />

      <p>No PHP:</p>
      <CodeBlock language="php" code={`<?php
$pdo = new PDO(
    'mysql:host=127.0.0.1;dbname=loja;charset=utf8mb4',
    'loja_app',
    'senha_da_loja'
);`} />

      <h2>Senha em ambiente real</h2>
      <p>
        Em produção, a senha do banco <strong>nunca</strong> vai no código —
        ela vai no <code>.env</code>:
      </p>
      <CodeBlock language="bash" code={`# .env (na raiz do projeto)
DB_HOST=127.0.0.1
DB_NAME=loja
DB_USER=loja_app
DB_PASS=senha_super_forte_e_unica_aqui`} />

      <p>
        Para ler no PHP, use <code>vlucas/phpdotenv</code> (via Composer) ou
        leia direto se for um projeto pequeno:
      </p>
      <CodeBlock language="php" code={`<?php
$env = parse_ini_file(__DIR__ . '/.env');
$pdo = new PDO(
    "mysql:host={$env['DB_HOST']};dbname={$env['DB_NAME']};charset=utf8mb4",
    $env['DB_USER'],
    $env['DB_PASS']
);`} />

      <AlertBox type="danger" title="Nunca commite .env">
        Coloque <code>.env</code> no <code>.gitignore</code>. Se já commitou
        com senha, troque a senha imediatamente.
      </AlertBox>
    </PageContainer>
  );
}
