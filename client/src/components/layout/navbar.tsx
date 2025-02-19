import { Link } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Calendar, PlusCircle } from "lucide-react";

export function Navbar() {
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
          <Link href="/events/create">
            <Button className="hidden md:flex">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
