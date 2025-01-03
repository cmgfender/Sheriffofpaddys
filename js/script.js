document.addEventListener('DOMContentLoaded', () => {
  const hour = new Date().getHours();
  const month = new Date().getMonth() + 1; // JavaScript months are 0-based
  const day = new Date().getDate();
  const welcomeMessage = document.getElementById('welcome-message');
  const effectsContainer = document.getElementById('effects-container');

  let season = '';
  let timeOfDay = '';
  let holiday = '';

  // Determine the season
  if (month >= 3 && month <= 5) {
    season = 'spring';
  } else if (month >= 6 && month <= 8) {
    season = 'summer';
  } else if (month >= 9 && month <= 11) {
    season = 'fall';
  } else {
    season = 'winter';
  }

  // Expanded time greetings
  if (hour >= 6 && hour < 9) {
    timeOfDay = 'early morning';
  } else if (hour >= 9 && hour < 12) {
    timeOfDay = 'morning';
  } else if (hour >= 12 && hour < 14) {
    timeOfDay = 'lunch time';
  } else if (hour >= 14 && hour < 17) {
    timeOfDay = 'afternoon';
  } else if (hour >= 17 && hour < 20) {
    timeOfDay = 'happy hour';
  } else if (hour >= 20 && hour < 23) {
    timeOfDay = 'evening';
  } else if (hour >= 23 || hour < 2) {
    timeOfDay = 'late night';
  } else if (hour >= 2 && hour < 6) {
    timeOfDay = 'night owl';
  }

  // Determine holiday (extended time windows for major holidays)
  if ((month === 12 && day >= 1) || (month === 1 && day <= 6)) {
    holiday = 'christmas';
  } else if (month === 10 && day >= 1) {
    holiday = 'halloween';
  } else if (month === 11 && day >= 22 && day <= 28) {
    holiday = 'thanksgiving';
  } else if (month === 2 && day === 14) {
    holiday = 'valentines';
  } else if (month === 3 && day === 17) {
    holiday = 'stpatricks';
  } else if (month === 7 && day === 4) {
    holiday = 'independence';
  }

  // Holiday messages
  const holidayMessages = {
    christmas: 'Merry Christmas! Enjoy the festive season filled with joy and warmth.',
    halloween: 'Happy Halloween! Watch out for ghosts and goblins tonight!',
    thanksgiving: 'Happy Thanksgiving! Celebrate with gratitude and good food.',
    valentines: 'Happy Valentine’s Day! Spread love and kindness.',
    stpatricks: 'Happy St. Patrick’s Day! May the luck of the Irish be with you.',
    independence: 'Happy Independence Day! Celebrate freedom and fireworks!'
  };

  // Time-based greetings
  const timeMessages = {
    'early morning': 'Good early morning! Rise and shine!',
    morning: 'Good morning! A fresh start to your day.',
    'lunch time': 'It’s lunch time! Grab something delicious.',
    afternoon: 'Good afternoon! Keep up the great work.',
    'happy hour': 'Happy hour! Time to unwind and relax.',
    evening: 'Good evening! Enjoy a peaceful night.',
    'late night': 'It’s late night. Hope you’re feeling creative!',
    'night owl': 'Hello, night owl! Burning the midnight oil?'
  };

  // Seasonal messages
  const seasonalMessages = {
    spring: 'Spring is in the air! Enjoy the blooming flowers and fresh breeze.',
    summer: 'Summer is here! Soak up the sun and enjoy the warmth.',
    fall: 'Autumn leaves are falling. Cozy up and enjoy the crisp air.',
    winter: 'Winter has arrived. Stay warm and enjoy the festive spirit.'
  };

  // Set the message
  let message = holiday
    ? holidayMessages[holiday]
    : `${timeMessages[timeOfDay]} ${seasonalMessages[season]}`;
  welcomeMessage.textContent = message;

  // Effects
  if (holiday) {
    addHolidayEffects(holiday);
  } else {
    addSeasonalEffects(season);
  }

  function addSeasonalEffects(season) {
    if (season === 'winter') {
      createEffects('snowflake', 50);
    } else if (season === 'fall') {
      createEffects('leaf', 30);
    } else if (season === 'summer') {
      createEffects('light-flare', 20);
    }
  }

  function addHolidayEffects(holiday) {
    if (holiday === 'christmas') {
      createEffects('snowflake', 70);
    } else if (holiday === 'halloween') {
      createEffects('bat', 15);
    } else if (holiday === 'valentines') {
      createEffects('heart', 40);
    } else if (holiday === 'independence') {
      createEffects('firework', 20);
    }
  }

  function createEffects(effectClass, count) {
    for (let i = 0; i < count; i++) {
      const effect = document.createElement('div');
      effect.className = `effect ${effectClass}`;
      effect.style.left = `${Math.random() * 100}%`;
      effect.style.animationDuration = `${Math.random() * 3 + 2}s`;
      effectsContainer.appendChild(effect);
    }
  }

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