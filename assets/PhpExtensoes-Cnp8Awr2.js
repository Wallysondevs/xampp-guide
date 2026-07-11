import{j as e}from"./index-BreI0dyu.js";import{P as s,A as i}from"./AlertBox-C_bJKc46.js";import{C as o}from"./CodeBlock-D0rWxPIU.js";import{P as a}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function t(){return e.jsxs(s,{title:"Extensões do PHP",subtitle:"Como o PHP é modular, diferença entre extensões internas, da PECL e Zend, como ativar, instalar do zero (incluindo .dll com TS/NTS, x86/x64) e referência das extensões mais usadas.",difficulty:"iniciante",timeToRead:"11 min",children:[e.jsxs(i,{type:"info",title:"Pré-requisitos",children:["XAMPP instalado. Capítulo de ",e.jsx("a",{href:"#/php-ini",children:"php.ini"})," lido. Saber abrir um terminal/CMD."]}),e.jsx("h2",{children:"Glossário rápido"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Extensão"})," — biblioteca em C compilada que estende o PHP com funções, classes e constantes nativas. Vive em"," ",e.jsx("code",{children:"php/ext/"})," como ",e.jsx("code",{children:".dll"})," (Windows) ou"," ",e.jsx("code",{children:".so"})," (Linux/macOS)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Extensão interna (bundled)"})," — vem junto com o PHP, em geral só precisa descomentar no ",e.jsx("code",{children:"php.ini"}),". Exemplos: mbstring, mysqli, gd, curl, intl, zip."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"PECL (PHP Extension Community Library)"}),' — repositório oficial de extensões adicionais. Não vêm no PHP "vanilla" — você baixa, compila/instala, depois carrega. Exemplos: redis, mongodb, imagick, xdebug.']}),e.jsxs("p",{children:[e.jsx("strong",{children:"Extensão Zend"}),' — extensão que se "engancha" mais fundo no engine do Zend. No php.ini se carrega com'," ",e.jsx("code",{children:"zend_extension="})," em vez de ",e.jsx("code",{children:"extension="}),". Exemplos: opcache, xdebug."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"TS / NTS"})," — Thread Safe / Non-Thread-Safe. No XAMPP Windows o PHP é compilado em modo TS (porque o Apache no Windows usa threads). No Linux moderno (PHP-FPM) é NTS."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Compatibilidade ABI"})," — o ",e.jsx("code",{children:".dll"})," precisa bater com a versão MAJOR.MINOR do PHP, com a arquitetura (x86 ou x64) e com o modo (TS/NTS) e com a versão do Visual C++ usada (VS16 / VS17)."]}),e.jsx("h2",{children:"Habilitando uma extensão interna"}),e.jsxs("p",{children:["Abra o ",e.jsx("code",{children:"php.ini"})," e procure por ",e.jsx("code",{children:"extension="}),". Você verá uma lista assim:"]}),e.jsx(o,{language:"ini",code:`;extension=bz2
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
;extension=shmop`}),e.jsxs("p",{children:["O ",e.jsx("code",{children:";"}),' no início significa "comentado" (desativado). Tire o ',e.jsx("code",{children:";"})," para ativar. Salve e ",e.jsx("strong",{children:"reinicie o Apache"}),"."]}),e.jsxs(i,{type:"info",title:"Sintaxes equivalentes",children:["Todas estas formas funcionam:",e.jsx(o,{language:"ini",code:`extension=gd                 ; nome curto (recomendado)
extension=gd.dll             ; nome completo (Windows, opcional)
extension=php_gd.dll         ; com prefixo php_ (legado, ainda funciona)
extension="C:/path/abs.dll"  ; caminho absoluto (raro)`})]}),e.jsx("h2",{children:"Categorias de extensões internas"}),e.jsx("p",{children:"A documentação oficial agrupa em categorias funcionais:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Banco de dados"})," — mysqli, pdo_mysql, pdo_pgsql, pgsql, sqlite3, pdo_sqlite, oci8, sqlsrv."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Criptografia/segurança"})," — openssl, sodium, hash, password, mcrypt (legado)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Texto/encoding"})," — mbstring, iconv, intl, gettext."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Imagem"})," — gd, exif, imagick (PECL)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Rede/HTTP"})," — curl, sockets, ftp, ldap, snmp, soap."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Arquivo/compressão"})," — fileinfo, zip, zlib, bz2, phar."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Datas/formatação"})," — intl, calendar."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"XML/JSON"})," — json (sempre on), simplexml, dom, xml, xsl."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Performance"})," — opcache (Zend), apcu (PECL)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Outros"})," — pcntl (Linux), posix (Linux), gmp, bcmath, sodium."]})]}),e.jsx("h2",{children:"As extensões essenciais (que projetos modernos exigem)"}),e.jsx(a,{title:"Lista que cobre WordPress, Laravel, Symfony, CakePHP, Drupal...",params:[{flag:"mysqli / pdo_mysql",desc:"Conectar no MySQL/MariaDB. Praticamente todo CMS e framework PHP usa pelo menos uma."},{flag:"mbstring",desc:"Funções multibyte (UTF-8, acentos, emojis). Essencial. WordPress, Laravel, Symfony reclamam sem ela."},{flag:"openssl",desc:"Criptografia, HTTPS, hash, JWT. Sem ela, Composer não consegue baixar dependências por HTTPS."},{flag:"curl",desc:"Cliente HTTP. APIs, integrações, Guzzle, Composer — todos dependem."},{flag:"gd",desc:"Manipulação de imagens (redimensionar, criar thumbnails, gerar captcha)."},{flag:"imagick (PECL)",desc:"Alternativa mais poderosa à GD via ImageMagick. Suporta MUITO mais formatos. Não vem habilitada — instale via PECL."},{flag:"intl",desc:"Internacionalização: formatação de datas, moedas, números e collation por idioma. Symfony e Laravel exigem."},{flag:"zip",desc:"Ler/escrever arquivos .zip. Composer (atualizar pacotes), WordPress (instalar plugins), Laravel exigem."},{flag:"fileinfo",desc:"Detecta o MIME-type real de um arquivo. Para uploads seguros, NÃO confie só na extensão do arquivo."},{flag:"exif",desc:"Lê metadados EXIF de fotos JPEG (rotação, geolocalização, câmera, ISO, etc.)."},{flag:"soap",desc:"Cliente SOAP. Quase todo sistema legado/governamental ainda fala SOAP."},{flag:"ldap",desc:"Conectar a Active Directory ou OpenLDAP."},{flag:"pgsql / pdo_pgsql",desc:"Conectar no PostgreSQL."},{flag:"sqlite3 / pdo_sqlite",desc:"Banco SQLite (arquivo único). Útil para testes e bancos pequenos."},{flag:"bcmath / gmp",desc:"Aritmética de precisão arbitrária (números enormes). Bcmath para finanças, GMP para criptografia."},{flag:"sodium",desc:"Libsodium — criptografia moderna (ChaCha20, Ed25519). PHP 7.2+. Sempre prefira a OpenSSL antiga."},{flag:"opcache (Zend)",desc:"Cacheia o bytecode compilado entre requisições. Ganho de performance brutal — sempre ativo em prod."},{flag:"apcu (PECL)",desc:"Cache em memória user-land (chave/valor). Mais leve que Redis quando precisa só de um nó."},{flag:"redis (PECL)",desc:"Cliente Redis. Não vem no XAMPP — instale via PECL para usar Redis como cache/queue."},{flag:"mongodb (PECL)",desc:"Driver MongoDB oficial."},{flag:"xdebug (PECL)",desc:"Debug com breakpoints, var_dump turbinado, profiler. Cobre o capítulo dedicado."}]}),e.jsx("h2",{children:"Como saber se a extensão foi carregada"}),e.jsx("p",{children:"Quatro jeitos rápidos:"}),e.jsx(o,{language:"php",code:`<?php
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
print_r(ini_get_all('opcache'));`}),e.jsx(o,{language:"bash",code:`# 5. No terminal — lista TUDO carregado pelo CLI
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
php -m | grep -i mysql`}),e.jsxs("p",{children:["Ou abra a página do ",e.jsx("code",{children:"phpinfo()"})," e procure pelo nome da extensão. Cada uma tem sua seção dedicada com versão, opções de compilação e diretivas."]}),e.jsxs(i,{type:"warning",title:"Composer reclama de extensão faltando",children:["Quando o Composer falha com erro como"," ",e.jsx("code",{children:"requires ext-zip * but it is not present"}),", é só ativar a extensão correspondente no ",e.jsx("code",{children:"php.ini"})," e reiniciar o Apache. Se também for usar via terminal, lembre que o PHP do CLI pode usar um ",e.jsx("code",{children:"php.ini"})," diferente do Apache. No XAMPP, costuma ser o mesmo — em outras instalações, não."]}),e.jsx("h2",{children:"Instalando extensões PECL no Windows (XAMPP)"}),e.jsxs("p",{children:["Roteiro completo para ",e.jsx("strong",{children:"Redis"}),", ",e.jsx("strong",{children:"MongoDB"}),", ",e.jsx("strong",{children:"Imagick"}),":"]}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Em ",e.jsx("code",{children:"http://localhost/dashboard/phpinfo.php"}),", anote:",e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"PHP Version"})," — ex.: 8.4.0"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Architecture"})," — x64"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"PHP Extension Build"})," — ex.: API20240924,TS,VS17 (TS = Thread Safe, VS17 = Visual Studio 2022)"]})]})]}),e.jsxs("li",{children:["Vá em ",e.jsx("a",{href:"https://pecl.php.net/",target:"_blank",rel:"noreferrer",children:"pecl.php.net"})," ou"," ",e.jsx("a",{href:"https://windows.php.net/downloads/pecl/",target:"_blank",rel:"noreferrer",children:"windows.php.net/downloads/pecl/"})," ","e procure pela extensão."]}),e.jsxs("li",{children:["Baixe a coluna que bate exatamente com sua build (ex.:"," ",e.jsx("code",{children:"8.4 Thread Safe (TS) x64"}),")."]}),e.jsxs("li",{children:["Extraia o ZIP. Copie ",e.jsx("code",{children:"php_redis.dll"})," para"," ",e.jsx("code",{children:"C:/xampp/php/ext/"}),"."]}),e.jsxs("li",{children:["Adicione no ",e.jsx("code",{children:"php.ini"}),": ",e.jsx("code",{children:"extension=redis"})]}),e.jsx("li",{children:"Reinicie o Apache."}),e.jsxs("li",{children:["Confirme: ",e.jsx("code",{children:"php -m | grep redis"})," ou na página phpinfo."]})]}),e.jsx(o,{language:"ini",code:`; Adições típicas no php.ini

