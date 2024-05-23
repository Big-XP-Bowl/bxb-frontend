// Employees.tsx
import React, { useState } from "react";
import { IEmployee } from "../types/types";
import useEmployees from "../hooks/useEmployees";
import {
  Card1,
  EmpImage,
  EmpTitle,
  EmpDetails,
  EmpInitials,
} from "../styles/Cards";
import { Grid1 } from "../styles/Grids";

const Employees: React.FC = () => {
  const { employees, isLoading } = useEmployees();
  //@ts-ignore
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(
    null
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  // Log employees to check for unique ids
  console.log(employees);

  return (
    <Grid1>
      {employees.map((employee) => (
        <Card1 key={employee.id} onClick={() => setSelectedEmployee(employee)}>
          <EmpImage
            src={employee.image_url}
            alt={employee.name}
            onError={(error) => console.error("Image failed to load:", error)}
          />
          <EmpTitle>{employee.name}</EmpTitle>
          <EmpDetails>{employee.emp_type}</EmpDetails>
          <EmpInitials>{employee.initials}</EmpInitials>
        </Card1>
      ))}
    </Grid1>
  );
};

export default Employees;
