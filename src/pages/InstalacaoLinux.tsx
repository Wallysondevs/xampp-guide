import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function InstalacaoLinux() {
  return (
    <PageContainer
      title="Instalação no Linux"
      subtitle="Funciona em Ubuntu, Debian, Fedora, Arch — qualquer distro com kernel moderno."
      difficulty="intermediario"
      timeToRead="8 min"
    >
      <AlertBox type="info" title="Vale a pena no Linux?">
        Em Linux, instalar Apache + PHP + MariaDB pelo gerenciador de pacotes
        (apt/dnf) costuma ser mais leve e mais "linuxento". Use o XAMPP no
        Linux quando quiser o mesmo ambiente que tem no Windows — por
        exemplo, em laboratórios de faculdade — ou quando quer testar
        rapidamente sem mexer no Apache do sistema.
      </AlertBox>

      <h2>1. Baixe o instalador <code>.run</code></h2>
      <p>
        Acesse{" "}
        <a href="https://www.apachefriends.org/download.html" target="_blank" rel="noreferrer">
          apachefriends.org/download.html
        </a>{" "}
        e baixe o arquivo <code>xampp-linux-x64-X.X.X-Y-installer.run</code>.
      </p>

      <h2>2. Dê permissão de execução</h2>
      <p>
        Linux não roda <code>.run</code> sem permissão. Abra o terminal,
        navegue até a pasta de Downloads e execute:
      </p>
      <CodeBlock language="bash" code={`cd ~/Downloads
chmod +x xampp-linux-x64-*-installer.run`} />

      <h2>3. Instale como root</h2>
      <p>
        O XAMPP em Linux instala em <code>/opt/lampp</code>, que precisa de
        privilégios de root para criar:
      </p>
      <CodeBlock language="bash" code={`sudo ./xampp-linux-x64-*-installer.run`} />
      <p>
        Vai abrir um instalador gráfico parecido com o do Windows. Aceite o
        padrão (instala em <code>/opt/lampp</code>) e marque os componentes
        que quer.
      </p>

      <AlertBox type="warning" title="Em modo headless (sem interface)">
        Se você está em um servidor sem ambiente gráfico, use:
        <CodeBlock language="bash" code={`sudo ./xampp-linux-x64-*-installer.run --mode text`} />
      </AlertBox>

      <h2>4. Comandos do XAMPP no Linux</h2>
      <p>
        O XAMPP em Linux <strong>não</strong> tem painel gráfico como no
        Windows. Você usa o terminal:
      </p>
      <CodeBlock language="bash" code={`# Iniciar tudo (Apache + MySQL + ProFTPD)
sudo /opt/lampp/lampp start

# Parar tudo
sudo /opt/lampp/lampp stop

# Reiniciar
sudo /opt/lampp/lampp restart

# Status
sudo /opt/lampp/lampp status

# Iniciar só o Apache
sudo /opt/lampp/lampp startapache

# Iniciar só o MySQL
sudo /opt/lampp/lampp startmysql

# Painel gráfico (se instalou com GUI)
sudo /opt/lampp/manager-linux-x64.run`} />

      <h2>5. Onde fica o htdocs</h2>
      <p>
        Em vez de <code>C:\xampp\htdocs</code>, no Linux é{" "}
        <code>/opt/lampp/htdocs</code>. Para conseguir editar arquivos lá sem
        precisar de sudo toda hora, dê posse da pasta para o seu usuário:
      </p>
      <CodeBlock language="bash" code={`# Substitua $USER pelo seu nome de usuário se necessário
sudo chown -R $USER:$USER /opt/lampp/htdocs
chmod -R 755 /opt/lampp/htdocs`} />

      <PracticeBox
        title="Primeiro arquivo no Linux"
        goal="Criar e acessar um phpinfo() no XAMPP do Linux."
        steps={[
          "Abra o terminal.",
          "sudo /opt/lampp/lampp start",
          "echo '<?php phpinfo(); ?>' > /opt/lampp/htdocs/teste.php",
          "Abra o Firefox em http://localhost/teste.php",
          "Veja a página de informações do PHP.",
        ]}
        verify="A tela com tabelas roxas/cinzas do phpinfo() aparece sem erro."
      />

      <h2>6. Desinstalando o XAMPP</h2>
      <CodeBlock language="bash" code={`sudo /opt/lampp/uninstall
sudo rm -rf /opt/lampp`} />

      <AlertBox type="danger" title="Conflito com o Apache do sistema">
        Se você já tinha um Apache do <code>apt install apache2</code>
        instalado, ele e o do XAMPP vão brigar pela porta 80. Antes de
        iniciar o XAMPP:{" "}
        <code>sudo systemctl stop apache2 && sudo systemctl disable apache2</code>.
        Mesmo raciocínio para MySQL/MariaDB do sistema.
      </AlertBox>
    </PageContainer>
  );
}
