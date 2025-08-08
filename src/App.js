import { Routes, Route } from "react-router-dom";
import Login from "./Authentication/Login";
import Logout from "./Authentication/Logout";
import Users from "./SuperAdmin/Users";
import SuperDashboard from "./SuperAdmin/SuperDashboard";
import UserProfile from "./Pages/Profile";
import ChangePassword from "./Pages/ChangePassword";
import Devices from "./SuperAdmin/Devices";
import Tickets from "./Pages/Tickets";
import Notifications from "./Pages/Notifications";
import NewTicket from "./Pages/NewTicket";
import TicketDetails from "./Pages/TicketDetails";
import CustomerDashboard from "./Customers/CustomerDashboard";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import ResetPassword from "./Authentication/ResetPassword";
import News from "./Pages/News";
import GasPrice from "./SuperAdmin/GasPrice";
import Recharge from "./Customers/Recharge";
import RechargeStatus from "./SuperAdmin/RechargeStatus";
import Support from "./Customers/Support";
import Distributer from "./SuperAdmin/GasDistributers";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />

      <Route path="/superadmin/dashboard" element={<SuperDashboard />} />
      <Route path="/devices" element={<Devices />} />
      <Route path="/users" element={<Users />} />
      <Route path="/gasdistributers" element={<Distributer />} />

      <Route path="/customer/dashboard" element={<CustomerDashboard />} />

      
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/changepassword" element={<ChangePassword />} />
      <Route path="/resetpassword" element={<ResetPassword />} />

      
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/notifications" element={<Notifications />} />

      <Route path="/tickets" element={<Tickets />} />
      <Route path="/newticket" element={<NewTicket />} />
      <Route path="/ticketdetails/:ticketId" element={<TicketDetails />} />

      <Route path="/privacypolicy" element={<PrivacyPolicy />} />
      <Route path="/news" element={<News />} />
      <Route path="/gasprice" element={<GasPrice />} />
      <Route path="/recharge" element={<Recharge />} />
      <Route path="/rechargestatus" element={<RechargeStatus />} />
      <Route path="/support" element={<Support />} />
    </Routes>
  );
}

export default App;
