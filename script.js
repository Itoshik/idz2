document.getElementById('calculate').addEventListener('click', function () {
  const startDateInput = document.getElementById('start-date').value;
  const durationInput = parseInt(document.getElementById('duration').value, 10);
  const endDateInput = document.getElementById('end-date').value;
  const holidaysInput = document.getElementById('holidays').value;

  const holidays = holidaysInput
    .split(',')
    .map(date => date.trim())
    .filter(date => !isNaN(new Date(date)));

  const warning = document.getElementById('warning');
  const result = document.getElementById('result');
  warning.textContent = '';
  result.textContent = '';

  if (!startDateInput && !endDateInput && isNaN(durationInput)) {
    warning.textContent = 'Заповніть хоча б два параметри!';
    return;
  }

  const startDate = startDateInput ? new Date(startDateInput) : null;
  const endDate = endDateInput ? new Date(endDateInput) : null;

  if (startDate && !isNaN(durationInput)) {
    const calculatedEndDate = calculateEndDate(startDate, durationInput, holidays);
    const dateOut = new Date(calculatedEndDate);
    dateOut.setDate(dateOut.getDate() + 1); // Дата виходу на роботу
    result.textContent = `Дата кінця відпустки: ${calculatedEndDate.toISOString().split('T')[0]}\nДата виходу: ${dateOut.toISOString().split('T')[0]}`;
    checkWeekend(startDate, warning);
    checkWeekend(calculatedEndDate, warning);
  } else if (startDate && endDate) {
    const duration = calculateDuration(startDate, endDate, holidays);
    result.textContent = `Тривалість відпустки: ${duration} днів.`;
    checkWeekend(startDate, warning);
    checkWeekend(endDate, warning);
  } else if (endDate && !isNaN(durationInput)) {
    const calculatedStartDate = calculateStartDate(endDate, durationInput, holidays);
    const dateOut = new Date(endDate);
    dateOut.setDate(dateOut.getDate() + 1); // Дата виходу на роботу
    result.textContent = `Дата початку відпустки: ${calculatedStartDate.toISOString().split('T')[0]}\nДата виходу: ${dateOut.toISOString().split('T')[0]}`;
    checkWeekend(calculatedStartDate, warning);
    checkWeekend(endDate, warning);
  }
});

function calculateDuration(startDate, endDate, holidays) {
  let count = 0;
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    if (!isHoliday(d, holidays)) count++;
  }
  return count;
}


function calculateEndDate(startDate, duration, holidays) {
  let current = new Date(startDate);
  let remainingDays = duration;

  while (remainingDays > 1) { // Перший день уже враховано
    current.setDate(current.getDate() + 1);
    if (!isHoliday(current, holidays)) {
      remainingDays--;
    }
  }

  return current;
}

function calculateStartDate(endDate, duration, holidays) {
  let current = new Date(endDate);
  while (duration > 0) {
    if (!isHoliday(current, holidays)) duration--;
    current.setDate(current.getDate() - 1);
  }
  return current;
}

function isHoliday(date, holidays) {
  const dateString = date.toISOString().split('T')[0];
  return holidays.includes(dateString);
}

function checkWeekend(date, warning) {
  const day = date.getDay();
  if (day === 0) {
    warning.textContent += '\nДата попадає на неділю!';
  }
}
