import React from "react";
import { useNavigate, useLocation, HashRouter } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { Avatar } from "primereact/avatar";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = JSON.parse(localStorage.getItem("user"));

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
      url: "/shop",
      // visible: location.pathname === "/"
    },
    {
      label: "About Us",
      icon: "pi pi-users",
      url: "/aboutus",
      // visible: location.pathname === "/"
    },
    {
      label: "Blog",
      icon: "pi pi-pencil",
      url: "/blog",
      // visible: location.pathname === "/"
    },
    {
      label: "Account",
      icon: "pi pi-sign-in",
      url: "/login",
      // visible: location.pathname === "/"
      visible: storedUser == null,
    },
    {
      label: "My Account",
      icon: "pi pi-user",
      visible: storedUser !== null,
      // command: () => handleNavigation('/projects'),
      // visible: location.pathname === "/" || location.pathname === "/projects",
      items: [
        {
          label: "Overview",
          icon: "pi pi-eye",
          url: "/account",
          // visible: location.pathname === "/" || location.pathname === "/projects",
        },
        {
          label: "Dashboard",
          icon: "pi pi-database",
          // command: () => handleNavigation('/projects'),
          // visible: location.pathname === "/" || location.pathname === "/projects",
        },
      ],
    },
    {
      label: "Contact",
      icon: "pi pi-envelope",
      url: "/#contact",
      visible: location.pathname === "/",
    },
  ];

  const visibleItems = items.filter((item) => item.visible !== false);

  const start = (
    <div className="flex align-items-center gap-2 mr-8">
    <img
      alt="logo"
      src="/logo.png"
      height="40"
      className="mr-2"
    ></img>
    <p>C A P S U L E</p>
    </div>
  );
  const end = (
    <div className="flex align-items-center gap-2">
      <InputText
        placeholder="Search"
        type="text"
        className="w-8rem h-3rem sm:w-auto"
      />
      <Avatar
        icon="pi pi-user"
        // image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
        shape="circle"
      />
    </div>
  );
  return (
    <div className="card navbar-card">
      <Menubar model={visibleItems} className="menu" start={start} end={end} />
    </div>
  );
}
