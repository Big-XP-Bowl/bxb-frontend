import { useEffect, useState } from 'react';
import { IEmployee } from '../types/types';
import { handleHttpErrors, HttpException, makeOptions } from '../utils/fetchUtils';
import { API_URL } from '../settings';
import toast from 'react-hot-toast';

function useEmployees() {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const EMPLOYEEURL = API_URL + '/employees';

  const fetchEmployees = async () => {
    try {
      const res = await fetch(EMPLOYEEURL);
      const data = await handleHttpErrors(res);
      setEmployees(data);
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error('En uventet fejl opstod');
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchEmployees().then(() => setIsLoading(false));
  }, []);

  const fetchEmployeeById = async (id: number) => {
    try {
      const res = await fetch(EMPLOYEEURL + '/' + id);
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

  const fetchEmployeesByEmpType = async (empType: string) => {
    try {
      const res = await fetch(EMPLOYEEURL + '/type/' + empType);
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

  const createEmployee = async (employee: Partial<IEmployee>) => {
    try {
      const options = makeOptions('POST', employee);
      const res = await fetch(EMPLOYEEURL + '/create', options);
      const data = await handleHttpErrors(res);
      setEmployees(prev => [...prev, data]);
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error('En uventet fejl opstod');
      }
    }
  };

  const updateEmployee = async (employee: Partial<IEmployee>) => {
    try {
      const options = makeOptions('PUT', employee);
      const res = await fetch(EMPLOYEEURL + '/update', options);
      const data = await handleHttpErrors(res);
      setEmployees(prev => prev.map(e => e.id === data.id ? data : e));
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error('En uventet fejl opstod');
      }
    }
  }

  return { employees, fetchEmployeeById, fetchEmployeesByEmpType, createEmployee, updateEmployee, isLoading };
}

export default useEmployees;