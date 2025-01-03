/*****************************************************
 * MAIN ENTRY
 *****************************************************/
window.addEventListener("DOMContentLoaded", () => {
  // Log for debugging
  console.log("DOM fully loaded. About to run welcome page logic.");

  const holiday = checkHoliday();
  const timeOfDay = checkTimeOfDay();
  const season = checkSeason();

  // Apply backgrounds & messages by priority
  applyTheme(holiday, timeOfDay, season);

  // Generate special falling effects
  createFallingEffects(holiday, season);

  // Set up the login
  setupLogin();

  console.log("Script finished initializing.");
});

/*****************************************************
 * CHECK HOLIDAYS
 *****************************************************/
function checkHoliday() {
  const today = new Date();
  const month = today.getMonth() + 1; // 1-12
  const day = today.getDate();       // 1-31

  // New Year: Jan 1
  if (month === 1 && day === 1) return "newyear";

  // Valentine’s Day: Feb 14
  if (month === 2 && day === 14) return "valentines";

  // St. Patrick's Day: Mar 17
  if (month === 3 && day === 17) return "stpatricks";

  // Easter (example date: April 9)
  if (month === 4 && day === 9) return "easter";

  // Fourth of July: Jul 4
  if (month === 7 && day === 4) return "july4";

  // Halloween: Oct 31
  if (month === 10 && day === 31) return "halloween";

  // Thanksgiving (approx): Nov 24
  if (month === 11 && day === 24) return "thanksgiving";

  // Christmas: Dec 25
  if (month === 12 && day === 25) return "christmas";

  return null; // no holiday
}

/*****************************************************
 * CHECK TIME OF DAY
 *****************************************************/
function checkTimeOfDay() {
  const hour = new Date().getHours();
  console.log("Current hour:", hour); // for debugging

  if (hour >= 6 && hour < 11) {
    return "morning";
  } else if (hour >= 11 && hour < 14) {
    return "midday";
  } else if (hour >= 14 && hour < 18) {
    return "afternoon";
  } else if (hour >= 18 && hour < 22) {
    return "evening";
  } else if (hour >= 22 || hour < 2) {
    return "night";
  } else {
    return "lateNight";
  }
}

/*****************************************************
 * CHECK SEASON
 *****************************************************/
function checkSeason() {
  const month = new Date().getMonth() + 1;
  console.log("Current month:", month); // for debugging

  if (month >= 3 && month < 6) {
    return "spring";
  } else if (month >= 6 && month < 9) {
    return "summer";
  } else if (month >= 9 && month < 12) {
    return "fall";
  } else {
    return "winter";
  }
}

/*****************************************************
 * APPLY THEME (BACKGROUND & MESSAGE)
 *****************************************************/
