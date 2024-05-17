import { Card1 } from '../styles/Cards';
import { Grid2 } from '../styles/Grids';
import useReservations from '../hooks/useReservations';

const Home = () => {
  const { reservations, isLoading } = useReservations();

  console.log(reservations);

  return (
    <>
    <h2>Reservationer</h2>
    <Grid2>
      {isLoading && <p>Loading...</p>}
      {reservations.map((reservation) => {
        return (
          <Card1 key={reservation.id}>
            <h2>{reservation.id}</h2>
            <p>{reservation.startTime}</p>
            <p>{reservation.partySize}</p>
            <p>{reservation.customerName}</p>
            <p>{reservation.customerPhone}</p>
          </Card1>
        );
      })}
    </Grid2>
    
    </>
  );
}

export default Home;
