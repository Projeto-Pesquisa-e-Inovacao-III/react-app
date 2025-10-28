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
import Layout from "./components/Layout/Layout";
import { useState } from "react";
import { PrivateRoute } from "./services/privateRoute";


// todo: 
// swap one KPI on the dashboard // ??? (what KPI?) (what to swap with?)

//future improvements:
// safari support // deixa baixo
// find gaps
// study if code is following best practices
// editar/delete usuario


function App() {
  const [hasHeader, setHasHeader] = useState(true);
  const [type, setType] = useState<"student" | "personal">("student");

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/logout" element={<Logout />} />

          {/* header */}
          <Route element={<Layout type={type} changeTypeTo={setType} />}>
            <Route path="/schedule" element={<ViewSchedule />} />
            <Route path="/packages" element={<Packages type={type} />} />
            <Route path="/home" element={<Overview isPrestador={type === "personal"} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<ListUsers />} />
            <Route path="/edit-user" element={<EditUser />} />
            <Route path="/personal/check-schedule" element={<CheckSchedule />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );


}

export default App;
