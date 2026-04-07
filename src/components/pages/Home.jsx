import { useNavigate } from "react-router-dom";
import Booking from "../booking/Booking";
import Offers from "../Offers/Offers";
import Features from "../Features/Features";
import RoutesTabs from "../Routes/RoutesTabs";
import AboutAsiaBus from "../About/AboutAsiaBus";

function Home() {
  const navigate = useNavigate();

  const handleSearch = (data) => {
    navigate("/search", { state: data });
  };

  return (
    <>
      <Booking onSearch={handleSearch} />
      <Offers />
      <Features />
      <RoutesTabs />
      <AboutAsiaBus />
    </>
  );
}

export default Home;