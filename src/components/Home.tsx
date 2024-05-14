import { Card1 } from '../styles/Cards';
import { Grid1, Grid2 } from '../styles/Grids';
import { useEffect, useState } from 'react';

type Employee = {
  ID: number;
  empType: "USER" | "ADMIN" | "MAINTENANCE" | "BAR"; // Define the possible values for empType
  name: string;
  initials: string;
  shifts: string[];
};

const Home = () => {
  const [employees, setEmployees] = useState<Employee[]>([]); 

  useEffect(() => {
    fetch('http://localhost:3000/employees')
      .then(response => response.json())
      .then(data => {
        // Update state with fetched data
        setEmployees(data);
      })
      .catch(error => {
        // Handle the error here
        console.error('Error fetching employees:', error);
      });
  }, []);

  return (
    <>
    <Grid2>
      {employees.map((employee) => (
        <Card1>
        <div key={employee.ID}>
          <h2>{employee.name}</h2>
          <p>{employee.empType}</p>
        </div>
        </Card1>
    
      ))}
      </Grid2>
    </>
    
  );
};

export default Home;
