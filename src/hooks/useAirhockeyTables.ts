import { useEffect, useState } from "react";
import { IAirhockey } from "../types/types";
import { API_URL } from "../settings";
import { handleHttpErrors, HttpException } from "../utils/fetchUtils";
import toast from "react-hot-toast";

export default function useBowlingLanes() {
  const AIRHOCKEY_URL = API_URL + "/activities/type/airhockey";
  const [airhockeyTables, setAirHockeyTables] = useState<IAirhockey[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getAirhockeyTables = async () => {
    try {
      const airHockeyTableResponse = await fetch(AIRHOCKEY_URL);
      const airHockeyTableData = await handleHttpErrors(airHockeyTableResponse);
      setAirHockeyTables(airHockeyTableData);
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
    getAirhockeyTables().then(() => setIsLoading(false));
  }, []);

  return { airhockeyTables, getAirhockeyTables };
}
