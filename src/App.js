import { BrowserRouter, Route, Routes } from "react-router-dom";
import MenuScreen from "./screens/menu-screen/menu-screen.jsx";
import { RegisterUser } from "./screens/register-user-screen/register-user-screen.jsx";
import Page from "./components/page.jsx";
import { Chat } from "./screens/chat-screen/chat-screen.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { Alert } from "react-bootstrap";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/cadastro"
              element={
                <Page>
                  <RegisterUser />
                </Page>
              }
            />
            <Route
              path="/chat"
              element={
                <Page>
                  <Chat />
                </Page>
              }
            />
            <Route path="/" element={<MenuScreen />} />
            <Route
              path="*"
              element={
                <Page>
                  <Alert variant="danger">Essa url não está mapeada</Alert>
                </Page>
              }
            />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
