import { useState, useEffect } from 'react';
import useBowlingLanes from '../hooks/useBowlingLanes';
import useDiningTables from '../hooks/useDiningTables';
import useAirhockeyTables from '../hooks/useAirhockeyTables';
import useReservations from '../hooks/useReservations';
import { IReservation } from '../types/types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FormContainer, InputContainer, Label, ButtonContainer } from '../styles/FormLayout.ts';
import { useAuth } from '../security/AuthProvider'; // Import the useAuth hook

const TestReservations = () => {
  const { username } = useAuth(); // Access the logged-in user's username
  const { bowlingLanes, getBowlingLanes } = useBowlingLanes();
  const { diningTables, getDiningTables } = useDiningTables();
  const { airhockeyTables, getAirhockeyTables } = useAirhockeyTables();
  const { createReservation } = useReservations();

  const initialFormData: Partial<IReservation> = {
    activityId: 0, // Initialize activityID to 0 or a default value
    startTime: '',
    partySize: 0,
    userWithRolesUsername: username || '', // Initialize with the username if available
    customerName: '',
    customerPhone: '',
  };

  const [formData, setFormData] = useState<Partial<IReservation>>(initialFormData);
  const [selectedActivityType, setSelectedActivityType] = useState<string>('');
  const [activitiesFetched, setActivitiesFetched] = useState<{
    Airhockey: boolean,
    DiningTable: boolean,
    BowlingLane: boolean
  }>({
    Airhockey: false,
    DiningTable: false,
    BowlingLane: false
  });

  useEffect(() => {
    if (username) {
      setFormData(prevFormData => ({
        ...prevFormData,
        userWithRolesUsername: username
      }));
    }
  }, [username]);

  useEffect(() => {
    // Fetch data based on selected activity type, only if not already fetched
    if (selectedActivityType === 'Airhockey' && !activitiesFetched.Airhockey) {
      getAirhockeyTables();
      setActivitiesFetched(prev => ({ ...prev, Airhockey: true }));
    } else if (selectedActivityType === 'DiningTable' && !activitiesFetched.DiningTable) {
      getDiningTables();
      setActivitiesFetched(prev => ({ ...prev, DiningTable: true }));
    } else if (selectedActivityType === 'BowlingLane' && !activitiesFetched.BowlingLane) {
      getBowlingLanes();
      setActivitiesFetched(prev => ({ ...prev, BowlingLane: true }));
    }
  }, [selectedActivityType, activitiesFetched, getAirhockeyTables, getDiningTables, getBowlingLanes]);

  const handleAddReservation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("FormData before submission:", formData); // Log the formData just before submission
      const newReservation = await createReservation({
        ...formData,
        partySize: parseInt(formData.partySize as unknown as string) // Ensure partySize is a number
      });
      if (newReservation) {
        setFormData(initialFormData);
        setSelectedActivityType(''); // Reset activity type
        setActivitiesFetched({
          Airhockey: false,
          DiningTable: false,
          BowlingLane: false
        }); // Reset fetch state to allow future fetching if needed
      }
    } catch (error) {
      console.error("An error occurred while creating the reservation", error);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'activityType') {
      setSelectedActivityType(value);
    }
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'activityId' ? parseInt(value) : value, // Convert value to number for activityID
    }));
  };

  const handleDateChange = (date: Date) => {
    const isoString = date.toISOString();
    setFormData(prevState => ({
      ...prevState,
      startTime: isoString,
    }));
  };

  const renderActivityOptions = () => {
    if (selectedActivityType === 'Airhockey') {
      return airhockeyTables.map(activity => (
        <option key={activity.id} value={activity.id}>{activity.name}</option>
      ));
    } else if (selectedActivityType === 'DiningTable') {
      return diningTables.map(activity => (
        <option key={activity.id} value={activity.id}>{activity.name}</option>
      ));
    } else if (selectedActivityType === 'BowlingLane') {
      return bowlingLanes.map(activity => (
        <option key={activity.id} value={activity.id}>{activity.name}</option>
      ));
    }
    return null;
  };

  return (
    <FormContainer>
      <h2>Add Reservation</h2>
      <form onSubmit={handleAddReservation}>
        <InputContainer>
          <Label>
            Start Tid og Dato:
            <DatePicker
              selected={formData.startTime ? new Date(formData.startTime) : null}
              onChange={date => handleDateChange(date)}
              showTimeSelect
              dateFormat="dd/MM/yyyy HH:mm"
              name="startTime"
            />
          </Label>
          <Label>
            Aktivitet:
            <select
              value={selectedActivityType}
              name="activityType"
              onChange={handleFormChange}
            >
              <option value="">Select Activity Type</option>
              <option value="Airhockey">Airhockey</option>
              <option value="DiningTable">Dining Table</option>
              <option value="BowlingLane">Bowling Lane</option>
            </select>
          </Label>
          {selectedActivityType && (
            <Label>
              Specific Activity:
              <select
                value={formData.activityId || ''}
                name="activityId"
                onChange={handleFormChange}
              >
                <option value="">Select {selectedActivityType}</option>
                {renderActivityOptions()}
              </select>
            </Label>
          )}
          <Label>
            Antal Deltagere:
            <input type="number" name="partySize" value={formData.partySize || ''} onChange={handleFormChange} />
          </Label>
          <Label>
            Kunde Navn:
            <input type="text" name="customerName" value={formData.customerName || ''} onChange={handleFormChange} />
          </Label>
          <Label>
            Telefon:
            <input type="text" name="customerPhone" value={formData.customerPhone || ''} onChange={handleFormChange} />
          </Label>
        </InputContainer>
        <ButtonContainer>
          <button type="submit">Submit</button>
        </ButtonContainer>
      </form>
    </FormContainer>
  );
}

export default TestReservations;
