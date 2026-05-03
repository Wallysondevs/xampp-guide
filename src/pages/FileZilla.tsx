import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function FileZilla() {
  return (
    <PageContainer
      title="FileZilla Server — FTP / FTPS no XAMPP"
      subtitle="O servidor FTP que vem no XAMPP Windows. Como criar usuários, isolar diretórios, ativar FTPS e quando substituir por SFTP."
      difficulty="intermediario"
      timeToRead="9 min"
    >
      <AlertBox type="info" title="Só Windows">
        O FileZilla Server é distribuído apenas com o XAMPP Windows. Para Linux use{" "}
        <code>vsftpd</code> ou <code>ProFTPD</code>. Para macOS, ative o servidor FTP nativo do
        sistema ou use <code>pure-ftpd</code>.
      </AlertBox>

      <h2>O que vem no XAMPP</h2>
      <p>
        Versão antiga 0.9.x do FileZilla Server (legacy). Funciona para LAN e desenvolvimento.
        Para produção, baixe a versão 1.x atual de <code>filezilla-project.org</code> — mais
        segura e mantida.
      </p>

      <h2>Iniciando</h2>
      <CodeBlock
        language="text"
        code={`1. Painel XAMPP → linha "FileZilla" → Start
2. Clique "Admin" para abrir a interface administrativa
3. Connect to: 127.0.0.1, porta 14147 (admin), senha em branco no início
4. Defina senha de admin: Settings → Admin Interface settings → Change`}
      />

      <h2>Criando o primeiro usuário</h2>
      <CodeBlock
        title="Edit → Users"
        language="text"
        code={`General:
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
  (allow / deny por IP — use deny:* + allow:lan)`}
      />

      <h2>Estrutura recomendada</h2>
      <CodeBlock
        language="text"
        code={`Usuários por SITE — não por pessoa.
Cada site tem usuário próprio com home dir = pasta do site.

ftp_loja      → C:/xampp/htdocs/loja
ftp_blog      → C:/xampp/htdocs/blog
ftp_admin     → C:/xampp/htdocs/admin

Assim, quando você revoga um usuário, perde acesso só àquele site.`}
      />

      <h2>Grupos para padronizar</h2>
      <CodeBlock
        language="text"
        code={`Edit → Groups → Add: "devs"
  Shared folders: C:/xampp/htdocs/   (Read, Write em arquivos; Create, Delete em pastas)
  Speed limits: padrão

Em cada User: Group = devs (herda config)
Permissões individuais sobrescrevem as do grupo.`}
      />

      <h2>FTPS — TLS por cima do FTP</h2>
      <p>
        FTP plano envia senha em <strong>texto puro</strong>. FTPS coloca TLS no transporte. No
        FileZilla:
      </p>
      <CodeBlock
        title="Settings → FTP over TLS settings"
        language="text"
        code={`☑ Enable FTP over TLS support (FTPS)

Certificate file: C:/xampp/apache/conf/ssl.crt/server.crt
Private key file: C:/xampp/apache/conf/ssl.key/server.key
Key password:     (se houver)

☑ Require explicit FTP over TLS
☑ Force PROT P to encrypt file transfers in SSL/TLS mode

(Use o mesmo cert do Apache HTTPS local — capítulo SSL Local.)`}
      />
      <CodeBlock
        title="Cliente FileZilla (do outro lado)"
        language="text"
        code={`Host:     ftp.meusite.local
Port:     21 (com explicit TLS)
Protocol: FTP - File Transfer Protocol
Encryption: Require explicit FTP over TLS
Logon:    Normal
User:     ftp_loja
Password: ********`}
      />

      <h2>Modo passivo</h2>
      <CodeBlock
        title="Settings → Passive mode settings"
        language="text"
        code={`☑ Use custom port range:    49152 – 65534
☑ External Server IP for passive mode replies
   (em rede local: deixe "default")
   (em servidor com NAT: digite o IP público do roteador)

Abra o range de portas no firewall do Windows.`}
      />
      <p>
        Sem isso, clientes atrás de NAT veem timeout em LIST/RETR mesmo após login OK. É a
        causa #1 de "FTP funciona, mas listar pasta trava".
      </p>

      <h2>Logs</h2>
      <CodeBlock
        title="Settings → Logging"
        language="text"
        code={`☑ Enable logging to file
File:           C:/xampp/FileZillaFTP/logs/filezilla.log
Limit logfile size to: 10 MB
☑ Use a different logfile each day
☑ Delete old logfiles after: 30 days`}
      />

      <h2>Bloqueando força bruta</h2>
      <CodeBlock
        title="Settings → Auto ban"
        language="text"
        code={`☑ Enable automatic bans
Ban after: 5 failed attempts in 1 hour
Ban duration: 60 minutes`}
      />

      <h2>Acesso programático — script de upload</h2>
      <CodeBlock
        title="PowerShell — upload de uma pasta"
        language="powershell"
        code={`# WinSCP é mais robusto que cmdlets nativos
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
} finally { $session.Dispose() }`}
      />

      <CodeBlock
        title="Linha de comando — curl"
        language="bash"
        code={`# Upload com FTPS
curl --ftp-ssl --ftp-pasv \\
     -u ftp_loja:senha \\
     -T arquivo.zip \\
     ftp://127.0.0.1/`}
      />

      <h2>FTP vs SFTP — diferença crucial</h2>
      <ParamsTable
        title="Resumo"
        params={[
          { flag: "FTP plano", desc: "Porta 21. Sem criptografia. NÃO USE em internet." },
          { flag: "FTPS", desc: "FTP + TLS. Mantém o protocolo FTP, dificulta firewall (range passivo)." },
          { flag: "SFTP", desc: "Outro protocolo, sobre SSH (porta 22). Único canal, simples no firewall." },
        ]}
      />
      <p>
        SFTP <strong>não é FTP com S</strong>. É um subsistema do SSH. FileZilla cliente fala os
        dois; FileZilla Server (XAMPP) só fala FTP/FTPS — para SFTP, instale OpenSSH Server do
        Windows ou um daemon dedicado.
      </p>

      <AlertBox type="warning" title="FTP em produção: vai com SFTP">
        Em servidor real (VPS, hospedagem), prefira SFTP — uma porta só, sem range passivo,
        sem cert separado. Para deploy automatizado, considere <code>rsync</code> sobre SSH.
      </AlertBox>

      <h2>Receita: deploy de um site</h2>
      <ol>
        <li>Crie usuário <code>ftp_meusite</code> com home <code>htdocs/meusite</code>.</li>
        <li>Permissões: Read+Write+Delete em arquivos; Create+Delete em diretórios.</li>
        <li>Conecte do FileZilla Client → arraste pasta local <code>dist/</code> para o servidor.</li>
        <li>Para deploys repetitivos, use <strong>WinSCP sync</strong> em vez de copiar tudo de novo.</li>
        <li>Confira em <code>http://localhost/meusite</code>.</li>
      </ol>

      <h2>Diagnóstico</h2>
      <CodeBlock
        language="text"
        code={`Sintoma                                    Causa provável
"Could not retrieve directory listing"     → modo passivo / firewall bloqueia range
"550 Permission denied"                    → home dir sem write OU pasta read-only
"530 Login incorrect"                      → senha errada / usuário desabilitado
"Connection timed out"                     → porta 21 fechada no firewall
"Could not connect to server" + cert       → cliente recusa cert auto-assinado`}
      />

      <h2>Armadilhas</h2>
      <ul>
        <li>
          Compartilhar credencial FTP entre devs — sem rastreio. Crie um usuário por pessoa OU use SFTP+chaves.
        </li>
        <li>
          Versão 0.9.x abandonada — atualize para 1.x da própria FileZilla Project se for usar de verdade.
        </li>
        <li>
          Esquecer "Set as home dir" → usuário entra na raiz e enxerga tudo do disco.
        </li>
        <li>
          Range passivo com firewall fechado → tudo trava após login.
        </li>
      </ul>
    </PageContainer>
  );
}
