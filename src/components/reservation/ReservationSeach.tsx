import { useState, ChangeEvent } from 'react';
import { IReservation } from '../../types/types';

interface ReservationSearchProps {
  onSearch: (query: string) => void;
  reservations: IReservation[];
}

const ReservationSearch = (props: ReservationSearchProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query: string = e.target.value;
    setSearchQuery(query);
    props.onSearch(query);
  };

  return (
    <input
      type="text"
      placeholder="Søg på telefonnummer eller navn"
      value={searchQuery}
      onChange={handleSearchChange}
    />
  );
};

export default ReservationSearch;