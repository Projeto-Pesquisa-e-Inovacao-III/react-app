import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./routes/User/Login/Login";
import Home from "./routes/Home/Home";
import Register from "./routes/User/Register/Register";
import EditUser from "./routes/EditUser/EditUser";
import Logout from "./routes/User/Logout/Logout";
import ViewSchedule from "./routes/Schedule/ViewSchedule";
import ForgotPassword from "./routes/User/ForgotPassword/ForgotPassword";
import { CheckSchedule } from "./routes/Personal/CheckSchedule/CheckSchedule";
import { Overview } from "./routes/Overview/Overview";
import { Packages } from "./routes/Packages/Packages";
import Dashboard from "./routes/Personal/Dashboard/dashboard";
import ListUsers from "./routes/ListUsers/ListUsers"

// To do list:
// safari support // deixa baixo
// header mobile is a fucking svg instead of a fucking Link. 
// when rescheduling, success modal should say "Reagendamento feito com sucesso"

// institucional/prototipo:
// preços mais caros devem vir primeiro
// fabio mais para a direita
// botoes centralizados pacotes
// texto no inicio deve apresentar que site também são para idosos
// botoes centralizados no mobile

// tela logado:
// datas formatadas no home // isso o joao vai fazer
// packages icon and text should be at the same text // suave

// arquitetura:
// quem gera logs?
// glacier
// internet
// servidor aplicacao tomcat

// teste de usuabilidade:
// colocar resultados dos testes


function App() {


  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Overview />} />
          <Route path="/schedule" element={<ViewSchedule />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/edit-user" element={<EditUser />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/users" element={<ListUsers />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/personal/check-schedule" element={<CheckSchedule />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );


}

export default App;
