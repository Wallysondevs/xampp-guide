import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function PhpCli() {
  return (
    <PageContainer
      title="PHP no terminal — CLI, scripts e o servidor embutido"
      subtitle="O outro PHP que você nem percebeu que tem instalado: rodar scripts pela linha de comando, subir um servidor de teste sem Apache, REPL interativo e migrações."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <AlertBox type="info" title="Mesmo PHP, outro SAPI">
        O <code>php.exe</code> do XAMPP é o mesmo binário do que roda dentro do Apache, mas usa
        outro <strong>SAPI</strong> (cli em vez de apache2handler). Em geral lê o mesmo{" "}
        <code>php.ini</code>, mas pode ter limites diferentes (ex.: sem <code>max_execution_time</code>).
      </AlertBox>

      <h2>Adicionando ao PATH</h2>
      <p>
        Para chamar <code>php</code> de qualquer pasta no Windows:
      </p>
      <CodeBlock
        title="PowerShell (sessão atual)"
        language="powershell"
        code={`$env:Path = "C:\\xampp\\php;$env:Path"
php -v`}
      />
      <CodeBlock
        title="Permanente (variáveis de ambiente do sistema)"
        language="text"
        code={`Win + R → sysdm.cpl → Avançado → Variáveis de Ambiente
→ Path → Editar → Novo → C:\\xampp\\php
→ Reabra o terminal e teste: php -v`}
      />
      <CodeBlock
        title="Linux"
        language="bash"
        code={`echo 'export PATH="/opt/lampp/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc`}
      />

      <h2>Comandos essenciais</h2>
      <ParamsTable
        title="Flags do php"
        params={[
          { flag: "-v", desc: "Versão e SAPI." },
          { flag: "-i", desc: "phpinfo() em texto puro." },
          { flag: "-m", desc: "Lista módulos carregados." },
          { flag: "-r 'codigo'", desc: "Executa uma linha (sem <?php)." },
          { flag: "-a", desc: "REPL interativo (precisa readline)." },
          { flag: "-l arquivo", desc: "Lint — checa sintaxe sem executar." },
          { flag: "-f script.php arg1 arg2", desc: "Executa script (--f é opcional)." },
          { flag: "-d chave=valor", desc: "Sobrescreve diretiva do php.ini só nessa execução." },
          { flag: "-c outro.ini", desc: "Usa outro php.ini." },
          { flag: "-S host:porta", desc: "Servidor web embutido." },
          { flag: "-t pasta", desc: "Document root para o -S." },
          { flag: "--ini", desc: "Mostra qual php.ini foi carregado." },
          { flag: "--rf func", desc: "Mostra assinatura de função (Reflection)." },
          { flag: "--rc Classe", desc: "Mostra estrutura de classe." },
        ]}
      />

      <h2>Executando scripts</h2>
      <CodeBlock
        title="hello.php"
        language="php"
        code={`<?php
// Argumentos: $argv[0] é o nome do script
echo "Olá, " . ($argv[1] ?? 'mundo') . "!\\n";
echo "Total args: " . ($argc - 1) . "\\n";`}
      />
      <CodeBlock
        language="bash"
        code={`php hello.php Maria
# Olá, Maria!
# Total args: 1

# Pipe — leia stdin
echo "abc" | php -r 'echo strtoupper(file_get_contents("php://stdin"));'`}
      />

      <h2>Servidor embutido (built-in server)</h2>
      <p>
        Desde PHP 5.4 existe um servidor HTTP simples para desenvolvimento. <strong>Não use em
        produção</strong>, mas para testes locais é instantâneo:
      </p>
      <CodeBlock
        language="bash"
        code={`# Sobe servindo a pasta atual em http://localhost:8000
php -S localhost:8000

# Outro document root
php -S localhost:8000 -t public/

# Roteador (front controller — Laravel/Slim style)
php -S localhost:8000 -t public/ public/index.php

# Aceita conexão de outras máquinas da rede
php -S 0.0.0.0:8000`}
      />
      <p>O log fica direto no terminal:</p>
      <CodeBlock
        language="text"
        code={`PHP 8.4.3 Development Server (http://localhost:8000) started
[Sun May 03 14:30:21 2026] 127.0.0.1:55012 [200]: GET /
[Sun May 03 14:30:23 2026] 127.0.0.1:55013 [404]: GET /favicon.ico`}
      />
      <AlertBox type="warning" title="Não escala">
        O servidor embutido é single-threaded e processa uma requisição por vez. Se uma página
        levar 5s, a próxima espera. Para mais de uma pessoa testando, volte para Apache.
      </AlertBox>

      <h2>REPL interativo</h2>
      <CodeBlock
        language="bash"
        code={`php -a
# Interactive shell

php > $a = [1, 2, 3, 4, 5];
php > echo array_sum($a);
15
php > exit`}
      />
      <p>
        Dica: instale <code>psysh</code> (via Composer) — REPL muito superior, com autocompletar e
        debug.
      </p>

      <h2>Composer no CLI</h2>
      <CodeBlock
        language="bash"
        code={`# Inicializar projeto
composer init

# Instalar pacote
composer require monolog/monolog

# Instalar tudo do composer.json
composer install

# Atualizar dentro dos limites do composer.json
composer update

# Atualizar 1 pacote
composer update vendor/pacote

# Listar pacotes desatualizados
composer outdated --direct

# Executar script definido em composer.json
composer test
composer run-script meu-script

# Auto-load + recarrega
composer dump-autoload -o`}
      />

      <h2>Lint em projeto inteiro</h2>
      <CodeBlock
        language="bash"
        code={`# Linux / Git Bash
find . -name "*.php" -not -path "./vendor/*" -print0 \\
    | xargs -0 -n1 -P4 php -l | grep -v "No syntax"

# PowerShell
Get-ChildItem -Recurse -Include *.php -Exclude vendor |
    ForEach-Object { php -l $_.FullName } |
    Where-Object { $_ -notmatch "No syntax" }`}
      />

      <h2>Tarefas de manutenção (Artisan / Symfony Console)</h2>
      <p>Frameworks expõem suas próprias CLIs:</p>
      <CodeBlock
        language="bash"
        code={`# Laravel
php artisan migrate
php artisan make:controller PedidoController
php artisan tinker             # REPL com app carregado

# Symfony
php bin/console doctrine:migrations:migrate
php bin/console make:entity
php bin/console debug:router`}
      />

      <h2>Receitas</h2>

      <h3>Snippet rápido sem arquivo</h3>
      <CodeBlock
        language="bash"
        code={`# Hash de senha
php -r 'echo password_hash("123", PASSWORD_BCRYPT) . PHP_EOL;'

# Decodifica JSON da clipboard (Linux)
xclip -o -selection clipboard | php -r 'print_r(json_decode(file_get_contents("php://stdin"), true));'

# Timestamp atual
php -r 'echo time();'

# Verifica se uma extensão está carregada
php -r 'echo extension_loaded("curl") ? "ok" : "faltando";'`}
      />

      <h3>Cron / Agendador chamando script</h3>
      <CodeBlock
        title="Linux crontab"
        language="bash"
        code={`# Toda hora cheia
0 * * * * /opt/lampp/bin/php /var/www/site/cron/limpar.php >> /var/log/site-cron.log 2>&1`}
      />
      <CodeBlock
        title="Windows — Agendador de Tarefas"
        language="text"
        code={`Programa:    C:\\xampp\\php\\php.exe
Argumentos:  C:\\xampp\\htdocs\\site\\cron\\limpar.php
Iniciar em:  C:\\xampp\\htdocs\\site
Frequência:  diária 03:00`}
      />

      <h3>Migração de dados em massa</h3>
      <CodeBlock
        title="migrar.php — uso intensivo de memória"
        language="php"
        code={`<?php
ini_set('memory_limit', '1G');
ini_set('max_execution_time', 0);  // sem limite (CLI já é assim)

require __DIR__ . '/vendor/autoload.php';

$pdo = new PDO('mysql:host=127.0.0.1;dbname=loja', 'app', 'pwd');
$stmt = $pdo->query('SELECT id, dados FROM legado');

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    // processa, normaliza, insere
    echo "Linha {$row['id']}\\n";
}`}
      />
      <CodeBlock
        language="bash"
        code={`# Saída em arquivo + erros visíveis
php migrar.php > saida.log 2> erros.log

# Acompanhe em outra janela
tail -f saida.log`}
      />

      <h2>php.ini do CLI ≠ Apache</h2>
      <p>
        Em distribuições Linux fora do XAMPP, o CLI usa <code>/etc/php/8.x/cli/php.ini</code> e o
        Apache usa <code>/etc/php/8.x/apache2/php.ini</code>. No XAMPP normalmente é o mesmo
        arquivo, mas confirme:
      </p>
      <CodeBlock
        language="bash"
        code={`php --ini
# Configuration File (php.ini) Path: C:\\xampp\\php
# Loaded Configuration File:         C:\\xampp\\php\\php.ini`}
      />

      <h2>Armadilhas</h2>
      <ul>
        <li>
          Adicionou ao PATH e ainda chama outro PHP — Windows tem um <code>php.exe</code> em outras
          pastas (Composer, Laragon). Confira com <code>where php</code> /{" "}
          <code>which php</code>.
        </li>
        <li>
          <strong>STDIN bloqueando</strong> — script que faz <code>fgets(STDIN)</code> trava no
          cron porque não há terminal.
        </li>
        <li>
          Esquecer <code>memory_limit</code> em script de massa — fatal error após 128&nbsp;MB.
        </li>
        <li>
          Caminhos relativos no CLI são relativos à pasta de execução, não ao script —
          use <code>__DIR__</code>.
        </li>
      </ul>
    </PageContainer>
  );
}
