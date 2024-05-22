import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import useReservations from '../hooks/useReservations'; // Adjust the path as necessary
import { IReservation } from '../types/types';
import { Toaster } from 'react-hot-toast';

const localizer = momentLocalizer(moment);

const TestReservations: React.FC = () => {
  const { reservations, isLoading } = useReservations();
  const [events, setEvents] = useState<Event[]>([]);
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    if (!isLoading) {
      const formattedEvents = reservations.map((reservation: IReservation) => ({
        title: reservation.customerName,
        start: new Date(reservation.startTime),
        end: new Date(new Date(reservation.startTime).getTime() + reservation.partySize * 60000), // Assuming partySize is in minutes
        id: reservation.id,
      }));
      setEvents(formattedEvents);
    }
  }, [reservations, isLoading]);

  // Custom toolbar component to display only the week view and navigation buttons
  const CustomToolbar = ({ label, onNavigate }: { label: string; onNavigate: Function }) => {
    return (
      <div>
        <span>{label}</span>
        <button onClick={() => onNavigate('TODAY')}>Today</button>
        <button onClick={() => onNavigate('PREV')}>Previous</button>
        <button onClick={() => onNavigate('NEXT')}>Next</button>
      </div>
    );
  };

  // Function to check if an event is within the allowed time range
  const isEventWithinRange = (event: Event): boolean => {
    const startHour = moment(event.start).hour();
    const endHour = moment(event.end).hour();
    return startHour >= 10 && endHour <= 22;
  };

  return (
    <div>
      <Toaster />
      <h1>Reservation Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '50px' }}
        components={{
          toolbar: (props: any) => (
            <CustomToolbar
              {...props}
              onNavigate={(action: string) => {
                if (action === 'PREV') {
                  const newDate = moment(date).subtract(1, 'week').toDate();
                  setDate(newDate);
                  props.onNavigate('DATE', newDate);
                } else if (action === 'NEXT') {
                  const newDate = moment(date).add(1, 'week').toDate();
                  setDate(newDate);
                  props.onNavigate('DATE', newDate);
                } else if (action === 'TODAY') {
                  const newDate = new Date();
                  setDate(newDate);
                  props.onNavigate('DATE', newDate);
                }
              }}
            />
          ),
          event: ({ event }: { event: Event }) => {
            if (!isEventWithinRange(event)) {
              return null;
            }
            return (
              <div>
                <div>{event.title}</div>
                <div>{moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}</div> {/* Display start and end time in 24-hour format */}
              </div>
            );
          },
        }}
        views={['week']} // Restricting to only week view
        defaultView="week" // Setting default view to week
        date={date} // Setting the current date
        min={new Date(0, 0, 0, 10, 0)} // Minimum time allowed (10:00 AM)
        max={new Date(0, 0, 0, 22, 0)} // Maximum time allowed (10:00 PM)
        formats={{ timeGutterFormat: (date: Date) => moment(date).format('HH:mm') }} // Set time format in the time gutter
      />
    </div>
  );
};

export default TestReservations;
