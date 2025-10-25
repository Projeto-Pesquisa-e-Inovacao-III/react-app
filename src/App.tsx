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
import Layout from "./components/Layout";
import { useState } from "react";

// todo list:
// safari support // deixa baixo

//text orange in "all ages"

// center text at site
// centered services cards must have 


// institucional/prototipo:
// fabio mais para a direita // make it a div 

// todo: 
// fix personal schedule // (validate)
// include time and date on rescheduling
// show loading state while an appointment's rescheduling is being accepted
// swap one KPI on the dashboard
// replace the large calendar with a weekly view in personal
// organize folders (division between components of specific pages )
// find gaps
// study if code is following best practices


function App() {
  const [hasHeader, setHasHeader] = useState(true);
  const [type, setType] = useState<"student" | "personal">("student");
  
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
      <BrowserRouter>
        <Layout hasHeader={hasHeader} type={type} changeTypeTo={setType}>
          <Routes>
            <Route path="/" element={<Home hasHeader={setHasHeader}/>} />
            <Route path="/schedule" element={<ViewSchedule hasHeader={setHasHeader}/>} />
            <Route path="/packages" element={<Packages type={type} hasHeader={setHasHeader} />} />

            <Route path="/home" element={<Overview isPrestador={type === "personal"} hasHeader={setHasHeader} />} />
            <Route path="/dashboard" element={<Dashboard hasHeader={setHasHeader} />} />
            <Route path="/users" element={<ListUsers hasHeader={setHasHeader} />} />
            <Route path="/edit-user" element={<EditUser hasHeader={setHasHeader} />} />
            <Route path="/personal/check-schedule" element={<CheckSchedule hasHeader={setHasHeader} />} />

            <Route path="/login" element={<Login hasHeader={setHasHeader} />} />
            <Route path="/register" element={<Register hasHeader={setHasHeader} />} />
            <Route path="/forgot-password" element={<ForgotPassword hasHeader={setHasHeader} />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );


}

export default App;
