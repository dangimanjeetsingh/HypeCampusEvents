import { Link } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Calendar, PlusCircle, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Logo variations - uncomment one to use it
const LogoTheme1 = () => (
  <span className="font-bold text-2xl tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
    HYPECREW
  </span>
);

const LogoTheme2 = () => (
  <span className="font-black text-2xl tracking-widest relative">
    <span className="text-primary">HYPE</span>
    <span className="text-primary">CREW</span>
  </span>
);

const LogoTheme3 = () => (
  <div className="relative">
    <span className="font-extrabold text-2xl tracking-tight">
      HYPE<span className="text-accent">CREW</span>
    </span>
    <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary"></div>
  </div>
);

const LogoTheme4 = () => (
  <span className="font-black text-2xl relative">
    <span className="bg-gradient-to-br from-primary via-accent to-secondary bg-clip-text text-transparent">
      HYPE<span className="text-foreground">CREW</span>
    </span>
  </span>
);

const LogoTheme5 = () => (
  <div className="relative">
    <span className="font-extrabold text-2xl tracking-wider">
      <span className="text-primary">HYPE</span>
      <span className="relative">
        CREW
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent"></span>
      </span>
    </span>
  </div>
);

export function Navbar() {
  const { user, logoutMutation } = useAuth();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            {/* Changed to Theme2 for better visibility */}
            <LogoTheme2 />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/calendar">
              <a className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <Calendar className="h-4 w-4" />
                Calendar
              </a>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden md:inline-block">
                Welcome, {user.name}
              </span>

              {user.role === "coordinator" && (
                <Link href="/events/create">
                  <Button className="hidden md:flex">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Register Event
                  </Button>
                </Link>
              )}

              <Button variant="ghost" size="icon" onClick={() => logoutMutation.mutate()}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Link href="/auth">
              <Button>Login</Button>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}