function applyTheme(holiday, timeOfDay, season) {
  const body = document.body;
  const welcomeMessage = document.getElementById("welcome-message");

  // If element is missing, bail out
  if (!welcomeMessage) {
    console.warn("No element with ID 'welcome-message' found.");
    return;
  }

  // Priority 1: HOLIDAY
  if (holiday) {
    switch (holiday) {
      case "newyear":
        body.classList.add("body-newyear");
        welcomeMessage.textContent = "Happy New Year! Wishing you the best ahead!";
        return;
      case "valentines":
        body.classList.add("body-valentines");
        welcomeMessage.textContent = "Happy Valentine’s Day! Spread the love!";
        return;
      case "stpatricks":
        body.classList.add("body-stpatricks");
        welcomeMessage.textContent = "Happy St. Patrick’s Day! Luck be with you!";
        return;
      case "easter":
        body.classList.add("body-easter");
        welcomeMessage.textContent = "Happy Easter! Enjoy the spring festivities!";
        return;
      case "july4":
        body.classList.add("body-july4");
        welcomeMessage.textContent = "Happy Fourth of July! Celebrate your freedom!";
        return;
      case "halloween":
        body.classList.add("body-halloween");
        welcomeMessage.textContent = "Happy Halloween! Spooky times ahead!";
        return;
      case "thanksgiving":
        body.classList.add("body-thanksgiving");
        welcomeMessage.textContent = "Happy Thanksgiving! Enjoy the feast!";
        return;
      case "christmas":
        body.classList.add("body-christmas");
        welcomeMessage.textContent = "Merry Christmas! Enjoy the festive season!";
        return;
    }
  }

  // Priority 2: TIME OF DAY
  let messageByTime = "";
  switch (timeOfDay) {
    case "morning":
      messageByTime = "Good Morning! Rise and shine!";
      break;
    case "midday":
      messageByTime = "Good Midday! Keep the momentum going!";
      break;
    case "afternoon":
      messageByTime = "Good Afternoon! Keep up the great work.";
      break;
    case "evening":
      messageByTime = "Good Evening! Time to relax and unwind.";
      break;
    case "night":
      messageByTime = "Good Night! Rest well and recharge.";
      break;
    default:
      // lateNight
      messageByTime = "It's really late! Don’t forget to get some rest.";
  }

  welcomeMessage.textContent = messageByTime;

  // Priority 3: SEASON
  switch (season) {
    case "spring":
      body.classList.add("body-spring");
      break;
    case "summer":
      body.classList.add("body-summer");
      break;
    case "fall":
      body.classList.add("body-fall");
      break;
    default:
      body.classList.add("body-winter");
  }
}

/*****************************************************
 * CREATE FALLING EFFECTS
 *****************************************************/
function createFallingEffects(holiday, season) {
  if (holiday === "christmas" || season === "winter") {
    // Snowflakes
    startFallingEffect("snowflake", "❄", 800);
  } else if (holiday === "halloween") {
    // Bats
    startFallingEffect("bat", "🦇", 1000);
  } else if (holiday === "newyear" || holiday === "july4") {
    // Confetti
    startFallingEffect("confetti", "★", 300);
  }
}

function startFallingEffect(effectClass, symbol, interval) {
  console.log(`Starting falling effect: ${effectClass} at interval ${interval}ms`);

  const creationInterval = setInterval(() => {
    const effectEl = document.createElement("div");
    effectEl.classList.add("falling-object", effectClass);
    effectEl.innerText = symbol;

    // Randomize color for confetti
    if (effectClass === "confetti") {
      const colors = ["#f44336", "#e91e63", "#9c27b0", "#2196f3", "#4caf50", "#ffeb3b", "#ff9800"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      effectEl.style.color = randomColor;
    }

    // Random horizontal start
    effectEl.style.left = Math.random() * 100 + "vw";

    // Random fall duration between 5-10s
    const fallDuration = 5 + Math.random() * 5;
    effectEl.style.animationDuration = fallDuration + "s";

    // Optional sway
    if (Math.random() > 0.5) {
      effectEl.style.animationName = "fall, sway";
    }

    // Remove element when animation ends
    effectEl.addEventListener("animationend", () => {
      effectEl.remove();
    });

    document.getElementById("falling-effects-container").appendChild(effectEl);
  }, interval);

  // Stop after 30s if desired
  // setTimeout(() => clearInterval(creationInterval), 30000);
}

/*****************************************************
 * LOGIN HANDLER
 *****************************************************/
function setupLogin() {
  console.log("Setting up login handler.");
  
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) {
    console.warn("No loginForm found in DOM.");
    return;
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const passwordInput = document.getElementById("passwordInput");
    if (!passwordInput) {
      alert("No password input found, cannot proceed.");
      return;
    }

    const password = passwordInput.value.trim();

    // Validate password
    if (password === "Glassmire") {
      // Replace with your actual tools page
      window.location.href = "https://your-tools-page.example.com";
    } else {
      alert("Incorrect password. Please try again.");
    }
  });
}