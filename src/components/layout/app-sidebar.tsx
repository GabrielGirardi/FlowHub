import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  Bot,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Clock,
  Coffee,
  Database,
  DollarSign,
  Droplet,
  FileJson,
  FileText,
  Globe,
  Home,
  ListTodo,
  Menu,
  Moon,
  Music,
  Newspaper,
  Scroll,
  Search,
  Sun,
  Trello,
  X,
  Youtube,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { WeatherWidget } from "../weather-widget";

type NavItem = {
  name: string;
  icon: React.ElementType;
  path: string;
  category?: string;
};

const navItems: NavItem[] = [
  { name: "Home", icon: Home, path: "/" },
  {
    name: "To-Do List",
    icon: ListTodo,
    path: "/todo",
    category: "productivity",
  },
  { name: "Kanban", icon: Trello, path: "/kanban", category: "productivity" },
  {
    name: "Pomodoro",
    icon: Clock,
    path: "/pomodoro",
    category: "productivity",
  },
  { name: "Notepad", icon: Scroll, path: "/notepad", category: "productivity" },
  {
    name: "Water Reminder",
    icon: Droplet,
    path: "/water-reminder",
    category: "productivity",
  },
  {
    name: "Internet Search",
    icon: Globe,
    path: "/internet-search",
    category: "productivity",
  },

  {
    name: "Lo-Fi Music",
    icon: Music,
    path: "/lofi",
    category: "entertainment",
  },
  {
    name: "YouTube Player",
    icon: Youtube,
    path: "/youtube-player",
    category: "entertainment",
  },

  {
    name: "Currency Converter",
    icon: DollarSign,
    path: "/currency-converter",
    category: "utilities",
  },
  {
    name: "Tech News",
    icon: Newspaper,
    path: "/tech-news",
    category: "utilities",
  },

  { name: "AI Tools", icon: Bot, path: "/ai-tools", category: "development" },
  {
    name: "Deploy Checklist",
    icon: CheckSquare,
    path: "/deploy-checklist",
    category: "development",
  },
  {
    name: "Code Snippets",
    icon: FileText,
    path: "/code-snippets",
    category: "development",
  },
  {
    name: "Quick Search",
    icon: Search,
    path: "/search",
    category: "development",
  },
  {
    name: "Fake Data",
    icon: Database,
    path: "/fake-data",
    category: "development",
  },
  {
    name: "JSON Formatter",
    icon: FileJson,
    path: "/json-formatter",
    category: "development",
  },

  { name: "Apoie o Projeto", icon: Coffee, path: "/donation" },
];

interface SidebarProps {
  theme: string;
  toggleTheme: () => void;
}

