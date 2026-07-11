import{j as e}from"./index-BreI0dyu.js";import{P as d,A as a}from"./AlertBox-C_bJKc46.js";import{C as o}from"./CodeBlock-D0rWxPIU.js";import{P as r}from"./ParamsTable-DyRs6_CQ.js";import{P as i}from"./PracticeBox-BV05Hsfh.js";import"./circle-alert-_acnmM4q.js";function p(){return e.jsxs(d,{title:"Xdebug — debug profissional no PHP",subtitle:"Os 6 modos do Xdebug 3, instalação, configuração para VS Code/PHPStorm/Sublime, breakpoints, profile com cachegrind, code coverage, function trace e diagnóstico do próprio Xdebug.",difficulty:"avancado",timeToRead:"14 min",children:[e.jsxs(a,{type:"info",title:"Pré-requisitos",children:["XAMPP rodando, capítulos de ",e.jsx("a",{href:"#/php-ini",children:"php.ini"})," e"," ",e.jsx("a",{href:"#/php-extensoes",children:"extensões"})," lidos. Editor instalado (VS Code ou PHPStorm). Saber criar arquivos .php em ",e.jsx("code",{children:"htdocs/"}),"."]}),e.jsx("h2",{children:"O que é o Xdebug"}),e.jsxs("p",{children:["Xdebug é uma ",e.jsx("strong",{children:"extensão Zend"}),' mantida por Derick Rethans desde 2002. Adiciona ao PHP capacidades que o engine original não tem: pausar execução em uma linha, inspecionar variáveis, andar passo a passo, gerar profile de performance, coverage de testes e log detalhado de chamadas. É a ferramenta que separa o "vou colocar um ',e.jsx("code",{children:"echo"}),' aqui" do trabalho profissional.']}),e.jsx("h2",{children:"Glossário rápido"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Breakpoint"})," — linha onde o Xdebug pausa a execução e devolve o controle para a IDE."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Step into / over / out"})," — comandos para avançar a execução de um em um (entra em funções / pula por cima / sai da função atual)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"DBGp"})," — protocolo binário pelo qual o Xdebug fala com a IDE. Padrão da indústria — toda IDE PHP suporta."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Cachegrind"})," — formato de arquivo de profile usado pelo Valgrind. Xdebug gera nesse formato; ferramentas como QCachegrind / KCacheGrind / Webgrind visualizam."]}),e.jsx("h2",{children:"Os 6 modos do Xdebug 3"}),e.jsxs("p",{children:["Xdebug 3 unificou tudo em ",e.jsx("code",{children:"xdebug.mode"}),". Você habilita só o que precisar — o modo desligado tem custo zero."]}),e.jsx(r,{title:"Modos disponíveis (separe por vírgula para combinar)",params:[{flag:"off",desc:"Tudo desligado, custo zero. Não há nem var_dump turbinado."},{flag:"develop",desc:"var_dump com cores e stack trace, file:line nos erros, melhor formatação. ATIVO em dev sempre."},{flag:"debug",desc:"Step debugger via DBGp. Para usar com IDE."},{flag:"profile",desc:"Gera arquivos cachegrind para análise de performance."},{flag:"coverage",desc:"Reporta linhas executadas (necessário para PHPUnit code coverage)."},{flag:"trace",desc:"Loga cada chamada de função em arquivo. Útil para entender fluxos enormes."},{flag:"gcstats",desc:"Estatísticas do garbage collector. Raro."}]}),e.jsx("h2",{children:"1. Confirme se o XAMPP já tem Xdebug"}),e.jsxs("p",{children:["Crie um ",e.jsx("code",{children:"htdocs/info.php"})," com"," ",e.jsx("code",{children:"<?php phpinfo(); ?>"}),", abra no navegador e procure por ",e.jsx("strong",{children:"Xdebug"}),". Se a seção existe, ele está instalado — só talvez desligado."]}),e.jsxs("p",{children:["XAMPP recente já vem com Xdebug 3 incluído em"," ",e.jsx("code",{children:"php/ext/php_xdebug.dll"}),"."]}),e.jsx("h2",{children:"Se NÃO tiver — instale"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Acesse"," ",e.jsx("a",{href:"https://xdebug.org/wizard",target:"_blank",rel:"noreferrer",children:"xdebug.org/wizard"})," ","— cole a saída completa do ",e.jsx("code",{children:"phpinfo()"})," (Ctrl+A em info.php → copiar fonte da página)."]}),e.jsxs("li",{children:["O wizard te diz exatamente qual ",e.jsx("code",{children:".dll"})," baixar."]}),e.jsxs("li",{children:["Salve o arquivo como ",e.jsx("code",{children:"php_xdebug.dll"})," em ",e.jsx("code",{children:"C:/xampp/php/ext/"}),"."]}),e.jsxs("li",{children:["Adicione no ",e.jsx("code",{children:"php.ini"})," (próximo passo)."]})]}),e.jsx("h2",{children:"2. Habilite no php.ini"}),e.jsxs("p",{children:["Procure pela seção ",e.jsx("code",{children:"[XDebug]"})," no final do"," ",e.jsx("code",{children:"php.ini"})," (pode estar comentada). Configure:"]}),e.jsx(o,{language:"ini",code:`[XDebug]
zend_extension = xdebug

; Modos (Xdebug 3) — separe por vírgula
;   develop  - var_dump turbinado
;   debug    - breakpoints (precisa IDE)
;   profile  - profile de performance (cachegrind)
;   coverage - coverage de testes
;   trace    - log de cada chamada de função
xdebug.mode = develop,debug

; QUANDO o Xdebug deve iniciar a sessão de debug
;   yes      - sempre (cuidado: várias conexões IDE para cada request)
;   trigger  - só se houver cookie/GET/POST XDEBUG_TRIGGER
;   no       - manualmente via xdebug_break() no código
xdebug.start_with_request = trigger

; Onde a IDE está escutando
xdebug.client_host = 127.0.0.1
xdebug.client_port = 9003
xdebug.idekey = VSCODE

; Log do PRÓPRIO Xdebug (para depurar a configuração)
xdebug.log = "C:/xampp/php/logs/xdebug.log"
xdebug.log_level = 7

; Profile (quando mode=profile)
xdebug.output_dir = "C:/xampp/tmp"
xdebug.profiler_output_name = "cachegrind.out.%t-%p"

; Display tweaks (mode=develop)
xdebug.var_display_max_depth = 10
xdebug.var_display_max_children = 256
xdebug.var_display_max_data = 1024`}),e.jsx("p",{children:"Reinicie o Apache."}),e.jsxs(a,{type:"warning",title:"Xdebug 2 vs Xdebug 3",children:["Se você está em um XAMPP antigo, a sintaxe é diferente:"," ",e.jsx("code",{children:"xdebug.remote_enable=1"}),","," ",e.jsx("code",{children:"xdebug.remote_port=9000"}),","," ",e.jsx("code",{children:"xdebug.remote_autostart=1"}),". Xdebug 3 unificou tudo nas diretivas ",e.jsx("code",{children:"mode"}),", ",e.jsx("code",{children:"client_host"}),","," ",e.jsx("code",{children:"client_port"}),". A porta padrão do Xdebug 3 é"," ",e.jsx("strong",{children:"9003"})," (no 2 era 9000)."]}),e.jsx("h2",{children:"3. Configure o VS Code"}),e.jsxs("p",{children:['Instale a extensão "',e.jsx("strong",{children:"PHP Debug"}),'" (Xdebug autora, ID: ',e.jsx("code",{children:"xdebug.php-debug"}),"). Crie em"," ",e.jsx("code",{children:".vscode/launch.json"}),":"]}),e.jsx(o,{title:".vscode/launch.json",language:"json",code:`{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Listen for Xdebug",
            "type": "php",
            "request": "launch",
            "port": 9003,
            "log": false,
            "pathMappings": {}
        },
        {
            "name": "Launch built-in server (script atual)",
            "type": "php",
            "request": "launch",
            "runtimeArgs": ["-S", "localhost:0", "-t", "."],
            "program": "",
            "cwd": "\${workspaceRoot}",
            "port": 9003,
            "serverReadyAction": {
                "pattern": "Development Server \\\\(http://localhost:([0-9]+)\\\\) started",
                "uriFormat": "http://localhost:%s",
                "action": "openExternally"
            }
        }
    ]
}`}),e.jsx("h2",{children:"4. Configure o PHPStorm"}),e.jsxs("ol",{children:[e.jsx("li",{children:"File → Settings → PHP → Debug → Xdebug → Debug port: 9003"}),e.jsx("li",{children:'Ative o "Phone handle" (telefone) na barra superior — fica esperando conexão.'}),e.jsxs("li",{children:["Instale a extensão"," ",e.jsx("strong",{children:'"Xdebug Helper"'})," no Chrome/Firefox. Defina o IDE key como ",e.jsx("code",{children:"PHPSTORM"}),"."]}),e.jsxs("li",{children:["No php.ini, mude ",e.jsx("code",{children:"xdebug.idekey = PHPSTORM"}),"."]})]}),e.jsx(i,{title:"Seu primeiro breakpoint",goal:"Pausar a execução de um script PHP no VS Code e ver o valor das variáveis.",steps:["Crie htdocs/teste.php com algumas linhas (loop, array, etc.)","Abra a pasta no VS Code","Clique na barra lateral, à esquerda de qualquer número de linha — vai aparecer um pontinho vermelho (breakpoint)","Vá em 'Run and Debug' (Ctrl+Shift+D) e clique no Play 'Listen for Xdebug'","Acesse http://localhost/teste.php?XDEBUG_TRIGGER=1 no navegador","O VS Code abre em primeiro plano e pausa na linha do breakpoint","À esquerda, em VARIABLES, você vê todas as variáveis disponíveis","Use F10 (step over), F11 (step into), Shift+F11 (step out), F5 (continue)"],verify:"O VS Code mostra o painel de debug ativo e a execução para na linha vermelha."}),e.jsx("h2",{children:"Ativando o debug por requisição (trigger)"}),e.jsxs("p",{children:["Com ",e.jsx("code",{children:"xdebug.start_with_request = trigger"}),", o debug só ativa em requests que tenham:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Cookie ",e.jsx("code",{children:"XDEBUG_SESSION=NOMEDOIDE"})]}),e.jsxs("li",{children:["Query string ",e.jsx("code",{children:"?XDEBUG_TRIGGER=NOMEDOIDE"})]}),e.jsxs("li",{children:["POST ",e.jsx("code",{children:"XDEBUG_TRIGGER=NOMEDOIDE"})]})]}),e.jsxs("p",{children:['A extensão "',e.jsx("strong",{children:"Xdebug Helper"}),'" no Chrome/Firefox configura esse cookie com 1 clique (ícone do bichinho).']}),e.jsx("h2",{children:"5. var_dump turbinado (modo develop)"}),e.jsxs("p",{children:["Quando o modo ",e.jsx("code",{children:"develop"})," está ativo, qualquer"," ",e.jsx("code",{children:"var_dump()"})," ganha cores, profundidade controlada e link clicável para o arquivo:"]}),e.jsx(o,{language:"php",code:`<?php
$dados = [
    'nome' => 'Wallyson',
    'idade' => 30,
    'cursos' => ['PHP', 'JavaScript', 'Linux'],
    'objetos' => [
        'pdo' => new PDO('sqlite::memory:'),
    ],
];
var_dump($dados);

