import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function PhpExtensoes() {
  return (
    <PageContainer
      title="Extensões do PHP"
      subtitle="Como o PHP é modular, diferença entre extensões internas, da PECL e Zend, como ativar, instalar do zero (incluindo .dll com TS/NTS, x86/x64) e referência das extensões mais usadas."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        XAMPP instalado. Capítulo de <a href="#/php-ini">php.ini</a> lido.
        Saber abrir um terminal/CMD.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Extensão</strong> — biblioteca em C compilada que estende o
        PHP com funções, classes e constantes nativas. Vive em{" "}
        <code>php/ext/</code> como <code>.dll</code> (Windows) ou{" "}
        <code>.so</code> (Linux/macOS).
      </p>
      <p>
        <strong>Extensão interna (bundled)</strong> — vem junto com o PHP, em
        geral só precisa descomentar no <code>php.ini</code>. Exemplos:
        mbstring, mysqli, gd, curl, intl, zip.
      </p>
      <p>
        <strong>PECL (PHP Extension Community Library)</strong> — repositório
        oficial de extensões adicionais. Não vêm no PHP "vanilla" — você
        baixa, compila/instala, depois carrega. Exemplos: redis, mongodb,
        imagick, xdebug.
      </p>
      <p>
        <strong>Extensão Zend</strong> — extensão que se "engancha" mais
        fundo no engine do Zend. No php.ini se carrega com{" "}
        <code>zend_extension=</code> em vez de <code>extension=</code>.
        Exemplos: opcache, xdebug.
      </p>
      <p>
        <strong>TS / NTS</strong> — Thread Safe / Non-Thread-Safe. No XAMPP
        Windows o PHP é compilado em modo TS (porque o Apache no Windows usa
        threads). No Linux moderno (PHP-FPM) é NTS.
      </p>
      <p>
        <strong>Compatibilidade ABI</strong> — o <code>.dll</code> precisa
        bater com a versão MAJOR.MINOR do PHP, com a arquitetura (x86 ou
        x64) e com o modo (TS/NTS) e com a versão do Visual C++ usada
        (VS16 / VS17).
      </p>

      <h2>Habilitando uma extensão interna</h2>
      <p>
        Abra o <code>php.ini</code> e procure por <code>extension=</code>.
        Você verá uma lista assim:
      </p>
      <CodeBlock language="ini" code={`;extension=bz2
extension=curl
;extension=ffi
;extension=ftp
extension=fileinfo
extension=gd
extension=gettext
;extension=gmp
extension=intl
;extension=imap
;extension=ldap
extension=mbstring
extension=exif
;extension=mysqli         ← desativada
;extension=oci8_19
;extension=odbc
;extension=openssl
;extension=pdo_firebird
extension=pdo_mysql
;extension=pdo_oci
;extension=pdo_odbc
;extension=pdo_pgsql
;extension=pdo_sqlite
;extension=pgsql
;extension=shmop`} />
      <p>
        O <code>;</code> no início significa "comentado" (desativado). Tire
        o <code>;</code> para ativar. Salve e <strong>reinicie o Apache</strong>.
      </p>

      <AlertBox type="info" title="Sintaxes equivalentes">
        Todas estas formas funcionam:
        <CodeBlock language="ini" code={`extension=gd                 ; nome curto (recomendado)
extension=gd.dll             ; nome completo (Windows, opcional)
extension=php_gd.dll         ; com prefixo php_ (legado, ainda funciona)
extension="C:/path/abs.dll"  ; caminho absoluto (raro)`} />
      </AlertBox>

      <h2>Categorias de extensões internas</h2>
      <p>A documentação oficial agrupa em categorias funcionais:</p>
      <ul>
        <li><strong>Banco de dados</strong> — mysqli, pdo_mysql, pdo_pgsql, pgsql, sqlite3, pdo_sqlite, oci8, sqlsrv.</li>
        <li><strong>Criptografia/segurança</strong> — openssl, sodium, hash, password, mcrypt (legado).</li>
        <li><strong>Texto/encoding</strong> — mbstring, iconv, intl, gettext.</li>
        <li><strong>Imagem</strong> — gd, exif, imagick (PECL).</li>
        <li><strong>Rede/HTTP</strong> — curl, sockets, ftp, ldap, snmp, soap.</li>
        <li><strong>Arquivo/compressão</strong> — fileinfo, zip, zlib, bz2, phar.</li>
        <li><strong>Datas/formatação</strong> — intl, calendar.</li>
        <li><strong>XML/JSON</strong> — json (sempre on), simplexml, dom, xml, xsl.</li>
        <li><strong>Performance</strong> — opcache (Zend), apcu (PECL).</li>
        <li><strong>Outros</strong> — pcntl (Linux), posix (Linux), gmp, bcmath, sodium.</li>
      </ul>

      <h2>As extensões essenciais (que projetos modernos exigem)</h2>
      <ParamsTable
        title="Lista que cobre WordPress, Laravel, Symfony, CakePHP, Drupal..."
        params={[
          { flag: "mysqli / pdo_mysql", desc: "Conectar no MySQL/MariaDB. Praticamente todo CMS e framework PHP usa pelo menos uma." },
          { flag: "mbstring", desc: "Funções multibyte (UTF-8, acentos, emojis). Essencial. WordPress, Laravel, Symfony reclamam sem ela." },
          { flag: "openssl", desc: "Criptografia, HTTPS, hash, JWT. Sem ela, Composer não consegue baixar dependências por HTTPS." },
          { flag: "curl", desc: "Cliente HTTP. APIs, integrações, Guzzle, Composer — todos dependem." },
          { flag: "gd", desc: "Manipulação de imagens (redimensionar, criar thumbnails, gerar captcha)." },
          { flag: "imagick (PECL)", desc: "Alternativa mais poderosa à GD via ImageMagick. Suporta MUITO mais formatos. Não vem habilitada — instale via PECL." },
          { flag: "intl", desc: "Internacionalização: formatação de datas, moedas, números e collation por idioma. Symfony e Laravel exigem." },
          { flag: "zip", desc: "Ler/escrever arquivos .zip. Composer (atualizar pacotes), WordPress (instalar plugins), Laravel exigem." },
          { flag: "fileinfo", desc: "Detecta o MIME-type real de um arquivo. Para uploads seguros, NÃO confie só na extensão do arquivo." },
          { flag: "exif", desc: "Lê metadados EXIF de fotos JPEG (rotação, geolocalização, câmera, ISO, etc.)." },
          { flag: "soap", desc: "Cliente SOAP. Quase todo sistema legado/governamental ainda fala SOAP." },
          { flag: "ldap", desc: "Conectar a Active Directory ou OpenLDAP." },
          { flag: "pgsql / pdo_pgsql", desc: "Conectar no PostgreSQL." },
          { flag: "sqlite3 / pdo_sqlite", desc: "Banco SQLite (arquivo único). Útil para testes e bancos pequenos." },
          { flag: "bcmath / gmp", desc: "Aritmética de precisão arbitrária (números enormes). Bcmath para finanças, GMP para criptografia." },
          { flag: "sodium", desc: "Libsodium — criptografia moderna (ChaCha20, Ed25519). PHP 7.2+. Sempre prefira a OpenSSL antiga." },
          { flag: "opcache (Zend)", desc: "Cacheia o bytecode compilado entre requisições. Ganho de performance brutal — sempre ativo em prod." },
          { flag: "apcu (PECL)", desc: "Cache em memória user-land (chave/valor). Mais leve que Redis quando precisa só de um nó." },
          { flag: "redis (PECL)", desc: "Cliente Redis. Não vem no XAMPP — instale via PECL para usar Redis como cache/queue." },
          { flag: "mongodb (PECL)", desc: "Driver MongoDB oficial." },
          { flag: "xdebug (PECL)", desc: "Debug com breakpoints, var_dump turbinado, profiler. Cobre o capítulo dedicado." },
        ]}
      />

      <h2>Como saber se a extensão foi carregada</h2>
      <p>Quatro jeitos rápidos:</p>
      <CodeBlock language="php" code={`<?php
// 1. Verificação direta
if (extension_loaded('gd')) {
    echo 'GD está habilitada!';
} else {
    echo 'GD não foi carregada.';
}

// 2. Lista todas as extensões em PHP
print_r(get_loaded_extensions());

// 3. Função específica daquela extensão
if (function_exists('curl_init')) {
    echo 'cURL OK';
}

// 4. Diretivas de uma extensão
print_r(ini_get_all('opcache'));`} />

      <CodeBlock language="bash" code={`# 5. No terminal — lista TUDO carregado pelo CLI
C:/xampp/php/php.exe -m

# Saída exemplo:
# [PHP Modules]
# bcmath
# Core
# ctype
# curl
# date
# fileinfo
# ...
# [Zend Modules]
# Zend OPcache
# Xdebug

# Filtre por uma palavra
php -m | grep -i mysql`} />
      <p>
        Ou abra a página do <code>phpinfo()</code> e procure pelo nome da
        extensão. Cada uma tem sua seção dedicada com versão, opções de
        compilação e diretivas.
      </p>

      <AlertBox type="warning" title="Composer reclama de extensão faltando">
        Quando o Composer falha com erro como{" "}
        <code>requires ext-zip * but it is not present</code>, é só ativar
        a extensão correspondente no <code>php.ini</code> e reiniciar o
        Apache. Se também for usar via terminal, lembre que o PHP do CLI
        pode usar um <code>php.ini</code> diferente do Apache. No XAMPP,
        costuma ser o mesmo — em outras instalações, não.
      </AlertBox>

      <h2>Instalando extensões PECL no Windows (XAMPP)</h2>
      <p>Roteiro completo para <strong>Redis</strong>, <strong>MongoDB</strong>, <strong>Imagick</strong>:</p>
      <ol>
        <li>
          Em <code>http://localhost/dashboard/phpinfo.php</code>, anote:
          <ul>
            <li><strong>PHP Version</strong> — ex.: 8.4.0</li>
            <li><strong>Architecture</strong> — x64</li>
            <li><strong>PHP Extension Build</strong> — ex.: API20240924,TS,VS17 (TS = Thread Safe, VS17 = Visual Studio 2022)</li>
          </ul>
        </li>
        <li>
          Vá em <a href="https://pecl.php.net/" target="_blank" rel="noreferrer">pecl.php.net</a> ou{" "}
          <a href="https://windows.php.net/downloads/pecl/" target="_blank" rel="noreferrer">windows.php.net/downloads/pecl/</a>{" "}
          e procure pela extensão.
        </li>
        <li>
          Baixe a coluna que bate exatamente com sua build (ex.:{" "}
          <code>8.4 Thread Safe (TS) x64</code>).
        </li>
        <li>
          Extraia o ZIP. Copie <code>php_redis.dll</code> para{" "}
          <code>C:/xampp/php/ext/</code>.
        </li>
        <li>Adicione no <code>php.ini</code>: <code>extension=redis</code></li>
        <li>Reinicie o Apache.</li>
        <li>
          Confirme: <code>php -m | grep redis</code> ou na página phpinfo.
        </li>
      </ol>

      <CodeBlock language="ini" code={`; Adições típicas no php.ini

extension=php_redis.dll
extension=php_mongodb.dll
extension=php_imagick.dll      ; precisa também das DLLs do ImageMagick na mesma pasta`} />

      <AlertBox type="warning" title="O imagick é chato no Windows">
        A extensão <code>imagick</code> precisa das DLLs do ImageMagick
        (CORE_RL_*) na pasta <code>C:/xampp/php/</code> e do executável
        ImageMagick instalado no sistema com o PATH configurado. Se algo
        falha, o Apache nem inicia. Em produção Linux é trivial; no XAMPP
        Windows, considere usar GD se possível.
      </AlertBox>

      <h2>Instalando via PECL no Linux/macOS</h2>
      <CodeBlock language="bash" code={`# No XAMPP Linux, o pecl vem em:
sudo /opt/lampp/bin/pecl install redis

# Vai compilar do código-fonte. Pode pedir para baixar libs do sistema.
# Quando terminar, vai sugerir:
# Add 'extension=redis.so' to php.ini

# Edite /opt/lampp/etc/php.ini e adicione a linha
# Reinicie o Apache do XAMPP
sudo /opt/lampp/lampp restart`} />

      <h2>Verificando dependências de uma extensão</h2>
      <CodeBlock language="bash" code={`# Windows — usa Dependency Walker (depends.exe)
depends.exe C:/xampp/php/ext/php_imagick.dll

# Linux — ldd
ldd /opt/lampp/lib/php/extensions/no-debug-non-zts-20230831/redis.so

# Vai listar as bibliotecas .so/.dll que aquela extensão precisa.
# Se alguma estiver "not found", o Apache não vai conseguir carregar.`} />

      <h2>Diagnóstico — extensão não carrega, e agora?</h2>
      <ParamsTable
        title="Sintomas e causas"
        params={[
          { flag: "Apache não inicia depois de adicionar extension=", desc: "Versão errada do .dll (TS vs NTS, x86 vs x64, versão do PHP errada). Olhe apache/logs/error.log." },
          { flag: "PHP Warning: PHP Startup: Unable to load dynamic library", desc: "Caminho da DLL errado ou DLL corrompida. Confirme que o arquivo existe em php/ext/." },
          { flag: "extensão aparece em php -m mas não em phpinfo()", desc: "CLI e Apache usam php.ini diferentes — adicione no php.ini do Apache também." },
          { flag: "função não existe mas extensão aparece em phpinfo()", desc: "Versão da extensão muito antiga. Atualize." },
          { flag: "DLL Carregada mas comportamento errado", desc: "Versão da lib externa (Imagick → ImageMagick) incompatível. Reinstale ambos com versões emparelhadas." },
        ]}
      />
    </PageContainer>
  );
}
