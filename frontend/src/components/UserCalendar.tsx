import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.tsx";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, DatesSetArg } from "@fullcalendar/core";
import { getUserCalendarRange } from "../api/calendar.ts";
import CreateEventModal from "./CreateEventModal.tsx";
import { createEvent, deleteEvent, updateEvent } from "../api/event.ts";
import type { DateClickArg } from "@fullcalendar/interaction";
import EventDetails from "./EventDetails.tsx";
import dayjs from "dayjs";


type FCEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  organizer?: string;
};

const UserCalendar: React.FC = () => {
  const auth = useContext(AuthContext);
  const [events, setEvents] = useState<FCEvent[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<FCEvent | null>(null);

  const [visibleRange, setVisibleRange] = useState<{ start: Date; end: Date }>({
    start: new Date(),
    end: new Date(),
  });

  const fetchCalendar = async (startDate: Date, endDate: Date) => {
    if (!auth?.userId) return;
    try {
      const data = await getUserCalendarRange(
        auth.userId,
        startDate.toISOString(),
        endDate.toISOString()
      );
      setEvents(
  data.map((e: any) => {
    const isAllDay = e.allDay || false;

    let start = dayjs(e.start).toDate();
    let end = e.end ? dayjs(e.end).toDate() : isAllDay ? dayjs(e.start).add(1, "day").toDate() : dayjs(e.start).add(1, "hour").toDate();

    return {
      id: e.eventId,
      title: e.title,
      start,
      end,
      description: e.description || "",
      organizer: e.organizerName || "Unknown",
      allDay: isAllDay,
    };
  })
      );
    } catch (err) {
      console.error("Error fetching calendar:", err);
    }
  };

  useEffect(() => {
    if (visibleRange.start && visibleRange.end) {
      fetchCalendar(visibleRange.start, visibleRange.end);
    }
  }, [auth?.userId, visibleRange]);

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      description: event.extendedProps.description,
      organizer: event.extendedProps.organizer,
    });
  };

  const handleSaveEvent = async (values: any) => {
    try {
      const [start, end] = values.dates;
      await updateEvent(values.id, {
        
          title: values.title,
          description: values.description,
          start: start.toISOString(),
          end: end.toISOString(),
          allDay: values.allDay || false,
        
      });
      fetchCalendar(visibleRange.start, visibleRange.end);
      setSelectedEvent(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
      fetchCalendar(visibleRange.start, visibleRange.end);
      setSelectedEvent(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="pt-20 w-full h-screen bg-gray-50">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          datesSet={(arg: DatesSetArg) => {
            setVisibleRange({ start: arg.start, end: arg.end });
          }}
          eventClick={handleEventClick}
          dateClick={(arg: DateClickArg) => {
            setSelectedDate(arg.dateStr);
            setOpenModal(true);
          }}
          selectable={true}
          nowIndicator={true}
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          eventBackgroundColor="#2563EB"
          eventTextColor="#fff"
          height="calc(100vh - 80px)"
           eventTimeFormat={{
           hour: "numeric",
           minute: "2-digit",
           meridiem: "short" 
          }}
           eventContent={(arg) => {
        return (
         <div className="flex items-center">
        <span
          className="w-2 h-2 rounded-full mr-2"
          style={{ backgroundColor: arg.event.backgroundColor || "#2563EB" ,marginLeft:'5px' }}
        ></span>
        
        <span>
          <b>{arg.timeText}</b>
          <span style={{ marginLeft: "4px" }}>{arg.event.title}</span>
        </span>
      </div>
          );
        }}
        />
        </div>

      <button
        onClick={() => {
          setSelectedDate(undefined);
          setOpenModal(true);
        }}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-full shadow-sm text-md"
      >
        + Create
      </button>

      <CreateEventModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={async (payload) => {
           setOpenModal(false); 
          await createEvent(payload);
          fetchCalendar(visibleRange.start, visibleRange.end); 
        }}
        selectedDate={selectedDate}
      />

      {selectedEvent && (
        <EventDetails
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          event={selectedEvent}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </>
  );
};

export default UserCalendar;
