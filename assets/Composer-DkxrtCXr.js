import{j as e}from"./index-BreI0dyu.js";import{P as s,A as r}from"./AlertBox-C_bJKc46.js";import{C as o}from"./CodeBlock-D0rWxPIU.js";import{P as a}from"./PracticeBox-BV05Hsfh.js";import"./circle-alert-_acnmM4q.js";function p(){return e.jsxs(s,{title:"Composer no XAMPP",subtitle:"Gerenciador de dependências do PHP. Sem ele, nada de Laravel, Symfony, Guzzle, PHPUnit.",difficulty:"iniciante",timeToRead:"7 min",children:[e.jsx(r,{type:"info",title:"Pré-requisitos",children:'XAMPP instalado (precisamos do PHP do XAMPP). Acesso ao terminal/CMD. Conhecer o conceito de "PATH" (a variável que diz ao sistema onde procurar executáveis) ajuda — explico abaixo se você não conhece.'}),e.jsx("h2",{children:"Glossário rápido"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Dependência"})," — qualquer biblioteca de terceiros que seu código precisa para funcionar. Se você usa Guzzle para fazer requisições HTTP, o Guzzle é uma dependência do seu projeto."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Pacote"})," — uma biblioteca PHP empacotada e publicada no"," ",e.jsx("a",{href:"https://packagist.org",target:"_blank",rel:"noreferrer",children:"Packagist"})," ",'(o "repositório" de pacotes do Composer). Cada pacote tem um nome no formato ',e.jsx("code",{children:"vendor/nome"}),", como ",e.jsx("code",{children:"guzzlehttp/guzzle"}),"."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"composer.json"}),' — arquivo na raiz do seu projeto que lista quais pacotes você quer e em quais versões. É o "Wishlist" do projeto.']}),e.jsxs("p",{children:[e.jsx("strong",{children:"composer.lock"})," — arquivo gerado automaticamente que congela a versão exata de cada pacote instalado. Garante que toda máquina que rode ",e.jsx("code",{children:"composer install"})," use as mesmas versões."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"vendor/"})," — pasta onde o Composer baixa todos os pacotes. Nunca deve ir para o Git (já vem no ",e.jsx("code",{children:".gitignore"}),")."]}),e.jsx("h2",{children:"O que é o Composer"}),e.jsxs("p",{children:["Composer é o npm/pip/cargo do PHP. Você define as bibliotecas que seu projeto usa em um arquivo ",e.jsx("code",{children:"composer.json"}),", e ele baixa tudo dentro de ",e.jsx("code",{children:"vendor/"}),"."]}),e.jsx("h2",{children:"Instalação no Windows"}),e.jsxs("p",{children:["Baixe o instalador em"," ",e.jsx("a",{href:"https://getcomposer.org/Composer-Setup.exe",target:"_blank",rel:"noreferrer",children:"getcomposer.org/Composer-Setup.exe"}),". Ele detecta o PHP do XAMPP automaticamente e adiciona"," ",e.jsx("code",{children:"composer"})," ao PATH."]}),e.jsx(a,{title:"Instalar e testar o Composer no Windows",goal:"Rodar composer --version no terminal e ver a versão instalada.",steps:["Abra https://getcomposer.org/download e baixe o Composer-Setup.exe","Execute o instalador. Quando pedir o php.exe, aponte para C:/xampp/php/php.exe","Marque 'Add PHP to PATH' se ele perguntar","Após terminar, ABRA UM NOVO terminal (Ctrl+Shift do PowerShell)","Digite: composer --version"],expected:"Composer version 2.x.x",verify:"A linha 'Composer version' aparece, sem 'comando não encontrado'."}),e.jsx("h2",{children:"Instalação no Linux / macOS"}),e.jsx(o,{language:"bash",code:`# Baixar e instalar globalmente
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
sudo chmod +x /usr/local/bin/composer

# Conferir
composer --version`}),e.jsxs(r,{type:"warning",title:"Composer reclama de openssl?",children:["O Composer baixa pacotes via HTTPS. Se aparecer"," ",e.jsx("code",{children:"The openssl extension is required for SSL/TLS protection"}),", abra o ",e.jsx("code",{children:"php.ini"}),", descomente ",e.jsx("code",{children:"extension=openssl"}),", e reinicie o Apache. No CLI o efeito é imediato (não precisa reiniciar nada)."]}),e.jsx("h2",{children:"Comandos essenciais"}),e.jsx(o,{language:"bash",code:`# Iniciar um composer.json novo (interativo)
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
composer self-update`}),e.jsx("h2",{children:"Autoload — o ouro do Composer"}),e.jsxs("p",{children:["Você não precisa fazer ",e.jsx("code",{children:"require"})," manual de nada. Basta incluir uma única linha no topo do seu ",e.jsx("code",{children:"index.php"}),":"]}),e.jsx(o,{language:"php",code:`<?php
require __DIR__ . '/vendor/autoload.php';

use GuzzleHttp\\Client;

$cliente = new Client();
$resposta = $cliente->get('https://httpbin.org/json');
echo $resposta->getBody();`}),e.jsx("h2",{children:"Autoload do seu próprio código (PSR-4)"}),e.jsxs("p",{children:["Defina no ",e.jsx("code",{children:"composer.json"})," um namespace para a sua pasta de código:"]}),e.jsx(o,{title:"composer.json",language:"json",code:`{
    "name": "wallyson/meu-projeto",
    "require": {
        "guzzlehttp/guzzle": "^7.0"
    },
    "autoload": {
        "psr-4": {
            "App\\\\": "src/"
        }
    }
}`}),e.jsxs("p",{children:["Rode ",e.jsx("code",{children:"composer dump-autoload"})," para regenerar. A partir daí, qualquer ",e.jsx("code",{children:"src/Loja/Produto.php"})," com"," ",e.jsx("code",{children:"namespace App\\Loja"})," está disponível como"," ",e.jsx("code",{children:"App\\Loja\\Produto"}),"."]}),e.jsx("h2",{children:"Criando um projeto Laravel pelo Composer"}),e.jsx(o,{language:"bash",code:`cd C:/xampp/htdocs
composer create-project laravel/laravel meu-app

cd meu-app
php artisan serve  # roda o servidor embutido na 8000

# OU acesse via Apache em http://localhost/meu-app/public`}),e.jsxs(r,{type:"info",title:"Onde os pacotes ficam",children:["Tudo vai para a pasta ",e.jsx("code",{children:"vendor/"}),". Esta pasta é"," ",e.jsx("strong",{children:"nunca commitada no Git"})," (sempre tem em todo"," ",e.jsx("code",{children:".gitignore"})," de projeto PHP). O ",e.jsx("code",{children:"composer.lock"})," ","sim, deve ir para o Git: ele garante que todo mundo do time instale exatamente as mesmas versões."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:'"requires ext-X but it is not present"'})," — falta extensão no ",e.jsx("code",{children:"php.ini"}),". Habilite e tente de novo."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'"Allowed memory size exhausted"'})," — Composer estourou a memória. Rode com:"," ",e.jsx("code",{children:"php -d memory_limit=-1 /path/to/composer install"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'"Failed to download"'})," — problema de rede ou cache corrompido. Tente ",e.jsx("code",{children:"composer clear-cache"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'"Your requirements could not be resolved"'})," — versões incompatíveis. Leia a saída — costuma indicar exatamente qual conflito."]})]})]})}export{p as default};
