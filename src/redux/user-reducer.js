import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from "../recursos/estado";
const urlBase = "https://backend-bcc-2-b.vercel.app/usuario";

export const buscarUsers = createAsyncThunk("user/buscarUsers", async () => {
  try {
    const resposta = await fetch(urlBase, { method: "GET" });
    const dados = await resposta.json();
    if (dados.status) {
      return {
        status: true,
        listaUsuarios: dados.listaUsuarios,
        mensagem: "",
      };
    } else {
      return {
        status: false,
        listaUsuarios: [],
        mensagem: "Ocorreu um erro ao recuperar os users da base de dados.",
      };
    }
  } catch (erro) {
    return {
      status: false,
      listaUsuarios: [],
      mensagem:
        "Ocorreu um erro ao recuperar os users da base de dados:" +
        erro.message,
    };
  }
});

export const adicionarUser = createAsyncThunk(
  "user/adicionar",
  async (user) => {
    const resposta = await fetch(urlBase, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
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
        user,
      };
    } else {
      return {
        status: false,
        mensagem: "Ocorreu um erro ao adicionar o user.",
        user,
      };
    }
  }
);

export const setEstadoOcioso = () => (dispatch) => {
  setTimeout(() => {
    dispatch(userSlice.actions.estadoOcioso());
  }, 3000);
};

const initialState = {
  estado: ESTADO.OCIOSO,
  mensagem: "",
  listaUsuarios: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    estadoOcioso(state, action) {
      state.estado = ESTADO.OCIOSO;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(buscarUsers.pending, (state, action) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Buscando users...";
      })
      .addCase(buscarUsers.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.mensagem = action.payload.mensagem;
          state.listaUsuarios = action.payload.listaUsuarios;
        } else {
          state.estado = ESTADO.ERRO;
          state.mensagem = action.payload.mensagem;
        }
      })
      .addCase(buscarUsers.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.error.message;
      })
      .addCase(adicionarUser.fulfilled, (state, action) => {
        state.estado = ESTADO.SUCESSO;
        state.listaUsuarios.push(action.payload.user);
        state.mensagem = action.payload.mensagem;
      })
      .addCase(adicionarUser.pending, (state, action) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Adicionando user...";
      })
      .addCase(adicionarUser.rejected, (state, action) => {
        state.mensagem = "Erro ao adicionar a user: " + action.error.message;
        state.estado = ESTADO.ERRO;
      });
  },
});

export default userSlice.reducer;
