import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function PhpDebugLog() {
  return (
    <PageContainer
      title="Logs e debug do PHP — error_log, var_dump e alternativas"
      subtitle="Onde os erros aparecem (ou desaparecem), como configurar reporting, alternativas profissionais a var_dump, e como integrar Monolog para logs estruturados."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <AlertBox type="info" title="Cenário comum">
        "Salvei o código, recarrego e a página vem em branco." Quase sempre é fatal error que o
        PHP não está exibindo. Resolver isso é a base — leve 5 minutos para configurar e nunca
        mais perca tempo.
      </AlertBox>

      <h2>Diretivas que controlam tudo</h2>
      <CodeBlock
        title="php.ini — desenvolvimento"
        language="ini"
        code={`display_errors        = On
display_startup_errors = On
error_reporting       = E_ALL
log_errors            = On
error_log             = "C:/xampp/php/logs/php_error_log"
html_errors           = On

# Não envenenar logs com erros que você sabe ignorar (ex: deprecated)
; error_reporting = E_ALL & ~E_DEPRECATED & ~E_STRICT`}
      />
      <CodeBlock
        title="php.ini — produção"
        language="ini"
        code={`display_errors        = Off          ; nunca mostre erro pro cliente
display_startup_errors = Off
error_reporting       = E_ALL & ~E_DEPRECATED & ~E_NOTICE
log_errors            = On
error_log             = "/var/log/php-errors.log"
html_errors           = Off

; Nada de var_dump em produção
; assert.exception      = 1`}
      />

      <h2>Onde os erros aparecem</h2>
      <ParamsTable
        title="Hierarquia de destinos"
        params={[
          { flag: "display_errors=On", desc: "Vai pra resposta HTTP — usuário enxerga." },
          { flag: "log_errors=On + error_log=arquivo", desc: "Vai para o arquivo definido." },
          { flag: "log_errors=On + error_log vazio", desc: "Vai para o SAPI: Apache → error.log do Apache; CLI → STDERR." },
          { flag: "ini_set('error_log', 'x.log')", desc: "Sobrescreve em runtime para o request atual." },
          { flag: "error_log('msg')", desc: "Função PHP — escreve direto no destino atual." },
        ]}
      />

      <h2>error_reporting na prática</h2>
      <CodeBlock
        language="php"
        code={`<?php
// Em runtime — útil em ambientes onde não consegue mexer no php.ini
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

// Tudo, exceto deprecated:
error_reporting(E_ALL & ~E_DEPRECATED);

// Apenas erros e warnings:
error_reporting(E_ERROR | E_WARNING | E_PARSE);

// SILENCIA TUDO (quase nunca certo)
error_reporting(0);`}
      />

      <h2>Tipos de erro</h2>
      <ParamsTable
        title="Constantes mais usadas"
        params={[
          { flag: "E_ERROR", desc: "Fatal — script para." },
          { flag: "E_WARNING", desc: "Aviso, mas continua." },
          { flag: "E_NOTICE", desc: "Mais leve (acessar índice inexistente, etc)." },
          { flag: "E_PARSE", desc: "Erro de sintaxe — captura impossível em runtime." },
          { flag: "E_DEPRECATED", desc: "Função/sintaxe ainda funciona mas vai sumir." },
          { flag: "E_USER_ERROR / E_USER_WARNING", desc: "Disparados manualmente via trigger_error()." },
          { flag: "E_ALL", desc: "Todos." },
        ]}
      />

      <h2>Logando manualmente</h2>
      <CodeBlock
        language="php"
        code={`<?php
// 1) Para o destino padrão (error_log do php.ini)
error_log("Pedido #42 confirmado");

// 2) Para um arquivo específico
error_log("Falha pgto: $codigo", 3, __DIR__ . '/logs/pagamentos.log');

// 3) Por email (raramente boa ideia em volume)
error_log("Erro grave", 1, "alerta@empresa.com");

// 4) Alternativa: trigger_error formaliza tipo
trigger_error("Algo estranho aconteceu", E_USER_WARNING);`}
      />

      <h2>var_dump, print_r, var_export</h2>
      <ParamsTable
        title="Quando usar cada um"
        params={[
          { flag: "var_dump($x)", desc: "Tipo + valor + tamanho. Mais info, mais ruidoso." },
          { flag: "print_r($x)", desc: "Recursivo, legível, sem tipo." },
          { flag: "var_export($x)", desc: "Devolve PHP válido — copia/cola e vira código." },
          { flag: "json_encode($x, JSON_PRETTY_PRINT)", desc: "Lindo para arrays/objetos simples." },
          { flag: "debug_backtrace()", desc: "Pilha de chamadas — quem chamou quem." },
        ]}
      />
      <CodeBlock
        language="php"
        code={`<?php
$user = ['id' => 42, 'roles' => ['admin','dev']];

var_dump($user);
print_r($user);
echo var_export($user, true);
echo json_encode($user, JSON_PRETTY_PRINT);

// Stack trace
print_r(array_slice(debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS), 0, 5));`}
      />

      <h2>Helper de debug que não polui o HTML</h2>
      <CodeBlock
        language="php"
        code={`<?php
function dlog(mixed ...$args): void
{
    $msg = '';
    foreach ($args as $a) {
        $msg .= is_string($a) ? $a : print_r($a, true);
        $msg .= ' ';
    }
    error_log(trim($msg));
}

// Uso
dlog('user', $userArr, 'request', $_REQUEST);`}
      />

      <h2>Monolog — log estruturado</h2>
      <CodeBlock
        language="bash"
        code={`composer require monolog/monolog`}
      />
      <CodeBlock
        language="php"
        code={`<?php
use Monolog\\Logger;
use Monolog\\Handler\\StreamHandler;
use Monolog\\Handler\\RotatingFileHandler;
use Monolog\\Processor\\WebProcessor;
use Monolog\\Processor\\PsrLogMessageProcessor;

$log = new Logger('app');

// Rotaciona automaticamente por dia, mantém 14
$log->pushHandler(new RotatingFileHandler(__DIR__ . '/logs/app.log', 14, Logger::DEBUG));

// Stderr (visível no XAMPP control panel) só para erros
$log->pushHandler(new StreamHandler('php://stderr', Logger::ERROR));

// Adiciona URL, IP, request_id automaticamente
$log->pushProcessor(new WebProcessor());
$log->pushProcessor(new PsrLogMessageProcessor());

// Uso
$log->info('Usuário {user_id} logou', ['user_id' => 42]);
$log->error('Falha pgto', ['code' => $codigo, 'amount' => $valor]);`}
      />

      <h2>Captura global de exceções</h2>
      <CodeBlock
        title="bootstrap.php"
        language="php"
        code={`<?php
set_error_handler(function (int $level, string $msg, string $file, int $line) {
    if (!(error_reporting() & $level)) return false;
    throw new \\ErrorException($msg, 0, $level, $file, $line);
});

set_exception_handler(function (\\Throwable $e) {
    error_log(sprintf(
        "[%s] %s in %s:%d\\n%s",
        get_class($e), $e->getMessage(), $e->getFile(), $e->getLine(), $e->getTraceAsString()
    ));

    if (php_sapi_name() === 'cli') {
        fwrite(STDERR, "FATAL: {$e->getMessage()}\\n");
    } else {
        http_response_code(500);
        echo file_exists(__DIR__ . '/error.html')
            ? file_get_contents(__DIR__ . '/error.html')
            : 'Erro interno. Tente novamente.';
    }
    exit(1);
});

register_shutdown_function(function () {
    $err = error_get_last();
    if ($err && in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        error_log("FATAL: {$err['message']} em {$err['file']}:{$err['line']}");
    }
});`}
      />

      <h2>Xdebug em modo step debugger</h2>
      <p>Para parar a execução em qualquer linha e inspecionar variáveis no VS Code/PHPStorm.</p>
      <CodeBlock
        title="php.ini"
        language="ini"
        code={`zend_extension=xdebug
xdebug.mode=debug
xdebug.start_with_request=trigger     ; só ativa com cookie XDEBUG_TRIGGER
xdebug.client_host=127.0.0.1
xdebug.client_port=9003`}
      />
      <p>
        No VS Code: instale "PHP Debug" da xdebug.org, configure <code>launch.json</code> com{" "}
        <code>"type": "php"</code>, marque um breakpoint e recarregue a página.
      </p>

      <h2>Acompanhando o log em tempo real</h2>
      <CodeBlock
        language="bash"
        code={`# Linux / Git Bash
tail -f C:/xampp/php/logs/php_error_log

# PowerShell
Get-Content C:/xampp/php/logs/php_error_log -Wait -Tail 20

# Filtrar
tail -f php_error_log | grep -i "fatal"`}
      />

      <AlertBox type="warning" title="display_errors em produção = vazamento">
        Stack trace mostra caminhos absolutos, nomes de classes, queries SQL — tudo que ataca quer
        saber. Sempre <code>display_errors=Off</code> em produção, com <code>log_errors=On</code>{" "}
        para captura interna.
      </AlertBox>

      <h2>Receita: error_log com contexto rico</h2>
      <CodeBlock
        language="php"
        code={`<?php
function logErr(\\Throwable $e, array $contexto = []): void
{
    $linha = sprintf(
        "[%s] %s | %s %s | uid=%s | ctx=%s | %s in %s:%d",
        date('Y-m-d H:i:s'),
        $_SERVER['REMOTE_ADDR'] ?? 'cli',
        $_SERVER['REQUEST_METHOD'] ?? '-',
        $_SERVER['REQUEST_URI'] ?? '-',
        $_SESSION['user_id'] ?? '-',
        json_encode($contexto),
        $e->getMessage(),
        $e->getFile(),
        $e->getLine(),
    );
    error_log($linha);
}

try {
    processar($pedidoId);
} catch (\\Throwable $e) {
    logErr($e, ['pedido' => $pedidoId, 'tentativa' => $n]);
    throw $e;
}`}
      />

      <h2>Armadilhas</h2>
      <ul>
        <li>
          <strong>display_errors=On</strong> num php.ini diferente do que o Apache carrega — sem
          efeito. Confira em <code>phpinfo()</code>.
        </li>
        <li>
          <strong>error_log</strong> aponta para arquivo sem permissão de escrita — PHP descarta
          silenciosamente. Confira existência e ACL.
        </li>
        <li>
          Esquecer <code>@</code> de supressão em uma linha velha esconde TODOS os erros dali.
          Remova <code>@</code> sempre que possível.
        </li>
        <li>
          Logar dados sensíveis (senha, cartão, token) — implemente filtros antes de logar.
        </li>
      </ul>
    </PageContainer>
  );
}
