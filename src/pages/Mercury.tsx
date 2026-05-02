import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function Mercury() {
  return (
    <PageContainer
      title="Mercury Mail — testando email no XAMPP"
      subtitle="Servidor SMTP local que vem dentro do XAMPP. Para testar mail() do PHP sem precisar do Gmail."
      difficulty="avancado"
      timeToRead="7 min"
    >
      <p>
        Quando você roda <code>mail()</code> no PHP, o XAMPP precisa de um
        SMTP para entregar a mensagem. Em produção, é o servidor da
        hospedagem. Em desenvolvimento, opções são: Mercury (vem no XAMPP),
        MailHog (mais moderno e bonitinho), ou serviços como Mailtrap
        (gratuito até X emails/mês).
      </p>

      <AlertBox type="info" title="Para a maioria, MailHog ou Mailtrap são melhores">
        O Mercury é poderoso mas tem interface dos anos 90 e configuração
        chata. Se a única necessidade é "ver os emails que meu sistema enviaria",
        MailHog ou Mailtrap dão menos trabalho. Mantemos o Mercury aqui porque
        ele já vem instalado no XAMPP.
      </AlertBox>

      <h2>Habilitando o Mercury</h2>
      <ol>
        <li>Confirme no instalador do XAMPP que "Mercury Mail Server" foi marcado.</li>
        <li>No painel, clique em <strong>Start</strong> ao lado de Mercury.</li>
        <li>O ícone do Mercury aparece na bandeja do sistema. Clique duas vezes.</li>
      </ol>
      <p>
        A janela do Mercury é dividida em vários protocolos: SMTP (envio),
        POP3 (recebimento), IMAP, etc. Vamos focar no SMTP.
      </p>

      <h2>Apontando o PHP para o Mercury</h2>
      <p>Abra o <code>php.ini</code> e procure pela seção <code>[mail function]</code>:</p>
      <CodeBlock language="ini" code={`[mail function]
SMTP = localhost
smtp_port = 25
sendmail_from = noreply@meusite.local

; sendmail_path = ""   ← deixe vazio em Windows`} />
      <p>Reinicie o Apache.</p>

      <h2>Testando o envio</h2>
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
}`} />

      <h2>Caminho moderno: PHPMailer + Mercury (ou Mailtrap)</h2>
      <p>
        A função <code>mail()</code> do PHP é limitada (sem TLS, sem
        anexos sofisticados). O padrão hoje é usar <strong>PHPMailer</strong>
        ou <strong>Symfony Mailer</strong>:
      </p>
      <CodeBlock language="bash" code={`composer require phpmailer/phpmailer`} />
      <CodeBlock title="enviar.php" language="php" code={`<?php
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

    $mail->setFrom('noreply@meusite.local', 'Loja Local');
    $mail->addAddress('cliente@exemplo.com', 'Cliente Teste');
    $mail->addReplyTo('contato@meusite.local');

    $mail->isHTML(true);
    $mail->Subject = 'Pedido #1234 confirmado';
    $mail->Body    = '<h1>Obrigado!</h1><p>Seu pedido foi <b>confirmado</b>.</p>';
    $mail->AltBody = 'Obrigado! Seu pedido foi confirmado.';

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
        ]}
        verify="O echo do PHP diz 'Email passou para o Mercury com sucesso' e a mensagem aparece em File → Queues do Mercury."
      />

      <h2>Alternativa moderna: MailHog</h2>
      <p>
        MailHog é um SMTP fake com interface web bonita em{" "}
        <code>http://localhost:8025</code>. Tudo que chega aparece numa caixa
        de entrada visual — perfeito para desenvolvimento.
      </p>
      <CodeBlock language="bash" code={`# Baixe o binário em https://github.com/mailhog/MailHog/releases
# (escolha mailhog_windows_amd64.exe se Windows)

# Rode o mailhog. Ele escuta SMTP na 1025 e web na 8025
mailhog.exe

# No php.ini:
SMTP = localhost
smtp_port = 1025

# Acesse http://localhost:8025 para ver os emails`} />

      <AlertBox type="success" title="Em produção, esqueça SMTP local">
        Use serviços profissionais como SendGrid, Mailgun, Amazon SES,
        Resend ou o SMTP da sua hospedagem. SMTP em IP residencial é
        bloqueado por quase todos os provedores (cai em spam ou nem entrega).
      </AlertBox>
    </PageContainer>
  );
}
