import { useEffect, useState } from 'react';
import { IReservation } from '../types/types';
import { handleHttpErrors, HttpException, makeOptions } from '../utils/fetchUtils';
import { API_URL } from '../settings';
import toast from 'react-hot-toast';

function useReservations() {
  const [reservations, setReservations] = useState<IReservation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const RESERVATIONURL = API_URL + '/reservations';

  const fetchReservations = async () => {
    try {
      const res = await fetch(RESERVATIONURL);
      const data = await handleHttpErrors(res);
      setReservations(data);
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error('En uventet fejl opstod');
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchReservations().then(() => setIsLoading(false));
  }, []);

  const fetchReservationsByID = async (id: number) => {
    try {
      const res = await fetch(RESERVATIONURL + '/' + id);
      const data = await handleHttpErrors(res);
      setReservations(data);
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error('En uventet fejl opstod');
      }
    }
  };

  const createReservation = async (reservation: Partial<IReservation>) => {
    try {
      const options = makeOptions('POST', reservation); // Use makeOptions to create request options
      const res = await fetch(RESERVATIONURL + '/create', options);
      const data = await handleHttpErrors(res);
      setReservations(prev => [...prev, data]);
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error('En uventet fejl opstod');
      }
    }
  };

  const updateReservation = async (id: number, reservation: IReservation) => {
    try {
      const options = makeOptions('PATCH', reservation); // Use makeOptions to create request options
      const res = await fetch(RESERVATIONURL + '/' + id, options);
      const data = await handleHttpErrors(res);
      setReservations(prev =>
        prev.map(reservation => (reservation.id === id ? data : reservation))
      );
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error('En uventet fejl opstod');
      }
    }
  };

  const deleteReservation = async (id: number) => {
    try {
      const options = makeOptions('DELETE', null); // Use makeOptions to create request options
      await fetch(RESERVATIONURL + '/' + id, options);
      setReservations(prev => prev.filter(reservation => reservation.id !== id));
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error('En uventet fejl opstod');
      }
    }
  };

  return { reservations, isLoading, fetchReservationsByID, createReservation, updateReservation, deleteReservation, fetchReservations};
}
export default useReservations;


