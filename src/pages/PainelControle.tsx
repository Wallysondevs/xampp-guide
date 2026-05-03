import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function PainelControle() {
  return (
    <PageContainer
      title="Painel de Controle do XAMPP"
      subtitle="A janela onde você liga, desliga, monitora e configura cada serviço."
      difficulty="iniciante"
      timeToRead="5 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        XAMPP instalado. Saber clicar em "Executar como administrador" no
        Windows (ou usar <code>sudo</code> no Linux/macOS) — algumas operações
        do painel exigem privilégio elevado.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Daemon</strong> — programa que roda em segundo plano,
        sem janela. O Apache e o MariaDB são daemons quando rodam como
        "serviço" do Windows ou do systemd.
      </p>
      <p>
        <strong>PID (Process ID)</strong> — número único que o sistema dá a
        cada processo em execução. O painel mostra o PID do Apache e do MySQL
        — útil quando você precisa "matar" um processo travado.
      </p>
      <p>
        <strong>Iniciar / Parar / Reiniciar</strong> — Iniciar liga o serviço.
        Parar desliga. Reiniciar é parar + iniciar (preserva configurações
        novas que você acabou de salvar em arquivos <code>.conf</code> ou{" "}
        <code>.ini</code>).
      </p>

      <h2>Anatomia da janela</h2>
      <p>
        Quando você abre o "XAMPP Control Panel" no Windows (ou o
        manager-osx no Mac), vê uma tabela com os módulos:
      </p>
      <CodeBlock language="text" code={`Module    PID(s)    Port(s)   Actions
Apache    1234,5678 80, 443   [Start] [Admin] [Config] [Logs]
MySQL     9012      3306      [Start] [Admin] [Config] [Logs]
FileZilla -         -         [Start] [Admin] [Config] [Logs]
Mercury   -         -         [Start] [Admin] [Config] [Logs]
Tomcat    -         -         [Start] [Admin] [Config] [Logs]`} />

      <ParamsTable
        title="O que cada coluna e botão significa"
        params={[
          { flag: "Module", desc: "Nome do serviço (Apache, MySQL, etc.)." },
          { flag: "PID(s)", desc: "ID do processo no sistema operacional. Útil pra encerrar manualmente se travar." },
          { flag: "Port(s)", desc: "Portas em que o serviço está escutando. Se o número aparecer mas o módulo não inicia, você sabe quem ocupou." },
          { flag: "Start / Stop", desc: "Liga ou desliga o serviço. Quando ativo, o nome do módulo fica em verde." },
          { flag: "Admin", desc: "Atalho para o painel administrativo do serviço. Apache → dashboard / MySQL → phpMyAdmin / FileZilla → cliente FTP." },
          { flag: "Config", desc: "Abre os arquivos de configuração no Bloco de Notas (httpd.conf, my.ini, php.ini, etc.)." },
          { flag: "Logs", desc: "Abre os logs do serviço. Use isso primeiro quando algo der errado." },
          { flag: "Service (checkbox vermelho/verde)", desc: "Marca o serviço para iniciar junto com o Windows. Só aparece em Windows e exige rodar o painel como admin." },
        ]}
      />

      <h2>O painel inferior: console de eventos</h2>
      <p>
        Tudo que acontece (start, stop, erro de porta, etc.) aparece em
        tempo real no painel preto na parte inferior. Sempre olhe ali primeiro
        quando algo se comportar diferente do esperado.
      </p>

      <CodeBlock language="text" code={`16:42:01  [Apache]  Attempting to start Apache app...
16:42:02  [Apache]  Status change detected: running
16:43:11  [main]    Initializing Modules
16:43:11  [mysql]   Status change detected: running
16:44:30  [Apache]  Status change detected: stopped
16:44:30  [Apache]  Error: Apache shutdown unexpectedly.
16:44:30  [Apache]  Press the Logs button to view error logs and check`} />

      <AlertBox type="info" title="Quando vir 'Apache shutdown unexpectedly'">
        Quase sempre é uma das três coisas: porta 80/443 já está em uso,
        algum erro de sintaxe no <code>httpd.conf</code> ou um certificado
        SSL faltando. Clique em "Logs" → "Apache (error.log)" e leia as 5
        últimas linhas.
      </AlertBox>

      <h2>Atalhos rápidos no botão "Quit"</h2>
      <p>
        Atenção: o botão "Quit" do painel <strong>não</strong> para os
        serviços. Ele só fecha a janela. Se você quer realmente desligar tudo,
        clique em "Stop" para cada serviço antes de sair.
      </p>

      <h2>Iniciar como administrador (Windows)</h2>
      <AlertBox type="warning" title="Sem admin = recursos limitados">
        Para registrar o Apache/MySQL como serviço do Windows (checkbox
        "Service") e para escutar nas portas privilegiadas (&lt; 1024, como a
        porta 80), o painel precisa ser executado como administrador. Clique
        com o botão direito em <code>xampp-control.exe</code> → "Executar
        como administrador".
      </AlertBox>

      <h2>Não consigo abrir o painel</h2>
      <CodeBlock language="text" code={`Erro: "There is already a process using port 80"
↓
Solução: Outra coisa está ocupando a porta 80 (Skype, IIS, World Wide Web Publishing Service).
         Veja o capítulo "Conflitos de portas".

Erro: "Status: Apache crashed at startup"
↓
Solução: Olhe apache/logs/error.log. 90% das vezes é um typo no httpd.conf
         ou um VirtualHost com caminho errado.`} />

      <h2>Fechando tudo via terminal</h2>
      <p>Quando o painel travar, você pode encerrar pela linha de comando:</p>
      <CodeBlock language="bash" code={`# Windows (PowerShell, como admin)
taskkill /F /IM httpd.exe
taskkill /F /IM mysqld.exe

# Linux
sudo /opt/lampp/lampp stop

# macOS
sudo /Applications/XAMPP/xamppfiles/xampp stop`} />
    </PageContainer>
  );
}
