import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function PhpIni() {
  return (
    <PageContainer
      title="php.ini — coração da configuração do PHP"
      subtitle="Onde fica, o que tem dentro e quais diretivas você quase sempre vai querer mexer."
      difficulty="intermediario"
      timeToRead="9 min"
    >
      <h2>Onde fica</h2>
      <p>
        No XAMPP o arquivo principal é <code>C:/xampp/php/php.ini</code>{" "}
        (Windows), <code>/opt/lampp/etc/php.ini</code> (Linux), ou{" "}
        <code>/Applications/XAMPP/etc/php.ini</code> (macOS).
      </p>
      <p>
        Você também pode abrir pelo painel: clique em <em>Config</em> ao lado
        de Apache → <code>PHP (php.ini)</code>.
      </p>

      <AlertBox type="warning" title="Não confunda os dois php.ini">
        O XAMPP traz <code>php.ini-development</code> e{" "}
        <code>php.ini-production</code> como modelos. O ativo é apenas{" "}
        <code>php.ini</code>. Reinicie o Apache toda vez que mexer no arquivo —
        mudanças no php.ini só valem após reload do Apache.
      </AlertBox>

      <h2>Diretivas que você vai mexer</h2>
      <ParamsTable
        title="As diretivas mais comuns"
        params={[
          { flag: "memory_limit", desc: "Memória máxima por requisição. Aumente para 512M ao rodar Composer ou WordPress com muitos plugins.", exemplo: "memory_limit = 512M" },
          { flag: "upload_max_filesize", desc: "Tamanho máximo de cada arquivo enviado por upload. Padrão é 2M, normalmente curto.", exemplo: "upload_max_filesize = 64M" },
          { flag: "post_max_size", desc: "Tamanho máximo do POST inteiro (todos os campos somados). Tem que ser igual ou maior que upload_max_filesize.", exemplo: "post_max_size = 80M" },
          { flag: "max_execution_time", desc: "Tempo máximo (em segundos) que um script pode rodar. 30 é pouco para imports grandes.", exemplo: "max_execution_time = 300" },
          { flag: "max_input_time", desc: "Tempo máximo para o PHP receber os dados do POST/GET. Aumente se enviar arquivos grandes em redes lentas.", exemplo: "max_input_time = 300" },
          { flag: "max_input_vars", desc: "Quantas variáveis o PHP aceita por requisição. Formulários gigantes (WordPress) precisam disso aumentado.", exemplo: "max_input_vars = 5000" },
          { flag: "display_errors", desc: "Mostra erros do PHP na tela. Em desenvolvimento, On. Em produção, Off (e use error_log)." , exemplo: "display_errors = On" },
          { flag: "error_reporting", desc: "Quais níveis de erro reportar. Em dev, E_ALL é o mais didático.", exemplo: "error_reporting = E_ALL" },
          { flag: "log_errors", desc: "Salva erros em arquivo de log. Sempre On, em qualquer ambiente.", exemplo: "log_errors = On" },
          { flag: "error_log", desc: "Caminho do log de erros. Padrão joga no log do Apache.", exemplo: 'error_log = "C:/xampp/php/logs/php_error_log"' },
          { flag: "date.timezone", desc: "Fuso horário usado por funções date()/time(). Sem isso o PHP avisa em todo script.", exemplo: 'date.timezone = "America/Sao_Paulo"' },
          { flag: "default_charset", desc: "Encoding padrão. Hoje em dia sempre UTF-8.", exemplo: 'default_charset = "UTF-8"' },
          { flag: "session.gc_maxlifetime", desc: "Tempo de vida das sessões em segundos. Padrão 1440 (24 minutos).", exemplo: "session.gc_maxlifetime = 86400" },
          { flag: "extension=", desc: "Habilita uma extensão (gd, mysqli, intl, etc.). Tire o ; da frente para ativar.", exemplo: "extension=gd" },
        ]}
      />

      <h2>Receita de bolo: ambiente de desenvolvimento confortável</h2>
      <CodeBlock language="ini" code={`; --- php.ini (modo dev) ---
memory_limit = 512M
upload_max_filesize = 64M
post_max_size = 80M
max_execution_time = 300
max_input_vars = 5000

display_errors = On
display_startup_errors = On
error_reporting = E_ALL
log_errors = On
error_log = "C:/xampp/php/logs/php_error_log"

date.timezone = America/Sao_Paulo
default_charset = "UTF-8"

; Extensões essenciais
extension=mysqli
extension=pdo_mysql
extension=mbstring
extension=openssl
extension=gd
extension=intl
extension=zip
extension=curl
extension=fileinfo`} />

      <h2>Diferença entre as instâncias</h2>
      <p>
        O XAMPP às vezes tem mais de um <code>php.ini</code>. Para ter certeza
        de qual o Apache está usando, acesse{" "}
        <code>http://localhost/phpinfo.php</code> com{" "}
        <code>&lt;?php phpinfo(); ?&gt;</code> e procure pela linha{" "}
        <strong>Loaded Configuration File</strong>. É esse o arquivo que vale.
      </p>

      <CodeBlock title="phpinfo.php" language="php" code={`<?php phpinfo(); ?>`} />

      <h2>Mudanças temporárias dentro do código</h2>
      <p>
        Para testes rápidos sem mexer no <code>php.ini</code>, dá para
        sobrescrever no próprio script:
      </p>
      <CodeBlock language="php" code={`<?php
ini_set('memory_limit', '1G');
ini_set('display_errors', '1');
error_reporting(E_ALL);
date_default_timezone_set('America/Sao_Paulo');

// resto do código...`} />

      <AlertBox type="info" title="Tem como saber qual valor está ativo">
        Em código:{" "}
        <code>echo ini_get('upload_max_filesize');</code>. Útil para confirmar
        se a alteração no <code>php.ini</code> realmente surtiu efeito.
      </AlertBox>
    </PageContainer>
  );
}
