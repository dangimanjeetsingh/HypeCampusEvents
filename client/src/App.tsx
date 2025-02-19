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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/events/:id" component={EventDetails} />
      <Route path="/events/create" component={CreateEvent} />
      <Route path="/calendar" component={CalendarView} />
      <Route path="/auth" component={AuthPage} />
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