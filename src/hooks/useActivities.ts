import useBowlingLanes from "./useBowlingLanes";
import useDiningTables from "./useDiningTables";
import useAirhockeyTables from "./useAirhockeyTables";
import { makeOptions, handleHttpErrors, HttpException } from '../utils/fetchUtils';
import { API_URL } from '../settings';
import toast from 'react-hot-toast';
import { IActivity } from "../types/types";
import { useState, useEffect } from 'react';

export default function useActivities() {
  const { bowlingLanes } = useBowlingLanes();
  const { diningTables } = useDiningTables();
  const { airhockeyTables } = useAirhockeyTables();
  
  const [activities, setActivities] = useState<IActivity[]>([]);

  const fetchActivities = async () => {
    try {
      const res = await fetch(`${API_URL}/activities`);
      const data = await handleHttpErrors(res);
      setActivities(data);
    } catch (error) {
      toast.error('Error fetching activities');
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [bowlingLanes, diningTables, airhockeyTables]);

  const fetchActivityById = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/activities/id/${id}`);
      const data = await handleHttpErrors(res);
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error('En uventet fejl opstod');
      }
    }
  };

  const updateActivity = async (id: number, updatedActivity: IActivity) => {
    try {
      const options = makeOptions('PATCH', updatedActivity);
      const res = await fetch(`${API_URL}/activities/${id}`, options);
      const data = await handleHttpErrors(res);
      await fetchActivities();  // Refetch activities after update
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error('En uventet fejl opstod');
      }
    }
  };

  return { activities, fetchActivityById, updateActivity, setActivities, fetchActivities };
}
