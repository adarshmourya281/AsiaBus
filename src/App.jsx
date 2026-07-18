import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./components/pages/Home";
import SearchPage from "./components/pages/SearchPage";
import MyBookings from "./components/pages/MyBookings";
import CancelBooking from "./components/pages/CancelBooking";
import PrintTicket from "./components/pages/PrintTicket";
import PaymentPage from "./components/pages/PaymentPage";
import Profile from "./components/pages/Profile";


function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Layout />}>

          <Route index element={<Home />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="MyBookings" element={<MyBookings />} />
          <Route path="cancel-booking" element={<CancelBooking />} />
          <Route path="print-ticket" element={<PrintTicket />} />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;