import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { PracticeBox } from "@/components/ui/PracticeBox";

export default function InstalacaoWindows() {
  return (
    <PageContainer
      title="Instalação no Windows"
      subtitle="Do download até o primeiro index.php rodando — em menos de 10 minutos."
      difficulty="iniciante"
      timeToRead="8 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Windows 10 ou 11 (32 ou 64 bits), <strong>5 GB livres</strong> em disco
        e uma conta com permissão de administrador. Sem isso o XAMPP até
        instala, mas o Apache pode falhar em iniciar como serviço.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Instalador</strong> — o arquivo <code>.exe</code> que você baixa
        e que faz todo o trabalho de copiar arquivos, criar atalhos e registrar
        serviços no Windows.
      </p>
      <p>
        <strong>Serviço do Windows</strong> — um programa que roda em segundo
        plano, sem precisar de janela aberta. Você pode configurar o Apache e o
        MariaDB para iniciarem automaticamente assim que o Windows liga.
      </p>
      <p>
        <strong>UAC (User Account Control)</strong> — sistema de proteção do
        Windows que pede confirmação para programas alterarem áreas sensíveis
        (como <code>C:\Program Files</code>). É por isso que vamos instalar
        em <code>C:\xampp</code>, fora da área protegida.
      </p>

      <h2>1. Baixe o instalador oficial</h2>
      <p>
        Acesse{" "}
        <a href="https://www.apachefriends.org/download.html" target="_blank" rel="noreferrer">
          apachefriends.org/download.html
        </a>{" "}
        e baixe o instalador para Windows. Você vai ver várias versões — cada
        uma com uma versão diferente do PHP (8.0, 8.1, 8.2, 8.3...).
      </p>

      <AlertBox type="info" title="Qual versão do PHP escolher?">
        Para projetos novos, escolha sempre a <strong>versão mais recente
        marcada como estável</strong>. Se vai trabalhar em um projeto Laravel
        antigo, WordPress legado ou estudo de faculdade que exige PHP 7.x,
        baixe a versão correspondente.
      </AlertBox>

      <h2>2. Desabilite o antivírus durante a instalação</h2>
      <p>
        O Windows Defender e antivírus de terceiros costumam <strong>atrasar
        muito</strong> a instalação do XAMPP (escaneando cada DLL do Apache e
        do PHP). Pause-os por uns 10 minutos durante a instalação e depois
        ligue de volta — adicionando a pasta <code>C:\xampp</code> à lista de
        exceções.
      </p>

      <h2>3. Cuidado com o UAC e com "Program Files"</h2>
      <AlertBox type="warning" title="NÃO instale em C:\Program Files">
        Esse caminho é protegido pelo Windows (UAC). O Apache precisa escrever
        em arquivos de log e configuração; se instalar lá, vai ter problemas
        de permissão. Use sempre <code>C:\xampp</code> (o padrão sugerido pelo
        instalador).
      </AlertBox>

      <h2>4. Selecione os componentes</h2>
      <p>
        A tela "Select Components" pede o que instalar. O recomendado para
        quem está começando:
      </p>
      <ul>
        <li><strong>Apache</strong> — obrigatório, é o servidor web.</li>
        <li><strong>MySQL</strong> (na verdade MariaDB) — banco de dados.</li>
        <li><strong>PHP</strong> — a linguagem.</li>
        <li><strong>phpMyAdmin</strong> — interface web pra gerenciar o banco.</li>
        <li><strong>Mercury Mail</strong> — opcional, marque se quiser testar envio de email.</li>
        <li><strong>Tomcat</strong> — desmarque se não vai usar Java.</li>
        <li><strong>FileZilla FTP</strong> — desmarque se não vai precisar.</li>
      </ul>

      <h2>5. Execute o instalador como administrador</h2>
      <p>
        Clique com o botão direito no <code>.exe</code> baixado e escolha
        "Executar como administrador". Sem isso o XAMPP até instala, mas o
        Apache pode falhar em iniciar como serviço.
      </p>

      <h2>6. Abra o painel de controle</h2>
      <p>
        Após instalar, abra o "XAMPP Control Panel" pelo menu Iniciar. A
        primeira tela pede o idioma — escolha o que preferir (a tradução PT
        existe mas é parcial; muita gente fica no inglês mesmo).
      </p>

      <h2>7. Inicie Apache e MySQL</h2>
      <p>
        Clique em "Start" do lado de Apache e do lado de MySQL. Os botões
        ficam verdes quando estão rodando. Se algum falhar, pule para o
        capítulo de <a href="#/portas-conflitos">conflitos de portas</a>.
      </p>

      <PracticeBox
        title="Teste se o XAMPP está funcionando"
        goal="Abrir o navegador e ver a tela de boas-vindas do XAMPP."
        steps={[
          "Confirme que Apache está com o nome em verde no painel.",
          "Abra o navegador (Chrome, Firefox, Edge, qualquer um).",
          "Digite na barra de endereço: http://localhost",
          "Você deve ser redirecionado para http://localhost/dashboard/",
          "Aparecendo a tela laranja com 'Welcome to XAMPP', deu certo!",
        ]}
        verify="Você vê a página oficial do XAMPP no navegador, sem erros 'site não pode ser acessado'."
      />

      <h2>8. (Opcional) Instalar como serviço do Windows</h2>
      <p>
        Por padrão você precisa abrir o painel toda vez. Para que o Apache e
        o MySQL iniciem com o Windows, marque os checkboxes "Service" no painel
        (à esquerda dos botões). O painel pedirá privilégios de admin.
      </p>

      <CodeBlock language="powershell" code={`# Verificar se os serviços estão rodando (PowerShell)
Get-Service Apache2.4
Get-Service mysql

# Iniciar/parar manualmente como admin
Start-Service Apache2.4
Stop-Service Apache2.4`} />

      <AlertBox type="success" title="Instalado e funcionando? Próximo passo:">
        Vá para <a href="#/estrutura-pastas">Pastas e htdocs</a> e aprenda
        onde colocar seus arquivos PHP.
      </AlertBox>
    </PageContainer>
  );
}
