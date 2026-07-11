import{j as e}from"./index-BreI0dyu.js";import{P as s,A as o}from"./AlertBox-C_bJKc46.js";import{C as a}from"./CodeBlock-D0rWxPIU.js";import{P as r}from"./ParamsTable-DyRs6_CQ.js";import{P as i}from"./PracticeBox-BV05Hsfh.js";import"./circle-alert-_acnmM4q.js";function h(){return e.jsxs(s,{title:"Hospedando Laravel no XAMPP",subtitle:"Crie um projeto Laravel novo, sirva-o pelo Apache do XAMPP com URL bonita, banco MySQL, filas, agendador e tudo o que a documentação oficial recomenda — sem deixar de mirar o ambiente de produção.",difficulty:"intermediario",timeToRead:"14 min",children:[e.jsxs(o,{type:"info",title:"Pré-requisitos",children:["Antes de seguir este capítulo, leia ",e.jsx("a",{href:"#/composer",children:"Composer"}),",",e.jsx("a",{href:"#/php-versoes",children:"Versões do PHP"}),","," ",e.jsx("a",{href:"#/php-extensoes",children:"Extensões do PHP"})," e"," ",e.jsx("a",{href:"#/virtual-hosts",children:"Virtual Hosts"}),". Tenha o PHP, o Composer e o MySQL do XAMPP rodando."]}),e.jsx("h2",{children:"Glossário rápido"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Artisan"})," — ferramenta de linha de comando que vem com o Laravel (",e.jsx("code",{children:"php artisan ..."}),") para gerar código, rodar migrations, limpar caches e iniciar servidores auxiliares."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Migration"}),' — script PHP versionado que cria/altera tabelas do banco. Substitui o "rode esse SQL aí" e mantém histórico.']}),e.jsxs("p",{children:[e.jsx("strong",{children:"Eloquent"})," — ORM do Laravel. Cada tabela vira uma classe (Model) e cada linha vira um objeto."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Blade"})," — engine de templates (",e.jsx("code",{children:".blade.php"}),"). Permite herança de layouts, componentes e diretivas curtas."]}),e.jsxs("p",{children:[e.jsx("strong",{children:".env"})," — arquivo de variáveis de ambiente (banco, e-mail, chaves). Nunca vai para o Git; cada ambiente tem o seu."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"APP_KEY"})," — chave de 32 bytes usada para criptografar cookies, sessões e ",e.jsx("code",{children:"encrypt()"}),". Sem ela o Laravel recusa subir."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Vite"})," — bundler de assets (substituiu o Mix). Roda em paralelo ao Apache e injeta JS/CSS via ",e.jsx("code",{children:"@vite()"}),"."]}),e.jsxs("p",{children:["O Laravel já vem com um servidor embutido (",e.jsx("code",{children:"php artisan serve"}),"), mas para mexer em virtual hosts, configurar TLS local, simular o ambiente de produção (Apache + .htaccess + mod_rewrite) e testar filas/agendador como ficarão na hospedagem, o XAMPP é o amigo certo."]}),e.jsx("h2",{children:"Pré-requisitos detalhados"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"PHP 8.2 ou superior"})," (Laravel 11 exige 8.2; Laravel 10 aceita 8.1+). Veja ",e.jsx("code",{children:"php -v"})," no terminal."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Composer"})," instalado e disponível no PATH."]}),e.jsxs("li",{children:["Extensões obrigatórias habilitadas no ",e.jsx("code",{children:"php.ini"}),":"," ",e.jsx("code",{children:"mbstring"}),", ",e.jsx("code",{children:"openssl"}),", ",e.jsx("code",{children:"pdo"}),","," ",e.jsx("code",{children:"pdo_mysql"}),", ",e.jsx("code",{children:"tokenizer"}),", ",e.jsx("code",{children:"xml"}),","," ",e.jsx("code",{children:"ctype"}),", ",e.jsx("code",{children:"json"}),", ",e.jsx("code",{children:"bcmath"}),","," ",e.jsx("code",{children:"fileinfo"}),", ",e.jsx("code",{children:"curl"}),", ",e.jsx("code",{children:"filter"}),","," ",e.jsx("code",{children:"hash"}),", ",e.jsx("code",{children:"session"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"mod_rewrite"})," ativado no Apache (já vem ativo no XAMPP, mas confirme — sem isso as URLs amigáveis quebram)."]}),e.jsxs("li",{children:["Memória do PHP em pelo menos ",e.jsx("code",{children:"256M"})," (",e.jsx("code",{children:"memory_limit = 256M"}),"); o Composer pede ainda mais quando atualiza o pacote inteiro."]})]}),e.jsx("h2",{children:"1. Crie o projeto"}),e.jsx(a,{language:"bash",code:`cd C:/xampp/htdocs

