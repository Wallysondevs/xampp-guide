import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function InstalacaoMacOS() {
  return (
    <PageContainer
      title="Instalação no macOS"
      subtitle="Duas variantes: 'XAMPP-VM' (Mac com chip Apple Silicon) e XAMPP nativo. Quando usar cada uma, instalação passo a passo, e os pulos do gato em macOS Sonoma/Sequoia."
      difficulty="iniciante"
      timeToRead="9 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        macOS 10.13 (High Sierra) ou superior. ~1 GB livre. Conta com
        privilégios de administrador. Em Macs M1/M2/M3, o XAMPP roda via
        Rosetta 2 ou pelo XAMPP-VM.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Rosetta 2</strong> — camada da Apple que roda binários x86
        em chips ARM (M1+). XAMPP nativo é x86 — precisa do Rosetta. O macOS
        oferece instalar na primeira execução de qualquer app x86.
      </p>
      <p>
        <strong>XAMPP-VM</strong> — variante que usa uma VM Linux dentro do
        Mac. Mais isolada, mais "parecida com produção", mas exige mais RAM.
      </p>
      <p>
        <strong>Gatekeeper</strong> — proteção do macOS que bloqueia
        executáveis não assinados. Pode pedir para autorizar manualmente em
        <em>Configurações → Privacidade e Segurança</em>.
      </p>

      <h2>Qual variante baixar?</h2>
      <ParamsTable
        title="XAMPP-VM vs XAMPP nativo"
        params={[
          { flag: "XAMPP-VM", desc: "Roda Linux dentro de uma VM. Recomendado para Apple Silicon (M1/M2/M3) e quem quer ambiente próximo de produção. Ocupa mais RAM (1-2 GB)." },
          { flag: "XAMPP nativo", desc: "Instala direto no macOS. Funciona em Intel Mac sem VM. Em Apple Silicon usa Rosetta. Mais leve mas menos 'real' em comparação à produção Linux." },
        ]}
      />

      <h2>Instalação — XAMPP nativo (.dmg)</h2>
      <ol>
        <li>
          Baixe em{" "}
          <a href="https://www.apachefriends.org/download.html" target="_blank" rel="noreferrer">
            apachefriends.org/download.html
          </a>{" "}
          o arquivo <code>xampp-osx-X.Y.Z-N-installer.dmg</code>.
        </li>
        <li>Duplo-clique no .dmg para montar.</li>
        <li>
          Duplo-clique no instalador. Se o macOS reclamar ("não pode ser
          aberto"), clique com botão direito → Abrir → Confirmar.
        </li>
        <li>Insira sua senha de admin.</li>
        <li>
          Wizard padrão: aceite o caminho <code>/Applications/XAMPP</code>.
        </li>
      </ol>

      <h2>Instalação — XAMPP-VM</h2>
      <ol>
        <li>Baixe a versão VM no mesmo site (arquivo termina em <code>-vm.dmg</code>).</li>
        <li>Monte o .dmg, arraste o ícone para Applications.</li>
        <li>Abra o app XAMPP. Vai pedir para baixar a imagem da VM (~700 MB) na primeira execução.</li>
        <li>
          Configure a quantidade de RAM (mínimo 512 MB; recomendado 1 GB) e
          o disco (mínimo 5 GB).
        </li>
        <li>Clique <strong>Start</strong>. A VM sobe e expõe Apache + MySQL.</li>
      </ol>

      <h2>Iniciar o stack — XAMPP nativo</h2>
      <CodeBlock language="bash" code={`# GUI
open /Applications/XAMPP/manager-osx.app

# CLI
sudo /Applications/XAMPP/xamppfiles/xampp start
sudo /Applications/XAMPP/xamppfiles/xampp stop
sudo /Applications/XAMPP/xamppfiles/xampp restart
sudo /Applications/XAMPP/xamppfiles/xampp status

# Apenas Apache ou MySQL
sudo /Applications/XAMPP/xamppfiles/xampp startapache
sudo /Applications/XAMPP/xamppfiles/xampp startmysql`} />

      <h2>Estrutura no Mac</h2>
      <ParamsTable
        title="Onde mora cada coisa"
        params={[
          { flag: "/Applications/XAMPP/", desc: "Atalhos e gerenciador (manager-osx.app)." },
          { flag: "/Applications/XAMPP/xamppfiles/htdocs/", desc: "DocumentRoot — coloque seus projetos aqui." },
          { flag: "/Applications/XAMPP/xamppfiles/etc/php.ini", desc: "Configuração do PHP." },
          { flag: "/Applications/XAMPP/xamppfiles/etc/httpd.conf", desc: "Configuração do Apache." },
          { flag: "/Applications/XAMPP/xamppfiles/var/mysql/", desc: "Dados do MariaDB (não copie cru)." },
          { flag: "/Applications/XAMPP/xamppfiles/logs/", desc: "Logs (error_log, access_log)." },
        ]}
      />

      <PracticeBox
        title="Teste pós-instalação no Mac"
        goal="Ver o dashboard do XAMPP no Safari."
        steps={[
          "Abra o gerenciador (Manage Servers)",
          "Clique Start All — Apache e MySQL ficam verdes",
          "No Safari/Chrome, acesse http://localhost",
          "Crie /Applications/XAMPP/xamppfiles/htdocs/teste.php com phpinfo()",
          "Acesse http://localhost/teste.php",
        ]}
        verify="O dashboard carrega e teste.php mostra a configuração do PHP."
      />

      <h2>Hardening — passo de segurança</h2>
      <CodeBlock language="bash" code={`sudo /Applications/XAMPP/xamppfiles/xampp security`} />
      <p>
        O wizard pede senhas para MariaDB root, phpMyAdmin e o dashboard.
        <strong>Não pule</strong> — sem isso o phpMyAdmin fica aberto na
        sua rede local.
      </p>

      <h2>Permissões e htdocs</h2>
      <p>
        Por padrão a pasta <code>htdocs</code> pertence ao usuário{" "}
        <code>daemon</code> (do Apache no Mac). Para editar com seu editor
        sem virar admin:
      </p>
      <CodeBlock language="bash" code={`sudo chown -R \$USER:_www /Applications/XAMPP/xamppfiles/htdocs
sudo chmod -R 775 /Applications/XAMPP/xamppfiles/htdocs`} />

      <h2>Erros comuns no macOS</h2>
      <ul>
        <li>
          <strong>"App is damaged and can't be opened"</strong> — Gatekeeper.
          Vá em Configurações → Privacidade e Segurança → role até "XAMPP"
          → "Abrir mesmo assim".
        </li>
        <li>
          <strong>Apple Silicon e PHP retornando "Bad CPU type"</strong> —
          falta o Rosetta. Instale: <code>softwareupdate --install-rosetta</code>.
        </li>
        <li>
          <strong>Porta 80 ocupada por "AirPlay Receiver"</strong> — em
          macOS Monterey+ o AirPlay usa a 5000 e o Control Center pode
          subir um servidor na 80. Desabilite em{" "}
          <em>Configurações → Geral → AirDrop e Handoff → AirPlay Receiver</em>.
        </li>
        <li>
          <strong>Apache não sobe sem mensagem clara</strong> — leia{" "}
          <code>/Applications/XAMPP/xamppfiles/logs/error_log</code> e o{" "}
          <code>system.log</code> via <code>log show --last 5m</code>.
        </li>
        <li>
          <strong>"PHP Warning: Failed to load module ..."</strong> — alguma
          extensão tentou carregar mas a lib não existe. Comente a linha em{" "}
          <code>php.ini</code>.
        </li>
      </ul>

      <h2>Desinstalar</h2>
      <CodeBlock language="bash" code={`sudo /Applications/XAMPP/uninstall.app/Contents/MacOS/installbuilder.sh
sudo rm -rf /Applications/XAMPP`} />

      <AlertBox type="success" title="Próximo passo">
        Veja <a href="#/painel-controle">o painel de controle</a> e{" "}
        <a href="#/estrutura-pastas">estrutura de pastas</a>. No Mac vale
        muito a pena rodar <code>xampp security</code> antes de qualquer
        outra coisa.
      </AlertBox>
    </PageContainer>
  );
}
