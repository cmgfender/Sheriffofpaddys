document.addEventListener('DOMContentLoaded', () => {
  const hour = new Date().getHours();
  const month = new Date().getMonth();
  const body = document.body;

  let season = '';
  if (month >= 2 && month <= 4) {
    season = 'spring';
  } else if (month >= 5 && month <= 7) {
    season = 'summer';
  } else if (month >= 8 && month <= 10) {
    season = 'fall';
  } else {
    season = 'winter';
  }

  let timeClass = '';
  if (hour >= 6 && hour < 12) {
    timeClass = 'morning';
  } else if (hour >= 12 && hour < 18) {
    timeClass = 'afternoon';
  } else {
    timeClass = 'evening';
  }

  body.classList.add(`${season}-${timeClass}`);
});