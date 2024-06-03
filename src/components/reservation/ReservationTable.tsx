import { useState, useEffect } from 'react';
import { IReservation } from '../../types/types';
import { TableLarge, TableHeader, TableRow, TableData, TableWrapper } from "../../styles/Tables.ts";
import { FaPen, FaTrash, FaArrowDown, FaArrowUp } from "react-icons/fa";
import { ActivityNameRenderer } from './ActivityTypeRenderer.tsx';
import { parseTime } from './reservationUtils.ts';

interface ReservationTableProps {
  reservations: IReservation[];
  isLoading: boolean;
  searchQuery: string;
  sortBy: string;
  sortedAscending: boolean;
  currentPage: number;
  totalPages: number;
  handleUpdateReservation: (reservation: IReservation) => void;
  handleDeleteReservation?: (reservation: IReservation) => void; // Optional prop
  setSortedAscending: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReservationTable = ({
  reservations,
  isLoading,
  searchQuery,
  sortBy,
  sortedAscending,
  currentPage,
  handleUpdateReservation,
  handleDeleteReservation,
  setSortedAscending,
}: ReservationTableProps ) => {
  const itemsPerPage = 30; // Constant for pagination

  const [currentReservations, setCurrentReservations] = useState<IReservation[]>([]);

  useEffect(() => {
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


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReservations = sortedReservations.slice(indexOfFirstItem, indexOfLastItem);

    setCurrentReservations(currentReservations);
  }, [reservations, searchQuery, sortBy, sortedAscending, currentPage]);

  const toggleSortDirection = () => {
    setSortedAscending((prev) => !prev);
  };


  return (
    <TableWrapper>
      <TableLarge>
        <TableHeader>
          <tr>
            <th style={{ padding: "8px" }}>ID</th>
            <th style={{ padding: "8px" }} onClick={() => setSortedAscending((prev) => !prev)}>
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
          {currentReservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableData>{reservation.id}</TableData>
              <TableData>{parseTime(new Date(reservation.startTime))}</TableData>
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
                {handleDeleteReservation && (
                  <FaTrash
                    style={{ marginRight: "5px", cursor: "pointer" }}
                    onClick={() => handleDeleteReservation(reservation)}
                  />
                )}
              </TableData>
            </TableRow>
          ))}
        </tbody>
      </TableLarge>
    </TableWrapper>
  );
};

export default ReservationTable;
