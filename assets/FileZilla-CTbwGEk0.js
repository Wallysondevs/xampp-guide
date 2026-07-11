import{j as e}from"./index-BreI0dyu.js";import{P as i,A as a}from"./AlertBox-C_bJKc46.js";import{C as o}from"./CodeBlock-D0rWxPIU.js";import{P as s}from"./ParamsTable-DyRs6_CQ.js";import"./circle-alert-_acnmM4q.js";function c(){return e.jsxs(i,{title:"FileZilla Server — FTP / FTPS no XAMPP",subtitle:"O servidor FTP que vem no XAMPP Windows. Como criar usuários, isolar diretórios, ativar FTPS e quando substituir por SFTP.",difficulty:"intermediario",timeToRead:"9 min",children:[e.jsxs(a,{type:"info",title:"Só Windows",children:["O FileZilla Server é distribuído apenas com o XAMPP Windows. Para Linux use"," ",e.jsx("code",{children:"vsftpd"})," ou ",e.jsx("code",{children:"ProFTPD"}),". Para macOS, ative o servidor FTP nativo do sistema ou use ",e.jsx("code",{children:"pure-ftpd"}),"."]}),e.jsx("h2",{children:"O que vem no XAMPP"}),e.jsxs("p",{children:["Versão antiga 0.9.x do FileZilla Server (legacy). Funciona para LAN e desenvolvimento. Para produção, baixe a versão 1.x atual de ",e.jsx("code",{children:"filezilla-project.org"})," — mais segura e mantida."]}),e.jsx("h2",{children:"Iniciando"}),e.jsx(o,{language:"text",code:`1. Painel XAMPP → linha "FileZilla" → Start
2. Clique "Admin" para abrir a interface administrativa
3. Connect to: 127.0.0.1, porta 14147 (admin), senha em branco no início
4. Defina senha de admin: Settings → Admin Interface settings → Change`}),e.jsx("h2",{children:"Criando o primeiro usuário"}),e.jsx(o,{title:"Edit → Users",language:"text",code:`General:
  ☑ Account
  Password: ********
  Group: (vazio para começar)

Shared folders:
  Add: C:/xampp/htdocs/loja
  Permissions:
    Files:        Read, Write, Delete, Append
    Directories:  Create, Delete, List, Subdirs
  ☑ Set as home dir

Speed Limits:
  (deixe padrão para LAN; em produção limite uploads)

IP Filter:
  (allow / deny por IP — use deny:* + allow:lan)`}),e.jsx("h2",{children:"Estrutura recomendada"}),e.jsx(o,{language:"text",code:`Usuários por SITE — não por pessoa.
Cada site tem usuário próprio com home dir = pasta do site.

ftp_loja      → C:/xampp/htdocs/loja
ftp_blog      → C:/xampp/htdocs/blog
ftp_admin     → C:/xampp/htdocs/admin

Assim, quando você revoga um usuário, perde acesso só àquele site.`}),e.jsx("h2",{children:"Grupos para padronizar"}),e.jsx(o,{language:"text",code:`Edit → Groups → Add: "devs"
  Shared folders: C:/xampp/htdocs/   (Read, Write em arquivos; Create, Delete em pastas)
  Speed limits: padrão

Em cada User: Group = devs (herda config)
Permissões individuais sobrescrevem as do grupo.`}),e.jsx("h2",{children:"FTPS — TLS por cima do FTP"}),e.jsxs("p",{children:["FTP plano envia senha em ",e.jsx("strong",{children:"texto puro"}),". FTPS coloca TLS no transporte. No FileZilla:"]}),e.jsx(o,{title:"Settings → FTP over TLS settings",language:"text",code:`☑ Enable FTP over TLS support (FTPS)

Certificate file: C:/xampp/apache/conf/ssl.crt/server.crt
Private key file: C:/xampp/apache/conf/ssl.key/server.key
Key password:     (se houver)

☑ Require explicit FTP over TLS
☑ Force PROT P to encrypt file transfers in SSL/TLS mode

(Use o mesmo cert do Apache HTTPS local — capítulo SSL Local.)`}),e.jsx(o,{title:"Cliente FileZilla (do outro lado)",language:"text",code:`Host:     ftp.meusite.local
Port:     21 (com explicit TLS)
Protocol: FTP - File Transfer Protocol
Encryption: Require explicit FTP over TLS
Logon:    Normal
User:     ftp_loja
Password: ********`}),e.jsx("h2",{children:"Modo passivo"}),e.jsx(o,{title:"Settings → Passive mode settings",language:"text",code:`☑ Use custom port range:    49152 – 65534
☑ External Server IP for passive mode replies
   (em rede local: deixe "default")
   (em servidor com NAT: digite o IP público do roteador)

Abra o range de portas no firewall do Windows.`}),e.jsx("p",{children:'Sem isso, clientes atrás de NAT veem timeout em LIST/RETR mesmo após login OK. É a causa #1 de "FTP funciona, mas listar pasta trava".'}),e.jsx("h2",{children:"Logs"}),e.jsx(o,{title:"Settings → Logging",language:"text",code:`☑ Enable logging to file
File:           C:/xampp/FileZillaFTP/logs/filezilla.log
Limit logfile size to: 10 MB
☑ Use a different logfile each day
☑ Delete old logfiles after: 30 days`}),e.jsx("h2",{children:"Bloqueando força bruta"}),e.jsx(o,{title:"Settings → Auto ban",language:"text",code:`☑ Enable automatic bans
Ban after: 5 failed attempts in 1 hour
Ban duration: 60 minutes`}),e.jsx("h2",{children:"Acesso programático — script de upload"}),e.jsx(o,{title:"PowerShell — upload de uma pasta",language:"powershell",code:`# WinSCP é mais robusto que cmdlets nativos
# https://winscp.net/eng/docs/library_powershell

Add-Type -Path "C:/Program Files/WinSCP/WinSCPnet.dll"

$opts = New-Object WinSCP.SessionOptions -Property @{
    Protocol = [WinSCP.Protocol]::Ftp
    HostName = "127.0.0.1"
    UserName = "ftp_loja"
    Password = "senha"
    FtpSecure = [WinSCP.FtpSecure]::Explicit
    TlsHostCertificateFingerprint = "xx:xx:xx:..."
}

$session = New-Object WinSCP.Session
try {
    $session.Open($opts)
    $session.PutFiles("C:/projetos/loja/dist/*", "/", $false).Check()
} finally { $session.Dispose() }`}),e.jsx(o,{title:"Linha de comando — curl",language:"bash",code:`# Upload com FTPS
curl --ftp-ssl --ftp-pasv \\
     -u ftp_loja:senha \\
     -T arquivo.zip \\
     ftp://127.0.0.1/`}),e.jsx("h2",{children:"FTP vs SFTP — diferença crucial"}),e.jsx(s,{title:"Resumo",params:[{flag:"FTP plano",desc:"Porta 21. Sem criptografia. NÃO USE em internet."},{flag:"FTPS",desc:"FTP + TLS. Mantém o protocolo FTP, dificulta firewall (range passivo)."},{flag:"SFTP",desc:"Outro protocolo, sobre SSH (porta 22). Único canal, simples no firewall."}]}),e.jsxs("p",{children:["SFTP ",e.jsx("strong",{children:"não é FTP com S"}),". É um subsistema do SSH. FileZilla cliente fala os dois; FileZilla Server (XAMPP) só fala FTP/FTPS — para SFTP, instale OpenSSH Server do Windows ou um daemon dedicado."]}),e.jsxs(a,{type:"warning",title:"FTP em produção: vai com SFTP",children:["Em servidor real (VPS, hospedagem), prefira SFTP — uma porta só, sem range passivo, sem cert separado. Para deploy automatizado, considere ",e.jsx("code",{children:"rsync"})," sobre SSH."]}),e.jsx("h2",{children:"Receita: deploy de um site"}),e.jsxs("ol",{children:[e.jsxs("li",{children:["Crie usuário ",e.jsx("code",{children:"ftp_meusite"})," com home ",e.jsx("code",{children:"htdocs/meusite"}),"."]}),e.jsx("li",{children:"Permissões: Read+Write+Delete em arquivos; Create+Delete em diretórios."}),e.jsxs("li",{children:["Conecte do FileZilla Client → arraste pasta local ",e.jsx("code",{children:"dist/"})," para o servidor."]}),e.jsxs("li",{children:["Para deploys repetitivos, use ",e.jsx("strong",{children:"WinSCP sync"})," em vez de copiar tudo de novo."]}),e.jsxs("li",{children:["Confira em ",e.jsx("code",{children:"http://localhost/meusite"}),"."]})]}),e.jsx("h2",{children:"Diagnóstico"}),e.jsx(o,{language:"text",code:`Sintoma                                    Causa provável
"Could not retrieve directory listing"     → modo passivo / firewall bloqueia range
"550 Permission denied"                    → home dir sem write OU pasta read-only
"530 Login incorrect"                      → senha errada / usuário desabilitado
"Connection timed out"                     → porta 21 fechada no firewall
"Could not connect to server" + cert       → cliente recusa cert auto-assinado`}),e.jsx("h2",{children:"Armadilhas"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Compartilhar credencial FTP entre devs — sem rastreio. Crie um usuário por pessoa OU use SFTP+chaves."}),e.jsx("li",{children:"Versão 0.9.x abandonada — atualize para 1.x da própria FileZilla Project se for usar de verdade."}),e.jsx("li",{children:'Esquecer "Set as home dir" → usuário entra na raiz e enxerga tudo do disco.'}),e.jsx("li",{children:"Range passivo com firewall fechado → tudo trava após login."})]})]})}export{c as default};
