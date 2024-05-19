import { useState, useEffect } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';
import useReservations from '../hooks/useReservations';
import useBowlingLanes from '../hooks/useBowlingLanes';
import useDiningTables from '../hooks/useDiningTables';
import useAirhockeyTables from '../hooks/useAirhockeyTables';
import { IReservation } from '../types/types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../security/AuthProvider'; 

// Import your styled components for the modal and form
import { Modal, FormContainer, Form, InputContainer, Label, Input, ButtonContainer } from '../styles/FormLayout.ts';
import { GridTop } from '../styles/Grids.ts';
import { TableLarge, TableHeader, TableRow, TableData, TableWrapper } from '../styles/Tables.ts';

const Reservations = () => {
  const { reservations, isLoading, createReservation } = useReservations();
  const { username } = useAuth();
  const { bowlingLanes, getBowlingLanes } = useBowlingLanes();
  const { diningTables, getDiningTables } = useDiningTables();
  const { airhockeyTables, getAirhockeyTables } = useAirhockeyTables();
  
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

  const [modalContent, setModalContent] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  useEffect(() => {
    if (username) {
      setFormData(prevFormData => ({
        ...prevFormData,
        userWithRolesUsername: username
      }));
    }
  }, [username]);

  const handleAddFormOpen = () => {
    setShowAddForm(true);
  };

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
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <>
      <GridTop>
        <h2>Reservationer</h2>
        <button onClick={handleAddFormOpen}>Opret Reservation</button>
      </GridTop>
      <TableWrapper>
        <TableLarge>
          <TableHeader>
            <tr>
              <th style={{ padding: '8px' }}>ID</th>
              <th style={{ padding: '8px' }}>Start Tid</th>
              <th style={{ padding: '8px' }}>Antal Deltagere</th>
              <th style={{ padding: '8px' }}>Kunde Navn</th>
              <th style={{ padding: '8px' }}>Telfon</th>
              <th style={{ padding: '8px' }}>Handling</th>
            </tr>
          </TableHeader>
          <tbody>
            {isLoading && <tr><td>Loading...</td></tr>}
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableData>{reservation.id}</TableData>
                <TableData>{reservation.startTime}</TableData>
                <TableData>{reservation.partySize}</TableData>
                <TableData>{reservation.customerName}</TableData>
                <TableData>{reservation.customerPhone}</TableData>
                <TableData>
                  <FaPen style={{ marginRight: '5px', cursor: 'pointer', }} />
                  <FaTrash style={{ marginRight: '5px', cursor: 'pointer' }} />
                </TableData>
              </TableRow>
            ))}
          </tbody>
        </TableLarge>
      </TableWrapper>
      {showAddForm && (
        <Modal>
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
                <Input type="number" name="partySize" value={formData.partySize || ''} onChange={handleFormChange} />
              </Label>
              <Label>
                Kunde Navn:
                <Input type="text" name="customerName" value={formData.customerName || ''} onChange={handleFormChange} />
              </Label>
              <Label>
                Telefon:
                <Input type="text" name="customerPhone" value={formData.customerPhone || ''} onChange={handleFormChange} />
              </Label>
            </InputContainer>
            <ButtonContainer>
              <button type="submit">Submit</button>
              <button onClick={() => setShowAddForm(false)}>Cancel</button>
            </ButtonContainer>
          </form>
          </FormContainer>
        </Modal>
      )}
      {showModal && (
        <Modal>
          {modalContent}
          <button onClick={() => setShowModal(false)}>Close</button>
        </Modal>
      )}
    </>
  );
}

export default Reservations;
