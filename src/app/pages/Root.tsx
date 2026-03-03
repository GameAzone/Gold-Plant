import image_0b4e7454d1d3a53f9184cc7c9a64127b75795348 from 'figma:asset/0b4e7454d1d3a53f9184cc7c9a64127b75795348.png'
import { Outlet, Link, useLocation } from "react-router";
import { LayoutDashboard, ArrowLeftRight, Wallet, History, ShoppingBag } from "lucide-react";
import { AppProvider } from "../context/AppContext";
import { PWABanner } from "../components/PWABanner";
import logoImage from "figma:asset/73f9f93f93818e6269b7ceb98f1023f273811cf8.png";

export default function Root() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/trade", label: "Trade", icon: ArrowLeftRight },
    { path: "/wallet", label: "Wallet", icon: Wallet },
    { path: "/transactions", label: "Transactions", icon: History },
    { path: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  ];

  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20 md:pb-0">
        {/* PWA Features */}
        <PWABanner />
        
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 md:h-16">
              <div className="flex items-center gap-2 md:gap-3">
                <img 
                  src={image_0b4e7454d1d3a53f9184cc7c9a64127b75795348} 
                  alt="AL EBREIZ Logo" 
                  className="h-8 md:h-10 w-auto object-contain"
                />
                <div>
                  <h1 className="text-base md:text-xl font-bold italic text-[#e3bf35]">AL EBREIZ</h1>
                  <p className="text-[10px] md:text-xs text-slate-500 font-bold">Global Capital Berhad</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden md:block bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                      isActive
                        ? "border-amber-500 text-amber-600"
                        : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation - Only visible on mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 safe-area-inset-bottom">
          <div className="flex justify-around items-center px-2 py-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px] ${
                    isActive
                      ? "text-amber-600 bg-amber-50"
                      : "text-slate-600"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer - Hidden on mobile */}
        <footer className="hidden md:block bg-white border-t border-slate-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-slate-500">© 2026 AL EBREIZ | GLOBAL CAPITAL BERHAD. ALL RESERVED RIGHT.</p>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}