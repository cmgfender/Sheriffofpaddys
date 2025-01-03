document.addEventListener('DOMContentLoaded', () => {
  const hour = new Date().getHours();
  const month = new Date().getMonth();
  const welcomeMessage = document.getElementById('welcome-message');

  let season = '';
  let timeOfDay = '';

  // Determine the season
  if (month >= 2 && month <= 4) {
    season = 'spring';
  } else if (month >= 5 && month <= 7) {
    season = 'summer';
  } else if (month >= 8 && month <= 10) {
    season = 'fall';
  } else {
    season = 'winter';
  }

  // Determine the time of day
  if (hour >= 6 && hour < 12) {
    timeOfDay = 'morning';
  } else if (hour >= 12 && hour < 18) {
    timeOfDay = 'afternoon';
  } else {
    timeOfDay = 'evening';
  }

  // Update background class
  document.body.classList.add(`${season}-${timeOfDay}`);

  // Generate a seasonal welcome message
  const messages = {
    spring: {
      morning: 'Good morning! The blossoms are blooming this spring.',
      afternoon: 'Enjoy the fresh spring air this afternoon!',
      evening: 'Relax and unwind this beautiful spring evening.'
    },
    summer: {
      morning: 'Good morning! Time for some summer sunshine.',
      afternoon: 'Stay cool in the summer heat this afternoon!',
      evening: 'Watch the stars on this warm summer evening.'
    },
    fall: {
      morning: 'Good morning! Crisp autumn leaves await.',
      afternoon: 'Enjoy the golden hues of fall this afternoon.',
      evening: 'Settle in for a cozy fall evening.'
    },
    winter: {
      morning: 'Good morning! Stay warm this chilly winter day.',
      afternoon: 'Keep cozy this frosty winter afternoon.',
      evening: 'Relax by the fire this cold winter evening.'
    }
  };

  welcomeMessage.textContent = messages[season][timeOfDay];

  // Handle login form
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    if (password === 'Glassmire') {
      window.location.href = '/tools';
    } else {
      alert('Incorrect password. Please try again.');
    }
  });
});