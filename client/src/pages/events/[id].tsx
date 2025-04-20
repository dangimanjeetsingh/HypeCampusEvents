import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Tag, ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Event, Venue, Registration, Category } from "@shared/schema";
import QRCode from "qrcode.react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetails() {
  const [, params] = useRoute("/events/:id");
  const { toast } = useToast();

  const { data: event, isLoading: eventLoading } = useQuery<Event>({
    queryKey: [`/api/events/${params?.id}`],
  });

  const { data: venue, isLoading: venueLoading } = useQuery<Venue>({
    queryKey: [`/api/venues/${event?.venueId}`],
    enabled: !!event,
  });

  const { data: category, isLoading: categoryLoading } = useQuery<Category>({
    queryKey: [`/api/categories/${event?.categoryId}`],
    enabled: !!event,
  });

  async function handleRegister() {
    try {
      const res = await apiRequest(
        "POST",
        `/api/events/${event?.id}/register`,
        {}
      );
      const registration: Registration = await res.json();
      toast({
        title: "Registration successful!",
        description: "Your ticket has been generated.",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  }

  const isLoading = eventLoading || venueLoading || categoryLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!event || !venue) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <p className="mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all events
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/">
        <Button variant="ghost" className="mb-6 -ml-2 text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all events
        </Button>
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-96 object-cover rounded-lg"
        />
        
        <div>
          <div className="flex items-center gap-3 mb-2">
            {category && (
              <Badge variant="outline" className="text-sm font-normal">
                <Tag className="mr-1 h-3 w-3" /> {category.name}
              </Badge>
            )}
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="mr-2 h-5 w-5" />
              {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-2 h-5 w-5" />
              {venue.name}, {venue.location}
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Users className="mr-2 h-5 w-5" />
              {event.capacity} spots available
            </div>
          </div>

          <div className="prose dark:prose-invert mb-8">
            <p>{event.description}</p>
          </div>

          <Button size="lg" onClick={handleRegister}>
            Register Now
          </Button>
        </div>
      </div>
    </div>
  );
}
