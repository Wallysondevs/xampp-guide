import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function OQueEXampp() {
  return (
    <PageContainer
      title="O que é o XAMPP"
      subtitle="Um pacote completo de servidor web para desenvolvimento local — Apache, MariaDB, PHP e Perl, em um único instalador."
      difficulty="iniciante"
      timeToRead="6 min"
    >
      <h2>O nome XAMPP, letra por letra</h2>
      <p>
        XAMPP é um acrônimo. Cada letra representa um software que vem dentro
        do pacote:
      </p>

      <ParamsTable
        title="O significado de cada letra do XAMPP"
        params={[
          { flag: "X", desc: "Cross-platform — funciona em Windows, Linux e macOS, com a mesma interface e os mesmos arquivos." },
          { flag: "A", desc: "Apache — o servidor web mais usado no mundo. Recebe requisições HTTP e devolve páginas." },
          { flag: "M", desc: "MariaDB (antes era MySQL). Banco de dados relacional onde sua aplicação guarda usuários, posts, pedidos, etc." },
          { flag: "P", desc: "PHP — a linguagem que processa o código do lado do servidor. Quase todo CMS (WordPress, Drupal, Magento) é PHP." },
          { flag: "P", desc: "Perl — outra linguagem de script. Hoje é raramente usada em projetos novos, mas continua incluída por compatibilidade." },
        ]}
      />

      <h2>Para que serve, na prática</h2>
      <p>
        Um servidor web "de verdade" (na nuvem) tem dezenas de partes
        configuradas com cuidado: sistema operacional, firewall, Apache ou
        Nginx, PHP-FPM, MySQL, certificados, etc. Configurar tudo isso só pra
        aprender PHP seria desanimador.
      </p>
      <p>O XAMPP resolve isso. Em um único instalador, você ganha:</p>
      <ul>
        <li>O <strong>Apache</strong> já compilado e pronto para servir páginas em <code>http://localhost</code>.</li>
        <li>O <strong>PHP</strong> (em uma versão estável) já conectado ao Apache.</li>
        <li>O <strong>MariaDB</strong> rodando na porta 3306, esperando conexões.</li>
        <li>O <strong>phpMyAdmin</strong> para administrar o banco pelo navegador.</li>
        <li>Ferramentas extras: Mercury (SMTP local), FileZilla (FTP), Tomcat (Java), OpenSSL.</li>
      </ul>

      <AlertBox type="success" title="Em uma frase">
        XAMPP é a forma mais rápida de ter um servidor PHP+MySQL completo
        rodando no seu computador, sem precisar entender de Linux, Apache ou
        configuração de rede.
      </AlertBox>

      <h2>Quem mantém o XAMPP?</h2>
      <p>
        O XAMPP é desenvolvido pela <strong>Apache Friends</strong>, um projeto
        sem fins lucrativos criado em 2002. É 100% gratuito, open source, e
        pode ser baixado em{" "}
        <a href="https://www.apachefriends.org" target="_blank" rel="noreferrer">
          apachefriends.org
        </a>
        .
      </p>

      <h2>Quando usar o XAMPP</h2>
      <ul>
        <li>Aprender PHP e MySQL do zero.</li>
        <li>Estudar para a faculdade (ADS, SI, Engenharia da Computação).</li>
        <li>Desenvolver e testar plugins/temas de WordPress.</li>
        <li>Rodar localmente um Laravel, CodeIgniter, Symfony, Drupal, Magento.</li>
        <li>Dar treinamentos e aulas presenciais.</li>
        <li>Prototipar uma ideia antes de pagar uma hospedagem.</li>
      </ul>

      <h2>Quando NÃO usar o XAMPP</h2>
      <AlertBox type="danger" title="XAMPP não é servidor de produção">
        O XAMPP vem com configurações inseguras de propósito (senha do MySQL
        vazia, phpMyAdmin liberado, mod_status ativo, listing de diretórios).
        Isso é ótimo para aprender — e <strong>terrível</strong> se exposto à
        internet. Para produção, use uma hospedagem profissional ou uma VPS
        configurada manualmente.
      </AlertBox>

      <h2>Mostre que está vivo</h2>
      <p>
        Depois de instalado e iniciado, você acessa o XAMPP pelo navegador na
        URL abaixo. Se aparecer a tela laranja com "Welcome to XAMPP" ou o
        dashboard do projeto, está tudo certo:
      </p>
      <CodeBlock language="text" code={`http://localhost
http://localhost/dashboard/
http://127.0.0.1`} />

      <p>
        E o seu primeiro arquivo PHP de teste vai morar dentro da pasta{" "}
        <code>htdocs/</code> do XAMPP. Falamos disso em detalhes na seção{" "}
        <a href="#/estrutura-pastas">Pastas e htdocs</a>.
      </p>

      <CodeBlock title="htdocs/teste.php" language="php" code={`<?php
phpinfo();
?>`} />

      <p>
        Acessando <code>http://localhost/teste.php</code> você verá toda a
        configuração do PHP em uma página gigante de tabelas — esse é o "olá
        mundo" oficial de quem trabalha com PHP.
      </p>
    </PageContainer>
  );
}
