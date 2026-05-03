import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function PhpUnit() {
  return (
    <PageContainer
      title="PHPUnit no XAMPP — testes automatizados"
      subtitle="Setup limpo, primeiro teste, asserções essenciais, fixtures, mocks, cobertura com Xdebug e como rodar tudo a cada commit."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <AlertBox type="info" title="Por que testar?">
        Trocar uma linha sem medo. Refatorar legado. Encontrar bugs antes do cliente. PHPUnit é
        o padrão da indústria PHP — Laravel, Symfony, Drupal, WordPress (parcial) usam.
      </AlertBox>

      <h2>Instalação</h2>
      <CodeBlock
        language="bash"
        code={`# Em projeto novo (recomendado: por projeto, via composer)
cd C:/xampp/htdocs/meu-projeto
composer require --dev phpunit/phpunit ^11

# Conferir
./vendor/bin/phpunit --version
# PHPUnit 11.5.x by Sebastian Bergmann and contributors.

# Atalho global (Windows: crie um phpunit.bat na pasta do PATH)
echo @php "%~dp0vendor\\phpunit\\phpunit\\phpunit" %* > phpunit.bat`}
      />

      <h2>Estrutura inicial</h2>
      <CodeBlock
        language="text"
        code={`meu-projeto/
├── composer.json
├── phpunit.xml         ← config (XML)
├── src/
│   └── Calculadora.php
└── tests/
    └── CalculadoraTest.php`}
      />
      <CodeBlock
        title="composer.json (autoload)"
        language="json"
        code={`{
    "autoload": {
        "psr-4": { "App\\\\": "src/" }
    },
    "autoload-dev": {
        "psr-4": { "App\\\\Tests\\\\": "tests/" }
    },
    "scripts": {
        "test": "phpunit",
        "test:cov": "XDEBUG_MODE=coverage phpunit --coverage-html coverage"
    }
}`}
      />
      <CodeBlock
        language="bash"
        code={`composer dump-autoload`}
      />

      <h2>phpunit.xml</h2>
      <CodeBlock
        language="xml"
        code={`<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         colors="true"
         cacheDirectory=".phpunit.cache"
         executionOrder="random"
         beStrictAboutCoversAnnotation="true"
         failOnWarning="true">

    <testsuites>
        <testsuite name="Unit">
            <directory>tests</directory>
        </testsuite>
    </testsuites>

    <source>
        <include>
            <directory>src</directory>
        </include>
    </source>

    <php>
        <env name="APP_ENV" value="testing"/>
        <env name="DB_DATABASE" value="loja_test"/>
    </php>
</phpunit>`}
      />

      <h2>Primeiro teste</h2>
      <CodeBlock
        title="src/Calculadora.php"
        language="php"
        code={`<?php
namespace App;

class Calculadora
{
    public function somar(int $a, int $b): int
    {
        return $a + $b;
    }

    public function dividir(int $a, int $b): float
    {
        if ($b === 0) {
            throw new \\InvalidArgumentException('Divisor não pode ser zero');
        }
        return $a / $b;
    }
}`}
      />
      <CodeBlock
        title="tests/CalculadoraTest.php"
        language="php"
        code={`<?php
namespace App\\Tests;

use App\\Calculadora;
use PHPUnit\\Framework\\TestCase;

class CalculadoraTest extends TestCase
{
    private Calculadora $calc;

    protected function setUp(): void
    {
        $this->calc = new Calculadora();
    }

    public function test_soma_dois_positivos(): void
    {
        $this->assertSame(7, $this->calc->somar(3, 4));
    }

    public function test_dividir_lanca_erro_para_zero(): void
    {
        $this->expectException(\\InvalidArgumentException::class);
        $this->expectExceptionMessage('zero');
        $this->calc->dividir(10, 0);
    }
}`}
      />
      <CodeBlock
        language="bash"
        code={`composer test
# OK (2 tests, 2 assertions)`}
      />

      <h2>Asserções essenciais</h2>
      <ParamsTable
        title="Mais usadas"
        params={[
          { flag: "assertSame(esperado, real)", desc: "Igualdade estrita (===). Prefira a assertEquals." },
          { flag: "assertEquals(esperado, real)", desc: "Igualdade frouxa (==). Útil para float com tolerância." },
          { flag: "assertTrue / assertFalse", desc: "Booleano." },
          { flag: "assertNull / assertNotNull", desc: "NULL." },
          { flag: "assertCount(n, array)", desc: "Tamanho de array/Countable." },
          { flag: "assertContains(item, array)", desc: "Contém valor." },
          { flag: "assertInstanceOf(Classe::class, obj)", desc: "Tipo." },
          { flag: "assertStringContainsString(parte, total)", desc: "Substring." },
          { flag: "assertMatchesRegularExpression(regex, str)", desc: "Regex." },
          { flag: "expectException(Erro::class)", desc: "Espera exceção (chame antes da ação que dispara)." },
          { flag: "$this->fail('msg')", desc: "Falha explicitamente." },
          { flag: "$this->markTestSkipped('motivo')", desc: "Pula sob condição." },
        ]}
      />

      <h2>Data providers</h2>
      <p>Roda o mesmo teste com vários conjuntos de dados.</p>
      <CodeBlock
        language="php"
        code={`<?php
use PHPUnit\\Framework\\Attributes\\DataProvider;

class CalculadoraTest extends TestCase
{
    #[DataProvider('casosSoma')]
    public function test_soma($a, $b, $esperado): void
    {
        $this->assertSame($esperado, (new Calculadora())->somar($a, $b));
    }

    public static function casosSoma(): array
    {
        return [
            'positivos'         => [2, 3, 5],
            'negativos'         => [-1, -1, -2],
            'zero_neutro'       => [0, 5, 5],
            'soma_grande'       => [PHP_INT_MAX - 1, 1, PHP_INT_MAX],
        ];
    }
}`}
      />

      <h2>Mocks e Stubs</h2>
      <CodeBlock
        language="php"
        code={`<?php
class PedidoServiceTest extends TestCase
{
    public function test_envia_email_quando_pago(): void
    {
        // 1) Stub: substitui dependência por uma versão controlada
        $repo = $this->createStub(PedidoRepository::class);
        $repo->method('buscar')->willReturn(new Pedido(id: 1, valor: 100));

        // 2) Mock: stub + verificação de chamadas
        $email = $this->createMock(EmailSender::class);
        $email->expects($this->once())
              ->method('enviar')
              ->with(
                  $this->equalTo('cliente@x.com'),
                  $this->stringContains('Pedido #1')
              );

        $service = new PedidoService($repo, $email);
        $service->confirmar(1);
    }
}`}
      />

      <h2>Testando com banco de dados</h2>
      <CodeBlock
        title="Estratégias"
        language="text"
        code={`1. SQLite em memória — rápido, isolado, mas pode esconder bugs do MariaDB.
2. MariaDB com banco _test e TRUNCATE entre testes.
3. Transações: BEGIN no setUp, ROLLBACK no tearDown.
4. Frameworks (Laravel) trazem DatabaseTransactions trait pronta.`}
      />
      <CodeBlock
        language="php"
        code={`<?php
abstract class DbTestCase extends TestCase
{
    protected PDO $pdo;

    protected function setUp(): void
    {
        $this->pdo = new PDO('mysql:host=127.0.0.1;dbname=loja_test', 'app', 'pwd');
        $this->pdo->beginTransaction();
    }

    protected function tearDown(): void
    {
        $this->pdo->rollBack();
    }
}`}
      />

      <h2>Cobertura de código (Xdebug)</h2>
      <CodeBlock
        title="php.ini — habilite o modo coverage"
        language="ini"
        code={`zend_extension=xdebug
xdebug.mode=develop,debug,coverage`}
      />
      <CodeBlock
        language="bash"
        code={`# HTML detalhado
XDEBUG_MODE=coverage ./vendor/bin/phpunit --coverage-html coverage/

# Texto resumido
XDEBUG_MODE=coverage ./vendor/bin/phpunit --coverage-text

# Só falha se cobertura cair de 80%
XDEBUG_MODE=coverage ./vendor/bin/phpunit --coverage-text --coverage-clover clover.xml --min-coverage 80`}
      />
      <p>
        Abra <code>coverage/index.html</code> no navegador — cada arquivo mostra linhas testadas
        em verde, não testadas em vermelho.
      </p>

      <h2>Convenção de nomes</h2>
      <CodeBlock
        language="text"
        code={`✓ Classe: NomeClasseTest
✓ Métodos: test_descricao_do_que_acontece  (snake_case torna leitura fácil)
✓ Um assert por teste, idealmente
✓ Não teste o framework — teste seu código

# Padrão AAA — Arrange, Act, Assert
public function test_x(): void
{
    // Arrange — prepare
    $obj = new Foo();
    // Act — execute
    $resultado = $obj->bar();
    // Assert — verifique
    $this->assertSame(42, $resultado);
}`}
      />

      <h2>CI — rodar em todo push</h2>
      <CodeBlock
        title=".github/workflows/test.yml"
        language="yaml"
        code={`name: Tests
on: [push, pull_request]
jobs:
  phpunit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.4'
          coverage: xdebug
      - run: composer install --no-progress
      - run: composer test
      - name: Cobertura mínima
        run: |
          XDEBUG_MODE=coverage vendor/bin/phpunit \\
            --coverage-clover=coverage.xml \\
            --coverage-text \\
            --min-coverage 80`}
      />

      <h2>Filtros e modos rápidos</h2>
      <CodeBlock
        language="bash"
        code={`# Apenas um teste
phpunit --filter test_soma

# Apenas uma classe
phpunit tests/CalculadoraTest.php

# Continuar de onde parou (-) só rodar o que falhou
phpunit --order-by=defects --stop-on-failure

# Suite específica
phpunit --testsuite=Unit

# Listar tudo sem rodar
phpunit --list-tests`}
      />

      <AlertBox type="warning" title="Memory limit em coverage">
        Coverage HTML em projeto grande consome muita RAM. Suba <code>memory_limit</code> para
        1G no <code>php.ini</code> do CLI.
      </AlertBox>

      <h2>Armadilhas</h2>
      <ul>
        <li>
          Teste depende da ordem (estado compartilhado em static) — ative{" "}
          <code>executionOrder=&quot;random&quot;</code> e quebre vícios.
        </li>
        <li>
          Mock de função estática só funciona se a classe permitir injeção. Refatore.
        </li>
        <li>
          Banco "test" igual ao "dev" — um <code>TRUNCATE</code> apaga dados reais.
        </li>
        <li>
          <code>setUpBeforeClass()</code> roda 1× para a classe inteira; estado vaza entre testes.
        </li>
      </ul>
    </PageContainer>
  );
}
