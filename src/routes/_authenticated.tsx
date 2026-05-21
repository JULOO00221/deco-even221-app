import {
  createFileRoute,
  Outlet,
  redirect,
  Link,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  Users,
  Sparkles,
  FileText,
  LogOut,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { pb } from "@/lib/pb";

export const Route = createFileRoute(
  "/_authenticated"
)({
  beforeLoad: ({
    context,
    location,
  }) => {
    if (!context.auth.isAuthenticated()) {
      throw redirect({
        to: "/login",

        search: {
          redirect: location.href,
        } as any,
      });
    }
  },

  component: AuthLayout,
});

const items = [
  {
    title: "Tableau de bord",
    url: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    title: "Clients",
    url: "/clients",
    icon: Users,
  },

  {
    title: "Prestations",
    url: "/services",
    icon: Sparkles,
  },

  {
    title: "Devis",
    url: "/devis",
    icon: FileText,
  },
];

function AppSidebar() {
  const { state } = useSidebar();

  const collapsed =
    state === "collapsed";

  const path = useRouterState({
    select: (r) =>
      r.location.pathname,
  });

  const navigate = useNavigate();

  const logout = () => {
    pb.authStore.clear();

    navigate({
      to: "/login",
    });
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-gold/20"
    >
      <SidebarHeader className="border-b border-gold/20 bg-gradient-beige">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-gold text-primary-foreground shadow-soft">
            <Sparkles className="h-5 w-5" />
          </div>

          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-display text-lg leading-none">
                Deco Even221
              </p>

              <p className="text-[10px] uppercase tracking-widest text-gold">
                Atelier
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Gestion
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
  {items.map((it) => {
    const active =
      path === it.url ||
      path.startsWith(it.url + "/");

    return (
      <SidebarMenuItem key={it.url}>
        <SidebarMenuButton
          asChild
          isActive={active}
        >
          <Link
            to={it.url}
            className="flex items-center gap-2"
          >
            <it.icon className="h-4 w-4" />

            {!collapsed && (
              <span>{it.title}</span>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  })}
</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent className="px-2">
            <Link to="/devis/new">
              <Button
                size={
                  collapsed
                    ? "icon"
                    : "default"
                }
                className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90"
              >
                <Plus className="h-4 w-4" />

                {!collapsed && (
                  <span className="ml-1">
                    Nouveau devis
                  </span>
                )}
              </Button>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gold/20">
        <Button
          variant="ghost"
          onClick={logout}
          className="justify-start"
        >
          <LogOut className="h-4 w-4" />

          {!collapsed && (
            <span className="ml-2">
              Déconnexion
            </span>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

function AuthLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center border-b border-gold/20 bg-card/80 px-4 backdrop-blur">
            <SidebarTrigger />

            <div className="ml-3 font-display text-lg">
              Deco{" "}
              <span className="text-gold">
                Even221
              </span>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}