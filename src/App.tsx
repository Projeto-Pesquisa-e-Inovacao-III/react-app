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
import ListUsers from "./routes/Personal/ListUsers/ListUsers"
import Layout from "./components/Layout/Layout";
import { useState, createContext } from "react";
import PlansHistory from "./routes/PlansHistory/PlansHistory";
import Dashboard from "./routes/Personal/Dashboard/dashboard";
import PlansHistoryDetails from "./routes/PlansHistoryDetails/PlansHistoryDetails";
import ViewUserData from "./routes/Personal/ViewUserData/ViewUserData";
import MoreOptions from "./routes/MoreOptions/MoreOptions";
import ScheduleHistory from "./routes/ScheduleHistory/ScheduleHistory";
import ScheduleDetails from "./routes/ScheduleDetails/ScheduleDetails";
import SetAvailability from "./routes/Personal/SetAvailability/SetAvailability";
import { PrivateRoute } from "./components/Layout/PrivateRoute";
import NoCodeTool from "./routes/Personal/NoCodeTool/NoCodeTool";

// todo: 
// safari support // deixa baixo

//todo: warning maximum size of 5mb for user image

type UserType = "aluno" | "personal";

type TypeContextType = {
  type: UserType | null;
  setType: React.Dispatch<React.SetStateAction<UserType | null>>;
};

export const TypeContext = createContext<TypeContextType | null>(null);

function App() {
const [type, setType] = useState<UserType | null>(null);

  return (
    <>
      <TypeContext.Provider value={{ type, setType }}>
        <BrowserRouter>
          <Routes>

            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              {/* temp */}  
              <Route path="/no-code-tool" element={<NoCodeTool />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/logout" element={<Logout />} />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/home" element={<Overview />} />
                <Route path="/packages" element={<Packages />} />
                <Route path="/schedule-details" element={<ScheduleDetails />} />
                <Route path="/more-options" element={<MoreOptions />} />
                <Route path="/schedule" element={<ViewSchedule />} />
                <Route path="/edit-user" element={<EditUser />} />
              </Route>
            </Route>

            <Route element={<PrivateRoute allowedRoles={["aluno"]} />}>
              <Route element={<Layout />}>
                <Route path="/plans-history" element={<PlansHistory />} />
                <Route path="/plans-history-details" element={<PlansHistoryDetails />} />
                <Route path="/schedule-history" element={<ScheduleHistory />} />
              </Route>
            </Route>

            <Route element={<PrivateRoute allowedRoles={["personal"]} />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<ListUsers />} />
                <Route path="/users/view-user-data" element={<ViewUserData />} />
                <Route path="/set-availability" element={<SetAvailability />} />
                <Route path="/personal/check-schedule" element={<CheckSchedule />} />
              </Route>
            </Route>

          </Routes>
        </BrowserRouter>
      </TypeContext.Provider>
    </>
  );
}

export default App;
