import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Signup from "./components/SignupComponent";
import Login from "./components/LoginComponent";
import AboutUs from "./pages/AboutUs";
import Account from "./pages/Account";
import DashboardComponent from "./components/Dashboard/DashboardComponent";
import Outfits from "./pages/Outfits";
import OutfitSuggestion from "./pages/OutfitSuggestion";
import ProfileSetting from "./pages/ProfileSetting";

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/account" element={<Account />} />
          <Route 
            path="/account/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardComponent />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/outfits" 
            element={
              <ProtectedRoute>
                <Outfits />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/outfit-suggestion" 
            element={
              <ProtectedRoute>
                <OutfitSuggestion />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfileSetting/>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
