import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { buscarUsers } from "../../redux/user-reducer";
import {
  adicionarMensagem,
  buscarMensagens,
  deleteMessage,
  setEstadoOcioso,
  toggleReadStatus,
} from "../../redux/chat-reducer";
import ESTADO from "../../recursos/estado";
import { Alert } from "react-bootstrap";

export const Chat = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviado, setEnviado] = useState(false);
  // const [conversations, setConversations] = useState([]);
  const dispatch = useDispatch();
  const { listaUsuarios } = useSelector((state) => state.user);
  const { estado, listaMensagens } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(buscarUsers());
    dispatch(buscarMensagens());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMensagem(e.target.value);
  };

  const subtractThreeHours = (timestamp) => {
    const date = new Date(timestamp);
    date.setHours(date.getHours() - 3); // Subtraindo 3 horas
    return date.toLocaleString(); // Convertendo para string no formato desejado
  };

  const isMessageOld = (messageTimestamp) => {
    const messageTime = new Date(messageTimestamp).getTime();
    const currentTime = new Date().getTime();
    const differenceInMinutes = Math.floor(
      (currentTime - messageTime) / (1000 * 60)
    ); // Diferença em minutos

    return differenceInMinutes > 5;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedUser !== "" && mensagem !== "") {
      console.log(selectedUser, mensagem);
      dispatch(adicionarMensagem({ selectedUser, mensagem }))
        .then((response) => {
          if (response.payload.status) {
            dispatch(buscarMensagens());
            setEnviado(true);
            setEstadoOcioso(true);
          } else {
            console.log(
              "Erro ao adicionar mensagem:",
              response.payload.mensagem
            );
          }
        })
        .catch((error) => {
          console.log("Erro ao adicionar mensagem:", error);
        });
    }
    setSelectedUser("");
    setMensagem("");
  };

  const handleToggleReadStatus = (messageId, statusAtual) => {
    dispatch(toggleReadStatus({ id: messageId, status: statusAtual }))
      .then((response) => {
        if (response.payload.status) {
          dispatch(buscarMensagens());
          setEstadoOcioso(true);
        } else {
          console.log("Erro ao adicionar mensagem:", response.payload.mensagem);
        }
      })
      .catch((error) => {
        console.log("Erro ao adicionar mensagem:", error);
      });
  };

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h3>Conversas</h3>
        {listaMensagens.map((conversation, index) => {
          return (
            <div key={index} className="d-flex align-items-center mb-2">
              <img
                src={conversation.usuario?.urlAvatar ?? "avatar"}
                alt={conversation.usuario?.nickname ?? "nickname"}
                className="rounded-circle me-2"
                style={{ width: "30px", height: "30px" }}
              />
              <span>
                <strong>{conversation.usuario.nickname}:</strong>{" "}
                {conversation.mensagem}
                <br />
                <small>Enviada em: {subtractThreeHours(conversation.dataHora)}</small>
                <br />
                <button
                  onClick={() =>
                    handleToggleReadStatus(conversation.id, conversation.lida)
                  }
                  className="btn btn-sm btn-outline-primary"
                >
                  {conversation.lida
                    ? "Marcar como Não Lida"
                    : "Marcar como Lida"}
                </button>
                <button
                  onClick={() => dispatch(deleteMessage(conversation.id))}
                  className="btn btn-sm btn-danger ms-2"
                  disabled={isMessageOld(subtractThreeHours(conversation.dataHora))}
                >
                  Excluir
                </button>
              </span>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="selectUser" className="form-label">
            Selecione o Usuário:
          </label>
          <select
            className="form-select"
            id="selectUser"
            value={selectedUser}
            onChange={handleUserChange}
            required
          >
            <option value="">Selecione um usuário</option>
            {listaUsuarios.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nickname}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            Digite a Mensagem:
          </label>
          <textarea
            className="form-control"
            id="message"
            value={mensagem}
            onChange={handleMessageChange}
            rows="3"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={estado === ESTADO.PENDENTE}
        >
          {estado === ESTADO.PENDENTE ? (
            <div className="d-flex justify-content-center align-items-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </div>
          ) : (
            "Enviar"
          )}
        </button>

        {enviado && estado === ESTADO.SUCESSO && (
          <Alert variant="success" className="mt-3">
            Mensagem cadastrada com sucesso!
          </Alert>
        )}
      </form>
    </div>
  );
};
