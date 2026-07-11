import{j as e}from"./index-BreI0dyu.js";import{P as s,A as a}from"./AlertBox-C_bJKc46.js";import{C as o}from"./CodeBlock-D0rWxPIU.js";import{P as r}from"./ParamsTable-DyRs6_CQ.js";import{P as i}from"./PracticeBox-BV05Hsfh.js";import"./circle-alert-_acnmM4q.js";function m(){return e.jsxs(s,{title:"Virtual Hosts — vários sites em um só XAMPP",subtitle:"Em vez de http://localhost/projeto1 e http://localhost/projeto2, tenha http://projeto1.local e http://projeto2.local — com guia completo: name-based, IP-based, port-based, default vhost, mass virtual hosting e debug.",difficulty:"intermediario",timeToRead:"14 min",children:[e.jsxs(a,{type:"info",title:"Pré-requisitos",children:["Capítulos de ",e.jsx("a",{href:"#/apache-config",children:"httpd.conf"})," e"," ",e.jsx("a",{href:"#/estrutura-pastas",children:"pastas"})," lidos. Saber editar o arquivo hosts do sistema (precisa de privilégio de administrador)."]}),e.jsx("h2",{children:"Glossário rápido"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Virtual Host (VHost)"}),' — entrada de configuração que diz ao Apache: "quando alguém acessar tal nome de domínio (ou IP, ou porta), sirva os arquivos de tal pasta com tais regras". Permite um único Apache hospedar dezenas de sites independentes.']}),e.jsxs("p",{children:[e.jsx("strong",{children:"Name-based"})," — virtual host distinguido pelo nome (header ",e.jsx("code",{children:"Host:"})," que o navegador envia). Mais comum, permite vários sites no ",e.jsx("strong",{children:"mesmo IP"}),". Padrão da web moderna."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"IP-based"})," — virtual host distinguido pelo IP. Cada site precisa de um IP próprio. Hoje raro (caro, escasso); só vale a pena para certificados SSL antigos sem SNI."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Port-based"})," — variação onde o que muda é a porta (",e.jsx("code",{children:":8080"}),", ",e.jsx("code",{children:":8081"}),"). Útil para rodar API e site em portas diferentes do mesmo Apache."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"SNI (Server Name Indication)"})," — extensão do TLS que permite múltiplos sites HTTPS no mesmo IP. Sem SNI, era preciso um IP para cada cert HTTPS. Suportado desde 2007 — quase tudo hoje funciona com SNI."]}),e.jsx("h2",{children:"Por que existem?"}),e.jsxs("p",{children:["Todo site na internet precisa de um IP. IPs são caros e finitos (IPv4 tem só 4,2 bilhões). Com virtual hosts name-based, um único servidor (com um único IP) consegue hospedar centenas de sites diferentes — basta o navegador enviar o header ",e.jsx("code",{children:"Host:"})," e o Apache decidir qual VHost responde."]}),e.jsx(o,{language:"text",code:`# Requisição do navegador para http://blog.local:
GET / HTTP/1.1
Host: blog.local        ← É ESSA LINHA que o Apache usa para escolher o VHost
User-Agent: Mozilla/5.0 ...`}),e.jsx("h2",{children:"Passo 1 — Habilite o include de vhosts"}),e.jsxs("p",{children:["Abra ",e.jsx("code",{children:"apache/conf/httpd.conf"})," e procure pela linha:"]}),e.jsx(o,{language:"apache",code:`# Virtual hosts
#Include conf/extra/httpd-vhosts.conf`}),e.jsxs("p",{children:["Remova o ",e.jsx("code",{children:"#"})," da segunda linha e salve:"]}),e.jsx(o,{language:"apache",code:"Include conf/extra/httpd-vhosts.conf"}),e.jsx("h2",{children:"Passo 2 — Defina seus VHosts (name-based)"}),e.jsxs("p",{children:["Edite ",e.jsx("code",{children:"apache/conf/extra/httpd-vhosts.conf"}),":"]}),e.jsx(o,{language:"apache",code:`# Mantém o localhost padrão funcionando — IMPORTANTE
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
</VirtualHost>`}),e.jsxs(a,{type:"warning",title:"Por que o primeiro VirtualHost de localhost?",children:["Quando o Apache não acha um VHost com ",e.jsx("code",{children:"ServerName"})," que bata com o ",e.jsx("code",{children:"Host:"})," da requisição, ele ",e.jsx("strong",{children:"cai no primeiro VHost cadastrado para aquela porta"}),". Sem o bloco de localhost no topo, qualquer acesso a"," ",e.jsx("code",{children:"http://localhost"})," mostraria sempre o primeiro site da lista — não o htdocs raiz."]}),e.jsx("h2",{children:"Passo 3 — Mapeie os domínios no arquivo hosts"}),e.jsxs("p",{children:["Os domínios ",e.jsx("code",{children:"minhaloja.local"})," e ",e.jsx("code",{children:"blog.local"})," ","não existem na internet. Para o seu computador entender que devem ser respondidos pelo próprio Apache, edite o arquivo"," ",e.jsx("code",{children:"hosts"}),":"]}),e.jsx(o,{language:"text",code:`# Windows: C:\\Windows\\System32\\drivers\\etc\\hosts
# (precisa abrir o Bloco de Notas como Administrador)

# Linux:   /etc/hosts
# macOS:   /etc/hosts

127.0.0.1   localhost
127.0.0.1   minhaloja.local
127.0.0.1   www.minhaloja.local
127.0.0.1   blog.local`}),e.jsxs(a,{type:"info",title:"Por que .local e não .com?",children:["Você pode usar qualquer sufixo (",e.jsx("code",{children:".test"}),","," ",e.jsx("code",{children:".dev"}),", ",e.jsx("code",{children:".local"}),"). Evite ",e.jsx("code",{children:".dev"})," — desde 2017 o Chrome força HTTPS nesse TLD (a Google comprou"," ",e.jsx("code",{children:".dev"}),"). ",e.jsx("code",{children:".test"}),' é reservado pela RFC 6761 para esse fim — é a opção mais "correta". ',e.jsx("code",{children:".local"})," é muito comum, mas pode conflitar com mDNS (Bonjour) em macOS."]}),e.jsx("h2",{children:"Passo 4 — Reinicie e acesse"}),e.jsx("p",{children:"Painel → Apache → Stop → Start. Agora abra:"}),e.jsx(o,{language:"text",code:`http://minhaloja.local
http://blog.local
http://localhost  ← continua funcionando`}),e.jsx(i,{title:"Crie seu primeiro virtual host",goal:"Acessar http://meuapp.local sem precisar digitar /meuapp.",steps:["Crie a pasta C:/xampp/htdocs/meuapp","Dentro dela, crie index.php com: <h1>Meu app local!</h1>","Habilite httpd-vhosts.conf no httpd.conf (descomente a linha Include)","Adicione um <VirtualHost *:80> com ServerName meuapp.local","Edite o hosts do sistema adicionando: 127.0.0.1   meuapp.local","Reinicie o Apache pelo painel","Acesse http://meuapp.local no navegador"],verify:"O navegador mostra 'Meu app local!' direto, sem nenhum sub-caminho."}),e.jsx("h2",{children:"Como o Apache escolhe o VHost certo"}),e.jsx("p",{children:"O algoritmo, simplificado, é:"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Lista todos os ",e.jsx("code",{children:"<VirtualHost>"})," que batem com o IP/porta da conexão (ex.: ",e.jsx("code",{children:"*:80"}),")."]}),e.jsx("li",{children:"Se houver só um, ele é o escolhido."}),e.jsxs("li",{children:["Se houver vários, compara o header ",e.jsx("code",{children:"Host:"})," do request com o ",e.jsx("code",{children:"ServerName"})," e os"," ",e.jsx("code",{children:"ServerAlias"})," de cada um."]}),e.jsxs("li",{children:["Se nenhum bater, escolhe o ",e.jsx("strong",{children:"primeiro VHost da lista"})," ","como fallback (por isso a importância do bloco de localhost no topo)."]})]}),e.jsx("h2",{children:"ServerAlias com wildcards"}),e.jsxs("p",{children:["Aceita ",e.jsx("code",{children:"*"})," e ",e.jsx("code",{children:"?"})," como curingas:"]}),e.jsx(o,{language:"apache",code:`<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/cliente1"
    ServerName cliente1.local
    # Subdomínios de qualquer profundidade caem aqui
    ServerAlias *.cliente1.local

    # Útil para multi-tenancy (subdomínio = empresa)
</VirtualHost>`}),e.jsx("h2",{children:"Vhost específico para uma porta diferente"}),e.jsxs("p",{children:["Quer rodar uma API em ",e.jsx("code",{children:":8080"})," sem mexer no site principal? Adicione um ",e.jsx("code",{children:"Listen"})," no httpd.conf e um VHost novo:"]}),e.jsx(o,{language:"apache",code:`# httpd.conf
Listen 80
Listen 8080

# httpd-vhosts.conf
<VirtualHost *:8080>
    DocumentRoot "C:/xampp/htdocs/api"
    ServerName api.local
</VirtualHost>`}),e.jsxs("p",{children:["Acesse com ",e.jsx("code",{children:"http://localhost:8080"})," ou"," ",e.jsx("code",{children:"http://api.local:8080"}),"."]}),e.jsx("h2",{children:"VHost para HTTPS (porta 443)"}),e.jsx("p",{children:"Mesma ideia, mas dentro do bloco precisa habilitar SSL e apontar certificado:"}),e.jsx(o,{language:"apache",code:`<VirtualHost *:443>
    DocumentRoot "C:/xampp/htdocs/minhaloja"
    ServerName minhaloja.local

    SSLEngine on
    SSLCertificateFile      "conf/minhaloja.crt"
    SSLCertificateKeyFile   "conf/minhaloja.key"

    <Directory "C:/xampp/htdocs/minhaloja">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>`}),e.jsxs("p",{children:["Veja ",e.jsx("a",{href:"#/ssl-local",children:"HTTPS local"})," para gerar os certs."]}),e.jsx("h2",{children:"_default_ — o vhost coringa"}),e.jsxs("p",{children:["Em vez de ",e.jsx("code",{children:"*:80"})," você pode usar ",e.jsx("code",{children:"_default_:80"}),'. Esse VHost responde a requisições que não batem com nenhum outro bloco — útil como página de "este host não existe".']}),e.jsx(o,{language:"apache",code:`<VirtualHost _default_:80>
    DocumentRoot "C:/xampp/htdocs/sem-vhost"
    ServerName fallback.local
    # Página explicando que o domínio acessado não está configurado
</VirtualHost>`}),e.jsx("h2",{children:"Mass Virtual Hosting (mod_vhost_alias)"}),e.jsxs("p",{children:["Se você precisa hospedar dezenas/centenas de sites com a mesma estrutura, em vez de criar um ",e.jsx("code",{children:"<VirtualHost>"})," por site, use o ",e.jsx("code",{children:"mod_vhost_alias"})," — mapeia diretórios pelo nome:"]}),e.jsx(o,{language:"apache",code:`# Carregue o módulo no httpd.conf
LoadModule vhost_alias_module modules/mod_vhost_alias.so

<VirtualHost *:80>
    ServerName clientes.local
    ServerAlias *.clientes.local

    # %1 é o primeiro componente do hostname
    # cliente1.clientes.local → C:/xampp/htdocs/clientes/cliente1
    VirtualDocumentRoot "C:/xampp/htdocs/clientes/%1"
</VirtualHost>`}),e.jsx("p",{children:"Cada cliente novo é só uma pasta — sem reiniciar o Apache, sem editar o vhosts."}),e.jsx("h2",{children:"Diagnóstico — descubra o que o Apache está vendo"}),e.jsx(o,{language:"bash",code:`# Lista todos os vhosts ativos com origem (arquivo:linha)
C:\\xampp\\apache\\bin\\httpd.exe -t -D DUMP_VHOSTS

# Saída exemplo:
# VirtualHost configuration:
# *:80                   is a NameVirtualHost
#          default server localhost (httpd-vhosts.conf:21)
#          port 80 namevhost localhost (httpd-vhosts.conf:21)
#          port 80 namevhost minhaloja.local (httpd-vhosts.conf:25)
#                  alias www.minhaloja.local
#          port 80 namevhost blog.local (httpd-vhosts.conf:35)`}),e.jsx("h2",{children:"Erros comuns"}),e.jsx(r,{title:"Sintomas e causas mais frequentes",params:[{flag:"Forbidden — You don't have permission",desc:"Esqueceu o bloco <Directory> com Require all granted, OU o usuário do Apache não tem leitura na pasta."},{flag:"O navegador continua indo no localhost padrão",desc:"Esqueceu de salvar o arquivo hosts (precisava ser Administrador), ou esqueceu de reiniciar o Apache, ou cache de DNS."},{flag:"This site can't be reached / DNS_PROBE_FINISHED_NXDOMAIN",desc:"Typo no ServerName ou no arquivo hosts — o navegador não acha o domínio."},{flag:"Mesma página aparece em qualquer domínio",desc:"Faltou o bloco *:80 do localhost no topo. Sem ele, o primeiro VHost vira o catch-all."},{flag:"Cache do DNS no Windows",desc:"Após editar hosts, rode no PowerShell/CMD como admin: ipconfig /flushdns"},{flag:"Cache no Chrome",desc:"Acesse chrome://net-internals/#dns e clique em 'Clear host cache'."},{flag:"AH00558: Could not reliably determine the server's fully qualified domain name",desc:"Aviso, não erro. Defina ServerName no httpd.conf principal (ServerName localhost:80)."}]})]})}export{m as default};
