import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import useSchedule from '../hooks/useSchedules';
import useEmployees from '../hooks/useEmployees';
import { ISchedule } from '../types/types';
import { Toaster } from 'react-hot-toast';

const localizer = momentLocalizer(moment);

const Schedule: React.FC = () => {
  const { schedules, isLoading } = useSchedule();
  const { employees } = useEmployees();
  const [events, setEvents] = useState<Event[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');

  useEffect(() => {
    if (!isLoading) {
      const formattedEvents = schedules.map((schedule: ISchedule) => ({
        title: schedule.employeeId.toString(),
        start: new Date(schedule.startTime),
        end: new Date(schedule.endTime),
        id: schedule.id,
      }));
      console.log(schedules)
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
    console.log(`Selected employee: ${selectedEmployee}`);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    console.log(`Selected slot: Start - ${moment(slotInfo.start).format('HH:mm')}, End - ${moment(slotInfo.end).format('HH:mm')}, Selected date: ${moment(slotInfo.start).format('YYYY-MM-DD')}`);
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
    </div>
  );
};

export default Schedule;
