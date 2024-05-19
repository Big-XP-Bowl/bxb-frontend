import { useEffect, useState } from "react";
import { IDiningTable } from "../types/types";
import { API_URL } from "../settings";
import { HttpException } from "../utils/fetchUtils";
import toast from "react-hot-toast";

export default function useBowlingLanes() {
  const DINING_URL = API_URL + "/activities/type/diningTable";
  const [diningTables, setDiningTables] = useState<IDiningTable[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getDiningTables = async () => {
    try {
      const diningTableResponse = await fetch(DINING_URL);
      const diningTableData = await diningTableResponse.json();
      setDiningTables(diningTableData);
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
    getDiningTables().then(() => setIsLoading(false));
  }, []);

  return { isLoading, diningTables, getDiningTables };
}