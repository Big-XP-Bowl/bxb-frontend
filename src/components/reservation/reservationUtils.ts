import { formatInTimeZone } from 'date-fns-tz';

export const parseTime = (dateTime: Date, timeZone = 'Europe/Copenhagen'): string => {
  const formattedDate = formatInTimeZone(dateTime, timeZone, 'dd/MM/yyyy');
  const formattedTime = formatInTimeZone(dateTime, timeZone, 'HH:mm');
  return `${formattedDate} kl. ${formattedTime}`;
};