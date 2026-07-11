import{j as e}from"./index-BreI0dyu.js";import{P as r,A as o}from"./AlertBox-C_bJKc46.js";import{C as a}from"./CodeBlock-D0rWxPIU.js";import{P as s}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function l(){return e.jsxs(r,{title:"httpd.conf — coração do Apache",subtitle:"O arquivo principal de configuração do Apache 2.4 dentro do XAMPP, das diretivas básicas aos blocos de seção, escopo, includes e MPM.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsxs(o,{type:"info",title:"Pré-requisitos",children:["XAMPP instalado, capítulo de ",e.jsx("a",{href:"#/estrutura-pastas",children:"pastas"})," ","lido. Saber abrir e editar arquivos de texto puro (Notepad++, VS Code, Sublime — não use Bloco de Notas padrão do Windows porque ele bagunça as quebras de linha em alguns casos)."]}),e.jsx("h2",{children:"Glossário rápido"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Diretiva"})," — uma linha de instrução do Apache, no formato ",e.jsx("code",{children:"Nome valor"})," (ou ",e.jsx("code",{children:"Nome arg1 arg2"}),"). O Apache 2.4 tem mais de 700 diretivas espalhadas em mais de 100 módulos."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Bloco / seção / contêiner"})," — agrupamento delimitado por tags em formato XML, como ",e.jsx("code",{children:"<Directory>…</Directory>"})," ","ou ",e.jsx("code",{children:"<VirtualHost>…</VirtualHost>"}),". Diretivas dentro do bloco só valem para o escopo dele."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Escopo"})," — onde uma diretiva tem efeito: servidor todo, um virtual host, um diretório, um arquivo. Cada diretiva da documentação oficial tem uma seção ",e.jsx("em",{children:"Context"})," dizendo onde pode aparecer."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"MPM (Multi-Processing Module)"})," — módulo que define como o Apache lida com requisições simultâneas: cria processos (",e.jsx("code",{children:"prefork"}),"), threads (",e.jsx("code",{children:"worker"}),") ou um misto assíncrono (",e.jsx("code",{children:"event"}),"). No XAMPP para Windows o MPM é o"," ",e.jsx("code",{children:"winnt"})," (próprio do Windows). No Linux costuma ser"," ",e.jsx("code",{children:"event"}),"."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"DSO (Dynamic Shared Object)"})," — módulo carregado em tempo de execução via ",e.jsx("code",{children:"LoadModule"}),". É como o Apache do XAMPP é compilado: kernel pequeno + dezenas de ",e.jsx("code",{children:".so"}),"/",e.jsx("code",{children:".dll"})," opcionais."]}),e.jsx("h2",{children:"Onde fica e como o Apache lê"}),e.jsxs("p",{children:["O arquivo principal é ",e.jsx("code",{children:"apache/conf/httpd.conf"}),". Ao iniciar, o Apache lê esse arquivo de cima para baixo, processando cada linha:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Linhas iniciadas por ",e.jsx("code",{children:"#"})," são comentários — ignoradas."]}),e.jsxs("li",{children:["Diretivas são ",e.jsx("strong",{children:"case-insensitive"})," (",e.jsx("code",{children:"ServerName"})," = ",e.jsx("code",{children:"servername"}),"), mas argumentos podem ser case-sensitive (caminhos de arquivo no Linux são)."]}),e.jsxs("li",{children:["Uma diretiva por linha. Para quebrar em várias linhas, use ",e.jsx("code",{children:"\\"})," no fim da linha."]}),e.jsx("li",{children:"Espaços em branco ao redor são ignorados."}),e.jsxs("li",{children:["Argumentos com espaço precisam vir entre aspas duplas: ",e.jsx("code",{children:'"C:/xampp/htdocs"'}),"."]})]}),e.jsxs(o,{type:"info",title:"Includes — modularize sua configuração",children:["Em vez de um ",e.jsx("code",{children:"httpd.conf"})," gigante, o XAMPP separa em vários arquivos dentro de ",e.jsx("code",{children:"conf/extra/"})," e os puxa via"," ",e.jsx("code",{children:"Include"}),". Você também pode criar os seus:",e.jsx(a,{language:"apache",code:`# Inclui um arquivo específico
Include conf/extra/httpd-vhosts.conf

# Inclui TODOS os .conf da pasta (wildcard)
IncludeOptional conf/projetos/*.conf`})]}),e.jsxs(o,{type:"warning",title:"Antes de editar — faça backup",children:["Sempre copie o ",e.jsx("code",{children:"httpd.conf"})," para"," ",e.jsx("code",{children:"httpd.conf.bak"})," antes de mexer. Um caractere errado e o Apache não inicia mais. Tendo o backup, é só restaurar."]}),e.jsx("h2",{children:"As diretivas mais importantes"}),e.jsx(s,{title:"Diretivas que você vai mexer com frequência",params:[{flag:"ServerRoot",desc:"Pasta onde o Apache foi instalado. Todos os caminhos relativos no httpd.conf são relativos a esta.",exemplo:'ServerRoot "C:/xampp/apache"'},{flag:"Listen 80",desc:"Em qual porta (e opcionalmente IP) o Apache escuta. Pode aparecer várias vezes para escutar em múltiplas portas.",exemplo:`Listen 80
Listen 443`},{flag:"ServerName",desc:"Nome canônico que o servidor usa para se identificar em redirects. Padrão localhost.",exemplo:"ServerName localhost:80"},{flag:"ServerAdmin",desc:"Email exibido em páginas de erro padrão. Em produção, um endereço real.",exemplo:"ServerAdmin admin@meusite.com"},{flag:"DocumentRoot",desc:"Pasta raiz do site servido em http://localhost/. Padrão aponta para htdocs.",exemplo:'DocumentRoot "C:/xampp/htdocs"'},{flag:"<Directory>",desc:"Bloco de regras para uma pasta específica (Allow/Deny, Options, AllowOverride).",exemplo:'<Directory "C:/xampp/htdocs">'},{flag:"DirectoryIndex",desc:"Quais arquivos servir quando o cliente pede só uma pasta (sem nome de arquivo).",exemplo:"DirectoryIndex index.php index.html"},{flag:"LoadModule",desc:"Carrega um módulo DSO. Para ativar mod_rewrite, descomente a linha respectiva.",exemplo:"LoadModule rewrite_module modules/mod_rewrite.so"},{flag:"AllowOverride",desc:"Define o que o .htaccess pode sobrescrever na pasta. None ignora .htaccess; All libera tudo.",exemplo:"AllowOverride All"},{flag:"ErrorLog / CustomLog",desc:"Caminho dos arquivos de log. CustomLog precisa de um LogFormat.",exemplo:'ErrorLog "logs/error.log"'},{flag:"LogLevel",desc:"Quanto detalhe vai para o error.log. warn é o padrão; debug ou trace para investigar problemas.",exemplo:"LogLevel warn"},{flag:"Timeout",desc:"Segundos que o Apache aguarda em operações de rede. Padrão 60 — em geral está bom.",exemplo:"Timeout 60"},{flag:"KeepAlive",desc:"Permite ao cliente reutilizar a mesma conexão TCP para várias requisições. On é o recomendado.",exemplo:"KeepAlive On"},{flag:"ServerTokens / ServerSignature",desc:"Define o quanto o Apache se identifica. Em produção: Prod e Off.",exemplo:`ServerTokens Prod
ServerSignature Off`},{flag:"Include",desc:"Importa outro arquivo de configuração. Use para separar virtual hosts, SSL, etc.",exemplo:"Include conf/extra/httpd-vhosts.conf"}]}),e.jsx("h2",{children:"Tipos de blocos (configuration sections)"}),e.jsxs("p",{children:["Diretivas podem estar no escopo principal (valem para o servidor todo) ou dentro de um bloco. O Apache 2.4 oferece vários tipos de bloco. Cada um filtra ",e.jsx("em",{children:"quando"})," as diretivas internas se aplicam:"]}),e.jsx(s,{title:"Blocos de configuração mais usados",params:[{flag:"<VirtualHost>",desc:"Diretivas valem só para um host virtual específico (combinação de IP + porta + ServerName)."},{flag:"<Directory>",desc:"Aplica-se aos arquivos dentro do caminho de sistema de arquivos especificado."},{flag:"<DirectoryMatch>",desc:"Igual ao Directory, mas com regex. Útil para padrões como /home/(.*)/public."},{flag:"<Files>",desc:"Aplica-se a arquivos pelo nome (sem caminho). Use para proteger .env, .git, etc."},{flag:"<FilesMatch>",desc:"Files com regex."},{flag:"<Location>",desc:"Aplica-se com base na URL pedida pelo cliente, NÃO pelo caminho do arquivo. Para coisas que não existem em disco (status, info)."},{flag:"<LocationMatch>",desc:"Location com regex."},{flag:"<If> / <Else> / <ElseIf>",desc:"Condicional baseada em expressões: se tal header existe, se IP do cliente é tal, etc. (Apache 2.4+)."},{flag:"<IfModule>",desc:"Só executa as diretivas internas se o módulo X estiver carregado. Útil para .htaccess portáveis."},{flag:"<IfDefine>",desc:"Só executa se uma define foi passada na inicialização (httpd -DEnableSSL)."},{flag:"<Limit> / <LimitExcept>",desc:"Restringe diretivas a métodos HTTP específicos (GET, POST, DELETE...)."}]}),e.jsxs(o,{type:"warning",title:"Ordem de processamento (importante!)",children:["O Apache não aplica as seções na ordem em que aparecem no arquivo — ele aplica em ordem específica:",e.jsxs("ol",{className:"list-decimal pl-6 mt-2 space-y-1 text-sm",children:[e.jsxs("li",{children:[e.jsx("code",{children:"<Directory>"})," (sem regex) e ",e.jsx("code",{children:".htaccess"})," — do menos específico (raiz) ao mais específico (pasta interna)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"<DirectoryMatch>"})," e ",e.jsx("code",{children:"<Directory ~>"})," com regex."]}),e.jsxs("li",{children:[e.jsx("code",{children:"<Files>"})," e ",e.jsx("code",{children:"<FilesMatch>"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"<Location>"})," e ",e.jsx("code",{children:"<LocationMatch>"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"<If>"}),"."]})]}),"Quando há conflito, a diretiva da seção processada mais tarde vence."]}),e.jsx("h2",{children:"Bloco <Directory> explicado linha por linha"}),e.jsx("p",{children:"Esse é o bloco mais comum de erro de configuração. Ele controla o que o Apache permite ou não dentro de uma pasta:"}),e.jsx(a,{language:"apache",code:`<Directory "C:/xampp/htdocs">
    #
    # Options - lista de comportamentos liberados:
    #   Indexes        - se não tiver index.php, lista os arquivos da pasta
    #   FollowSymLinks - segue symlinks (atalhos de pasta)
    #   ExecCGI        - permite execução de scripts CGI
    #   Includes       - permite Server-Side Includes (.shtml)
    #   IncludesNOEXEC - SSI mas sem #exec / #include
    #   MultiViews     - tenta encontrar arquivos parecidos com o pedido
    #   None           - nenhuma das anteriores
    #   All            - todas exceto MultiViews
    #
    # Você pode somar/subtrair: Options +ExecCGI -Indexes
    #
    Options Indexes FollowSymLinks Includes ExecCGI

    #
    # AllowOverride - o que o .htaccess pode sobrescrever:
    #   All        - tudo (mod_rewrite, AuthType, etc.)
    #   None       - nada (Apache nem lê o .htaccess)
    #   AuthConfig - só diretivas de autenticação (AuthType, AuthName, Require)
    #   FileInfo   - só ErrorDocument, AddType, RewriteEngine, etc.
    #   Indexes    - só DirectoryIndex, IndexOptions
    #   Limit      - só Allow/Deny/Require
    #   Options    - só Options (com ou sem lista)
    #
    AllowOverride All

    #
    # Quem pode acessar (Apache 2.4 - sintaxe nova com mod_authz_core):
    #   Require all granted - libera para todos
    #   Require all denied  - bloqueia todos
    #   Require ip 192.168  - só essa rede
    #   Require host example.com - só esse hostname (precisa reverse DNS)
    #   Require user joao   - só usuário autenticado "joao"
    #   Require valid-user  - qualquer usuário autenticado
    #
    Require all granted
</Directory>`}),e.jsxs(o,{type:"warning",title:"AllowOverride None bloqueia .htaccess",children:["Se seu ",e.jsx("code",{children:".htaccess"})," não está funcionando (URLs amigáveis do WordPress quebradas, por exemplo), 90% das vezes é porque"," ",e.jsx("code",{children:"AllowOverride"})," está como ",e.jsx("code",{children:"None"}),". Mude para"," ",e.jsx("code",{children:"All"})," e reinicie o Apache."]}),e.jsx("h2",{children:"Performance — <Directory> vs <Location>"}),e.jsxs("p",{children:["Use ",e.jsx("code",{children:"<Directory>"})," sempre que puder. Ele é resolvido"," ",e.jsx("strong",{children:"em disco"})," (o Apache sabe que ",e.jsx("code",{children:"/var/www/foo"})," ","é uma pasta real) e processado uma vez. ",e.jsx("code",{children:"<Location>"})," ","é resolvido ",e.jsx("strong",{children:"na URL"})," e roda em toda requisição — necessário para handlers virtuais (como ",e.jsx("code",{children:"/server-status"}),"), mas mais caro."]}),e.jsx("h2",{children:"Mudando a pasta raiz (DocumentRoot)"}),e.jsxs("p",{children:["Cansado de trabalhar dentro de ",e.jsx("code",{children:"C:\\xampp\\htdocs"}),"? Você pode apontar o Apache para uma pasta de projetos qualquer:"]}),e.jsx(a,{language:"apache",code:`# Antes:
DocumentRoot "C:/xampp/htdocs"
<Directory "C:/xampp/htdocs">

# Depois (use barras / em todos os caminhos no httpd.conf):
DocumentRoot "D:/Projetos/web"
<Directory "D:/Projetos/web">
    Options Indexes FollowSymLinks Includes ExecCGI
    AllowOverride All
    Require all granted
</Directory>`}),e.jsxs(o,{type:"info",title:"Use sempre / nas barras",children:["Mesmo no Windows, dentro do ",e.jsx("code",{children:"httpd.conf"})," você usa barras normais (",e.jsx("code",{children:"/"}),"), não barras invertidas. Apache tem origem Unix."]}),e.jsx("h2",{children:"Variáveis de ambiente e expressões"}),e.jsxs("p",{children:["Algumas diretivas aceitam variáveis (do request, do ambiente, de macros). Sintaxe: ",e.jsx("code",{children:"%{NOME}"})," em RewriteCond / SetEnvIf, ou ",e.jsx("code",{children:"${NOME}"})," em diretivas comuns."]}),e.jsx(a,{language:"apache",code:`# Bloquear uma rede inteira via expressão
<If "%{REMOTE_ADDR} =~ /^192\\.168\\.0\\./">
    Require all denied
</If>

# Definir variável de ambiente para o PHP receber
SetEnv APP_ENV "development"

# Carregar valor de uma variável do SO
Define DOCROOT "/var/www/projetos"
DocumentRoot "\${DOCROOT}/blog"`}),e.jsx("h2",{children:"Salvou? Reinicie"}),e.jsxs("p",{children:["Toda mudança no ",e.jsx("code",{children:"httpd.conf"})," só vale após reiniciar o Apache (mudanças em ",e.jsx("code",{children:".htaccess"})," são instantâneas):"]}),e.jsx(a,{language:"text",code:`Painel XAMPP → Apache → Stop → Start

# Ou via comando:
# Windows
C:\\xampp\\apache\\bin\\httpd.exe -k restart

# Linux
sudo /opt/lampp/lampp restartapache`}),e.jsx("h2",{children:"Verificando se a sintaxe está correta"}),e.jsx("p",{children:"Antes de reiniciar, sempre teste a sintaxe — assim você não derruba o Apache no meio do dia:"}),e.jsx(a,{language:"bash",code:`# Windows
C:\\xampp\\apache\\bin\\httpd.exe -t

# Linux
/opt/lampp/bin/httpd -t

# Saídas possíveis:
# Syntax OK                       ← tudo certo, pode reiniciar
# Syntax error on line N of ...   ← o N te diz a linha do problema`}),e.jsx("h2",{children:"Diagnóstico rápido"}),e.jsx(s,{title:"Comandos úteis para inspecionar a configuração ativa",params:[{flag:"httpd -t",desc:"Testa sintaxe (não inicia o servidor)."},{flag:"httpd -t -D DUMP_VHOSTS",desc:"Lista os virtual hosts que serão ativados, com origem (arquivo:linha)."},{flag:"httpd -t -D DUMP_MODULES",desc:"Lista todos os módulos carregados (idêntico a httpd -M)."},{flag:"httpd -t -D DUMP_INCLUDES",desc:"Lista todos os arquivos incluídos via Include."},{flag:"httpd -V",desc:"Mostra a versão completa, MPM em uso, e as opções de compilação."},{flag:"httpd -L",desc:"Lista todas as diretivas suportadas pelos módulos carregados, com escopo permitido."}]})]})}export{l as default};
