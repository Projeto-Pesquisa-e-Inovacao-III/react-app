import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./routes/User/Register";
import EditUser from "./routes/EditUser";
import Logout from "./routes/User/Logout";
import ViewSchedule from "./routes/Schedule";
import Login from "./routes/User/Login";
import ForgotPassword from "./routes/User/ForgotPassword";
import {Overview} from "./routes/Overview";
function App() {


  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/" element={<ViewSchedule />} />
          <Route path="/home" element={<Overview />} />
          <Route path="/schedule" element={<ViewSchedule />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/edit-user" element={<EditUser />} />
          <Route path="/logout" element={<Logout />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );

}

export default App;
