import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type Event, type Venue, type Category } from "@shared/schema";
import { format } from "date-fns";
import {
  PlusCircle,
  Edit,
  Trash2,
  CalendarIcon,
  MapPinIcon,
  Loader2,
  Tags,
  AlertTriangle,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminEvents() {
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteEventId, setDeleteEventId] = useState<number | null>(null);

  // Fetch events, venues, and categories
  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: venues } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: number) => {
      return await apiRequest("DELETE", `/api/events/${eventId}`);
    },
    onSuccess: () => {
      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setDeleteEventId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    },
  });

  function getCategoryName(categoryId: number) {
    return categories?.find((c) => c.id === categoryId)?.name || "Uncategorized";
  }

  function getVenueName(venueId: number) {
    return venues?.find((v) => v.id === venueId)?.name || "Unknown Venue";
  }

  function handleDeleteClick(eventId: number) {
    setDeleteEventId(eventId);
  }

  function confirmDelete() {
    if (deleteEventId) {
      deleteEventMutation.mutate(deleteEventId);
    }
  }

  // Auth check
  if (authLoading) {
    return (
      <div className="container py-8 mx-auto">
        <Skeleton className="h-12 w-48 mb-6" />
        <div className="flex gap-4 mb-8">
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user || user.role !== "coordinator") {
    navigate("/auth");
    return null;
  }

  return (
    <div className="container py-8 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Events</h1>
          <p className="text-muted-foreground mt-1">
            View, edit and delete your events
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/admin/events/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      {eventsLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : events && events.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableCaption>A list of all events</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Venue</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{event.title}</div>
                      <div className="md:hidden text-xs text-muted-foreground mt-1 flex items-center">
                        <Tags className="h-3 w-3 mr-1" />
                        {getCategoryName(event.categoryId)}
                      </div>
                      <div className="md:hidden text-xs text-muted-foreground mt-1 flex items-center">
                        <MapPinIcon className="h-3 w-3 mr-1" />
                        {getVenueName(event.venueId)}
                      </div>
                      <div className="md:hidden text-xs text-muted-foreground mt-1 flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {format(new Date(event.startDate), "MMM d, yyyy")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">
                      {getCategoryName(event.categoryId)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getVenueName(event.venueId)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(event.startDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {event.isFeatured ? (
                      <Badge>Featured</Badge>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/events/edit/${event.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-2">
                            Edit
                          </span>
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteClick(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">
                              Delete
                            </span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to delete this event?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently
                              delete the event and remove all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={confirmDelete}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deleteEventMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </>
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/40">
          <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No events found</h3>
          <p className="text-muted-foreground text-center mt-1 mb-4">
            You haven't created any events yet.
          </p>
          <Link href="/admin/events/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create your first event
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}