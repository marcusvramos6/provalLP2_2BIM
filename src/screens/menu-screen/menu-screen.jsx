import Page from "../../components/page";

export default function MenuScreen() {
  return (
    <Page>
      <div className="container mt-4">
        <h2>
          Bem-vindo ao Sistema de Cadastro de Usuários e Sala de Bate-Papo
        </h2>
        <p>O sistema oferece as seguintes funcionalidades:</p>
        <ul>
          <li>
            Cadastro de usuários: Permite registrar novos usuários no sistema.
          </li>
          <li>
            Sala de bate-papo: Permite a interação entre usuários através de
            mensagens em tempo real.
          </li>
        </ul>
        <p>
          Este sistema proporciona uma maneira fácil de cadastrar novos usuários
          e possibilita a interação entre eles através de um chat de mensagens
          em uma sala de bate-papo.
        </p>
        <p>Sinta-se à vontade para explorar as funcionalidades disponíveis!</p>
      </div>
    </Page>
  );
}
