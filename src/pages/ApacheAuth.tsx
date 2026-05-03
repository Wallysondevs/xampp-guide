import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function ApacheAuth() {
  return (
    <PageContainer
      title="Autenticação no Apache — Basic, Digest e htpasswd"
      subtitle="Proteja diretórios inteiros sem precisar tocar uma linha de PHP. Como criar e manter usuários, restringir por IP e combinar Satisfy Any."
      difficulty="intermediario"
      timeToRead="10 min"
    >
      <AlertBox type="info" title="Quando usar?">
        Painéis administrativos internos (<code>/admin</code>, <code>/phpmyadmin</code>),
        ambientes de homologação que não devem vazar para o Google e qualquer pasta que precise
        de barreira rápida. Para login real de aplicação, prefira sessão/JWT no PHP.
      </AlertBox>

      <h2>Basic vs Digest</h2>
      <ul>
        <li>
          <strong>Basic</strong> — usuário e senha em base64 a cada request.{" "}
          <strong>Sempre</strong> use junto com HTTPS (caso contrário, vai em texto claro).
        </li>
        <li>
          <strong>Digest</strong> — desafio + hash MD5. Não trafega senha, mas o algoritmo é
          fraco hoje em dia. Pouco usado — Basic+HTTPS é mais simples e seguro.
        </li>
      </ul>

      <h2>Criando o arquivo de usuários</h2>
      <CodeBlock
        title="Windows / XAMPP"
        language="bash"
        code={`# 1. Crie a pasta fora do htdocs (NUNCA dentro)
mkdir C:/xampp/auth

# 2. Crie o arquivo e adicione o primeiro usuário
C:/xampp/apache/bin/htpasswd.exe -Bc C:/xampp/auth/.htpasswd admin
# -B = bcrypt (recomendado, padrão em Apache 2.4+)
# -c = create (sobrescreve!)

# Adicionar mais usuários depois (sem -c!):
C:/xampp/apache/bin/htpasswd.exe -B C:/xampp/auth/.htpasswd maria

# Conferir
type C:/xampp/auth/.htpasswd
# admin:$2y$05$kQp...`}
      />

      <CodeBlock
        title="Linux"
        language="bash"
        code={`sudo /opt/lampp/bin/htpasswd -Bc /opt/lampp/etc/.htpasswd admin
sudo /opt/lampp/bin/htpasswd -B /opt/lampp/etc/.htpasswd maria`}
      />

      <h2>Protegendo um diretório com .htaccess</h2>
      <CodeBlock
        title="C:/xampp/htdocs/admin/.htaccess"
        language="apache"
        code={`AuthType Basic
AuthName "Área restrita — login obrigatório"
AuthUserFile "C:/xampp/auth/.htpasswd"
Require valid-user`}
      />
      <p>
        Acesse <code>http://localhost/admin/</code> e o navegador exibe o pop-up de login. Após
        autenticar, o Apache passa o usuário para o PHP em{" "}
        <code>$_SERVER['PHP_AUTH_USER']</code>.
      </p>

      <h2>Restringindo por usuário específico</h2>
      <CodeBlock
        title=".htaccess"
        language="apache"
        code={`AuthType Basic
AuthName "Somente o admin"
AuthUserFile "C:/xampp/auth/.htpasswd"
Require user admin
# múltiplos usuários:
# Require user admin maria joao`}
      />

      <h2>Grupos com AuthGroupFile</h2>
      <CodeBlock
        title="C:/xampp/auth/.htgroup"
        language="text"
        code={`# nome_grupo: usuario1 usuario2 ...
admins: admin maria
revisores: joao maria pedro`}
      />
      <CodeBlock
        title=".htaccess"
        language="apache"
        code={`AuthType Basic
AuthName "Restrita a admins"
AuthUserFile "C:/xampp/auth/.htpasswd"
AuthGroupFile "C:/xampp/auth/.htgroup"
Require group admins`}
      />

      <h2>Restringindo por IP</h2>
      <CodeBlock
        language="apache"
        code={`# Apache 2.4 — sintaxe nova com Require
<RequireAll>
    Require all granted
    Require ip 127.0.0.1 192.168.1.0/24
</RequireAll>

# Negar tudo, permitir só dois IPs:
<RequireAny>
    Require ip 127.0.0.1
    Require ip 200.100.50.10
</RequireAny>`}
      />

      <h2>Combinando IP + senha</h2>
      <p>
        Cenário comum: liberar sem senha para o IP da empresa, mas pedir senha para qualquer outro.
      </p>
      <CodeBlock
        language="apache"
        code={`AuthType Basic
AuthName "Painel"
AuthUserFile "C:/xampp/auth/.htpasswd"

<RequireAny>
    Require ip 192.168.1.0/24
    Require valid-user
</RequireAny>`}
      />

      <h2>Por bloco &lt;Files&gt; ou &lt;Location&gt;</h2>
      <CodeBlock
        title="Proteger só um arquivo"
        language="apache"
        code={`<Files "config.php">
    AuthType Basic
    AuthName "Acesso restrito"
    AuthUserFile "C:/xampp/auth/.htpasswd"
    Require valid-user
</Files>`}
      />

      <h2>Logout do Basic Auth</h2>
      <p>
        O HTTP Basic <strong>não tem logout</strong> — o navegador guarda credenciais até fechar a
        janela. Para "deslogar" sem fechar:
      </p>
      <CodeBlock
        title="logout.php"
        language="php"
        code={`<?php
header('WWW-Authenticate: Basic realm="Login"');
header('HTTP/1.0 401 Unauthorized');
echo "Sessão encerrada. <a href='/admin/'>Entrar de novo</a>";
exit;`}
      />

      <ParamsTable
        title="Diretivas resumo"
        params={[
          { flag: "AuthType", desc: "Basic ou Digest." },
          { flag: "AuthName", desc: "Texto exibido no popup do navegador (entre aspas)." },
          { flag: "AuthUserFile", desc: "Caminho ABSOLUTO do .htpasswd (sempre fora do htdocs)." },
          { flag: "AuthGroupFile", desc: "Caminho do arquivo de grupos." },
          { flag: "Require valid-user", desc: "Qualquer usuário autenticado serve." },
          { flag: "Require user X", desc: "Apenas usuário X." },
          { flag: "Require group X", desc: "Apenas membros do grupo X." },
          { flag: "Require ip X", desc: "Apenas o IP/range X." },
          { flag: "<RequireAll>", desc: "Combina exigências em AND." },
          { flag: "<RequireAny>", desc: "Combina exigências em OR." },
        ]}
      />

      <AlertBox type="warning" title=".htpasswd dentro de htdocs = vazamento">
        Se você botar o <code>.htpasswd</code> dentro de uma pasta acessível pelo Apache, qualquer
        um pode baixar. Sempre coloque <strong>fora</strong> do <code>DocumentRoot</code>.
        Mesmo com <code>.htaccess</code> bloqueando, evite o risco.
      </AlertBox>

      <AlertBox type="danger" title="Nunca em produção sem HTTPS">
        Basic Auth via HTTP envia a senha em base64 — qualquer sniffer lê. Em produção: HTTPS
        obrigatório. Em XAMPP local, ative o <code>ssl</code> e use{" "}
        <code>https://localhost</code>.
      </AlertBox>

      <h2>Armadilhas</h2>
      <ul>
        <li>
          Esquecer <code>AllowOverride AuthConfig</code> (ou <code>All</code>) no{" "}
          <code>httpd.conf</code> — sem isso, as diretivas em <code>.htaccess</code> são
          ignoradas.
        </li>
        <li>
          Caminho <strong>relativo</strong> em <code>AuthUserFile</code> raramente funciona — use
          absoluto.
        </li>
        <li>
          Reusar a flag <code>-c</code> ao adicionar usuários — sobrescreve o arquivo todo.
        </li>
        <li>
          Senhas <strong>weak</strong>: htpasswd por padrão usa MD5 (no Linux) ou bcrypt (no 2.4).
          Prefira sempre <code>-B</code>.
        </li>
      </ul>
    </PageContainer>
  );
}
