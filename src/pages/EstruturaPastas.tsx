import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function EstruturaPastas() {
  return (
    <PageContainer
      title="Pastas do XAMPP e a mágica do htdocs"
      subtitle="Conhecer a árvore de diretórios do XAMPP é meio caminho andado para resolver qualquer problema."
      difficulty="iniciante"
      timeToRead="6 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        XAMPP já instalado e funcionando. Não precisa estar rodando — vamos
        apenas explorar arquivos. Saber abrir o explorador de arquivos do seu
        sistema (Explorer no Windows, Finder no macOS, Nautilus/Files no Linux).
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>DocumentRoot</strong> — termo do Apache para "a pasta raiz do
        servidor". Tudo que o navegador consegue ver via <code>http://localhost</code>{" "}
        está dentro dela. No XAMPP, o DocumentRoot padrão é <code>htdocs/</code>.
      </p>
      <p>
        <strong>Diretório</strong> e <strong>pasta</strong> — significam a
        mesma coisa. "Diretório" é o termo técnico (vem do Unix), "pasta" é o
        termo amigável (vem do Windows). Vamos usar os dois.
      </p>
      <p>
        <strong>Log</strong> — arquivo de texto onde um programa registra o
        que está acontecendo. Os logs do Apache (<code>access.log</code> e{" "}
        <code>error.log</code>) são seus melhores amigos quando algo quebra.
      </p>

      <h2>A árvore principal</h2>
      <p>
        Após instalar, o XAMPP cria uma pasta única (em Windows é{" "}
        <code>C:\xampp</code>, em Linux <code>/opt/lampp</code>, em macOS{" "}
        <code>/Applications/XAMPP/xamppfiles</code>). Por dentro:
      </p>
      <CodeBlock language="text" code={`xampp/
├── apache/             ← Apache (binários, conf, logs)
│   ├── conf/
│   │   ├── httpd.conf      ← Configuração principal do Apache
│   │   └── extra/
│   │       ├── httpd-vhosts.conf
│   │       └── httpd-ssl.conf
│   └── logs/
│       ├── access.log
│       └── error.log       ← AQUI está o erro quando algo quebra
├── mysql/              ← MariaDB
│   ├── bin/
│   │   ├── mysql.exe
│   │   └── mysqldump.exe
│   ├── data/               ← Onde os bancos ficam fisicamente
│   └── bin/my.ini          ← Configuração do MySQL
├── php/                ← PHP
│   ├── php.ini             ← Configuração do PHP
│   ├── php.exe
│   └── ext/                ← Extensões (.dll/.so)
├── phpMyAdmin/         ← phpMyAdmin (interface web do banco)
├── perl/               ← Perl
├── tomcat/             ← Tomcat (Java) — opcional
├── MercuryMail/        ← Servidor SMTP local — opcional
├── FileZillaFTP/       ← Servidor FTP — opcional
├── htdocs/             ← ★ AQUI vão os SEUS arquivos PHP ★
│   ├── index.php
│   ├── dashboard/
│   └── (suas pastas de projeto)
├── xampp-control.exe   ← Painel de controle (Windows)
├── readme_*.txt
└── webalizer/, anonymous/, tmp/, ...`} />

      <h2>O herói da história: <code>htdocs/</code></h2>
      <AlertBox type="success" title="Regra de ouro">
        Tudo que você quer servir como página web — HTML, PHP, CSS, JS,
        imagens — precisa estar dentro de <code>htdocs/</code>. O Apache
        ignora arquivos que estão fora dela.
      </AlertBox>
      <p>
        Quando você acessa <code>http://localhost/algo</code>, o Apache vai
        procurar por <code>htdocs/algo</code> ou <code>htdocs/algo/index.php</code>.
        Se você criar uma pasta <code>htdocs/meu-site/</code> e colocar um{" "}
        <code>index.php</code> dentro, ela responde em{" "}
        <code>http://localhost/meu-site/</code>.
      </p>

      <CodeBlock language="text" code={`htdocs/
├── index.php           → http://localhost/
├── teste.php           → http://localhost/teste.php
├── meu-site/
│   ├── index.php       → http://localhost/meu-site/
│   └── sobre.php       → http://localhost/meu-site/sobre.php
└── loja/
    ├── index.php       → http://localhost/loja/
    └── produtos.php    → http://localhost/loja/produtos.php`} />

      <h2>Pastas-chave por finalidade</h2>
      <ParamsTable
        title="Para que serve cada pasta importante"
        params={[
          { flag: "htdocs/", desc: "Raiz pública do servidor web. Tudo aqui dentro pode ser acessado pelo navegador via http://localhost/." },
          { flag: "apache/conf/httpd.conf", desc: "Arquivo principal de configuração do Apache. Aqui você muda a porta, ativa módulos, define DocumentRoot." },
          { flag: "apache/conf/extra/httpd-vhosts.conf", desc: "Onde se cadastram virtual hosts (ex: meusite.local). Permite ter vários sites no mesmo XAMPP." },
          { flag: "apache/logs/error.log", desc: "Logs de erro do Apache. Sempre que algo quebra, abra esse arquivo antes de qualquer coisa." },
          { flag: "apache/logs/access.log", desc: "Lista de TODAS as requisições recebidas. Útil para debugar 404 e ver o que o cliente realmente pediu." },
          { flag: "php/php.ini", desc: "Configuração do PHP: timezone, upload máximo, extensões habilitadas, exibição de erros." },
          { flag: "php/ext/", desc: "Pasta com as extensões (.dll/.so). Para ativar uma, geralmente é só descomentar no php.ini." },
          { flag: "mysql/data/", desc: "Onde o MariaDB guarda fisicamente os bancos. Cada banco vira uma subpasta. NUNCA edite à mão — use o phpMyAdmin." },
          { flag: "mysql/bin/my.ini", desc: "Configuração do MariaDB: porta, charset padrão, tamanho de buffer, etc." },
          { flag: "phpMyAdmin/config.inc.php", desc: "Configuração do phpMyAdmin: usuário, senha do MySQL, idioma." },
          { flag: "tmp/", desc: "Arquivos temporários — sessões PHP, uploads em trânsito. Pode esvaziar quando o disco apertar." },
        ]}
      />

      <h2>O atalho da bandeja: o painel</h2>
      <p>
        O painel de controle do XAMPP tem botões "Config" do lado de cada
        serviço. Eles abrem direto os arquivos certos:
      </p>
      <ul>
        <li>Apache → Config → <code>httpd.conf</code> (e os arquivos extra)</li>
        <li>MySQL → Config → <code>my.ini</code> e <code>phpMyAdmin/config.inc.php</code></li>
        <li>"Explorer" → abre a pasta do XAMPP no explorador do sistema</li>
      </ul>

      <AlertBox type="warning" title="Reinicie depois de editar">
        Mudanças em <code>httpd.conf</code>, <code>php.ini</code> e{" "}
        <code>my.ini</code> só têm efeito após reiniciar o serviço
        correspondente no painel (Stop → Start). Não basta salvar.
      </AlertBox>
    </PageContainer>
  );
}
