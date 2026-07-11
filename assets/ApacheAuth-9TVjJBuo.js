import{j as e}from"./index-BreI0dyu.js";import{P as i,A as s}from"./AlertBox-C_bJKc46.js";import{C as a}from"./CodeBlock-D0rWxPIU.js";import{P as r}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function u(){return e.jsxs(i,{title:"Autenticação no Apache — Basic, Digest e htpasswd",subtitle:"Proteja diretórios inteiros sem precisar tocar uma linha de PHP. Como criar e manter usuários, restringir por IP e combinar Satisfy Any.",difficulty:"intermediario",timeToRead:"10 min",children:[e.jsxs(s,{type:"info",title:"Quando usar?",children:["Painéis administrativos internos (",e.jsx("code",{children:"/admin"}),", ",e.jsx("code",{children:"/phpmyadmin"}),"), ambientes de homologação que não devem vazar para o Google e qualquer pasta que precise de barreira rápida. Para login real de aplicação, prefira sessão/JWT no PHP."]}),e.jsx("h2",{children:"Basic vs Digest"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Basic"})," — usuário e senha em base64 a cada request."," ",e.jsx("strong",{children:"Sempre"})," use junto com HTTPS (caso contrário, vai em texto claro)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Digest"})," — desafio + hash MD5. Não trafega senha, mas o algoritmo é fraco hoje em dia. Pouco usado — Basic+HTTPS é mais simples e seguro."]})]}),e.jsx("h2",{children:"Criando o arquivo de usuários"}),e.jsx(a,{title:"Windows / XAMPP",language:"bash",code:`# 1. Crie a pasta fora do htdocs (NUNCA dentro)
mkdir C:/xampp/auth

# 2. Crie o arquivo e adicione o primeiro usuário
C:/xampp/apache/bin/htpasswd.exe -Bc C:/xampp/auth/.htpasswd admin
# -B = bcrypt (recomendado, padrão em Apache 2.4+)
# -c = create (sobrescreve!)

# Adicionar mais usuários depois (sem -c!):
C:/xampp/apache/bin/htpasswd.exe -B C:/xampp/auth/.htpasswd maria

# Conferir
type C:/xampp/auth/.htpasswd
# admin:$2y$05$kQp...`}),e.jsx(a,{title:"Linux",language:"bash",code:`sudo /opt/lampp/bin/htpasswd -Bc /opt/lampp/etc/.htpasswd admin
sudo /opt/lampp/bin/htpasswd -B /opt/lampp/etc/.htpasswd maria`}),e.jsx("h2",{children:"Protegendo um diretório com .htaccess"}),e.jsx(a,{title:"C:/xampp/htdocs/admin/.htaccess",language:"apache",code:`AuthType Basic
AuthName "Área restrita — login obrigatório"
AuthUserFile "C:/xampp/auth/.htpasswd"
Require valid-user`}),e.jsxs("p",{children:["Acesse ",e.jsx("code",{children:"http://localhost/admin/"})," e o navegador exibe o pop-up de login. Após autenticar, o Apache passa o usuário para o PHP em"," ",e.jsx("code",{children:"$_SERVER['PHP_AUTH_USER']"}),"."]}),e.jsx("h2",{children:"Restringindo por usuário específico"}),e.jsx(a,{title:".htaccess",language:"apache",code:`AuthType Basic
AuthName "Somente o admin"
AuthUserFile "C:/xampp/auth/.htpasswd"
Require user admin
# múltiplos usuários:
# Require user admin maria joao`}),e.jsx("h2",{children:"Grupos com AuthGroupFile"}),e.jsx(a,{title:"C:/xampp/auth/.htgroup",language:"text",code:`# nome_grupo: usuario1 usuario2 ...
admins: admin maria
revisores: joao maria pedro`}),e.jsx(a,{title:".htaccess",language:"apache",code:`AuthType Basic
AuthName "Restrita a admins"
AuthUserFile "C:/xampp/auth/.htpasswd"
AuthGroupFile "C:/xampp/auth/.htgroup"
Require group admins`}),e.jsx("h2",{children:"Restringindo por IP"}),e.jsx(a,{language:"apache",code:`# Apache 2.4 — sintaxe nova com Require
<RequireAll>
    Require all granted
    Require ip 127.0.0.1 192.168.1.0/24
</RequireAll>

# Negar tudo, permitir só dois IPs:
<RequireAny>
    Require ip 127.0.0.1
    Require ip 200.100.50.10
</RequireAny>`}),e.jsx("h2",{children:"Combinando IP + senha"}),e.jsx("p",{children:"Cenário comum: liberar sem senha para o IP da empresa, mas pedir senha para qualquer outro."}),e.jsx(a,{language:"apache",code:`AuthType Basic
AuthName "Painel"
AuthUserFile "C:/xampp/auth/.htpasswd"

<RequireAny>
    Require ip 192.168.1.0/24
    Require valid-user
</RequireAny>`}),e.jsx("h2",{children:"Por bloco <Files> ou <Location>"}),e.jsx(a,{title:"Proteger só um arquivo",language:"apache",code:`<Files "config.php">
    AuthType Basic
    AuthName "Acesso restrito"
    AuthUserFile "C:/xampp/auth/.htpasswd"
    Require valid-user
</Files>`}),e.jsx("h2",{children:"Logout do Basic Auth"}),e.jsxs("p",{children:["O HTTP Basic ",e.jsx("strong",{children:"não tem logout"}),' — o navegador guarda credenciais até fechar a janela. Para "deslogar" sem fechar:']}),e.jsx(a,{title:"logout.php",language:"php",code:`<?php
header('WWW-Authenticate: Basic realm="Login"');
header('HTTP/1.0 401 Unauthorized');
echo "Sessão encerrada. <a href='/admin/'>Entrar de novo</a>";
exit;`}),e.jsx(r,{title:"Diretivas resumo",params:[{flag:"AuthType",desc:"Basic ou Digest."},{flag:"AuthName",desc:"Texto exibido no popup do navegador (entre aspas)."},{flag:"AuthUserFile",desc:"Caminho ABSOLUTO do .htpasswd (sempre fora do htdocs)."},{flag:"AuthGroupFile",desc:"Caminho do arquivo de grupos."},{flag:"Require valid-user",desc:"Qualquer usuário autenticado serve."},{flag:"Require user X",desc:"Apenas usuário X."},{flag:"Require group X",desc:"Apenas membros do grupo X."},{flag:"Require ip X",desc:"Apenas o IP/range X."},{flag:"<RequireAll>",desc:"Combina exigências em AND."},{flag:"<RequireAny>",desc:"Combina exigências em OR."}]}),e.jsxs(s,{type:"warning",title:".htpasswd dentro de htdocs = vazamento",children:["Se você botar o ",e.jsx("code",{children:".htpasswd"})," dentro de uma pasta acessível pelo Apache, qualquer um pode baixar. Sempre coloque ",e.jsx("strong",{children:"fora"})," do ",e.jsx("code",{children:"DocumentRoot"}),". Mesmo com ",e.jsx("code",{children:".htaccess"})," bloqueando, evite o risco."]}),e.jsxs(s,{type:"danger",title:"Nunca em produção sem HTTPS",children:["Basic Auth via HTTP envia a senha em base64 — qualquer sniffer lê. Em produção: HTTPS obrigatório. Em XAMPP local, ative o ",e.jsx("code",{children:"ssl"})," e use"," ",e.jsx("code",{children:"https://localhost"}),"."]}),e.jsx("h2",{children:"Armadilhas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Esquecer ",e.jsx("code",{children:"AllowOverride AuthConfig"})," (ou ",e.jsx("code",{children:"All"}),") no"," ",e.jsx("code",{children:"httpd.conf"})," — sem isso, as diretivas em ",e.jsx("code",{children:".htaccess"})," são ignoradas."]}),e.jsxs("li",{children:["Caminho ",e.jsx("strong",{children:"relativo"})," em ",e.jsx("code",{children:"AuthUserFile"})," raramente funciona — use absoluto."]}),e.jsxs("li",{children:["Reusar a flag ",e.jsx("code",{children:"-c"})," ao adicionar usuários — sobrescreve o arquivo todo."]}),e.jsxs("li",{children:["Senhas ",e.jsx("strong",{children:"weak"}),": htpasswd por padrão usa MD5 (no Linux) ou bcrypt (no 2.4). Prefira sempre ",e.jsx("code",{children:"-B"}),"."]})]})]})}export{u as default};
