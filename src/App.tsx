import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./routes/User/Register";
import EditUser from "./routes/EditUser/EditUser";
import Logout from "./routes/User/Logout";
import ViewSchedule from "./routes/Schedule/ViewSchedule";
import Login from "./routes/User/Login";
import ForgotPassword from "./routes/User/ForgotPassword";
import { CheckSchedule } from "./routes/Personal/CheckSchedule";
import {Overview} from "./routes/Overview";
import {Packages} from "./routes/Packages"; 
import Dashboard from "./routes/Dashboard/dashboard";
function App() {


  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"/>
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
          <Route path="/packages" element={<Packages />} />
          <Route path="/personal/check-schedule" element={<CheckSchedule/>}/>
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
    </>
  );
  

}

export default App;
