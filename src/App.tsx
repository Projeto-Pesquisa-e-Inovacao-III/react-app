import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { useState, createContext, lazy, Suspense } from "react";
import Layout from "./components/Layout/Layout";
import { PrivateRoute } from "./components/Layout/PrivateRoute";
import DevSeed from "./routes/Dev/DevSeed";
import PageLoader from "./components/PageLoader/PageLoader";

const Login = lazy(() => import("./routes/User/Login/Login"));
const Home = lazy(() => import("./routes/Home/Home"));
const Register = lazy(() => import("./routes/User/Register/Register"));
const EditUser = lazy(() => import("./routes/EditUser/UserInfomartations/EditUser"));
const Logout = lazy(() => import("./routes/User/Logout/Logout"));
const ViewSchedule = lazy(() => import("./routes/Schedule/Schedule"));
const ForgotPassword = lazy(() => import("./routes/User/ForgotPassword/ForgotPassword"));
const CheckSchedule = lazy(() => import("./routes/Personal/CheckSchedule/CheckSchedule").then(m => ({ default: m.CheckSchedule })));
const Overview = lazy(() => import("./routes/Overview/Overview").then(m => ({ default: m.Overview })));
const Packages = lazy(() => import("./routes/Packages/Packages").then(m => ({ default: m.Packages })));
const ListUsers = lazy(() => import("./routes/Personal/ListUsers/ListUsers"));
const PlansHistory = lazy(() => import("./routes/PlansHistory/PlansHistory"));
const Dashboard = lazy(() => import("./routes/Personal/Dashboard/dashboard"));
const PlansHistoryDetails = lazy(() => import("./routes/PlansHistoryDetails/PlansHistoryDetails"));
const ViewUserData = lazy(() => import("./routes/Personal/ViewUserData/ViewUserData"));
const MoreOptions = lazy(() => import("./routes/MoreOptions/MoreOptions"));
const ScheduleHistory = lazy(() => import("./routes/ScheduleHistory/ScheduleHistory"));
const ScheduleDetails = lazy(() => import("./routes/ScheduleDetails/ScheduleDetails"));
const SetAvailability = lazy(() => import("./routes/Personal/SetAvailability/SetAvailability"));
const SecurityInformations = lazy(() => import("./routes/EditUser/SecurityInformations/SecurityInformations"));
const Anamnesis = lazy(() => import("./routes/User/Anamnesis/anamnesis"));
const AnamnesisInformations = lazy(() => import("./routes/EditUser/AnamnesisInformations/AnamnesisInformations"));
const AddressManagement = lazy(() => import("./routes/EditUser/AddressManagement/AddressManagement"));
const ViewPersonalData = lazy(() => import("./routes/Personal/ViewPersonalData/ViewPersonalData"));
const CreatePersonal = lazy(() => import("./routes/Admin/CreatePersonal/CreatePersonal"));
const PackageSuccess = lazy(() => import("./routes/Packages/PackageSuccess/PackageSuccess"));
const NoCodeTool = lazy(() => import("./routes/Personal/NoCodeTool/NoCodeTool"));

export type Roles = "aluno" | "personal" | "admin";
export type UserType = Roles;

type TypeContextType = {
  type: UserType[] | null;
  setType: React.Dispatch<React.SetStateAction<UserType[] | null>>;
};

export const TypeContext = createContext<TypeContextType | null>(null);

function App() {
  const [type, setType] = useState<UserType[] | null>(null);

  return (
    <TypeContext.Provider value={{ type, setType }}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>

            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              {/* temp */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/logout" element={<Logout />} />
              {/* TODO: remover antes do deploy final */}
              <Route path="/dev-seed" element={<DevSeed />} />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/home" element={<Overview />} />
                <Route path="/packages" element={<Packages />} />
                <Route path="/schedule-details" element={<ScheduleDetails />} />
                <Route path="/more-options" element={<MoreOptions />} />
                <Route path="/schedule" element={<ViewSchedule />} />
                <Route path="/edit-user" element={<EditUser />} />
                <Route path="/edit-user/security" element={<SecurityInformations />} />
              </Route>
            </Route>

            <Route element={<PrivateRoute allowedRoles={["aluno"]} />}>
              <Route element={<Layout />}>
                <Route path="/anamnesis" element={<Anamnesis />} />
                <Route path="/edit-user/anamnesis" element={<AnamnesisInformations />} />
                <Route path="/plans-history" element={<PlansHistory />} />
                <Route path="/plans-history-details" element={<PlansHistoryDetails />} />
                <Route path="/schedule-history" element={<ScheduleHistory />} />
                <Route path="/edit-user/addresses" element={<AddressManagement />} />
                <Route path="/packages/payment-success" element={<PackageSuccess />} />
              </Route>
            </Route>

            <Route element={<PrivateRoute allowedRoles={["personal"]} />}>
              <Route element={<Layout />}>
                <Route path="/users" element={<ListUsers />} />
                <Route path="/users/view-user-data" element={<ViewUserData />} />
                <Route path="/set-availability" element={<SetAvailability />} />
                <Route path="/personal/check-schedule" element={<CheckSchedule />} />
              </Route>
            </Route>


            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<ListUsers />} />
                <Route path="/users/view-user-data" element={<ViewUserData />} />
                <Route path="/users/view-personal-data" element={<ViewPersonalData />} />
                <Route path="/set-availability" element={<SetAvailability />} />
                <Route path="/personal/check-schedule" element={<CheckSchedule />} />
                <Route path="/create-personal" element={<CreatePersonal />} />
                <Route path="/no-code-tool" element={<NoCodeTool />} />
              </Route>
            </Route>

          </Routes>
        </Suspense>
      </BrowserRouter>
    </TypeContext.Provider>
  );
}

export default App;
