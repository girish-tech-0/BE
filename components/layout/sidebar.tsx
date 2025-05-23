"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Calendar, 
  ClipboardList, 
  IndianRupee,
  LayoutDashboard, 
  ListTodo, 
  Mail, 
  Menu,
  Phone, 
  Settings, 
  Users,
  UserCheck2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NewTicketDialog } from "@/components/tickets/new-ticket-dialog";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Kanban Board",
      href: "/kanban",
      icon: <ListTodo className="h-5 w-5" />,
    },
    {
      name: "Clients",
      href: "/clients",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Agents",
      href: "/agents",
      icon: <UserCheck2 className="h-5 w-5" />,
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "Tasks",
      href: "/tasks",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      name: "Finances",
      href: "/finances",
      icon: <IndianRupee className="h-5 w-5" />,
    },
    {
      name: "Calls",
      href: "/calls",
      icon: <Phone className="h-5 w-5" />,
    },
    {
      name: "Email Templates",
      href: "/emails",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 pt-10">
          <div className="mb-6">
            <NewTicketDialog />
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className={cn("hidden h-screen border-r md:flex md:w-52 md:flex-col md:p-4", className)}>
        <div className="mb-6">
          <NewTicketDialog />
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}