document.addEventListener('DOMContentLoaded', () => {
  const month = new Date().getMonth() + 1; // JavaScript months are 0-based
  const day = new Date().getDate();
  const effectsContainer = document.getElementById('effects-container');
  let season = '';
  let holiday = '';

  // Determine season or holiday
  if ((month === 12 && day >= 1) || (month === 1 && day <= 6)) {
    holiday = 'christmas';
  } else if (month === 10) {
    holiday = 'halloween';
  } else if (month >= 11 || (month === 12 && day < 1)) {
    season = 'winter';
  } else if (month >= 9 && month <= 10) {
    season = 'fall';
  } else if (month >= 6 && month <= 8) {
    season = 'summer';
  } else {
    season = 'spring';
  }

  // Apply seasonal or holiday-specific effects
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
    }
  }

  function createEffects(effectClass, count) {
    for (let i = 0; i < count; i++) {
      const effect = document.createElement('div');
      effect.className = `effect ${effectClass}`;
      effect.style.left = `${Math.random() * 100}%`;
      effect.style.animationDuration = `${Math.random() * 5 + 5}s`;
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