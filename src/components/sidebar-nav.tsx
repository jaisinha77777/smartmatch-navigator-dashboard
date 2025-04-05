
import { cn } from "@/lib/utils";
import { LayoutDashboard, Briefcase, Users, FileText } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Jobs",
    href: "/jobs",
    icon: Briefcase,
  },
  {
    title: "Applicants",
    href: "/applicants",
    icon: Users,
  },
  {
    title: "Criteria Editor",
    href: "/criteria",
    icon: FileText,
  },
];

export function SidebarNav({ className }: { className?: string }) {
  return (
    <nav className={cn("flex flex-col gap-2", className)}>
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
              isActive ? "bg-accent text-primary" : "text-muted-foreground"
            )
          }
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </NavLink>
      ))}
    </nav>
  );
}
