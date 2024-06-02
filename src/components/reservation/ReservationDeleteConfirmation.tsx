import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Modal } from '../../styles/FormLayout.ts';
import { IReservation } from '../../types/types';

interface DeleteConfirmationProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  reservation: IReservation; // Use the full reservation object
  deleteReservation: (id: number) => Promise<void>;
}

const DeleteConfirmation = ({
  showModal,
  setShowModal,
  reservation,
  deleteReservation,
}: DeleteConfirmationProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteConfirmation = async () => {
    try {
      setIsLoading(true);
      if (reservation.id) {
        await deleteReservation(reservation.id);
        setShowModal(false);
        toast.success('Reservationen er slettet');
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast.error('Der opstod en fejl under sletning af reservationen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal>
      {showModal && (
        <div>
          <p>Er du sikker på at du vil slette denne reservation?</p>
          <p>Kunde Navn: {reservation.customerName}</p>
          <p>Telefon: {reservation.customerPhone}</p>
          <p>Dato og Tid: {reservation.startTime}</p>
          <button onClick={handleDeleteConfirmation} style={{ marginRight: "5px"}} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Ja'}
          </button>
          <button onClick={() => setShowModal(false)} style={{ marginRight: "5px"}} disabled={isLoading}>Nej</button>
        </div>
      )}
    </Modal>
  );
};

export default DeleteConfirmation;