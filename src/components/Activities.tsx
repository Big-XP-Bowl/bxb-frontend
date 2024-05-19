import useActivities from "../hooks/useActivities";
import { Grid1 } from "../styles/Grids";

const Activities = () => {
  const { activities, isLoading } = useActivities();
  console.log(activities);

  return (
    <div>
      <h2>AKTIVITETSKOMPONENT</h2>
      <Grid1>
        {isLoading && <p>Loader...</p>}
        {activities.map((activity) => {
          return (
            <div key={activity.id}>
              <h2>{activity.id}</h2>
              <p>{activity.name}</p>
              <p>{activity.isReserved}</p>
              <p>{activity.closed}</p>
            </div>
          );
        })}
      </Grid1>
    </div>
  );
};

export default Activities;
