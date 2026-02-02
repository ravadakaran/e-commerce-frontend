import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users, TicketPercent, Layers, LogOut, ArrowLeft, FolderTree } from "lucide-react";
import { clearAuth } from "../utils/api";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = localStorage.getItem("userEmail");

  React.useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }

    fetch(`/api/auth/user?email=${email}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((user) => {
        if (!user.isAdmin) {
          navigate("/");
        }
      })
      .catch(() => navigate("/"));
  }, [email, navigate]);

  const menuItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/categories", label: "Categories", icon: FolderTree },
    { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/coupons", label: "Coupons", icon: TicketPercent },
    { to: "/admin/carts", label: "Carts", icon: Layers },
  ];

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200">
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100">
          <div>
            <p className="text-xs font-semibold tracking-widest text-amber-600 uppercase">
              Dangly Dreams
            </p>
            <p className="text-sm text-gray-700 font-medium flex items-center gap-1">
              <LayoutDashboard className="w-4 h-4 text-amber-500" />
              Admin
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center text-xs text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            Site
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-amber-50 text-amber-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 px-3 py-3">
          <button
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </button>
          {email && (
            <p className="mt-2 text-xs text-gray-400 truncate">
              Signed in as <span className="font-medium text-gray-500">{email}</span>
            </p>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <header className="md:hidden h-14 flex items-center justify-between px-4 bg-white border-b border-gray-200">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center text-xs text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Site
          </button>
          <div className="text-sm font-medium text-gray-800">Admin</div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center text-xs text-gray-500 hover:text-gray-800"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
