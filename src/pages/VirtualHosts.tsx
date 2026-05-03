import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function VirtualHosts() {
  return (
    <PageContainer
      title="Virtual Hosts — vários sites em um só XAMPP"
      subtitle="Em vez de http://localhost/projeto1 e http://localhost/projeto2, tenha http://projeto1.local e http://projeto2.local — com guia completo: name-based, IP-based, port-based, default vhost, mass virtual hosting e debug."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Capítulos de <a href="#/apache-config">httpd.conf</a> e{" "}
        <a href="#/estrutura-pastas">pastas</a> lidos. Saber editar o arquivo
        hosts do sistema (precisa de privilégio de administrador).
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Virtual Host (VHost)</strong> — entrada de configuração que
        diz ao Apache: "quando alguém acessar tal nome de domínio (ou IP, ou
        porta), sirva os arquivos de tal pasta com tais regras". Permite um
        único Apache hospedar dezenas de sites independentes.
      </p>
      <p>
        <strong>Name-based</strong> — virtual host distinguido pelo nome
        (header <code>Host:</code> que o navegador envia). Mais comum,
        permite vários sites no <strong>mesmo IP</strong>. Padrão da web
        moderna.
      </p>
      <p>
        <strong>IP-based</strong> — virtual host distinguido pelo IP. Cada
        site precisa de um IP próprio. Hoje raro (caro, escasso); só vale a
        pena para certificados SSL antigos sem SNI.
      </p>
      <p>
        <strong>Port-based</strong> — variação onde o que muda é a porta
        (<code>:8080</code>, <code>:8081</code>). Útil para rodar API e site
        em portas diferentes do mesmo Apache.
      </p>
      <p>
        <strong>SNI (Server Name Indication)</strong> — extensão do TLS que
        permite múltiplos sites HTTPS no mesmo IP. Sem SNI, era preciso um
        IP para cada cert HTTPS. Suportado desde 2007 — quase tudo hoje
        funciona com SNI.
      </p>

      <h2>Por que existem?</h2>
      <p>
        Todo site na internet precisa de um IP. IPs são caros e finitos
        (IPv4 tem só 4,2 bilhões). Com virtual hosts name-based, um único
        servidor (com um único IP) consegue hospedar centenas de sites
        diferentes — basta o navegador enviar o header <code>Host:</code> e
        o Apache decidir qual VHost responde.
      </p>
      <CodeBlock language="text" code={`# Requisição do navegador para http://blog.local:
GET / HTTP/1.1
Host: blog.local        ← É ESSA LINHA que o Apache usa para escolher o VHost
User-Agent: Mozilla/5.0 ...`} />

      <h2>Passo 1 — Habilite o include de vhosts</h2>
      <p>Abra <code>apache/conf/httpd.conf</code> e procure pela linha:</p>
      <CodeBlock language="apache" code={`# Virtual hosts
#Include conf/extra/httpd-vhosts.conf`} />
      <p>Remova o <code>#</code> da segunda linha e salve:</p>
      <CodeBlock language="apache" code={`Include conf/extra/httpd-vhosts.conf`} />

      <h2>Passo 2 — Defina seus VHosts (name-based)</h2>
      <p>Edite <code>apache/conf/extra/httpd-vhosts.conf</code>:</p>
      <CodeBlock language="apache" code={`# Mantém o localhost padrão funcionando — IMPORTANTE
# (precisa ser o PRIMEIRO bloco)
<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs"
    ServerName localhost
</VirtualHost>

# Site 1 — minha loja
<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/minhaloja"
    ServerName minhaloja.local
    ServerAlias www.minhaloja.local

    <Directory "C:/xampp/htdocs/minhaloja">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog "logs/minhaloja-error.log"
    CustomLog "logs/minhaloja-access.log" common
</VirtualHost>

# Site 2 — meu blog
<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/blog"
    ServerName blog.local
    <Directory "C:/xampp/htdocs/blog">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>`} />

      <AlertBox type="warning" title="Por que o primeiro VirtualHost de localhost?">
        Quando o Apache não acha um VHost com <code>ServerName</code> que
        bata com o <code>Host:</code> da requisição, ele <strong>cai no
        primeiro VHost cadastrado para aquela porta</strong>. Sem o bloco
        de localhost no topo, qualquer acesso a{" "}
        <code>http://localhost</code> mostraria sempre o primeiro site da
        lista — não o htdocs raiz.
      </AlertBox>

      <h2>Passo 3 — Mapeie os domínios no arquivo hosts</h2>
      <p>
        Os domínios <code>minhaloja.local</code> e <code>blog.local</code>{" "}
        não existem na internet. Para o seu computador entender que devem
        ser respondidos pelo próprio Apache, edite o arquivo{" "}
        <code>hosts</code>:
      </p>
      <CodeBlock language="text" code={`# Windows: C:\\Windows\\System32\\drivers\\etc\\hosts
# (precisa abrir o Bloco de Notas como Administrador)

# Linux:   /etc/hosts
# macOS:   /etc/hosts

127.0.0.1   localhost
127.0.0.1   minhaloja.local
127.0.0.1   www.minhaloja.local
127.0.0.1   blog.local`} />

      <AlertBox type="info" title="Por que .local e não .com?">
        Você pode usar qualquer sufixo (<code>.test</code>,{" "}
        <code>.dev</code>, <code>.local</code>). Evite <code>.dev</code> —
        desde 2017 o Chrome força HTTPS nesse TLD (a Google comprou{" "}
        <code>.dev</code>). <code>.test</code> é reservado pela RFC 6761
        para esse fim — é a opção mais "correta". <code>.local</code> é
        muito comum, mas pode conflitar com mDNS (Bonjour) em macOS.
      </AlertBox>

      <h2>Passo 4 — Reinicie e acesse</h2>
      <p>Painel → Apache → Stop → Start. Agora abra:</p>
      <CodeBlock language="text" code={`http://minhaloja.local
http://blog.local
http://localhost  ← continua funcionando`} />

      <PracticeBox
        title="Crie seu primeiro virtual host"
        goal="Acessar http://meuapp.local sem precisar digitar /meuapp."
        steps={[
          "Crie a pasta C:/xampp/htdocs/meuapp",
          "Dentro dela, crie index.php com: <h1>Meu app local!</h1>",
          "Habilite httpd-vhosts.conf no httpd.conf (descomente a linha Include)",
          "Adicione um <VirtualHost *:80> com ServerName meuapp.local",
          "Edite o hosts do sistema adicionando: 127.0.0.1   meuapp.local",
          "Reinicie o Apache pelo painel",
          "Acesse http://meuapp.local no navegador",
        ]}
        verify="O navegador mostra 'Meu app local!' direto, sem nenhum sub-caminho."
      />

      <h2>Como o Apache escolhe o VHost certo</h2>
      <p>O algoritmo, simplificado, é:</p>
      <ol>
        <li>
          Lista todos os <code>&lt;VirtualHost&gt;</code> que batem com o
          IP/porta da conexão (ex.: <code>*:80</code>).
        </li>
        <li>
          Se houver só um, ele é o escolhido.
        </li>
        <li>
          Se houver vários, compara o header <code>Host:</code> do
          request com o <code>ServerName</code> e os{" "}
          <code>ServerAlias</code> de cada um.
        </li>
        <li>
          Se nenhum bater, escolhe o <strong>primeiro VHost da lista</strong>{" "}
          como fallback (por isso a importância do bloco de localhost no
          topo).
        </li>
      </ol>

      <h2>ServerAlias com wildcards</h2>
      <p>Aceita <code>*</code> e <code>?</code> como curingas:</p>
      <CodeBlock language="apache" code={`<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/cliente1"
    ServerName cliente1.local
    # Subdomínios de qualquer profundidade caem aqui
    ServerAlias *.cliente1.local

    # Útil para multi-tenancy (subdomínio = empresa)
</VirtualHost>`} />

      <h2>Vhost específico para uma porta diferente</h2>
      <p>
        Quer rodar uma API em <code>:8080</code> sem mexer no site
        principal? Adicione um <code>Listen</code> no httpd.conf e um VHost
        novo:
      </p>
      <CodeBlock language="apache" code={`# httpd.conf
Listen 80
Listen 8080

# httpd-vhosts.conf
<VirtualHost *:8080>
    DocumentRoot "C:/xampp/htdocs/api"
    ServerName api.local
</VirtualHost>`} />
      <p>
        Acesse com <code>http://localhost:8080</code> ou{" "}
        <code>http://api.local:8080</code>.
      </p>

      <h2>VHost para HTTPS (porta 443)</h2>
      <p>
        Mesma ideia, mas dentro do bloco precisa habilitar SSL e apontar
        certificado:
      </p>
      <CodeBlock language="apache" code={`<VirtualHost *:443>
    DocumentRoot "C:/xampp/htdocs/minhaloja"
    ServerName minhaloja.local

    SSLEngine on
    SSLCertificateFile      "conf/minhaloja.crt"
    SSLCertificateKeyFile   "conf/minhaloja.key"

    <Directory "C:/xampp/htdocs/minhaloja">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>`} />
      <p>
        Veja <a href="#/ssl-local">HTTPS local</a> para gerar os certs.
      </p>

      <h2>_default_ — o vhost coringa</h2>
      <p>
        Em vez de <code>*:80</code> você pode usar <code>_default_:80</code>.
        Esse VHost responde a requisições que não batem com nenhum outro
        bloco — útil como página de "este host não existe".
      </p>
      <CodeBlock language="apache" code={`<VirtualHost _default_:80>
    DocumentRoot "C:/xampp/htdocs/sem-vhost"
    ServerName fallback.local
    # Página explicando que o domínio acessado não está configurado
</VirtualHost>`} />

      <h2>Mass Virtual Hosting (mod_vhost_alias)</h2>
      <p>
        Se você precisa hospedar dezenas/centenas de sites com a mesma
        estrutura, em vez de criar um <code>&lt;VirtualHost&gt;</code> por
        site, use o <code>mod_vhost_alias</code> — mapeia diretórios pelo
        nome:
      </p>
      <CodeBlock language="apache" code={`# Carregue o módulo no httpd.conf
LoadModule vhost_alias_module modules/mod_vhost_alias.so

<VirtualHost *:80>
    ServerName clientes.local
    ServerAlias *.clientes.local

    # %1 é o primeiro componente do hostname
    # cliente1.clientes.local → C:/xampp/htdocs/clientes/cliente1
    VirtualDocumentRoot "C:/xampp/htdocs/clientes/%1"
</VirtualHost>`} />
      <p>
        Cada cliente novo é só uma pasta — sem reiniciar o Apache, sem
        editar o vhosts.
      </p>

      <h2>Diagnóstico — descubra o que o Apache está vendo</h2>
      <CodeBlock language="bash" code={`# Lista todos os vhosts ativos com origem (arquivo:linha)
C:\\xampp\\apache\\bin\\httpd.exe -t -D DUMP_VHOSTS

# Saída exemplo:
# VirtualHost configuration:
# *:80                   is a NameVirtualHost
#          default server localhost (httpd-vhosts.conf:21)
#          port 80 namevhost localhost (httpd-vhosts.conf:21)
#          port 80 namevhost minhaloja.local (httpd-vhosts.conf:25)
#                  alias www.minhaloja.local
#          port 80 namevhost blog.local (httpd-vhosts.conf:35)`} />

      <h2>Erros comuns</h2>
      <ParamsTable
        title="Sintomas e causas mais frequentes"
        params={[
          { flag: "Forbidden — You don't have permission", desc: "Esqueceu o bloco <Directory> com Require all granted, OU o usuário do Apache não tem leitura na pasta." },
          { flag: "O navegador continua indo no localhost padrão", desc: "Esqueceu de salvar o arquivo hosts (precisava ser Administrador), ou esqueceu de reiniciar o Apache, ou cache de DNS." },
          { flag: "This site can't be reached / DNS_PROBE_FINISHED_NXDOMAIN", desc: "Typo no ServerName ou no arquivo hosts — o navegador não acha o domínio." },
          { flag: "Mesma página aparece em qualquer domínio", desc: "Faltou o bloco *:80 do localhost no topo. Sem ele, o primeiro VHost vira o catch-all." },
          { flag: "Cache do DNS no Windows", desc: "Após editar hosts, rode no PowerShell/CMD como admin: ipconfig /flushdns" },
          { flag: "Cache no Chrome", desc: "Acesse chrome://net-internals/#dns e clique em 'Clear host cache'." },
          { flag: "AH00558: Could not reliably determine the server's fully qualified domain name", desc: "Aviso, não erro. Defina ServerName no httpd.conf principal (ServerName localhost:80)." },
        ]}
      />
    </PageContainer>
  );
}
