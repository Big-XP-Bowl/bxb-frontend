import React, { useEffect, useState, useRef } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import useReservations from '../hooks/useReservations';
import useActivities from '../hooks/useActivities';
import { IActivity } from '../types/types';
import { Toaster } from 'react-hot-toast';
import { PageLayout } from '../styles/PageLayout';
import styled from 'styled-components';
import { GridCalendarToolbar } from '../styles/Grids';

const localizer = momentLocalizer(moment);

const TestReservations: React.FC = () => {
  const { reservations, isLoading } = useReservations();
  const { activities } = useActivities(); // Call useActivities only once
  const [date, setDate] = useState<Date>(new Date());
  const [selectedActivityType, setSelectedActivityType] = useState<string>('');
  const [availableActivities, setAvailableActivities] = useState<IActivity[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const availableActivitiesRef = useRef<HTMLDivElement>(null);

  interface SlotInfo {
    start: Date;
    end: Date;
  }

  useEffect(() => {
    if (!isLoading) {
      console.log('Reservations:', reservations);
    }
  }, [reservations, isLoading]);

  useEffect(() => {
  }, [activities]);

  const handleActivityTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value;
    setSelectedActivityType(selectedType);

    const filteredActivities = activities.filter((activity: IActivity) => {
      return activity.type === selectedType;
    });

    setAvailableActivities(filteredActivities);
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo.start);
    
    if (selectedActivityType) {
      console.log('Selected activity type:', selectedActivityType);

      const filteredActivities = activities.filter((activity: IActivity) => activity.type === selectedActivityType);

      console.log('Filtered activities:', filteredActivities);

      const availableFilteredActivities = filteredActivities.filter((filteredActivity) => {
        const hasReservation = reservations.some((reservation) => {
  
          const slotStartTime = moment(slotInfo.start).format('YYYY-MM-DDTHH:mm:ss');
          const reservationStartTime = moment(reservation.startTime).format('YYYY-MM-DDTHH:mm:ss');

          // Check if the reservation's activityId matches the ID of the filtered activity
          // and if the reservation start time is equal to the slot start time
          return reservation.activityId === filteredActivity.id && reservationStartTime === slotStartTime;
        });

        return !hasReservation;
      });

      setAvailableActivities(availableFilteredActivities);      
      scrollToAvailableActivities();
    }
  };

  const scrollToAvailableActivities = () => {
    if (availableActivitiesRef.current) {
      availableActivitiesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const slotPropGetter = (date: Date) => {
    if (selectedSlot && moment(date).isSame(selectedSlot, 'minute')) {
      return {
        style: {
          backgroundColor: '#f9abab',
        },
      };
    }
    return {};
  };

  interface ToolbarNavigation {
    (action: string, date?: Date): void; // Function signature with optional date argument
  }

  const CustomToolbar = ({ label, onNavigate }: { label: string; onNavigate: ToolbarNavigation }) => {
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
    <PageLayout>
      <Toaster />
      <h1>Reservation Calendar</h1>
      <Calendar
        localizer={localizer}
        selectable
        onSelectSlot={handleSelectSlot}
        slotPropGetter={slotPropGetter}
        style={{ height: 500, margin: '50px' }}
        components={{
          toolbar: (props) => (
            <GridCalendarToolbar>
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
            </GridCalendarToolbar>
          ),
        }}
        views={['week']}
        defaultView="week"
        date={date}
        step={(() => {
          switch (selectedActivityType) {
            case 'Airhockey':
              return 30;
            case 'BowlingLane':
              return 60;
            case 'DiningTable':
              return 90;
            default:
              return 60;
          }
        })()}
        min={new Date(0, 0, 0, 10, 0)}
        max={new Date(0, 0, 0, 22, 0)}
        formats={{ timeGutterFormat: (date: Date) => moment(date).format('HH:mm') }}
      />
      <div ref={availableActivitiesRef}>
      <h2>Tilgængelige aktiviteter {selectedSlot ? moment(selectedSlot).format('dddd') : ''} d. {selectedSlot ? moment(selectedSlot).format('DD/MM/YYYY') : ''} kl. {selectedSlot ? moment(selectedSlot).format('HH:mm') : ''}</h2>
        <ul>
          {availableActivities.map((activity) => (
            <Card3 key={activity.id}>
              <Card3Title>{activity.name}</Card3Title>
              {activity.type === 'Airhockey' && (
                <>
                  <Card3Pris>40 kr. pr. 30 min. </Card3Pris>
                  <Card3Details>4 personer pr. bord | 30 minutter</Card3Details>
                </>
              )}
              {activity.type === 'BowlingLane' && (
                <>
                  <Card3Pris>100 kr. pr. time</Card3Pris>
                  <Card3Details>6 personer pr. bane | 1 time</Card3Details>
                </>
              )}
              {activity.type === 'DiningTable' && (
                <>
                  <Card3Pris>200 kr. pr. person</Card3Pris>
                  <Card3Pris>120 kr. for børn under 12 år</Card3Pris>
                  <Card3Pris>Børn under 3 år gratis </Card3Pris>
                  <Card3Details>4 - 8 personer | 90 min.</Card3Details>
                </>
              )}
            </Card3>
          ))}
        </ul>
      </div>
    </PageLayout>
  );
};

const Card3 = styled.div`
  background: #fff;
  min-width: 400px;
  border-radius: 10px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 30%;
  padding: 1rem;
  margin: 1rem;
`;

const Card3Title = styled.h3`
  margin: 0;
`;

const Card3Pris = styled.p`
  margin: 0;
  font-size: 1.0rem;
`;

const Card3Details = styled.p`
  margin: 0;
  font-size: 0.8rem;
`;

export default TestReservations;
