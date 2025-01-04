/*****************************************************
 * MAIN ENTRY
 *****************************************************/
/*
  Using DOMContentLoaded + defer ensures the HTML is parsed
  before this script runs. That way, getElementById calls
  will actually find the elements.
*/
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded, starting setup...");

  let holiday = null;
  let timeOfDay = null;
  let season = null;

  // Attempt to get date/time info with a fallback
  try {
    holiday = checkHoliday();
    timeOfDay = checkTimeOfDay();
    season = checkSeason();
  } catch (err) {
    console.warn("Error determining holiday/time/season:", err);
  }

  // Apply backgrounds & messages by priority
  applyTheme(holiday, timeOfDay, season);

  // Generate special falling effects
  createFallingEffects(holiday, season);

  // Set up the login
  setupLogin();

  console.log("All scripts initialized successfully.");
});

/*****************************************************
 * CHECK HOLIDAYS
 * Returns a string like "christmas", "halloween", or null.
 * If date is invalid, returns null to fallback safely.
 *****************************************************/
function checkHoliday() {
  const now = new Date();

  // If now is invalid, fallback
  if (isNaN(now.getTime())) {
    console.warn("Date object is invalid, no holiday can be determined.");
    return null;
  }

  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();       // 1-31

  if (month === 1 && day === 1) return "newyear";
  if (month === 2 && day === 14) return "valentines";
  if (month === 3 && day === 17) return "stpatricks";
  // Easter example date: April 9
  if (month === 4 && day === 9) return "easter";
  if (month === 7 && day === 4) return "july4";
  if (month === 10 && day === 31) return "halloween";
  // Approx Thanksgiving: Nov 24
  if (month === 11 && day === 24) return "thanksgiving";
  if (month === 12 && day === 25) return "christmas";

  return null; // No recognized holiday
}

/*****************************************************
 * CHECK TIME OF DAY
 * Return strings like "morning", "midday", "afternoon", 
 * "evening", "night", or "lateNight". If no time is available,
 * return null for fallback.
 *****************************************************/
function checkTimeOfDay() {
  const now = new Date();
  if (isNaN(now.getTime())) {
    console.warn("Invalid date/time, cannot determine timeOfDay.");
    return null;
  }

  const hour = now.getHours();
  console.log("Current hour:", hour);

  if (hour >= 6 && hour < 11) return "morning";
  if (hour >= 11 && hour < 14) return "midday";
  if (hour >= 14 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 22) return "evening";
  if (hour >= 22 || hour < 2)  return "night";
  return "lateNight";
}

/*****************************************************
 * CHECK SEASON
 * Return "spring", "summer", "fall", "winter" or null if
 * date/time is invalid.
 *****************************************************/
function checkSeason() {
  const now = new Date();
  if (isNaN(now.getTime())) {
    console.warn("Invalid date, cannot determine season.");
    return null;
  }

  const month = now.getMonth() + 1;
  console.log("Current month:", month);

  if (month >= 3 && month < 6) return "spring";
  if (month >= 6 && month < 9) return "summer";
  if (month >= 9 && month < 12) return "fall";
  return "winter";
}

/*****************************************************
 * APPLY THEME (BACKGROUND & MESSAGE)
 *****************************************************/
