import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function Laravel() {
  return (
    <PageContainer
      title="Hospedando Laravel no XAMPP"
      subtitle="Crie um projeto Laravel novo, sirva-o pelo Apache do XAMPP com URL bonita, banco MySQL, filas, agendador e tudo o que a documentação oficial recomenda — sem deixar de mirar o ambiente de produção."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Antes de seguir este capítulo, leia <a href="#/composer">Composer</a>,
        <a href="#/php-versoes">Versões do PHP</a>,{" "}
        <a href="#/php-extensoes">Extensões do PHP</a> e{" "}
        <a href="#/virtual-hosts">Virtual Hosts</a>. Tenha o PHP, o Composer e
        o MySQL do XAMPP rodando.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Artisan</strong> — ferramenta de linha de comando que vem com
        o Laravel (<code>php artisan ...</code>) para gerar código, rodar
        migrations, limpar caches e iniciar servidores auxiliares.
      </p>
      <p>
        <strong>Migration</strong> — script PHP versionado que cria/altera
        tabelas do banco. Substitui o "rode esse SQL aí" e mantém histórico.
      </p>
      <p>
        <strong>Eloquent</strong> — ORM do Laravel. Cada tabela vira uma
        classe (Model) e cada linha vira um objeto.
      </p>
      <p>
        <strong>Blade</strong> — engine de templates (<code>.blade.php</code>).
        Permite herança de layouts, componentes e diretivas curtas.
      </p>
      <p>
        <strong>.env</strong> — arquivo de variáveis de ambiente (banco,
        e-mail, chaves). Nunca vai para o Git; cada ambiente tem o seu.
      </p>
      <p>
        <strong>APP_KEY</strong> — chave de 32 bytes usada para criptografar
        cookies, sessões e <code>encrypt()</code>. Sem ela o Laravel recusa
        subir.
      </p>
      <p>
        <strong>Vite</strong> — bundler de assets (substituiu o Mix). Roda em
        paralelo ao Apache e injeta JS/CSS via <code>@vite()</code>.
      </p>

      <p>
        O Laravel já vem com um servidor embutido (
        <code>php artisan serve</code>), mas para mexer em virtual hosts,
        configurar TLS local, simular o ambiente de produção (Apache +
        .htaccess + mod_rewrite) e testar filas/agendador como ficarão na
        hospedagem, o XAMPP é o amigo certo.
      </p>

      <h2>Pré-requisitos detalhados</h2>
      <ul>
        <li>
          <strong>PHP 8.2 ou superior</strong> (Laravel 11 exige 8.2; Laravel
          10 aceita 8.1+). Veja <code>php -v</code> no terminal.
        </li>
        <li><strong>Composer</strong> instalado e disponível no PATH.</li>
        <li>
          Extensões obrigatórias habilitadas no <code>php.ini</code>:{" "}
          <code>mbstring</code>, <code>openssl</code>, <code>pdo</code>,{" "}
          <code>pdo_mysql</code>, <code>tokenizer</code>, <code>xml</code>,{" "}
          <code>ctype</code>, <code>json</code>, <code>bcmath</code>,{" "}
          <code>fileinfo</code>, <code>curl</code>, <code>filter</code>,{" "}
          <code>hash</code>, <code>session</code>.
        </li>
        <li>
          <strong>mod_rewrite</strong> ativado no Apache (já vem ativo no
          XAMPP, mas confirme — sem isso as URLs amigáveis quebram).
        </li>
        <li>
          Memória do PHP em pelo menos <code>256M</code> (
          <code>memory_limit = 256M</code>); o Composer pede ainda mais
          quando atualiza o pacote inteiro.
        </li>
      </ul>

      <h2>1. Crie o projeto</h2>
      <CodeBlock language="bash" code={`cd C:/xampp/htdocs

# Versão atual (LTS / mais recente)
composer create-project laravel/laravel meu-app

# Travando em uma versão major específica
composer create-project laravel/laravel:^11.0 meu-app

cd meu-app

# Gera a APP_KEY no .env (sem ela o Laravel reclama)
php artisan key:generate

# Confirma que tudo subiu
php artisan --version`} />
      <p>
        O <code>create-project</code> baixa o esqueleto do Laravel, instala
        todas as dependências do <code>composer.json</code>, copia{" "}
        <code>.env.example</code> para <code>.env</code> e ajusta as
        permissões necessárias.
      </p>

      <h2>2. Estrutura de pastas (mapa rápido)</h2>
      <ParamsTable
        title="Pastas que você vai usar todos os dias"
        params={[
          { flag: "app/", desc: "Código da aplicação: Models (Eloquent), Controllers, Middleware, Service Providers." },
          { flag: "routes/", desc: "Definição das rotas. web.php para HTTP comum (com cookies/sessão), api.php para APIs sem estado, console.php para comandos artisan customizados." },
          { flag: "resources/views/", desc: "Templates Blade (.blade.php). Cada view pode estender layouts e incluir componentes." },
          { flag: "resources/css/ + resources/js/", desc: "Fontes de assets (Tailwind, JS). Compilados pelo Vite." },
          { flag: "database/migrations/", desc: "Scripts versionados que criam/alteram tabelas. Rodar com php artisan migrate." },
          { flag: "database/seeders/ + factories/", desc: "Dados de teste para popular o banco (DatabaseSeeder + factories de Model)." },
          { flag: "config/", desc: "Arquivos PHP de configuração. Não edite aqui valores secretos — leia do .env." },
          { flag: "storage/", desc: "Arquivos gerados em runtime: logs, cache, sessões, uploads. Precisa ser gravável." },
          { flag: "bootstrap/cache/", desc: "Caches compilados (rotas, config). Também precisa ser gravável." },
          { flag: "public/", desc: "ÚNICA pasta exposta na web. index.php, .htaccess, assets compilados. É aqui que o DocumentRoot do Apache deve apontar." },
          { flag: ".env", desc: "Variáveis de ambiente (banco, mail, chaves). NUNCA vai para o Git." },
          { flag: "composer.json + package.json", desc: "Dependências PHP (Composer) e JS (npm/pnpm)." },
        ]}
      />

      <h2>3. Banco de dados</h2>
      <p>
        Crie o banco pelo phpMyAdmin (botão <strong>Novo</strong>, nome{" "}
        <code>meu_app</code>, charset <code>utf8mb4</code>, collation{" "}
        <code>utf8mb4_unicode_ci</code>) e edite o <code>.env</code>:
      </p>
      <CodeBlock title=".env" language="bash" code={`APP_NAME="Meu App"
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
MAIL_FROM_NAME="\${APP_NAME}"`} />
      <AlertBox type="warning" title="DB_HOST=127.0.0.1, não localhost">
        Em Windows, <code>localhost</code> às vezes resolve via socket Unix
        que não existe — e o PDO trava com{" "}
        <em>"SQLSTATE[HY000] [2002] No such file or directory"</em>. Usar o
        IP <code>127.0.0.1</code> força conexão TCP e sai esse problema.
      </AlertBox>
      <p>Rode as migrations padrão (users, password_resets, jobs, sessions):</p>
      <CodeBlock language="bash" code={`php artisan migrate
# Quer começar do zero a qualquer momento?
php artisan migrate:fresh --seed`} />

      <h2>4. Servir pelo Apache (jeito simples)</h2>
      <p>
        Acesse <code>http://localhost/meu-app/public</code>. Funciona, mas
        com o sufixo <code>/public</code> feio na URL. Bom para um teste
        rápido, ruim para o longo prazo (quebra rotas absolutas, deixa o
        ambiente diferente do de produção).
      </p>

      <h2>5. Servir pelo Apache (jeito bonito — Virtual Host)</h2>
      <p>
        Edite <code>apache/conf/extra/httpd-vhosts.conf</code> e adicione no
        final:
      </p>
      <CodeBlock language="apache" code={`<VirtualHost *:80>
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
</VirtualHost>`} />
      <p>
        Adicione no arquivo hosts do sistema (
        <code>C:/Windows/System32/drivers/etc/hosts</code>, abra como
        administrador):
      </p>
      <CodeBlock language="text" code={`127.0.0.1   meuapp.local
127.0.0.1   www.meuapp.local`} />
      <p>Reinicie o Apache. Acesse <code>http://meuapp.local</code>.</p>

      <h2>6. HTTPS local (opcional, mas recomendado para PWA/Stripe)</h2>
      <p>
        Cookies <code>Secure</code>, Service Workers, integrações como
        Stripe Elements e Webhooks de OAuth exigem HTTPS — mesmo em dev. Use{" "}
        <strong>mkcert</strong>: ele instala uma CA no seu sistema e gera
        certificados confiáveis pelo navegador (veja{" "}
        <a href="#/ssl-local">SSL Local</a>):
      </p>
      <CodeBlock language="bash" code={`mkcert -install
mkcert meuapp.local "*.meuapp.local"
# Move os arquivos gerados para C:/xampp/apache/conf/ssl/`} />
      <p>
        Depois adicione um VirtualHost na 443 e habilite{" "}
        <code>SSLEngine On</code> apontando para os certs (passo a passo
        completo no <a href="#/ssl-local">capítulo de SSL Local</a>).
      </p>

      <PracticeBox
        title="Criar projeto Laravel no XAMPP do zero"
        goal="Ver a tela de boas-vindas do Laravel em http://meuapp.local."
        steps={[
          "Confirme que Composer e PHP 8.2+ estão prontos: composer --version e php --version",
          "cd C:/xampp/htdocs && composer create-project laravel/laravel meu-app",
          "Crie banco 'meu_app' no phpMyAdmin com charset utf8mb4_unicode_ci",
          "Edite .env com APP_URL=http://meuapp.local e DB_HOST=127.0.0.1",
          "php artisan key:generate && php artisan migrate",
          "Adicione virtual host meuapp.local apontando para meu-app/public",
          "Edite o arquivo hosts (como admin): 127.0.0.1 meuapp.local",
          "Reinicie o Apache",
          "Acesse http://meuapp.local",
        ]}
        verify="A página com o logo do Laravel e os links da documentação aparece sem erros e o devtools mostra status 200."
      />

      <h2>7. Permissões em Linux/macOS</h2>
      <p>
        Em Linux/macOS o Apache roda como o usuário <code>daemon</code> (no
        XAMPP) ou <code>www-data</code> (em distros). As pastas{" "}
        <code>storage/</code> e <code>bootstrap/cache/</code> precisam ser
        graváveis por esse usuário:
      </p>
      <CodeBlock language="bash" code={`cd /opt/lampp/htdocs/meu-app
sudo chown -R daemon:daemon storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Ou jeito mais permissivo (só em dev local!):
sudo chmod -R 777 storage bootstrap/cache`} />
      <AlertBox type="warning" title="777 só em dev — nunca em produção">
        <code>chmod 777</code> deixa qualquer usuário do sistema escrever na
        pasta. Em servidor de produção, use <code>775</code> com o dono certo
        ou ACLs (<code>setfacl</code>).
      </AlertBox>

      <h2>8. Vite + Apache (assets em paralelo)</h2>
      <p>
        Laravel 11 usa <strong>Vite</strong> (substitui o Laravel Mix). Em
        desenvolvimento, rode os assets em paralelo:
      </p>
      <CodeBlock language="bash" code={`# Em outra aba do terminal
cd C:/xampp/htdocs/meu-app
npm install
npm run dev   # sobe o Vite em http://localhost:5173 com HMR (Hot Module Replacement)`} />
      <p>
        O Apache continua servindo o PHP em{" "}
        <code>http://meuapp.local</code>; o Blade carrega os assets do Vite
        via diretiva <code>@vite([...])</code>. Quando subir para produção,
        rode <code>npm run build</code> — o Vite gera arquivos estáticos
        otimizados em <code>public/build/</code>.
      </p>
      <CodeBlock title="resources/views/layouts/app.blade.php" language="html" code={`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>{{ config('app.name') }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    @yield('conteudo')
</body>
</html>`} />

      <h2>9. Filas (Queues) e Agendador (Scheduler)</h2>
      <p>
        Tarefas pesadas (envio de e-mail, processamento de imagem, geração
        de PDF) não devem travar a request HTTP. Mande para a fila:
      </p>
      <CodeBlock language="bash" code={`# Tabela jobs já vem nas migrations padrão. Confirme:
php artisan queue:table       # cria a migration se não existir
php artisan migrate

# Inicie um worker (mantenha rodando em outra aba)
php artisan queue:work --tries=3 --timeout=60

# Crie um job
php artisan make:job EnviarBoletoEmail`} />
      <p>
        O <strong>Scheduler</strong> roda comandos a cada minuto, hora, dia
        etc., declarados em <code>routes/console.php</code> (Laravel 11) ou{" "}
        <code>app/Console/Kernel.php</code> (Laravel 10):
      </p>
      <CodeBlock title="routes/console.php (L11)" language="php" code={`use Illuminate\\Support\\Facades\\Schedule;

Schedule::command('inspire')->hourly();
Schedule::command('app:limpar-uploads-temporarios')->dailyAt('03:00');`} />
      <p>
        Em produção, registre uma única tarefa no cron que dispara o
        scheduler a cada minuto:
      </p>
      <CodeBlock language="bash" code={`# Linux/macOS — crontab -e
* * * * * cd /var/www/meu-app && php artisan schedule:run >> /dev/null 2>&1

# Em dev/Windows, rode manualmente para testar
php artisan schedule:work    # fica em loop chamando schedule:run a cada minuto`} />

      <h2>10. Testes automatizados</h2>
      <p>
        O Laravel já vem com <strong>PHPUnit</strong> (e opcionalmente Pest)
        configurado. Rode com:
      </p>
      <CodeBlock language="bash" code={`php artisan test                  # roda todos os testes
php artisan test --filter UserTest
php artisan test --parallel       # paraleliza pelos cores da CPU`} />
      <p>
        Em <code>phpunit.xml</code>, o ambiente de teste por padrão usa
        SQLite em memória — então os testes não bagunçam o banco de
        desenvolvimento.
      </p>

      <h2>Erros mais comuns</h2>
      <ul>
        <li>
          <strong>"No application encryption key has been specified"</strong>
          {" "}— esqueceu de rodar <code>php artisan key:generate</code>.
        </li>
        <li>
          <strong>"SQLSTATE[HY000] [2002] Connection refused"</strong> — o
          MySQL não está rodando, ou está em outra porta. Confira{" "}
          <code>DB_HOST=127.0.0.1</code> (em vez de <code>localhost</code>).
        </li>
        <li>
          <strong>"file_put_contents... failed to open stream"</strong> —
          permissão de escrita em <code>storage/logs/</code> ou{" "}
          <code>bootstrap/cache/</code> (veja seção 7).
        </li>
        <li>
          <strong>"The Vite manifest does not exist"</strong> — você não
          rodou <code>npm install &amp;&amp; npm run dev</code> (em dev) ou{" "}
          <code>npm run build</code> (em produção).
        </li>
        <li>
          <strong>404 em todas as rotas exceto a raiz</strong> —{" "}
          <code>mod_rewrite</code> desabilitado ou{" "}
          <code>AllowOverride None</code> no Directory do{" "}
          <code>public/</code>. Confira <code>public/.htaccess</code>{" "}
          existindo.
        </li>
        <li>
          <strong>"Class 'PDO' not found"</strong> — extensão{" "}
          <code>pdo_mysql</code> não habilitada no <code>php.ini</code>.
        </li>
        <li>
          <strong>419 Page Expired</strong> — token CSRF expirou ou está
          faltando <code>@csrf</code> no formulário Blade.
        </li>
      </ul>

      <h2>Comandos artisan que você vai usar todo dia</h2>
      <CodeBlock language="bash" code={`php artisan make:model Produto -mfc      # Model + migration + factory + controller
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
php artisan optimize:clear`} />

      <AlertBox type="success" title="php artisan serve continua valendo">
        Para projetos rápidos, <code>php artisan serve</code> sobe um
        servidor PHP nativo na 8000. Não precisa de Apache nem mod_rewrite.
        Mas você perde a chance de testar virtual hosts, .htaccess,
        compressão, headers, certificados e tudo o que vai existir em
        produção. Para o XAMPP fazer sentido, prefira o virtual host.
      </AlertBox>

      <AlertBox type="info" title="Para colocar em produção">
        Veja <a href="#/migrar-producao">Migrando para produção</a>. Os
        cuidados extras são: <code>APP_DEBUG=false</code>,{" "}
        <code>APP_ENV=production</code>, OPcache ligado,{" "}
        <code>php artisan config:cache</code>, banco com senha forte e HTTPS
        forçado.
      </AlertBox>
    </PageContainer>
  );
}
