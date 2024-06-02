import { formatInTimeZone } from 'date-fns-tz';
import { IReservation } from '../../types/types';


export const parseTime = (dateTime: Date, timeZone = 'Europe/Copenhagen'): string => {
  const formattedDate = formatInTimeZone(dateTime, timeZone, 'dd/MM/yyyy');
  const formattedTime = formatInTimeZone(dateTime, timeZone, 'HH:mm');
  return `${formattedDate} kl. ${formattedTime}`;
};

export const validateReservationForm = (formData: Partial<IReservation>): string[] => {
  const errors = [];

  if (!formData.customerName) {
    errors.push('Kunde Navn er påkrævet');
  }

  if (!formData.customerPhone) {
    errors.push('Telefonnummer er påkrævet');
  } else if (!/^\d{8}$/.test(formData.customerPhone)) {
    errors.push('Telefonnummer skal være 8 cifre langt');
  }

  if (!formData.startTime) {
    errors.push('Start Tid er påkrævet');
  } else if (isNaN(new Date(formData.startTime).getTime())) {
    errors.push('Start Tid skal være en gyldig dato og tid');
  }

  if (!formData.partySize) {
    errors.push('Antal Deltagere er påkrævet');
  } else if (isNaN(formData.partySize) || formData.partySize <= 0) {
    errors.push('Antal Deltagere skal være et positivt tal');
  }

  if (!formData.activityId) {
    errors.push('Aktivitet er påkrævet');
  }

  return errors;
};