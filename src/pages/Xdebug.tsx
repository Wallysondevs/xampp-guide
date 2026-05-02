import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function Xdebug() {
  return (
    <PageContainer
      title="Xdebug — debug profissional no PHP"
      subtitle="Pare de espalhar var_dump() pelo código. Use breakpoints reais no VS Code ou PHPStorm."
      difficulty="avancado"
      timeToRead="9 min"
    >
      <p>
        Xdebug é uma extensão do PHP que permite pausar a execução em uma
        linha, inspecionar variáveis, andar passo a passo, e ainda gerar
        profile de performance. É a ferramenta que separa o "ah, vou colocar
        um echo aqui" do trabalho profissional.
      </p>

      <h2>1. Confirme se o XAMPP já tem Xdebug</h2>
      <p>
        Crie um <code>htdocs/info.php</code> com{" "}
        <code>&lt;?php phpinfo(); ?&gt;</code>, abra no navegador e procure
        por <strong>Xdebug</strong>. Se a seção existe, ele está instalado —
        só talvez desligado.
      </p>

      <h2>2. Habilite no php.ini</h2>
      <p>
        Procure pela seção <code>[XDebug]</code> no final do{" "}
        <code>php.ini</code> e deixe assim:
      </p>
      <CodeBlock language="ini" code={`[XDebug]
zend_extension = xdebug

; Modos do Xdebug 3:
;   develop  - var_dump turbinado (cores, stack trace, file:line)
;   debug    - breakpoints (precisa de IDE)
;   profile  - profile de performance
;   coverage - coverage de testes
;   trace    - log de cada chamada de função
xdebug.mode = develop,debug

xdebug.start_with_request = yes
xdebug.client_host = 127.0.0.1
xdebug.client_port = 9003
xdebug.idekey = VSCODE

; Onde sair os logs (útil para depurar o próprio Xdebug)
xdebug.log = "C:/xampp/php/logs/xdebug.log"`} />
      <p>Reinicie o Apache.</p>

      <AlertBox type="warning" title="Xdebug 2 vs Xdebug 3">
        Se você está em um XAMPP antigo, a sintaxe é diferente:{" "}
        <code>xdebug.remote_enable=1</code>, <code>xdebug.remote_port=9000</code>,{" "}
        <code>xdebug.remote_autostart=1</code>. Xdebug 3 unificou tudo nas
        diretivas <code>mode</code>, <code>client_host</code>,{" "}
        <code>client_port</code>. A porta padrão do Xdebug 3 é{" "}
        <strong>9003</strong> (no 2 era 9000).
      </AlertBox>

      <h2>3. Configure o VS Code</h2>
      <p>Instale a extensão "PHP Debug" (xdebug.php-debug). Crie em <code>.vscode/launch.json</code>:</p>
      <CodeBlock title=".vscode/launch.json" language="json" code={`{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Listen for Xdebug",
            "type": "php",
            "request": "launch",
            "port": 9003,
            "log": true
        }
    ]
}`} />

      <PracticeBox
        title="Seu primeiro breakpoint"
        goal="Pausar a execução de um script PHP no VS Code e ver o valor das variáveis."
        steps={[
          "Crie htdocs/teste.php com algumas linhas (loop, array, etc.)",
          "Abra a pasta no VS Code",
          "Clique na barra lateral, à esquerda de qualquer número de linha — vai aparecer um pontinho vermelho (breakpoint)",
          "Vá em 'Run and Debug' (Ctrl+Shift+D) e clique no Play 'Listen for Xdebug'",
          "Acesse http://localhost/teste.php no navegador",
          "O VS Code abre em primeiro plano e pausa na linha do breakpoint",
          "À esquerda, em VARIABLES, você vê todas as variáveis disponíveis",
        ]}
        verify="O VS Code mostra o painel de debug ativo e a execução para na linha vermelha."
      />

      <h2>4. var_dump turbinado (modo develop)</h2>
      <p>Quando o modo <code>develop</code> está ativo, qualquer <code>var_dump()</code> ganha cores, stack trace e link para o arquivo:</p>
      <CodeBlock language="php" code={`<?php
$dados = ['nome' => 'Wallyson', 'idade' => 30, 'curso' => 'PHP'];
var_dump($dados);`} />

      <h2>5. Profile de performance</h2>
      <p>
        Para descobrir onde seu script gasta tempo, ative o modo profile:
      </p>
      <CodeBlock language="ini" code={`xdebug.mode = profile
xdebug.output_dir = "C:/xampp/tmp"
xdebug.profiler_output_name = "cachegrind.out.%t-%p"`} />
      <p>
        Acesse uma página, e o Xdebug salvará um arquivo{" "}
        <code>cachegrind.out.*</code> em <code>tmp/</code>. Abra com{" "}
        <strong>QCachegrind</strong> (ou Webgrind via web) para visualizar
        funções mais demoradas.
      </p>

      <AlertBox type="warning" title="Não deixe Xdebug ativo em produção">
        Xdebug deixa o PHP várias vezes mais lento. Em produção, removendo
        completamente. No XAMPP local, pode ficar ligado tranquilo.
      </AlertBox>

      <h2>Teste se Xdebug está conectando</h2>
      <CodeBlock language="bash" code={`php --version

# Saída esperada deve incluir:
# with Xdebug v3.x.x, Copyright (c) 2002-2024, by Derick Rethans`} />
      <p>
        E o log <code>php/logs/xdebug.log</code> mostra cada tentativa de
        conexão com a IDE — útil para ver se a porta está liberada e se o
        Xdebug está realmente tentando conectar no client.
      </p>
    </PageContainer>
  );
}
