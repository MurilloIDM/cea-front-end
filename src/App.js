import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import Login from "./pages/Login";
import PasswordRecovery from "./pages/PasswordRecovery";

import LeadsList from "./pages/LeadsList";
import StudentList from "./pages/StudentList";

import FreePostList from "./pages/FreePostList";
import FreePostRegister from "./pages/FreePostRegister";

import ExclusivePostList from "./pages/ExclusivePostList";
import ExclusivePostRegister from "./pages/ExclusivePostRegister";
import ExclusivePostComments from "./pages/ExclusivePostComments";

import AdministratorList from "./pages/AdministratorList";
import AdministratorRegister from "./pages/AdministratorRegister";

import "./styles/less/common.less";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            element={(
              <PrivateRoute>
                <AdministratorList />
              </PrivateRoute>
            )}
            path="/administradores/listagem"
          />

          <Route
            element={(
              <PrivateRoute>
                <AdministratorRegister />
              </PrivateRoute>
            )}
            path="/administradores/cadastro"
          />

          <Route
            element={(
              <PrivateRoute>
                <AdministratorRegister />
              </PrivateRoute>
            )}
            path="/administradores/cadastro"
          />

          <Route
            element={(
              <PrivateRoute>
                <AdministratorRegister isEdit />
              </PrivateRoute>
            )}
            path="/administradores/edicao/:id"
          />

          <Route
            element={(
              <PrivateRoute>
                <FreePostList />
              </PrivateRoute>
            )}
            path="/conteudo-gratuito/listagem"
          />

          <Route
            element={(
              <PrivateRoute>
                <FreePostRegister />
              </PrivateRoute>
            )}
            path="/conteudo-gratuito/cadastro"
          />

          <Route
            element={(
              <PrivateRoute>
                <FreePostRegister isEdit />
              </PrivateRoute>
            )}
            path="/conteudo-gratuito/edicao/:id"
          />
          <Route
            element={(
              <PrivateRoute>
                <LeadsList />
              </PrivateRoute>
            )}
            path="/leads/listagem"
          />
          <Route
            element={(
              <PrivateRoute>
                <ExclusivePostComments />
              </PrivateRoute>
            )}
            path="/conteudo-exclusivo/comentarios"
          />

          <Route
            element={(
              <PrivateRoute>
                <ExclusivePostList />
              </PrivateRoute>
            )}
            path="/conteudo-exclusivo/listagem"
          />

          <Route
            element={(
              <PrivateRoute>
                <ExclusivePostRegister />
              </PrivateRoute>
            )}
            path="/conteudo-exclusivo/cadastro"
          />

          <Route
            element={(
              <PrivateRoute>
                <ExclusivePostRegister isEdit />
              </PrivateRoute>
            )}
            path="/conteudo-exclusivo/edicao/:id"
          />

          <Route
            element={(
              <PrivateRoute>
                <LeadsList />
              </PrivateRoute>
            )}
            path="/leads/listagem"
          />

          <Route
            element={(
              <PrivateRoute>
                <StudentList />
              </PrivateRoute>
            )}
            path="/alunos/listagem"
          />

          <Route
            element={<PasswordRecovery />}
            path="/recuperacao-senha"
          />

          <Route
            element={<Login />}
            path="/"
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;