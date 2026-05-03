import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function ApacheLogs() {
  return (
    <PageContainer
      title="Logs do Apache — access.log e error.log na prática"
      subtitle="Como ler, customizar formato (LogFormat), separar logs por VirtualHost, fazer rotação e analisar tráfego — tudo dentro do XAMPP."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <AlertBox type="info" title="Onde ficam">
        Padrão XAMPP: <code>C:/xampp/apache/logs/access.log</code> e{" "}
        <code>C:/xampp/apache/logs/error.log</code>. No Linux:{" "}
        <code>/opt/lampp/logs/</code>. Os logs <strong>nunca</strong> param de crescer
        sozinhos — você precisa rotacionar.
      </AlertBox>

      <h2>Os dois arquivos principais</h2>
      <ul>
        <li>
          <strong>access.log</strong> — uma linha por requisição HTTP recebida. É o "diário do
          tráfego": quem entrou, em qual URL, com qual status.
        </li>
        <li>
          <strong>error.log</strong> — erros do Apache, falhas de PHP (quando configurado para
          enviar pra cá), avisos de configuração, mensagens do mod_rewrite com trace.
        </li>
      </ul>

      <h2>Lendo o access.log</h2>
      <CodeBlock
        title="Linha típica (formato 'combined')"
        language="text"
        code={`192.168.0.10 - admin [03/Mai/2026:14:23:11 -0300] "GET /produto/42 HTTP/1.1" 200 4823 "https://meusite.local/loja" "Mozilla/5.0 (Windows NT 10.0)"`}
      />
      <p>Quebrando os campos:</p>
      <ParamsTable
        title="Campos do formato 'combined'"
        params={[
          { flag: "192.168.0.10", desc: "IP do cliente." },
          { flag: "-", desc: "Identidade RFC 1413 (quase sempre vazio)." },
          { flag: "admin", desc: "Usuário autenticado por mod_auth_* (vazio se anônimo)." },
          { flag: "[03/Mai/2026:14:23:11 -0300]", desc: "Data/hora local + offset do servidor." },
          { flag: '"GET /produto/42 HTTP/1.1"', desc: "Método, recurso, versão do protocolo." },
          { flag: "200", desc: "Status HTTP (200 ok, 301 redirect, 404 não achou, 500 erro)." },
          { flag: "4823", desc: "Bytes enviados (sem cabeçalhos)." },
          { flag: '"https://..."', desc: "Referer — página de onde o usuário veio." },
          { flag: '"Mozilla/5.0 ..."', desc: "User-Agent — navegador / bot." },
        ]}
      />

      <h2>Customizando o formato</h2>
      <p>
        No <code>httpd.conf</code> você define um <strong>LogFormat</strong> com placeholders e
        depois associa via <strong>CustomLog</strong>:
      </p>
      <CodeBlock
        title="httpd.conf"
        language="apache"
        code={`# Formato padrão
LogFormat "%h %l %u %t \\"%r\\" %>s %b \\"%{Referer}i\\" \\"%{User-Agent}i\\"" combined

# Formato com tempo de resposta em microssegundos (ótimo para diagnosticar lentidão)
LogFormat "%h %l %u %t \\"%r\\" %>s %b %D \\"%{User-Agent}i\\"" perf

# Logs separados
CustomLog "logs/access.log" combined
CustomLog "logs/perf.log" perf`}
      />

      <ParamsTable
        title="Placeholders mais úteis em LogFormat"
        params={[
          { flag: "%h", desc: "Host remoto (IP do cliente)." },
          { flag: "%t", desc: "Hora da requisição." },
          { flag: "%r", desc: "Primeira linha da requisição (método + URI + protocolo)." },
          { flag: "%>s", desc: "Status HTTP final (após reescritas)." },
          { flag: "%b", desc: "Bytes enviados (sem header)." },
          { flag: "%{Referer}i", desc: "Cabeçalho de entrada (substitua Referer por qualquer header)." },
          { flag: "%{User-Agent}i", desc: "Navegador/bot." },
          { flag: "%T", desc: "Tempo total da resposta em segundos." },
          { flag: "%D", desc: "Tempo total da resposta em microssegundos." },
          { flag: "%X", desc: "Estado da conexão ao final ('-' close, '+' keep-alive, 'X' aborted)." },
          { flag: "%{cookie_nome}C", desc: "Valor de um cookie." },
        ]}
      />

      <h2>Logs por Virtual Host</h2>
      <CodeBlock
        title="httpd-vhosts.conf"
        language="apache"
        code={`<VirtualHost *:80>
    ServerName loja.local
    DocumentRoot "C:/xampp/htdocs/loja"
    ErrorLog "logs/loja-error.log"
    CustomLog "logs/loja-access.log" combined
</VirtualHost>

<VirtualHost *:80>
    ServerName api.local
    DocumentRoot "C:/xampp/htdocs/api"
    ErrorLog "logs/api-error.log"
    CustomLog "logs/api-access.log" combined
</VirtualHost>`}
      />

      <h2>Lendo o error.log</h2>
      <CodeBlock
        title="Exemplos típicos"
        language="text"
        code={`[Sun May 03 14:21:00.000 2026] [core:error] [pid 4392] [client 127.0.0.1:55012] AH00126: Invalid URI in request GET /\\xff\\xff
[Sun May 03 14:22:13.000 2026] [php:error] [pid 4392] PHP Fatal error: Uncaught Error: Class "Foo" not found in /htdocs/index.php:5
[Sun May 03 14:25:48.000 2026] [proxy:warn] [pid 4392] AH01144: No protocol handler was valid for the URL /api/`}
      />

      <p>
        O nível antes do <code>:</code> indica severidade — <code>emerg</code>, <code>alert</code>,
        <code>crit</code>, <code>error</code>, <code>warn</code>, <code>notice</code>,{" "}
        <code>info</code>, <code>debug</code>, <code>trace1..8</code>. Defina o mínimo no{" "}
        <code>httpd.conf</code>:
      </p>
      <CodeBlock
        language="apache"
        code={`LogLevel warn               # padrão sensato
LogLevel rewrite:trace3     # SÓ o mod_rewrite em trace3 (debug regras)
LogLevel proxy:debug        # debug para proxy reverso`}
      />

      <h2>Análise rápida</h2>
      <CodeBlock
        title="Linhas mais lentas (PowerShell / Linux)"
        language="bash"
        code={`# Linux / Git Bash — top 10 URLs mais lentas (precisa do %D no formato)
awk '{print $NF, $7}' logs/perf.log | sort -nr | head

# Top 20 IPs com mais hits
awk '{print $1}' logs/access.log | sort | uniq -c | sort -nr | head -20

# Códigos de status agrupados
awk '{print $9}' logs/access.log | sort | uniq -c | sort -nr

# Últimos 50 erros 500
grep ' 500 ' logs/access.log | tail -50

# Erros do PHP
grep -i 'php' logs/error.log | tail -50`}
      />

      <h2>Rotação de logs</h2>
      <p>
        Sem rotação, <code>access.log</code> facilmente passa de 1&nbsp;GB e degrada a performance
        do filesystem. O Apache traz o utilitário <strong>rotatelogs</strong>:
      </p>
      <CodeBlock
        title="Diariamente, mantendo no máximo 30 dias"
        language="apache"
        code={`# Roda em pipe — Apache nunca segura o handle do arquivo
CustomLog "|bin/rotatelogs.exe -l logs/access-%Y%m%d.log 86400" combined

# 86400 segundos = 1 dia. Para 1 hora use 3600.
# -l = usar hora local em vez de UTC
# Limpe arquivos antigos com tarefa agendada / cron`}
      />
      <p>
        No Linux há também <code>logrotate</code> (recomendado fora do XAMPP — leve
        e padrão).
      </p>

      <h2>Onde os erros do PHP aparecem?</h2>
      <p>Depende de duas diretivas no <code>php.ini</code>:</p>
      <CodeBlock
        language="ini"
        code={`log_errors = On
error_log = "C:/xampp/php/logs/php_error_log"

; Se log_errors = On e error_log estiver vazio, o PHP envia para o
; SAPI — no Apache cai no error.log do Apache.`}
      />

      <AlertBox type="danger" title="Não logue senhas">
        Cuidado com formatos custom incluindo <code>%{`{Cookie}i`}</code> ou{" "}
        <code>%q</code> (query string) — eles podem registrar tokens e dados sensíveis.
        Mascare antes de logar ou desative em produção.
      </AlertBox>

      <h2>Ferramentas de visualização</h2>
      <ul>
        <li><strong>GoAccess</strong> — terminal interativo + relatório HTML, em segundos.</li>
        <li><strong>AWStats</strong> — incluído como módulo extra do XAMPP.</li>
        <li><strong>Webalizer</strong> — clássico (capítulo dedicado).</li>
        <li><strong>Loki + Grafana</strong> — para quem já está pronto para monitorar de verdade.</li>
      </ul>
    </PageContainer>
  );
}
