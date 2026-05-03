import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function InstalacaoMacOS() {
  return (
    <PageContainer
      title="Instalação no macOS"
      subtitle="Compatível com Macs Intel e com Apple Silicon (M1/M2/M3) via Rosetta 2."
      difficulty="intermediario"
      timeToRead="7 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        macOS 10.15 (Catalina) ou superior, <strong>5 GB livres</strong> em
        disco, conta com permissão de administrador. Em Macs com chip Apple
        Silicon (M1/M2/M3), o Rosetta 2 também é necessário (instalação
        explicada a seguir).
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Rosetta 2</strong> — camada de tradução que permite a Macs
        com chip Apple Silicon (ARM) rodar programas compilados para Intel
        (x86_64). O XAMPP para macOS ainda é Intel, então Rosetta é
        obrigatório em Macs M1/M2/M3.
      </p>
      <p>
        <strong>.dmg</strong> — formato de imagem de disco do macOS. Você
        clica duas vezes, ele "monta" como um drive virtual e revela o
        instalador dentro.
      </p>
      <p>
        <strong>/Applications/XAMPP</strong> — pasta padrão onde o XAMPP se
        instala no macOS. Os arquivos do servidor ficam em{" "}
        <code>/Applications/XAMPP/xamppfiles/</code>.
      </p>

      <AlertBox type="info" title="Mac com chip M1/M2/M3?">
        O XAMPP para macOS é compilado para arquitetura Intel (x86_64). Em
        Macs com Apple Silicon ele <strong>roda perfeitamente</strong>, mas
        precisa do Rosetta 2 instalado. O macOS pede a instalação na primeira
        execução. Você também pode forçar:
        <CodeBlock language="bash" code={`softwareupdate --install-rosetta --agree-to-license`} />
      </AlertBox>

      <h2>1. Baixe a versão correta</h2>
      <p>
        Em{" "}
        <a href="https://www.apachefriends.org/download.html" target="_blank" rel="noreferrer">
          apachefriends.org/download.html
        </a>{" "}
        existem duas opções para macOS:
      </p>
      <ul>
        <li>
          <strong>XAMPP-VM</strong> — versão "containerizada" rodando dentro
          de uma VM. Mais lenta, mas mais isolada.
        </li>
        <li>
          <strong>XAMPP for OS X (Installer)</strong> — versão clássica,
          instala em <code>/Applications/XAMPP</code>. É a mais usada.
        </li>
      </ul>

      <h2>2. Execute o instalador <code>.dmg</code></h2>
      <p>
        Abra o arquivo baixado, clique duplo no instalador e siga o assistente.
        Vai pedir senha de administrador. Aceite o padrão{" "}
        <code>/Applications/XAMPP</code>.
      </p>

      <h2>3. Abra o "manager-osx"</h2>
      <p>
        Após instalar, vá em <strong>Aplicativos → XAMPP → manager-osx</strong>{" "}
        e abra. É o equivalente ao painel de controle do Windows. Tem três
        abas: <em>Welcome</em>, <em>Manage Servers</em> e <em>Application
        Log</em>.
      </p>

      <h2>4. Inicie os serviços</h2>
      <p>
        Na aba "Manage Servers", clique em "Start All". Apache, MySQL e
        ProFTPD ficam verdes. Se algum falhar, normalmente é a porta 80
        ocupada (veja{" "}
        <a href="#/portas-conflitos">conflitos de portas</a>) ou o Apache do
        próprio macOS interferindo.
      </p>

      <CodeBlock language="bash" code={`# Parar o Apache nativo do macOS (se estiver rodando)
sudo apachectl stop
sudo launchctl unload -w /System/Library/LaunchDaemons/org.apache.httpd.plist`} />

      <h2>5. Onde fica o htdocs</h2>
      <p>
        No macOS o htdocs fica em <code>/Applications/XAMPP/htdocs</code> ou,
        equivalente, <code>/Applications/XAMPP/xamppfiles/htdocs</code>.
      </p>
      <CodeBlock language="bash" code={`cd /Applications/XAMPP/htdocs
ls -la

# Permissão pro seu usuário (para editar sem sudo)
sudo chown -R $(whoami) /Applications/XAMPP/htdocs`} />

      <PracticeBox
        title="Primeiro phpinfo() no macOS"
        goal="Subir o XAMPP e ver o teste.php no navegador."
        steps={[
          "Abra o manager-osx e dê Start em todos os serviços.",
          "Abra o Terminal: open /Applications/XAMPP/htdocs",
          "Crie teste.php com o conteúdo: <?php phpinfo(); ?>",
          "Vá no Safari (ou Chrome) e abra http://localhost/teste.php",
        ]}
        verify="A página colorida do phpinfo() carrega sem erros."
      />

      <h2>6. Iniciar pelo terminal</h2>
      <CodeBlock language="bash" code={`sudo /Applications/XAMPP/xamppfiles/xampp start
sudo /Applications/XAMPP/xamppfiles/xampp stop
sudo /Applications/XAMPP/xamppfiles/xampp restart
sudo /Applications/XAMPP/xamppfiles/xampp status`} />

      <h2>7. Desinstalando</h2>
      <p>
        O XAMPP para macOS vem com um desinstalador. Abra{" "}
        <code>/Applications/XAMPP/uninstall.app</code>, ou via terminal:
      </p>
      <CodeBlock language="bash" code={`sudo /Applications/XAMPP/uninstall.app/Contents/MacOS/installbuilder.sh
sudo rm -rf /Applications/XAMPP`} />

      <AlertBox type="warning" title="macOS Sequoia / Sonoma">
        A cada nova versão do macOS, a Apple aperta as restrições de
        segurança. Se aparecer um aviso "não é possível abrir porque o
        desenvolvedor não pode ser verificado", clique com Ctrl no instalador,
        escolha "Abrir" e confirme. Em casos teimosos, vá em Ajustes do Sistema
        → Privacidade e Segurança → "Abrir mesmo assim".
      </AlertBox>
    </PageContainer>
  );
}
