import { Link } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Calendar, PlusCircle, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const { user, logoutMutation } = useAuth();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <a className="font-bold text-2xl text-primary">HYPECREW</a>
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