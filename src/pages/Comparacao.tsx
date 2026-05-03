import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function Comparacao() {
  return (
    <PageContainer
      title="XAMPP vs WAMP vs MAMP vs LAMP — qual escolher?"
      subtitle="Os concorrentes, as diferenças reais, quando cada um faz sentido. Inclui Laragon, Docker, Herd e os caminhos modernos para subir um stack PHP+MySQL local."
      difficulty="iniciante"
      timeToRead="9 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Útil já ter lido <a href="#/o-que-e-xampp">O que é o XAMPP</a>. Não
        precisa ter testado as alternativas — vamos passar por cada uma.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Stack</strong> — pilha de tecnologias que rodam juntas. Para
        PHP, o stack clássico é Apache + MySQL + PHP no Linux (LAMP).
      </p>
      <p>
        <strong>AMP</strong> — sigla genérica que aparece nos nomes (Apache,
        MySQL, PHP). A primeira letra muda conforme o sistema:{" "}
        <code>L</code> de Linux, <code>W</code> de Windows, <code>M</code> de
        Mac, <code>X</code> de Cross-platform.
      </p>
      <p>
        <strong>Containerização</strong> — encapsular o stack inteiro em
        contêineres isolados (Docker). Cada projeto pode ter sua própria
        versão de PHP, MySQL etc., sem conflito global.
      </p>

      <h2>Família AMP — comparativo direto</h2>
      <ParamsTable
        title="Os 4 principais 'AMPs'"
        params={[
          { flag: "LAMP", desc: "Linux + Apache + MySQL + PHP. É o stack padrão de produção. Não tem instalador único: você instala cada componente pelo gerenciador de pacotes da distro (apt, dnf, pacman). É o que está na sua hospedagem real." },
          { flag: "WAMP", desc: "Windows + Apache + MySQL + PHP. Distribuído pelo WampServer (wampserver.com). Só Windows. Vem com phpMyAdmin e SQLBuddy. Permite trocar versões do PHP no mesmo painel — ponto forte sobre o XAMPP." },
          { flag: "MAMP", desc: "Mac + Apache + MySQL + PHP. Pago em sua versão Pro (com nginx, hosts, SSL pronto). A versão grátis é minimalista. Só macOS (e tem MAMP Windows também, mas pouco usado)." },
          { flag: "XAMPP", desc: "Cross-platform — Windows, Linux e macOS. Mantido pela Apache Friends. Vem com Apache, MariaDB (no lugar do MySQL), PHP, Perl, phpMyAdmin, Mercury, FileZilla, Tomcat. É o mais 'pesado' — o objetivo dele é incluir tudo que estudante/professor possa precisar." },
        ]}
      />

      <h2>Onde cada um brilha</h2>
      <ul>
        <li>
          <strong>XAMPP</strong> — você quer 1 instalador que resolve tudo,
          inclusive Tomcat e SMTP. Multiplataforma. Material didático em
          português abundante.
        </li>
        <li>
          <strong>WampServer</strong> — Windows-only, mas troca versões de
          PHP/MariaDB no clique direito do tray. Prático se você troca de
          PHP 7.x ↔ 8.x com frequência.
        </li>
        <li>
          <strong>MAMP</strong> — Mac, com versão Pro paga que automatiza
          virtual hosts e HTTPS. Boa interface gráfica.
        </li>
        <li>
          <strong>LAMP nativo</strong> — quando seu desenvolvimento é em
          Linux e você quer reproduzir exatamente o que terá em produção.
        </li>
      </ul>

      <h2>Alternativas modernas</h2>
      <ParamsTable
        title="Outras opções que valem conhecer"
        params={[
          { flag: "Laragon (Windows)", desc: "Concorrente moderno do WAMP/XAMPP. Cria virtual hosts com domínios .test automaticamente, troca PHP em segundos, vem com Node, Composer, Git, Redis. Menos pesado e mais 'zero config' que o XAMPP." },
          { flag: "Laravel Herd (Mac/Win)", desc: "Sucessor do Valet. Stack PHP nativo super rápido, .test domains, isolamento por projeto. Especialmente bom para Laravel — daí o nome." },
          { flag: "Valet (Mac)", desc: "Pacote oficial do Laravel para macOS. Usa Nginx + DnsMasq. Cria domínios .test, troca PHP via Homebrew. Leve." },
          { flag: "Docker / Docker Compose", desc: "Cada projeto define seu próprio stack em docker-compose.yml. PHP 8.3 num projeto, 7.4 em outro, sem conflito. Padrão profissional hoje." },
          { flag: "DDEV / Lando", desc: "Camadas em cima do Docker que pré-configuram stacks de WordPress/Drupal/Laravel. Comando único para subir/derrubar." },
          { flag: "PHP embutido (php -S)", desc: "Para um teste rápido de uma página PHP, basta cd na pasta e rodar php -S 0.0.0.0:8000. Sem stack, sem instalador." },
        ]}
      />

      <h2>XAMPP vs Docker — a comparação que mais aparece</h2>
      <ParamsTable
        title="Quando vale a pena cada um"
        params={[
          { flag: "Iniciante absoluto", desc: "XAMPP. Instalou, abriu o navegador, está pronto. Docker tem curva de aprendizado." },
          { flag: "Estudo pessoal de PHP/MySQL", desc: "XAMPP. Sem complicação, sem yml, sem comando." },
          { flag: "Vários projetos com PHP/MySQL diferentes", desc: "Docker. Isolamento por projeto, sem brigar de versão global." },
          { flag: "Replicar EXATAMENTE produção", desc: "Docker. Você usa as mesmas imagens em dev e em deploy." },
          { flag: "Equipe com 'no meu PC funciona'", desc: "Docker. Mesma imagem para todo mundo, mesmo SO base." },
          { flag: "PC modesto, sem virtualização", desc: "XAMPP. Docker em Windows precisa de WSL2/Hyper-V." },
        ]}
      />

      <h2>Por que mantemos o XAMPP em 2026</h2>
      <p>
        Mesmo com Docker dominando equipes profissionais, o XAMPP continua
        sendo a porta de entrada mais simples para PHP em escolas, faculdades
        e estudo individual. A documentação é farta, o material em português
        é abundante e qualquer tutorial de WordPress, Joomla ou Laravel
        antigo presume XAMPP. Saber XAMPP <strong>não é desatualizado</strong>
        {" "}— é o ABC do stack PHP local.
      </p>

      <AlertBox type="success" title="Recomendação prática">
        Está aprendendo? <strong>XAMPP</strong>. Vai trabalhar profissional?
        Aprenda <strong>Docker</strong> também — mas continue com XAMPP para
        protótipos rápidos e quando estiver longe do laptop principal.
      </AlertBox>
    </PageContainer>
  );
}
