import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import useReservations from '../hooks/useReservations';
import useActivities from '../hooks/useActivities';
import { IReservation, IActivity } from '../types/types';
import { Toaster } from 'react-hot-toast';

const localizer = momentLocalizer(moment);

const TestReservations: React.FC = () => {
  const { reservations, isLoading } = useReservations();
  const { activities } = useActivities(); // Call useActivities only once
  const [events, setEvents] = useState<Event[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedActivityType, setSelectedActivityType] = useState<string>('');

  useEffect(() => {
    if (!isLoading) {
      const formattedEvents = reservations.map((reservation: IReservation) => ({
        title: reservation.customerName,
        start: new Date(reservation.startTime),
        end: new Date(new Date(reservation.startTime).getTime() + 60 * 60000),
        id: reservation.id,
      }));
      setEvents(formattedEvents);
    }
  }, [reservations, isLoading]);

  useEffect(() => {
    if (activities.length > 0)
      console.log('Activities:', activities); // Log activities only once
  }, [activities]);

  const handleActivityTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value;
    setSelectedActivityType(selectedType);
  
    const filteredActivities = activities.filter((activity: IActivity) => {  
      return activity.type === selectedType;
    });
    console.log(`Filtered activities for ${selectedType}:`, filteredActivities); // Use template literals to include selectedType
  };
  
  //@ts-expect-error - SlotInfo is not defined
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    console.log(`Selected slot: Start - ${moment(slotInfo.start).format('HH:mm')}, End - ${moment(slotInfo.end).format('HH:mm')}, Selected date: ${moment(slotInfo.start).format('YYYY-MM-DD')}`);
  
    if (selectedActivityType) {
      console.log('Selected activity type:', selectedActivityType);
  
      const filteredActivities = activities.filter((activity: IActivity) => activity.type === selectedActivityType);
      console.log('Filtered activities:', filteredActivities); // Log all activities of the selected type
  
      const availableActivities = filteredActivities.filter((activity: IActivity) => {
        // Assuming no activity has startTime (reservations have startTime)
        const activityStartTime = moment(reservations.find((reservation) => reservation.activityId === activity.id)?.startTime); // Find reservation startTime for this activity
  
        console.log(`  - Checking activity: ${activity.id} (${activity.type})`); 
  
        if (activityStartTime.isValid()) { // Check if startTime is found in reservations
          console.log(`    - Reservation start time: ${activityStartTime.format('HH:mm')}`);
          return activityStartTime.isAfter(moment(slotInfo.start)) && activityStartTime.isBefore(moment(slotInfo.end));
        } else {
          console.log('    - No reservation found for this activity');
          // Consider handling activities with no reservations differently (e.g., always available)
          return true; // Assuming activity without reservation is available (adjust as needed)
        }
      });
  
      console.log('Available activities:', availableActivities); // Log only available activities
    }
  };
  
  const CustomToolbar = ({ label, onNavigate }: { label: string; onNavigate: Function }) => {
    return (
      <div>
        <span>{label}</span>
        <button onClick={() => onNavigate('TODAY')}>Today</button>
        <button onClick={() => onNavigate('PREV')}>Previous</button>
        <button onClick={() => onNavigate('NEXT')}>Next</button>
        <select
          name="activityType"
          value={selectedActivityType}
          onChange={handleActivityTypeChange}
        >
          <option value="">Vælg Aktivitets Type</option>
          <option value="Airhockey">Airhockey</option>
          <option value="DiningTable">Restaurant</option>
          <option value="BowlingLane">Bowling</option>
        </select>
      </div>
    );
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
        selectable
        onSelectSlot={handleSelectSlot}
        step={60}
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
        }}
        views={['week']}
        defaultView="week"
        date={date}
        min={new Date(0, 0, 0, 10, 0)}
        max={new Date(0, 0, 0, 22, 0)}
        formats={{ timeGutterFormat: (date: Date) => moment(date).format('HH:mm') }}
      />
    </div>
  );
};

export default TestReservations;


