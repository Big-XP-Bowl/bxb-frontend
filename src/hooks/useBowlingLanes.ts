import { useEffect, useState } from "react";
import { IBowlingLane } from "../types/types";
import { API_URL } from "../settings";
import { HttpException } from "../utils/fetchUtils";
import toast from "react-hot-toast";

export default function useBowlingLanes() {
  const BOWLING_URL = API_URL + "/activities/type/bowlingLane";
  const [bowlingLanes, setBowlingLanes] = useState<IBowlingLane[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getBowlingLanes = async () => {
    try {
      const bowlingResponse = await fetch(BOWLING_URL);
      const bowlingData = await bowlingResponse.json();
      setBowlingLanes(bowlingData);
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
    getBowlingLanes().then(() => setIsLoading(false));
  }, []);

  return { isLoading, bowlingLanes, getBowlingLanes };
}