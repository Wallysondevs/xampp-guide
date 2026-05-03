import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function PortasConflitos() {
  return (
    <PageContainer
      title="Conflitos de portas no XAMPP"
      subtitle="Apache não sobe? MySQL não inicia? Quase certeza que outra coisa está usando a porta. Aqui está o guia para descobrir quem é e resolver."
      difficulty="intermediario"
      timeToRead="9 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Saber abrir o terminal (PowerShell, CMD, bash). Conhecer o conceito
        de "porta" — explico no glossário se precisar.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Porta</strong> — número (1 a 65535) que identifica um serviço
        dentro de uma máquina. HTTP usa 80, HTTPS usa 443, MySQL usa 3306,
        SMTP usa 25.
      </p>
      <p>
        <strong>Listening / LISTEN</strong> — estado de uma porta esperando
        conexão. Quando você vê um processo "listening on :80", ele é dono
        daquela porta naquele momento.
      </p>
      <p>
        <strong>PID</strong> (Process ID) — número que o sistema dá a cada
        programa em execução. É como você identifica e mata um processo.
      </p>

      <h2>Portas padrão do XAMPP</h2>
      <ParamsTable
        title="Quem usa o quê por padrão"
        params={[
          { flag: "80", desc: "Apache (HTTP)" },
          { flag: "443", desc: "Apache (HTTPS)" },
          { flag: "3306", desc: "MariaDB (MySQL)" },
          { flag: "21", desc: "FileZilla FTP (se instalado)" },
          { flag: "25, 79, 105, 106, 110, 143, 2224", desc: "Mercury Mail (SMTP, finger, MercuryE control, MercuryD control, POP3, IMAP, Mercury control)" },
          { flag: "8080", desc: "Tomcat HTTP (se instalado)" },
          { flag: "8005, 8009", desc: "Tomcat shutdown e AJP (se instalado)" },
        ]}
      />

      <h2>Os "vilões" mais comuns no Windows</h2>
      <ParamsTable
        title="Quem costuma roubar a porta 80"
        params={[
          { flag: "IIS / W3SVC", desc: "Internet Information Services. Vem em algumas edições do Windows. Pare via services.msc → 'World Wide Web Publishing Service'." },
          { flag: "Skype clássico", desc: "Versões antigas usavam 80/443 como fallback. Em Skype: Tools → Connection options → desmarcar 'Use port 80 and 443'." },
          { flag: "Docker Desktop", desc: "Em alguns cenários, Docker pode pegar a 80 (proxy reverso, container nginx). Pause/feche Docker." },
          { flag: "Zoom / Teams", desc: "Versões antigas conflitavam. Atualize para a versão mais recente." },
          { flag: "VMware Workstation Server", desc: "Pode segurar a 443. Pare 'VMware Workstation Server' em services.msc." },
          { flag: "BranchCache, SQL Server Reporting Services, World Wide Web Publishing", desc: "Serviços do Windows menos comuns que ouvem na 80." },
          { flag: "MySQL Server da Oracle", desc: "Se você instalou MySQL Workbench, vem o servidor que conflita com o MariaDB do XAMPP na 3306." },
        ]}
      />

      <h2>Descobrindo quem está na porta</h2>
      <CodeBlock title="Windows (PowerShell ou CMD)" language="powershell" code={`# Listar quem está na porta 80
netstat -ano | findstr :80

# Saída exemplo:
#   TCP    0.0.0.0:80    0.0.0.0:0    LISTENING    1234
# O 1234 é o PID. Para descobrir o nome:
tasklist /FI "PID eq 1234"

# Em PowerShell mais moderno:
Get-Process -Id (Get-NetTCPConnection -LocalPort 80).OwningProcess`} />
      <CodeBlock title="Linux/macOS" language="bash" code={`# Quem está na 80
sudo lsof -i :80

# Ou ss (mais moderno)
sudo ss -tulpn | grep ':80'

# Ou netstat clássico
sudo netstat -tulpn | grep ':80'`} />

      <h2>Resolvendo: 3 caminhos</h2>
      <h3>Caminho 1 — Parar/desinstalar o vilão</h3>
      <p>
        Se quem está na porta é algo que você não usa (IIS, World Wide Web
        Publishing Service), pare e desabilite:
      </p>
      <CodeBlock language="powershell" code={`# Listar o serviço
Get-Service W3SVC

# Parar
Stop-Service W3SVC

# Impedir que suba na próxima inicialização
Set-Service W3SVC -StartupType Disabled`} />

      <h3>Caminho 2 — Mudar a porta do Apache/MySQL</h3>
      <p>Edite <code>apache/conf/httpd.conf</code>:</p>
      <CodeBlock language="apache" code={`# Trocar 80 por 8080
Listen 8080
ServerName localhost:8080`} />
      <p>E <code>apache/conf/extra/httpd-ssl.conf</code> para HTTPS:</p>
      <CodeBlock language="apache" code={`Listen 4443
<VirtualHost _default_:4443>
    ...
</VirtualHost>`} />
      <p>
        Reinicie o Apache. Daí pra frente, acesse{" "}
        <code>http://localhost:8080</code>.
      </p>
      <AlertBox type="warning" title="Trocar a porta tem custo cognitivo">
        Toda URL passa a precisar do <code>:8080</code> no fim. Tutoriais
        online vão dizer <code>http://localhost</code> e o seu caso é{" "}
        <code>http://localhost:8080</code>. Se puder, prefira liberar a
        porta 80.
      </AlertBox>
      <p>Para o MySQL, edite <code>mysql/bin/my.ini</code>:</p>
      <CodeBlock language="ini" code={`[client]
port=3307

[mysqld]
port=3307`} />
      <p>
        Lembre de atualizar a configuração do phpMyAdmin (
        <code>config.inc.php</code>) e dos seus projetos (
        <code>DB_PORT</code> no .env).
      </p>

      <h3>Caminho 3 — Mudar pelo painel (mais fácil no Windows)</h3>
      <p>
        No XAMPP Control Panel: clique em <strong>Config</strong> (canto
        superior direito) → <strong>Service and Port Settings</strong>. Uma
        janela mostra cada serviço com sua porta atual. Edite, salve, e o
        painel reinicia automaticamente.
      </p>

      <PracticeBox
        title="Diagnosticar e resolver porta 80 ocupada"
        goal="Apache subir em verde, sem erro de porta."
        steps={[
          "Tente Start Apache → vê o erro vermelho",
          "Abra o terminal e rode netstat -ano | findstr :80",
          "Anote o PID e identifique com tasklist /FI \"PID eq <PID>\"",
          "Se for IIS/W3SVC, pare com Stop-Service W3SVC e desabilite",
          "Se for algo que precisa rodar, mude o Apache para 8080 no httpd.conf",
          "Volte ao painel, Start Apache",
        ]}
        verify="Apache em verde, e netstat -ano | findstr :80 mostra o httpd.exe ou nada (se foi para 8080)."
      />

      <h2>Conflitos com WSL2 e Docker</h2>
      <p>
        Quando você instala WSL2 ou Docker Desktop com integração WSL2, o
        Windows reserva uma faixa de portas dinâmicas que pode incluir 80,
        443 etc. Sintoma: <code>netstat</code> mostra a porta como ocupada
        mas <em>nenhum processo é dono dela</em>.
      </p>
      <CodeBlock language="powershell" code={`# Ver quais faixas o Windows reservou
netsh interface ipv4 show excludedportrange protocol=tcp

# Liberar a 80 (precisa ser admin)
net stop winnat
netsh interface ipv4 add excludedportrange protocol=tcp startport=80 numberofports=1
net start winnat`} />

      <h2>Reset rápido — voltar tudo ao padrão</h2>
      <p>
        Se você mexeu demais nas portas e nada faz mais sentido, reverta
        editando <code>httpd.conf</code> para <code>Listen 80</code> e
        <code>my.ini</code> para <code>port=3306</code>. Depois reinicie o
        painel.
      </p>

      <AlertBox type="success" title="Resumindo">
        Erro de Apache/MySQL ao iniciar = porta ocupada em 90% dos casos.
        Sequência: <code>netstat</code> → <code>tasklist</code> → decide
        (parar quem está, ou mudar o XAMPP de porta).
      </AlertBox>
    </PageContainer>
  );
}
