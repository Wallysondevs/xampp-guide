import{j as e}from"./index-BreI0dyu.js";import{P as s,A as o}from"./AlertBox-C_bJKc46.js";import{C as a}from"./CodeBlock-D0rWxPIU.js";import{P as i}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function d(){return e.jsxs(s,{title:"PHP no terminal — CLI, scripts e o servidor embutido",subtitle:"O outro PHP que você nem percebeu que tem instalado: rodar scripts pela linha de comando, subir um servidor de teste sem Apache, REPL interativo e migrações.",difficulty:"iniciante",timeToRead:"10 min",children:[e.jsxs(o,{type:"info",title:"Mesmo PHP, outro SAPI",children:["O ",e.jsx("code",{children:"php.exe"})," do XAMPP é o mesmo binário do que roda dentro do Apache, mas usa outro ",e.jsx("strong",{children:"SAPI"})," (cli em vez de apache2handler). Em geral lê o mesmo"," ",e.jsx("code",{children:"php.ini"}),", mas pode ter limites diferentes (ex.: sem ",e.jsx("code",{children:"max_execution_time"}),")."]}),e.jsx("h2",{children:"Adicionando ao PATH"}),e.jsxs("p",{children:["Para chamar ",e.jsx("code",{children:"php"})," de qualquer pasta no Windows:"]}),e.jsx(a,{title:"PowerShell (sessão atual)",language:"powershell",code:`$env:Path = "C:\\xampp\\php;$env:Path"
php -v`}),e.jsx(a,{title:"Permanente (variáveis de ambiente do sistema)",language:"text",code:`Win + R → sysdm.cpl → Avançado → Variáveis de Ambiente
→ Path → Editar → Novo → C:\\xampp\\php
→ Reabra o terminal e teste: php -v`}),e.jsx(a,{title:"Linux",language:"bash",code:`echo 'export PATH="/opt/lampp/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc`}),e.jsx("h2",{children:"Comandos essenciais"}),e.jsx(i,{title:"Flags do php",params:[{flag:"-v",desc:"Versão e SAPI."},{flag:"-i",desc:"phpinfo() em texto puro."},{flag:"-m",desc:"Lista módulos carregados."},{flag:"-r 'codigo'",desc:"Executa uma linha (sem <?php)."},{flag:"-a",desc:"REPL interativo (precisa readline)."},{flag:"-l arquivo",desc:"Lint — checa sintaxe sem executar."},{flag:"-f script.php arg1 arg2",desc:"Executa script (--f é opcional)."},{flag:"-d chave=valor",desc:"Sobrescreve diretiva do php.ini só nessa execução."},{flag:"-c outro.ini",desc:"Usa outro php.ini."},{flag:"-S host:porta",desc:"Servidor web embutido."},{flag:"-t pasta",desc:"Document root para o -S."},{flag:"--ini",desc:"Mostra qual php.ini foi carregado."},{flag:"--rf func",desc:"Mostra assinatura de função (Reflection)."},{flag:"--rc Classe",desc:"Mostra estrutura de classe."}]}),e.jsx("h2",{children:"Executando scripts"}),e.jsx(a,{title:"hello.php",language:"php",code:`<?php
// Argumentos: $argv[0] é o nome do script
echo "Olá, " . ($argv[1] ?? 'mundo') . "!\\n";
echo "Total args: " . ($argc - 1) . "\\n";`}),e.jsx(a,{language:"bash",code:`php hello.php Maria
# Olá, Maria!
# Total args: 1

# Pipe — leia stdin
echo "abc" | php -r 'echo strtoupper(file_get_contents("php://stdin"));'`}),e.jsx("h2",{children:"Servidor embutido (built-in server)"}),e.jsxs("p",{children:["Desde PHP 5.4 existe um servidor HTTP simples para desenvolvimento. ",e.jsx("strong",{children:"Não use em produção"}),", mas para testes locais é instantâneo:"]}),e.jsx(a,{language:"bash",code:`# Sobe servindo a pasta atual em http://localhost:8000
php -S localhost:8000

# Outro document root
php -S localhost:8000 -t public/

# Roteador (front controller — Laravel/Slim style)
php -S localhost:8000 -t public/ public/index.php

# Aceita conexão de outras máquinas da rede
php -S 0.0.0.0:8000`}),e.jsx("p",{children:"O log fica direto no terminal:"}),e.jsx(a,{language:"text",code:`PHP 8.4.3 Development Server (http://localhost:8000) started
[Sun May 03 14:30:21 2026] 127.0.0.1:55012 [200]: GET /
[Sun May 03 14:30:23 2026] 127.0.0.1:55013 [404]: GET /favicon.ico`}),e.jsx(o,{type:"warning",title:"Não escala",children:"O servidor embutido é single-threaded e processa uma requisição por vez. Se uma página levar 5s, a próxima espera. Para mais de uma pessoa testando, volte para Apache."}),e.jsx("h2",{children:"REPL interativo"}),e.jsx(a,{language:"bash",code:`php -a
# Interactive shell

php > $a = [1, 2, 3, 4, 5];
php > echo array_sum($a);
15
php > exit`}),e.jsxs("p",{children:["Dica: instale ",e.jsx("code",{children:"psysh"})," (via Composer) — REPL muito superior, com autocompletar e debug."]}),e.jsx("h2",{children:"Composer no CLI"}),e.jsx(a,{language:"bash",code:`# Inicializar projeto
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
composer dump-autoload -o`}),e.jsx("h2",{children:"Lint em projeto inteiro"}),e.jsx(a,{language:"bash",code:`# Linux / Git Bash
find . -name "*.php" -not -path "./vendor/*" -print0 \\
    | xargs -0 -n1 -P4 php -l | grep -v "No syntax"

# PowerShell
Get-ChildItem -Recurse -Include *.php -Exclude vendor |
    ForEach-Object { php -l $_.FullName } |
    Where-Object { $_ -notmatch "No syntax" }`}),e.jsx("h2",{children:"Tarefas de manutenção (Artisan / Symfony Console)"}),e.jsx("p",{children:"Frameworks expõem suas próprias CLIs:"}),e.jsx(a,{language:"bash",code:`# Laravel
php artisan migrate
php artisan make:controller PedidoController
php artisan tinker             # REPL com app carregado

# Symfony
php bin/console doctrine:migrations:migrate
php bin/console make:entity
php bin/console debug:router`}),e.jsx("h2",{children:"Receitas"}),e.jsx("h3",{children:"Snippet rápido sem arquivo"}),e.jsx(a,{language:"bash",code:`# Hash de senha
php -r 'echo password_hash("123", PASSWORD_BCRYPT) . PHP_EOL;'

# Decodifica JSON da clipboard (Linux)
xclip -o -selection clipboard | php -r 'print_r(json_decode(file_get_contents("php://stdin"), true));'

# Timestamp atual
php -r 'echo time();'

# Verifica se uma extensão está carregada
php -r 'echo extension_loaded("curl") ? "ok" : "faltando";'`}),e.jsx("h3",{children:"Cron / Agendador chamando script"}),e.jsx(a,{title:"Linux crontab",language:"bash",code:`# Toda hora cheia
0 * * * * /opt/lampp/bin/php /var/www/site/cron/limpar.php >> /var/log/site-cron.log 2>&1`}),e.jsx(a,{title:"Windows — Agendador de Tarefas",language:"text",code:`Programa:    C:\\xampp\\php\\php.exe
Argumentos:  C:\\xampp\\htdocs\\site\\cron\\limpar.php
Iniciar em:  C:\\xampp\\htdocs\\site
Frequência:  diária 03:00`}),e.jsx("h3",{children:"Migração de dados em massa"}),e.jsx(a,{title:"migrar.php — uso intensivo de memória",language:"php",code:`<?php
ini_set('memory_limit', '1G');
ini_set('max_execution_time', 0);  // sem limite (CLI já é assim)

require __DIR__ . '/vendor/autoload.php';

$pdo = new PDO('mysql:host=127.0.0.1;dbname=loja', 'app', 'pwd');
$stmt = $pdo->query('SELECT id, dados FROM legado');

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    // processa, normaliza, insere
    echo "Linha {$row['id']}\\n";
}`}),e.jsx(a,{language:"bash",code:`# Saída em arquivo + erros visíveis
php migrar.php > saida.log 2> erros.log

# Acompanhe em outra janela
tail -f saida.log`}),e.jsx("h2",{children:"php.ini do CLI ≠ Apache"}),e.jsxs("p",{children:["Em distribuições Linux fora do XAMPP, o CLI usa ",e.jsx("code",{children:"/etc/php/8.x/cli/php.ini"})," e o Apache usa ",e.jsx("code",{children:"/etc/php/8.x/apache2/php.ini"}),". No XAMPP normalmente é o mesmo arquivo, mas confirme:"]}),e.jsx(a,{language:"bash",code:`php --ini
# Configuration File (php.ini) Path: C:\\xampp\\php
# Loaded Configuration File:         C:\\xampp\\php\\php.ini`}),e.jsx("h2",{children:"Armadilhas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Adicionou ao PATH e ainda chama outro PHP — Windows tem um ",e.jsx("code",{children:"php.exe"})," em outras pastas (Composer, Laragon). Confira com ",e.jsx("code",{children:"where php"})," /"," ",e.jsx("code",{children:"which php"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"STDIN bloqueando"})," — script que faz ",e.jsx("code",{children:"fgets(STDIN)"})," trava no cron porque não há terminal."]}),e.jsxs("li",{children:["Esquecer ",e.jsx("code",{children:"memory_limit"})," em script de massa — fatal error após 128 MB."]}),e.jsxs("li",{children:["Caminhos relativos no CLI são relativos à pasta de execução, não ao script — use ",e.jsx("code",{children:"__DIR__"}),"."]})]})]})}export{d as default};
