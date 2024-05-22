import { useEffect, useState } from 'react';
import { ISchedule } from '../types/types';
import { handleHttpErrors, HttpException, makeOptions } from '../utils/fetchUtils';
import { API_URL } from '../settings';
import toast from 'react-hot-toast';

function useSchedules() {
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const SCHEDULEURL = API_URL + '/schedules';

  const fetchSchedules = async () => {
    try {
      const res = await fetch(SCHEDULEURL);
      const data = await handleHttpErrors(res);
      setSchedules(data);
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error('En uventet fejl opstod');
      }
    }
  }

  useEffect(() => {
    setIsLoading(true);
    fetchSchedules().then(() => setIsLoading(false));
  }, []);

  const fetchScheduleById = async (id: number) => {
    try {
      const res = await fetch(SCHEDULEURL + '/' + id);
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

  // @GetMapping("/employee/{employeeId}")
  // public List<ScheduleDTO> getSchedulesByEmployeeId(@PathVariable int employeeId) {
  //     return scheduleService.getSchedulesByEmployeeId(employeeId);
  // }

  const fetchSchedulesByEmployeeId = async (employeeId: number) => {
    try {
      const res = await fetch(SCHEDULEURL + '/employee/' + employeeId);
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


  const createSchedule = async (schedule: Partial<ISchedule>) => {
    try {
      const options = makeOptions('POST', schedule);
      const res = await fetch(SCHEDULEURL + '/create', options);
      const data = await handleHttpErrors(res);
      setSchedules(prev => [...prev, data]);
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error('En uventet fejl opstod');
      }
    }
  };

  const updateSchedule = async (id: number, schedule: ISchedule) => {
    try {
      const options = makeOptions('PATCH', schedule);
      const res = await fetch(SCHEDULEURL + '/' + id, options);
      const data = await handleHttpErrors(res);
      setSchedules(prev => 
        prev.map(schedule => schedule.id === id ? data : schedule)
      );
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error('En uventet fejl opstod');
      }
    }
  };

  const deleteSchedule = async (id: number) => {
    try {
      const options = makeOptions('DELETE', null);
      await fetch(SCHEDULEURL + '/' + id, options);
      setSchedules(prev => prev.filter(schedule => schedule.id !== id));
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error('En uventet fejl opstod');
      }
    }
  };

  return { schedules, isLoading, fetchScheduleById, fetchSchedulesByEmployeeId, createSchedule, updateSchedule, deleteSchedule };
}

export default useSchedules;