// xdebug_print_function_stack() — stack atual
xdebug_print_function_stack('Aqui!');

// dd-style — para e morre
xdebug_var_dump($dados);
exit;`}),e.jsx("h2",{children:"6. Profile de performance"}),e.jsx("p",{children:"Para descobrir onde seu script gasta tempo, ative o modo profile:"}),e.jsx(o,{language:"ini",code:`xdebug.mode = profile
xdebug.start_with_request = trigger
xdebug.output_dir = "C:/xampp/tmp"
xdebug.profiler_output_name = "cachegrind.out.%t-%p"

; %t = timestamp, %p = pid, %s = nome do script`}),e.jsxs("p",{children:["Acesse uma página com"," ",e.jsx("code",{children:"?XDEBUG_TRIGGER=PROFILE"}),", e o Xdebug salvará um arquivo ",e.jsx("code",{children:"cachegrind.out.*"})," em ",e.jsx("code",{children:"tmp/"}),". Para analisar:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"QCachegrind"})," (Linux/macOS — recomendado) ou"," ",e.jsx("strong",{children:"KCacheGrind"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Webgrind"})," — viewer web (PHP) que você roda dentro do próprio XAMPP."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"PhpStorm"})," tem viewer integrado em Tools → Analyze Xdebug Profiler Snapshot."]})]}),e.jsx("h2",{children:"7. Code coverage com PHPUnit"}),e.jsx(o,{language:"ini",code:"xdebug.mode = coverage"}),e.jsx(o,{language:"bash",code:`# PHPUnit pega coverage automaticamente quando Xdebug está em mode=coverage
./vendor/bin/phpunit --coverage-html=coverage/

