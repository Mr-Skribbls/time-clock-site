import iTimeCard from '../interfaces/iTimeCards';
import time from './time';

/// ----- round ----- ///
test('rounds to the given decimal place', () => {
  const num = 123.4567890;
  expect(time.round(num, 0)).toBe(123);
  expect(time.round(num, 1)).toBe(123.5);
  expect(time.round(num, 3)).toBe(123.457);
  expect(time.round(num, 7)).toBe(123.456789);
  expect(time.round(num, 8)).toBe(123.456789);
});

test('round smaller digits', () => {
  expect(time.round(11.1111, 2)).toBe(11.11);
  expect(time.round(44.4444, 3)).toBe(44.444);
});

test('round large digits up', () => {
  expect(time.round(55.5555, 2)).toBe(55.56);
  expect(time.round(99.9999, 2)).toBe(100);
});


/// ----- convertMsTo ----- ///
test('converts ms to seconds', () => {
  expect(time.convertMsTo.seconds(1000)).toBe(1);
});

test('converts ms to minutes', () => {
  expect(time.convertMsTo.minutes(60000)).toBe(1);
});


test('converts ms to hours', () => {
  expect(time.convertMsTo.hours(3600000)).toBe(1);
});


/// ----- gonvertToMs ----- ///
test('converts seconds to ms', () => {
  expect(time.convertToMs.seconds(1)).toBe(1000);
});

test('converts minutes to ms', () => {
  expect(time.convertToMs.minutes(1)).toBe(60000);
});

test('converts hours to ms', () => {
  expect(time.convertToMs.hours(1)).toBe(3600000);
});


/// ----- getWorkingHours ----- ///
test('gets correct hours with accumulated time', () => {
  const timeCard: iTimeCard = {
    _id: '1',
    date: new Date(),
    project_id: '2',
    notes: 'notes',
    accumulated_time: 5.67,
    time_punch: null
  };

  expect(time.getWorkingHours(timeCard)).toBe(5.67);
});

test('gets correct hours with time punch', () => {
  const date = new Date();
  date.setHours(date.getHours() - 1)
  const timeCard: iTimeCard = {
    _id: '1',
    date: new Date(),
    project_id: '2',
    notes: 'notes',
    accumulated_time: 0,
    time_punch: date,
  };
  expect(time.getWorkingHours(timeCard)).toBe(1);
});

test('gets correct hours when timecard has not time', () => {
  const timeCard: iTimeCard = {
    _id: '1',
    date: new Date(),
    project_id: '2',
    notes: 'notes',
    accumulated_time: 0,
    time_punch: null,
  };
  expect(time.getWorkingHours(timeCard)).toBe(0);
});

test('gets correct hours when timecard has both accumulated time and time punch', () => {
  const date = new Date();
  date.setHours(date.getHours() - 1)
  const timeCard: iTimeCard = {
    _id: '1',
    date: new Date(),
    project_id: '2',
    notes: 'notes',
    accumulated_time: 1,
    time_punch: date,
  };
  expect(time.getWorkingHours(timeCard)).toBe(2);
});