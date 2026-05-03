import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function Webalizer() {
  return (
    <PageContainer
      title="Webalizer e AWStats — relatórios estáticos do access.log"
      subtitle="Ferramentas clássicas para gerar relatórios HTML a partir do access.log do Apache. Quando ainda fazem sentido, configuração mínima e alternativas modernas."
      difficulty="iniciante"
      timeToRead="8 min"
    >
      <AlertBox type="info" title="Por que ainda existem?">
        Não dependem de JavaScript no cliente, não vazam dados pra terceiros, processam logs
        offline e produzem HTML estático que aguenta qualquer carga. Para intranet e relatórios
        regulatórios, ainda são úteis.
      </AlertBox>

      <h2>O Webalizer</h2>
      <p>
        Distribuído com o XAMPP Linux/macOS (em Windows você baixa separado). Lê o access.log do
        Apache e produz dashboards mensais com:
      </p>
      <ul>
        <li>Total de visitas, hits, bytes</li>
        <li>Top URLs, top IPs, top User-Agents</li>
        <li>Países (precisa GeoIP)</li>
        <li>Histórico mensal/anual em gráficos PNG</li>
      </ul>

      <h2>Instalação</h2>
      <CodeBlock
        language="bash"
        code={`# Linux (fora do XAMPP)
sudo apt install webalizer        # Debian/Ubuntu
sudo dnf install webalizer         # Fedora/Rocky

# macOS
brew install webalizer

# Windows: baixe http://www.webalizer.org/download.html (port antigo)`}
      />

      <h2>Configuração mínima</h2>
      <CodeBlock
        title="/etc/webalizer/webalizer.conf  (ou C:/Program Files/Webalizer/webalizer.conf)"
        language="ini"
        code={`# Onde está o access.log
LogFile     /opt/lampp/logs/access_log
LogType     clf

# Onde gerar os HTMLs
OutputDir   /opt/lampp/htdocs/webalizer
HistoryName webalizer.hist
ReportTitle Estatísticas — meu site
HostName    meusite.local

# Identifique seu próprio tráfego como "interno"
HideSite    *meusite.local
HideURL     *.gif
HideURL     *.jpg
HideURL     *.png
HideURL     *.css
HideURL     *.js

# Agrupar referers
GroupReferrer http://www.google.   Google
GroupReferrer http://www.bing.     Bing

# Ignorar bots conhecidos
IgnoreAgent  Googlebot
IgnoreAgent  bingbot

# Saída em HTML 5
HTMLPre      <!DOCTYPE html>`}
      />

      <h2>Rodando</h2>
      <CodeBlock
        language="bash"
        code={`# Manual
webalizer -c /etc/webalizer/webalizer.conf

# Saída esperada
# Webalizer V2.23-08 ...
# Using logfile /opt/lampp/logs/access_log
# Records: 14823, ...
# Generating report for May 2026
# Generating summary report

# Acesse
http://localhost/webalizer/`}
      />

      <h2>Automatizando — cron diário</h2>
      <CodeBlock
        title="/etc/cron.d/webalizer"
        language="bash"
        code={`# Toda madrugada às 03:30
30 3 * * * root /usr/bin/webalizer -c /etc/webalizer/webalizer.conf >> /var/log/webalizer.log 2>&1`}
      />
      <CodeBlock
        title="Windows — Agendador de Tarefas"
        language="text"
        code={`Programa: C:\\Program Files\\Webalizer\\webalizer.exe
Argumentos: -c "C:\\Program Files\\Webalizer\\webalizer.conf"
Frequência: diária 03:30`}
      />

      <h2>GeoIP — saber de onde vêm</h2>
      <p>
        O Webalizer usa a base GeoIP da MaxMind. Hoje o GeoLite2 exige cadastro grátis para
        baixar:
      </p>
      <CodeBlock
        language="bash"
        code={`# 1) Cadastre em maxmind.com → baixe GeoLite2-Country.mmdb
# 2) Webalizer 2.23+ usa libGeoIP
sudo cp GeoLite2-Country.mmdb /usr/share/GeoIP/

# webalizer.conf
GeoDB        yes
GeoDBDatabase /usr/share/GeoIP/GeoLite2-Country.mmdb`}
      />

      <h2>AWStats — alternativa mais rica</h2>
      <p>
        Outra ferramenta clássica, escrita em Perl. Vem com painel HTML mais detalhado e suporta
        mais formatos de log.
      </p>
      <CodeBlock
        language="bash"
        code={`# Instalar
sudo apt install awstats

# Cria config para o site
sudo cp /etc/awstats/awstats.conf /etc/awstats/awstats.meusite.conf

# Edite essencial:
# LogFile="/opt/lampp/logs/access_log"
# SiteDomain="meusite.local"
# DirData="/var/lib/awstats"
# DirCgi="/cgi-bin/awstats"
# DirIcons="/icon"

# Atualizar
sudo /usr/lib/cgi-bin/awstats.pl -update -config=meusite

# Acesso via CGI
http://localhost/cgi-bin/awstats.pl?config=meusite`}
      />
      <CodeBlock
        title="httpd.conf — ScriptAlias"
        language="apache"
        code={`Alias /awstats-icon "/usr/share/awstats/icon/"
ScriptAlias /awstats /usr/lib/cgi-bin/awstats.pl

<Directory "/usr/lib/cgi-bin">
    Options +ExecCGI
    Require ip 127.0.0.1
    AuthType Basic
    AuthName "Stats"
    AuthUserFile "/etc/httpd/.htpasswd"
    Require valid-user
</Directory>`}
      />

      <h2>GoAccess — moderna e em tempo real</h2>
      <p>
        Recomendação se você está começando hoje: <strong>GoAccess</strong> é mais rápido, dá
        relatório terminal interativo + HTML auto-atualizando, sem cron.
      </p>
      <CodeBlock
        language="bash"
        code={`# Instalar
sudo apt install goaccess

# Modo terminal interativo
goaccess /opt/lampp/logs/access_log -c

# Gerar HTML estático
goaccess access_log -o report.html --log-format=COMBINED

# Tempo real (atualiza via WebSocket)
goaccess access_log -o /var/www/html/report.html \\
    --log-format=COMBINED --real-time-html`}
      />

      <ParamsTable
        title="Comparativo"
        params={[
          { flag: "Webalizer", desc: "Leve, ultra portátil, gráficos PNG estáticos. Visual datado." },
          { flag: "AWStats", desc: "Mais detalhe (motores de busca, sistemas operacionais), CGI Perl." },
          { flag: "GoAccess", desc: "Moderno, real-time, HTML responsivo, terminal." },
          { flag: "Matomo (ex-Piwik)", desc: "Plataforma completa estilo Google Analytics, self-hosted, exige PHP+MariaDB." },
          { flag: "Plausible / Umami", desc: "Analytics privacy-first, web-based, requer instalação dedicada." },
        ]}
      />

      <h2>Onde Webalizer falha</h2>
      <ul>
        <li>
          Não detecta SPAs (uma "URL" para o usuário pode ser zero requisições novas).
        </li>
        <li>
          Não rastreia eventos (clicks, scroll, conversão).
        </li>
        <li>
          Não mostra duração de sessão real.
        </li>
        <li>
          Bots/crawlers inflam números — exige <code>IgnoreAgent</code> bem mantido.
        </li>
      </ul>

      <h2>Receita: dashboard semanal por email</h2>
      <CodeBlock
        title="Linux"
        language="bash"
        code={`# /usr/local/bin/relatorio-semanal.sh
webalizer -c /etc/webalizer/webalizer.conf

cd /opt/lampp/htdocs/webalizer
zip -qr /tmp/stats.zip .
echo "Relatório anexo." | mail -s "Stats $(date +%V)" \\
    -a /tmp/stats.zip dono@empresa.com

# Cron: 0 8 * * 1   /usr/local/bin/relatorio-semanal.sh`}
      />

      <AlertBox type="warning" title="Proteja /webalizer">
        A pasta gerada contém URLs internas, IPs visitantes, padrões de tráfego. Restrinja por{" "}
        <code>Require ip</code> ou <code>AuthBasic</code> — capítulo Apache Auth.
      </AlertBox>

      <h2>Armadilhas</h2>
      <ul>
        <li>
          Apontar <code>LogFile</code> para um access.log já rotacionado (vazio) — relatório fica
          em branco.
        </li>
        <li>
          Esquecer <code>HideURL *.png</code> — assets inflam contagem de "páginas".
        </li>
        <li>
          Não atualizar lista de bots — meses depois, 80% das "visitas" é AhrefsBot.
        </li>
        <li>
          GeoIP desatualizado — IPs novos saem como "Unknown".
        </li>
      </ul>
    </PageContainer>
  );
}
