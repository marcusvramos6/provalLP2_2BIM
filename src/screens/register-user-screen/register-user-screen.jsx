import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { adicionarUser, setEstadoOcioso } from "../../redux/user-reducer";
import ESTADO from "../../recursos/estado";
import { Alert } from "react-bootstrap";

export const RegisterUser = () => {
  const [nickname, setNickname] = useState("");
  const [urlAvatar, setUrlAvatar] = useState("");
  const { estado, mensagem } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleNomeChange = (e) => {
    setNickname(e.target.value);
  };

  const handleImagemChange = (e) => {
    setUrlAvatar(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(adicionarUser({ nickname, urlAvatar }));
    dispatch(setEstadoOcioso());
    setNickname("");
    setUrlAvatar("");
  };

  if (estado === ESTADO.PENDENTE) {
    return (
      <div className="container mt-4">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <div className="spinner-border" role="status">
            <span className="visually-hidden">{mensagem}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Cadastro de Usuário</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">
            Nome:
          </label>
          <input
            type="text"
            className="form-control"
            id="nome"
            value={nickname}
            onChange={handleNomeChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="imagem" className="form-label">
            URL da Imagem:
          </label>
          <input
            type="text"
            className="form-control"
            id="imagem"
            value={urlAvatar}
            onChange={handleImagemChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Cadastrar
        </button>
        {estado === ESTADO.SUCESSO && (
          <Alert variant="success" className="mt-3">Usuário cadastrado com sucesso!</Alert>
        )}
      </form>
    </div>
  );
};
