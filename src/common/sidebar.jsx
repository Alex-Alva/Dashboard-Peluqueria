import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,ShoppingCart,Scissors,Package,Users,Calendar, History,DollarSign,Sun, Moon,LogOut
} from "lucide-react";
import logo1 from "../assets/Logo1.png";
import logo2 from "../assets/Logo2.png";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutModal from "../components/logueo/LogoutModal";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Venta", icon: ShoppingCart, path: "/venta" },
  { name: "Servicios", icon: Scissors, path: "/servicios" },
  { name: "Productos", icon: Package, path: "/productos" },
  { name: "Clientes", icon: Users, path: "/clientes" },
  { name: "Citas", icon: Calendar, path: "/citas" },
  { name: "Finanzas", icon: DollarSign, path: "/finanzas" },
  { name: "Historial", icon: History, path: "/historial" },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const { logout, currentUser } = useAuth();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      return true;
    } else {
      document.documentElement.classList.remove("dark");
      return false;
    }
  });
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const esOscuro = saved === "dark";
    document.documentElement.classList.toggle("dark", esOscuro);
    setDark(esOscuro);
  }, []);

  return (
    <motion.div
      animate={{ width: isOpen ? 220 : 70 }}
      transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
      className={`fixed top-0 left-0 h-screen flex flex-col z-50 border-r select-none
        ${dark 
          ? "bg-[#121016] text-zinc-200 border-purple-950/40" 
          : "bg-[#f4f6f9] text-slate-800 border-slate-200"
        }`}
    >
      <div
        className="flex items-center gap-3 p-4 cursor-pointer border-b border-slate-200/60 dark:border-purple-950/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={dark ? logo1 : logo2}
          alt="logo"
          className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-600/20 dark:ring-purple-400/20"
        />
        {isOpen && (
          <span className="font-bold tracking-widest text-xs uppercase text-purple-950 dark:text-purple-100">
            PELUQUERÍA
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto py-3 space-y-1 scrollbar-none">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          if (item.children) {
            const isOpenMenu = openMenu === item.name;

            return (
              <div key={index} className="px-2">
                <div
                  onClick={() => setOpenMenu(isOpenMenu ? null : item.name)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200
                    ${dark ? "hover:bg-purple-950/30 text-zinc-400" : "hover:bg-purple-100/40 text-slate-600"}`}
                >
                  <Icon size={18} className="text-purple-600 dark:text-purple-400 shrink-0" />
                  {isOpen && <span className="flex-1">{item.name}</span>}
                </div>

                {isOpen && isOpenMenu && (
                  <div className="ml-9 mt-1 flex flex-col border-l border-purple-200 dark:border-purple-900 pl-3 space-y-1">
                    {item.children.map((sub, i) => {
                      const active = location.pathname === sub.path;

                      return (
                        <Link to={sub.path} key={i}>
                          <div
                            className={`py-1.5 px-2 text-xs rounded-lg transition-colors font-medium
                              ${active
                                ? "text-purple-600 dark:text-purple-400 font-bold bg-purple-600/10 dark:bg-purple-400/10"
                                : "text-slate-500 dark:text-zinc-400 hover:text-purple-700 dark:hover:text-purple-300"
                              }`}
                          >
                            {sub.name}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const active = location.pathname === item.path;

          return (
            <Link to={item.path} key={index} className="px-2 block">
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? "bg-purple-600/10 dark:bg-purple-400/10 text-purple-600 dark:text-purple-400 font-semibold border-l-4 border-purple-600 dark:border-purple-400 rounded-l-none"
                    : dark
                    ? "text-zinc-400 hover:bg-purple-950/30 hover:text-purple-300"
                    : "text-slate-600 hover:bg-purple-100/50 hover:text-purple-900"
                  }`}
              >
                <Icon 
                  size={18} 
                  className={`shrink-0 transition-colors ${
                    active 
                      ? "text-purple-600 dark:text-purple-400" 
                      : "text-slate-400 dark:text-zinc-500"
                  }`} 
                />
                {isOpen && <span>{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </div>
      <div className="p-2 border-t border-slate-200/60 dark:border-purple-950/50 space-y-1">
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200
            ${dark 
              ? "text-zinc-400 hover:bg-red-950/30 hover:text-red-400" 
              : "text-slate-600 hover:bg-red-100/50 hover:text-red-700"
            }`}
          onClick={() => setShowLogoutModal(true)}
          title={currentUser?.email || 'Cerrar sesión'}
        >
          <LogOut size={18} className="text-red-500 dark:text-red-400 shrink-0" />
          {isOpen && <span>Cerrar Sesión</span>}
        </div>

        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200
            ${dark 
              ? "text-zinc-400 hover:bg-purple-950/30 hover:text-purple-400" 
              : "text-slate-600 hover:bg-purple-100/50 hover:text-purple-700"
            }`}
          onClick={() => {
            const html = document.documentElement;
            if (html.classList.contains("dark")) {
              html.classList.remove("dark");
              localStorage.setItem("theme", "light");
              setDark(false);
            } else {
              html.classList.add("dark");
              localStorage.setItem("theme", "dark");
              setDark(true);
            }
          }}
        >
          {dark ? (
            <Moon size={18} className="text-purple-400 shrink-0" />
          ) : (
            <Sun size={18} className="text-purple-600 shrink-0" />
          )}
          {isOpen && <span>Modo Visual</span>}
        </div>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          logout();
        }}
        userEmail={currentUser?.email}
      />
    </motion.div>
  );
}