# Versão atual (LTS / mais recente)
composer create-project laravel/laravel meu-app

# Travando em uma versão major específica
composer create-project laravel/laravel:^11.0 meu-app

cd meu-app

# Gera a APP_KEY no .env (sem ela o Laravel reclama)
php artisan key:generate

# Confirma que tudo subiu
php artisan --version`}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"create-project"})," baixa o esqueleto do Laravel, instala todas as dependências do ",e.jsx("code",{children:"composer.json"}),", copia"," ",e.jsx("code",{children:".env.example"})," para ",e.jsx("code",{children:".env"})," e ajusta as permissões necessárias."]}),e.jsx("h2",{children:"2. Estrutura de pastas (mapa rápido)"}),e.jsx(r,{title:"Pastas que você vai usar todos os dias",params:[{flag:"app/",desc:"Código da aplicação: Models (Eloquent), Controllers, Middleware, Service Providers."},{flag:"routes/",desc:"Definição das rotas. web.php para HTTP comum (com cookies/sessão), api.php para APIs sem estado, console.php para comandos artisan customizados."},{flag:"resources/views/",desc:"Templates Blade (.blade.php). Cada view pode estender layouts e incluir componentes."},{flag:"resources/css/ + resources/js/",desc:"Fontes de assets (Tailwind, JS). Compilados pelo Vite."},{flag:"database/migrations/",desc:"Scripts versionados que criam/alteram tabelas. Rodar com php artisan migrate."},{flag:"database/seeders/ + factories/",desc:"Dados de teste para popular o banco (DatabaseSeeder + factories de Model)."},{flag:"config/",desc:"Arquivos PHP de configuração. Não edite aqui valores secretos — leia do .env."},{flag:"storage/",desc:"Arquivos gerados em runtime: logs, cache, sessões, uploads. Precisa ser gravável."},{flag:"bootstrap/cache/",desc:"Caches compilados (rotas, config). Também precisa ser gravável."},{flag:"public/",desc:"ÚNICA pasta exposta na web. index.php, .htaccess, assets compilados. É aqui que o DocumentRoot do Apache deve apontar."},{flag:".env",desc:"Variáveis de ambiente (banco, mail, chaves). NUNCA vai para o Git."},{flag:"composer.json + package.json",desc:"Dependências PHP (Composer) e JS (npm/pnpm)."}]}),e.jsx("h2",{children:"3. Banco de dados"}),e.jsxs("p",{children:["Crie o banco pelo phpMyAdmin (botão ",e.jsx("strong",{children:"Novo"}),", nome"," ",e.jsx("code",{children:"meu_app"}),", charset ",e.jsx("code",{children:"utf8mb4"}),", collation"," ",e.jsx("code",{children:"utf8mb4_unicode_ci"}),") e edite o ",e.jsx("code",{children:".env"}),":"]}),e.jsx(a,{title:".env",language:"bash",code:`APP_NAME="Meu App"
APP_ENV=local
APP_KEY=base64:gerada-pelo-artisan-key-generate
APP_DEBUG=true
APP_URL=http://meuapp.local

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=meu_app
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database     # database evita precisar de Redis em dev
SESSION_DRIVER=database       # ou file
SESSION_LIFETIME=120

