import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./routes/User/Register";
import EditUser from "./routes/EditUser";
import Logout from "./routes/User/Logout";
import ViewSchedule from "./routes/Schedule/ViewSchedule";
import Login from "./routes/User/Login";
import ForgotPassword from "./routes/User/ForgotPassword";
import { CheckSchedule } from "./routes/Personal/CheckSchedule";
import {Overview} from "./routes/Overview";
import Dashboard from "./routes/Dashboard/dashboard";
function App() {


  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/" element={<ViewSchedule />} />
          <Route path="/home" element={<Overview />} />
          <Route path="/schedule" element={<ViewSchedule />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/edit-user" element={<EditUser />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/personal/check-schedule" element={<CheckSchedule/>}/>
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );

}

export default App;
