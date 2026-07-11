import{j as e}from"./index-BreI0dyu.js";import{P as s,A as o}from"./AlertBox-C_bJKc46.js";import{C as a}from"./CodeBlock-D0rWxPIU.js";import{P as r}from"./ParamsTable-DyRs6_CQ.js";import{P as i}from"./PracticeBox-BV05Hsfh.js";import"./circle-alert-_acnmM4q.js";function u(){return e.jsxs(s,{title:"Backup completo do XAMPP",subtitle:"Salve htdocs, bancos, configs e e-mails — e formate o PC sem medo. Restaurar é colar de volta. Veja a estratégia 3-2-1, scripts prontos para Windows e Linux, e rotina de envio para a nuvem.",difficulty:"intermediario",timeToRead:"11 min",children:[e.jsxs(o,{type:"info",title:"Pré-requisitos",children:["Saber rodar ",e.jsx("code",{children:"mysqldump"})," básico (",e.jsx("a",{href:"#/mysql-backup",children:"veja MySQL Backup"}),") e ter um destino externo: HD, pendrive, NAS, Drive, OneDrive, S3 — qualquer coisa que não seja o mesmo SSD da máquina que tem o XAMPP."]}),e.jsx("h2",{children:"Glossário rápido"}),e.jsxs("p",{children:[e.jsx("strong",{children:"3-2-1"})," — regra de backup: 3 cópias dos dados, em 2 mídias diferentes, sendo 1 fora do site (off-site)."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Backup quente (hot)"})," — feito com o serviço rodando, sem interrupção. Para o MySQL, isso é"," ",e.jsx("code",{children:"mysqldump --single-transaction"})," ou",e.jsx("code",{children:"mariabackup"}),"."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Backup frio (cold)"})," — feito com o serviço parado. Mais seguro para arquivos físicos, mas para o usuário final significa downtime."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Snapshot"})," — foto do estado atual de um disco/VM, normalmente fornecida pela infraestrutura (LVM, ZFS, AWS EBS, DigitalOcean snapshots). Rápida e atômica."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Incremental"})," — backup que salva só o que mudou desde o anterior. Economiza espaço e tempo."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Restore drill"})," — ensaio de restauração. Backup que você nunca testou restaurar é apenas ",e.jsx("em",{children:"esperança"}),"."]}),e.jsx("p",{children:"Você tem 30 sites locais, 12 bancos em desenvolvimento e a configuração do Apache que demorou meses pra ajustar. Não dá pra perder. Aqui está o roteiro de backup do XAMPP inteiro — manual, automático e com envio para a nuvem."}),e.jsx("h2",{children:"O que precisa salvar"}),e.jsx(r,{title:"Itens do XAMPP por prioridade",params:[{flag:"htdocs/",desc:"ESSENCIAL. Onde estão os seus projetos. Se perder, perdeu tudo de código local não versionado."},{flag:"Bancos (via mysqldump, NÃO mysql/data/ cru)",desc:"ESSENCIAL. Use mysqldump --single-transaction --routines --triggers. Copiar mysql/data/ enquanto o MySQL roda gera arquivo corrompido."},{flag:"apache/conf/httpd.conf + apache/conf/extra/",desc:"IMPORTANTE. Suas configurações de Apache, virtual hosts, SSL."},{flag:"php/php.ini",desc:"IMPORTANTE. Sua configuração de PHP (extensões habilitadas, memory_limit, upload_max...)."},{flag:"mysql/bin/my.ini",desc:"IMPORTANTE. Configuração do MySQL/MariaDB (charset, innodb_buffer_pool_size...)."},{flag:"phpMyAdmin/config.inc.php",desc:"ÚTIL. Credenciais e configurações do phpMyAdmin."},{flag:"Arquivo hosts do sistema",desc:"ÚTIL. Virtual hosts mapeados (C:/Windows/System32/drivers/etc/hosts ou /etc/hosts)."},{flag:"apache/conf/ssl.crt/ + ssl.key/",desc:"ÚTIL se você tem certificados próprios (mkcert, Let's Encrypt local)."},{flag:"MercuryMail/",desc:"OPCIONAL. Caixas e queue do Mercury, se usa."},{flag:".env de cada projeto",desc:"ESSENCIAL (mas atenção: .env contém senhas — proteja o backup)."}]}),e.jsx("h2",{children:"Estratégia 1: backup manual (mais seguro)"}),e.jsx(i,{title:"Backup completo passo a passo",goal:"Ter uma pasta XAMPP-BACKUP que reconstrói tudo se você formatar.",steps:["Pare TUDO no painel: Apache, MySQL, FileZilla, Mercury (mas mysqldump funciona com MySQL rodando — só pare se for cópia bruta)","Abra o terminal como admin","Crie a pasta destino: mkdir D:/Backups/XAMPP-2026-05-02","Faça mysqldump de tudo: C:/xampp/mysql/bin/mysqldump.exe -u root --all-databases --single-transaction --routines --triggers --events --default-character-set=utf8mb4 > D:/Backups/XAMPP-2026-05-02/full.sql","Copie htdocs: xcopy C:/xampp/htdocs D:/Backups/XAMPP-2026-05-02/htdocs /E /I /H /Q","Copie configs do Apache: xcopy C:/xampp/apache/conf D:/Backups/XAMPP-2026-05-02/apache-conf /E /I /H /Q","Copie php.ini: copy C:/xampp/php/php.ini D:/Backups/XAMPP-2026-05-02/php.ini","Copie my.ini: copy C:/xampp/mysql/bin/my.ini D:/Backups/XAMPP-2026-05-02/my.ini","Copie hosts: copy C:/Windows/System32/drivers/etc/hosts D:/Backups/XAMPP-2026-05-02/hosts.txt","Compacte tudo num zip e copie para outra mídia (HD externo, pendrive, nuvem)"],verify:"A pasta D:/Backups/XAMPP-2026-05-02 tem htdocs, full.sql, apache-conf, php.ini, my.ini, hosts.txt — todos com tamanho coerente. Abra o full.sql e veja se começa com '-- MySQL dump'."}),e.jsx("h2",{children:"Estratégia 2: script .bat automático (Windows)"}),e.jsx(a,{title:"C:/xampp/scripts/backup-completo.bat",language:"bat",code:`@echo off
setlocal enabledelayedexpansion

REM ========================================================
REM Backup completo do XAMPP
REM Coloca tudo em D:\\Backups\\XAMPP-YYYY-MM-DD\\
REM e gera um zip ao final
REM ========================================================

REM === Data no formato YYYY-MM-DD (independente de locale) ===
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set DT=%%I
set DATA=%DT:~0,4%-%DT:~4,2%-%DT:~6,2%

set DESTINO=D:\\Backups\\XAMPP-%DATA%
mkdir "%DESTINO%" 2>nul

echo === [1/5] Dump completo do MySQL ===
C:\\xampp\\mysql\\bin\\mysqldump.exe ^
    -u root --password=SUA_SENHA ^
    --all-databases ^
    --single-transaction ^
    --routines --triggers --events ^
    --default-character-set=utf8mb4 ^
    > "%DESTINO%\\full.sql"

echo === [2/5] Copiando htdocs ===
xcopy C:\\xampp\\htdocs "%DESTINO%\\htdocs" /E /I /H /Q

echo === [3/5] Copiando configurações ===
xcopy C:\\xampp\\apache\\conf "%DESTINO%\\apache-conf" /E /I /H /Q
copy C:\\xampp\\php\\php.ini "%DESTINO%\\php.ini" >nul
copy C:\\xampp\\mysql\\bin\\my.ini "%DESTINO%\\my.ini" >nul
copy C:\\xampp\\phpMyAdmin\\config.inc.php "%DESTINO%\\phpmyadmin-config.inc.php" >nul
copy C:\\Windows\\System32\\drivers\\etc\\hosts "%DESTINO%\\hosts.txt" >nul

echo === [4/5] Compactando ===
powershell Compress-Archive -Path "%DESTINO%\\*" -DestinationPath "%DESTINO%.zip" -Force

echo === [5/5] Apagando pasta temporária ===
rmdir /S /Q "%DESTINO%"

REM === Limpeza: mantém só os 7 zips mais recentes ===
echo === Mantendo só os 7 backups mais recentes ===
forfiles /P "D:\\Backups" /M "XAMPP-*.zip" /D -7 /C "cmd /c del @path" 2>nul

echo.
echo ====================================================
echo Backup completo salvo em %DESTINO%.zip
echo ====================================================
pause`}),e.jsxs("p",{children:["Coloque na ",e.jsx("strong",{children:"Tarefa Agendada"})," do Windows para rodar toda semana (Painel de Controle → Agendador de Tarefas → Criar Tarefa Básica). Em Linux, use cron (veja"," ",e.jsx("a",{href:"#/mysql-backup",children:"MySQL Backup"}),")."]}),e.jsx("h2",{children:"Estratégia 3: script bash (Linux/macOS)"}),e.jsx(a,{title:"/opt/lampp/backup-completo.sh",language:"bash",code:`#!/bin/bash
set -euo pipefail

# === Configuração ===
XAMPP_DIR=/opt/lampp
BACKUP_DIR=/mnt/backup/xampp
KEEP_DAYS=14
DATA=$(date +%Y-%m-%d_%H%M)
DESTINO="$BACKUP_DIR/XAMPP-$DATA"

mkdir -p "$DESTINO"

echo "=== [1/4] Dump MySQL ==="
"$XAMPP_DIR/bin/mysqldump" \\
    -u root --password="$MYSQL_ROOT_PASSWORD" \\
    --all-databases \\
    --single-transaction \\
    --routines --triggers --events \\
    --default-character-set=utf8mb4 \\
    | gzip > "$DESTINO/full.sql.gz"

echo "=== [2/4] htdocs (rsync) ==="
rsync -a --delete "$XAMPP_DIR/htdocs/" "$DESTINO/htdocs/"

echo "=== [3/4] Configurações ==="
cp -r "$XAMPP_DIR/etc"            "$DESTINO/etc"
cp    "$XAMPP_DIR/etc/php.ini"    "$DESTINO/php.ini"
cp    /etc/hosts                  "$DESTINO/hosts"

echo "=== [4/4] Compactar e enviar ==="
tar -czf "$DESTINO.tar.gz" -C "$BACKUP_DIR" "XAMPP-$DATA"
rm -rf "$DESTINO"

# Envia para nuvem (rclone configurado em ~/.config/rclone/rclone.conf)
rclone copy "$DESTINO.tar.gz" gdrive:backups-xampp/

# Mantém apenas os últimos N dias localmente
find "$BACKUP_DIR" -name "XAMPP-*.tar.gz" -mtime +$KEEP_DAYS -delete

echo "Backup OK: $DESTINO.tar.gz"`}),e.jsx(a,{language:"bash",code:`# Permissão de execução
chmod +x /opt/lampp/backup-completo.sh

# Cron — todo dia às 03:00
sudo crontab -e
# Adicione:
MYSQL_ROOT_PASSWORD=sua_senha_aqui
0 3 * * * /opt/lampp/backup-completo.sh >> /var/log/xampp-backup.log 2>&1`}),e.jsx("h2",{children:"Restaurando em outro PC"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Instale o XAMPP normalmente em ",e.jsx("code",{children:"C:/xampp"})," (ou ",e.jsx("code",{children:"/opt/lampp"}),")."]}),e.jsx("li",{children:"Pare Apache e MySQL."}),e.jsxs("li",{children:["Cole sua pasta htdocs por cima (",e.jsx("code",{children:"htdocs/"}),")."]}),e.jsxs("li",{children:["Cole por cima ",e.jsx("code",{children:"php.ini"})," e ",e.jsx("code",{children:"my.ini"}),"."]}),e.jsxs("li",{children:["Cole ",e.jsx("code",{children:"apache/conf/httpd.conf"})," e ",e.jsx("code",{children:"conf/extra/"})," de volta."]}),e.jsx("li",{children:"Inicie só o MySQL (sem o Apache ainda)."}),e.jsxs("li",{children:["Importe o dump SQL:"," ",e.jsx(a,{language:"bash",code:`# Windows
C:/xampp/mysql/bin/mysql.exe -u root -p < D:/Backups/full.sql

# Linux com gzip
gunzip < /mnt/backup/xampp/XAMPP-2026-05-02.tar.gz | tar -xO XAMPP-2026-05-02/full.sql.gz | gunzip | mysql -u root -p`})]}),e.jsx("li",{children:"Restaure as linhas do arquivo hosts (como admin)."}),e.jsx("li",{children:"Inicie o Apache."}),e.jsx("li",{children:"Teste todos os virtual hosts (acesse cada URL local)."}),e.jsxs("li",{children:["Confirme as senhas dos usuários no MySQL — o dump preserva tabela ",e.jsx("code",{children:"mysql.user"}),", mas pode ser necessário ",e.jsx("code",{children:"FLUSH PRIVILEGES"}),"."]})]}),e.jsx(o,{type:"warning",title:"Versões precisam ser as mesmas (ou superiores)",children:"Se o backup foi feito no XAMPP com PHP 8.2 e MariaDB 10.11, restaure em uma instalação com a mesma versão (ou superior). Voltar para uma versão antiga pode quebrar (especialmente do banco — o formato dos arquivos InnoDB muda entre versões major)."}),e.jsx("h2",{children:"Backup em nuvem"}),e.jsxs("p",{children:["Para não depender de HD externo, jogue o ZIP no Google Drive, Dropbox, OneDrive, S3, Backblaze B2 ou Wasabi. Para automação total, use ",e.jsx("code",{children:"rclone"})," — uma ferramenta que fala com praticamente qualquer provedor de armazenamento:"]}),e.jsx(a,{language:"bash",code:`# Instalar rclone (Windows tem instalador, Linux usa pacote)
# winget install Rclone.Rclone   |  sudo apt install rclone

# Configurar (interativo)
rclone config

# Após gerar XAMPP-2026-05-02.zip
rclone copy D:/Backups/XAMPP-2026-05-02.zip gdrive:backups-xampp/

# Sincronizar pasta inteira (espelhar)
rclone sync D:/Backups gdrive:backups-xampp/ --progress

# Listar o que tá no Drive
rclone ls gdrive:backups-xampp/

# Restore: baixar de volta
rclone copy gdrive:backups-xampp/XAMPP-2026-05-02.zip D:/Restore/`}),e.jsx("h2",{children:"Backup criptografado"}),e.jsx("p",{children:"Se o backup vai para a nuvem ou um HD que pode ser perdido, criptografe antes de subir:"}),e.jsx(a,{language:"bash",code:`# 7-Zip com senha (Windows e Linux)
7z a -p"SENHA_FORTE" -mhe=on backup-2026-05-02.7z D:/Backups/XAMPP-2026-05-02/

# Ou GPG (Linux/macOS)
gpg --symmetric --cipher-algo AES256 --output backup.sql.gz.gpg full.sql.gz

# Restore
gpg --decrypt backup.sql.gz.gpg | gunzip | mysql -u root -p`}),e.jsx("p",{children:"Use sempre senha longa (20+ chars) e armazene-a em um cofre de senhas (Bitwarden, 1Password, KeePass) — perdeu a senha, perdeu o backup."}),e.jsx("h2",{children:"Estratégia 3-2-1"}),e.jsx("p",{children:"Uma rotina que cobre praticamente qualquer desastre:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"3 cópias"}),": a original (no XAMPP) + duas cópias de backup."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"2 mídias diferentes"}),": o SSD interno + um HD externo (ou NAS)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"1 cópia off-site"}),": na nuvem, em outra cidade, ou em um HD que mora na casa de um amigo/cofre."]})]}),e.jsx(o,{type:"info",title:"Faça restore drill periódico",children:"Backup que você nunca tentou restaurar não conta. Pelo menos a cada 3 meses, baixe um backup, restaure em uma máquina virtual ou pasta separada e abra os sites/bancos. É como simulado de incêndio."}),e.jsxs(o,{type:"success",title:"Faça hoje, não amanhã",children:["A pior dor de programador é perder um projeto pessoal por causa de um SSD que travou ou um ",e.jsx("code",{children:"rm -rf /"})," mal digitado. Hoje, agora, gere um backup de htdocs e dump de bancos pelo menos. Em 2 minutos você está coberto. Daí volte aqui e configure a Tarefa Agendada / cron para que isso seja automático."]})]})}export{u as default};