MAIL_MAILER=smtp
MAIL_HOST=localhost           # Mercury/MailHog do XAMPP
MAIL_PORT=25
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@meuapp.local"
MAIL_FROM_NAME="\${APP_NAME}"`}),e.jsxs(o,{type:"warning",title:"DB_HOST=127.0.0.1, não localhost",children:["Em Windows, ",e.jsx("code",{children:"localhost"})," às vezes resolve via socket Unix que não existe — e o PDO trava com"," ",e.jsx("em",{children:'"SQLSTATE[HY000] [2002] No such file or directory"'}),". Usar o IP ",e.jsx("code",{children:"127.0.0.1"})," força conexão TCP e sai esse problema."]}),e.jsx("p",{children:"Rode as migrations padrão (users, password_resets, jobs, sessions):"}),e.jsx(a,{language:"bash",code:`php artisan migrate
# Quer começar do zero a qualquer momento?
php artisan migrate:fresh --seed`}),e.jsx("h2",{children:"4. Servir pelo Apache (jeito simples)"}),e.jsxs("p",{children:["Acesse ",e.jsx("code",{children:"http://localhost/meu-app/public"}),". Funciona, mas com o sufixo ",e.jsx("code",{children:"/public"})," feio na URL. Bom para um teste rápido, ruim para o longo prazo (quebra rotas absolutas, deixa o ambiente diferente do de produção)."]}),e.jsx("h2",{children:"5. Servir pelo Apache (jeito bonito — Virtual Host)"}),e.jsxs("p",{children:["Edite ",e.jsx("code",{children:"apache/conf/extra/httpd-vhosts.conf"})," e adicione no final:"]}),e.jsx(a,{language:"apache",code:`<VirtualHost *:80>
    ServerName meuapp.local
    ServerAlias www.meuapp.local
    DocumentRoot "C:/xampp/htdocs/meu-app/public"

    <Directory "C:/xampp/htdocs/meu-app/public">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog "logs/meuapp-error.log"
    CustomLog "logs/meuapp-access.log" common
