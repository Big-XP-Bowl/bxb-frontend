import useActivities from "../hooks/useActivities";
import { Grid1 } from "../styles/Grids";

export default function Home() {
  const { activities, isLoading } = useActivities();

  return (
    <div>
      <h1>Home</h1>
      <Grid1>
        {/* i wish to get activities and render them here */}
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id}>
              <h2>{activity.name}</h2>
              <p>{activity.description}</p>
            </div>
          ))
        )}
      </Grid1>
    </div>
  );
}
