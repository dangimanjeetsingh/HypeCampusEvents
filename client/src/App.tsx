import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import { Navbar } from "./components/layout/navbar";
import Home from "./pages/home";
import EventDetails from "./pages/events/[id]";
import CreateEvent from "./pages/events/create";
import CalendarView from "./pages/calendar";
import AuthPage from "./pages/auth";
import NotFound from "./pages/not-found";

// Admin pages
import AdminEvents from "./pages/admin/events";
import AdminCreateEvent from "./pages/admin/events/create";
import AdminEditEvent from "./pages/admin/events/edit/[id]";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/events/:id" component={EventDetails} />
      <Route path="/events/create" component={CreateEvent} />
      <Route path="/calendar" component={CalendarView} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Admin routes */}
      <Route path="/admin/events" component={AdminEvents} />
      <Route path="/admin/events/create" component={AdminCreateEvent} />
      <Route path="/admin/events/edit/:id" component={AdminEditEvent} />
      
      {/* 404 page */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Navbar />
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;