extension=php_redis.dll
extension=php_mongodb.dll
extension=php_imagick.dll      ; precisa também das DLLs do ImageMagick na mesma pasta`}),e.jsxs(i,{type:"warning",title:"O imagick é chato no Windows",children:["A extensão ",e.jsx("code",{children:"imagick"})," precisa das DLLs do ImageMagick (CORE_RL_*) na pasta ",e.jsx("code",{children:"C:/xampp/php/"})," e do executável ImageMagick instalado no sistema com o PATH configurado. Se algo falha, o Apache nem inicia. Em produção Linux é trivial; no XAMPP Windows, considere usar GD se possível."]}),e.jsx("h2",{children:"Instalando via PECL no Linux/macOS"}),e.jsx(o,{language:"bash",code:`# No XAMPP Linux, o pecl vem em:
sudo /opt/lampp/bin/pecl install redis

# Vai compilar do código-fonte. Pode pedir para baixar libs do sistema.
# Quando terminar, vai sugerir:
# Add 'extension=redis.so' to php.ini

# Edite /opt/lampp/etc/php.ini e adicione a linha
# Reinicie o Apache do XAMPP
sudo /opt/lampp/lampp restart`}),e.jsx("h2",{children:"Verificando dependências de uma extensão"}),e.jsx(o,{language:"bash",code:`# Windows — usa Dependency Walker (depends.exe)
depends.exe C:/xampp/php/ext/php_imagick.dll

