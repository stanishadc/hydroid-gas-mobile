import { Routes, Route } from "react-router-dom";
import Login from "./Authentication/Login";
import Logout from "./Authentication/Logout";
import UserProfile from "./Pages/Profile";
import ChangePassword from "./Pages/ChangePassword";
import Tickets from "./Pages/Tickets";
import Notifications from "./Pages/Notifications";
import NewTicket from "./Pages/NewTicket";
import TicketDetails from "./Pages/TicketDetails";
import CustomerDashboard from "./Customers/CustomerDashboard";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import ResetPassword from "./Authentication/ResetPassword";
import News from "./Pages/News";
import Recharge from "./Customers/Recharge";
import Support from "./Customers/Support";
import MobileProfile from "./Pages/MobileProfile";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />

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
      <Route path="/recharge" element={<Recharge />} />
      <Route path="/support" element={<Support />} />
      <Route path="/mobileprofile" element={<MobileProfile />} />
    </Routes>
  );
}

export default App;
