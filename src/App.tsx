import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./routes/User/Login/Login";
import Home from "./routes/Home/Home";
import Register from "./routes/User/Register/Register";
import EditUser from "./routes/EditUser/EditUser";
import Logout from "./routes/User/Logout/Logout";
import ViewSchedule from "./routes/Schedule/Schedule";
import ForgotPassword from "./routes/User/ForgotPassword/ForgotPassword";
import { CheckSchedule } from "./routes/Personal/CheckSchedule/CheckSchedule";
import { Overview } from "./routes/Overview/Overview";
import { Packages } from "./routes/Packages/Packages";
import ListUsers from "./routes/ListUsers/ListUsers"
import Layout from "./components/Layout/Layout";
import { useState, createContext } from "react";
import PlansHistory from "./routes/PlansHistory/PlansHistory";
import Dashboard from "./routes/Personal/Dashboard/dashboard";
import PlansHistoryDetails from "./routes/PlansHistoryDetails/PlansHistoryDetails";
import ViewUserData from "./routes/Personal/ViewUserData/ViewUserData";
import MoreOptions from "./routes/MoreOptions/MoreOptions";

// todo: 
// safari support // deixa baixo
// study if code is following best practices

export const TypeContext = createContext<"student" | "personal">("student");

function App() {
  const [type, setType] = useState<"student" | "personal">("student");

  return (
    <>
      <TypeContext.Provider value={type}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/logout" element={<Logout />} />

            {/* header / logo at mobile*/}
            <Route element={<Layout />}>
              <Route path="/plans-history" element={<PlansHistory />} />
              <Route path="/plans-history-details" element={<PlansHistoryDetails />} />
              <Route path="/schedule" element={<ViewSchedule />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/home" element={<Overview />} />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<ListUsers />} />
              <Route path="/users/view-user-data" element={<ViewUserData />} />
              <Route path="/edit-user" element={<EditUser />} />
              <Route path="/personal/check-schedule" element={<CheckSchedule />} />
              <Route path="/more-options" element={<MoreOptions />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TypeContext.Provider>
    </>
  );
}

export default App;
