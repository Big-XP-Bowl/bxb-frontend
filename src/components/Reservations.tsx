import { useState, useEffect } from "react";
import { FaPen, FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";
import useReservations from "../hooks/useReservations";
import useBowlingLanes from "../hooks/useBowlingLanes";
import useDiningTables from "../hooks/useDiningTables";
import useAirhockeyTables from "../hooks/useAirhockeyTables";
import useActivities from "../hooks/useActivities.ts";
import { IReservation } from "../types/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../security/AuthProvider";
import { formatInTimeZone } from 'date-fns-tz';

import {
  Modal,
  FormContainer,
  InputContainer,
  Label,
  Input,
  ButtonContainer,
} from "../styles/FormLayout.ts";
import { GridTop } from "../styles/Grids.ts";
import {
  TableLarge,
  TableHeader,
  TableRow,
  TableData,
  TableWrapper,
} from "../styles/Tables.ts";
import ActivityTypeRenderer from "../utils/activityTypeRenderer.tsx";
import { PageLayout } from "../styles/PageLayout.ts";

// define const and states
const Reservations = () => {
  const {
    reservations,
    isLoading,
    createReservation,
    updateReservation,
    deleteReservation,
  } = useReservations();
  const { fetchActivityById } = useActivities();
  const { username } = useAuth();
  const { bowlingLanes, getBowlingLanes } = useBowlingLanes();
  const { diningTables, getDiningTables } = useDiningTables();
  const { airhockeyTables, getAirhockeyTables } = useAirhockeyTables();

  const initialFormData: Partial<IReservation> = {
    activityId: 0,
    startTime: "",
    partySize: 0,
    userWithRolesUsername: username || "",
    customerName: "",
    customerPhone: "",
  };

  const [formData, setFormData] =
    useState<Partial<IReservation>>(initialFormData);
  const [selectedActivityType, setSelectedActivityType] = useState<string>("");
  const [activitiesFetched, setActivitiesFetched] = useState<{
    Airhockey: boolean;
    DiningTable: boolean;
    BowlingLane: boolean;
  }>({
    Airhockey: false,
    DiningTable: false,
    BowlingLane: false,
  });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("startTime");
  const [sortedAscending, setSortedAscending] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  
  useEffect(() => {
    setCurrentPage(1); // Reset currentPage to 1 when searchQuery changes
  }, [searchQuery]);

  useEffect(() => {
    if (username) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        userWithRolesUsername: username,
      }));
    }
  }, [username]);

  const handleAddFormOpen = () => {
    setShowAddForm(true);
  };

  const handleUpdateReservation = async (reservation: IReservation) => {
    setFormData(reservation);

    try {
      const activity = await fetchActivityById(reservation.activityId);
      if (activity) {
        setSelectedActivityType(activity.type);
      }
    } catch (error) {
      console.error("An error occurred while fetching activity details", error);
    }

    setShowAddForm(true);
  };

  const handleFormUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      //@ts-expect-error - id is not optional
      await updateReservation(formData.id, formData);
      setFormData(initialFormData);
      setShowAddForm(false);
    } catch (error) {
      console.error("An error occurred while updating the reservation", error);
    }
  };

  const handleDeleteReservation = (reservation: IReservation) => {
    setFormData(reservation);
    setShowModal(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      // @ts-expect-error id is not optional
      await deleteReservation(formData.id);
      setShowModal(false);
    } catch (error) {
      console.error("An error occurred while deleting the reservation", error);
    }
  };

  // Fetch data based on selected activity type, only if not already fetched
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
  }, [
    selectedActivityType,
    activitiesFetched,
    getAirhockeyTables,
    getDiningTables,
    getBowlingLanes,
  ]);

  const handleAddReservation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // console.log("FormData before submission:", formData); // Log the formData just before submission
      const newReservation = await createReservation({
        ...formData,
        partySize: parseInt(formData.partySize as unknown as string), // Ensure partySize is a number
      });
      if (newReservation) {
        setFormData(initialFormData);
        setSelectedActivityType(""); // Reset activity type
        setActivitiesFetched({
          Airhockey: false,
          DiningTable: false,
          BowlingLane: false,
        });
      }
    } catch (error) {
      console.error("An error occurred while creating the reservation", error);
    }
  };

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

    // Format the selected date in the target timezone
    const formattedDate = formatInTimeZone(date, timeZone, 'yyyy-MM-dd\'T\'HH:mm:ss');

    // Update the form data
    setFormData((prevState) => ({
      ...prevState,
      startTime: formattedDate,
    }));
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
      return bowlingLanes.map((activity) => (
        <option key={activity.id} value={activity.id}>
          {activity.name}
        </option>
      ));
    }
    return null;
  };
  

  const filteredReservations = reservations.filter((reservation) =>
    reservation.customerPhone.includes(searchQuery) ||
    reservation.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    
  );

  const sortedReservations = [...filteredReservations].sort((a, b) => {
    if (sortBy === "startTime") {
      return sortedAscending
        ? new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        : new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    }
    return 0;
  });


  const toggleSortDirection = () => {
    setSortedAscending((prev) => !prev);
  };

  const parseTime = (dateTime: Date): string => {
    const timeZone = 'Europe/Copenhagen';
  
    // Format the date as dd/MM/yyyy
    const formattedDate = formatInTimeZone(dateTime, timeZone, 'dd/MM/yyyy');
  
    // Format the time as hh:mm
    const formattedTime = formatInTimeZone(dateTime, timeZone, 'HH:mm');
  
    // Concatenate the formatted date and time with "kl." in between
    return `${formattedDate} kl. ${formattedTime}`;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservations = sortedReservations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Total number of pages
  const totalPages = Math.ceil(sortedReservations.length / itemsPerPage);

  // Next page handler
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Previous page handler
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PageLayout>
      <GridTop>
        <h2>Reservationer</h2>
        <input
          type="text"
          placeholder="Search by phone number or customer name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleAddFormOpen}>Opret Reservation</button>
      </GridTop>
      <TableWrapper>
        <TableLarge>
          <TableHeader>
            <tr>
              <th style={{ padding: "8px" }}>ID</th>
              <th style={{ padding: "8px" }} onClick={() => setSortBy("startTime")}>
                Start Tid
                {sortBy === "startTime" && (
                  <span
                    style={{ marginLeft: "5px", fontSize: "12px" }}
                    onClick={toggleSortDirection}
                  >
                    {sortedAscending ? <FaArrowUp /> : <FaArrowDown />}
                  </span>
                )}
              </th>
              <th style={{ padding: "8px" }}>Antal Deltagere</th>
              <th style={{ padding: "8px" }}>Kunde Navn</th>
              <th style={{ padding: "8px" }}>Telfon</th>
              <th style={{ padding: "8px" }}>Aktivitet</th>
              <th style={{ padding: "8px" }}>Handling</th>
            </tr>
          </TableHeader>
          <tbody>
  {isLoading && (
    <tr>
      <td>Loading...</td>
    </tr>
  )}
  {filteredReservations.map &&
    currentReservations.map((reservation) => (
      <TableRow key={reservation.id}>
        <TableData>{reservation.id}</TableData>
        <TableData>
          {parseTime(new Date(reservation.startTime))}
        </TableData>
        <TableData>{reservation.partySize}</TableData>
        <TableData>{reservation.customerName}</TableData>
        <TableData>{reservation.customerPhone}</TableData>
        <TableData>
          {reservation.activityId && (
            <>{<ActivityTypeRenderer reservation={reservation} />}</>
          )}
        </TableData>
        <TableData>
          <FaPen
            style={{ marginRight: "5px", cursor: "pointer" }}
            onClick={() => handleUpdateReservation(reservation)}
          />
          <FaTrash
            style={{ marginRight: "5px", cursor: "pointer" }}
            onClick={() => handleDeleteReservation(reservation)}
          />
        </TableData>
      </TableRow>
    ))}
</tbody>
        </TableLarge>
      </TableWrapper>
      <div>
      <button onClick={handlePrevPage} disabled={currentPage === 1}>
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={handleNextPage} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
      {showAddForm && (
        <Modal>
          <FormContainer onSubmit={formData.id ? handleFormUpdate : handleAddReservation} >
            <h2>{formData.id ? "Edit Reservation" : "Add Reservation"}</h2>
  
              <InputContainer>
                <Label>
                  Start Tid og Dato:
                  <DatePicker
                    selected={
                      formData.startTime ? new Date(formData.startTime) : null
                    }
                    // @ts-expect-error - handleDateChange is not a function
                    onChange={(date) => handleDateChange(date)}
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
                <button onClick={() => setShowAddForm(false)}>Cancel</button>
              </ButtonContainer>
          </FormContainer>
        </Modal>
      )}
      {showModal && (
        <Modal>
          <h2>Er du sikker på du vil slette denne reservation?</h2>
          <p>ID: {formData.id}</p>
          <p>Start Tid: {formData.startTime}</p>
          <p>Antal Deltagere: {formData.partySize}</p>
          <p>Kunde Navn: {formData.customerName}</p>
          <p>Telefon: {formData.customerPhone}</p>
          <p>Aktivitet: {formData.activityId}</p>
          <ButtonContainer>
            <button onClick={handleDeleteConfirmation}>Ja</button>
            <button onClick={() => setShowModal(false)}>Nej</button>
          </ButtonContainer>
        </Modal>
      )}
    </PageLayout>
  );
};

export default Reservations;