export function Sidebar({ theme, toggleTheme }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({
    productivity: true,
    entertainment: false,
    utilities: false,
    development: false,
  });
  const location = useLocation();
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const categories = {
    productivity: { name: "Produtividade", icon: ListTodo },
    entertainment: { name: "Entretenimento", icon: Music },
    utilities: { name: "Utilitários", icon: Globe },
    development: { name: "Desenvolvimento", icon: FileText },
  };

  const groupedItems = navItems.reduce<Record<string, NavItem[]>>(
    (acc, item) => {
      if (!item.category) {
        if (!acc["other"]) acc["other"] = [];
        acc["other"].push(item);
        return acc;
      }

      if (!acc[item.category]) {
        acc[item.category] = [];
      }

      acc[item.category].push(item);
      return acc;
    },
    {}
  );

  const homeItem = navItems.find((item) => item.path === "/");
  const donationItem = navItems.find((item) => item.path === "/donation");

  return (
    <>
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={toggleMobileSidebar}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
          collapsed && !isMobile ? "w-16" : "w-64",
          isMobile ? (mobileOpen ? "translate-x-0" : "-translate-x-full") : ""
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <h1
              className={cn(
                "font-bold text-xl text-primary transition-opacity duration-300",
                collapsed && !isMobile ? "opacity-0 w-0 hidden" : "opacity-100"
              )}
            >
              FlowHub
            </h1>
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Menu size={18} />
              </Button>
            )}
          </div>

          <div className="p-2 border-b border-sidebar-border">
            <WeatherWidget collapsed={collapsed && !isMobile} />
          </div>

          <nav className="flex-1 overflow-y-auto p-2">
            <TooltipProvider delayDuration={0}>
              <ul className="space-y-1">
                {/* Home Item */}
                {homeItem && (
                  <li>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={homeItem.path}
                          className={cn(
                            "flex items-center p-2 rounded-md transition-colors",
                            location.pathname === homeItem.path
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                            collapsed && !isMobile
                              ? "justify-center"
                              : "justify-start"
                          )}
                          onClick={() => isMobile && setMobileOpen(false)}
                        >
                          <homeItem.icon size={18} />
                          {(!collapsed || isMobile) && (
                            <span className="ml-3 truncate">
                              {homeItem.name}
                            </span>
                          )}
                        </Link>
                      </TooltipTrigger>
                      {collapsed && !isMobile && (
                        <TooltipContent side="right">
                          {homeItem.name}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </li>
                )}

                {Object.entries(categories).map(([categoryKey, category]) => {
                  const categoryItems = groupedItems[categoryKey] || [];
                  const isExpanded = expandedCategories[categoryKey];

                  if (categoryItems.length === 0) return null;

                  return (
                    <li key={categoryKey}>
                      {!collapsed || isMobile ? (
                        <>
                          <Button
                            variant="ghost"
                            className="w-full justify-between text-xs font-medium text-muted-foreground hover:text-foreground mb-1 h-8"
                            onClick={() => toggleCategory(categoryKey)}
                          >
                            <div className="flex items-center">
                              <category.icon size={14} className="mr-2" />
                              {category.name}
                            </div>
                            {isExpanded ? (
                              <ChevronDown size={14} />
                            ) : (
                              <ChevronRight size={14} />
                            )}
                          </Button>

                          {isExpanded && (
                            <ul className="space-y-1 ml-2 border-l border-sidebar-border pl-2">
                              {categoryItems.map((item) => {
                                const isActive =
                                  location.pathname === item.path;
                                return (
                                  <li key={item.name}>
                                    <Link
                                      to={item.path}
                                      className={cn(
                                        "flex items-center p-1.5 rounded-md transition-colors text-sm",
                                        isActive
                                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                          : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                                      )}
                                      onClick={() =>
                                        isMobile && setMobileOpen(false)
                                      }
                                    >
                                      <item.icon size={16} />
                                      <span className="ml-2 truncate">
                                        {item.name}
                                      </span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex justify-center p-2 mb-2 border-b border-sidebar-border">
                              <category.icon
                                size={18}
                                className="text-muted-foreground"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <div className="space-y-1">
                              <p className="font-medium">{category.name}</p>
                              {categoryItems.map((item) => (
                                <Link
                                  key={item.name}
                                  to={item.path}
                                  className="block px-2 py-1 hover:bg-accent rounded text-sm"
                                  onClick={() =>
                                    isMobile && setMobileOpen(false)
                                  }
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </li>
                  );
                })}

                {donationItem && (
                  <li className="mt-4 pt-2 border-t border-sidebar-border">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={donationItem.path}
                          className={cn(
                            "flex items-center p-2 rounded-md transition-colors border border-dashed border-primary/50",
                            location.pathname === donationItem.path
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                            collapsed && !isMobile
                              ? "justify-center"
                              : "justify-start"
                          )}
                          onClick={() => isMobile && setMobileOpen(false)}
                        >
                          <donationItem.icon
                            size={18}
                            className="text-primary"
                          />
                          {(!collapsed || isMobile) && (
                            <span className="ml-3 truncate text-primary font-medium">
                              {donationItem.name}
                            </span>
                          )}
                        </Link>
                      </TooltipTrigger>
                      {collapsed && !isMobile && (
                        <TooltipContent side="right">
                          {donationItem.name}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </li>
                )}
              </ul>
            </TooltipProvider>
          </nav>
          <div
            className={cn(
              "p-4 border-t border-sidebar-border flex",
              collapsed && !isMobile ? "justify-center" : "justify-between"
            )}
          >
            {(!collapsed || isMobile) && (
              <span className="text-sm text-sidebar-foreground/80">Tema</span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
