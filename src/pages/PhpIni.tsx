import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function PhpIni() {
  return (
    <PageContainer
      title="php.ini — coração da configuração do PHP"
      subtitle="Onde fica, como o PHP escolhe qual php.ini usar, sintaxe completa, escopo de mudança (PHP_INI_SYSTEM/PERDIR/USER/ALL), receitas para dev/prod e como inspecionar o que está realmente ativo."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        XAMPP instalado e Apache rodando. Saber editar arquivo de texto puro.
        Já ter visto a página <code>phpinfo()</code> ao menos uma vez ajuda.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>php.ini</strong> — arquivo de texto, formato INI (chave=valor
        agrupado em seções entre colchetes), lido pelo PHP no boot. Controla
        praticamente todo comportamento do PHP — limites de memória, qual
        timezone usar, quais extensões carregar, como reportar erros.
      </p>
      <p>
        <strong>SAPI (Server API)</strong> — a "interface" pela qual o PHP
        roda. As mais comuns no XAMPP: <code>apache2handler</code> (PHP
        embutido como módulo do Apache) e <code>cli</code> (PHP no terminal).
        Cada SAPI pode ter um <code>php.ini</code> próprio.
      </p>
      <p>
        <strong>Diretiva</strong> — uma linha <code>nome = valor</code> no
        php.ini. PHP 8.x tem mais de 400 diretivas (<code>php -i</code> lista
        todas).
      </p>
      <p>
        <strong>Escopo de mudança (changeable)</strong> — onde uma diretiva
        pode ser alterada: só no php.ini (PHP_INI_SYSTEM), também em .htaccess
        (PHP_INI_PERDIR), também em runtime via <code>ini_set()</code>{" "}
        (PHP_INI_USER), ou em qualquer lugar (PHP_INI_ALL).
      </p>

      <h2>Onde fica</h2>
      <p>No XAMPP o arquivo principal é:</p>
      <CodeBlock language="text" code={`Windows: C:/xampp/php/php.ini
Linux:   /opt/lampp/etc/php.ini
macOS:   /Applications/XAMPP/etc/php.ini`} />
      <p>
        Você também pode abrir pelo painel: clique em <em>Config</em> ao lado
        de Apache → <code>PHP (php.ini)</code>.
      </p>

      <h2>Como o PHP escolhe qual php.ini usar</h2>
      <p>O PHP procura nessa ordem (e usa o primeiro que achar):</p>
      <ol>
        <li>Variável de ambiente <code>PHPRC</code> (caminho explícito).</li>
        <li><code>HKLM/Software/PHP</code> no registro do Windows (não usado pelo XAMPP).</li>
        <li>O argumento <code>-c</code> da linha de comando (<code>php -c outro.ini</code>).</li>
        <li>Pasta atual da execução.</li>
        <li>Pasta retornada por <code>get_cfg_var('cfg_file_path')</code>.</li>
        <li>Pasta de instalação do PHP (compile-time).</li>
      </ol>
      <p>
        Para ter <strong>certeza</strong> de qual está ativo, abra
        <code>http://localhost/dashboard/phpinfo.php</code> e procure por:
      </p>
      <CodeBlock language="text" code={`Loaded Configuration File         ← É ESSE que o PHP carregou agora
Scan this dir for additional .ini files
Additional .ini files parsed      ← outros .ini incluídos`} />

      <AlertBox type="warning" title="Não confunda os dois php.ini de exemplo">
        O PHP traz <code>php.ini-development</code> e{" "}
        <code>php.ini-production</code> como modelos. O ativo é apenas{" "}
        <code>php.ini</code>. Se mexer no -development e nada acontecer, é
        porque ele não é o ativo. Reinicie o Apache toda vez que mexer no
        php.ini — mudanças só valem após reload do SAPI.
      </AlertBox>

      <h2>Sintaxe do arquivo INI</h2>
      <CodeBlock language="ini" code={`; comentário começa com ponto-e-vírgula
; (também aceita # mas o oficial é ;)

; SEÇÃO entre colchetes — apenas organiza visualmente
[PHP]

; valor = string sem aspas
date.timezone = America/Sao_Paulo

; valor = string com aspas (necessário se houver espaço)
error_log = "C:/xampp/php/logs/php_error_log"

; valor = número (com sufixo K/M/G de bytes)
memory_limit = 512M
post_max_size = 80M

; valor = booleano (On/Off, true/false, 1/0, yes/no)
display_errors = On

; constante predefinida
error_reporting = E_ALL & ~E_DEPRECATED

; valor = lista (use vírgula)
disable_functions = exec,passthru,shell_exec,system

; herdar valor de uma variável de ambiente
session.save_path = \${TMPDIR}/sessions

; sobrescrever por SAPI — só Apache (não CLI)
[PATH=apache]
display_errors = On`} />

      <h2>Escopo de mudança — onde cada diretiva pode mudar</h2>
      <p>
        Cada diretiva tem um <strong>changeable</strong> que diz onde você
        pode mudá-la:
      </p>
      <ParamsTable
        title="Modos de modificação"
        params={[
          { flag: "PHP_INI_SYSTEM", desc: "Só no php.ini (ou httpd.conf via php_admin_value). Exemplo: open_basedir, disable_functions." },
          { flag: "PHP_INI_PERDIR", desc: "php.ini + .htaccess (php_value/php_flag) + httpd.conf. Exemplo: upload_max_filesize." },
          { flag: "PHP_INI_USER", desc: "Tudo acima + ini_set() em runtime no script. Exemplo: memory_limit, max_execution_time." },
          { flag: "PHP_INI_ALL", desc: "Pode ser mudada em qualquer lugar." },
        ]}
      />
      <p>
        A documentação oficial (php.net/manual/pt_BR/ini.list.php) lista
        TODAS as diretivas com o changeable de cada uma.
      </p>

      <h2>Mudança em .htaccess (Apache + mod_php)</h2>
      <CodeBlock language="apache" code={`# .htaccess — vale só dentro da pasta
php_value upload_max_filesize 100M
php_value post_max_size 110M
php_value memory_limit 512M

# php_flag para booleanos
php_flag display_errors on

# Versão "trancada" — usuário não consegue sobrescrever em ini_set()
php_admin_value memory_limit 256M
php_admin_flag display_errors off`} />

      <h2>Diretivas que você vai mexer com frequência</h2>
      <ParamsTable
        title="As diretivas mais comuns"
        params={[
          { flag: "memory_limit", desc: "Memória máxima por requisição. Aumente para 512M ao rodar Composer ou WordPress com muitos plugins. -1 = ilimitado.", exemplo: "memory_limit = 512M" },
          { flag: "upload_max_filesize", desc: "Tamanho máximo de cada arquivo enviado por upload. Padrão é 2M, normalmente curto.", exemplo: "upload_max_filesize = 64M" },
          { flag: "post_max_size", desc: "Tamanho máximo do POST inteiro (todos os campos somados). Tem que ser igual ou maior que upload_max_filesize.", exemplo: "post_max_size = 80M" },
          { flag: "max_file_uploads", desc: "Quantos arquivos podem ser enviados em um único request multipart. Padrão 20.", exemplo: "max_file_uploads = 50" },
          { flag: "max_execution_time", desc: "Tempo máximo (em segundos) que um script pode rodar. 30 é pouco para imports grandes. 0 = sem limite.", exemplo: "max_execution_time = 300" },
          { flag: "max_input_time", desc: "Tempo máximo para o PHP receber os dados do POST/GET. Aumente se enviar arquivos grandes em redes lentas.", exemplo: "max_input_time = 300" },
          { flag: "max_input_vars", desc: "Quantas variáveis o PHP aceita por requisição. Formulários gigantes (WordPress) precisam disso aumentado.", exemplo: "max_input_vars = 5000" },
          { flag: "display_errors", desc: "Mostra erros do PHP na tela. Em desenvolvimento, On. Em produção, Off (e use error_log).", exemplo: "display_errors = On" },
          { flag: "display_startup_errors", desc: "Mostra erros que ocorrem na inicialização do PHP. Junto com display_errors em dev.", exemplo: "display_startup_errors = On" },
          { flag: "error_reporting", desc: "Quais níveis de erro reportar. Em dev, E_ALL é o mais didático.", exemplo: "error_reporting = E_ALL" },
          { flag: "log_errors", desc: "Salva erros em arquivo de log. Sempre On, em qualquer ambiente.", exemplo: "log_errors = On" },
          { flag: "error_log", desc: "Caminho do log de erros. Padrão joga no log do Apache.", exemplo: 'error_log = "C:/xampp/php/logs/php_error_log"' },
          { flag: "date.timezone", desc: "Fuso horário usado por funções date()/time(). Sem isso o PHP avisa em todo script.", exemplo: 'date.timezone = "America/Sao_Paulo"' },
          { flag: "default_charset", desc: "Encoding padrão. Hoje em dia sempre UTF-8.", exemplo: 'default_charset = "UTF-8"' },
          { flag: "default_socket_timeout", desc: "Timeout default para fopen/file_get_contents em URLs. Padrão 60.", exemplo: "default_socket_timeout = 30" },
          { flag: "session.gc_maxlifetime", desc: "Tempo de vida das sessões em segundos. Padrão 1440 (24 minutos).", exemplo: "session.gc_maxlifetime = 86400" },
          { flag: "session.cookie_secure", desc: "Cookie de sessão só vai por HTTPS. Sempre On em produção.", exemplo: "session.cookie_secure = On" },
          { flag: "session.cookie_httponly", desc: "Cookie inacessível por JS — defesa contra XSS. Sempre On.", exemplo: "session.cookie_httponly = On" },
          { flag: "session.cookie_samesite", desc: "SameSite. Lax cobre 90% dos casos com boa segurança.", exemplo: 'session.cookie_samesite = "Lax"' },
          { flag: "extension=", desc: "Habilita uma extensão (gd, mysqli, intl, etc.). Tire o ; da frente para ativar.", exemplo: "extension=gd" },
          { flag: "zend_extension=", desc: "Habilita extensão Zend (opcache, xdebug). Sintaxe igual mas é uma família diferente.", exemplo: "zend_extension=opcache" },
          { flag: "opcache.enable", desc: "OPcache — cacheia bytecode PHP. Liga ganho enorme de performance.", exemplo: "opcache.enable = 1" },
          { flag: "opcache.memory_consumption", desc: "Quanta memória o OPcache pode usar (MB). Padrão 128.", exemplo: "opcache.memory_consumption = 256" },
          { flag: "realpath_cache_size", desc: "Cache de caminhos absolutos. Para frameworks com muitos includes, aumente.", exemplo: "realpath_cache_size = 4096K" },
          { flag: "open_basedir", desc: "Limita o PHP a ler/escrever só nestas pastas. Em hospedagem compartilhada é vital.", exemplo: 'open_basedir = "C:/xampp/htdocs/projeto"' },
          { flag: "disable_functions", desc: "Lista de funções proibidas. Para apertar a segurança em produção.", exemplo: "disable_functions = exec,passthru,shell_exec" },
          { flag: "expose_php", desc: "Mostra 'X-Powered-By: PHP/8.4' no header. Off em produção.", exemplo: "expose_php = Off" },
        ]}
      />

      <h2>Receita: ambiente de desenvolvimento confortável</h2>
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

; OPcache (mantém em dev; com revalidate alto)
[opcache]
opcache.enable = 1
opcache.enable_cli = 1
opcache.validate_timestamps = 1
opcache.revalidate_freq = 0   ; reverifica em toda requisição (dev)

; Extensões essenciais
extension=mysqli
extension=pdo_mysql
extension=mbstring
extension=openssl
extension=gd
extension=intl
extension=zip
extension=curl
extension=fileinfo
extension=exif`} />

      <h2>Receita: ambiente de produção apertado</h2>
      <CodeBlock language="ini" code={`; --- php.ini (modo prod) ---
memory_limit = 256M
max_execution_time = 30

; NÃO mostrar erros para o usuário
display_errors = Off
display_startup_errors = Off
log_errors = On
error_reporting = E_ALL & ~E_DEPRECATED & ~E_STRICT

; Esconder versão
expose_php = Off

; Cookies seguros
session.cookie_secure = On
session.cookie_httponly = On
session.cookie_samesite = "Lax"
session.use_strict_mode = 1

; OPcache otimizado
opcache.enable = 1
opcache.memory_consumption = 256
opcache.max_accelerated_files = 20000
opcache.validate_timestamps = 0   ; NÃO reverifica - mais rápido
opcache.preload = "/var/www/preload.php"  ; PHP 7.4+

; Travar pasta
open_basedir = "/var/www/projeto:/tmp"

; Bloquear funções perigosas
disable_functions = exec,passthru,shell_exec,system,proc_open,popen`} />

      <h2>Mudanças temporárias dentro do código</h2>
      <p>
        Para testes rápidos sem mexer no <code>php.ini</code>, dá para
        sobrescrever no próprio script (só funciona em diretivas com
        changeable PHP_INI_USER ou PHP_INI_ALL):
      </p>
      <CodeBlock language="php" code={`<?php
ini_set('memory_limit', '1G');
ini_set('display_errors', '1');
error_reporting(E_ALL);
date_default_timezone_set('America/Sao_Paulo');

// Conferir o valor atual
echo ini_get('upload_max_filesize');  // "64M"

// Resetar para o valor original do php.ini
ini_restore('memory_limit');

// Listar TUDO que está ativo
print_r(ini_get_all());

// resto do código...`} />

      <AlertBox type="info" title="phpinfo() — sua melhor amiga">
        Crie um arquivo <code>htdocs/info.php</code> com{" "}
        <code>&lt;?php phpinfo(); ?&gt;</code>. Acesse pelo navegador. Mostra:
        versão do PHP, qual php.ini foi carregado, quais extensões estão
        ativas, todas as variáveis de ambiente, todas as diretivas com{" "}
        <strong>Local Value</strong> (depois de .htaccess/ini_set) e{" "}
        <strong>Master Value</strong> (do php.ini). Em produção: APAGUE esse
        arquivo (vaza muita info).
      </AlertBox>

      <CodeBlock title="phpinfo.php" language="php" code={`<?php phpinfo(); ?>`} />

      <h2>php.ini do CLI vs do Apache</h2>
      <p>
        O PHP do terminal (<code>php script.php</code>) <strong>pode</strong>{" "}
        usar um php.ini diferente do Apache. Para confirmar:
      </p>
      <CodeBlock language="bash" code={`# Qual php.ini o CLI usa?
php --ini

# Saída exemplo:
# Configuration File (php.ini) Path: C:\\xampp\\php
# Loaded Configuration File:         C:\\xampp\\php\\php.ini
# Scan for additional .ini files in: (none)

# Qual php.ini o Apache usa? Veja em phpinfo.php`} />
      <p>
        No XAMPP, normalmente o CLI e o Apache usam o mesmo arquivo. Em
        Linux modernos (sem XAMPP), são separados:{" "}
        <code>/etc/php/8.4/cli/php.ini</code> vs{" "}
        <code>/etc/php/8.4/apache2/php.ini</code>.
      </p>

      <h2>Diagnóstico</h2>
      <ParamsTable
        title="Comandos para inspecionar a configuração ativa"
        params={[
          { flag: "php --ini", desc: "Mostra o caminho do php.ini ativo no CLI." },
          { flag: "php -i", desc: "Igual ao phpinfo() mas em texto puro no terminal." },
          { flag: "php -i | grep -i memory", desc: "Filtra a saída do -i por uma palavra (memory_limit, opcache, etc.)." },
          { flag: "php -m", desc: "Lista todas as extensões carregadas." },
          { flag: "php --rf nome_funcao", desc: "Mostra a assinatura de uma função (Reflection)." },
          { flag: "php --rc NomeClasse", desc: "Mostra a estrutura de uma classe." },
          { flag: "php -d memory_limit=1G script.php", desc: "Roda script com -d sobrescrevendo uma diretiva apenas para essa execução." },
        ]}
      />
    </PageContainer>
  );
}
