import "./App.css";
import About from "./components/About";
import Activities from "./components/Activities";
import Airhockey from "./components/Airhockey";
import Bowling from "./components/Bowling";
import Contact from "./components/Contact";
import Dining from "./components/Dining";
import Employees from "./components/Employees";
import Home from "./components/Home";
import Maintenance from "./components/Maintenance";
import Layout from "./components/navigation/Layout";
import Products from "./components/Products";
import Schedule from "./components/Schedule";
import TestReservations from "./components/testReservations";
import Login from "./security/Login";
import { Route, Routes } from "react-router-dom";
import LogoutComponent from "./security/Logout";
import FullReservation from "./components/reservation/FullReservations";
import AdminPage from "./components/Admin";

// routes here!

function App() {
  return (
    <>
      <Layout>
        <Routes>
          {/* ruter til kunde visning */}
          <Route path="/" element={<Home />} />
          <Route path="/bowling" element={<Bowling />} />
          <Route path="/dining" element={<Dining />} />
          <Route path="/airhockey" element={<Airhockey />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/About" element={<About />} />

          {/* ruter til admin visning */}
          <Route path="/activities" element={<Activities />} />
          <Route path="/reservations" element={<FullReservation />} />
          <Route path="/reservations-calendar" element={<TestReservations />} />
          <Route path="/fullreservation" element={<FullReservation />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/logout" element={<LogoutComponent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
