import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Signup from "./components/SignupComponent";
import Login from "./components/LoginComponent";
import AboutUs from "./pages/AboutUs";
import Account from "./pages/Account";
import DashboardComponent from "./components/Dashboard/DashboardComponent";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/account" element={<Account />} />
          {/* <Route path="/account/dashboard" element={<DashboardComponent />} /> */}
          {/* <Route path="/projects" element={<Projects />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
