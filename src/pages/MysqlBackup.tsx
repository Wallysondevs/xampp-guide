import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function MysqlBackup() {
  return (
    <PageContainer
      title="Backup e Restore do MySQL"
      subtitle="mysqldump e mysql restore — pelo terminal e pelo phpMyAdmin. Salve seu trabalho antes que o disco morra."
      difficulty="intermediario"
      timeToRead="7 min"
    >
      <h2>O utilitário rei: mysqldump</h2>
      <p>
        Vem dentro do XAMPP em <code>C:/xampp/mysql/bin/mysqldump.exe</code>.
        Gera um arquivo <code>.sql</code> com toda a estrutura e os dados de
        um banco.
      </p>

      <CodeBlock language="bash" code={`# Backup de um banco específico
C:/xampp/mysql/bin/mysqldump -u root -p loja > C:/backups/loja_2026-05-02.sql

# Backup de TODAS as bases (incluindo system tables)
C:/xampp/mysql/bin/mysqldump -u root -p --all-databases > C:/backups/full.sql

# Backup só da estrutura (sem dados)
C:/xampp/mysql/bin/mysqldump -u root -p --no-data loja > loja_estrutura.sql

# Backup só dos dados (sem CREATE TABLE)
C:/xampp/mysql/bin/mysqldump -u root -p --no-create-info loja > loja_dados.sql

# Backup de uma tabela só
C:/xampp/mysql/bin/mysqldump -u root -p loja produtos > produtos.sql`} />

      <ParamsTable
        title="Flags úteis do mysqldump"
        params={[
          { flag: "-u root", desc: "Usuário do MySQL." },
          { flag: "-p", desc: "Vai pedir a senha (sem mostrar). Para senha vazia, use -p e dê Enter." },
          { flag: "-h 127.0.0.1", desc: "Host do banco. Padrão é localhost." },
          { flag: "-P 3306", desc: "Porta. Padrão 3306." },
          { flag: "--all-databases", desc: "Faz backup de TUDO (incluindo mysql, information_schema, etc.)." },
          { flag: "--databases db1 db2", desc: "Faz backup de bancos específicos (incluindo CREATE DATABASE)." },
          { flag: "--no-data", desc: "Só estrutura. Útil para clonar schema sem mover dados." },
          { flag: "--no-create-info", desc: "Só os INSERTs. Útil pra repopular tabelas existentes." },
          { flag: "--single-transaction", desc: "Faz dump consistente em InnoDB sem travar tabelas. Use sempre que possível." },
          { flag: "--default-character-set=utf8mb4", desc: "Garante que acentos e emojis sobrevivam. Sempre use." },
          { flag: "--routines --triggers --events", desc: "Inclui stored procedures, triggers e eventos no dump." },
          { flag: "--quick", desc: "Stream tabelas grandes sem carregar tudo em RAM. Para bancos muito grandes." },
          { flag: "--gzip > arquivo.sql.gz", desc: "Não é flag — é redirecionamento. Comprime na hora. Em Linux: mysqldump ... | gzip > x.sql.gz" },
        ]}
      />

      <h2>Restaurando um dump</h2>
      <CodeBlock language="bash" code={`# Restaurar um dump (cria as tabelas e popula)
# Antes: o banco precisa existir!
C:/xampp/mysql/bin/mysql -u root -p loja < loja_2026-05-02.sql

# Criar e restaurar de uma vez
C:/xampp/mysql/bin/mysql -u root -p -e "CREATE DATABASE loja_nova"
C:/xampp/mysql/bin/mysql -u root -p loja_nova < loja_2026-05-02.sql

# Restaurar all-databases (não precisa criar nada)
C:/xampp/mysql/bin/mysql -u root -p < full.sql`} />

      <h2>Backup automático com tarefa agendada (Windows)</h2>
      <p>Crie um arquivo <code>backup-mysql.bat</code>:</p>
      <CodeBlock title="C:/xampp/scripts/backup-mysql.bat" language="bat" code={`@echo off
set DATA=%date:~6,4%-%date:~3,2%-%date:~0,2%
set DESTINO=C:\\Backups\\mysql

if not exist "%DESTINO%" mkdir "%DESTINO%"

C:\\xampp\\mysql\\bin\\mysqldump.exe ^
    -u root ^
    --all-databases ^
    --single-transaction ^
    --routines --triggers --events ^
    --default-character-set=utf8mb4 ^
    > "%DESTINO%\\backup-%DATA%.sql"

echo Backup salvo em %DESTINO%\\backup-%DATA%.sql`} />
      <p>
        Agende em <strong>Agendador de Tarefas</strong> do Windows: Tarefa
        Básica → diariamente, às 03:00, ação "Iniciar um programa", apontando
        pra esse <code>.bat</code>.
      </p>

      <h2>Backup automático no Linux (cron)</h2>
      <CodeBlock language="bash" code={`# Edite o cron
crontab -e

# Roda todo dia às 03:00 da manhã
0 3 * * * /opt/lampp/bin/mysqldump -u root --all-databases --single-transaction | gzip > /var/backups/mysql/full-$(date +\\%Y-\\%m-\\%d).sql.gz`} />

      <h2>Backup do banco INTEIRO ao copiar a pasta data</h2>
      <p>
        Alternativa "raw": parar o MySQL, copiar <code>mysql/data/</code>{" "}
        inteira para outro lugar. Funciona em InnoDB também, mas o serviço
        precisa estar parado (não pode estar gravando).
      </p>
      <AlertBox type="warning" title="Não copie data com MySQL rodando">
        Vai gerar arquivos corrompidos pela metade. Sempre pare o serviço
        primeiro: <code>painel → MySQL → Stop</code>.
      </AlertBox>

      <h2>phpMyAdmin: o caminho gráfico</h2>
      <p>
        Já vimos no capítulo <a href="#/phpmyadmin">phpMyAdmin</a>: aba
        Exportar / Importar. Só lembre que para arquivos grandes (acima de
        ~50 MB) é melhor usar o terminal — o upload do PHP tem limite.
      </p>
    </PageContainer>
  );
}
