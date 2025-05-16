import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  PlusCircle,
  User as UserIcon,
  Settings,
  LogOut
} from "lucide-react";
import type { User } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  user?: User | null;
}

export default function Sidebar({ open, onClose, user }: SidebarProps) {
  const [location] = useLocation();

  // Handle log out 
  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  // Navigation items
  const navItems = [
    {
      label: "Portfolio",
      icon: <LayoutGrid className="h-5 w-5 mr-3" />,
      href: "/portfolio",
      active: location === "/portfolio"
    },
    {
      label: "Add Project",
      icon: <PlusCircle className="h-5 w-5 mr-3" />,
      href: "/add-project",
      active: location === "/add-project"
    },
    {
      label: "Profile",
      icon: <UserIcon className="h-5 w-5 mr-3" />,
      href: "/profile",
      active: location === "/profile"
    },
    {
      label: "Settings",
      icon: <Settings className="h-5 w-5 mr-3" />,
      href: "/settings",
      active: location === "/settings"
    }
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 transform bg-white dark:bg-gray-900 transition duration-300 lg:static lg:translate-x-0 lg:shadow-none shadow-lg",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200 dark:border-gray-700">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="bg-primary text-white p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">HackLog</span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button onClick={onClose} className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
          <ul className="px-2 space-y-1">
            {user ? (
              <>
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <a className={cn(
                        "flex items-center px-4 py-3 rounded-lg",
                        item.active
                          ? "text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}>
                        {item.icon}
                        {item.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </>
            ) : (
              <li>
                <Link href="/">
                  <a className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <LayoutGrid className="h-5 w-5 mr-3" />
                    Home
                  </a>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* User section */}
        {user && (
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={user.profileImageUrl || ''} alt={user.username || 'User'} />
                <AvatarFallback>
                  {user.firstName?.charAt(0) || user.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.firstName || user.username || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.username}
                </p>
              </div>
              <button 
                onClick={handleLogout}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
