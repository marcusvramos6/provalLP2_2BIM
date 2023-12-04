import { BrowserRouter, Route, Routes } from "react-router-dom";
import MenuScreen from "./screens/menu-screen/menu-screen.jsx";
import { RegisterUser } from "./screens/register-user-screen/register-user-screen.jsx";
import Page from "./components/page.jsx";
import { Chat } from "./screens/chat-screen/chat-screen.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";

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
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
