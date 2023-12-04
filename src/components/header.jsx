import { Alert } from "react-bootstrap";
export const Header = ({ mensagem }) => {
  return (
    <header>
      <Alert variant="light" className={"text-center"}>
        {mensagem || "Chat"}
      </Alert>
    </header>
  );
};
