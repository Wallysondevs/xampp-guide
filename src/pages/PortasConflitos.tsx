import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function PortasConflitos() {
  return (
    <PageContainer
      title="Conflitos de Portas — o terror do Apache"
      subtitle="Por que o Apache não inicia, quem é o vilão habitual e como resolver de vez."
      difficulty="iniciante"
      timeToRead="7 min"
    >
      <p>
        O Apache do XAMPP, por padrão, escuta nas portas <strong>80</strong>
        (HTTP) e <strong>443</strong> (HTTPS). O MySQL escuta na{" "}
        <strong>3306</strong>. Se outro programa já está usando essas portas, o
        XAMPP simplesmente não inicia.
      </p>

      <h2>Os suspeitos de sempre</h2>
      <ParamsTable
        title="Programas que costumam ocupar a porta 80"
        params={[
          { flag: "Skype (versões antigas)", desc: "Usava a porta 80 como fallback. Bem comum em Windows 7/8. Em versões recentes do Skype isso já não acontece — mas se for legado, abra Skype → Ferramentas → Opções → Avançado → Conexão e desmarque 'usar as portas 80 e 443'." },
          { flag: "IIS (Internet Information Services)", desc: "Servidor web da Microsoft. Vem ativo em algumas edições do Windows Pro/Server. Desative em 'Recursos do Windows'." },
          { flag: "World Wide Web Publishing Service", desc: "Serviço que sustenta o IIS. Mesmo se você desativar o IIS, este serviço pode continuar prendendo a porta 80. Pare e desabilite em services.msc." },
          { flag: "VMware Workstation", desc: "Em algumas configurações reserva a 443. Edite preferências do VMware ou suba o XAMPP em outra porta." },
          { flag: "BranchCache / HostedNetworkSvc", desc: "Serviços do Windows que ocupam portas variadas. Reinicie e teste." },
          { flag: "Outro Apache/Nginx", desc: "Se você instalou Laragon, WAMP, MAMP, Docker ou Apache nativo, eles brigam pelas mesmas portas. Pare o concorrente antes de iniciar o XAMPP." },
          { flag: "Vue / React em modo dev", desc: "Servidores de dev modernos não pegam a 80 — mas se você usou flags estranhas, podem. Confira com netstat." },
        ]}
      />

      <h2>Quem está usando a porta?</h2>
      <p>
        Antes de chutar, descubra. Tanto Windows quanto Linux/macOS têm
        comandos para listar quem está escutando em uma porta:
      </p>

      <CodeBlock language="powershell" code={`# Windows (PowerShell)
netstat -ano | findstr :80
netstat -ano | findstr :443
netstat -ano | findstr :3306

# Saída exemplo:
#   TCP    0.0.0.0:80    0.0.0.0:0    LISTENING    4
#                                                  ↑ esse é o PID

# Descubra qual programa é esse PID:
tasklist /FI "PID eq 4"

# Ou pelo Gerenciador de Tarefas → aba "Detalhes" → procure pelo PID`} />

      <CodeBlock language="bash" code={`# Linux / macOS
sudo lsof -i :80
sudo lsof -i :443
sudo lsof -i :3306

# Ou:
sudo netstat -tulnp | grep :80
sudo ss -tulnp | grep :80`} />

      <PracticeBox
        title="Liberando a porta 80 do IIS no Windows"
        goal="Parar e desabilitar o IIS para o Apache poder usar a porta 80."
        steps={[
          "Pressione Win + R e digite services.msc",
          "Procure por 'World Wide Web Publishing Service' (ou Servico de Publicacao da World Wide Web)",
          "Clique com o direito → Parar",
          "Clique com o direito → Propriedades → Tipo de Inicialização: Desativado",
          "Pressione Win + R e digite optionalfeatures",
          "Desmarque 'Internet Information Services' e clique em OK",
          "Reinicie o computador",
        ]}
        verify="Após reiniciar, rode netstat -ano | findstr :80 — não deve aparecer nada. O Apache do XAMPP iniciará normalmente."
      />

      <h2>Plano B: trocar a porta do Apache</h2>
      <p>
        Se não dá pra parar o programa que ocupa a 80 (porque é importante),
        mude a porta do Apache. Edite{" "}
        <code>apache/conf/httpd.conf</code>:
      </p>
      <CodeBlock language="apache" code={`# Antes:
Listen 80

# Depois:
Listen 8080

# E mais embaixo procure:
ServerName localhost:80

# Mude para:
ServerName localhost:8080`} />

      <p>
        Se também usa SSL, edite <code>apache/conf/extra/httpd-ssl.conf</code>:
      </p>
      <CodeBlock language="apache" code={`Listen 4433
<VirtualHost _default_:4433>
    ServerName localhost:4433
    ...
</VirtualHost>`} />

      <p>
        Reinicie o Apache pelo painel. Acesse o XAMPP em{" "}
        <code>http://localhost:8080</code>. Você vai ter que digitar a porta
        sempre — esse é o preço de não usar a 80.
      </p>

      <AlertBox type="warning" title="Não esqueça do firewall">
        Em Windows, ao mudar para uma porta nova como 8080, o Windows Defender
        Firewall pode pedir autorização na primeira vez. Aceite "Permitir
        acesso" para "Redes privadas".
      </AlertBox>

      <h2>Conflito do MySQL — porta 3306</h2>
      <p>
        Se você tem MySQL Server instalado separadamente (do site da Oracle, ou
        via instalador do Workbench), ele compete pela 3306. Solução parecida:
      </p>
      <CodeBlock language="ini" code={`# mysql/bin/my.ini
[mysqld]
port = 3307
[client]
port = 3307`} />
      <p>
        E lembre que o phpMyAdmin precisa saber da nova porta. Edite{" "}
        <code>phpMyAdmin/config.inc.php</code>:
      </p>
      <CodeBlock language="php" code={`$cfg['Servers'][$i]['host'] = '127.0.0.1';
$cfg['Servers'][$i]['port'] = '3307';`} />
    </PageContainer>
  );
}
