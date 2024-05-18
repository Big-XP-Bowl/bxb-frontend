import { useState, useEffect } from 'react';
import useReservations from '../hooks/useReservations';
import { IReservation } from '../types/types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FormContainer, InputContainer, Label, ButtonContainer } from '../styles/FormLayout.ts';
import { useAuth } from '../security/AuthProvider'; // Import the useAuth hook

const TestReservations = () => {
  const { username } = useAuth(); // Access the logged-in user's username
  const { createReservation } = useReservations();

  const initialFormData: Partial<IReservation> = {
    activityId: 0, // Initialize activityId to 0 or a default value
    startTime: '',
    partySize: 0,
    userWithRolesUsername: username || '', // Initialize with the username if available
    customerName: '',
    customerPhone: '',
  };

  const [formData, setFormData] = useState<Partial<IReservation>>(initialFormData);

  useEffect(() => {
    if (username) {
      setFormData(prevFormData => ({
        ...prevFormData,
        userWithRolesUsername: username
      }));
    }
  }, [username]);

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
      }
    } catch (error) {
      console.error("An error occurred while creating the reservation", error);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'activityId' ? parseInt(value) : value, // Convert value to number for activityId
    }));
  };
  
  const handleDateChange = (date: Date) => {
    const isoString = date.toISOString();
    setFormData(prevState => ({
      ...prevState,
      startTime: isoString,
    }));
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
              value={formData.activityId || ''}
              name="activityId"
              onChange={handleFormChange}
            >
              <option value="">Select Activity</option>
              <option value="1">Bowling</option>
              <option value="2">Air Hockey</option>
              <option value="3">Dining Table</option>
            </select>
          </Label>
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
