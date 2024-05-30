import {useState, useEffect} from 'react';
import useReservations from '../../hooks/useReservations';
import { FaPen, FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useAuth } from '../../security/AuthProvider';
import { GridTop } from '../../styles/Grids';
import { TableLarge, TableHeader, TableRow, TableData, TableWrapper} from "../../styles/Tables.ts";
import { PageLayout } from "../../styles/PageLayout.ts";
import ReservationSearch from './ReservationSeach.tsx';
import ReservationPaginator from './ReservationPaginator.tsx';
import ReservationForm from './ReservationForm.tsx';
import { Modal } from '../../styles/FormLayout.ts'; 
import { parseTime } from './reservationUtils.ts'

const FullReservation = () => {
  const { reservations, isLoading } = useReservations();
  const { username } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("startTime");
  const [sortedAscending, setSortedAscending] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  const [showForm, setShowForm] = useState(false);

useEffect(() => {
if (username) {
  console.log(`User ${username} is logged in`);
  }
}, [username]);

useEffect(() => {
  setCurrentPage(1);
}, [searchQuery]);

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

const handleOpenForm = () => {
  setShowForm(true);
};

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
    <GridTop>
      <h2>Reservationer</h2>
      <ReservationSearch onSearch={handleSearch} reservations={reservations} />
      {/* button opens reservation form in a modal here */}
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
        <TableData>Aktivitets Type</TableData>
        <TableData>
          <FaPen
            style={{ marginRight: "5px", cursor: "pointer" }}
            onClick={() => console.log("Open Reservation updateForm")}
          />
          <FaTrash
            style={{ marginRight: "5px", cursor: "pointer" }}
            onClick={() => console.log("Open Delete Confirmation Form")}
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
        initialFormData={{}} 
        onSubmit={(formData) => console.log("Form submitted", formData)} 
        showForm={showForm} 
        onClose={() => setShowForm(false)}
      />
    </Modal>
  )}
  </PageLayout>
)};

export default FullReservation;