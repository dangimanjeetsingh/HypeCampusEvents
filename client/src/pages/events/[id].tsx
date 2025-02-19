import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Event, Venue, Registration } from "@shared/schema";
import QRCode from "qrcode.react";

export default function EventDetails() {
  const [, params] = useRoute("/events/:id");
  const { toast } = useToast();

  const { data: event } = useQuery<Event>({
    queryKey: [`/api/events/${params?.id}`],
  });

  const { data: venue } = useQuery<Venue>({
    queryKey: [`/api/venues/${event?.venueId}`],
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

  if (!event || !venue) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-96 object-cover rounded-lg"
        />
        
        <div>
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="mr-2 h-5 w-5" />
              {new Date(event.startDate).toLocaleDateString()}
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-2 h-5 w-5" />
              {venue.name}
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