# Abra coverage/index.html no navegador`}),e.jsx("h2",{children:"8. Function trace"}),e.jsx("p",{children:"Loga cada chamada de função (parâmetros, retorno) — útil para entender bibliotecas grandes:"}),e.jsx(o,{language:"ini",code:`xdebug.mode = trace
xdebug.start_with_request = trigger
xdebug.output_dir = "C:/xampp/tmp"
xdebug.trace_output_name = "trace.%t"
xdebug.trace_format = 1     ; 0=human, 1=computer-readable, 2=html`}),e.jsx("h2",{children:"Funções utilitárias do Xdebug no código"}),e.jsx(r,{title:"Funções globais que o Xdebug expõe",params:[{flag:"xdebug_break()",desc:"Para a execução naquela linha (mesmo sem breakpoint visual). Útil para condicionais."},{flag:"xdebug_var_dump($v)",desc:"var_dump completo, ignora o limite do php.ini."},{flag:"xdebug_print_function_stack($msg)",desc:"Mostra stack trace atual com mensagem."},{flag:"xdebug_get_function_stack()",desc:"Retorna o stack como array (programatic)."},{flag:"xdebug_call_file() / line() / function()",desc:"Quem chamou o código atual."},{flag:"xdebug_get_code_coverage()",desc:"Retorna o coverage acumulado (mode=coverage)."},{flag:"xdebug_memory_usage()",desc:"Memória usada agora (bytes)."},{flag:"xdebug_peak_memory_usage()",desc:"Pico de memória até agora."},{flag:"xdebug_time_index()",desc:"Segundos desde o início do request."},{flag:"xdebug_info()",desc:"Versão moderna do phpinfo só do Xdebug. Útil para diagnóstico."}]}),e.jsx("h2",{children:"Teste se Xdebug está conectando"}),e.jsx(o,{language:"bash",code:`php --version

