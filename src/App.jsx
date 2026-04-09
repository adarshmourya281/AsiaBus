import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./components/pages/Home";
import SearchPage from "./components/pages/SearchPage";
import TrackBooking from "./components/pages/TrackBooking";
import CancelBooking from "./components/pages/CancelBooking";
import PrintTicket from "./components/pages/PrintTicket";



function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Layout />}>

          <Route index element={<Home />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="track-booking" element={<TrackBooking />} />
          <Route path="cancel-booking" element={<CancelBooking />} />
          <Route path="print-ticket" element={<PrintTicket />} />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;