import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function Composer() {
  return (
    <PageContainer
      title="Composer no XAMPP"
      subtitle="Gerenciador de dependências do PHP. Sem ele, nada de Laravel, Symfony, Guzzle, PHPUnit."
      difficulty="iniciante"
      timeToRead="7 min"
    >
      <h2>O que é o Composer</h2>
      <p>
        Composer é o npm/pip/cargo do PHP. Você define as bibliotecas que seu
        projeto usa em um arquivo <code>composer.json</code>, e ele baixa
        tudo dentro de <code>vendor/</code>.
      </p>

      <h2>Instalação no Windows</h2>
      <p>
        Baixe o instalador em{" "}
        <a href="https://getcomposer.org/Composer-Setup.exe" target="_blank" rel="noreferrer">
          getcomposer.org/Composer-Setup.exe
        </a>
        . Ele detecta o PHP do XAMPP automaticamente e adiciona{" "}
        <code>composer</code> ao PATH.
      </p>

      <PracticeBox
        title="Instalar e testar o Composer no Windows"
        goal="Rodar composer --version no terminal e ver a versão instalada."
        steps={[
          "Abra https://getcomposer.org/download e baixe o Composer-Setup.exe",
          "Execute o instalador. Quando pedir o php.exe, aponte para C:/xampp/php/php.exe",
          "Marque 'Add PHP to PATH' se ele perguntar",
          "Após terminar, ABRA UM NOVO terminal (Ctrl+Shift do PowerShell)",
          "Digite: composer --version",
        ]}
        expected="Composer version 2.x.x"
        verify="A linha 'Composer version' aparece, sem 'comando não encontrado'."
      />

      <h2>Instalação no Linux / macOS</h2>
      <CodeBlock language="bash" code={`# Baixar e instalar globalmente
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
sudo chmod +x /usr/local/bin/composer

# Conferir
composer --version`} />

      <AlertBox type="warning" title="Composer reclama de openssl?">
        O Composer baixa pacotes via HTTPS. Se aparecer{" "}
        <code>The openssl extension is required for SSL/TLS protection</code>,
        abra o <code>php.ini</code>, descomente <code>extension=openssl</code>,
        e reinicie o Apache. No CLI o efeito é imediato (não precisa
        reiniciar nada).
      </AlertBox>

      <h2>Comandos essenciais</h2>
      <CodeBlock language="bash" code={`# Iniciar um composer.json novo (interativo)
composer init

# Instalar uma biblioteca
composer require guzzlehttp/guzzle
composer require monolog/monolog
composer require phpunit/phpunit --dev

# Instalar tudo do composer.json (em outro PC, após git clone)
composer install

# Atualizar pacotes para a versão mais recente compatível
composer update
composer update guzzlehttp/guzzle

# Remover uma biblioteca
composer remove guzzlehttp/guzzle

# Procurar pacotes
composer search guzzle

# Mostrar pacotes instalados
composer show
composer show -t       # árvore de dependências

# Atualizar o próprio Composer
composer self-update`} />

      <h2>Autoload — o ouro do Composer</h2>
      <p>
        Você não precisa fazer <code>require</code> manual de nada. Basta
        incluir uma única linha no topo do seu <code>index.php</code>:
      </p>
      <CodeBlock language="php" code={`<?php
require __DIR__ . '/vendor/autoload.php';

use GuzzleHttp\\Client;

$cliente = new Client();
$resposta = $cliente->get('https://httpbin.org/json');
echo $resposta->getBody();`} />

      <h2>Autoload do seu próprio código (PSR-4)</h2>
      <p>
        Defina no <code>composer.json</code> um namespace para a sua pasta de
        código:
      </p>
      <CodeBlock title="composer.json" language="json" code={`{
    "name": "wallyson/meu-projeto",
    "require": {
        "guzzlehttp/guzzle": "^7.0"
    },
    "autoload": {
        "psr-4": {
            "App\\\\": "src/"
        }
    }
}`} />
      <p>
        Rode <code>composer dump-autoload</code> para regenerar. A partir
        daí, qualquer <code>src/Loja/Produto.php</code> com{" "}
        <code>namespace App\Loja</code> está disponível como{" "}
        <code>App\Loja\Produto</code>.
      </p>

      <h2>Criando um projeto Laravel pelo Composer</h2>
      <CodeBlock language="bash" code={`cd C:/xampp/htdocs
composer create-project laravel/laravel meu-app

cd meu-app
php artisan serve  # roda o servidor embutido na 8000

# OU acesse via Apache em http://localhost/meu-app/public`} />

      <AlertBox type="info" title="Onde os pacotes ficam">
        Tudo vai para a pasta <code>vendor/</code>. Esta pasta é{" "}
        <strong>nunca commitada no Git</strong> (sempre tem em todo{" "}
        <code>.gitignore</code> de projeto PHP). O <code>composer.lock</code>{" "}
        sim, deve ir para o Git: ele garante que todo mundo do time instale
        exatamente as mesmas versões.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li>
          <strong>"requires ext-X but it is not present"</strong> — falta
          extensão no <code>php.ini</code>. Habilite e tente de novo.
        </li>
        <li>
          <strong>"Allowed memory size exhausted"</strong> — Composer estourou
          a memória. Rode com:{" "}
          <code>php -d memory_limit=-1 /path/to/composer install</code>.
        </li>
        <li>
          <strong>"Failed to download"</strong> — problema de rede ou cache
          corrompido. Tente <code>composer clear-cache</code>.
        </li>
        <li>
          <strong>"Your requirements could not be resolved"</strong> — versões
          incompatíveis. Leia a saída — costuma indicar exatamente qual
          conflito.
        </li>
      </ul>
    </PageContainer>
  );
}
