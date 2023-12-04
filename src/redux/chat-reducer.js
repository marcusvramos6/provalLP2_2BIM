import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from "../recursos/estado";
const urlBase = "https://backend-bcc-2-b.vercel.app/mensagem";

export const buscarMensagens = createAsyncThunk(
  "mensagem/buscarMensagens",
  async () => {
    try {
      const resposta = await fetch(urlBase, { method: "GET" });
      const dados = await resposta.json();
      if (dados.status) {
        return {
          status: true,
          listaMensagens: dados.listaMensagens,
          mensagem: "",
        };
      } else {
        return {
          status: false,
          listaMensagens: [],
          mensagem:
            "Ocorreu um erro ao recuperar as mensagens da base de dados.",
        };
      }
    } catch (erro) {
      return {
        status: false,
        listaMensagens: [],
        mensagem:
          "Ocorreu um erro ao recuperar as mensagens da base de dados:" +
          erro.message,
      };
    }
  }
);

export const adicionarMensagem = createAsyncThunk(
  "mensagem/adicionar",
  async (message) => {
    const resposta = await fetch(urlBase, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        usuario: {
          id: Number(message.selectedUser),
        },
        mensagem: message.mensagem,
      }),
    }).catch((erro) => {
      return {
        status: false,
        mensagem: "Ocorreu um erro ao adicionar o user:" + erro.message,
      };
    });
    if (resposta.ok) {
      const dados = await resposta.json();
      return {
        status: dados.status,
        mensagem: dados.mensagem,
        message: message.mensagem,
      };
    } else {
      return {
        status: false,
        mensagem: "Ocorreu um erro ao adicionar o user.",
        message: message.mensagem,
      };
    }
  }
);

export const toggleReadStatus = createAsyncThunk(
  "mensagem/toggleReadStatus",
  async ({ messageId, statusAtual }) => {
    try {
      const response = await fetch(`${urlBase}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: messageId,
          lido: !statusAtual,
        }),
      });

      if (response.ok) {
        const dados = await response.json();
        return {
          status: dados.status,
          mensagem: dados.mensagem,
          messageId,
        };
      } else {
        throw new Error(
          "Ocorreu um erro ao atualizar o status de leitura da mensagem."
        );
      }
    } catch (error) {
      return {
        status: false,
        mensagem: "Erro ao atualizar o status de leitura: " + error.message,
      };
    }
  }
);

export const setEstadoOcioso = () => (dispatch) => {
  setTimeout(() => {
    dispatch(chatSlice.actions.estadoOcioso());
  }, 3000);
};

const initialState = {
  estado: ESTADO.OCIOSO,
  mensagem: "",
  listaMensagens: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    estadoOcioso(state, action) {
      state.estado = ESTADO.OCIOSO;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(buscarMensagens.pending, (state, action) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Buscando mensagens...";
      })
      .addCase(buscarMensagens.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.estado = ESTADO.SUCESSO;
          state.mensagem = action.payload.mensagem;
          state.listaMensagens = action.payload.listaMensagens;
        } else {
          state.estado = ESTADO.ERRO;
          state.mensagem = action.payload.mensagem;
        }
      })
      .addCase(buscarMensagens.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.error.message;
      })
      .addCase(adicionarMensagem.fulfilled, (state, action) => {
        state.estado = ESTADO.SUCESSO;
        state.mensagem = action.payload.mensagem;
      })
      .addCase(adicionarMensagem.pending, (state, action) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Adicionando mensagem...";
      })
      .addCase(adicionarMensagem.rejected, (state, action) => {
        state.mensagem =
          "Erro ao adicionar a mensagem: " + action.error.message;
        state.estado = ESTADO.ERRO;
      })
      .addCase(toggleReadStatus.fulfilled, (state, action) => {
        const messageId = action.payload;
        const messageToUpdate = state.listaMensagens.find(
          (message) => message.id === messageId
        );
        if (messageToUpdate) {
          messageToUpdate.lida = !messageToUpdate.lida; // Inverte o estado de lida (lida <-> não lida)
        }
      });
  },
});

export default chatSlice.reducer;