</VirtualHost>`}),e.jsxs("p",{children:["Adicione no arquivo hosts do sistema (",e.jsx("code",{children:"C:/Windows/System32/drivers/etc/hosts"}),", abra como administrador):"]}),e.jsx(a,{language:"text",code:`127.0.0.1   meuapp.local
127.0.0.1   www.meuapp.local`}),e.jsxs("p",{children:["Reinicie o Apache. Acesse ",e.jsx("code",{children:"http://meuapp.local"}),"."]}),e.jsx("h2",{children:"6. HTTPS local (opcional, mas recomendado para PWA/Stripe)"}),e.jsxs("p",{children:["Cookies ",e.jsx("code",{children:"Secure"}),", Service Workers, integrações como Stripe Elements e Webhooks de OAuth exigem HTTPS — mesmo em dev. Use"," ",e.jsx("strong",{children:"mkcert"}),": ele instala uma CA no seu sistema e gera certificados confiáveis pelo navegador (veja"," ",e.jsx("a",{href:"#/ssl-local",children:"SSL Local"}),"):"]}),e.jsx(a,{language:"bash",code:`mkcert -install
mkcert meuapp.local "*.meuapp.local"
# Move os arquivos gerados para C:/xampp/apache/conf/ssl/`}),e.jsxs("p",{children:["Depois adicione um VirtualHost na 443 e habilite"," ",e.jsx("code",{children:"SSLEngine On"})," apontando para os certs (passo a passo completo no ",e.jsx("a",{href:"#/ssl-local",children:"capítulo de SSL Local"}),")."]}),e.jsx(i,{title:"Criar projeto Laravel no XAMPP do zero",goal:"Ver a tela de boas-vindas do Laravel em http://meuapp.local.",steps:["Confirme que Composer e PHP 8.2+ estão prontos: composer --version e php --version","cd C:/xampp/htdocs && composer create-project laravel/laravel meu-app","Crie banco 'meu_app' no phpMyAdmin com charset utf8mb4_unicode_ci","Edite .env com APP_URL=http://meuapp.local e DB_HOST=127.0.0.1","php artisan key:generate && php artisan migrate","Adicione virtual host meuapp.local apontando para meu-app/public","Edite o arquivo hosts (como admin): 127.0.0.1 meuapp.local","Reinicie o Apache","Acesse http://meuapp.local"],verify:"A página com o logo do Laravel e os links da documentação aparece sem erros e o devtools mostra status 200."}),e.jsx("h2",{children:"7. Permissões em Linux/macOS"}),e.jsxs("p",{children:["Em Linux/macOS o Apache roda como o usuário ",e.jsx("code",{children:"daemon"})," (no XAMPP) ou ",e.jsx("code",{children:"www-data"})," (em distros). As pastas"," ",e.jsx("code",{children:"storage/"})," e ",e.jsx("code",{children:"bootstrap/cache/"})," precisam ser graváveis por esse usuário:"]}),e.jsx(a,{language:"bash",code:`cd /opt/lampp/htdocs/meu-app
sudo chown -R daemon:daemon storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Ou jeito mais permissivo (só em dev local!):
sudo chmod -R 777 storage bootstrap/cache`}),e.jsxs(o,{type:"warning",title:"777 só em dev — nunca em produção",children:[e.jsx("code",{children:"chmod 777"})," deixa qualquer usuário do sistema escrever na pasta. Em servidor de produção, use ",e.jsx("code",{children:"775"})," com o dono certo ou ACLs (",e.jsx("code",{children:"setfacl"}),")."]}),e.jsx("h2",{children:"8. Vite + Apache (assets em paralelo)"}),e.jsxs("p",{children:["Laravel 11 usa ",e.jsx("strong",{children:"Vite"})," (substitui o Laravel Mix). Em desenvolvimento, rode os assets em paralelo:"]}),e.jsx(a,{language:"bash",code:`# Em outra aba do terminal
cd C:/xampp/htdocs/meu-app
npm install
npm run dev   # sobe o Vite em http://localhost:5173 com HMR (Hot Module Replacement)`}),e.jsxs("p",{children:["O Apache continua servindo o PHP em"," ",e.jsx("code",{children:"http://meuapp.local"}),"; o Blade carrega os assets do Vite via diretiva ",e.jsx("code",{children:"@vite([...])"}),". Quando subir para produção, rode ",e.jsx("code",{children:"npm run build"})," — o Vite gera arquivos estáticos otimizados em ",e.jsx("code",{children:"public/build/"}),"."]}),e.jsx(a,{title:"resources/views/layouts/app.blade.php",language:"html",code:`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>{{ config('app.name') }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    @yield('conteudo')
</body>
</html>`}),e.jsx("h2",{children:"9. Filas (Queues) e Agendador (Scheduler)"}),e.jsx("p",{children:"Tarefas pesadas (envio de e-mail, processamento de imagem, geração de PDF) não devem travar a request HTTP. Mande para a fila:"}),e.jsx(a,{language:"bash",code:`# Tabela jobs já vem nas migrations padrão. Confirme:
php artisan queue:table       # cria a migration se não existir
php artisan migrate

# Inicie um worker (mantenha rodando em outra aba)
php artisan queue:work --tries=3 --timeout=60

# Crie um job
php artisan make:job EnviarBoletoEmail`}),e.jsxs("p",{children:["O ",e.jsx("strong",{children:"Scheduler"})," roda comandos a cada minuto, hora, dia etc., declarados em ",e.jsx("code",{children:"routes/console.php"})," (Laravel 11) ou"," ",e.jsx("code",{children:"app/Console/Kernel.php"})," (Laravel 10):"]}),e.jsx(a,{title:"routes/console.php (L11)",language:"php",code:`use Illuminate\\Support\\Facades\\Schedule;

Schedule::command('inspire')->hourly();
Schedule::command('app:limpar-uploads-temporarios')->dailyAt('03:00');`}),e.jsx("p",{children:"Em produção, registre uma única tarefa no cron que dispara o scheduler a cada minuto:"}),e.jsx(a,{language:"bash",code:`# Linux/macOS — crontab -e
* * * * * cd /var/www/meu-app && php artisan schedule:run >> /dev/null 2>&1

