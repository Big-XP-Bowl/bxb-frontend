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

moment.locale('da');  // Set moment locale to Danish
const localizer = momentLocalizer(moment);

const Schedule: React.FC = () => {
  const { schedules, isLoading } = useSchedule();
  const { employees } = useEmployees();
  const [events, setEvents] = useState<Event[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newEvent, setNewEvent] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });

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
    const selectedHour = moment(slotInfo.start).hour();
    let startTime, endTime;
    if (selectedHour >= 0 && selectedHour < 16) {
      startTime = moment(slotInfo.start).set({ hour: 9, minute: 0 }).toDate();
      endTime = moment(startTime).add(7, 'hours').toDate();
    } else if (selectedHour >= 16 && selectedHour < 24) {
      startTime = moment(slotInfo.start).set({ hour: 16, minute: 0 }).toDate();
      endTime = moment(startTime).add(7, 'hours').toDate();
    } else {
      startTime = slotInfo.start;
      endTime = slotInfo.end;
    }
    setNewEvent({ start: startTime, end: endTime });
    setShowModal(true);
  };

  const handleShowForm = () => {
    setShowModal(true);
  };

const handleCloseForm = () => {
  // Reset the newEvent state
  setNewEvent({ start: null, end: null });
  // Reset the selectedEmployee state
  setSelectedEmployee('');
  // Close the modal
  setShowModal(false);
};


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('New event:', newEvent, 'Selected employee:', selectedEmployee);
    setNewEvent({ start: null, end: null });
    setSelectedEmployee('');
    setShowModal(false);
  };

  const CustomToolbar = ({ label, onNavigate }: { label: string; onNavigate: (action: string, date?: Date) => void }) => {
    return (
      <div>
        <span>{label}</span>
        <button onClick={() => onNavigate('TODAY')}>I dag</button>
        <button onClick={() => onNavigate('PREV')}>Forrige</button>
        <button onClick={() => onNavigate('NEXT')}>Næste</button>
        <select
          name="employee"
          value={selectedEmployee}
          onChange={handleEmployeeChange}
        >
          <option value="">Vælg ansat</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
        <button onClick={handleShowForm}>Opret vagt</button>
      </div>
    );
  };

  return (
    <div>
      <Toaster />
      <h1>Vagtkalender</h1>
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
        min={new Date(0, 0, 0, 9, 0)}  // Set start time to 9 AM
        max={new Date(0, 0, 0, 23, 0)}  // Set end time to 11 PM
        formats={{
          timeGutterFormat: (date) => moment(date).format('HH:mm'),
          dayFormat: (date) => moment(date).format('ddd DD/MM'), // Custom day format
          weekdayFormat: (date) => moment(date).format('dddd'), // Custom weekday format
          agendaHeaderFormat: { start: 'DD/MM/YYYY', end: 'DD/MM/YYYY' }, // Custom agenda header format
        }}
        selectable
        onSelectSlot={handleSelectSlot}
        firstDay={1} // Start the week on Monday
      />

      {showModal && (
        <Modal>
          <FormContainer>
            <h2>Opret Vagt</h2>
            <form onSubmit={handleSubmit}>
              <InputContainer>
                <Label htmlFor="startTime">Starttidspunkt</Label>
                <select
                  id="startTime"
                  name="startTime"
                  required
                  value={newEvent.start ? moment(newEvent.start).format('HH:mm') : ''}
                  onChange={(e) => {
                    const startTime = moment()
                      .set({
                        hour: parseInt(e.target.value.split(':')[0]),
                        minute: parseInt(e.target.value.split(':')[1]),
                      })
                      .toDate();
                    const endTime = moment(startTime).add(7, 'hours').toDate();
                    setNewEvent({
                      start: startTime,
                      end: endTime,
                    });
                  }}
                >
                  <option value="" disabled>
                    Vælg starttidspunkt
                  </option>
                  <option value="09:00">09:00</option>
                  <option value="16:00">16:00</option>
                </select>
              </InputContainer>
              <InputContainer>
                <Label htmlFor="endTime">Sluttidspunkt</Label>
                <Input
                  type="text"
                  id="endTime"
                  name="endTime"
                  readOnly
                  value={newEvent.end ? moment(newEvent.end).format('HH:mm') : ''}
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
              <p>Rolle: {selectedEmployee && employees.find(emp => emp.id === Number(selectedEmployee))?.empType}</p>
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