import React, { useEffect, useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChild } from "react-icons/fa";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import useReservations from '../hooks/useReservations';
import useActivities from '../hooks/useActivities';
import { IActivity, IBowlingLane, IReservation } from '../types/types';
import { Toaster, toast } from 'react-hot-toast';
import { PageLayout } from '../styles/PageLayout';
import styled from 'styled-components';
import { GridCalendarToolbar } from '../styles/Grids';
import ReservationForm from './reservation/ReservationForm';
// import { parseTime, validateReservationForm} from './reservation/reservationUtils';
import { useAuth } from '../security/AuthProvider';

const localizer = momentLocalizer(moment);

const TestReservations: React.FC = () => {
  const { reservations, isLoading, createReservation, fetchReservations } = useReservations();
  const { activities, updateActivity, fetchActivities } = useActivities();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedActivityType, setSelectedActivityType] = useState<string>('');
  const [availableActivities, setAvailableActivities] = useState<IActivity[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null); 
  const { username } = useAuth();
  const availableActivitiesRef = useRef<HTMLDivElement>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const initialFormData: Partial<IReservation> = {
    activityId: 0,
    startTime: "",
    partySize: 0,
    userWithRolesUsername: username || "",
    customerName: "",
    customerPhone: "",
  };
  const [formData, setFormData] = useState<Partial<IReservation>>(initialFormData);

  interface SlotInfo {
    start: Date;
    end: Date;
  }

  useEffect(() => {
    if (username) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        userWithRolesUsername: username,
      }));
    }
  }, [username]);

  useEffect(() => {
    if (!isLoading) {
      console.log('Reservations:', reservations);
    }
  }, [reservations, isLoading]);

  useEffect(() => {
    if (selectedActivityType) {
      const filteredActivities = activities.filter((activity: IActivity) => activity.type === selectedActivityType);
      setAvailableActivities(filteredActivities);
    }
  }, [activities, selectedActivityType]);

  
  const handleActivityTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value;
    setSelectedActivityType(selectedType);

    const filteredActivities = activities.filter((activity: IActivity) => {
      return activity.type === selectedType;
    });

    setAvailableActivities(filteredActivities);
  };

