import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function Xdebug() {
  return (
    <PageContainer
      title="Xdebug — debug profissional no PHP"
      subtitle="Os 6 modos do Xdebug 3, instalação, configuração para VS Code/PHPStorm/Sublime, breakpoints, profile com cachegrind, code coverage, function trace e diagnóstico do próprio Xdebug."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        XAMPP rodando, capítulos de <a href="#/php-ini">php.ini</a> e{" "}
        <a href="#/php-extensoes">extensões</a> lidos. Editor instalado (VS
        Code ou PHPStorm). Saber criar arquivos .php em <code>htdocs/</code>.
      </AlertBox>

      <h2>O que é o Xdebug</h2>
      <p>
        Xdebug é uma <strong>extensão Zend</strong> mantida por Derick
        Rethans desde 2002. Adiciona ao PHP capacidades que o engine
        original não tem: pausar execução em uma linha, inspecionar
        variáveis, andar passo a passo, gerar profile de performance,
        coverage de testes e log detalhado de chamadas. É a ferramenta
        que separa o "vou colocar um <code>echo</code> aqui" do trabalho
        profissional.
      </p>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Breakpoint</strong> — linha onde o Xdebug pausa a execução
        e devolve o controle para a IDE.
      </p>
      <p>
        <strong>Step into / over / out</strong> — comandos para avançar a
        execução de um em um (entra em funções / pula por cima / sai da
        função atual).
      </p>
      <p>
        <strong>DBGp</strong> — protocolo binário pelo qual o Xdebug fala
        com a IDE. Padrão da indústria — toda IDE PHP suporta.
      </p>
      <p>
        <strong>Cachegrind</strong> — formato de arquivo de profile usado
        pelo Valgrind. Xdebug gera nesse formato; ferramentas como
        QCachegrind / KCacheGrind / Webgrind visualizam.
      </p>

      <h2>Os 6 modos do Xdebug 3</h2>
      <p>
        Xdebug 3 unificou tudo em <code>xdebug.mode</code>. Você habilita
        só o que precisar — o modo desligado tem custo zero.
      </p>
      <ParamsTable
        title="Modos disponíveis (separe por vírgula para combinar)"
        params={[
          { flag: "off", desc: "Tudo desligado, custo zero. Não há nem var_dump turbinado." },
          { flag: "develop", desc: "var_dump com cores e stack trace, file:line nos erros, melhor formatação. ATIVO em dev sempre." },
          { flag: "debug", desc: "Step debugger via DBGp. Para usar com IDE." },
          { flag: "profile", desc: "Gera arquivos cachegrind para análise de performance." },
          { flag: "coverage", desc: "Reporta linhas executadas (necessário para PHPUnit code coverage)." },
          { flag: "trace", desc: "Loga cada chamada de função em arquivo. Útil para entender fluxos enormes." },
          { flag: "gcstats", desc: "Estatísticas do garbage collector. Raro." },
        ]}
      />

      <h2>1. Confirme se o XAMPP já tem Xdebug</h2>
      <p>
        Crie um <code>htdocs/info.php</code> com{" "}
        <code>&lt;?php phpinfo(); ?&gt;</code>, abra no navegador e
        procure por <strong>Xdebug</strong>. Se a seção existe, ele está
        instalado — só talvez desligado.
      </p>
      <p>
        XAMPP recente já vem com Xdebug 3 incluído em{" "}
        <code>php/ext/php_xdebug.dll</code>.
      </p>

      <h2>Se NÃO tiver — instale</h2>
      <ol>
        <li>
          Acesse{" "}
          <a href="https://xdebug.org/wizard" target="_blank" rel="noreferrer">
            xdebug.org/wizard
          </a>
          {" "}— cole a saída completa do <code>phpinfo()</code> (Ctrl+A em
          info.php → copiar fonte da página).
        </li>
        <li>O wizard te diz exatamente qual <code>.dll</code> baixar.</li>
        <li>Salve o arquivo como <code>php_xdebug.dll</code> em <code>C:/xampp/php/ext/</code>.</li>
        <li>Adicione no <code>php.ini</code> (próximo passo).</li>
      </ol>

      <h2>2. Habilite no php.ini</h2>
      <p>
        Procure pela seção <code>[XDebug]</code> no final do{" "}
        <code>php.ini</code> (pode estar comentada). Configure:
      </p>
      <CodeBlock language="ini" code={`[XDebug]
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
xdebug.var_display_max_data = 1024`} />
      <p>Reinicie o Apache.</p>

      <AlertBox type="warning" title="Xdebug 2 vs Xdebug 3">
        Se você está em um XAMPP antigo, a sintaxe é diferente:{" "}
        <code>xdebug.remote_enable=1</code>,{" "}
        <code>xdebug.remote_port=9000</code>,{" "}
        <code>xdebug.remote_autostart=1</code>. Xdebug 3 unificou tudo
        nas diretivas <code>mode</code>, <code>client_host</code>,{" "}
        <code>client_port</code>. A porta padrão do Xdebug 3 é{" "}
        <strong>9003</strong> (no 2 era 9000).
      </AlertBox>

      <h2>3. Configure o VS Code</h2>
      <p>
        Instale a extensão "<strong>PHP Debug</strong>" (Xdebug autora,
        ID: <code>xdebug.php-debug</code>). Crie em{" "}
        <code>.vscode/launch.json</code>:
      </p>
      <CodeBlock title=".vscode/launch.json" language="json" code={`{
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
}`} />

      <h2>4. Configure o PHPStorm</h2>
      <ol>
        <li>File → Settings → PHP → Debug → Xdebug → Debug port: 9003</li>
        <li>Ative o "Phone handle" (telefone) na barra superior — fica esperando conexão.</li>
        <li>
          Instale a extensão{" "}
          <strong>"Xdebug Helper"</strong> no Chrome/Firefox. Defina o IDE
          key como <code>PHPSTORM</code>.
        </li>
        <li>No php.ini, mude <code>xdebug.idekey = PHPSTORM</code>.</li>
      </ol>

      <PracticeBox
        title="Seu primeiro breakpoint"
        goal="Pausar a execução de um script PHP no VS Code e ver o valor das variáveis."
        steps={[
          "Crie htdocs/teste.php com algumas linhas (loop, array, etc.)",
          "Abra a pasta no VS Code",
          "Clique na barra lateral, à esquerda de qualquer número de linha — vai aparecer um pontinho vermelho (breakpoint)",
          "Vá em 'Run and Debug' (Ctrl+Shift+D) e clique no Play 'Listen for Xdebug'",
          "Acesse http://localhost/teste.php?XDEBUG_TRIGGER=1 no navegador",
          "O VS Code abre em primeiro plano e pausa na linha do breakpoint",
          "À esquerda, em VARIABLES, você vê todas as variáveis disponíveis",
          "Use F10 (step over), F11 (step into), Shift+F11 (step out), F5 (continue)",
        ]}
        verify="O VS Code mostra o painel de debug ativo e a execução para na linha vermelha."
      />

      <h2>Ativando o debug por requisição (trigger)</h2>
      <p>
        Com <code>xdebug.start_with_request = trigger</code>, o debug só
        ativa em requests que tenham:
      </p>
      <ul>
        <li>Cookie <code>XDEBUG_SESSION=NOMEDOIDE</code></li>
        <li>Query string <code>?XDEBUG_TRIGGER=NOMEDOIDE</code></li>
        <li>POST <code>XDEBUG_TRIGGER=NOMEDOIDE</code></li>
      </ul>
      <p>
        A extensão "<strong>Xdebug Helper</strong>" no Chrome/Firefox
        configura esse cookie com 1 clique (ícone do bichinho).
      </p>

      <h2>5. var_dump turbinado (modo develop)</h2>
      <p>
        Quando o modo <code>develop</code> está ativo, qualquer{" "}
        <code>var_dump()</code> ganha cores, profundidade controlada e
        link clicável para o arquivo:
      </p>
      <CodeBlock language="php" code={`<?php
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
exit;`} />

      <h2>6. Profile de performance</h2>
      <p>
        Para descobrir onde seu script gasta tempo, ative o modo profile:
      </p>
      <CodeBlock language="ini" code={`xdebug.mode = profile
xdebug.start_with_request = trigger
xdebug.output_dir = "C:/xampp/tmp"
xdebug.profiler_output_name = "cachegrind.out.%t-%p"

; %t = timestamp, %p = pid, %s = nome do script`} />
      <p>
        Acesse uma página com{" "}
        <code>?XDEBUG_TRIGGER=PROFILE</code>, e o Xdebug salvará um
        arquivo <code>cachegrind.out.*</code> em <code>tmp/</code>. Para
        analisar:
      </p>
      <ul>
        <li>
          <strong>QCachegrind</strong> (Linux/macOS — recomendado) ou{" "}
          <strong>KCacheGrind</strong>.
        </li>
        <li>
          <strong>Webgrind</strong> — viewer web (PHP) que você roda
          dentro do próprio XAMPP.
        </li>
        <li>
          <strong>PhpStorm</strong> tem viewer integrado em Tools → Analyze
          Xdebug Profiler Snapshot.
        </li>
      </ul>

      <h2>7. Code coverage com PHPUnit</h2>
      <CodeBlock language="ini" code={`xdebug.mode = coverage`} />
      <CodeBlock language="bash" code={`# PHPUnit pega coverage automaticamente quando Xdebug está em mode=coverage
./vendor/bin/phpunit --coverage-html=coverage/

# Abra coverage/index.html no navegador`} />

      <h2>8. Function trace</h2>
      <p>
        Loga cada chamada de função (parâmetros, retorno) — útil para
        entender bibliotecas grandes:
      </p>
      <CodeBlock language="ini" code={`xdebug.mode = trace
xdebug.start_with_request = trigger
xdebug.output_dir = "C:/xampp/tmp"
xdebug.trace_output_name = "trace.%t"
xdebug.trace_format = 1     ; 0=human, 1=computer-readable, 2=html`} />

      <h2>Funções utilitárias do Xdebug no código</h2>
      <ParamsTable
        title="Funções globais que o Xdebug expõe"
        params={[
          { flag: "xdebug_break()", desc: "Para a execução naquela linha (mesmo sem breakpoint visual). Útil para condicionais." },
          { flag: "xdebug_var_dump($v)", desc: "var_dump completo, ignora o limite do php.ini." },
          { flag: "xdebug_print_function_stack($msg)", desc: "Mostra stack trace atual com mensagem." },
          { flag: "xdebug_get_function_stack()", desc: "Retorna o stack como array (programatic)." },
          { flag: "xdebug_call_file() / line() / function()", desc: "Quem chamou o código atual." },
          { flag: "xdebug_get_code_coverage()", desc: "Retorna o coverage acumulado (mode=coverage)." },
          { flag: "xdebug_memory_usage()", desc: "Memória usada agora (bytes)." },
          { flag: "xdebug_peak_memory_usage()", desc: "Pico de memória até agora." },
          { flag: "xdebug_time_index()", desc: "Segundos desde o início do request." },
          { flag: "xdebug_info()", desc: "Versão moderna do phpinfo só do Xdebug. Útil para diagnóstico." },
        ]}
      />

      <h2>Teste se Xdebug está conectando</h2>
      <CodeBlock language="bash" code={`php --version

# Saída esperada deve incluir:
# with Xdebug v3.x.x, Copyright (c) 2002-2024, by Derick Rethans

php -i | grep -i xdebug
# Mostra todas as diretivas xdebug.* ativas

# Usar a página de info do próprio Xdebug
echo "<?php xdebug_info(); ?>" > C:/xampp/htdocs/xinfo.php
# Acesse http://localhost/xinfo.php — vai mostrar status DETALHADO`} />

      <p>
        E o log <code>php/logs/xdebug.log</code> mostra cada tentativa de
        conexão com a IDE — útil para ver se a porta está liberada e se o
        Xdebug está realmente tentando conectar no client.
      </p>

      <AlertBox type="warning" title="Não deixe Xdebug ativo em produção">
        Xdebug deixa o PHP várias vezes mais lento — mesmo só com
        <code>mode=develop</code>. Em produção, removendo completamente
        (não carregue a extensão). No XAMPP local, pode ficar ligado
        tranquilo.
      </AlertBox>

      <h2>Troubleshooting comum</h2>
      <ParamsTable
        title="Problemas e soluções"
        params={[
          { flag: "Apache não inicia depois de carregar Xdebug", desc: "Versão do .dll incompatível com a versão/build do PHP. Use o wizard em xdebug.org/wizard." },
          { flag: "var_dump não tem cores", desc: "xdebug.mode=develop não está ativo, ou xdebug.cli_color=0." },
          { flag: "VS Code não pega breakpoint", desc: "1) Apache rodando? 2) IDE escutando porta 9003? 3) Cookie XDEBUG_SESSION setado? 4) xdebug.start_with_request correto?" },
          { flag: "Conecta mas para na linha errada", desc: "Path mapping incorreto (caso o PHP rode em Docker/VM). Configure pathMappings no launch.json." },
          { flag: "Funciona em /index.php mas não em rotas amigáveis", desc: "O front-controller pode estar 'engolindo' o cookie. Use trigger via header ou query string." },
          { flag: "Tudo travou", desc: "O PHP está em breakpoint esperando IDE. Pare o listener da IDE ou comente xdebug.mode=debug e reinicie." },
        ]}
      />
    </PageContainer>
  );
}
