import{j as e}from"./index-BreI0dyu.js";import{P as r,A as o}from"./AlertBox-C_bJKc46.js";import{C as a}from"./CodeBlock-D0rWxPIU.js";import{P as s}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function d(){return e.jsxs(r,{title:"Agendamento de tarefas — cron e Agendador do Windows",subtitle:"Como rodar scripts PHP de tempos em tempos no XAMPP. Sintaxe do cron, Agendador de Tarefas no Windows, lock files para evitar concorrência e log estruturado.",difficulty:"intermediario",timeToRead:"10 min",children:[e.jsx(o,{type:"info",title:"Por que precisa?",children:"Notificação de cobrança vencida, limpeza de uploads antigos, refresh de cache, importação noturna, envio de relatório semanal — tudo isso precisa rodar sozinho. O XAMPP é só um ambiente de desenvolvimento, mas você precisa simular esse fluxo igual seria em produção."}),e.jsx("h2",{children:"Linux/macOS — crontab"}),e.jsx(a,{language:"bash",code:`# Editar a tabela do usuário atual
crontab -e

# Ver o que está agendado
crontab -l

# Apagar tudo (cuidado)
crontab -r`}),e.jsx(a,{title:"Sintaxe — 5 campos + comando",language:"text",code:`# ┌────────── minuto         (0-59)
# │ ┌──────── hora            (0-23)
# │ │ ┌────── dia do mês      (1-31)
# │ │ │ ┌──── mês             (1-12 ou jan-dec)
# │ │ │ │ ┌── dia da semana   (0-7, 0 e 7 = domingo)
# │ │ │ │ │
#  *  *  *  *  *   comando`}),e.jsx(s,{title:"Atalhos",params:[{flag:"@reboot",desc:"Roda uma vez no boot."},{flag:"@hourly",desc:"0 * * * *"},{flag:"@daily / @midnight",desc:"0 0 * * *"},{flag:"@weekly",desc:"0 0 * * 0 (domingo 0h)"},{flag:"@monthly",desc:"0 0 1 * *"},{flag:"@yearly / @annually",desc:"0 0 1 1 *"}]}),e.jsx("h2",{children:"Exemplos comuns"}),e.jsx(a,{language:"bash",code:`# A cada 5 minutos
*/5 * * * * /opt/lampp/bin/php /var/www/site/cron/heartbeat.php

# Toda hora cheia, dias úteis
0 * * * 1-5 /opt/lampp/bin/php /var/www/site/cron/sync.php

# Toda madrugada às 03:30
30 3 * * * /opt/lampp/bin/php /var/www/site/cron/limpar.php

# Segunda às 8h
0 8 * * 1 /opt/lampp/bin/php /var/www/site/cron/relatorio.php

# Dia 1 do mês, meia-noite
0 0 1 * * /opt/lampp/bin/php /var/www/site/cron/fechamento.php

# Múltiplos horários: 8h, 12h e 18h
0 8,12,18 * * * /opt/lampp/bin/php /var/www/site/cron/notif.php

# A cada 2 horas durante o expediente (8-18h)
0 8-18/2 * * 1-5 /opt/lampp/bin/php /var/www/site/cron/relatorio.php`}),e.jsx("h2",{children:"Variáveis de ambiente do cron"}),e.jsxs("p",{children:["O cron roda com ",e.jsx("strong",{children:"ambiente mínimo"})," — sem o ",e.jsx("code",{children:"$PATH"})," do seu shell, sem ",e.jsx("code",{children:"~/.bashrc"}),'. Sintomas: "command not found" mesmo com programa instalado, erros de locale, cores estranhas em logs.']}),e.jsx(a,{title:"Defina no topo do crontab",language:"bash",code:`SHELL=/bin/bash
PATH=/opt/lampp/bin:/usr/local/bin:/usr/bin:/bin
LANG=pt_BR.UTF-8
MAILTO=admin@empresa.com   # erros vão pra esse email (precisa MTA)

30 3 * * * php /var/www/site/cron/limpar.php`}),e.jsx("h2",{children:"Logs"}),e.jsx(a,{language:"bash",code:`# Padrão: cron envia stdout+stderr por email para o usuário
# Para arquivar em arquivo:

30 3 * * * /opt/lampp/bin/php /var/www/cron.php >> /var/log/cron.log 2>&1

# Quebrando:
#   >>          append (não sobrescreve)
#   2>&1        STDERR também vai para o arquivo
#   2> /dev/null  silencia erros (não recomendado)
#   > /dev/null 2>&1   silencia tudo (totalmente cego — evite)`}),e.jsx("h2",{children:"Lock — evitar duas execuções simultâneas"}),e.jsx("p",{children:"Cron dispara por horário, não pelo término. Se um job demora mais que o intervalo, dois rodam ao mesmo tempo (corrupção, double-charge, lock em DB)."}),e.jsx(a,{title:"flock — Linux",language:"bash",code:`# Pula execução se já houver outra rodando
*/5 * * * * flock -n /tmp/sync.lock /opt/lampp/bin/php /var/www/cron/sync.php`}),e.jsx(a,{title:"No próprio PHP (multi-plataforma)",language:"php",code:`<?php
$lock = fopen(__DIR__ . '/cron.lock', 'w');
if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) {
    // Outra execução em curso — sai limpo
    exit(0);
}

try {
    // ... seu trabalho ...
} finally {
    flock($lock, LOCK_UN);
    fclose($lock);
}`}),e.jsx("h2",{children:"Windows — Agendador de Tarefas"}),e.jsx("p",{children:"Sem cron nativo. Use o Agendador (Task Scheduler)."}),e.jsx(a,{title:"Caminho via interface",language:"text",code:`Win + R → taskschd.msc
→ Criar Tarefa Básica
   Nome:      Cron Loja
   Disparador: Diária | 03:30
   Ação:      Iniciar um programa
              Programa:    C:\\xampp\\php\\php.exe
              Argumentos:  C:\\xampp\\htdocs\\loja\\cron\\limpar.php
              Iniciar em:  C:\\xampp\\htdocs\\loja
   ☑ Executar mesmo que usuário não esteja logado
   ☑ Executar com privilégios mais altos (se precisar)`}),e.jsx(a,{title:"PowerShell — criar via script",language:"powershell",code:`$action = New-ScheduledTaskAction \`
    -Execute "C:\\xampp\\php\\php.exe" \`
    -Argument "C:\\xampp\\htdocs\\loja\\cron\\limpar.php" \`
    -WorkingDirectory "C:\\xampp\\htdocs\\loja"

$trigger = New-ScheduledTaskTrigger -Daily -At 3:30am

Register-ScheduledTask \`
    -TaskName "CronLojaLimpar" \`
    -Action $action -Trigger $trigger \`
    -Description "Limpa registros antigos da loja"

# Listar
Get-ScheduledTask | Where-Object TaskName -like "Cron*"

# Remover
Unregister-ScheduledTask -TaskName "CronLojaLimpar" -Confirm:$false`}),e.jsx(a,{title:"schtasks — linha de comando clássica",language:"text",code:`schtasks /Create /SC DAILY /ST 03:30 ^
    /TN "CronLoja" ^
    /TR "C:\\xampp\\php\\php.exe C:\\xampp\\htdocs\\loja\\cron\\limpar.php"`}),e.jsx("h2",{children:"Logando no Windows"}),e.jsx(a,{title:"Wrapper .bat",language:"text",code:`@echo off
cd /d C:\\xampp\\htdocs\\loja
"C:\\xampp\\php\\php.exe" cron\\limpar.php >> logs\\cron.log 2>&1`}),e.jsxs("p",{children:["Aponte o Agendador para o ",e.jsx("code",{children:".bat"})," em vez do ",e.jsx("code",{children:"php.exe"}),"."]}),e.jsx("h2",{children:"Padrão Laravel — task scheduler único"}),e.jsxs("p",{children:["Em vez de criar 20 entradas no cron, registre ",e.jsx("strong",{children:"uma só"})," que chama o scheduler do framework, e dentro do código define os intervalos:"]}),e.jsx(a,{language:"bash",code:`# Crontab
* * * * * cd /var/www/loja && /opt/lampp/bin/php artisan schedule:run >> /dev/null 2>&1`}),e.jsx(a,{title:"app/Console/Kernel.php",language:"php",code:`protected function schedule(Schedule $schedule): void
{
    $schedule->command('emails:cobrar')->dailyAt('08:00')->withoutOverlapping();
    $schedule->command('cache:warm')->everyFiveMinutes();
    $schedule->call(fn() => Storage::deleteDirectory('tmp'))->weekly();
}`}),e.jsx("h2",{children:"Receita: cron com retry e alerta"}),e.jsx(a,{title:"cron/sincronizar.php",language:"php",code:`<?php
require __DIR__ . '/../vendor/autoload.php';

$lock = fopen(__DIR__ . '/sync.lock', 'w');
if (!flock($lock, LOCK_EX | LOCK_NB)) exit(0);

$tentativas = 0;
$max = 3;

while ($tentativas < $max) {
    try {
        $tentativas++;
        rodarSincronizacao();
        error_log("[sync] OK tentativa $tentativas");
        exit(0);
    } catch (Throwable $e) {
        error_log("[sync] FALHA #$tentativas: {$e->getMessage()}");
        if ($tentativas < $max) {
            sleep(30 * $tentativas);   // backoff
        }
    }
}

// Esgotaram tentativas — alerta
mail('admin@empresa.com', 'Cron sync falhou', "Após $max tentativas.");
exit(1);`}),e.jsx("h2",{children:"Diagnóstico"}),e.jsx(a,{language:"text",code:`Sintoma                                     Causa
Cron não dispara                            → systemd: 'systemctl status cron'
                                              Win: Tarefa "Última execução: erro 2147..."
"php: command not found"                    → PATH incompleto. Use caminho absoluto.
Roda no shell, não roda no cron             → variável de ambiente faltando (LANG,
                                              HOME, $PATH). Coloque no topo do crontab.
Job rodando duas vezes                      → sem lock. Use flock ou flock no PHP.
Email do cron não chega                     → MTA não instalado. Mande log para arquivo.`}),e.jsxs(o,{type:"warning",title:"XAMPP local ≠ produção",children:["No seu PC, ao desligar a máquina, o cron para. Em produção use VPS ligado 24×7. Para testar lógica sem esperar 24h, force a hora via ",e.jsx("code",{children:"php cron.php"})," manual."]}),e.jsx("h2",{children:"Armadilhas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Caminho relativo no script — cron começa em ",e.jsx("code",{children:"$HOME"}),", não na pasta do arquivo. Use ",e.jsx("code",{children:"__DIR__"})," ou ",e.jsx("code",{children:"chdir()"}),"."]}),e.jsx("li",{children:"Output gigante por engano (debug deixado ligado) — log de 10 GB depois de uma semana."}),e.jsx("li",{children:"Esquecer fuso horário do servidor — agendou 3h achando que era BRT, era UTC."}),e.jsx("li",{children:"Job que crash silencioso sem alerta — você descobre depois de uma semana sem dados."})]})]})}export{d as default};
