import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Package,
  BarChart3,
  Settings,
  Building,
  MapPin,
  BookOpen,
  FileText,
  LogOut,
  Menu,
  X,
  Home,
  ChevronRight,
  Activity,
  Calendar,
  Ship,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab based on the current route path
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.includes("/admin-management")) return "management";
    if (path.includes("/admin-users")) return "users";
    if (path.includes("/admin-hotels")) return "hotels";
    if (path.includes("/admin-activities")) return "activities";
    if (path.includes("/admin-blogs")) return "blogs";
    if (path.includes("/admin-ferries")) return "ferries"; // Correctly maps /admin-ferries to 'ferries'
    if (path.includes("/ferry-bookings")) return "bookings"; // Changed from 'ferry-bookings' to 'bookings' for consistency
    if (path.includes("/admin-blogbooks")) return "blogbooks";
    if (path === "/admin") return "dashboard";
    // Note: "/" (Main Website) is handled differently and not part of the admin tabs
    return "dashboard";
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  const handleTabChange = (tabId) => {
    let route = "/admin";
    switch (tabId) {
      case "management":
        route = "/admin-management";
        break;
      case "users":
        route = "/admin-users";
        break;
      case "hotels":
        route = "/admin-hotels";
        break;
      case "activities":
        route = "/admin-activities";
        break;
      case "blogs":
        route = "/admin-blogs";
        break;
      case "ferries": // Now correctly handles the 'ferries' tab
        route = "/admin-ferries";
        break;
      case "bookings": // Handles the 'bookings' tab
        route = "/admin-ferry-bookings";
        break;
      case "blogbooks":
        route = "/admin-blogbooks";
        break;
      case "Main Website": // Handles navigation to main website
        navigate("/"); // Navigate directly, don't set active tab to "Main Website" here
        setSidebarOpen(false);
        return; // Exit early to prevent state updates
      default:
        route = "/admin"; // Default to dashboard
    }
    setActiveTab(tabId); // Update active tab state
    navigate(route); // Navigate to the determined route
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, route: "/admin" },
    { id: "Main Website", label: "Main Website", icon: Home, route: "/" },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      route: "/admin-users",
    },
    {
      id: "management",
      label: "Admin Management",
      icon: Settings,
      route: "/admin-management",
    },
     {
      id: "bookings", // Changed id to match the path segment and tab logic
      label: "Ferry Bookings",
      icon: Calendar,
      route: "/admin-ferry-bookings",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      route: "/admin-settings",
    },
    { id: "hotels", label: "Hotels", icon: Building, route: "/admin-hotels" },
    {
      id: "activities",
      label: "Activities",
      icon: MapPin,
      route: "/admin-activities",
    },
    {
      id: "blogs",
      label: "Blogs (Posts)",
      icon: FileText,
      route: "/admin-blogs",
    },
    {
      id: "blogbooks",
      label: "Blog Books",
      icon: BookOpen,
      route: "/admin-blogbooks",
    },
    {
      id: "ferries",
      label: "Ferry Management",
      icon: Ship,
      route: "/admin-ferries",
    },
   
  ];

  return (
    <div className="flex h-screen bg-muted/40">
      {/* Mobile Sidebar Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="md:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            sidebarItems={sidebarItems}
            user={user}
            logout={logout}
            navigate={navigate}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <SidebarContent
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          sidebarItems={sidebarItems}
          user={user}
          logout={logout}
          navigate={navigate}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b bg-card px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold capitalize">
              {activeTab === "Main Website"
                ? "Main Website"
                : activeTab.replace("-", " ")}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="/placeholder-avatar.jpg"
                  alt={user?.full_name || user?.email}
                />
                <AvatarFallback>
                  {user?.full_name?.charAt(0) || user?.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline-block text-sm font-medium">
                {user?.full_name || user?.email}
              </span>
            </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

// Sidebar Content Component
const SidebarContent = ({
  activeTab,
  handleTabChange,
  sidebarItems,
  user,
  logout,
  navigate,
}) => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-4">
        <Link to="/admin" className="flex items-center gap-2 font-semibold">
          <BarChart3 className="h-6 w-6" />
          <span>Admin Panel</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                activeTab === item.id
                  ? "font-semibold border-r-2 border-primary"
                  : "font-normal"
              }`}
              onClick={() => handleTabChange(item.id)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
              {activeTab === item.id && (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
            </Button>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="space-y-2 p-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src="/placeholder-avatar.jpg"
              alt={user?.full_name || user?.email}
            />
            <AvatarFallback>
              {user?.full_name?.charAt(0) || user?.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {user?.full_name || user?.email}
            </span>
            <span className="truncate text-xs">Administrator</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Content Component
AdminPanel.DashboardContent = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {user?.full_name || user?.email}. Here's what's
          happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs opacity-80">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs opacity-80">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-500 to-violet-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Settings className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs opacity-80">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <Package className="h-5 w-5 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs opacity-80">-1 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Overview</CardTitle>
            <CardDescription>
              Summary of your platform's performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Revenue</span>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">$24,890</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Bookings This Month</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">1,234</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Conversion Rate</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">4.8%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions on your platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Building className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">New hotel added</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">New blog post published</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;