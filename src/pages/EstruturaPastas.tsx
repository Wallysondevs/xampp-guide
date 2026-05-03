import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function EstruturaPastas() {
  return (
    <PageContainer
      title="Pastas do XAMPP e o htdocs"
      subtitle="Onde tudo mora — htdocs, php, apache, mysql, phpMyAdmin, logs. Mapa completo do que cada pasta faz e onde você vai mexer no dia a dia."
      difficulty="iniciante"
      timeToRead="8 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Saber abrir o Explorer/Finder/Files na pasta de instalação do XAMPP
        (<code>C:/xampp</code>, <code>/opt/lampp</code> ou{" "}
        <code>/Applications/XAMPP</code>).
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>htdocs</strong> — nome histórico (vem do Apache no início
        dos anos 90) para "HyperText Documents". É a raiz pública do
        servidor: tudo lá dentro é acessível por <code>http://localhost</code>.
      </p>
      <p>
        <strong>DocumentRoot</strong> — diretiva do Apache que aponta para a
        pasta raiz pública. No XAMPP, o DocumentRoot padrão é{" "}
        <code>htdocs</code>.
      </p>
      <p>
        <strong>vendor/</strong> — pasta criada pelo Composer com todas as
        dependências do projeto. Sempre fica <em>fora</em> do que vai para o
        Git.
      </p>

      <h2>Mapa raiz da instalação</h2>
      <ParamsTable
        title="Pastas de primeiro nível em C:/xampp (ou /opt/lampp)"
        params={[
          { flag: "htdocs/", desc: "RAIZ DOS SEUS PROJETOS. Tudo aqui é servido em http://localhost. É AQUI que você vai trabalhar 99% do tempo." },
          { flag: "apache/", desc: "Binários e configurações do Apache. apache/conf/httpd.conf é o coração; apache/logs/ tem error.log e access.log; apache/bin/ tem o httpd.exe." },
          { flag: "php/", desc: "Binário do PHP, php.ini e extensões. php/php.ini controla todo comportamento da linguagem." },
          { flag: "mysql/", desc: "MariaDB (apesar do nome). mysql/data/ guarda os bancos (NÃO copie cru!). mysql/bin/ tem mysql, mysqldump, my.ini." },
          { flag: "phpMyAdmin/", desc: "App web do phpMyAdmin. config.inc.php aqui dentro guarda credenciais." },
          { flag: "perl/", desc: "Interpretador Perl. Quase ninguém mexe — fica aí por compatibilidade." },
          { flag: "tomcat/", desc: "Apache Tomcat (Java servlets), só se você marcou na instalação." },
          { flag: "MercuryMail/", desc: "Servidor SMTP/POP3/IMAP local. Caixas em MercuryMail/MAIL/<usuario>/." },
          { flag: "FileZillaFTP/", desc: "Servidor FTP/SFTP, raramente usado em dev local." },
          { flag: "anonymous/", desc: "Pasta padrão para FTP anônimo do FileZilla." },
          { flag: "tmp/", desc: "Arquivos temporários do PHP (uploads em curso, sessões se file_handler)." },
          { flag: "contrib/", desc: "Documentação extra, scripts auxiliares (Add-on Installer, etc)." },
          { flag: "licenses/", desc: "Licenças de cada software incluso. Pode ler, mas não tem por que mexer." },
          { flag: "install/", desc: "Logs e scripts da instalação." },
          { flag: "xampp-control.exe", desc: "O painel de controle (Windows). Só dar duplo-clique." },
          { flag: "xampp_start.exe / xampp_stop.exe", desc: "Iniciar/parar tudo via linha de comando, sem abrir o painel." },
        ]}
      />

      <h2>Foco no htdocs</h2>
      <p>
        A pasta <code>htdocs</code> é a raiz pública. Qualquer arquivo ou
        subpasta é acessível pelo navegador. Por padrão ela já vem com:
      </p>
      <CodeBlock language="text" code={`htdocs/
├── dashboard/        ← a página laranja "Welcome to XAMPP"
├── img/              ← imagens do dashboard
├── webalizer/        ← gerador de relatórios web (raramente usado)
├── xampp/            ← ferramentas internas (security check, status)
├── applications.html ← lista de apps "Bitnami" sugeridos
├── favicon.ico
└── index.php         ← redireciona para /dashboard/`} />

      <h2>Mapeamento URL → arquivo</h2>
      <p>Sem complicação: a URL espelha o caminho dentro do htdocs.</p>
      <ParamsTable
        title="Como o Apache traduz URL em arquivo"
        params={[
          { flag: "http://localhost/", desc: "Carrega htdocs/index.php (ou index.html, conforme DirectoryIndex)." },
          { flag: "http://localhost/produtos.php", desc: "Carrega htdocs/produtos.php." },
          { flag: "http://localhost/loja/", desc: "Carrega htdocs/loja/index.php." },
          { flag: "http://localhost/loja/login.php", desc: "Carrega htdocs/loja/login.php." },
          { flag: "http://localhost/imagens/logo.png", desc: "Serve estaticamente htdocs/imagens/logo.png." },
        ]}
      />

      <h2>Criando seu primeiro projeto</h2>
      <PracticeBox
        title="Hello World em PHP"
        goal="Ver uma mensagem em PHP rodando no XAMPP."
        steps={[
          "Abra o Explorer/Finder em C:/xampp/htdocs",
          "Crie uma pasta meu-projeto",
          "Dentro, crie index.php com o código abaixo",
          "Acesse http://localhost/meu-projeto/ no navegador",
        ]}
        verify="A página mostra 'Olá, XAMPP!' e a versão do PHP."
      />
      <CodeBlock title="htdocs/meu-projeto/index.php" language="php" code={`<?php
echo '<h1>Olá, XAMPP!</h1>';
echo '<p>Versão do PHP: ' . phpversion() . '</p>';
echo '<p>Hora do servidor: ' . date('d/m/Y H:i:s') . '</p>';`} />

      <h2>Movendo o htdocs para outro disco</h2>
      <p>
        Não cabe tudo no <code>C:/</code>? Você pode mudar o DocumentRoot para
        outro disco editando o <code>httpd.conf</code>:
      </p>
      <CodeBlock language="apache" code={`# apache/conf/httpd.conf
DocumentRoot "D:/dev/htdocs"

<Directory "D:/dev/htdocs">
    Options Indexes FollowSymLinks Includes ExecCGI
    AllowOverride All
    Require all granted
</Directory>`} />
      <p>
        Reinicie o Apache. Daí pra frente, <code>http://localhost</code>
        serve do novo caminho.
      </p>

      <h2>O que NÃO pode ir no htdocs</h2>
      <AlertBox type="danger" title="Cuidado com o que você joga lá">
        Tudo no htdocs é público. Nunca coloque ali:
        <ul>
          <li>Arquivos <code>.env</code> com senhas (bloqueie via .htaccess se tiver que ficar lá).</li>
          <li>Backups de banco (<code>dump.sql</code>) — mina de ouro para invasor.</li>
          <li>Pastas <code>.git</code> — alguém pode baixar todo seu código.</li>
          <li>Arquivos de configuração com tokens de API.</li>
          <li>Logs com dados sensíveis.</li>
        </ul>
      </AlertBox>

      <h2>Pastas que mais vão aparecer pra você editar</h2>
      <ParamsTable
        title="Top 5 pastas/arquivos que você vai abrir no editor"
        params={[
          { flag: "htdocs/<seu-projeto>/", desc: "Onde fica seu código — diariamente." },
          { flag: "apache/conf/httpd.conf", desc: "Mexer em DocumentRoot, módulos, includes." },
          { flag: "apache/conf/extra/httpd-vhosts.conf", desc: "Adicionar virtual hosts." },
          { flag: "php/php.ini", desc: "Habilitar extensões, mudar memory_limit, upload_max_filesize." },
          { flag: "apache/logs/error.log", desc: "Diagnóstico de qualquer problema do Apache/PHP." },
        ]}
      />

      <AlertBox type="success" title="Resumo">
        <code>htdocs/</code> é a sua área de trabalho. Os outros diretórios
        existem para deixar o stack rodando — você só mexe neles para
        configurar (raramente). Cuide bem do que coloca em htdocs e proteja
        arquivos sensíveis com .htaccess.
      </AlertBox>
    </PageContainer>
  );
}
