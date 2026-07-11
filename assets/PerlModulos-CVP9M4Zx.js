import{j as e}from"./index-BreI0dyu.js";import{P as s,A as o}from"./AlertBox-C_bJKc46.js";import{C as a}from"./CodeBlock-D0rWxPIU.js";import{P as l}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function d(){return e.jsxs(s,{title:"CPAN, cpanm e gerenciamento de módulos Perl",subtitle:"Como instalar pacotes (DBD::mysql, JSON, LWP::UserAgent), entender o caminho de busca @INC e usar Carton para fixar versões por projeto.",difficulty:"intermediario",timeToRead:"9 min",children:[e.jsxs(o,{type:"info",title:"CPAN é o npm do Perl",children:["Repositório oficial de módulos. Tem desde I/O básico até ML, scraping, ferramentas de deploy. Acessível por ",e.jsx("code",{children:"cpan"})," (clássico) ou ",e.jsx("code",{children:"cpanm"})," (moderno, mais rápido)."]}),e.jsx("h2",{children:"Onde os módulos vivem"}),e.jsx(a,{language:"bash",code:`# Pastas que o Perl olha (a ordem importa)
perl -e 'print join("\\n", @INC)'

# C:/xampp/perl/site/lib    ← módulos instalados via cpan
# C:/xampp/perl/vendor/lib  ← embarcados pela distribuição
# C:/xampp/perl/lib         ← core
# .                         ← pasta atual (Perl < 5.26)`}),e.jsx("h2",{children:"cpan — instalação clássica"}),e.jsx(a,{title:"Modo interativo (primeira vez configura)",language:"bash",code:`cpan
# cpan> install DBD::mysql
# cpan> install JSON::PP
# cpan> upgrade
# cpan> q`}),e.jsx(a,{title:"Modo direto",language:"bash",code:`cpan install DBD::mysql
cpan install LWP::UserAgent JSON Try::Tiny

# Ver instalados
cpan -l
cpan -L`}),e.jsx("h2",{children:"cpanm — recomendado"}),e.jsx(a,{language:"bash",code:`# Instalar o cpanm primeiro
cpan App::cpanminus

# Agora muito mais rápido e silencioso
cpanm Mojolicious
cpanm DBD::mysql JSON LWP::UserAgent

# Versão específica
cpanm Mojolicious@9.30

# Sem testes (mais rápido em CI)
cpanm --notest Try::Tiny

# Em pasta local (não toca em /usr)
cpanm -L extlib Mojolicious`}),e.jsx("h2",{children:"Verificando se um módulo está instalado"}),e.jsx(a,{language:"bash",code:`# Tenta carregar — silêncio = ok
perl -MJSON -e 'print $JSON::VERSION'

# Forma rápida
perl -MJSON -e 1 && echo "OK" || echo "FALTANDO"

# Documentação local
perldoc JSON
perldoc -m JSON     # ver fonte`}),e.jsx("h2",{children:"Módulos essenciais"}),e.jsx(l,{title:"O kit de sobrevivência",params:[{flag:"DBI + DBD::mysql",desc:"Conexão com MariaDB/MySQL."},{flag:"DBD::SQLite",desc:"SQLite embutido — banco em arquivo."},{flag:"JSON / JSON::XS",desc:"Serializar/parsear JSON. XS é em C, mais rápido."},{flag:"LWP::UserAgent",desc:"HTTP cliente. Equivalente a curl/requests."},{flag:"HTTP::Tiny",desc:"Cliente HTTP minimal, sem dependências XS."},{flag:"Try::Tiny",desc:"Try/catch idiomático (eval bruto é confuso)."},{flag:"Path::Tiny",desc:"Manipulação de arquivos/dirs com API limpa."},{flag:"DateTime",desc:"Datas com timezone, aritmética, parsing."},{flag:"Mojolicious",desc:"Framework web full-stack moderno."},{flag:"Plack",desc:"PSGI — interface entre app e servidor."},{flag:"Test::More",desc:"Testes unitários core do Perl."}]}),e.jsx("h2",{children:"Instalando módulo C (XS) com dependências nativas"}),e.jsxs("p",{children:[e.jsx("code",{children:"DBD::mysql"}),", por exemplo, precisa do header da libmysqlclient. Em Linux:"]}),e.jsx(a,{language:"bash",code:`# Debian/Ubuntu
sudo apt install libmariadb-dev gcc make
cpanm DBD::mysql

# Fedora/Rocky
sudo dnf install mariadb-devel gcc make
cpanm DBD::mysql`}),e.jsxs("p",{children:["No Windows com XAMPP, geralmente o ",e.jsx("code",{children:"DBD::mysql"}),' já vem incluído. Se faltar, baixe o "PPM" pré-compilado ou use ',e.jsx("code",{children:"DBD::MariaDB"})," alternativo."]}),e.jsx("h2",{children:"Carton — Bundler do Perl"}),e.jsxs("p",{children:["Fixa versões por projeto, igual a ",e.jsx("code",{children:"composer.lock"})," ou ",e.jsx("code",{children:"package-lock.json"}),"."]}),e.jsx(a,{language:"bash",code:`cpanm Carton

# Em projeto novo
cd meu-app
cat > cpanfile <<EOF
requires 'Mojolicious', '== 9.34';
requires 'DBD::SQLite';
requires 'JSON::XS';
EOF

# Instala em ./local e gera cpanfile.snapshot
carton install

# Rodar app dentro do contexto
carton exec perl app.pl

# Em outra máquina, replica exatamente
carton install --deployment`}),e.jsx("h2",{children:"local::lib — pasta de módulos por usuário"}),e.jsx(a,{language:"bash",code:`# Sem precisar de root, instale tudo em ~/perl5
cpanm --local-lib=~/perl5 local::lib
eval "$(perl -I ~/perl5/lib/perl5 -Mlocal::lib=~/perl5)"

# Adicione ao .bashrc
echo 'eval "$(perl -I ~/perl5/lib/perl5 -Mlocal::lib=~/perl5)"' >> ~/.bashrc

cpanm Mojolicious   # instala no ~/perl5, sem root`}),e.jsx("h2",{children:"Atualizações e remoções"}),e.jsx(a,{language:"bash",code:`# Listar desatualizados
cpan-outdated -p | cpanm   # tudo de uma vez

# Atualizar um
cpanm -U JSON   # tenta desinstalar (limitado, Perl não desinstala bem)

# Forçar reinstalação
cpanm --reinstall DBD::mysql`}),e.jsx("h2",{children:"Erros comuns na instalação"}),e.jsx(l,{title:"Sintomas e soluções",params:[{flag:"Can't locate Foo.pm in @INC",desc:"Módulo não instalado. cpanm Foo."},{flag:"Tests fail (lib X needed)",desc:"Faltou pacote do sistema (apt/dnf). Instale e rode de novo."},{flag:"make: Command not found",desc:"Faltou compilador. apt install build-essential."},{flag:"Permission denied",desc:"Tentando escrever em /usr. Use --local-lib ou rode como root."},{flag:"Can't connect to cpan.org",desc:"Configure proxy: export http_proxy=... ou edite ~/.cpanm/build.log."}]}),e.jsx("h2",{children:"Distribuindo seu próprio módulo"}),e.jsx(a,{language:"bash",code:`# Esqueleto
cpanm Module::Starter
module-starter --module=Loja::Util --author="Eu" --email=eu@x.com

# Pasta gerada:
# Loja-Util/
#   lib/Loja/Util.pm
#   t/00-load.t
#   Makefile.PL
#   README

cd Loja-Util
perl Makefile.PL
make
make test
make dist          # gera tarball Loja-Util-0.01.tar.gz`}),e.jsx("h2",{children:"Configurando o cpan (atalhos)"}),e.jsx(a,{title:"~/.cpan/CPAN/MyConfig.pm — opcional",language:"perl",code:`$CPAN::Config = {
    'urllist' => ['https://cpan.metacpan.org/'],
    'inactivity_timeout' => 0,
    'use_sqlite' => q[1],
    'prerequisites_policy' => q[follow],
    'build_requires_install_policy' => q[yes],
};
1;`}),e.jsx("h2",{children:"Documentação local — perldoc"}),e.jsx(a,{language:"bash",code:`perldoc DBI               # docs do módulo
perldoc -f sprintf        # função built-in
perldoc -v '$_'           # variável especial
perldoc perlrun           # docs do interpretador (perlrun, perlsyn, etc.)`}),e.jsxs(o,{type:"warning",title:"Não misture cpan global e cpanm local",children:["Misturar instalações de root (",e.jsx("code",{children:"cpan"})," com sudo) e local (",e.jsx("code",{children:"cpanm -L"}),') gera @INC confuso e erros do tipo "tem 2 versões de Foo.pm". Escolha uma estratégia por projeto.']}),e.jsx("h2",{children:"Armadilhas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Esquecer ",e.jsx("code",{children:"use strict; use warnings;"})," no topo do script — Perl deixa qualquer coisa passar."]}),e.jsxs("li",{children:["Caminho do XAMPP em ",e.jsx("code",{children:"@INC"})," diferente do que o cpanm instalou — uso indevido de outro Perl no PATH."]}),e.jsxs("li",{children:["Atualizar módulo crítico em produção sem testar — Perl não tem semantic versioning forte. Trave em ",e.jsx("code",{children:"cpanfile.snapshot"}),"."]})]})]})}export{d as default};