const toggleActivityClose = async (activity: IActivity) => {
  const updatedActivity = { ...activity, isClosed: true };
  
  try {
    await updateActivity(activity.id, updatedActivity);
    console.log(updatedActivity)
    toast.success(`Activity closed successfully`);
    await fetchActivities();
  } catch (error) {
    toast.error('Error updating activity');
  }
};
  const toggleActivityOpen = async (activity: IActivity) => {
    const updatedActivity = { ...activity, isClosed: false };
    
    try {
      await updateActivity(activity.id, updatedActivity);
      console.log(updatedActivity)
      toast.success(`Activity opened successfully`);
      await fetchActivities();  
    } catch (error) {
      toast.error('Error updating activity');
    }
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo.start);
  
    if (selectedActivityType) {
      console.log('Selected activity type:', selectedActivityType);
  
      const filteredActivities = activities.filter((activity: IActivity) => activity.type === selectedActivityType);
  
      console.log('Filtered activities:', filteredActivities);
  
      let availableFilteredActivities = [];
  
      if (moment(slotInfo.start).format('HH:mm:ss') === '00:00:00') {
        // If slot start time is 00:00, render all selected activities without filtering closed ones
        availableFilteredActivities = filteredActivities;
      } else {
        availableFilteredActivities = filteredActivities.filter((filteredActivity) => {
          const hasReservation = reservations.some((reservation) => {
            const slotStartTime = moment(slotInfo.start).format('YYYY-MM-DDTHH:mm:ss');
            const reservationStartTime = moment(reservation.startTime).format('YYYY-MM-DDTHH:mm:ss');
  
            // Check if the reservation's activityId matches the ID of the filtered activity
            // and if the reservation start time is equal to the slot start time
            return reservation.activityId === filteredActivity.id && reservationStartTime === slotStartTime;
          });
  
          return !hasReservation;
        });
  
        // Filter out closed activities for non-00:00 slots
        availableFilteredActivities = availableFilteredActivities.filter(activity => !activity.closed);
      }
  
      // Set available activities
      setAvailableActivities(availableFilteredActivities);
      scrollToAvailableActivities();
    }
  };
  

  const scrollToAvailableActivities = () => {
    if (availableActivitiesRef.current) {
      availableActivitiesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  function isBowlingLane(activity: IActivity): activity is IBowlingLane {
    return activity.type === 'BowlingLane';
  }

  const slotPropGetter = (date: Date) => {
    if (!selectedActivityType) return {};
  
    // Check if the slot is part of the time gutter column
    const isTimeGutter = date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0;
    if (isTimeGutter) {
      return {}; // Return an empty object to leave the time gutter cells unaffected
    }
  
    const totalActivities = activities.filter(activity => activity.type === selectedActivityType).length;
    if (totalActivities === 0) return {};
  
    const reservationsAtSlot = reservations.filter(reservation =>
      moment(reservation.startTime).isSame(date, 'minute') &&
      activities.some(activity => activity.id === reservation.activityId && activity.type === selectedActivityType)
    ).length;
  
    const reservedPercentage = (reservationsAtSlot / totalActivities) * 100;
  
    let backgroundColor = '';
    if (reservedPercentage > 60) {
      backgroundColor = '#f9abab'; // Red
    } else if (reservedPercentage > 40) {
      backgroundColor = '#f9f3ab'; // Yellow
    } else {
      backgroundColor = '#abf9ab'; // Green
    }
  
    return {
      style: {
        backgroundColor,
      },
    };
  };

  const handleCreateReservationClick = (slot: Date, activity: IActivity) => {
    setFormData({
      ...initialFormData,
      activityId: activity.id,
      startTime: slot.toISOString(),
    });
    setShowForm(true);
  };
  
  const handleFormSubmit = async (data: IReservation) => {
    try {
      await createReservation(data);
      setShowForm(false);
      fetchReservations();
      toast.success('Reservation oprettet');
    } catch (error) {
      toast.error('Error creating reservation');
    }
  };

  interface ToolbarNavigation {
    (action: string, date?: Date): void;
  }

  const CustomToolbar = ({ label, onNavigate }: { label: string; onNavigate: ToolbarNavigation }) => {
    const navigate = useNavigate();
    return (
      <>
      <div style={{ gap: '1rem'}}>
        <span style={{margin: '0.5em', fontSize: '18px', fontWeight: 'bold'}}>Reservations Kalender</span>
        <span style={{margin: '0.5em', fontSize: '18px', fontWeight: 'bold'}}>{label}</span>
        <button onClick={() => navigate('/reservations')} style={{ margin: '0.5em' }}>Tabel Oversigt</button>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr"}}>
        <button onClick={() => onNavigate('TODAY')} style={{margin: '0.5em'}}>Today</button>
        <button onClick={() => onNavigate('PREV')}style={{margin: '0.5em'}}>Previous</button>
        <button onClick={() => onNavigate('NEXT')}style={{margin: '0.5em'}}>Next</button>
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
        </>
    );
  };

  return (
    <PageLayout>
      <Toaster />
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
      {moment(selectedSlot).format('HH:mm') === '00:00' && (
        <h2>Luk/Åben Aktiviteter {selectedSlot ? moment(selectedSlot).format('dddd') : ''} d. {selectedSlot ? moment(selectedSlot).format('DD/MM/YYYY') : ''}</h2>
      )}
      {moment(selectedSlot).format('HH:mm') !== '00:00' && (
        <h2>Tilgængelige aktiviteter {selectedSlot ? moment(selectedSlot).format('dddd') : ''} d. {selectedSlot ? moment(selectedSlot).format('DD/MM/YYYY') : ''} kl. {selectedSlot ? moment(selectedSlot).format('HH:mm') : ''}</h2>
      )}
      

        <ul>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', paddingBottom: '5em'}}>
          {availableActivities.map((activity) => (
            
            <Card3 key={activity.id} style={{ backgroundColor: activity.closed ? '#f9abab' : '#abf9ab' }}>

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
                {moment(selectedSlot).format('HH:mm') === '00:00' && (
                  <button
                    onClick={() => (activity.closed ? toggleActivityOpen(activity) : toggleActivityClose(activity))}
                    style={{ margin: '0.5em' }}
                  >
                    {activity.closed ? 'Åben Aktivitet' : 'Luk Aktivitet'}
                  </button>
                )}
                {moment(selectedSlot).format('HH:mm') !== '00:00' && (
                  <button onClick={() => handleCreateReservationClick(selectedSlot!, activity)}>Opret Reservation</button>
                )}
                {isBowlingLane(activity) && activity.childFriendly && <FaChild />} 
            </Card3>
            
          ))}
          {showForm && (
            <ReservationForm
            initialFormData={formData}
            onSubmit={handleFormSubmit}
            showForm={showForm}
            onClose={() => setShowForm(false)}
          />
      )}
          
            </div>
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
