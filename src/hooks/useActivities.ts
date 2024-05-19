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
