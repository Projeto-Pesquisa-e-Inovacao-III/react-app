import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./routes/User/Login";
import Home from "./routes/Home";
import Register from "./routes/User/Register";
import EditUser from "./routes/EditUser";
import Logout from "./routes/User/Logout";

function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/edit-user" element={<EditUser />} />
          <Route path="/logout" element={<Logout />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