# Em dev/Windows, rode manualmente para testar
php artisan schedule:work    # fica em loop chamando schedule:run a cada minuto`}),e.jsx("h2",{children:"10. Testes automatizados"}),e.jsxs("p",{children:["O Laravel já vem com ",e.jsx("strong",{children:"PHPUnit"})," (e opcionalmente Pest) configurado. Rode com:"]}),e.jsx(a,{language:"bash",code:`php artisan test                  # roda todos os testes
php artisan test --filter UserTest
php artisan test --parallel       # paraleliza pelos cores da CPU`}),e.jsxs("p",{children:["Em ",e.jsx("code",{children:"phpunit.xml"}),", o ambiente de teste por padrão usa SQLite em memória — então os testes não bagunçam o banco de desenvolvimento."]}),e.jsx("h2",{children:"Erros mais comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:'"No application encryption key has been specified"'})," ","— esqueceu de rodar ",e.jsx("code",{children:"php artisan key:generate"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'"SQLSTATE[HY000] [2002] Connection refused"'})," — o MySQL não está rodando, ou está em outra porta. Confira"," ",e.jsx("code",{children:"DB_HOST=127.0.0.1"})," (em vez de ",e.jsx("code",{children:"localhost"}),")."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'"file_put_contents... failed to open stream"'})," — permissão de escrita em ",e.jsx("code",{children:"storage/logs/"})," ou"," ",e.jsx("code",{children:"bootstrap/cache/"})," (veja seção 7)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:'"The Vite manifest does not exist"'})," — você não rodou ",e.jsx("code",{children:"npm install && npm run dev"})," (em dev) ou"," ",e.jsx("code",{children:"npm run build"})," (em produção)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"404 em todas as rotas exceto a raiz"})," —"," ",e.jsx("code",{children:"mod_rewrite"})," desabilitado ou"," ",e.jsx("code",{children:"AllowOverride None"})," no Directory do"," ",e.jsx("code",{children:"public/"}),". Confira ",e.jsx("code",{children:"public/.htaccess"})," ","existindo."]}),e.jsxs("li",{children:[e.jsx("strong",{children:`"Class 'PDO' not found"`})," — extensão"," ",e.jsx("code",{children:"pdo_mysql"})," não habilitada no ",e.jsx("code",{children:"php.ini"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"419 Page Expired"})," — token CSRF expirou ou está faltando ",e.jsx("code",{children:"@csrf"})," no formulário Blade."]})]}),e.jsx("h2",{children:"Comandos artisan que você vai usar todo dia"}),e.jsx(a,{language:"bash",code:`php artisan make:model Produto -mfc      # Model + migration + factory + controller
php artisan make:controller ProdutoController --resource
php artisan make:request StoreProdutoRequest
php artisan make:middleware EnsureUserIsAdmin
php artisan make:seeder DatabaseSeeder
php artisan make:job ProcessarPedido
php artisan make:mail PedidoConfirmado --markdown=emails.pedidos.confirmado

php artisan route:list                   # lista todas as rotas registradas
php artisan tinker                       # REPL com a app carregada
php artisan db                           # abre o cliente do banco
php artisan storage:link                 # cria public/storage -> storage/app/public

# Caches (em produção, compilar para acelerar; em dev, limpar para refletir)
php artisan config:cache && php artisan route:cache && php artisan view:cache
php artisan optimize:clear`}),e.jsxs(o,{type:"success",title:"php artisan serve continua valendo",children:["Para projetos rápidos, ",e.jsx("code",{children:"php artisan serve"})," sobe um servidor PHP nativo na 8000. Não precisa de Apache nem mod_rewrite. Mas você perde a chance de testar virtual hosts, .htaccess, compressão, headers, certificados e tudo o que vai existir em produção. Para o XAMPP fazer sentido, prefira o virtual host."]}),e.jsxs(o,{type:"info",title:"Para colocar em produção",children:["Veja ",e.jsx("a",{href:"#/migrar-producao",children:"Migrando para produção"}),". Os cuidados extras são: ",e.jsx("code",{children:"APP_DEBUG=false"}),","," ",e.jsx("code",{children:"APP_ENV=production"}),", OPcache ligado,"," ",e.jsx("code",{children:"php artisan config:cache"}),", banco com senha forte e HTTPS forçado."]})]})}export{h as default};
