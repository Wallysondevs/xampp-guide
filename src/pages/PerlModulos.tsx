import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function PerlModulos() {
  return (
    <PageContainer
      title="CPAN, cpanm e gerenciamento de módulos Perl"
      subtitle="Como instalar pacotes (DBD::mysql, JSON, LWP::UserAgent), entender o caminho de busca @INC e usar Carton para fixar versões por projeto."
      difficulty="intermediario"
      timeToRead="9 min"
    >
      <AlertBox type="info" title="CPAN é o npm do Perl">
        Repositório oficial de módulos. Tem desde I/O básico até ML, scraping, ferramentas de
        deploy. Acessível por <code>cpan</code> (clássico) ou <code>cpanm</code> (moderno, mais
        rápido).
      </AlertBox>

      <h2>Onde os módulos vivem</h2>
      <CodeBlock
        language="bash"
        code={`# Pastas que o Perl olha (a ordem importa)
perl -e 'print join("\\n", @INC)'

# C:/xampp/perl/site/lib    ← módulos instalados via cpan
# C:/xampp/perl/vendor/lib  ← embarcados pela distribuição
# C:/xampp/perl/lib         ← core
# .                         ← pasta atual (Perl < 5.26)`}
      />

      <h2>cpan — instalação clássica</h2>
      <CodeBlock
        title="Modo interativo (primeira vez configura)"
        language="bash"
        code={`cpan
# cpan> install DBD::mysql
# cpan> install JSON::PP
# cpan> upgrade
# cpan> q`}
      />
      <CodeBlock
        title="Modo direto"
        language="bash"
        code={`cpan install DBD::mysql
cpan install LWP::UserAgent JSON Try::Tiny

# Ver instalados
cpan -l
cpan -L`}
      />

      <h2>cpanm — recomendado</h2>
      <CodeBlock
        language="bash"
        code={`# Instalar o cpanm primeiro
cpan App::cpanminus

# Agora muito mais rápido e silencioso
cpanm Mojolicious
cpanm DBD::mysql JSON LWP::UserAgent

# Versão específica
cpanm Mojolicious@9.30

# Sem testes (mais rápido em CI)
cpanm --notest Try::Tiny

# Em pasta local (não toca em /usr)
cpanm -L extlib Mojolicious`}
      />

      <h2>Verificando se um módulo está instalado</h2>
      <CodeBlock
        language="bash"
        code={`# Tenta carregar — silêncio = ok
perl -MJSON -e 'print $JSON::VERSION'

# Forma rápida
perl -MJSON -e 1 && echo "OK" || echo "FALTANDO"

# Documentação local
perldoc JSON
perldoc -m JSON     # ver fonte`}
      />

      <h2>Módulos essenciais</h2>
      <ParamsTable
        title="O kit de sobrevivência"
        params={[
          { flag: "DBI + DBD::mysql", desc: "Conexão com MariaDB/MySQL." },
          { flag: "DBD::SQLite", desc: "SQLite embutido — banco em arquivo." },
          { flag: "JSON / JSON::XS", desc: "Serializar/parsear JSON. XS é em C, mais rápido." },
          { flag: "LWP::UserAgent", desc: "HTTP cliente. Equivalente a curl/requests." },
          { flag: "HTTP::Tiny", desc: "Cliente HTTP minimal, sem dependências XS." },
          { flag: "Try::Tiny", desc: "Try/catch idiomático (eval bruto é confuso)." },
          { flag: "Path::Tiny", desc: "Manipulação de arquivos/dirs com API limpa." },
          { flag: "DateTime", desc: "Datas com timezone, aritmética, parsing." },
          { flag: "Mojolicious", desc: "Framework web full-stack moderno." },
          { flag: "Plack", desc: "PSGI — interface entre app e servidor." },
          { flag: "Test::More", desc: "Testes unitários core do Perl." },
        ]}
      />

      <h2>Instalando módulo C (XS) com dependências nativas</h2>
      <p>
        <code>DBD::mysql</code>, por exemplo, precisa do header da libmysqlclient. Em Linux:
      </p>
      <CodeBlock
        language="bash"
        code={`# Debian/Ubuntu
sudo apt install libmariadb-dev gcc make
cpanm DBD::mysql

# Fedora/Rocky
sudo dnf install mariadb-devel gcc make
cpanm DBD::mysql`}
      />
      <p>
        No Windows com XAMPP, geralmente o <code>DBD::mysql</code> já vem incluído. Se faltar,
        baixe o "PPM" pré-compilado ou use <code>DBD::MariaDB</code> alternativo.
      </p>

      <h2>Carton — Bundler do Perl</h2>
      <p>
        Fixa versões por projeto, igual a <code>composer.lock</code> ou <code>package-lock.json</code>.
      </p>
      <CodeBlock
        language="bash"
        code={`cpanm Carton

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
carton install --deployment`}
      />

      <h2>local::lib — pasta de módulos por usuário</h2>
      <CodeBlock
        language="bash"
        code={`# Sem precisar de root, instale tudo em ~/perl5
cpanm --local-lib=~/perl5 local::lib
eval "$(perl -I ~/perl5/lib/perl5 -Mlocal::lib=~/perl5)"

# Adicione ao .bashrc
echo 'eval "$(perl -I ~/perl5/lib/perl5 -Mlocal::lib=~/perl5)"' >> ~/.bashrc

cpanm Mojolicious   # instala no ~/perl5, sem root`}
      />

      <h2>Atualizações e remoções</h2>
      <CodeBlock
        language="bash"
        code={`# Listar desatualizados
cpan-outdated -p | cpanm   # tudo de uma vez

# Atualizar um
cpanm -U JSON   # tenta desinstalar (limitado, Perl não desinstala bem)

# Forçar reinstalação
cpanm --reinstall DBD::mysql`}
      />

      <h2>Erros comuns na instalação</h2>
      <ParamsTable
        title="Sintomas e soluções"
        params={[
          { flag: "Can't locate Foo.pm in @INC", desc: "Módulo não instalado. cpanm Foo." },
          { flag: "Tests fail (lib X needed)", desc: "Faltou pacote do sistema (apt/dnf). Instale e rode de novo." },
          { flag: "make: Command not found", desc: "Faltou compilador. apt install build-essential." },
          { flag: "Permission denied", desc: "Tentando escrever em /usr. Use --local-lib ou rode como root." },
          { flag: "Can't connect to cpan.org", desc: "Configure proxy: export http_proxy=... ou edite ~/.cpanm/build.log." },
        ]}
      />

      <h2>Distribuindo seu próprio módulo</h2>
      <CodeBlock
        language="bash"
        code={`# Esqueleto
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
make dist          # gera tarball Loja-Util-0.01.tar.gz`}
      />

      <h2>Configurando o cpan (atalhos)</h2>
      <CodeBlock
        title="~/.cpan/CPAN/MyConfig.pm — opcional"
        language="perl"
        code={`$CPAN::Config = {
    'urllist' => ['https://cpan.metacpan.org/'],
    'inactivity_timeout' => 0,
    'use_sqlite' => q[1],
    'prerequisites_policy' => q[follow],
    'build_requires_install_policy' => q[yes],
};
1;`}
      />

      <h2>Documentação local — perldoc</h2>
      <CodeBlock
        language="bash"
        code={`perldoc DBI               # docs do módulo
perldoc -f sprintf        # função built-in
perldoc -v '$_'           # variável especial
perldoc perlrun           # docs do interpretador (perlrun, perlsyn, etc.)`}
      />

      <AlertBox type="warning" title="Não misture cpan global e cpanm local">
        Misturar instalações de root (<code>cpan</code> com sudo) e local (<code>cpanm -L</code>)
        gera @INC confuso e erros do tipo "tem 2 versões de Foo.pm". Escolha uma estratégia por
        projeto.
      </AlertBox>

      <h2>Armadilhas</h2>
      <ul>
        <li>
          Esquecer <code>use strict; use warnings;</code> no topo do script — Perl deixa qualquer
          coisa passar.
        </li>
        <li>
          Caminho do XAMPP em <code>@INC</code> diferente do que o cpanm instalou — uso indevido
          de outro Perl no PATH.
        </li>
        <li>
          Atualizar módulo crítico em produção sem testar — Perl não tem semantic versioning forte.
          Trave em <code>cpanfile.snapshot</code>.
        </li>
      </ul>
    </PageContainer>
  );
}
