import {
  ArrowLeftOnRectangleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { PiTicket } from "react-icons/pi";
import { MdOutlineInventory2 } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { PiHandshakeLight } from "react-icons/pi";






const navItems = [
  { name: "Dashboard", icon: MdOutlineSpaceDashboard, path: "/sales/dashboard", size: 20 },
  { name: "Tickets", icon: PiTicket, path: "/ticketspage", size: 20 },
  { name: "Inventory", icon: MdOutlineInventory2, path: "/inventory", size: 20 },
  { name: "Leads", icon: GoPeople, path: "/leadspage", size: 20 },
  { name: "Deals", icon: PiHandshakeLight, path: "/dealspage", size: 25 },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ Clear session data (adjust as needed)
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 p-4 flex flex-col justify-between">
      {/* Top Section */}
      <div>
        {/* Logo & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-lg font-semibold">
              Xenesis Sales Tracker
            </h1>
          </div>
          <p className="text-xs text-gray-400 ml-8">v1.0.0</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? "bg-[#F7FAFC] font-medium" : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <item.icon size={item.size} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="mt-6 border-t border-t-gray-500 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