# Linux — ldd
ldd /opt/lampp/lib/php/extensions/no-debug-non-zts-20230831/redis.so

# Vai listar as bibliotecas .so/.dll que aquela extensão precisa.
# Se alguma estiver "not found", o Apache não vai conseguir carregar.`}),e.jsx("h2",{children:"Diagnóstico — extensão não carrega, e agora?"}),e.jsx(a,{title:"Sintomas e causas",params:[{flag:"Apache não inicia depois de adicionar extension=",desc:"Versão errada do .dll (TS vs NTS, x86 vs x64, versão do PHP errada). Olhe apache/logs/error.log."},{flag:"PHP Warning: PHP Startup: Unable to load dynamic library",desc:"Caminho da DLL errado ou DLL corrompida. Confirme que o arquivo existe em php/ext/."},{flag:"extensão aparece em php -m mas não em phpinfo()",desc:"CLI e Apache usam php.ini diferentes — adicione no php.ini do Apache também."},{flag:"função não existe mas extensão aparece em phpinfo()",desc:"Versão da extensão muito antiga. Atualize."},{flag:"DLL Carregada mas comportamento errado",desc:"Versão da lib externa (Imagick → ImageMagick) incompatível. Reinstale ambos com versões emparelhadas."}]})]})}export{t as default};
