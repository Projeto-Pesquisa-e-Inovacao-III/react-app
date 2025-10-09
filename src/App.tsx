import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./routes/User/Login";
import Register from "./routes/User/Register";
import EditUser from "./routes/EditUser";
import Logout from "./routes/User/Logout";
import Calendar from "./components/Calendar";
import CalendarWeek from "./components/CalendarWeek";
import DevDebug from "./components/DevDebug";
import ViewSchedule from "./routes/Schedule";
import { use, useEffect, useState } from "react";

function App() {


  return (
    <BrowserRouter>
      <div className="container">
        {/* todo: remove this  */}
        {/* <DevDebug /> */}
        <Routes>
          <Route path="/" element={<ViewSchedule />} />
          <Route path="/schedule" element={<ViewSchedule />} />
          <Route path="/week" element={<CalendarWeek />} />
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
