import React from "react";
import { useNavigate, useLocation, HashRouter } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleNavigation = (path) => {
    if (
      path === "/" &&
      location.pathname !== "/projects" &&
      location.hash.length != 0
    ) {
      if (location.pathname === path) {
        const element = document.querySelector("#hero");
        if (element) {
          HashRouter("#hero");
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
    if (location.pathname === path) {
      const element = document.querySelector("#hero");
      if (element) {
        HashRouter("#hero");
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const items = [
    // {
    //   label: "C A P S U L E",
    //   command: () => handleNavigation("/"),
    //   // visible: location.pathname === "/" || location.pathname === "/projects",
    // },
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => handleNavigation("/"),
      // visible: location.pathname === "/" || location.pathname === "/projects",
    },
    {
      label: "Shop",
      icon: "pi pi-shop",
      command: () => handleNavigation("/shop"),
      // visible: location.pathname === "/"
    },
    {
      label: "About Us",
      icon: "pi pi-users",
      command: () => handleNavigation("/aboutus"),
      // visible: location.pathname === "/"
    },
    {
      label: "Blog",
      icon: "pi pi-pencil",
      command: () => handleNavigation("/blog"),
      // visible: location.pathname === "/"
    },
    {
      label: "Contact",
      icon: "pi pi-envelope",
      command: () => handleNavigation("/#contact"),
      visible: location.pathname === "/",
    },
    {
      label: "Login",
      icon: "pi pi-sign-in",
      command: () => handleNavigation("/login"),
      visible: !user,
    },
    {
      label: "Sign Up",
      icon: "pi pi-user-plus",
      command: () => handleNavigation("/signup"),
      visible: !user,
    },
    {
      label: "Dashboard",
      icon: "pi pi-th-large",
      command: () => handleNavigation("/account/dashboard"),
      visible: !!user,
    },
    {
      label: "Profile",
      icon: "pi pi-user",
      command: () => handleNavigation("/profile"),
      visible: !!user,
    },
    {
      label: "Outfits",
      icon: "pi pi-heart",
      command: () => handleNavigation("/outfits"),
      visible: !!user,
    },
    {
      label: "Outfit Suggestion",
      icon: "pi pi-magic-wand",
      command: () => handleNavigation("/outfit-suggestion"),
      visible: !!user,
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: () => {
        logout();
        navigate("/");
      },
      visible: !!user,
    },
  ];

  const visibleItems = items.filter((item) => item.visible !== false);

  const start = (
    <div className="flex align-items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
      <img
        alt="logo"
        src="/logo.png"
        height="32"
        className="mr-2"
      />
      <span style={{ 
        fontWeight: 'bold', 
        fontSize: '1.1rem', 
        color: '#00c389',
        letterSpacing: '1px'
      }}>
        CAPSULE
      </span>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-2">
      {user ? (
        <div className="flex align-items-center gap-2">
          <Avatar
            icon="pi pi-user"
            shape="circle"
            size="normal"
            label={user.username.charAt(0).toUpperCase()}
            style={{ 
              backgroundColor: '#00c389', 
              color: 'white',
              fontSize: '1rem'
            }}
          />
          <span style={{ color: '#00c389', fontWeight: '500', fontSize: '0.9rem' }}>
            {user.username}
          </span>
        </div>
      ) : null}
    </div>
  );

  return (
    <div 
      className="navbar-card" 
      style={{ 
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: 'none',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      <Menubar 
        model={visibleItems} 
        className="menu" 
        start={start} 
        end={end}
        style={{ 
          backgroundColor: 'transparent',
          border: 'none',
          padding: '0.5rem 1rem'
        }}
      />
    </div>
  );
}
