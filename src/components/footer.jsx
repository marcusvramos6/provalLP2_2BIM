export const Footer = (props) => {
  return (
    <footer
      style={{
        position: "fixed",
        border: "1px solid black",
        borderRadius: "5px",
        padding: "5px",
        marginTop: "100px",
        left: 0,
        bottom: 0,
        width: "100%", 
        backgroundColor: "white", 
        textAlign: "center", 
      }}
    >
      <p>{props.conteudo || "Rodapé"}</p>
    </footer>
  );
};
