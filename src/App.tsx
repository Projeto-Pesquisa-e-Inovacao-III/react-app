import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./routes/User/Login";
import Home from "./routes/Home";
import Register from "./routes/User/Register";
import EditUser from "./routes/EditUser";
import DevDebug from "./components/DevDebug";
import Logout from "./routes/User/Logout";

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        {/* todo: remove this  */}
        <DevDebug /> 
        <Routes>
          <Route path="/" element={<Home />} />
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
