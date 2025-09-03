import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.tsx";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, DatesSetArg } from "@fullcalendar/core";
import { getUserCalendarRange } from "../api/calendar.ts"; // new API

type FCEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
};

const UserCalendar: React.FC = () => {
  const auth = useContext(AuthContext);
  const [events, setEvents] = useState<FCEvent[]>([]);

  // Fetch events for the visible range
  const fetchCalendar = async (startDate: Date, endDate: Date) => {
    if (!auth?.userId) return;

    try {
      const start = startDate.toISOString();
      const end = endDate.toISOString();

      const data = await getUserCalendarRange(auth.userId, start, end);

      if (!Array.isArray(data) || data.length === 0) {
        console.log("No events returned in this range.");
        setEvents([]);
        return;
      }

      const fcEvents = data.map((e: any) => ({
        id: e.eventId.timestamp.toString(),
        title: e.title,
        start: e.start,
        end: e.end,
        description: e.description,
      }));

      setEvents(fcEvents);
    } catch (err) {
      console.error("Error fetching calendar:", err);
      setEvents([]);
    }
  };

  // Initial fetch for the current week
  useEffect(() => {
    const now = new Date();
    fetchCalendar(now, now); // initial call can be improved
  }, [auth?.userId]);

  const handleEventClick = (clickInfo: EventClickArg) => {
    alert(
      `Event: ${clickInfo.event.title}\nDescription: ${clickInfo.event.extendedProps.description}`
    );
  };

  // Called whenever view changes (month/week/day)
  const handleDatesSet = (arg: DatesSetArg) => {
    fetchCalendar(arg.start, arg.end);
  };

  return (
    <div className="pt-20 w-full h-screen p-4 bg-gray-50">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        datesSet={handleDatesSet}
        eventClick={handleEventClick}
        height="calc(100vh - 80px)"
        expandRows={true}
        selectable={true}
        dayMaxEvents={true}
        nowIndicator={true}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        eventBackgroundColor="#2563EB"
        eventTextColor="#fff"
      />
    </div>
  );
};

export default UserCalendar;
