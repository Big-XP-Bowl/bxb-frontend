import React, { useState, useEffect } from 'react';
import { IEmployee } from '../types/types';
import useEmployees from '../hooks/useEmployees';
import { Card2, Card2Breakline, Card2Title, Card2Details, Card2Info } from '../styles/Cards';
import { Grid1 } from '../styles/Grids';
import { PageLayout } from '../styles/PageLayout';
import { FaCalendar, FaPen } from 'react-icons/fa';
import {
  Modal,
  FormContainer,
  InputContainer,
  Label,
  Input,
  ButtonContainer,
} from "../styles/FormLayout.ts";

const initialFormData: Partial<IEmployee> = {
  id: 0,
  name: '',
  initials: '',
  imageUrl: '',
  empType: '',
};

const Employees = () => {
  const { employees, isLoading, updateEmployee } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<IEmployee>>(initialFormData);

  useEffect(() => {
    if (selectedEmployee) {
      console.log('Selected employee:', selectedEmployee);
      setFormData(selectedEmployee);
      setShowModal(true);
    }
  }, [selectedEmployee]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted!');
    console.log('Form data before submission:', formData);
    try {
      if (formData.id) {
        const updatedEmployee = await updateEmployee(formData.id, formData as IEmployee);
        console.log('Employee updated:', updatedEmployee);
        setShowModal(false);
        setFormData(initialFormData); // Reset form data after submission
      } else {
        console.error('Employee ID is missing');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <PageLayout>
      <Grid1>
        {employees.map((employee) => (
          <Card2 key={employee.id} onClick={() => setSelectedEmployee(employee)}>
            <img
              src={employee.imageUrl}
              alt={employee.name}
              onError={(error) => console.error('Image failed to load:', error)}
            />
            <Card2Title>{employee.name}</Card2Title>
            <Card2Details>{employee.initials}</Card2Details>
            <Card2Breakline />
            <Card2Details>{employee.empType}</Card2Details>
            <Card2Info>
              This info is hidden until the card is clicked
            </Card2Info>
            <FaPen
              style={{ marginRight: '5px', cursor: 'pointer' }}
              onClick={() => setSelectedEmployee(employee)}
            />
            <FaCalendar
              style={{ marginRight: '5px', cursor: 'pointer' }}
              // onClick={() => handleEditEmployeeSchedule(employee)}
            />
          </Card2>
        ))}
      </Grid1>

      {showModal && (
        <Modal>
          <FormContainer onSubmit={handleFormSubmit}>
            <h2>Update Employee</h2>
            <InputContainer>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleFormChange}
              />
            </InputContainer>
            <InputContainer>
              <Label htmlFor="initials">Initials</Label>
              <Input
                type="text"
                id="initials"
                name="initials"
                value={formData.initials || ''}
                onChange={handleFormChange}
              />
            </InputContainer>
            <InputContainer>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl || ''}
                onChange={handleFormChange}
              />
            </InputContainer>
            <InputContainer>
              <Label htmlFor="empType">Employee Type</Label>
              <select
                id="empType"
                name="empType"
                value={formData.empType || ''}
                onChange={handleFormChange}
              >
                <option value="" disabled>Vælg Rolle</option>
                <option value="MANAGER">MANAGER</option>
                <option value="BAR">BAR</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
                <option value="CLEANING">CLEANING</option>
              </select>
            </InputContainer>
            <ButtonContainer>
              <button type="submit">
                Opdater
              </button>
              <button type="button" onClick={() => setShowModal(false)}>
                Annuller
              </button>
            </ButtonContainer>
          </FormContainer>
        </Modal>
      )}
    </PageLayout>
  );
};

export default Employees;
