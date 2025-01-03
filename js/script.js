document.addEventListener('DOMContentLoaded', () => {
  const hour = new Date().getHours();
  const month = new Date().getMonth() + 1; // JavaScript months are 0-based
  const day = new Date().getDate();
  const welcomeMessage = document.getElementById('welcome-message');
  const effectsContainer = document.getElementById('effects-container');

  let season = '';
  let timeOfDay = '';
  let holiday = '';

  // Determine the season with finer granularity
  if ((month === 2 && day >= 15) || (month === 3 && day <= 20)) {
    season = 'late-winter';
  } else if ((month === 3 && day >= 21) || (month === 4 && day <= 10)) {
    season = 'early-spring';
  } else if (month >= 4 && month <= 5) {
    season = 'spring';
  } else if (month === 6 || (month === 7 && day <= 15)) {
    season = 'summer';
  } else if (month === 7 || (month === 8 && day <= 15)) {
    season = 'late-summer';
  } else if (month === 9 || (month === 10 && day <= 20)) {
    season = 'fall';
  } else if (month === 10 || (month === 11 && day <= 10)) {
    season = 'late-fall';
  } else if (month === 11 || (month === 12 && day <= 15)) {
    season = 'early-winter';
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
    'late-winter': 'Winter is ending. Stay warm as spring approaches.',
    'early-spring': 'Spring is awakening! The air is fresh with possibility.',
    spring: 'Spring is in full bloom. Enjoy the vibrant colors and energy.',
    summer: 'Summer is here! Time for sunshine and relaxation.',
    'late-summer': 'Late summer days are perfect for golden sunsets.',
    fall: 'The leaves are turning. Enjoy the crisp autumn air.',
    'late-fall': 'The final days of fall are cozy and colorful.',
    'early-winter': 'Winter is creeping in. Stay warm and enjoy the chill.',
    winter: 'Winter has arrived. Cozy up and enjoy the festive spirit.'
  };

  // Set the message (priority: holiday > time > season)
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
    if (season === 'winter' || season === 'late-winter' || season === 'early-winter') {
      createEffects('snowflake', 50);
    } else if (season.includes('fall')) {
      createEffects('leaf', 30);
    } else if (season.includes('summer')) {
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