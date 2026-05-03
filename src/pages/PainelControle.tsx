import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function PainelControle() {
  return (
    <PageContainer
      title="Painel de controle do XAMPP"
      subtitle="A janela laranja com os botões Start/Stop. Cada coluna, cada cor, cada log que aparece — explicado com a prática."
      difficulty="iniciante"
      timeToRead="9 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Ter o XAMPP instalado em Windows, Linux ou macOS. Saber abrir o
        painel pelo menu Iniciar (Windows) ou rodar{" "}
        <code>sudo /opt/lampp/manager-linux-x64.run</code> (Linux).
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Módulo</strong> — cada serviço listado no painel (Apache,
        MySQL, FileZilla, Mercury, Tomcat). Iniciar/parar é por módulo.
      </p>
      <p>
        <strong>Service</strong> — modo "serviço do Windows": o módulo sobe
        com o sistema e roda em segundo plano. Marcar/desmarcar exige
        privilégio de administrador.
      </p>
      <p>
        <strong>PID</strong> — identificador do processo no sistema
        operacional. Ajuda a rastrear quem está usando cada porta.
      </p>

      <h2>Anatomia do painel (Windows)</h2>
      <ParamsTable
        title="Colunas que aparecem para cada módulo"
        params={[
          { flag: "Service", desc: "Checkbox que registra/desregistra o módulo como serviço do Windows. Verde = registrado, vermelho com X = não registrado. Precisa abrir o painel como Administrador para alterar." },
          { flag: "Module", desc: "Nome do módulo (Apache, MySQL, FileZilla, Mercury, Tomcat). Quando rodando, o nome fica em verde." },
          { flag: "PID(s)", desc: "Lista dos identificadores de processo. Apache costuma ter 2 (parent + child). Útil para 'matar' processos travados via Task Manager." },
          { flag: "Port(s)", desc: "Portas que o módulo está escutando. Apache: 80,443. MySQL: 3306. Mercury: 25,79,105,106,143,2224. Se aparecer outra coisa, alguém mexeu na config." },
          { flag: "Actions", desc: "Os botões: Start/Stop, Admin (abre o painel admin do módulo), Config (abre arquivos de configuração no editor padrão), Logs (mostra os arquivos de log)." },
          { flag: "Status", desc: "Última coluna não-titulada — fica colorida em laranja/verde/vermelho conforme estado." },
        ]}
      />

      <h2>O painel inferior (a 'caixa preta')</h2>
      <p>
        Logo abaixo da tabela, há uma área de texto onde o XAMPP imprime
        mensagens em tempo real. Cada cor tem significado:
      </p>
      <ParamsTable
        title="Cores das mensagens do painel"
        params={[
          { flag: "Branco / cinza", desc: "Mensagem informativa — checagens iniciais, versões detectadas, status." },
          { flag: "Azul", desc: "Sucesso — Apache started, MySQL started, etc." },
          { flag: "Marrom / amarelo", desc: "Aviso — algo subiu mas com observação (porta diferente da padrão, módulo opcional ausente)." },
          { flag: "Vermelho", desc: "Erro — falhou. Quase sempre é porta ocupada, arquivo de config quebrado, ou serviço duplicado. Leia a linha imediatamente acima para entender o que tentou fazer." },
        ]}
      />

      <h2>Botões rápidos (lateral direita)</h2>
      <ParamsTable
        title="Botões no canto direito"
        params={[
          { flag: "Config", desc: "Abre menu para escolher: Apache (httpd.conf), Apache (httpd-vhosts.conf), Apache (httpd-ssl.conf), Apache (httpd-xampp.conf), PHP (php.ini), phpMyAdmin (config.inc.php) e a janela 'Service and Port Settings' onde você troca portas." },
          { flag: "Netstat", desc: "Abre uma janela com TODOS os processos que estão escutando portas no Windows. É como netstat -ano direto na cara." },
          { flag: "Shell", desc: "Abre um terminal já com o PATH ajustado para apontar para C:/xampp/php, mysql/bin etc. Útil para rodar php, mysql, mysqldump, htpasswd sem digitar caminho completo." },
          { flag: "Explorer", desc: "Abre C:/xampp no Explorer." },
          { flag: "Services", desc: "Atalho para o services.msc do Windows — vê todos os serviços e pode parar quem está bloqueando uma porta." },
          { flag: "Help", desc: "Lista links rápidos para FAQ, fórum e tutorial oficiais." },
          { flag: "Quit", desc: "Fecha o painel SEM parar Apache/MySQL — ele continua rodando em background. Para parar tudo, clique Stop primeiro em cada módulo." },
        ]}
      />

      <h2>Iniciando os serviços</h2>
      <ol>
        <li>Abra o XAMPP Control Panel (sempre como administrador, se possível).</li>
        <li>Clique em <strong>Start</strong> ao lado de Apache.</li>
        <li>O nome <em>Apache</em> e o PID ficam verdes. A área de logs mostra "Apache started [Port 80]".</li>
        <li>Clique em <strong>Start</strong> ao lado de MySQL.</li>
        <li>Acesse <code>http://localhost</code> no navegador — o dashboard deve carregar.</li>
      </ol>

      <PracticeBox
        title="Subir o stack e checar"
        goal="Confirmar que Apache + MySQL estão saudáveis."
        steps={[
          "Abra o XAMPP Control Panel como administrador",
          "Clique Start em Apache. Confirme 'Apache started [Port 80]'",
          "Clique Start em MySQL. Confirme 'MySQL started [Port 3306]'",
          "Clique no botão Admin do Apache: o navegador abre http://localhost/dashboard/",
          "Clique no botão Admin do MySQL: abre o phpMyAdmin",
          "Clique no botão Logs > Apache (error.log) e leia as últimas linhas",
        ]}
        verify="Os 2 módulos verdes, dashboard carrega e o phpMyAdmin lista o banco information_schema."
      />

      <h2>Quando aparece vermelho — diagnóstico rápido</h2>
      <p>
        Se um módulo não sobe, leia a área de logs do painel — quase sempre
        a primeira linha vermelha já entrega a causa:
      </p>
      <ul>
        <li>
          <strong>"Port 80 in use by ..."</strong> → outro programa
          (IIS, Skype antigo, Docker, World Wide Web Publishing Service)
          está na porta. Veja <a href="#/portas-conflitos">Conflitos de portas</a>.
        </li>
        <li>
          <strong>"Apache shutdown unexpectedly"</strong> → erro de sintaxe
          em algum <code>.conf</code>. Veja{" "}
          <a href="#/erros-comuns">Erros comuns</a>.
        </li>
        <li>
          <strong>"MySQL: 'mysql/data/aria_log_control' is corrupted"</strong>
          {" "}→ tabela InnoDB/Aria corrompida (queda de luz, kill -9).
        </li>
      </ul>

      <h2>Painel no Linux</h2>
      <CodeBlock language="bash" code={`# Painel gráfico (precisa estar em sessão X11/Wayland)
sudo /opt/lampp/manager-linux-x64.run

# Sem GUI, controle por linha de comando
sudo /opt/lampp/lampp start
sudo /opt/lampp/lampp stop
sudo /opt/lampp/lampp restart
sudo /opt/lampp/lampp status

# Iniciar só um módulo
sudo /opt/lampp/lampp startapache
sudo /opt/lampp/lampp startmysql
sudo /opt/lampp/lampp startftp`} />

      <h2>Painel no macOS</h2>
      <p>
        Tem duas variantes: o XAMPP "VM" (recomendado em Mac M1/M2/M3) e o
        XAMPP "nativo". A janela é parecida mas vem em PT-EN-DE. O
        equivalente do <code>lampp</code>:
      </p>
      <CodeBlock language="bash" code={`# XAMPP nativo
sudo /Applications/XAMPP/xamppfiles/xampp start
sudo /Applications/XAMPP/xamppfiles/xampp stop
sudo /Applications/XAMPP/xamppfiles/xampp restart`} />

      <AlertBox type="success" title="Atalho mental">
        Ficou em verde = funcionando. Ficou em vermelho = leia a área de
        logs do painel. <strong>99% dos problemas estão escritos lá em uma
        única linha.</strong>
      </AlertBox>
    </PageContainer>
  );
}
