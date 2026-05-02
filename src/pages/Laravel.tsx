import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function Laravel() {
  return (
    <PageContainer
      title="Hospedando Laravel no XAMPP"
      subtitle="Crie um projeto Laravel novo e sirva-o pelo Apache do XAMPP — com URL bonita e sem conflito com a pasta /public."
      difficulty="intermediario"
      timeToRead="9 min"
    >
      <p>
        O Laravel já vem com um servidor embutido (<code>php artisan serve</code>),
        mas para mexer em virtual hosts, configurar TLS local, simular o
        ambiente de produção (Apache + .htaccess + mod_rewrite), o XAMPP é o
        amigo certo.
      </p>

      <h2>Pré-requisitos</h2>
      <ul>
        <li>PHP 8.2 ou superior (Laravel 11 exige).</li>
        <li>Composer instalado (veja <a href="#/composer">Composer</a>).</li>
        <li>Extensões habilitadas: <code>mbstring</code>, <code>openssl</code>, <code>pdo_mysql</code>, <code>tokenizer</code>, <code>xml</code>, <code>ctype</code>, <code>json</code>, <code>bcmath</code>, <code>fileinfo</code>, <code>curl</code>.</li>
      </ul>

      <h2>1. Crie o projeto</h2>
      <CodeBlock language="bash" code={`cd C:/xampp/htdocs
composer create-project laravel/laravel meu-app

# Ou com a versão exata
composer create-project laravel/laravel:^11.0 meu-app

cd meu-app

# Gera a APP_KEY
php artisan key:generate`} />

      <h2>2. Banco de dados</h2>
      <p>Crie o banco pelo phpMyAdmin (ex: <code>meu_app</code>) e edite o <code>.env</code>:</p>
      <CodeBlock title=".env" language="bash" code={`APP_NAME="Meu App"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://meuapp.local

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=meu_app
DB_USERNAME=root
DB_PASSWORD=`} />
      <p>Rode as migrations:</p>
      <CodeBlock language="bash" code={`php artisan migrate`} />

      <h2>3. Servir pelo Apache (jeito simples)</h2>
      <p>
        Acesse <code>http://localhost/meu-app/public</code>. Funciona, mas
        com o sufixo <code>/public</code> feio.
      </p>

      <h2>3. Servir pelo Apache (jeito bonito — Virtual Host)</h2>
      <p>Edite <code>apache/conf/extra/httpd-vhosts.conf</code>:</p>
      <CodeBlock language="apache" code={`<VirtualHost *:80>
    ServerName meuapp.local
    DocumentRoot "C:/xampp/htdocs/meu-app/public"

    <Directory "C:/xampp/htdocs/meu-app/public">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog "logs/meuapp-error.log"
    CustomLog "logs/meuapp-access.log" common
</VirtualHost>`} />
      <p>Adicione no arquivo hosts do sistema:</p>
      <CodeBlock language="text" code={`127.0.0.1   meuapp.local`} />
      <p>Reinicie o Apache. Acesse <code>http://meuapp.local</code>.</p>

      <PracticeBox
        title="Criar projeto Laravel no XAMPP do zero"
        goal="Ver a tela de boas-vindas do Laravel em http://meuapp.local."
        steps={[
          "Confirme que Composer e PHP 8.2+ estão prontos: composer --version e php --version",
          "cd C:/xampp/htdocs && composer create-project laravel/laravel meu-app",
          "Crie banco 'meu_app' no phpMyAdmin",
          "Edite .env com as credenciais",
          "php artisan key:generate && php artisan migrate",
          "Adicione virtual host meuapp.local apontando para meu-app/public",
          "Edite o arquivo hosts: 127.0.0.1 meuapp.local",
          "Reinicie o Apache",
          "Acesse http://meuapp.local",
        ]}
        verify="A página com o logo do Laravel e os links da documentação aparece sem erros."
      />

      <h2>4. Permissões em Linux/macOS</h2>
      <p>
        Em Linux/macOS o Apache roda como o usuário <code>daemon</code> (ou{" "}
        <code>www-data</code>). As pastas <code>storage/</code> e{" "}
        <code>bootstrap/cache/</code> precisam ser graváveis:
      </p>
      <CodeBlock language="bash" code={`cd /opt/lampp/htdocs/meu-app
sudo chown -R daemon:daemon storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache`} />

      <h2>Erros mais comuns</h2>
      <ul>
        <li>
          <strong>"No application encryption key has been specified"</strong> —
          esqueceu de rodar <code>php artisan key:generate</code>.
        </li>
        <li>
          <strong>"SQLSTATE[HY000] [2002] Connection refused"</strong> — o
          MySQL não está rodando, ou está em outra porta. Confira{" "}
          <code>DB_HOST=127.0.0.1</code> (em vez de <code>localhost</code>{" "}
          às vezes resolve).
        </li>
        <li>
          <strong>"file_put_contents... failed to open stream"</strong> —
          permissão de escrita em <code>storage/logs/</code> (veja seção 4).
        </li>
        <li>
          <strong>"The Mix manifest does not exist"</strong> — você não rodou
          <code>npm install && npm run dev</code> para compilar os assets.
        </li>
        <li>
          <strong>404 em todas as rotas exceto a raiz</strong> —{" "}
          <code>mod_rewrite</code> desabilitado ou <code>AllowOverride None</code>.
        </li>
      </ul>

      <h2>Vite + Apache</h2>
      <p>
        Laravel 11 usa Vite. Em desenvolvimento, rode os assets em paralelo:
      </p>
      <CodeBlock language="bash" code={`npm install
npm run dev   # roda o vite-server em http://localhost:5173`} />
      <p>
        O Apache continua servindo o PHP em <code>http://meuapp.local</code>;
        o Blade carrega os assets do Vite via <code>@vite()</code>. Ambos
        rodam ao mesmo tempo.
      </p>

      <AlertBox type="success" title="php artisan serve continua valendo">
        Para projetos rápidos, <code>php artisan serve</code> sobe um
        servidor PHP nativo na 8000. Não precisa de Apache nem mod_rewrite.
        Mas você perde a chance de testar o ambiente igualzinho ao da
        produção.
      </AlertBox>
    </PageContainer>
  );
}
