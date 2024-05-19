// in this file we will put the three arrays bowlingLanes, diningTables and airhockeyTables into one custom hook
import useBowlingLanes from "./useBowlingLanes";
import useDiningTables from "./useDiningTables";
import useAirhockeyTables from "./useAirhockeyTables";

export default function useActivities() {
  const { bowlingLanes } = useBowlingLanes();
  const { diningTables } = useDiningTables();
  const { airhockeyTables } = useAirhockeyTables();

  const activities = [...bowlingLanes, ...diningTables, ...airhockeyTables];

  return { activities };
}

//
// bruges som nedenstående:

// import { useEffect, useState } from "react";
// import useActivities from "../hooks/useActivities";
// import { Grid1 } from "../styles/Grids";

// const NAME_OF_YOUR_COMPONENT = () => {
//   const { activities } = useActivities();
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   useEffect(() => {
//     setIsLoading(false);
//   }, []);

//   if (isLoading) {
//     return <h2>Loading...</h2>;
//   } else
//     return (
//       <div>
//         <h2>Alle vores aktiviteter:</h2>
//         <Grid1>
//           {activities.map((activity) => {
//             return (
//               <div key={activity.id}>
//                 <h2>{activity.name} </h2>
//                 <p>{activity.closed ? "Til reparation" : "Ledigt :)"}</p>
//                 <p># of playurz: {activity.capacity}</p>
//                 <p> {activity.childFriendly ? " Børnevenlig" : " Ikke børnevenlig"} </p>
//               </div>
//             );
//           })}
//         </Grid1>
//       </div>
//     );
// };
