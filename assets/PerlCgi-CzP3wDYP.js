import{j as e}from"./index-BreI0dyu.js";import{P as i,A as a}from"./AlertBox-C_bJKc46.js";import{C as r}from"./CodeBlock-D0rWxPIU.js";import{P as o}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function c(){return e.jsxs(i,{title:"Perl + CGI no XAMPP — o 'P' esquecido",subtitle:"Sim, o XAMPP traz Perl. Como ativar mod_perl ou rodar via CGI clássico, escrever scripts .pl e .cgi, e quando ainda faz sentido em 2026.",difficulty:"intermediario",timeToRead:"9 min",children:[e.jsx(a,{type:"info",title:"Quem usa Perl hoje?",children:"Sysadmins (regex absurda em logs), bioinformática, ferramentas legadas (RT, Bugzilla, AWStats), automação de DBA. No XAMPP, Perl está lá pronto pra estes casos."}),e.jsx("h2",{children:"Verificando o Perl do XAMPP"}),e.jsx(r,{language:"bash",code:`# Windows
C:/xampp/perl/bin/perl.exe -v
# This is perl 5, version 32, ...

# Linux
/opt/lampp/bin/perl -v

# Adicione ao PATH para chamar 'perl' direto
$env:Path = "C:\\xampp\\perl\\bin;$env:Path"`}),e.jsx("h2",{children:"CGI clássico — script no cgi-bin"}),e.jsxs("p",{children:["Toda instalação XAMPP define ",e.jsx("code",{children:"htdocs/cgi-bin/"})," com ",e.jsx("code",{children:"ScriptAlias"}),":"]}),e.jsx(r,{title:"httpd.conf — já vem assim",language:"apache",code:`ScriptAlias /cgi-bin/ "C:/xampp/cgi-bin/"

<Directory "C:/xampp/cgi-bin">
    AllowOverride None
    Options None
    Require all granted
</Directory>

# Para qualquer .pl/.cgi em qualquer pasta:
AddHandler cgi-script .cgi .pl
Options +ExecCGI`}),e.jsx(r,{title:"C:/xampp/cgi-bin/hello.pl",language:"perl",code:`#!C:/xampp/perl/bin/perl.exe
# (Linux: #!/opt/lampp/bin/perl)

use strict;
use warnings;

print "Content-Type: text/html; charset=UTF-8\\n\\n";

print "<h1>Olá do Perl!</h1>";
print "<p>Hora atual: " . localtime() . "</p>";
print "<p>QUERY_STRING: $ENV{QUERY_STRING}</p>";`}),e.jsxs("p",{children:["Acesse ",e.jsx("code",{children:"http://localhost/cgi-bin/hello.pl?nome=Maria"}),". Em Linux, dê",e.jsx("code",{children:"chmod +x"}),"."]}),e.jsxs(a,{type:"warning",title:"A primeira linha precisa estar EXATA",children:["O caminho do ",e.jsx("strong",{children:"shebang"})," (",e.jsx("code",{children:"#!perl.exe"}),") deve apontar para o binário correto. Em Windows o Apache usa essa linha como pista; se o caminho estiver errado, vem 500 puro."]}),e.jsx("h2",{children:"Lendo parâmetros — módulo CGI"}),e.jsx(r,{title:"cgi-bin/form.pl",language:"perl",code:`#!C:/xampp/perl/bin/perl.exe
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
print $cgi->end_html;`}),e.jsx("h2",{children:"POST com upload"}),e.jsx(r,{language:"perl",code:`use CGI;

my $cgi = CGI->new;
my $upload = $cgi->upload('arquivo');

if ($upload) {
    open(my $fh, '>', "C:/xampp/htdocs/uploads/" . $cgi->param('arquivo')) or die $!;
    binmode $fh;
    while (read($upload, my $buf, 1024)) { print $fh $buf; }
    close $fh;
    print "OK\\n";
}`}),e.jsx("h2",{children:"Conectando no MariaDB"}),e.jsx(r,{language:"perl",code:`use DBI;

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
$dbh->disconnect;`}),e.jsx("h2",{children:"mod_perl — performance"}),e.jsxs("p",{children:["CGI gera 1 processo Perl por request (caro). ",e.jsx("code",{children:"mod_perl"})," embute o interpretador no Apache, mantém em memória e dá ganhos enormes. No XAMPP costuma vir desabilitado:"]}),e.jsx(r,{title:"httpd.conf",language:"apache",code:`# Apenas Linux/macOS — XAMPP Windows não embarca mod_perl
LoadModule perl_module modules/mod_perl.so

<Location /perl>
    SetHandler perl-script
    PerlResponseHandler ModPerl::Registry
    Options +ExecCGI
    PerlOptions +ParseHeaders
</Location>`}),e.jsx("h2",{children:"Variáveis de ambiente CGI"}),e.jsx(o,{title:"Mais úteis",params:[{flag:"$ENV{REQUEST_METHOD}",desc:"GET / POST / PUT..."},{flag:"$ENV{QUERY_STRING}",desc:"String depois do '?'."},{flag:"$ENV{REMOTE_ADDR}",desc:"IP do cliente."},{flag:"$ENV{HTTP_USER_AGENT}",desc:"Navegador."},{flag:"$ENV{HTTP_COOKIE}",desc:"Cookies."},{flag:"$ENV{CONTENT_LENGTH}",desc:"Tamanho do corpo POST."},{flag:"$ENV{REQUEST_URI}",desc:"URL completa do request."},{flag:"$ENV{SCRIPT_NAME}",desc:"Caminho do script."}]}),e.jsx("h2",{children:"Erros do Perl no Apache"}),e.jsxs("p",{children:["Erros vão para o ",e.jsx("strong",{children:"error.log"})," do Apache (não para o navegador). Para ver rápido durante desenvolvimento:"]}),e.jsx(r,{language:"perl",code:`use CGI::Carp qw(fatalsToBrowser warningsToBrowser);

# Agora die / warn vão para o navegador também
warn "valor de x = $x";`}),e.jsxs(a,{type:"danger",title:"Tire em produção",children:[e.jsx("code",{children:"fatalsToBrowser"})," vaza paths e variáveis. Use só localmente."]}),e.jsx("h2",{children:"Módulo CGI está deprecated — alternativas"}),e.jsxs("p",{children:["O módulo ",e.jsx("code",{children:"CGI.pm"})," não vem mais no Perl 5.22+. Para coisa nova, prefira:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Mojolicious"})," — framework moderno com servidor próprio (Hypnotoad)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Dancer2"})," — minimalista, fácil de aprender."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Plack/PSGI"})," — equivalente ao WSGI/Rack do Python/Ruby. Plug em qualquer servidor."]})]}),e.jsx("h2",{children:"Receita: relatório SQL → HTML"}),e.jsx(r,{title:"cgi-bin/relatorio.pl",language:"perl",code:`#!C:/xampp/perl/bin/perl.exe
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
$dbh->disconnect;`}),e.jsx("h2",{children:"Quando NÃO usar Perl + CGI"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Site novo de alta carga — vá de PHP, Node, Go."}),e.jsx("li",{children:"Equipe sem experiência em Perl — leitura é difícil pra quem nunca viu."}),e.jsx("li",{children:"Stack que precisa de tipos rígidos — vá de TypeScript/Rust."})]}),e.jsx("h2",{children:"Quando ainda faz sentido"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Manutenção de sistema legado (sysadmin scripts, intranet antiga)."}),e.jsx("li",{children:"Bioinformática (BioPerl, BLAST wrappers)."}),e.jsx("li",{children:"Ferramentas de relatórios estáticos (AWStats — escrito em Perl)."}),e.jsx("li",{children:"Quando a regex é o problema — Perl ainda é referência aqui."})]})]})}export{c as default};
