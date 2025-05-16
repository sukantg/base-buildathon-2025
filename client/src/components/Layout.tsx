import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun, Menu, Share } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showShareButton?: boolean;
  onShareClick?: () => void;
}

export default function Layout({
  children,
  title = "Portfolio",
  showShareButton = false,
  onShareClick
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-900 bg-opacity-50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-500 dark:text-gray-400 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Title */}
            <h1 className="text-xl font-bold text-gray-900 dark:text-white lg:hidden">
              {title}
            </h1>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Dark mode toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* Share button */}
              {showShareButton && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onShareClick}
                  className="text-white"
                >
                  <Share className="h-4 w-4 mr-1.5" />
                  Share Profile
                </Button>
              )}

              {/* Login/Logout Button */}
              {!isAuthenticated ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Login
                </Button>
              ) : null}
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
