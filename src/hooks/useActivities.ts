// in this section, we will create a custom hook to fetch the activities from localhost:8080/activities.

import { useEffect, useState } from "react";
import { API_URL } from "../settings";
import { handleHttpErrors, HttpException } from "../utils/fetchUtils";
import toast from "react-hot-toast";
import { IActivity } from "../types/types";

export default function useActivities() {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const ACTIVITIES_URL = API_URL + "/activities";

  const fetchActivities = async () => {
    try {
      const res = await fetch(ACTIVITIES_URL);
      const data = await handleHttpErrors(res);
      setActivities(data);
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchActivities().then(() => setIsLoading(false));
  }, []);

  return { activities, isLoading };
}