# Saída esperada deve incluir:
# with Xdebug v3.x.x, Copyright (c) 2002-2024, by Derick Rethans

php -i | grep -i xdebug
# Mostra todas as diretivas xdebug.* ativas

# Usar a página de info do próprio Xdebug
echo "<?php xdebug_info(); ?>" > C:/xampp/htdocs/xinfo.php
# Acesse http://localhost/xinfo.php — vai mostrar status DETALHADO`}),e.jsxs("p",{children:["E o log ",e.jsx("code",{children:"php/logs/xdebug.log"})," mostra cada tentativa de conexão com a IDE — útil para ver se a porta está liberada e se o Xdebug está realmente tentando conectar no client."]}),e.jsxs(a,{type:"warning",title:"Não deixe Xdebug ativo em produção",children:["Xdebug deixa o PHP várias vezes mais lento — mesmo só com",e.jsx("code",{children:"mode=develop"}),". Em produção, removendo completamente (não carregue a extensão). No XAMPP local, pode ficar ligado tranquilo."]}),e.jsx("h2",{children:"Troubleshooting comum"}),e.jsx(r,{title:"Problemas e soluções",params:[{flag:"Apache não inicia depois de carregar Xdebug",desc:"Versão do .dll incompatível com a versão/build do PHP. Use o wizard em xdebug.org/wizard."},{flag:"var_dump não tem cores",desc:"xdebug.mode=develop não está ativo, ou xdebug.cli_color=0."},{flag:"VS Code não pega breakpoint",desc:"1) Apache rodando? 2) IDE escutando porta 9003? 3) Cookie XDEBUG_SESSION setado? 4) xdebug.start_with_request correto?"},{flag:"Conecta mas para na linha errada",desc:"Path mapping incorreto (caso o PHP rode em Docker/VM). Configure pathMappings no launch.json."},{flag:"Funciona em /index.php mas não em rotas amigáveis",desc:"O front-controller pode estar 'engolindo' o cookie. Use trigger via header ou query string."},{flag:"Tudo travou",desc:"O PHP está em breakpoint esperando IDE. Pare o listener da IDE ou comente xdebug.mode=debug e reinicie."}]})]})}export{p as default};