function applyTheme(holiday, timeOfDay, season) {
  console.log("Applying theme with holiday:", holiday, "timeOfDay:", timeOfDay, "season:", season);

  const body = document.body;
  const welcomeMsgEl = document.getElementById("welcome-message");
  if (!welcomeMsgEl) {
    console.warn("No element #welcome-message found, cannot set text!");
    return;
  }

  // FALLBACK GREETING (if everything else fails)
  let finalMessage = "Hello! We hope you're having a wonderful day.";

  /***********************************************
   * PRIORITY 1: HOLIDAY
   ***********************************************/
  if (holiday) {
    switch (holiday) {
      case "newyear":
        body.classList.add("body-newyear");
        finalMessage = "Happy New Year! Wishing you the best ahead!";
        break;
      case "valentines":
        body.classList.add("body-valentines");
        finalMessage = "Happy Valentine’s Day! Spread the love!";
        break;
      case "stpatricks":
        body.classList.add("body-stpatricks");
        finalMessage = "Happy St. Patrick’s Day! Luck be with you!";
        break;
      case "easter":
        body.classList.add("body-easter");
        finalMessage = "Happy Easter! Enjoy the spring festivities!";
        break;
      case "july4":
        body.classList.add("body-july4");
        finalMessage = "Happy Fourth of July! Celebrate your freedom!";
        break;
      case "halloween":
        body.classList.add("body-halloween");
        finalMessage = "Happy Halloween! Spooky times ahead!";
        break;
      case "thanksgiving":
        body.classList.add("body-thanksgiving");
        finalMessage = "Happy Thanksgiving! Enjoy the feast!";
        break;
      case "christmas":
        body.classList.add("body-christmas");
        finalMessage = "Merry Christmas! Enjoy the festive season!";
        break;
    }

    // Since holiday has the highest priority, we set final message & STOP
    welcomeMsgEl.textContent = finalMessage;
    return;
  }

  /***********************************************
   * PRIORITY 2: TIME OF DAY
   ***********************************************/
  // Only if there's no holiday or holiday is null
  if (timeOfDay) {
    switch (timeOfDay) {
      case "morning":
        finalMessage = "Good Morning! Rise and shine!";
        break;
      case "midday":
        finalMessage = "Good Midday! Keep the momentum going!";
        break;
      case "afternoon":
        finalMessage = "Good Afternoon! Keep up the great work.";
        break;
      case "evening":
        finalMessage = "Good Evening! Time to relax and unwind.";
        break;
      case "night":
        finalMessage = "Good Night! Rest well and recharge.";
        break;
      case "lateNight":
        finalMessage = "It's really late! Don’t forget to get some rest.";
        break;
      default:
        // If we get something unexpected, use fallback
        finalMessage = "Hello! We hope you're having a great day.";
    }
  }
  // Keep finalMessage for now, because we still want to set a seasonal background after.

  /***********************************************
   * PRIORITY 3: SEASON
   ***********************************************/
  if (season === "spring") {
    body.classList.add("body-spring");
  } else if (season === "summer") {
    body.classList.add("body-summer");
  } else if (season === "fall") {
    body.classList.add("body-fall");
  } else if (season === "winter") {
    body.classList.add("body-winter");
  }
  // If season is null or something unexpected, we leave the default background.

  welcomeMsgEl.textContent = finalMessage;
}

/*****************************************************
 * CREATE FALLING EFFECTS
 *****************************************************/
function createFallingEffects(holiday, season) {
  // Simple logic: if we recognized a holiday or season, we run certain effects
  if (holiday === "christmas" || season === "winter") {
    startFallingEffect("snowflake", "❄", 800);
  } else if (holiday === "halloween") {
    startFallingEffect("bat", "🦇", 1000);
  } else if (holiday === "newyear" || holiday === "july4") {
    startFallingEffect("confetti", "★", 300);
  }
}

/**
 * Repeatedly spawns a falling object at the specified interval.
 * @param {string} effectClass - e.g. 'snowflake', 'bat', 'confetti'
 * @param {string} symbol - e.g. '❄', '🦇', '★'
 * @param {number} intervalMs - e.g. 800 (ms)
 */
function startFallingEffect(effectClass, symbol, intervalMs) {
  console.log(`Starting effect ${effectClass} every ${intervalMs}ms`);

  const container = document.getElementById("falling-effects-container");
  if (!container) {
    console.warn("No #falling-effects-container found, cannot create effects.");
    return;
  }

  const creationInterval = setInterval(() => {
    const el = document.createElement("div");
    el.classList.add("falling-object", effectClass);
    el.textContent = symbol;

    // If confetti, randomize color
    if (effectClass === "confetti") {
      const colors = ["#f44336", "#e91e63", "#9c27b0", "#2196f3", "#4caf50", "#ffeb3b", "#ff9800"];
      el.style.color = colors[Math.floor(Math.random() * colors.length)];
    }

    // Random horizontal start
    el.style.left = Math.random() * 100 + "vw";

    // Random fall duration: 5-10s
    const fallDuration = 5 + Math.random() * 5;
    el.style.animationDuration = fallDuration + "s";

    // Optional side-to-side sway
    if (Math.random() > 0.5) {
      el.style.animationName = "fall, sway";
    }

    // Remove when animation ends
    el.addEventListener("animationend", () => {
      el.remove();
    });

    container.appendChild(el);
  }, intervalMs);

  // Stop after 30 seconds if you like:
  // setTimeout(() => clearInterval(creationInterval), 30000);
}

/*****************************************************
 * LOGIN HANDLER
 *****************************************************/
function setupLogin() {
  console.log("Setting up login...");

  const loginForm = document.getElementById("loginForm");
  if (!loginForm) {
    console.warn("No loginForm found, skipping login setup.");
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
    if (password === "Glassmire") {
      // Change this to your actual tools page URL
      window.location.href = "https://your-tools-page.example.com";
    } else {
      alert("Incorrect password. Please try again.");
    }
  });
}