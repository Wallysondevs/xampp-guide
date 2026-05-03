import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function PerlCgi() {
  return (
    <PageContainer
      title="Perl + CGI no XAMPP — o 'P' esquecido"
      subtitle="Sim, o XAMPP traz Perl. Como ativar mod_perl ou rodar via CGI clássico, escrever scripts .pl e .cgi, e quando ainda faz sentido em 2026."
      difficulty="intermediario"
      timeToRead="9 min"
    >
      <AlertBox type="info" title="Quem usa Perl hoje?">
        Sysadmins (regex absurda em logs), bioinformática, ferramentas legadas (RT, Bugzilla,
        AWStats), automação de DBA. No XAMPP, Perl está lá pronto pra estes casos.
      </AlertBox>

      <h2>Verificando o Perl do XAMPP</h2>
      <CodeBlock
        language="bash"
        code={`# Windows
C:/xampp/perl/bin/perl.exe -v
# This is perl 5, version 32, ...

# Linux
/opt/lampp/bin/perl -v

# Adicione ao PATH para chamar 'perl' direto
$env:Path = "C:\\xampp\\perl\\bin;$env:Path"`}
      />

      <h2>CGI clássico — script no cgi-bin</h2>
      <p>
        Toda instalação XAMPP define <code>htdocs/cgi-bin/</code> com <code>ScriptAlias</code>:
      </p>
      <CodeBlock
        title="httpd.conf — já vem assim"
        language="apache"
        code={`ScriptAlias /cgi-bin/ "C:/xampp/cgi-bin/"

<Directory "C:/xampp/cgi-bin">
    AllowOverride None
    Options None
    Require all granted
</Directory>

# Para qualquer .pl/.cgi em qualquer pasta:
AddHandler cgi-script .cgi .pl
Options +ExecCGI`}
      />

      <CodeBlock
        title="C:/xampp/cgi-bin/hello.pl"
        language="perl"
        code={`#!C:/xampp/perl/bin/perl.exe
# (Linux: #!/opt/lampp/bin/perl)

use strict;
use warnings;

print "Content-Type: text/html; charset=UTF-8\\n\\n";

print "<h1>Olá do Perl!</h1>";
print "<p>Hora atual: " . localtime() . "</p>";
print "<p>QUERY_STRING: $ENV{QUERY_STRING}</p>";`}
      />
      <p>
        Acesse <code>http://localhost/cgi-bin/hello.pl?nome=Maria</code>. Em Linux, dê
        <code>chmod +x</code>.
      </p>

      <AlertBox type="warning" title="A primeira linha precisa estar EXATA">
        O caminho do <strong>shebang</strong> (<code>#!perl.exe</code>) deve apontar para o binário
        correto. Em Windows o Apache usa essa linha como pista; se o caminho estiver errado, vem
        500 puro.
      </AlertBox>

      <h2>Lendo parâmetros — módulo CGI</h2>
      <CodeBlock
        title="cgi-bin/form.pl"
        language="perl"
        code={`#!C:/xampp/perl/bin/perl.exe
use strict;
use warnings;
use CGI;

my $cgi = CGI->new;
my $nome = $cgi->param('nome') // 'estranho';

print $cgi->header(-type => 'text/html', -charset => 'UTF-8');
print $cgi->start_html('Form');
print $cgi->h1("Olá, $nome");
print $cgi->start_form;
print 'Seu nome: ', $cgi->textfield('nome'), $cgi->submit;
print $cgi->end_form;
print $cgi->end_html;`}
      />

      <h2>POST com upload</h2>
      <CodeBlock
        language="perl"
        code={`use CGI;

my $cgi = CGI->new;
my $upload = $cgi->upload('arquivo');

if ($upload) {
    open(my $fh, '>', "C:/xampp/htdocs/uploads/" . $cgi->param('arquivo')) or die $!;
    binmode $fh;
    while (read($upload, my $buf, 1024)) { print $fh $buf; }
    close $fh;
    print "OK\\n";
}`}
      />

      <h2>Conectando no MariaDB</h2>
      <CodeBlock
        language="perl"
        code={`use DBI;

my $dbh = DBI->connect(
    'DBI:mysql:database=loja;host=127.0.0.1',
    'app_loja',
    'senha',
    { RaiseError => 1, AutoCommit => 1, mysql_enable_utf8mb4 => 1 },
);

my $sth = $dbh->prepare('SELECT id, nome FROM produtos WHERE preco > ?');
$sth->execute(100);

while (my $row = $sth->fetchrow_hashref) {
    print "ID=$row->{id}  Nome=$row->{nome}\\n";
}

$sth->finish;
$dbh->disconnect;`}
      />

      <h2>mod_perl — performance</h2>
      <p>
        CGI gera 1 processo Perl por request (caro). <code>mod_perl</code> embute o interpretador
        no Apache, mantém em memória e dá ganhos enormes. No XAMPP costuma vir desabilitado:
      </p>
      <CodeBlock
        title="httpd.conf"
        language="apache"
        code={`# Apenas Linux/macOS — XAMPP Windows não embarca mod_perl
LoadModule perl_module modules/mod_perl.so

<Location /perl>
    SetHandler perl-script
    PerlResponseHandler ModPerl::Registry
    Options +ExecCGI
    PerlOptions +ParseHeaders
</Location>`}
      />

      <h2>Variáveis de ambiente CGI</h2>
      <ParamsTable
        title="Mais úteis"
        params={[
          { flag: "$ENV{REQUEST_METHOD}", desc: "GET / POST / PUT..." },
          { flag: "$ENV{QUERY_STRING}", desc: "String depois do '?'." },
          { flag: "$ENV{REMOTE_ADDR}", desc: "IP do cliente." },
          { flag: "$ENV{HTTP_USER_AGENT}", desc: "Navegador." },
          { flag: "$ENV{HTTP_COOKIE}", desc: "Cookies." },
          { flag: "$ENV{CONTENT_LENGTH}", desc: "Tamanho do corpo POST." },
          { flag: "$ENV{REQUEST_URI}", desc: "URL completa do request." },
          { flag: "$ENV{SCRIPT_NAME}", desc: "Caminho do script." },
        ]}
      />

      <h2>Erros do Perl no Apache</h2>
      <p>
        Erros vão para o <strong>error.log</strong> do Apache (não para o navegador). Para ver
        rápido durante desenvolvimento:
      </p>
      <CodeBlock
        language="perl"
        code={`use CGI::Carp qw(fatalsToBrowser warningsToBrowser);

# Agora die / warn vão para o navegador também
warn "valor de x = $x";`}
      />
      <AlertBox type="danger" title="Tire em produção">
        <code>fatalsToBrowser</code> vaza paths e variáveis. Use só localmente.
      </AlertBox>

      <h2>Módulo CGI está deprecated — alternativas</h2>
      <p>
        O módulo <code>CGI.pm</code> não vem mais no Perl 5.22+. Para coisa nova, prefira:
      </p>
      <ul>
        <li>
          <strong>Mojolicious</strong> — framework moderno com servidor próprio (Hypnotoad).
        </li>
        <li>
          <strong>Dancer2</strong> — minimalista, fácil de aprender.
        </li>
        <li>
          <strong>Plack/PSGI</strong> — equivalente ao WSGI/Rack do Python/Ruby. Plug em qualquer
          servidor.
        </li>
      </ul>

      <h2>Receita: relatório SQL → HTML</h2>
      <CodeBlock
        title="cgi-bin/relatorio.pl"
        language="perl"
        code={`#!C:/xampp/perl/bin/perl.exe
use strict;
use warnings;
use DBI;
use CGI qw(:standard);

print header(-charset => 'UTF-8');
print start_html('Relatório');
print h1('Top 10 produtos');

my $dbh = DBI->connect('DBI:mysql:database=loja;host=127.0.0.1','app','pwd');
my $sth = $dbh->prepare('SELECT nome, preco FROM produtos ORDER BY vendas DESC LIMIT 10');
$sth->execute;

print start_table({-border=>1});
print Tr(th(['Produto','Preço']));
while (my @row = $sth->fetchrow_array) {
    print Tr(td(\\@row));
}
print end_table;
print end_html;
$dbh->disconnect;`}
      />

      <h2>Quando NÃO usar Perl + CGI</h2>
      <ul>
        <li>Site novo de alta carga — vá de PHP, Node, Go.</li>
        <li>Equipe sem experiência em Perl — leitura é difícil pra quem nunca viu.</li>
        <li>Stack que precisa de tipos rígidos — vá de TypeScript/Rust.</li>
      </ul>

      <h2>Quando ainda faz sentido</h2>
      <ul>
        <li>Manutenção de sistema legado (sysadmin scripts, intranet antiga).</li>
        <li>Bioinformática (BioPerl, BLAST wrappers).</li>
        <li>Ferramentas de relatórios estáticos (AWStats — escrito em Perl).</li>
        <li>Quando a regex é o problema — Perl ainda é referência aqui.</li>
      </ul>
    </PageContainer>
  );
}
