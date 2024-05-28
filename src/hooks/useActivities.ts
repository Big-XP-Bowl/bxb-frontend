// in this file we will put the three arrays bowlingLanes, diningTables and airhockeyTables into one custom hook
import useBowlingLanes from "./useBowlingLanes";
import useDiningTables from "./useDiningTables";
import useAirhockeyTables from "./useAirhockeyTables";
import { handleHttpErrors, HttpException } from '../utils/fetchUtils';
import { API_URL } from '../settings';
import toast from 'react-hot-toast';

export default function useActivities() {
  const { bowlingLanes } = useBowlingLanes();
  const { diningTables } = useDiningTables();
  const { airhockeyTables } = useAirhockeyTables();

  const activities = [...bowlingLanes, ...diningTables, ...airhockeyTables];

  const fetchActivityById = async (id: number) => {
    try {
      const res = await fetch(API_URL + '/activities/id/' + id);
      const data = await handleHttpErrors(res);
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error('En uventet fejl opstod');
      }
    }
  }
  return { activities, fetchActivityById };

}