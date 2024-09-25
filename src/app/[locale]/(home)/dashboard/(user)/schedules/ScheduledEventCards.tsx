import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, UserIcon, VideoIcon } from "lucide-react";
import { Link } from "@/i18n/routing";

interface ScheduledEvent {
  name: string;
  start_time: string;
  status: string;
  event_memberships: Array<{
    user_name: string;
  }>;
  location: {
    join_url?: string;
    type: string;
  };
}

interface ScheduledEventCardsProps {
  events: ScheduledEvent[];
}

const ScheduledEventCards: React.FC<ScheduledEventCardsProps> = ({
  events,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event, index) => (
        <Card key={index} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {event.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-2">
              <div className="flex items-center">
                <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                <span>
                  {event.event_memberships[0]?.user_name || "Unknown Professor"}
                </span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                <span>{formatDate(event.start_time)}</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-2 text-gray-500" />
                <Badge
                  variant={event.status === "active" ? "default" : "secondary"}
                >
                  {event.status}
                </Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {event.location.type === "google_conference" &&
              event.location.join_url && (
                <Link href={event.location.join_url}>
                  <Button className="w-full">
                    <VideoIcon className="w-4 h-4 mr-2" />
                    Join Google Meet
                  </Button>
                </Link>
              )}
            {event.location.type !== "google_conference" && (
              <Button className="w-full" disabled>
                No video link available
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ScheduledEventCards;
