import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function InstalacaoLinux() {
  return (
    <PageContainer
      title="Instalação no Linux"
      subtitle="Do .run ao primeiro http://localhost. Vale para Ubuntu, Debian, Fedora, openSUSE, Arch — qualquer distro 64-bit moderna."
      difficulty="iniciante"
      timeToRead="9 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Distro Linux 64-bit, ~600 MB livres em <code>/opt</code>, acesso{" "}
        <code>sudo</code>. Não precisa instalar Apache/MySQL nativos antes —
        o XAMPP traz tudo embutido em <code>/opt/lampp</code>.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>/opt</strong> — convenção do Filesystem Hierarchy Standard
        para programas "self-contained" (que vivem inteiros em uma pasta,
        sem espalhar arquivos pelo sistema). XAMPP segue essa convenção:
        instala tudo em <code>/opt/lampp</code>.
      </p>
      <p>
        <strong>.run</strong> — instalador autoextraível. É um shell script
        com binários anexados; você dá permissão de execução e roda.
      </p>
      <p>
        <strong>chmod +x</strong> — adiciona a flag de "executável" no
        arquivo. Sem isso, o Linux não deixa rodar.
      </p>

      <h2>1. Baixar o instalador</h2>
      <p>
        Acesse{" "}
        <a href="https://www.apachefriends.org/download.html" target="_blank" rel="noreferrer">
          apachefriends.org/download.html
        </a>
        . Baixe o arquivo <code>xampp-linux-x64-X.Y.Z-N-installer.run</code>.
        Costuma ficar em <code>~/Downloads</code>.
      </p>

      <h2>2. Dar permissão e executar</h2>
      <CodeBlock language="bash" code={`cd ~/Downloads
chmod +x xampp-linux-x64-*-installer.run
sudo ./xampp-linux-x64-*-installer.run`} />
      <p>
        Abre uma janela GTK com um wizard parecido com o do Windows. Escolha
        os componentes (XAMPP Core + XAMPP Developer Files), confirme o
        caminho <code>/opt/lampp</code> e siga.
      </p>

      <h3>Modo texto (servidores headless)</h3>
      <CodeBlock language="bash" code={`# Instalador interativo no terminal
sudo ./xampp-linux-x64-*-installer.run --mode text

# Instalação totalmente silenciosa (CI/CD)
sudo ./xampp-linux-x64-*-installer.run --mode unattended`} />

      <h2>3. Iniciar o stack</h2>
      <CodeBlock language="bash" code={`sudo /opt/lampp/lampp start

# Saída esperada:
# Starting XAMPP for Linux X.Y.Z-N...
# XAMPP: Starting Apache...ok.
# XAMPP: Starting MySQL...ok.
# XAMPP: Starting ProFTPD...ok.`} />
      <p>
        Acesse <code>http://localhost</code> no navegador. O dashboard
        laranja deve carregar.
      </p>

      <h2>Comandos do "lampp" — os mais usados</h2>
      <ParamsTable
        title="Subcomandos de /opt/lampp/lampp"
        params={[
          { flag: "start", desc: "Sobe Apache + MariaDB + ProFTPD." },
          { flag: "stop", desc: "Derruba todos." },
          { flag: "restart", desc: "Stop + start." },
          { flag: "status", desc: "Mostra quem está rodando." },
          { flag: "startapache | stopapache", desc: "Controla só o Apache." },
          { flag: "startmysql | stopmysql", desc: "Controla só o MariaDB." },
          { flag: "startftp | stopftp", desc: "ProFTPD." },
          { flag: "security", desc: "Wizard de hardening — define senhas para MySQL root, phpMyAdmin, FTP, dashboard. RODE LOGO APÓS INSTALAR." },
          { flag: "reload", desc: "Recarrega configs (sem derrubar conexões ativas)." },
          { flag: "backup <senha-mysql>", desc: "Cria backup completo (configs + bancos) em /opt/lampp/backup." },
          { flag: "enablessl | disablessl", desc: "Liga/desliga SSL." },
        ]}
      />

      <h2>Hardening — RODE ANTES DE QUALQUER COISA</h2>
      <CodeBlock language="bash" code={`sudo /opt/lampp/lampp security`} />
      <p>O wizard vai perguntar 4 coisas:</p>
      <ul>
        <li>
          <strong>Proteger as páginas XAMPP?</strong> — sim. Define usuário
          e senha para o dashboard (basic auth).
        </li>
        <li>
          <strong>Senha do MySQL root?</strong> — sim. Defina algo forte. O
          phpMyAdmin é atualizado automaticamente.
        </li>
        <li>
          <strong>Senha do phpMyAdmin?</strong> — alguns wizards perguntam,
          aceite.
        </li>
        <li>
          <strong>Senha do FTP?</strong> — sim, mesmo se não usar FTP, vale
          fechar.
        </li>
      </ul>

      <PracticeBox
        title="Teste pós-instalação no Linux"
        goal="Confirmar Apache + MariaDB rodando."
        steps={[
          "sudo /opt/lampp/lampp start",
          "Abra http://localhost — deve aparecer o dashboard",
          "Abra http://localhost/phpmyadmin — login com root e a senha do security",
          "Crie um arquivo /opt/lampp/htdocs/teste.php com phpinfo()",
          "Acesse http://localhost/teste.php — deve mostrar a página gigante de configuração do PHP",
        ]}
        verify="As 5 etapas acima funcionam sem erro 'connection refused' ou 403."
      />

      <h2>Permissões em htdocs</h2>
      <p>
        Por padrão <code>/opt/lampp/htdocs</code> pertence ao usuário{" "}
        <code>root</code>. Para editar com seu editor sem precisar de
        <code>sudo</code> toda hora:
      </p>
      <CodeBlock language="bash" code={`# Adiciona seu usuário ao grupo daemon (que é o do Apache no XAMPP)
sudo chown -R \$USER:daemon /opt/lampp/htdocs
sudo chmod -R 775 /opt/lampp/htdocs

# Para os arquivos PHP precisarem ser graváveis pelo Apache (uploads, cache):
sudo chmod -R g+w /opt/lampp/htdocs/<seu-projeto>/storage`} />

      <h2>Inicializar com o sistema</h2>
      <p>
        Em distros com systemd (Ubuntu 16+, Fedora, Arch, Debian 8+), crie
        um serviço:
      </p>
      <CodeBlock title="/etc/systemd/system/lampp.service" language="ini" code={`[Unit]
Description=XAMPP for Linux
After=network.target

[Service]
Type=forking
ExecStart=/opt/lampp/lampp start
ExecStop=/opt/lampp/lampp stop
ExecReload=/opt/lampp/lampp reload
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target`} />
      <CodeBlock language="bash" code={`sudo systemctl daemon-reload
sudo systemctl enable lampp
sudo systemctl start lampp
sudo systemctl status lampp`} />

      <h2>Desinstalar</h2>
      <CodeBlock language="bash" code={`# Roda o uninstaller embutido
sudo /opt/lampp/uninstall

# Garantir que sumiu de vez
sudo rm -rf /opt/lampp`} />

      <h2>Erros comuns no Linux</h2>
      <ul>
        <li>
          <strong>"XAMPP: Another web server is already running"</strong> —
          Apache nativo (<code>apache2</code>) ou nginx do sistema ocupando
          a porta 80. Pare:{" "}
          <code>sudo systemctl stop apache2</code> /{" "}
          <code>sudo systemctl stop nginx</code>.
        </li>
        <li>
          <strong>"XAMPP: Another MySQL daemon is already running"</strong>{" "}
          — pare o MariaDB/MySQL nativo:{" "}
          <code>sudo systemctl stop mariadb</code> ou{" "}
          <code>sudo systemctl stop mysql</code>.
        </li>
        <li>
          <strong>libcrypt.so.1 missing (Fedora 30+, Arch)</strong> — instale{" "}
          <code>libxcrypt-compat</code>:{" "}
          <code>sudo dnf install libxcrypt-compat</code> ou{" "}
          <code>sudo pacman -S libxcrypt-compat</code>.
        </li>
        <li>
          <strong>"GTK module canberra-gtk-module"</strong> — só um aviso
          visual no wizard, ignore.
        </li>
      </ul>

      <AlertBox type="success" title="Próximo passo">
        Vá para <a href="#/painel-controle">o painel de controle</a> e{" "}
        <a href="#/estrutura-pastas">estrutura de pastas</a> para entender o
        que tem em <code>/opt/lampp</code>.
      </AlertBox>
    </PageContainer>
  );
}
