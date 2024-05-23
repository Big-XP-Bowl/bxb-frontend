import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import useSchedule from '../hooks/useSchedules';
import useEmployees from '../hooks/useEmployees';
import { ISchedule } from '../types/types';
import { Toaster } from 'react-hot-toast';
import {
  Modal,
  FormContainer,
  InputContainer,
  Label,
  Input,
  ButtonContainer,
} from "../styles/FormLayout.ts";

const localizer = momentLocalizer(moment);

const Schedule: React.FC = () => {
  const { schedules, isLoading } = useSchedule();
  const { employees } = useEmployees();
  const [events, setEvents] = useState<Event[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newEvent, setNewEvent] = useState<{ start: Date; end: Date }>({ start: new Date(), end: new Date() });

  // Fetch schedules and format them for the calendar
  useEffect(() => {
    if (!isLoading) {
      const formattedEvents = schedules.map((schedule: ISchedule) => ({
        title: schedule.employeeId.toString(),
        start: new Date(schedule.startTime),
        end: new Date(schedule.endTime),
        id: schedule.id,
      }));
      setEvents(formattedEvents);
    }
  }, [schedules, isLoading]);

  // Fetch employees for the dropdown
  useEffect(() => {
    if (employees.length > 0) {
      console.log('Employees:', employees);
    }
  }, [employees]);

  const handleEmployeeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEmployee = event.target.value;
    setSelectedEmployee(selectedEmployee);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setNewEvent({ start: slotInfo.start, end: slotInfo.end });
    setShowModal(true);
  };

  const handleShowForm = () => {
    setShowModal(true);
  };

  const handleCloseForm = () => {
    setShowModal(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Here you can handle the form submission, e.g., save the new event
    console.log('New event:', newEvent, 'Selected employee:', selectedEmployee);
    setShowModal(false);
  };

  const CustomToolbar = ({ label, onNavigate }: { label: string; onNavigate: (action: string, date?: Date) => void }) => {
    return (
      <div>
        <span>{label}</span>
        <button onClick={() => onNavigate('TODAY')}>Today</button>
        <button onClick={() => onNavigate('PREV')}>Previous</button>
        <button onClick={() => onNavigate('NEXT')}>Next</button>
        <select
          name="employee"
          value={selectedEmployee}
          onChange={handleEmployeeChange}
        >
          <option value="">Vælg Ansat</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
        <button onClick={handleShowForm}>Opret Vagt</button>
      </div>
    );
  };

  return (
    <div>
      <Toaster />
      <h1>Schedule Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={['week']}
        step={60}
        showMultiDayTimes
        components={{
          toolbar: (props) => (
            <CustomToolbar
              {...props}
              onNavigate={(action, newDate) => {
                if (action === 'PREV') {
                  const newDate = moment(date).subtract(1, 'week').toDate();
                  setDate(newDate);
                  props.onNavigate('DATE', newDate);
                } else if (action === 'NEXT') {
                  const newDate = moment(date).add(1, 'week').toDate();
                  setDate(newDate);
                  props.onNavigate('DATE', newDate);
                } else if (action === 'TODAY') {
                  const newDate = new Date();
                  setDate(newDate);
                  props.onNavigate('DATE', newDate);
                }
              }}
            />
          ),
        }}
        defaultView="week"
        date={date}
        min={new Date(0, 0, 0, 10, 0)}
        max={new Date(0, 0, 0, 22, 0)}
        formats={{ timeGutterFormat: (date) => moment(date).format('HH:mm') }}
        selectable
        onSelectSlot={handleSelectSlot}
      />

      {showModal && (
        <Modal>
          <FormContainer>
            <h2>Opret Vagt</h2>
            <form onSubmit={handleSubmit}>
              <InputContainer>
                <Label htmlFor="startTime">Starttidspunkt</Label>
                <Input
                  type="time"
                  id="startTime"
                  name="startTime"
                  required
                  value={moment(newEvent.start).format('HH:mm')}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, start: moment(newEvent.start).set({ hour: parseInt(e.target.value.split(':')[0]), minute: parseInt(e.target.value.split(':')[1]) }).toDate() })
                  }
                />
              </InputContainer>
              <InputContainer>
                <Label htmlFor="endTime">Sluttidspunkt</Label>
                <Input
                  type="time"
                  id="endTime"
                  name="endTime"
                  required
                  value={moment(newEvent.end).format('HH:mm')}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, end: moment(newEvent.end).set({ hour: parseInt(e.target.value.split(':')[0]), minute: parseInt(e.target.value.split(':')[1]) }).toDate() })
                  }
                />
              </InputContainer>
              <InputContainer>
                <Label htmlFor="employee">Ansat</Label>
                <select
                  id="employee"
                  name="employee"
                  value={selectedEmployee}
                  onChange={handleEmployeeChange}
                  required
                >
                  <option value="">Vælg Ansat</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </InputContainer>
              <p>Rolle: employee.empType</p>
              <ButtonContainer>
                <button type="submit">Opret</button>
                <button type="button" onClick={handleCloseForm}>Annuller</button>
              </ButtonContainer>
            </form>
          </FormContainer>
        </Modal>
      )}
    </div>
  );
};

export default Schedule;
