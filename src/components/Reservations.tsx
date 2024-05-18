import { useState } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';
import useReservations from '../hooks/useReservations';
import { IReservation } from '../types/types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 

// Import your styled components for the modal and form
import { Modal, FormContainer, Form, InputContainer, Label, Input, ButtonContainer } from '../styles/FormLayout.ts';
import { GridTop } from '../styles/Grids.ts';
import { TableLarge, TableHeader, TableRow, TableData, TableWrapper } from '../styles/Tables.ts';

const Reservations = () => {
  const { reservations, isLoading, createReservation } = useReservations();

  const [modalContent, setModalContent] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<IReservation>({
    id: 0,
    activity: { id: 0, name: '', capacity: 0, isReserved: false, duration: 0, isClosed: false },
    startTime: '',
    partySize: 0,
    userWithRoles: '',
    customerName: '',
    customerPhone: '',
    created: '',
    edited: '',
  });

  const handleAddFormOpen = () => {
    setShowAddForm(true);
  };

  const handleAddFormClose = () => {
    setShowAddForm(false);
    setFormData(null);
  };

  const handleAddReservation = async () => {
    try {
      const newReservation = await createReservation(formData!);
      console.log("FormData before submission:", formData);
      if (newReservation) {
        setModalContent("Reservation added successfully.");
        setShowModal(true);
        setShowAddForm(false);
        setFormData(null);
        // Reload reservations or perform any necessary actions
      } else {
        setModalContent("An error occurred while creating the reservation");
        setShowModal(true);
      }
    } catch (error) {
      console.error("An error occurred while creating the reservation", error);
    }
  };


  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState: IReservation | null) => ({
      id: 0,
      activity: { id: 0, name: '', capacity: 0, isReserved: false, duration: 0, isClosed: false },
      startTime: '',
      partySize: 0,
      userWithRoles: '',
      customerName: '',
      customerPhone: '',
      created: '',
      edited: '',
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date) => {
    //@ts-ignore
    setFormData((prevState: IReservation | null) => ({
      ...prevState,
      startTime: date.toISOString(),
    }));
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
            <Form onSubmit={handleAddReservation}>
              <InputContainer>
                <Label>
                  Start Tid og Dato:
                  <DatePicker
                    selected={formData ? new Date(formData.startTime) : null!}
                    onChange={(date) => handleDateChange(date)}
                    showTimeSelect
                    dateFormat="dd/MM/yyyy HH:mm"
                    name="startTime"
                  />
                </Label>
                <Label>
                  Aktivitet:
                  <select
                    value={formData?.activity?.id || ''}
                    name="activity"
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
                  <Input type="number" name="partySize" value={formData?.partySize || ''} onChange={handleFormChange} />
                </Label>
                <Label>
                  Kunde Navn:
                  <Input type="text" name="customerName" value={formData?.customerName || ''} onChange={handleFormChange} />
                </Label>
                <Label>
                  Telefon:
                  <Input type="text" name="customerPhone" value={formData?.customerPhone || ''} onChange={handleFormChange} />
                </Label>
              </InputContainer>
              <ButtonContainer>
                <button type="submit">Submit</button>
                <button type="button" onClick={handleAddFormClose}>Cancel</button>
              </ButtonContainer>
            </Form>
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
