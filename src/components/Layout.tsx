import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LogOut,
  Users,
  Menu,
  X,
  BarChart3,
  Target,
  Zap,
  Settings,
  LucideIcon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation: NavigationItem[] = [
    { name: "Performance", href: "/dashboard", icon: BarChart3 },
    { name: "Leads", href: "/leads", icon: Target },
    { name: "Clientes", href: "/clients", icon: Users },
    { name: "Campanhas", href: "/teams", icon: Zap },
  ];

  const isCurrentPath = (path: string): boolean => location.pathname === path;

  const handleLogout = (): void => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 flex-shrink-0 border-b border-blue-500/20">
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            MarketingCRM
          </h1>
          <button
            className="lg:hidden text-blue-100 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <nav className="px-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center w-full px-4 py-3.5 text-sm font-semibold transition-all duration-300 rounded-2xl group ${
                      isCurrentPath(item.href)
                        ? "bg-gradient-to-r from-blue-500/25 to-purple-500/25 text-white border-l-4 border-blue-300 shadow-lg"
                        : "text-slate-300 hover:bg-slate-700/60 hover:text-white hover:shadow-md hover:scale-[1.02]"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="mr-4 h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <span className="tracking-wide">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        <div className="border-t border-slate-600/50 p-4 flex-shrink-0">
          <div className="space-y-2">
            <Link
              to="/profile"
              className={`flex items-center w-full px-4 py-3.5 text-sm font-semibold transition-all duration-300 rounded-2xl group ${
                isCurrentPath("/profile")
                  ? "bg-gradient-to-r from-blue-500/25 to-purple-500/25 text-white border-l-4 border-blue-300 shadow-lg"
                  : "text-slate-300 hover:bg-slate-700/60 hover:text-white hover:shadow-md hover:scale-[1.02]"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Settings className="mr-4 h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <span className="tracking-wide">Perfil</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3.5 text-sm font-semibold text-slate-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-300 rounded-2xl group hover:shadow-md hover:scale-[1.02]"
            >
              <LogOut className="mr-4 h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <span className="tracking-wide">Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/50 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-slate-600 hover:text-blue-600 transition-colors duration-200"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden lg:block">
              <h2 className="text-lg font-semibold text-slate-800">
                Bem-vindo de volta, {user?.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user?.team && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200/50">
                {user.team.name}
              </span>
            )}
            <div className="lg:hidden">
              <span className="text-sm font-medium text-slate-600">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
