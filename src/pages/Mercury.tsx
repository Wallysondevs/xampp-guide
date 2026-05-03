import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ParamsTable } from "@/components/ui/ParamsTable";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function Mercury() {
  return (
    <PageContainer
      title="Mercury Mail — testando email no XAMPP"
      subtitle="Servidor SMTP local que vem dentro do XAMPP. Para testar mail() do PHP sem precisar do Gmail — e quando vale mais a pena trocar pelo MailHog/Mailtrap."
      difficulty="avancado"
      timeToRead="10 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Saber editar o <a href="#/php-ini">php.ini</a> e reiniciar o Apache
        pelo <a href="#/painel-controle">painel</a>. Conhecer o conceito de
        SMTP (envio) versus POP3/IMAP (recebimento) ajuda, mas não é
        essencial.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>SMTP</strong> (Simple Mail Transfer Protocol) — protocolo de
        envio de e-mail. Por padrão usa porta 25 (sem TLS), 587 (STARTTLS)
        ou 465 (TLS implícito).
      </p>
      <p>
        <strong>POP3 / IMAP</strong> — protocolos de leitura. POP3 baixa e
        apaga do servidor; IMAP mantém tudo no servidor sincronizado.
      </p>
      <p>
        <strong>MTA</strong> (Mail Transfer Agent) — programa que recebe
        e-mails e os entrega ou repassa adiante. Mercury, Postfix, Sendmail
        e Exim são MTAs.
      </p>
      <p>
        <strong>MX record</strong> — registro DNS que diz "para este
        domínio, envie e-mails para este servidor". Em desenvolvimento local
        você não tem MX — por isso precisa de um SMTP fake.
      </p>
      <p>
        <strong>SPF / DKIM / DMARC</strong> — registros DNS que provam que o
        seu e-mail é legítimo. Sem eles, mensagens de produção caem em spam.
      </p>

      <p>
        Quando você roda <code>mail()</code> no PHP, o XAMPP precisa de um
        SMTP para entregar a mensagem. Em produção, é o servidor da
        hospedagem ou um serviço transacional (SendGrid, SES, Mailgun). Em
        desenvolvimento, as opções são: <strong>Mercury</strong> (vem no
        XAMPP), <strong>MailHog</strong> (mais moderno e bonitinho),{" "}
        <strong>MailPit</strong> (sucessor do MailHog) ou serviços online
        como <strong>Mailtrap</strong>.
      </p>

      <AlertBox type="info" title="Para a maioria, MailHog/Mailpit ou Mailtrap são melhores">
        O Mercury é poderoso mas tem interface dos anos 90 e configuração
        chata. Se a única necessidade é "ver os e-mails que meu sistema
        enviaria", MailHog/Mailpit ou Mailtrap dão menos trabalho. Mantemos
        o Mercury aqui porque ele já vem instalado no XAMPP — pula a
        instalação extra.
      </AlertBox>

      <h2>Como o e-mail sai do PHP até a caixa do destinatário</h2>
      <ol>
        <li>
          PHP chama <code>mail()</code> — internamente ele usa o que estiver
          configurado em <code>SMTP</code> e <code>smtp_port</code> do{" "}
          <code>php.ini</code> (em Windows). Em Linux/macOS, usa o binário
          definido em <code>sendmail_path</code>.
        </li>
        <li>
          A mensagem sai para o MTA local (Mercury) na 25.
        </li>
        <li>
          O MTA olha o domínio do destinatário, consulta o MX record via DNS
          e tenta entregar via SMTP no servidor remoto.
        </li>
        <li>
          O servidor remoto pode aceitar (entrega na caixa), recusar (5xx) ou
          jogar em quarentena/spam dependendo de SPF/DKIM/DMARC.
        </li>
      </ol>
      <AlertBox type="warning" title="Por que SMTP local quase nunca chega em produção">
        Provedores grandes (Gmail, Outlook, Yahoo) bloqueiam quase todo
        e-mail vindo de IP residencial — independente do quão bem
        configurado seu Mercury esteja. Para enviar de verdade na internet,
        use um serviço dedicado.
      </AlertBox>

      <h2>1. Habilitando o Mercury no XAMPP</h2>
      <ol>
        <li>
          Confirme no instalador do XAMPP que <strong>"Mercury Mail
          Server"</strong> foi marcado. Se não foi, rode o instalador
          novamente e marque (não perde nada do que já está lá).
        </li>
        <li>No painel, clique em <strong>Start</strong> ao lado de Mercury.</li>
        <li>O ícone do Mercury aparece na bandeja do sistema. Clique duas vezes para abrir a janela principal.</li>
        <li>
          A primeira vez, o Mercury pode pedir confirmação do firewall do
          Windows — autorize.
        </li>
      </ol>
      <p>
        A janela do Mercury é dividida em vários protocolos numa MDI (várias
        janelas internas):
      </p>
      <ParamsTable
        title="Módulos do Mercury"
        params={[
          { flag: "Mercury Core (MercuryC)", desc: "Cliente SMTP que envia e-mails para servidores externos. Quem fala com o Gmail." },
          { flag: "Mercury SMTP (MercuryS)", desc: "Servidor SMTP. Recebe os e-mails que o PHP envia. É este que precisa estar ativo para mail() funcionar." },
          { flag: "Mercury POP3 (MercuryP)", desc: "Servidor POP3 — clientes (Thunderbird etc) baixam e-mails dele." },
          { flag: "Mercury IMAP (MercuryI)", desc: "Servidor IMAP — alternativa moderna ao POP3, sincroniza pastas." },
          { flag: "Mercury HTTP (MercuryH)", desc: "Webmail simples para acessar caixas pelo navegador." },
          { flag: "Mercury Distribution (MercuryD)", desc: "Cliente POP3 — busca e-mails de caixas externas e baixa para o Mercury." },
        ]}
      />
      <p>
        Para o cenário "PHP local manda, eu vejo numa caixa local", basta
        deixar <strong>MercuryS</strong> (SMTP) ativo. Os outros podem ser
        desligados em <em>Configuration → Protocol modules</em>.
      </p>

      <h2>2. Apontando o PHP para o Mercury</h2>
      <p>Abra o <code>php.ini</code> e procure pela seção <code>[mail function]</code>:</p>
      <CodeBlock language="ini" code={`[mail function]
; Para Windows
SMTP = localhost
smtp_port = 25
sendmail_from = noreply@meusite.local

; Para Linux/macOS, deixe SMTP/smtp_port comentados e use:
sendmail_path = "/usr/sbin/sendmail -t -i"
; Em Linux com Mercury raramente é o caso (Mercury é prático em Windows).
; Em distros, o usual é instalar Postfix ou ssmtp e apontar para um SMTP de verdade.

; Limites úteis
mail.add_x_header = On         ; adiciona X-PHP-Originating-Script no cabeçalho
; mail.log = "C:/xampp/php/logs/mail.log"   ; loga TODA chamada a mail()`} />
      <p>
        Reinicie o Apache. Pronto — todo <code>mail()</code> agora vai pelo
        Mercury.
      </p>

      <h2>3. Testando o envio</h2>
      <CodeBlock title="htdocs/teste-email.php" language="php" code={`<?php
$para = 'destinatario@meusite.local';
$assunto = 'Teste do XAMPP via Mercury';
$mensagem = "Se voce ta vendo isso, o Mercury entregou.\\nValeu!";
$headers = [
    'From: noreply@meusite.local',
    'Reply-To: noreply@meusite.local',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion()
];

if (mail($para, $assunto, $mensagem, implode("\\r\\n", $headers))) {
    echo 'Email passou para o Mercury com sucesso.';
} else {
    echo 'Falhou. Confira mercury rodando e php.ini configurado.';
    echo '<pre>' . print_r(error_get_last(), true) . '</pre>';
}`} />
      <p>
        Após acessar <code>http://localhost/teste-email.php</code>, abra o
        Mercury → menu <em>File → Queues</em>. A mensagem deve aparecer na
        fila de entrega. Se o destino é local (
        <code>@meusite.local</code>), ela cai direto na caixa local em{" "}
        <code>C:/xampp/MercuryMail/MAIL/&lt;usuario&gt;/</code>.
      </p>

      <h2>4. Caminho moderno: PHPMailer + Mercury (ou Mailtrap)</h2>
      <p>
        A função <code>mail()</code> do PHP é limitada (sem TLS nativo no
        Windows, anexos sofisticados são complicados, sem reaproveitar
        conexão). O padrão hoje é usar <strong>PHPMailer</strong> ou{" "}
        <strong>Symfony Mailer</strong>:
      </p>
      <CodeBlock language="bash" code={`composer require phpmailer/phpmailer
# ou
composer require symfony/mailer`} />
      <CodeBlock title="enviar.php (PHPMailer)" language="php" code={`<?php
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\\PHPMailer\\PHPMailer;
use PHPMailer\\PHPMailer\\Exception;

$mail = new PHPMailer(true);
try {
    // Servidor SMTP — Mercury local
    $mail->isSMTP();
    $mail->Host       = 'localhost';
    $mail->Port       = 25;
    $mail->SMTPAuth   = false;
    $mail->CharSet    = 'UTF-8';
    // Em produção (SendGrid, Mailgun etc):
    // $mail->Host = 'smtp.sendgrid.net';
    // $mail->Port = 587;
    // $mail->SMTPAuth = true;
    // $mail->Username = 'apikey';
    // $mail->Password = getenv('SENDGRID_API_KEY');
    // $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

    $mail->setFrom('noreply@meusite.local', 'Loja Local');
    $mail->addAddress('cliente@exemplo.com', 'Cliente Teste');
    $mail->addReplyTo('contato@meusite.local');

    $mail->isHTML(true);
    $mail->Subject = 'Pedido #1234 confirmado';
    $mail->Body    = '<h1>Obrigado!</h1><p>Seu pedido foi <b>confirmado</b>.</p>';
    $mail->AltBody = 'Obrigado! Seu pedido foi confirmado.';

    // Anexo
    // $mail->addAttachment(__DIR__ . '/boleto.pdf', 'boleto.pdf');

    $mail->send();
    echo 'Email enviado!';
} catch (Exception $e) {
    echo "Falha: {$mail->ErrorInfo}";
}`} />

      <PracticeBox
        title="Configurar Mercury para enviar localmente"
        goal="Conseguir disparar um email pelo PHP e vê-lo no Mercury."
        steps={[
          "Marque Mercury no instalador (ou reinstale o XAMPP marcando-o)",
          "Painel → Start ao lado de Mercury",
          "Abra o ícone do Mercury na bandeja",
          "Em Configuration → Protocol Modules, confirme que MercuryS (SMTP) está habilitado",
          "Edite php.ini: SMTP = localhost / smtp_port = 25 / sendmail_from = noreply@meusite.local",
          "Reinicie o Apache",
          "Crie htdocs/teste-email.php com mail() e acesse no navegador",
          "No Mercury, clique em File → Queues e veja a fila de mensagens",
          "Bônus: instale PHPMailer e mande um e-mail HTML com anexo",
        ]}
        verify="O echo do PHP diz 'Email passou para o Mercury com sucesso' e a mensagem aparece em File → Queues do Mercury."
      />

      <h2>5. Alternativa moderna: MailHog / Mailpit</h2>
      <p>
        <strong>MailHog</strong> é um SMTP fake com interface web bonita em{" "}
        <code>http://localhost:8025</code>. Tudo que chega aparece numa
        caixa de entrada visual — perfeito para desenvolvimento. O projeto
        está parado, mas o sucessor <strong>Mailpit</strong> (mesmas ideias,
        ativamente mantido) é a recomendação atual.
      </p>
      <CodeBlock language="bash" code={`# MailHog — baixe o binário em https://github.com/mailhog/MailHog/releases
# (escolha mailhog_windows_amd64.exe se Windows)
mailhog.exe
# SMTP: 1025  |  Web UI: 8025

# Mailpit (recomendado, mantido) — https://github.com/axllent/mailpit
# Baixe binário e rode:
mailpit
# SMTP: 1025  |  Web UI: 8025`} />
      <CodeBlock title="php.ini com MailHog/Mailpit" language="ini" code={`SMTP = localhost
smtp_port = 1025`} />
      <p>
        Acesse <code>http://localhost:8025</code> para ver os e-mails — com
        preview HTML, raw source, anexos clicáveis e tudo.
      </p>

      <h2>6. Alternativa em nuvem: Mailtrap</h2>
      <p>
        <strong>Mailtrap.io</strong> é um SMTP fake hospedado. Vantagem: sem
        instalar nada e o time todo enxerga a mesma caixa. Desvantagem:
        precisa de internet e tem cota mensal no plano grátis.
      </p>
      <CodeBlock title=".env do Laravel com Mailtrap" language="bash" code={`MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=seu-usuario-do-painel
MAIL_PASSWORD=sua-senha
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=teste@meusite.local
MAIL_FROM_NAME="Loja Local"`} />

      <h2>Erros comuns ao mexer com Mercury</h2>
      <ul>
        <li>
          <strong>"could not connect to mail server"</strong> — Mercury não
          está rodando, ou a porta 25 está bloqueada (antivírus, firewall do
          Windows).
        </li>
        <li>
          <strong>"Relaying denied"</strong> — Mercury por padrão só aceita
          relay para domínios locais. Para mandar para fora (Gmail etc),
          precisa configurar em <em>Configuration → Mercury Core (MercuryC)
          configuration</em> o servidor SMTP de saída (smarthost).
        </li>
        <li>
          <strong>mail() retorna true mas nada chega</strong> — quase certo
          que o Mercury aceitou, tentou entregar e o destino recusou. Olhe a
          aba <em>Core process queue</em> e os logs do Mercury (
          <code>mercury.log</code>).
        </li>
        <li>
          <strong>Acentos zoados</strong> — o cabeçalho{" "}
          <code>Content-Type: text/plain; charset=UTF-8</code> precisa estar
          presente. Se o assunto também tem acento, codifique:{" "}
          <code>=?UTF-8?B?'.base64_encode($assunto).'?=</code>.
        </li>
      </ul>

      <AlertBox type="success" title="Em produção, esqueça SMTP local">
        Use serviços profissionais como <strong>SendGrid</strong>,{" "}
        <strong>Mailgun</strong>, <strong>Amazon SES</strong>,{" "}
        <strong>Postmark</strong>, <strong>Resend</strong> ou o SMTP da sua
        hospedagem. SMTP em IP residencial é bloqueado por quase todos os
        provedores (cai em spam ou nem entrega). E configure SPF, DKIM e
        DMARC no DNS do seu domínio — sem eles, mesmo um SendGrid bem
        configurado pode acabar marcado como suspeito.
      </AlertBox>
    </PageContainer>
  );
}
