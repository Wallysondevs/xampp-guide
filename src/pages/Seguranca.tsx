import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function Seguranca() {
  return (
    <PageContainer
      title="Segurança no XAMPP"
      subtitle="O XAMPP foi feito para desenvolvimento. Algumas configurações vêm relaxadas — aqui mostramos como apertar quando precisar, do MySQL ao Apache, dos cabeçalhos HTTP ao firewall do sistema."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Confortável editando <a href="#/htaccess">.htaccess</a>,{" "}
        <a href="#/apache-config">httpd.conf</a> e <a href="#/php-ini">php.ini</a>.
        Saber reiniciar o Apache e o MySQL pelo painel.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>CVE</strong> (Common Vulnerabilities and Exposures) —
        identificador padronizado de vulnerabilidades públicas. Cada CVE
        descreve a falha, versões afetadas e severidade (CVSS).
      </p>
      <p>
        <strong>OWASP Top 10</strong> — lista das 10 categorias mais
        comuns de falha em aplicações web (injection, XSS, autenticação
        quebrada etc.). Referência mundial para revisão de segurança.
      </p>
      <p>
        <strong>CSP</strong> (Content Security Policy) — header HTTP que
        controla quais origens de script/imagem/fonte o navegador pode
        carregar. Defesa principal contra XSS.
      </p>
      <p>
        <strong>HSTS</strong> (HTTP Strict Transport Security) — header
        que diz ao navegador "só me acesse via HTTPS pelos próximos N
        segundos".
      </p>
      <p>
        <strong>SQL Injection</strong> — quando dados do usuário viram
        parte do SQL sem escape. Mitigação: prepared statements (PDO ou
        mysqli com bind).
      </p>
      <p>
        <strong>XSS</strong> (Cross-Site Scripting) — quando dados do
        usuário viram parte do HTML sem escape. Mitigação:{" "}
        <code>htmlspecialchars()</code>, CSP, frameworks que escapam por
        padrão (Blade, Twig).
      </p>
      <p>
        <strong>CSRF</strong> (Cross-Site Request Forgery) — outro site
        força o navegador a fazer uma ação na sua app (ex: enquanto você
        está logado). Mitigação: tokens CSRF e cookies <code>SameSite</code>.
      </p>

      <AlertBox type="danger" title="Regra de ouro">
        XAMPP <strong>não é servidor de produção</strong>. Mesmo apertando
        tudo, há ferramentas mais adequadas para hospedar projetos reais
        (Apache/Nginx em VPS com Certbot, ou hospedagem gerenciada). Use
        este capítulo se você precisa expor temporariamente o XAMPP na
        rede local (apresentação, demo, hackathon, intranet) ou se quer
        reforçar práticas de boas senhas e bons cabeçalhos mesmo
        localmente.
      </AlertBox>

      <h2>1. Defina senha do root no MySQL</h2>
      <p>
        Veja <a href="#/mysql-senha-root">Senha do root</a>. É a primeira
        coisa que invasor automatizado tenta — e o XAMPP entrega vazia.
        Bots varrem a internet procurando justamente MySQL/MariaDB sem
        senha.
      </p>
      <p>
        Além de definir, não use <code>root</code> em aplicações: crie um
        usuário dedicado por banco com{" "}
        <code>GRANT SELECT, INSERT, UPDATE, DELETE</code> só nas tabelas
        que precisa.
      </p>

      <h2>2. Restrinja o phpMyAdmin</h2>
      <p>
        Edite <code>apache/conf/extra/httpd-xampp.conf</code> e procure
        pelo bloco <code>&lt;Directory "C:/xampp/phpMyAdmin"&gt;</code>:
      </p>
      <CodeBlock language="apache" code={`<Directory "C:/xampp/phpMyAdmin">
    AllowOverride AuthConfig
    Require local        # local-only por padrão na maioria das versões

    # Para acessar de outra máquina na rede local:
    # Require ip 192.168.1
    # Require ip 10.0.0
</Directory>`} />
      <p>Para uma camada extra, ponha o phpMyAdmin atrás de senha HTTP Basic:</p>
      <CodeBlock language="bash" code={`# Gere o arquivo .htpasswd (no shell do XAMPP)
htpasswd -c C:/xampp/security/.htpasswd admin

# Edite httpd-xampp.conf:
<Directory "C:/xampp/phpMyAdmin">
    AuthType Basic
    AuthName "phpMyAdmin Restrito"
    AuthUserFile "C:/xampp/security/.htpasswd"
    Require valid-user
</Directory>`} />

      <h2>3. Use o "Security check" do XAMPP</h2>
      <p>O dashboard tem uma página automática que verifica vulnerabilidades:</p>
      <CodeBlock language="text" code={`http://localhost/security/`} />
      <p>
        Ela aponta o que está aberto. Tem um link{" "}
        <code>/security/xamppsecurity.php</code> que, se você acessar, faz
        um wizard pra:
      </p>
      <ul>
        <li>Definir senha do MySQL root</li>
        <li>Definir senha do diretório XAMPP (htpasswd)</li>
        <li>Definir senha de FileZilla e Mercury (se instalados)</li>
      </ul>

      <h2>4. Limite quem acessa o XAMPP pela rede</h2>
      <p>
        Por padrão o Apache do XAMPP escuta em <code>0.0.0.0:80</code>, ou
        seja, em todas as interfaces. Se sua máquina está em uma rede WiFi
        pública (cafeteria, aeroporto, coworking), qualquer um pode tentar
        acessar <code>http://SEU-IP/</code> e ver seus projetos.
      </p>
      <p>
        Para limitar a apenas localhost, edite{" "}
        <code>apache/conf/httpd.conf</code>:
      </p>
      <CodeBlock language="apache" code={`# Antes:
Listen 80

# Depois (só escuta localmente):
Listen 127.0.0.1:80
Listen [::1]:80`} />
      <p>
        Faça o mesmo no MySQL — em <code>my.ini</code>, garanta:
      </p>
      <CodeBlock language="ini" code={`[mysqld]
bind-address = 127.0.0.1     # MySQL só aceita conexão local`} />

      <h2>5. Não exponha o phpinfo()</h2>
      <p>
        É um clássico: você cria <code>htdocs/info.php</code> com{" "}
        <code>phpinfo()</code> pra debugar e esquece de apagar. Em
        produção isso é <strong>uma mina de ouro</strong> para invasores:
        revela versão exata do PHP (e portanto CVEs aplicáveis), módulos,
        caminho de arquivos, variáveis de ambiente (incluindo segredos), e
        configurações inteiras.
      </p>
      <p>Sempre apague depois de usar — ou bloqueie:</p>
      <CodeBlock title=".htaccess" language="apache" code={`<Files "info.php">
    Require all denied
</Files>

# Ou bloqueie qualquer arquivo que comece com phpinfo
<FilesMatch "^phpinfo">
    Require all denied
</FilesMatch>`} />

      <h2>6. Esconda a versão do Apache e PHP</h2>
      <p>Em <code>httpd.conf</code>, adicione/edite:</p>
      <CodeBlock language="apache" code={`ServerTokens Prod
ServerSignature Off`} />
      <p>Em <code>php.ini</code>:</p>
      <CodeBlock language="ini" code={`expose_php = Off`} />
      <p>
        Antes: o navegador via{" "}
        <code>Server: Apache/2.4.58 (Win64) PHP/8.2.12</code>. Depois: só{" "}
        <code>Server: Apache</code>. Não impede ataque, mas dificulta
        reconhecimento automatizado.
      </p>

      <h2>7. Cabeçalhos de segurança</h2>
      <p>Coloque no <code>.htaccess</code> ou no <code>httpd.conf</code>:</p>
      <CodeBlock language="apache" code={`<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
    Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"

    # HSTS — só ative quando estiver 100% certo do HTTPS (é difícil reverter)
    # Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains" env=HTTPS

    # CSP é poderoso e quebra MUITA coisa se não for ajustado — comece restritivo
    # e libere fontes/scripts conforme o navegador reclama
    # Header set Content-Security-Policy "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'"

    # Cross-Origin Opener Policy (isolamento entre janelas)
    Header set Cross-Origin-Opener-Policy "same-origin"
</IfModule>`} />
      <ParamsTable
        title="O que cada cabeçalho previne"
        params={[
          { flag: "X-Content-Type-Options: nosniff", desc: "Impede que o navegador 'adivinhe' o tipo MIME (evita upload de .jpg que vira .html executável)." },
          { flag: "X-Frame-Options: SAMEORIGIN", desc: "Impede outros sites de embedar o seu em <iframe> — defesa contra clickjacking." },
          { flag: "Referrer-Policy", desc: "Controla quanta info do referrer vaza para outros sites em links externos." },
          { flag: "Permissions-Policy", desc: "Define quais APIs do navegador (câmera, mic, geo) podem ser usadas." },
          { flag: "Strict-Transport-Security", desc: "Força HTTPS por max-age segundos — depois de visitada uma vez, navegador não aceita HTTP mais." },
          { flag: "Content-Security-Policy", desc: "Whitelist de origens de scripts/estilos/imagens. Defesa principal contra XSS." },
        ]}
      />
      <AlertBox type="info" title="Teste seus headers">
        Use <a href="https://securityheaders.com" target="_blank" rel="noreferrer">
        securityheaders.com</a> ou <a href="https://observatory.mozilla.org" target="_blank" rel="noreferrer">
        Mozilla Observatory</a> — colocam nota A+/F e explicam o que falta.
      </AlertBox>

      <h2>8. Bloqueie acesso a arquivos sensíveis</h2>
      <CodeBlock title=".htaccess da raiz" language="apache" code={`<FilesMatch "(^\\.|composer\\.(json|lock)|package\\.json|README|\\.sql$|\\.env|\\.git|\\.htaccess$|\\.htpasswd$)">
    Require all denied
</FilesMatch>

# Negar listing de pastas
Options -Indexes

# Negar pasta .git inteira
RedirectMatch 404 /\\.git`} />
      <p>
        Sem isso, alguém pode acessar <code>https://seusite.com/.env</code>
        {" "}e baixar suas senhas em texto puro.
      </p>

      <h2>9. PHP — endurecer o php.ini</h2>
      <CodeBlock language="ini" code={`; Em produção: nunca mostre erros na tela
display_errors = Off
display_startup_errors = Off
log_errors = On
error_log = "C:/xampp/php/logs/php_error_log"

; Esconder versão
expose_php = Off

; Desativar funções perigosas (se a app não precisar)
disable_functions = exec,passthru,shell_exec,system,proc_open,popen,curl_multi_exec,parse_ini_file,show_source

; Cookies de sessão seguros
session.cookie_secure = 1     ; só envia em HTTPS
session.cookie_httponly = 1   ; JS não acessa
session.cookie_samesite = "Lax"
session.use_strict_mode = 1
session.use_only_cookies = 1

; Limite de upload (evita DoS por upload gigante)
upload_max_filesize = 10M
post_max_size = 12M
max_input_time = 30
max_execution_time = 30
memory_limit = 128M

; Bloquear inclusão de URL remota (RFI)
allow_url_fopen = Off
allow_url_include = Off

; Limitar onde o PHP pode ler arquivos
open_basedir = "C:/xampp/htdocs/seuapp"`} />
      <AlertBox type="warning" title="disable_functions com cuidado">
        <code>shell_exec</code>, <code>exec</code>, <code>system</code>,{" "}
        <code>proc_open</code>, <code>popen</code> e <code>passthru</code>
        {" "}são úteis em apps legítimos (Composer, ImageMagick wrappers,
        deploy scripts). Desabilite só se sua app realmente não usa — ou
        permite só em rotas específicas.
      </AlertBox>

      <h2>10. Defesa contra brute-force e bots</h2>
      <p>
        Telas de login são alvo constante de tentativas automáticas. Em
        produção, instale <strong>fail2ban</strong> para banir IPs que
        falham N vezes em M minutos. Em XAMPP local, ao menos:
      </p>
      <ul>
        <li>Implemente <strong>rate limiting</strong> na app (Laravel:{" "}
          <code>throttle</code> middleware).</li>
        <li>Use <strong>CAPTCHA</strong> em formulários públicos
          (hCaptcha, reCAPTCHA, Cloudflare Turnstile).</li>
        <li>Force <strong>senhas fortes</strong> e MFA quando possível.</li>
        <li>Logue tentativas fracassadas para análise (
          <code>storage/logs/laravel.log</code>).</li>
      </ul>

      <h2>11. Atualize o XAMPP (e o stack)</h2>
      <p>
        Versões antigas têm CVEs conhecidas (PHP 5.x, Apache 2.2, MariaDB
        antigo). Mesmo em desenvolvimento, mantenha-se em uma versão
        recente e suportada — em{" "}
        <a href="https://www.apachefriends.org/download.html" target="_blank" rel="noreferrer">
          apachefriends.org
        </a>{" "}
        sempre tem a lista do que ainda recebe atualização. Veja também{" "}
        <a href="https://www.php.net/supported-versions.php" target="_blank" rel="noreferrer">
        php.net/supported-versions</a> para o calendário de fim de
        suporte (EOL) de cada versão.
      </p>
      <CodeBlock language="bash" code={`# Veja sua versão hoje
php -v
C:/xampp/apache/bin/httpd.exe -v
C:/xampp/mysql/bin/mysql --version`} />

      <h2>12. Auditoria de dependências</h2>
      <p>
        Pacotes do Composer e do npm também têm vulnerabilidades. Rode
        regularmente:
      </p>
      <CodeBlock language="bash" code={`# Composer
composer audit            # PHP 8+
composer outdated --direct

# npm
npm audit
npm audit fix
npm outdated`} />

      <PracticeBox
        title="Hardening básico do XAMPP"
        goal="Aplicar as defesas mínimas que cobrem 90% dos cenários de uso local com risco."
        steps={[
          "Defina senha forte para o root do MySQL",
          "Crie um usuário dedicado por aplicação (sem usar root)",
          "Confirme Listen 127.0.0.1:80 no httpd.conf",
          "Confirme bind-address=127.0.0.1 no my.ini",
          "Adicione expose_php = Off, ServerTokens Prod e ServerSignature Off",
          "Crie .htaccess na raiz bloqueando .env, .git, .sql, composer.*",
          "Configure cabeçalhos X-Content-Type-Options, X-Frame-Options, Referrer-Policy",
          "Acesse http://localhost/security/ e siga o wizard",
          "Atualize o XAMPP para versão atual de PHP e MariaDB",
        ]}
        verify="securityheaders.com dá nota mínima B+ no seu vhost; phpMyAdmin recusa acesso de outra máquina; nenhum arquivo sensível responde 200."
      />

      <h2>Em código: as 5 vulnerabilidades clássicas</h2>
      <ParamsTable
        title="OWASP Top 10 que aparece em PHP do dia a dia"
        params={[
          { flag: "SQL Injection", desc: "Sempre use prepared statements: $pdo->prepare('SELECT * FROM users WHERE id = ?')->execute([$id]). Nunca concatene $_GET no SQL." },
          { flag: "XSS (Cross-Site Scripting)", desc: "Sempre escape ao imprimir HTML: echo htmlspecialchars($var, ENT_QUOTES, 'UTF-8'). Em Laravel/Twig, {{ $var }} já escapa." },
          { flag: "CSRF", desc: "Use tokens em formulários (Laravel: @csrf). Defina cookies SameSite=Lax ou Strict." },
          { flag: "Inclusão arbitrária (LFI/RFI)", desc: "Nunca faça include $_GET['page']. Use whitelist: $paginas = ['home','sobre']; if (in_array($p, $paginas, true)) include \"$p.php\";" },
          { flag: "Upload mal validado", desc: "Verifique MIME real (finfo), extensão pela whitelist, salve em pasta fora de htdocs ou bloqueie execução de PHP nessa pasta." },
          { flag: "Sessões fracas", desc: "session_regenerate_id(true) após login, cookies HttpOnly + Secure + SameSite, timeout razoável." },
          { flag: "Senhas em texto puro", desc: "password_hash($senha, PASSWORD_DEFAULT) na criação. password_verify() na conferência. Nunca MD5/SHA1." },
        ]}
      />

      <AlertBox type="success" title="Resumindo: o que fazer agora">
        Senha de root no MySQL, phpMyAdmin restrito ao localhost,{" "}
        <code>display_errors = Off</code> ao menos quando expor algo, sem{" "}
        <code>phpinfo.php</code> esquecido na raiz, <code>.htaccess</code>
        {" "}bloqueando arquivos sensíveis e cabeçalhos básicos no
        Apache. Para dia a dia local, isso é mais que suficiente. Para
        produção real, leia <a href="#/migrar-producao">Migrando para
        produção</a>.
      </AlertBox>
    </PageContainer>
  );
}
