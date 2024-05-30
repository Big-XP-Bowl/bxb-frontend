import { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from 'react-hot-toast'; // Import toast for displaying notifications
import { IReservation } from "../../types/types";
import { formatInTimeZone } from 'date-fns-tz';
import {
  Modal,
  FormContainer,
  InputContainer,
  Label,
  Input,
  ButtonContainer,
} from "../../styles/FormLayout.ts";// Import formatInTimeZone for formatting date in timezone

interface ReservationFormProps {
  initialFormData: Partial<IReservation>;
  onSubmit: (formData: IReservation) => void;
  showForm: boolean;
  onClose: () => void;
}

const ReservationForm = ({ initialFormData, onSubmit, showForm, onClose  }: ReservationFormProps) => {
  const [formData, setFormData] = useState<Partial<IReservation>>(initialFormData);
  const [selectedActivityType, setSelectedActivityType] = useState<string>("");
  const [isChildFriendly, setIsChildFriendly] = useState<boolean>(false); // Add this state
  
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "activityType") {
      setSelectedActivityType(value);
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "activityId" ? parseInt(value) : value, // Convert value to number for activityID
    }));
  };

  const handleDateChange = (date: Date) => {
    const timeZone = 'Europe/Copenhagen';
    const formattedDate = formatInTimeZone(date, timeZone, 'yyyy-MM-dd\'T\'HH:mm:ss');
    setFormData((prevState) => ({
      ...prevState,
      startTime: formattedDate,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData as IReservation);
    setFormData(initialFormData); 
    toast.success("Reservation submitted successfully");
  };

  return (
    showForm && (
      <Modal>
        <FormContainer onSubmit={handleFormSubmit}>
          <h2>{formData.id ? "Edit Reservation" : "Add Reservation"}</h2>
          <InputContainer>
            <Label>
              Start Tid og Dato:
              <DatePicker
                selected={formData.startTime ? new Date(formData.startTime) : null}
                //@ts-expect-error // Ignore type error
                onChange={(date: Date | null) => handleDateChange(date)}
                showTimeSelect
                dateFormat="dd/MM/yyyy HH:mm"
                name="startTime"
              />
            </Label>
            <Label>
              Aktivitets Type:
              <select
                value={selectedActivityType}
                name="activityType"
                onChange={handleFormChange}
              >
                <option value="">Vælg Aktivitets Type</option>
                <option value="Airhockey">Airhockey</option>
                <option value="DiningTable">Restaurant</option>
                <option value="BowlingLane">Bowling</option>
              </select>
            </Label>
            <Label>
              Antal Deltagere:
              <Input
                type="number"
                name="partySize"
                value={formData.partySize || ""}
                onChange={handleFormChange}
              />
            </Label>
            <Label>
              Kunde Navn:
              <Input
                type="text"
                name="customerName"
                value={formData.customerName || ""}
                onChange={handleFormChange}
              />
            </Label>
            <Label>
              Telefon:
              <Input
                type="text"
                name="customerPhone"
                value={formData.customerPhone || ""}
                onChange={handleFormChange}
              />
            </Label>
            <Label>
              Børnevenlig:
              <Input
                type="checkbox"
                checked={selectedActivityType === "BowlingLane" ? isChildFriendly : false}
                onChange={(e) => setIsChildFriendly(e.target.checked)}
              />
            </Label>
          </InputContainer>
          <ButtonContainer>
            <button type="submit">
              {formData.id ? "Update" : "Submit"}
            </button>
            <button onClick={onClose}>Cancel</button>
          </ButtonContainer>
        </FormContainer>
      </Modal>
    )
  );
};

export default ReservationForm;