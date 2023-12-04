import { Header } from "./header";
import { Menu } from "./menu";

export default function Page(props) {
  return (
    <div style={{ marginBottom: "30px" }}>
      <Header mensagem={"Sistema de Bate Papo"} />
      <Menu />
      {props.children}
    </div>
  );
}
