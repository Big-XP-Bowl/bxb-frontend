import { useState, useEffect } from 'react';
import useActivities from '../../hooks/useActivities.ts';
import { IReservation, IActivity } from '../../types/types.ts';

interface ActivityTypeRendererProps {
  reservation: IReservation;
}

export const ActivityNameRenderer = ({ reservation }: ActivityTypeRendererProps) => {
  const { fetchActivityById } = useActivities();
  const [activityName, setActivityName] = useState<string>('');

  useEffect(() => {
    const fetchActivityName = async () => {
      try {
        const activity: IActivity | undefined = await fetchActivityById(reservation.activityId);
        if (activity) {
          setActivityName(activity.name);
        }
      } catch (error) {
        console.error("An error occurred while fetching activity type", error);
      }
    };

    fetchActivityName();

    return () => {
    };
  }, [reservation.activityId, fetchActivityById]);

  return <>{activityName}</>;
};

export default ActivityNameRenderer;