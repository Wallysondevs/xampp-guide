import{j as e}from"./index-BreI0dyu.js";import{P as s,A as a}from"./AlertBox-C_bJKc46.js";import{C as o}from"./CodeBlock-D0rWxPIU.js";import{P as r}from"./ParamsTable-DyRs6_CQ.js";import{P as i}from"./PracticeBox-BV05Hsfh.js";import"./circle-alert-_acnmM4q.js";function m(){return e.jsxs(s,{title:"Conflitos de portas no XAMPP",subtitle:"Apache não sobe? MySQL não inicia? Quase certeza que outra coisa está usando a porta. Aqui está o guia para descobrir quem é e resolver.",difficulty:"intermediario",timeToRead:"9 min",children:[e.jsx(a,{type:"info",title:"Pré-requisitos",children:'Saber abrir o terminal (PowerShell, CMD, bash). Conhecer o conceito de "porta" — explico no glossário se precisar.'}),e.jsx("h2",{children:"Glossário rápido"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Porta"})," — número (1 a 65535) que identifica um serviço dentro de uma máquina. HTTP usa 80, HTTPS usa 443, MySQL usa 3306, SMTP usa 25."]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Listening / LISTEN"}),' — estado de uma porta esperando conexão. Quando você vê um processo "listening on :80", ele é dono daquela porta naquele momento.']}),e.jsxs("p",{children:[e.jsx("strong",{children:"PID"})," (Process ID) — número que o sistema dá a cada programa em execução. É como você identifica e mata um processo."]}),e.jsx("h2",{children:"Portas padrão do XAMPP"}),e.jsx(r,{title:"Quem usa o quê por padrão",params:[{flag:"80",desc:"Apache (HTTP)"},{flag:"443",desc:"Apache (HTTPS)"},{flag:"3306",desc:"MariaDB (MySQL)"},{flag:"21",desc:"FileZilla FTP (se instalado)"},{flag:"25, 79, 105, 106, 110, 143, 2224",desc:"Mercury Mail (SMTP, finger, MercuryE control, MercuryD control, POP3, IMAP, Mercury control)"},{flag:"8080",desc:"Tomcat HTTP (se instalado)"},{flag:"8005, 8009",desc:"Tomcat shutdown e AJP (se instalado)"}]}),e.jsx("h2",{children:'Os "vilões" mais comuns no Windows'}),e.jsx(r,{title:"Quem costuma roubar a porta 80",params:[{flag:"IIS / W3SVC",desc:"Internet Information Services. Vem em algumas edições do Windows. Pare via services.msc → 'World Wide Web Publishing Service'."},{flag:"Skype clássico",desc:"Versões antigas usavam 80/443 como fallback. Em Skype: Tools → Connection options → desmarcar 'Use port 80 and 443'."},{flag:"Docker Desktop",desc:"Em alguns cenários, Docker pode pegar a 80 (proxy reverso, container nginx). Pause/feche Docker."},{flag:"Zoom / Teams",desc:"Versões antigas conflitavam. Atualize para a versão mais recente."},{flag:"VMware Workstation Server",desc:"Pode segurar a 443. Pare 'VMware Workstation Server' em services.msc."},{flag:"BranchCache, SQL Server Reporting Services, World Wide Web Publishing",desc:"Serviços do Windows menos comuns que ouvem na 80."},{flag:"MySQL Server da Oracle",desc:"Se você instalou MySQL Workbench, vem o servidor que conflita com o MariaDB do XAMPP na 3306."}]}),e.jsx("h2",{children:"Descobrindo quem está na porta"}),e.jsx(o,{title:"Windows (PowerShell ou CMD)",language:"powershell",code:`# Listar quem está na porta 80
netstat -ano | findstr :80

# Saída exemplo:
#   TCP    0.0.0.0:80    0.0.0.0:0    LISTENING    1234
# O 1234 é o PID. Para descobrir o nome:
tasklist /FI "PID eq 1234"

# Em PowerShell mais moderno:
Get-Process -Id (Get-NetTCPConnection -LocalPort 80).OwningProcess`}),e.jsx(o,{title:"Linux/macOS",language:"bash",code:`# Quem está na 80
sudo lsof -i :80

# Ou ss (mais moderno)
sudo ss -tulpn | grep ':80'

# Ou netstat clássico
sudo netstat -tulpn | grep ':80'`}),e.jsx("h2",{children:"Resolvendo: 3 caminhos"}),e.jsx("h3",{children:"Caminho 1 — Parar/desinstalar o vilão"}),e.jsx("p",{children:"Se quem está na porta é algo que você não usa (IIS, World Wide Web Publishing Service), pare e desabilite:"}),e.jsx(o,{language:"powershell",code:`# Listar o serviço
Get-Service W3SVC

# Parar
Stop-Service W3SVC

# Impedir que suba na próxima inicialização
Set-Service W3SVC -StartupType Disabled`}),e.jsx("h3",{children:"Caminho 2 — Mudar a porta do Apache/MySQL"}),e.jsxs("p",{children:["Edite ",e.jsx("code",{children:"apache/conf/httpd.conf"}),":"]}),e.jsx(o,{language:"apache",code:`# Trocar 80 por 8080
Listen 8080
ServerName localhost:8080`}),e.jsxs("p",{children:["E ",e.jsx("code",{children:"apache/conf/extra/httpd-ssl.conf"})," para HTTPS:"]}),e.jsx(o,{language:"apache",code:`Listen 4443
<VirtualHost _default_:4443>
    ...
</VirtualHost>`}),e.jsxs("p",{children:["Reinicie o Apache. Daí pra frente, acesse"," ",e.jsx("code",{children:"http://localhost:8080"}),"."]}),e.jsxs(a,{type:"warning",title:"Trocar a porta tem custo cognitivo",children:["Toda URL passa a precisar do ",e.jsx("code",{children:":8080"})," no fim. Tutoriais online vão dizer ",e.jsx("code",{children:"http://localhost"})," e o seu caso é"," ",e.jsx("code",{children:"http://localhost:8080"}),". Se puder, prefira liberar a porta 80."]}),e.jsxs("p",{children:["Para o MySQL, edite ",e.jsx("code",{children:"mysql/bin/my.ini"}),":"]}),e.jsx(o,{language:"ini",code:`[client]
port=3307

[mysqld]
port=3307`}),e.jsxs("p",{children:["Lembre de atualizar a configuração do phpMyAdmin (",e.jsx("code",{children:"config.inc.php"}),") e dos seus projetos (",e.jsx("code",{children:"DB_PORT"})," no .env)."]}),e.jsx("h3",{children:"Caminho 3 — Mudar pelo painel (mais fácil no Windows)"}),e.jsxs("p",{children:["No XAMPP Control Panel: clique em ",e.jsx("strong",{children:"Config"})," (canto superior direito) → ",e.jsx("strong",{children:"Service and Port Settings"}),". Uma janela mostra cada serviço com sua porta atual. Edite, salve, e o painel reinicia automaticamente."]}),e.jsx(i,{title:"Diagnosticar e resolver porta 80 ocupada",goal:"Apache subir em verde, sem erro de porta.",steps:["Tente Start Apache → vê o erro vermelho","Abra o terminal e rode netstat -ano | findstr :80",'Anote o PID e identifique com tasklist /FI "PID eq <PID>"',"Se for IIS/W3SVC, pare com Stop-Service W3SVC e desabilite","Se for algo que precisa rodar, mude o Apache para 8080 no httpd.conf","Volte ao painel, Start Apache"],verify:"Apache em verde, e netstat -ano | findstr :80 mostra o httpd.exe ou nada (se foi para 8080)."}),e.jsx("h2",{children:"Conflitos com WSL2 e Docker"}),e.jsxs("p",{children:["Quando você instala WSL2 ou Docker Desktop com integração WSL2, o Windows reserva uma faixa de portas dinâmicas que pode incluir 80, 443 etc. Sintoma: ",e.jsx("code",{children:"netstat"})," mostra a porta como ocupada mas ",e.jsx("em",{children:"nenhum processo é dono dela"}),"."]}),e.jsx(o,{language:"powershell",code:`# Ver quais faixas o Windows reservou
netsh interface ipv4 show excludedportrange protocol=tcp

# Liberar a 80 (precisa ser admin)
net stop winnat
netsh interface ipv4 add excludedportrange protocol=tcp startport=80 numberofports=1
net start winnat`}),e.jsx("h2",{children:"Reset rápido — voltar tudo ao padrão"}),e.jsxs("p",{children:["Se você mexeu demais nas portas e nada faz mais sentido, reverta editando ",e.jsx("code",{children:"httpd.conf"})," para ",e.jsx("code",{children:"Listen 80"})," e",e.jsx("code",{children:"my.ini"})," para ",e.jsx("code",{children:"port=3306"}),". Depois reinicie o painel."]}),e.jsxs(a,{type:"success",title:"Resumindo",children:["Erro de Apache/MySQL ao iniciar = porta ocupada em 90% dos casos. Sequência: ",e.jsx("code",{children:"netstat"})," → ",e.jsx("code",{children:"tasklist"})," → decide (parar quem está, ou mudar o XAMPP de porta)."]})]})}export{m as default};
