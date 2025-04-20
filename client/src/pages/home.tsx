import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Tag } from "lucide-react";
import { useState } from "react";
import type { Event, Venue, Category } from "@shared/schema";

function EventCard({ event, venue, category }: { event: Event; venue: Venue; category: Category | undefined }) {
  return (
    <Card className="overflow-hidden">
      <img
        src={event.imageUrl}
        alt={event.title}
        className="w-full h-48 object-cover"
      />
      <CardHeader>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{event.title}</h3>
          {category && (
            <Badge variant="outline" className="ml-2">
              {category.name}
            </Badge>
          )}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          {new Date(event.startDate).toLocaleDateString()}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-2 h-4 w-4" />
          {venue.name}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>
      </CardContent>
      <CardFooter>
        <Link href={`/events/${event.id}`}>
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function Home() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events", selectedCategoryId ? { categoryId: selectedCategoryId } : undefined],
    queryFn: async ({ queryKey }) => {
      const [_, params] = queryKey;
      const url = params 
        ? `/api/events?categoryId=${params.categoryId}` 
        : "/api/events";
      const response = await fetch(url);
      return response.json();
    }
  });

  const { data: venues, isLoading: venuesLoading } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (eventsLoading || venuesLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Discover Events</h1>
      
      {/* Category filters */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4 flex items-center">
          <Tag className="mr-2 h-5 w-5" /> Filter by Category
        </h2>
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={selectedCategoryId === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategoryId(null)}
          >
            All
          </Badge>
          {categories?.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategoryId === category.id ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategoryId(category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>
      
      {events?.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">No events found for this category.</p>
          <Button 
            className="mt-4" 
            variant="outline"
            onClick={() => setSelectedCategoryId(null)}
          >
            View all events
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event) => {
          const venue = venues?.find((v) => v.id === event.venueId);
          const category = categories?.find((c) => c.id === event.categoryId);
          
          if (!venue) return null;
          
          return (
            <EventCard
              key={event.id}
              event={event}
              venue={venue}
              category={category}
            />
          );
        })}
      </div>
    </div>
  );
}
