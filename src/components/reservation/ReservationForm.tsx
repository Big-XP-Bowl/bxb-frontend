import { useState, useEffect } from 'react';
import useBowlingLanes from "../../hooks/useBowlingLanes";
import useDiningTables from "../../hooks/useDiningTables";
import useAirhockeyTables from "../../hooks/useAirhockeyTables";
import useActivities from '../../hooks/useActivities.ts';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IReservation } from "../../types/types";
import { formatInTimeZone } from 'date-fns-tz';
import {
  Modal,
  FormContainer,
  InputContainer,
  Label,
  Input,
  ButtonContainer,
} from "../../styles/FormLayout.ts";

interface ReservationFormProps {
  initialFormData: Partial<IReservation>;
  onSubmit: (formData: IReservation) => void;
  showForm: boolean;
  onClose: () => void;
}

const ReservationForm = ({ initialFormData, onSubmit, showForm, onClose }: ReservationFormProps) => {
  const [formData, setFormData] = useState<Partial<IReservation>>(initialFormData);
  const [selectedActivityType, setSelectedActivityType] = useState<string>("");
  const [isChildFriendly, setIsChildFriendly] = useState<boolean>(false);
  const { fetchActivityById } = useActivities();
  const { bowlingLanes, getBowlingLanes } = useBowlingLanes();
  const { diningTables, getDiningTables } = useDiningTables();
  const { airhockeyTables, getAirhockeyTables } = useAirhockeyTables();
  const [activitiesFetched, setActivitiesFetched] = useState({
    Airhockey: false,
    DiningTable: false,
    BowlingLane: false,
  });

  useEffect(() => {
    const fetchActivityDetails = async () => {
      if (formData.activityId) {
        try {
          const activity = await fetchActivityById(formData.activityId);
          setSelectedActivityType(activity.type);
        } catch (error) {
          console.error("An error occurred while fetching activity details", error);
        }
      }
    };
  
    fetchActivityDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    if (selectedActivityType === "Airhockey" && !activitiesFetched.Airhockey) {
      getAirhockeyTables();
      setActivitiesFetched((prev) => ({ ...prev, Airhockey: true }));
    } else if (
      selectedActivityType === "DiningTable" &&
      !activitiesFetched.DiningTable
    ) {
      getDiningTables();
      setActivitiesFetched((prev) => ({ ...prev, DiningTable: true }));
    } else if (
      selectedActivityType === "BowlingLane" &&
      !activitiesFetched.BowlingLane
    ) {
      getBowlingLanes();
      setActivitiesFetched((prev) => ({ ...prev, BowlingLane: true }));
    }
  }, [selectedActivityType, activitiesFetched, getAirhockeyTables, getDiningTables, getBowlingLanes]);

  
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "activityType") {
      setSelectedActivityType(value);
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "activityId" ? parseInt(value) : value,
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
  };

  const renderActivityOptions = () => {
    if (selectedActivityType === "Airhockey") {
      return airhockeyTables.map((activity) => (
        <option key={activity.id} value={activity.id}>
          {activity.name}
        </option>
      ));
    } else if (selectedActivityType === "DiningTable") {
      return diningTables.map((activity) => (
        <option key={activity.id} value={activity.id}>
          {activity.name}
        </option>
      ));
    } else if (selectedActivityType === "BowlingLane") {
      const lanesToRender = isChildFriendly
        ? bowlingLanes.filter((lane) => lane.childFriendly)
        : bowlingLanes;

      return lanesToRender.map((activity) => (
        <option key={activity.id} value={activity.id}>
          {activity.name}
        </option>
      ));
    }
    return null;
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
              onChange={(date: Date | null) => {
                if (date) {
                  handleDateChange(date);
                }
              }}
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
            {selectedActivityType === "BowlingLane" && (
              <Label>
                Børnevenlig:
                <Input
                  type="checkbox"
                  checked={isChildFriendly}
                  onChange={(e) => setIsChildFriendly(e.target.checked)}
                />
              </Label>
            )}
            {selectedActivityType && (
              <Label>
                Specifikation:
                <select
                  value={formData.activityId || ""}
                  name="activityId"
                  onChange={handleFormChange}
                >
                  <option value="">Vælg {selectedActivityType}</option>
                  {renderActivityOptions()}
                </select>
              </Label>
            )}
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
          </InputContainer>
          <ButtonContainer>
            <button type="submit">
              {formData.id ? "Update" : "Submit"}
            </button>
            <button type="button" onClick={onClose}>Cancel</button>
          </ButtonContainer>
        </FormContainer>
      </Modal>
    )
  );
};


export default ReservationForm;