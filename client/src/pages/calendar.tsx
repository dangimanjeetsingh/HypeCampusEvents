import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Event } from "@shared/schema";

export default function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const eventsOnSelectedDate = events?.filter((event) => {
    if (!date) return false;
    const eventDate = new Date(event.startDate);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-8">
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">
            Events on {date?.toLocaleDateString()}
          </h2>

          <div className="space-y-4">
            {eventsOnSelectedDate?.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.startDate).toLocaleTimeString()} -{" "}
                    {new Date(event.endDate).toLocaleTimeString()}
                  </p>
                  <p className="mt-2">{event.description}</p>
                </CardContent>
              </Card>
            ))}

            {eventsOnSelectedDate?.length === 0 && (
              <p className="text-muted-foreground">No events on this date.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
