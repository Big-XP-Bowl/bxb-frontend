import {useState, useEffect} from 'react';
import useReservations from '../../hooks/useReservations';
import useActivities from '../../hooks/useActivities.ts';
import { IReservation } from '../../types/types';
import { FaPen, FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useAuth } from '../../security/AuthProvider';
import { GridTop } from '../../styles/Grids';
import { TableLarge, TableHeader, TableRow, TableData, TableWrapper} from "../../styles/Tables.ts";
import { PageLayout } from "../../styles/PageLayout.ts";
import ReservationSearch from './ReservationSeach.tsx';
import ReservationPaginator from './ReservationPaginator.tsx';
import ReservationForm from './ReservationForm.tsx';
import { Modal } from '../../styles/FormLayout.ts'; 
import { parseTime, validateReservationForm } from './reservationUtils.ts'
import ActivityNameRenderer from './ActivityTypeRenderer.tsx';
import { Toaster, toast } from 'react-hot-toast';
import DeleteConfirmation from './ReservationDeleteConfirmation.tsx';
import { useNavigate } from 'react-router-dom';

const FullReservation = () => {
  const navigate = useNavigate();
  const { reservations, isLoading, createReservation, updateReservation, deleteReservation } = useReservations();
  const { fetchActivityById } = useActivities();
  const { username } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("startTime");
  const [sortedAscending, setSortedAscending] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<IReservation>>({});
  const [selectedActivityType, setSelectedActivityType] = useState<string>("");

  useEffect(() => {
    if (username) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        userWithRolesUsername: username,
      }));
    }
  }, [username]);


useEffect(() => {
  setCurrentPage(1);
}, [searchQuery]);


const handleOpenForm = () => {
  setFormData({});
  setShowForm(true);
};

const handleUpdateReservation = async (reservation: IReservation) => {
  setFormData(reservation);
  try {
    const activity = await fetchActivityById(reservation.activityId);
    if (activity) {
      setSelectedActivityType(selectedActivityType);
      console.log("Activity fetched", activity);
    }
  } catch (error) {
    console.error("An error occurred while fetching activity details", error);
  }
  setShowForm(true);
};

const handleDeleteReservation = (reservation: IReservation) => {
  setFormData(reservation); // Not strictly necessary for deletion
    setShowModal(true);
};

const handleFormSubmit = async (formData: Partial<IReservation>) => {
  const errors = validateReservationForm(formData);

  if (errors.length > 0) {
    toast.error(errors.join("\n"));
    return;
  }

  try {
    const dataToSubmit = {
      activityId: formData.activityId,
      customerName: formData.customerName,
      userWithRolesUsername: username,
      startTime: formData.startTime,
      partySize: formData.partySize,
      customerPhone: formData.customerPhone,
    };

    if (formData.id) {
      await updateReservation(formData.id, dataToSubmit as IReservation);
      toast.success('Reservationen er opdateret');
    } else {
      await createReservation(dataToSubmit as IReservation);
      toast.success('Reservationen er oprettet');
    }

    // Reset form only on successful submission
    setShowForm(false);
    setFormData({});
  } catch (error) {
    console.error("An error occurred while submitting the form", error);
    toast.error('Der opstod en fejl');
  }
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

const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentReservations = sortedReservations.slice(
  indexOfFirstItem,
  indexOfLastItem
);

const totalPages = Math.ceil(sortedReservations.length / itemsPerPage);

const handleNextPage = () => {
  setCurrentPage((prevPage) => prevPage + 1);
};

const handlePrevPage = () => {
  setCurrentPage((prevPage) => prevPage - 1);
};

const handleSearch = (query: string) => {
  setSearchQuery(query);
};

if (isLoading) {
  return <div>Loading...</div>;
}

return (
  <PageLayout>
    <Toaster />
    <GridTop>
      <h2>Reservationer</h2>
      <button onClick={() => navigate('/reservations-calendar')} style={{ margin: '0.5em' }}>Kalender Oversigt</button>

      <ReservationSearch onSearch={handleSearch} reservations={reservations} />
      <button onClick={handleOpenForm}>Opret Reservation</button>
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
            <>{<ActivityNameRenderer reservation={reservation} />}</>
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
    <ReservationPaginator
      currentPage={currentPage}
      totalPages={totalPages}
      handleNextPage={handleNextPage}
      handlePrevPage={handlePrevPage}
    />
    {showForm && (
            <Modal>
              <ReservationForm
                initialFormData={formData}
                onSubmit={handleFormSubmit}
                showForm={showForm}
                onClose={() => setShowForm(false)}
              />
            </Modal>
          )}
          {showModal && (
            <DeleteConfirmation
              showModal={showModal}
              setShowModal={setShowModal}
              reservation={formData as IReservation}
              deleteReservation={deleteReservation}
            />
          )}
  </PageLayout>
)};

export default FullReservation;