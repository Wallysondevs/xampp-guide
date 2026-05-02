import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function PhpExtensoes() {
  return (
    <PageContainer
      title="Extensões do PHP"
      subtitle="Como ativar mbstring, GD, intl, zip e tudo mais que seu Composer ou WordPress reclamar."
      difficulty="iniciante"
      timeToRead="6 min"
    >
      <h2>O que é uma extensão</h2>
      <p>
        Extensões são bibliotecas em C compiladas que estendem o PHP com
        funções nativas. Elas vivem em <code>php/ext/</code> como arquivos{" "}
        <code>.dll</code> (Windows) ou <code>.so</code> (Linux/macOS). Para
        ativar, basta editar o <code>php.ini</code>.
      </p>

      <h2>Habilitando uma extensão</h2>
      <p>
        Abra o <code>php.ini</code> e procure por <code>extension=</code>. Você
        verá uma lista assim:
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
        O <code>;</code> no início significa "comentado" (desativado). Tire o{" "}
        <code>;</code> para ativar. Salve e reinicie o Apache.
      </p>

      <h2>As extensões essenciais</h2>
      <ParamsTable
        title="Extensões que projetos modernos exigem"
        params={[
          { flag: "mysqli / pdo_mysql", desc: "Para conectar no MySQL/MariaDB. Praticamente todo CMS e framework PHP usa." },
          { flag: "mbstring", desc: "Funções multibyte (UTF-8, acentos, emojis). Essencial. WordPress, Laravel, Symfony reclamam sem ela." },
          { flag: "openssl", desc: "Criptografia, HTTPS, hash, JWT. Sem ela, Composer não consegue baixar dependências por HTTPS." },
          { flag: "curl", desc: "Cliente HTTP. APIs, integrações, Guzzle, Composer — todos dependem." },
          { flag: "gd", desc: "Manipulação de imagens (redimensionar, criar thumbnails, gerar captcha)." },
          { flag: "imagick", desc: "Alternativa mais poderosa à GD via ImageMagick. Não vem habilitada por padrão." },
          { flag: "intl", desc: "Internacionalização: formatação de datas, moedas e números por idioma." },
          { flag: "zip", desc: "Ler/escrever arquivos .zip. Exigida pelo Composer, WordPress (instalar plugins), Laravel." },
          { flag: "fileinfo", desc: "Detecta o MIME-type real de um arquivo. Para uploads seguros, não confie só na extensão." },
          { flag: "exif", desc: "Lê metadados EXIF de fotos JPEG (rotação, geolocalização)." },
          { flag: "soap", desc: "Cliente SOAP. Quase todo sistema legado/governamental ainda fala SOAP." },
          { flag: "ldap", desc: "Conectar a Active Directory ou OpenLDAP." },
          { flag: "pgsql / pdo_pgsql", desc: "Conectar no PostgreSQL." },
          { flag: "sqlite3 / pdo_sqlite", desc: "Banco SQLite (arquivo único). Útil para testes e bancos pequenos." },
          { flag: "redis (PECL)", desc: "Cliente Redis. Não vem no XAMPP — instale via PECL." },
        ]}
      />

      <h2>Como saber se a extensão foi carregada</h2>
      <p>Três jeitos rápidos:</p>
      <CodeBlock language="php" code={`<?php
// 1. Verificação direta
if (extension_loaded('gd')) {
    echo 'GD está habilitada!';
} else {
    echo 'GD não foi carregada.';
}

// 2. Lista todas as extensões
print_r(get_loaded_extensions());

// 3. Função específica daquela extensão
if (function_exists('curl_init')) {
    echo 'cURL OK';
}`} />
      <p>
        Ou abra a página do <code>phpinfo()</code> e procure pelo nome da
        extensão. Cada uma tem sua seção dedicada.
      </p>

      <CodeBlock language="bash" code={`# Listar pelo terminal
C:/xampp/php/php.exe -m

# Saída:
# [PHP Modules]
# bcmath
# Core
# ctype
# curl
# date
# fileinfo
# ...`} />

      <AlertBox type="warning" title="Composer reclama de extensão faltando">
        Quando o Composer falha com erro como{" "}
        <code>requires ext-zip * but it is not present</code>, é só ativar a
        extensão correspondente no <code>php.ini</code> e reiniciar o Apache.
        Se também for usar via terminal, lembre que o PHP do CLI usa o mesmo
        php.ini do Apache no XAMPP.
      </AlertBox>

      <h2>Instalando extensões que NÃO vêm no XAMPP</h2>
      <p>
        Para algo como <strong>Redis</strong>, <strong>Imagick</strong>,{" "}
        <strong>MongoDB</strong>: baixe o <code>.dll</code> compilado para a
        sua versão e arquitetura do PHP em{" "}
        <a href="https://pecl.php.net" target="_blank" rel="noreferrer">
          pecl.php.net
        </a>
        . Coloque em <code>php/ext/</code> e adicione no <code>php.ini</code>:
      </p>
      <CodeBlock language="ini" code={`extension=php_redis.dll`} />
      <p>
        <strong>Atenção</strong>: a versão do .dll precisa bater com a versão
        do PHP, com a arquitetura (x86 ou x64) e com o modo (TS = thread safe
        / NTS = não-thread-safe). O XAMPP no Windows vem com TS — baixe a
        coluna TS no PECL.
      </p>
    </PageContainer>
  );
}
