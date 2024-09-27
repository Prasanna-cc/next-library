"use client";

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
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  VideoIcon,
  RefreshCcw,
  XCircle,
  Calendar,
  CalendarX,
} from "lucide-react";
import { Link } from "@/i18n/routing";

interface ScheduledEvent {
  name: string;
  start_time: string;
  end_time: string;
  status: string;
  professor: string;
  meetLink?: string;
  rescheduleLink?: string;
  cancelLink?: string;
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

  const currentTime = new Date();

  const filteredEvents = events.filter(
    (event) =>
      new Date(event.end_time) > currentTime && event.status !== "canceled"
  );

  if (filteredEvents.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-slate-100">
        <Card className="w-full bg-transparent text-center">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              No Scheduled Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarX className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-sm text-gray-500 mb-4">
              You do not have any sessions scheduled yet. Why not book one now?
            </p>
            <Link href="/dashboard/professors">
              <Button className="w-full">Book a Session</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredEvents.map((event, index) => (
        <Card key={index} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {event.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-3">
              <div className="flex items-center">
                <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  {event.professor || "Unknown Professor"}
                </span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">{formatDate(event.start_time)}</span>
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
          <CardFooter className="flex flex-col space-y-2">
            {event.meetLink && (
              <Link href={event.meetLink} className="w-full">
                <Button className="w-full" variant="default">
                  <VideoIcon className="w-4 h-4 mr-2" />
                  Join Meeting
                </Button>
              </Link>
            )}
            <div className="flex justify-between w-full gap-2">
              {event.rescheduleLink && (
                <Link
                  href={`/dashboard/schedules/options?eventLink=${event.rescheduleLink}`}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full">
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Reschedule
                  </Button>
                </Link>
              )}
              {event.cancelLink && (
                <Link
                  href={`/dashboard/schedules/options?eventLink=${event.cancelLink}`}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full">
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </Link>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ScheduledEventCards;
