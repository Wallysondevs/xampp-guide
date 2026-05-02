import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function BackupCompleto() {
  return (
    <PageContainer
      title="Backup completo do XAMPP"
      subtitle="Salve htdocs, bancos, configs e e-mails — e formate o PC sem medo. Restaurar é colar de volta."
      difficulty="intermediario"
      timeToRead="6 min"
    >
      <p>
        Você tem 30 sites locais, 12 bancos em desenvolvimento e a configuração
        do Apache que demorou meses pra ajustar. Não dá pra perder. Aqui
        está o roteiro de backup do XAMPP inteiro.
      </p>

      <h2>O que precisa salvar</h2>
      <ul>
        <li>
          <code>htdocs/</code> — onde estão os seus projetos. <strong>Mais
          importante</strong>.
        </li>
        <li>
          <code>mysql/data/</code> — as bases de dados. Mas{" "}
          <strong>não</strong> copie cru: use mysqldump (ver mais abaixo).
        </li>
        <li>
          <code>apache/conf/httpd.conf</code> e arquivos em{" "}
          <code>apache/conf/extra/</code> — sua configuração de Apache,
          virtual hosts, SSL.
        </li>
        <li><code>php/php.ini</code> — sua configuração de PHP.</li>
        <li><code>mysql/bin/my.ini</code> — sua configuração de MySQL.</li>
        <li><code>phpMyAdmin/config.inc.php</code> — credenciais e configurações do phpMyAdmin.</li>
        <li>O arquivo <code>hosts</code> do sistema (<code>C:/Windows/System32/drivers/etc/hosts</code>) — virtual hosts mapeados.</li>
        <li>Pasta de SSL (<code>apache/conf/ssl.crt/</code> e <code>ssl.key/</code>) se você tem certs próprios.</li>
        <li>(Opcional) <code>MercuryMail/</code> se usa Mercury com queue salva.</li>
      </ul>

      <h2>Estratégia 1: backup manual (mais seguro)</h2>
      <PracticeBox
        title="Backup completo passo a passo"
        goal="Ter uma pasta XAMPP-BACKUP que reconstrói tudo se você formatar."
        steps={[
          "Pare TUDO no painel: Apache, MySQL, FileZilla, Mercury",
          "Abra o terminal como admin",
          "Crie a pasta destino: mkdir D:/Backups/XAMPP-2026-05-02",
          "Faça mysqldump de tudo: C:/xampp/mysql/bin/mysqldump.exe -u root --all-databases --single-transaction --routines --triggers > D:/Backups/XAMPP-2026-05-02/full.sql",
          "Copie htdocs: xcopy C:/xampp/htdocs D:/Backups/XAMPP-2026-05-02/htdocs /E /I /H",
          "Copie configs do Apache: xcopy C:/xampp/apache/conf D:/Backups/XAMPP-2026-05-02/apache-conf /E /I /H",
          "Copie php.ini: copy C:/xampp/php/php.ini D:/Backups/XAMPP-2026-05-02/php.ini",
          "Copie my.ini: copy C:/xampp/mysql/bin/my.ini D:/Backups/XAMPP-2026-05-02/my.ini",
          "Copie hosts: copy C:/Windows/System32/drivers/etc/hosts D:/Backups/XAMPP-2026-05-02/hosts.txt",
        ]}
        verify="A pasta D:/Backups/XAMPP-2026-05-02 tem htdocs, full.sql, apache-conf, php.ini, my.ini, hosts.txt — todos com tamanho coerente."
      />

      <h2>Estratégia 2: script .bat automático</h2>
      <CodeBlock title="C:/xampp/scripts/backup-completo.bat" language="bat" code={`@echo off
setlocal

REM Data no formato YYYY-MM-DD
for /f "tokens=1-3 delims=/" %%a in ('echo %date%') do (
    set DIA=%%a
    set MES=%%b
    set ANO=%%c
)
set DATA=%ANO%-%MES%-%DIA%

set DESTINO=D:\\Backups\\XAMPP-%DATA%
mkdir "%DESTINO%"

echo === Dump completo do MySQL ===
C:\\xampp\\mysql\\bin\\mysqldump.exe ^
    -u root ^
    --all-databases ^
    --single-transaction ^
    --routines --triggers --events ^
    --default-character-set=utf8mb4 ^
    > "%DESTINO%\\full.sql"

echo === Copiando htdocs ===
xcopy C:\\xampp\\htdocs "%DESTINO%\\htdocs" /E /I /H /Q

echo === Copiando configurações ===
xcopy C:\\xampp\\apache\\conf "%DESTINO%\\apache-conf" /E /I /H /Q
copy C:\\xampp\\php\\php.ini "%DESTINO%\\php.ini" >nul
copy C:\\xampp\\mysql\\bin\\my.ini "%DESTINO%\\my.ini" >nul
copy C:\\xampp\\phpMyAdmin\\config.inc.php "%DESTINO%\\phpmyadmin-config.inc.php" >nul
copy C:\\Windows\\System32\\drivers\\etc\\hosts "%DESTINO%\\hosts.txt" >nul

echo === Compactando ===
powershell Compress-Archive -Path "%DESTINO%\\*" -DestinationPath "%DESTINO%.zip"

echo Backup completo salvo em %DESTINO%.zip
pause`} />
      <p>
        Coloque na <strong>Tarefa Agendada</strong> do Windows para rodar
        toda semana. Em Linux, use cron (veja{" "}
        <a href="#/mysql-backup">MySQL Backup</a>).
      </p>

      <h2>Restaurando em outro PC</h2>
      <ol>
        <li>Instale o XAMPP normalmente em <code>C:/xampp</code>.</li>
        <li>Pare Apache e MySQL.</li>
        <li>Cole sua pasta htdocs por cima (<code>htdocs/</code>).</li>
        <li>Cole por cima <code>php.ini</code> e <code>my.ini</code>.</li>
        <li>Cole <code>apache/conf/httpd.conf</code> e <code>conf/extra/</code> de volta.</li>
        <li>
          Importe o dump SQL:{" "}
          <code>C:/xampp/mysql/bin/mysql -u root &lt; full.sql</code>
        </li>
        <li>Restaure as linhas do arquivo hosts (como admin).</li>
        <li>Inicie Apache e MySQL.</li>
        <li>Teste todos os virtual hosts.</li>
      </ol>

      <AlertBox type="warning" title="Versões precisam ser as mesmas">
        Se o backup foi feito no XAMPP com PHP 8.2 e MariaDB 10.11, restaure
        em uma instalação com a mesma versão (ou superior). Voltar para uma
        versão antiga pode quebrar (especialmente do banco).
      </AlertBox>

      <h2>Backup em nuvem</h2>
      <p>
        Para não depender de HD externo, jogue o ZIP no Google Drive, Dropbox
        ou OneDrive. Para automação total, use <code>rclone</code>:
      </p>
      <CodeBlock language="bash" code={`# Após gerar XAMPP-2026-05-02.zip
rclone copy D:/Backups/XAMPP-2026-05-02.zip remoto:backups-xampp/`} />

      <AlertBox type="success" title="Faça hoje, não amanhã">
        A pior dor de programador é perder um projeto pessoal por causa de
        um SSD que travou. Hoje, agora, gere um backup de htdocs e dump de
        bancos pelo menos. Em 2 minutos você está coberto.
      </AlertBox>
    </PageContainer>
  );
}
