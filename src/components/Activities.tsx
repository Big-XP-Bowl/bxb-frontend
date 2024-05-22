import { useEffect, useState } from "react";
import useActivities from "../hooks/useActivities";
import { Grid1 } from "../styles/Grids";

const Activities = () => {
  const { activities } = useActivities();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <h2>Loading...</h2>;
  } else
    return (
      <div>
        <h2>Alle vores aktiviteter:</h2>
        <Grid1>
          {activities.map((activity) => {
            return (
              <div key={activity.id}>
                <h2>{activity.name} </h2>
                <p>{activity.closed ? "Til reparation" : "Ledigt :)"}</p>
                <p># of playurz: {activity.capacity}</p>
                <p>
                  {" "}
                  {activity.childFriendly
                    ? " Børnevenlig"
                    : " Ikke børnevenlig"}{" "}
                </p>
              </div>
            );
          })}
        </Grid1>
      </div>
    );
};

export default Activities;
