import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { ParamsTable } from "@/components/ui/ParamsTable";

export default function Comparacao() {
  return (
    <PageContainer
      title="XAMPP vs WAMP, MAMP e Laragon"
      subtitle="Existem várias opções de stack PHP local. Vamos comparar honestamente para você escolher a certa para o seu caso."
      difficulty="iniciante"
      timeToRead="5 min"
    >
      <p>
        Todos esses projetos resolvem o mesmo problema: rodar Apache + PHP +
        MySQL no seu computador. Mas cada um tem um foco diferente.
      </p>

      <ParamsTable
        title="Comparação rápida — qual escolher"
        params={[
          { flag: "XAMPP", desc: "Multiplataforma (Windows, macOS, Linux). Tem Mercury (SMTP local), FileZilla, Tomcat. Pacote mais completo. Ideal para quem aprende e quer estudar email/FTP/Java junto." },
          { flag: "WAMP", desc: "Apenas Windows. Foco em deixar trocar versão de PHP/Apache/MySQL fácil pelo menu da bandeja. Mais leve que o XAMPP. Não tem ferramentas extras." },
          { flag: "MAMP", desc: "Apenas macOS (e Windows na versão paga). Bem polido visualmente. Versão grátis funciona, mas a Pro ($59) é necessária para múltiplos hosts e PHP per-vhost." },
          { flag: "Laragon", desc: "Apenas Windows. Pré-configurado para Laravel, Symfony, WordPress. Cria virtual hosts automaticamente baseado no nome da pasta. Muito amado pela comunidade Laravel." },
          { flag: "Docker", desc: "Multiplataforma e profissional. Cada projeto fica isolado em containers. Curva de aprendizado maior. É o padrão da indústria hoje." },
        ]}
      />

      <h2>Quando o XAMPP é a melhor escolha</h2>
      <ul>
        <li>Você usa Linux, macOS <em>e</em> Windows e quer a mesma ferramenta nos três.</li>
        <li>Está aprendendo e quer um pacote oficial, mantido há mais de 20 anos.</li>
        <li>Precisa testar envio de email no PHP (Mercury vem incluso).</li>
        <li>Vai rodar Java/Tomcat no mesmo ambiente.</li>
        <li>Quer estudar para uma prova de faculdade que pediu "instale o XAMPP".</li>
      </ul>

      <h2>Quando outra opção brilha mais</h2>
      <ul>
        <li><strong>Está só no Windows e mexe com Laravel?</strong> Laragon é mais ergonômico.</li>
        <li><strong>Quer trocar versão de PHP em 2 cliques?</strong> WAMP tem isso melhor.</li>
        <li><strong>Vai trabalhar em equipe e quer ambiente reprodutível?</strong> Docker é o caminho.</li>
        <li><strong>Está em Linux puro?</strong> Instalar Apache + PHP + MariaDB pelo gerenciador de pacotes (<code>apt</code>, <code>dnf</code>) é mais leve.</li>
      </ul>

      <AlertBox type="info" title="Não dá pra rodar dois ao mesmo tempo">
        XAMPP, WAMP, MAMP e Laragon todos tentam usar a porta 80 (Apache) e
        3306 (MySQL). Se você instalar dois e iniciar o Apache de ambos, vai
        ter erro. Use só um por vez — ou mude as portas.
      </AlertBox>

      <h2>"E o Nginx?"</h2>
      <p>
        Esses pacotes são <strong>Apache</strong>-based. Se quer rodar Nginx
        local, considere alternativas como <strong>WPN-XM</strong> (Windows),
        instalar Nginx + PHP-FPM manualmente em Linux/macOS, ou usar Docker.
        Em produção, Nginx é mais comum hoje — em desenvolvimento, Apache do
        XAMPP é mais que suficiente.
      </p>
    </PageContainer>
  );
}
